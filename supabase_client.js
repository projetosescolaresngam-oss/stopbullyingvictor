// ================================================================
// PROJETO STOPBULLYING — CLIENTE SUPABASE & SINCRONIZAÇÃO OFFLINE
// EEMTI Nazaré Guerra — Ceará Científico 2026
// Autores: Gabriel Xavier & Carla Vitória | Orientador: Prof. Antonio Victor
// ================================================================

window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
  url: 'https://lbqfnqrgbbxounjxxikr.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicWZucXJnYmJ4b3Vuanh4aWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTU4OTUsImV4cCI6MjEwMTg5MTg5NX0.qVDtAJ-0uhSQT-H_DPIoL6Z2vrpRr_Zm90TOMZo80x0'
};

class SupabaseService {
  constructor() {
    this.config = window.SUPABASE_CONFIG;
    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[Supabase] Conexão restabelecida. Sincronizando pendentes...');
      this.sincronizarPendentes();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('[Supabase] Dispositivo offline. Ativando modo local.');
    });
  }

  // --- HELPER HTTP REST COM TIMEOUT ---
  async _fetchSupabase(endpoint, method = 'GET', body = null) {
    if (!this.config.url || this.config.url.includes('sua-url-supabase')) {
      throw new Error('Supabase não configurado (usando modo offline).');
    }

    const headers = {
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${this.config.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    options.signal = controller.signal;

    try {
      const response = await fetch(`${this.config.url}/rest/v1/${endpoint}`, options);
      clearTimeout(timeoutId);
      if (!response.ok) {
        let errBody = '';
        try { errBody = await response.text(); } catch (e) {}
        throw new Error(`HTTP ${response.status}: ${errBody || response.statusText}`);
      }
      // Se não tiver conteúdo (ex: 204 No Content), retorna array vazio
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // --- TESTE DE CONECTIVIDADE COM SUPABASE ---
  async testarConexao() {
    const inicio = Date.now();
    try {
      await this._fetchSupabase('denuncias?select=id&limit=1', 'GET');
      const latencia = Date.now() - inicio;
      return { online: true, status: 'Conectado ao Supabase', latenciaMs: latencia };
    } catch (e) {
      return { online: false, status: e.message || 'Offline / Local', latenciaMs: 0 };
    }
  }

  // ================================================================
  // 1. DENÚNCIAS ANÔNIMAS
  // ================================================================

  async enviarDenuncia(denunciaData) {
    this.registrarLog('ENVIAR_DENUNCIA_TENTATIVA', `Protocolo: ${denunciaData.protocolo}`);
    try {
      if (this.isOnline) {
        const res = await this._fetchSupabase('denuncias', 'POST', denunciaData);
        this.registrarLog('ENVIAR_DENUNCIA_SUCESSO', `Protocolo: ${denunciaData.protocolo}`);
        return { sucesso: true, protocolo: denunciaData.protocolo, modo: 'online', dados: res };
      }
    } catch (e) {
      console.warn('[Supabase] Falha ao enviar online. Salvando localmente:', e.message);
    }

    // Salvar localmente no LocalStorage (fallback offline)
    this._salvarLocal('stopbullying_pendentes_denuncias', denunciaData);
    this._salvarLocal('stopbullying_historico_denuncias', denunciaData);
    this.registrarLog('ENVIAR_DENUNCIA_OFFLINE', `Protocolo: ${denunciaData.protocolo}`);
    return { sucesso: true, protocolo: denunciaData.protocolo, modo: 'offline' };
  }

  async listarDenuncias() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('denuncias?select=*&order=data_envio.desc', 'GET');
        if (dados && Array.isArray(dados)) {
          // Atualiza cache local
          localStorage.setItem('stopbullying_cache_denuncias', JSON.stringify(dados));
          return dados;
        }
      }
    } catch (e) {
      console.warn('[Supabase] Falha ao listar denúncias online. Buscando histórico local:', e.message);
    }

    // Fallback: tentar cache ou histórico de denúncias locais
    const cache = JSON.parse(localStorage.getItem('stopbullying_cache_denuncias') || '[]');
    if (cache.length > 0) return cache;

    const historico = JSON.parse(localStorage.getItem('stopbullying_historico_denuncias') || '[]');
    return historico;
  }

  async atualizarStatusDenuncia(id, novoStatus) {
    this.registrarLog('ATUALIZAR_STATUS_DENUNCIA', `ID: ${id}, Status: ${novoStatus}`);
    try {
      if (this.isOnline) {
        await this._fetchSupabase(`denuncias?id=eq.${id}`, 'PATCH', { status: novoStatus });
        return { sucesso: true, modo: 'online' };
      }
    } catch (e) {
      console.warn('[Supabase] Erro ao atualizar status online:', e.message);
    }

    // Atualiza localmente no cache se offline
    this._atualizarItemLocal('stopbullying_historico_denuncias', 'id', id, { status: novoStatus });
    return { sucesso: true, modo: 'offline' };
  }

  async excluirDenuncia(id) {
    this.registrarLog('EXCLUIR_DENUNCIA', `ID: ${id}`);
    try {
      if (this.isOnline) {
        await this._fetchSupabase(`denuncias?id=eq.${id}`, 'DELETE');
        return { sucesso: true, modo: 'online' };
      }
    } catch (e) {
      console.warn('[Supabase] Erro ao excluir denúncia online:', e.message);
    }

    // Excluir localmente
    this._removerItemLocal('stopbullying_historico_denuncias', 'id', id);
    this._removerItemLocal('stopbullying_cache_denuncias', 'id', id);
    return { sucesso: true, modo: 'offline' };
  }

  // ================================================================
  // 2. ALERTAS SOS DE EMERGÊNCIA (GPS)
  // ================================================================

  async enviarAlertaSOS(sosData) {
    this.registrarLog('SOS_DISPARO_GPS', `Lat: ${sosData.latitude}, Lng: ${sosData.longitude}`);
    try {
      if (this.isOnline) {
        const res = await this._fetchSupabase('alertas_sos', 'POST', sosData);
        return { sucesso: true, modo: 'online', dados: res };
      }
    } catch (e) {
      console.warn('[Supabase] SOS armazenado offline:', e.message);
    }
    this._salvarLocal('stopbullying_pendentes_sos', sosData);
    this._salvarLocal('stopbullying_historico_sos', { ...sosData, data_disparo: new Date().toISOString() });
    return { sucesso: true, modo: 'offline' };
  }

  async listarAlertasSOS() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('alertas_sos?select=*&order=data_disparo.desc', 'GET');
        if (dados && Array.isArray(dados)) {
          localStorage.setItem('stopbullying_cache_sos', JSON.stringify(dados));
          return dados;
        }
      }
    } catch (e) {
      console.warn('[Supabase] Falha ao listar alertas SOS online:', e.message);
    }
    const cache = JSON.parse(localStorage.getItem('stopbullying_cache_sos') || '[]');
    if (cache.length > 0) return cache;
    return JSON.parse(localStorage.getItem('stopbullying_historico_sos') || '[]');
  }

  async atualizarStatusSOS(id, novoStatus) {
    try {
      if (this.isOnline) {
        await this._fetchSupabase(`alertas_sos?id=eq.${id}`, 'PATCH', { status: novoStatus });
        return { sucesso: true, modo: 'online' };
      }
    } catch (e) {
      console.warn('[Supabase] Erro ao atualizar status do alerta SOS:', e.message);
    }
    return { sucesso: true, modo: 'offline' };
  }

  // ================================================================
  // 3. OUVIDORIA: SUGESTÕES E RECLAMAÇÕES
  // ================================================================

  async enviarSugestao(sugestaoData) {
    try {
      if (this.isOnline) {
        await this._fetchSupabase('reclamacoes_sugestoes', 'POST', sugestaoData);
        return { sucesso: true, modo: 'online' };
      }
    } catch (e) {
      console.warn('[Supabase] Guardando sugestão localmente.');
    }
    this._salvarLocal('stopbullying_pendentes_sugestoes', sugestaoData);
    this._salvarLocal('stopbullying_historico_sugestoes', { ...sugestaoData, data_envio: new Date().toISOString() });
    return { sucesso: true, modo: 'offline' };
  }

  async listarSugestoes() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('reclamacoes_sugestoes?select=*&order=data_envio.desc', 'GET');
        if (dados && Array.isArray(dados)) {
          localStorage.setItem('stopbullying_cache_sugestoes', JSON.stringify(dados));
          return dados;
        }
      }
    } catch (e) {
      console.warn('[Supabase] Falha ao listar sugestões online:', e.message);
    }
    const cache = JSON.parse(localStorage.getItem('stopbullying_cache_sugestoes') || '[]');
    if (cache.length > 0) return cache;
    return JSON.parse(localStorage.getItem('stopbullying_historico_sugestoes') || '[]');
  }

  // ================================================================
  // 4. TRIAGEM SEMÁFORO DO BULLYING
  // ================================================================

  async registrarTriagem(triagemData) {
    try {
      if (this.isOnline) {
        await this._fetchSupabase('triagens_resultado', 'POST', triagemData);
        return { sucesso: true, modo: 'online' };
      }
    } catch (e) {
      this._salvarLocal('stopbullying_pendentes_triagens', triagemData);
    }
    this._salvarLocal('stopbullying_historico_triagens', { ...triagemData, data_triagem: new Date().toISOString() });
    return { sucesso: true, modo: 'offline' };
  }

  async listarTriagens() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('triagens_resultado?select=*&order=data_triagem.desc', 'GET');
        if (dados && Array.isArray(dados)) return dados;
      }
    } catch (e) {
      console.warn('[Supabase] Falha ao listar triagens online:', e.message);
    }
    return JSON.parse(localStorage.getItem('stopbullying_historico_triagens') || '[]');
  }

  // ================================================================
  // 5. MATERIAIS DE APOIO E PREVENÇÃO
  // ================================================================

  async buscarMateriais() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('materiais_apoio', 'GET');
        if (dados && dados.length > 0) return dados;
      }
    } catch (e) {
      console.warn('[Supabase] Usando materiais offline embutidos.');
    }
    return [
      { titulo: 'Você Não Está Sozinho(a)', categoria: 'Saúde Mental', conteudo: 'Pedir ajuda é um sinal de coragem, nunca de fraqueza. Procure o professor orientador ou a gestão da EEMTI Nazaré Guerra. Estamos com você.', link_externo: '', icone: '💚' },
      { titulo: 'CVV - Centro de Valorização da Vida', categoria: 'Emergência', conteudo: 'Atendimento emocional gratuito e confidencial 24 horas por dia por telefone ou chat.', link_externo: 'tel:188', icone: '📞' },
      { titulo: 'Lei Federal nº 13.185/2015', categoria: 'Legislação', conteudo: 'Institui o Programa de Combate à Intimidação Sistemática (Bullying) em todo o território nacional.', link_externo: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13185.htm', icone: '⚖️' },
      { titulo: 'Disque 100 - Direitos Humanos', categoria: 'Emergência', conteudo: 'Canal oficial para denúncias de violações de direitos de crianças e adolescentes. Gratuito e anônimo.', link_externo: 'tel:100', icone: '🛡️' }
    ];
  }

  // ================================================================
  // 6. LOGS DE AUDITORIA ANÔNIMA
  // ================================================================

  async registrarLog(tipoEvento, detalhes = '') {
    const logItem = { tipo_evento: tipoEvento, detalhes, modo_offline: !this.isOnline };
    try {
      if (this.isOnline) {
        await this._fetchSupabase('logs_sistema', 'POST', logItem);
        return;
      }
    } catch (e) {}
    this._salvarLocal('stopbullying_logs', logItem);
  }

  async listarLogs() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('logs_sistema?select=*&order=data_log.desc&limit=50', 'GET');
        if (dados && Array.isArray(dados)) return dados;
      }
    } catch (e) {}
    return JSON.parse(localStorage.getItem('stopbullying_logs') || '[]');
  }

  // ================================================================
  // 7. SINCRONIZADOR AUTOMÁTICO OFFLINE -> ONLINE
  // ================================================================

  async sincronizarPendentes() {
    const tabelasPendentes = [
      { chaveLocal: 'stopbullying_pendentes_denuncias', tabela: 'denuncias' },
      { chaveLocal: 'stopbullying_pendentes_sugestoes', tabela: 'reclamacoes_sugestoes' },
      { chaveLocal: 'stopbullying_pendentes_sos', tabela: 'alertas_sos' },
      { chaveLocal: 'stopbullying_pendentes_triagens', tabela: 'triagens_resultado' }
    ];

    let totalSincronizados = 0;
    for (const item of tabelasPendentes) {
      const dados = JSON.parse(localStorage.getItem(item.chaveLocal) || '[]');
      if (dados.length > 0) {
        console.log(`[Supabase Sincronizador] Sincronizando ${dados.length} itens da tabela ${item.tabela}...`);
        for (const registro of dados) {
          try {
            await this._fetchSupabase(item.tabela, 'POST', registro);
            totalSincronizados++;
          } catch (err) {
            console.error('[Supabase Sincronizador] Erro ao sincronizar item:', err);
          }
        }
        localStorage.removeItem(item.chaveLocal);
      }
    }
    return totalSincronizados;
  }

  // Helpers de armazenamento local
  _salvarLocal(chave, item) {
    const lista = JSON.parse(localStorage.getItem(chave) || '[]');
    lista.push(item);
    localStorage.setItem(chave, JSON.stringify(lista));
  }

  _atualizarItemLocal(chave, campoId, idValor, novosCampos) {
    const lista = JSON.parse(localStorage.getItem(chave) || '[]');
    const idx = lista.findIndex(x => x[campoId] === idValor);
    if (idx !== -1) {
      lista[idx] = { ...lista[idx], ...novosCampos };
      localStorage.setItem(chave, JSON.stringify(lista));
    }
  }

  _removerItemLocal(chave, campoId, idValor) {
    let lista = JSON.parse(localStorage.getItem(chave) || '[]');
    lista = lista.filter(x => x[campoId] !== idValor);
    localStorage.setItem(chave, JSON.stringify(lista));
  }
}

window.supabaseService = new SupabaseService();
