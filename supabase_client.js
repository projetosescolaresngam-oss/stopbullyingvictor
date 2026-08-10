// ================================================================
// PROJETO STOPBULLYING — CLIENTE SUPABASE & SINCRONIZAÇÃO OFFLINE
// EEMTI Nazaré Guerra — Ceará Científico 2026
// ================================================================

window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
  url: 'https://lbqfnqrgbbxounjxxikr.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicWZucXJnYmJ4b3Vuanh4aWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTU4OTUsImV4cCI6MjEwMTg5MTg5NX0.qVDtAJ-0uhSQT-H_DPIoL6Z2vrpRr_Zm90TOMZo80x0' // Chave de API / AnonKey
};

class SupabaseService {
  constructor() {
    this.config = window.SUPABASE_CONFIG;
    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[Supabase] Conexão reestabelecida. Sincronizando pendentes...');
      this.sincronizarPendentes();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('[Supabase] Dispositivo offline. Ativando modo local.');
    });
  }

  // Helper para requisições HTTP REST com timeout
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
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    options.signal = controller.signal;

    try {
      const response = await fetch(`${this.config.url}/rest/v1/${endpoint}`, options);
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // --- DENÚNCIAS ANÔNIMAS ---
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

    // Salvar localmente no LocalStorage
    this._salvarLocal('stopbullying_pendentes_denuncias', denunciaData);
    this._salvarLocal('stopbullying_historico_denuncias', denunciaData);
    this.registrarLog('ENVIAR_DENUNCIA_OFFLINE', `Protocolo: ${denunciaData.protocolo}`);
    return { sucesso: true, protocolo: denunciaData.protocolo, modo: 'offline' };
  }

  // --- LISTAR DENÚNCIAS (PARA O PAINEL DE GESTÃO) ---
  async listarDenuncias() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('denuncias?select=*&order=data_envio.desc', 'GET');
        if (dados && Array.isArray(dados)) return dados;
      }
    } catch (e) {
      console.warn('[Supabase] Falha ao listar denúncias online:', e.message);
    }
    const historico = JSON.parse(localStorage.getItem('stopbullying_historico_denuncias') || '[]');
    return historico;
  }

  // --- ATUALIZAR STATUS DE DENÚNCIA ---
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
    return { sucesso: true, modo: 'offline' };
  }

  // --- SUGESTÕES E RECLAMAÇÕES ---
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
    return { sucesso: true, modo: 'offline' };
  }

  // --- ALERTAS SOS EMERGENCIAIS (GPS) ---
  async enviarAlertaSOS(sosData) {
    this.registrarLog('SOS_DISPARO_GPS', `Lat: ${sosData.latitude}, Lng: ${sosData.longitude}`);
    try {
      if (this.isOnline) {
        await this._fetchSupabase('alertas_sos', 'POST', sosData);
        return { sucesso: true, modo: 'online' };
      }
    } catch (e) {
      console.warn('[Supabase] SOS armazenado offline:', e.message);
    }
    this._salvarLocal('stopbullying_pendentes_sos', sosData);
    this._salvarLocal('stopbullying_historico_sos', sosData);
    return { sucesso: true, modo: 'offline' };
  }

  // --- TRIAGEM SEMÁFORO ---
  async registrarTriagem(triagemData) {
    try {
      if (this.isOnline) {
        await this._fetchSupabase('triagens_resultado', 'POST', triagemData);
      }
    } catch (e) {
      this._salvarLocal('stopbullying_pendentes_triagens', triagemData);
    }
  }

  // --- MATERIAIS DE APOIO ---
  async buscarMateriais() {
    try {
      if (this.isOnline) {
        const dados = await this._fetchSupabase('materiais_apoio', 'GET');
        if (dados && dados.length > 0) return dados;
      }
    } catch (e) {
      console.warn('[Supabase] Usando materiais offline embutidos.');
    }
    // Materiais padrão caso esteja offline
    return [
      { titulo: 'Você Não Está Sozinho(a)', categoria: 'Saúde Mental', conteudo: 'Pedir ajuda é um sinal de coragem, nunca de fraqueza. Procure o professor orientador ou a gestão da EEMTI Nazaré Guerra. Estamos com você.', link_externo: '', icone: '💚' },
      { titulo: 'CVV - Centro de Valorização da Vida', categoria: 'Emergência', conteudo: 'Atendimento emocional gratuito e confidencial 24 horas por dia por telefone ou chat.', link_externo: 'tel:188', icone: '📞' },
      { titulo: 'Lei Federal nº 13.185/2015', categoria: 'Legislação', conteudo: 'Institui o Programa de Combate à Intimidação Sistemática (Bullying) em todo o território nacional.', link_externo: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13185.htm', icone: '⚖️' },
      { titulo: 'Disque 100 - Direitos Humanos', categoria: 'Emergência', conteudo: 'Canal oficial para denúncias de violações de direitos de crianças e adolescentes. Gratuito e anônimo.', link_externo: 'tel:100', icone: '🛡️' }
    ];
  }

  // --- LOGS DE AUDITORIA ANÔNIMA ---
  async registrarLog(tipoEvento, detalhes = '') {
    const logItem = { tipo_evento: tipoEvento, detalhes, modo_offline: !this.isOnline };
    try {
      if (this.isOnline) {
        await this._fetchSupabase('logs_sistema', 'POST', logItem);
        return;
      }
    } catch (e) { }
    this._salvarLocal('stopbullying_logs', logItem);
  }

  // --- SINCRONIZAÇÃO DE DADOS PENDENTES AO VOLTAR ONLINE ---
  async sincronizarPendentes() {
    const tabelasPendentes = [
      { chaveLocal: 'stopbullying_pendentes_denuncias', tabela: 'denuncias' },
      { chaveLocal: 'stopbullying_pendentes_sugestoes', tabela: 'reclamacoes_sugestoes' },
      { chaveLocal: 'stopbullying_pendentes_sos', tabela: 'alertas_sos' },
      { chaveLocal: 'stopbullying_pendentes_triagens', tabela: 'triagens_resultado' }
    ];

    for (const item of tabelasPendentes) {
      const dados = JSON.parse(localStorage.getItem(item.chaveLocal) || '[]');
      if (dados.length > 0) {
        console.log(`[Supabase Sincronizador] Sincronizando ${dados.length} itens da tabela ${item.tabela}...`);
        for (const registro of dados) {
          try {
            await this._fetchSupabase(item.tabela, 'POST', registro);
          } catch (err) {
            console.error('[Supabase Sincronizador] Erro ao sincronizar item:', err);
          }
        }
        localStorage.removeItem(item.chaveLocal);
      }
    }
  }

  // Helper interno de LocalStorage
  _salvarLocal(chave, item) {
    const lista = JSON.parse(localStorage.getItem(chave) || '[]');
    lista.push(item);
    localStorage.setItem(chave, JSON.stringify(lista));
  }
}

window.supabaseService = new SupabaseService();
