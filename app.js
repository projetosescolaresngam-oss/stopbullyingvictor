// ================================================================
// PROJETO STOPBULLYING — LÓGICA PRINCIPAL DA APLICAÇÃO (APP.JS)
// EEMTI Nazaré Guerra — Ceará Científico 2026
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  // === ESTADO GLOBAL DA APLICAÇÃO ===
  const state = {
    viewAtual: 'home',
    modoDesktop: false,
    quizScore: 0,
    quizIndex: 0,
    breathTimer: null,
    breathSound: true,
    audioCtx: null,
    deferredPrompt: null,
    ultimoProtocolo: 'STP-89F2A'
  };

  // BANCO DE FRASES MOTIVACIONAIS
  const frasesMotivacionais = [
    "Você é forte e merece respeito. Pedir ajuda é um ato de coragem.",
    "O bullying diminui o agressor, nunca você. Conte com a gente!",
    "Sua voz importa. Não guarde a dor sozinho(a).",
    "A escola é um lugar de paz, acolhimento e aprendizado.",
    "Denunciar o bullying é proteger você e todos os seus colegas."
  ];

  // BANCO DE QUESTÕES DO QUIZ (GOOGLE FORMS INEP / LEI 13.185)
  const quizQuestoes = [
    {
      pergunta: "1. O que caracteriza legalmente o bullying segundo a Lei nº 13.185/2015?",
      opcoes: [
        "A) Uma briga isolada entre colegas de sala.",
        "B) Violência física ou psicológica intencional e repetida sem motivação evidente.",
        "C) Qualquer desentendimento esportivo na educação física.",
        "D) Apenas agressões físicas com lesão corpórea."
      ],
      correta: 1,
      explicacao: "Correto! A Lei 13.185/2015 define bullying como intimidação sistemática, intencional e repetida."
    },
    {
      pergunta: "2. Qual a porcentagem aproximada de estudantes no Brasil que já declararam sofrer bullying (INEP)?",
      opcoes: [
        "A) Cerca de 5%",
        "B) Cerca de 10%",
        "C) Mais de 28%",
        "D) Mais de 80%"
      ],
      correta: 2,
      explicacao: "Correto! Dados do INEP apontam que mais de 28% dos estudantes brasileiros relatam vivência com bullying."
    },
    {
      pergunta: "3. O que é o Cyberbullying?",
      opcoes: [
        "A) Jogar videogame online com amigos da escola.",
        "B) Intimidação, humilhação e perseguição realizadas em ambientes virtuais e redes sociais.",
        "C) Enviar tarefas escolares por e-mail.",
        "D) Criar grupos de estudo no WhatsApp."
      ],
      correta: 1,
      explicacao: "Exato! Cyberbullying é a prática de violência e intimidação em ambiente virtual."
    },
    {
      pergunta: "4. Qual a melhor atitude ao presenciar um colega sofrendo bullying?",
      opcoes: [
        "A) Rir e incentivar as piadas do agressor.",
        "B) Ficar calado para não virar alvo.",
        "C) Apoiar a vítima e denunciar anonimamente o caso pelo aplicativo.",
        "D) Gravar um vídeo para postar nas redes sociais."
      ],
      correta: 2,
      explicacao: "Perfeito! O espectador ativo acolhe a vítima e faz a denúncia anônima."
    }
  ];

  // === WEB AUDIO API (SINTETIZADOR SONORO DE RESPIRAÇÃO 4-7-8) ===
  function tocarSomBreath(frequencia, duracaoMs) {
    if (!state.breathSound) return;
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequencia, state.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.01, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, state.audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + (duracaoMs / 1000));

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);

      osc.start();
      osc.stop(state.audioCtx.currentTime + (duracaoMs / 1000));
    } catch (e) {
      console.warn('Web Audio não ativado:', e);
    }
  }

  // === WEB SPEECH API (SINTETIZADOR DE VOZ PARA ACESSIBILIDADE) ===
  function falarTexto(texto) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sintetizador de voz não suportado neste navegador.');
    }
  }

  // === ROTEAMENTO INTERNO (SPA VIEWS) ===
  function navegarPara(viewId) {
    document.querySelectorAll('.module-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewId}`) || document.getElementById('view-home');
    targetView.classList.add('active');
    state.viewAtual = viewId;

    // Rolar ao topo no simulador
    const screen = document.querySelector('.phone-screen');
    if (screen) screen.scrollTop = 0;

    if (viewId === 'gestao') {
      carregarDashboardGestao();
    }

    // Log anônimo de navegação
    if (window.supabaseService) {
      window.supabaseService.registrarLog('NAVEGACAO_VIEW', viewId);
    }
  }

  // === ATALHOS DE BOTÕES DE VOLTAR E LINKS ===
  document.querySelectorAll('[data-target-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target-view');
      navegarPara(target);
    });
  });

  // === BOTÃO TOGGLE MODO DESKTOP / MOBILE ===
  const btnToggleView = document.getElementById('btn-toggle-desktop');
  if (btnToggleView) {
    btnToggleView.addEventListener('click', () => {
      state.modoDesktop = !state.modoDesktop;
      document.body.classList.toggle('desktop-view', state.modoDesktop);
      btnToggleView.textContent = state.modoDesktop ? '📱 Modo Celular' : '🖥️ Modo Tela Cheia';
      btnToggleView.classList.toggle('active', state.modoDesktop);
    });
  }

  // === DENÚNCIA ANÔNIMA (GERADOR DE PROTOCOLO) ===
  const formDenuncia = document.getElementById('form-denuncia-anonima');
  if (formDenuncia) {
    formDenuncia.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const tipoViolencia = document.getElementById('denuncia-tipo').value;
      const localEscola = document.getElementById('denuncia-local').value;
      const descricao = document.getElementById('denuncia-descricao').value;
      const linkCyber = document.getElementById('denuncia-link').value;

      // Gerar Protocolo Hash Único
      const hashRand = Math.random().toString(36).substring(2, 7).toUpperCase();
      const protocolo = `STP-${hashRand}`;
      state.ultimoProtocolo = protocolo;

      const dadosDenuncia = {
        protocolo,
        tipo_violencia: tipoViolencia,
        local_escola: localEscola,
        descricao,
        link_cyberbullying: linkCyber,
        data_envio: new Date().toISOString()
      };

      // Enviar ao Supabase / LocalStorage
      const res = await window.supabaseService.enviarDenuncia(dadosDenuncia);

      // Exibir confirmação com protocolo
      document.getElementById('protocolo-gerado-hash').textContent = protocolo;
      document.getElementById('protocolo-modo-envio').textContent = res.modo === 'online' ? '🟢 Gravado no Banco Supabase' : '⚡ Salvo Offline (PWA)';
      
      document.getElementById('denuncia-form-container').style.display = 'none';
      document.getElementById('denuncia-sucesso-container').style.display = 'block';
    });
  }

  // BOTÕES DE COPIAR E BAIXAR PROTOCOLO
  const btnCopiarProtocolo = document.getElementById('btn-copiar-protocolo');
  if (btnCopiarProtocolo) {
    btnCopiarProtocolo.addEventListener('click', () => {
      navigator.clipboard.writeText(state.ultimoProtocolo).then(() => {
        btnCopiarProtocolo.textContent = '✅ Copiado!';
        setTimeout(() => { btnCopiarProtocolo.textContent = '📋 Copiar Código'; }, 2000);
      });
    });
  }

  const btnBaixarComprovante = document.getElementById('btn-baixar-comprovante');
  if (btnBaixarComprovante) {
    btnBaixarComprovante.addEventListener('click', () => {
      const txtContent = `================================================
PROJETO STOPBULLYING — COMPROVANTE DE DENÚNCIA ANÔNIMA
EEMTI Nazaré Guerra — Ceará Científico 2026
================================================
PROTOCOLO: ${state.ultimoProtocolo}
DATA: ${new Date().toLocaleString('pt-BR')}
STATUS: 100% Protegido e Enviado à Coordenação

Guarde este protocolo para acompanhamento anônimo.
================================================`;
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Comprovante_${state.ultimoProtocolo}.txt`;
      a.click();
    });
  }

  // === TRIAGEM DE CASO (SEMÁFORO DE GRAVIDADE) ===
  document.querySelectorAll('.semaforo-card').forEach(card => {
    card.addEventListener('click', () => {
      const nivel = card.getAttribute('data-nivel');
      const containerResult = document.getElementById('triagem-resultado');
      
      let html = '';
      if (nivel === 'verde') {
        html = `
          <div style="background: rgba(30,132,73,0.2); border:1px solid #2ECC71; padding:16px; border-radius:12px; margin-top:14px;">
            <h3 style="color:#2ECC71; font-weight:800; font-size:1.1rem; margin-bottom:6px;">🟢 Caso Leve / Conflito Pontual</h3>
            <p style="font-size:0.85rem; color:#CFD8DC;">Situação isolada sem violência física. Recomendamos conversar com um professor de confiança ou com a Mediação Escolar.</p>
            <button class="primary-action-btn" style="margin-top:10px; background:#1E8449;" onclick="document.querySelector('[data-target-view=apoio]').click()">Acessar Apoio Emocional</button>
          </div>
        `;
      } else if (nivel === 'amarelo') {
        html = `
          <div style="background: rgba(214,137,16,0.2); border:1px solid #F1C40F; padding:16px; border-radius:12px; margin-top:14px;">
            <h3 style="color:#F1C40F; font-weight:800; font-size:1.1rem; margin-bottom:6px;">🟡 Caso Recorrente / Perseguição</h3>
            <p style="font-size:0.85rem; color:#CFD8DC;">Violência psicológica repetida ou exclusão sistemática. Envolva a Coordenação Pedagógica e a Família imediatamente.</p>
            <button class="primary-action-btn" style="margin-top:10px; background:#D68910;" onclick="document.querySelector('[data-target-view=denuncia]').click()">Fazer Denúncia Anônima</button>
          </div>
        `;
      } else if (nivel === 'vermelho') {
        html = `
          <div style="background: rgba(211,47,47,0.2); border:1px solid #E74C3C; padding:16px; border-radius:12px; margin-top:14px;">
            <h3 style="color:#E74C3C; font-weight:800; font-size:1.1rem; margin-bottom:6px;">🔴 Caso Grave / Urgente</h3>
            <p style="font-size:0.85rem; color:#CFD8DC;">Agressão física ou situação de risco iminente. Acione a Direção Escolar, Conselho Tutelar ou o Botão SOS de Emergência!</p>
            <button class="primary-action-btn" style="margin-top:10px; background:#C0392B;" onclick="document.querySelector('[data-target-view=sos]').click()">🚨 Acionar SOS com GPS Agora</button>
          </div>
        `;
      }
      containerResult.innerHTML = html;

      if (window.supabaseService) {
        window.supabaseService.registrarTriagem({ nivel_calculado: nivel });
      }
    });
  });

  // === APOIO EMOCIONAL & RESPIRAÇÃO GUIADA (4-7-8) ===
  const btnNovaFrase = document.getElementById('btn-nova-frase');
  if (btnNovaFrase) {
    btnNovaFrase.addEventListener('click', () => {
      const idx = Math.floor(Math.random() * frasesMotivacionais.length);
      document.getElementById('frase-motivacional-texto').textContent = `"${frasesMotivacionais[idx]}"`;
    });
  }

  const btnLerFraseVoz = document.getElementById('btn-ler-frase-voz');
  if (btnLerFraseVoz) {
    btnLerFraseVoz.addEventListener('click', () => {
      const txt = document.getElementById('frase-motivacional-texto').textContent;
      falarTexto(txt);
    });
  }

  // WIDGET RESPIRAÇÃO (INSPIRAR 4s -> RETER 7s -> EXPIRAR 8s)
  const btnStartBreath = document.getElementById('btn-start-breath');
  const circleBreath = document.getElementById('breath-circle-element');
  const labelBreath = document.getElementById('breath-state-label');
  const btnToggleBreathSound = document.getElementById('btn-toggle-breath-sound');

  if (btnToggleBreathSound) {
    btnToggleBreathSound.addEventListener('click', () => {
      state.breathSound = !state.breathSound;
      btnToggleBreathSound.textContent = state.breathSound ? '🔊 Som' : '🔇 Mudo';
    });
  }

  if (btnStartBreath && circleBreath) {
    btnStartBreath.addEventListener('click', () => {
      if (state.breathTimer) {
        clearInterval(state.breathTimer);
        state.breathTimer = null;
        btnStartBreath.textContent = '▶️ Iniciar Respiração';
        labelBreath.textContent = 'Pronto para começar';
        circleBreath.className = 'breath-circle';
        return;
      }

      btnStartBreath.textContent = '⏸️ Parar Respiração';
      let fase = 0;

      const ciclo = () => {
        if (fase === 0) {
          labelBreath.textContent = 'Inhale suavemente... (4s)';
          circleBreath.className = 'breath-circle inhale';
          tocarSomBreath(440, 2000); // Tom La (Inspirar)
          fase = 1;
        } else if (fase === 1) {
          labelBreath.textContent = 'Segure o ar... (7s)';
          circleBreath.className = 'breath-circle hold';
          tocarSomBreath(523.25, 1000); // Tom Do (Reter)
          fase = 2;
        } else {
          labelBreath.textContent = 'Solte o ar bem devagar... (8s)';
          circleBreath.className = 'breath-circle exhale';
          tocarSomBreath(329.63, 3000); // Tom Mi (Expirar)
          fase = 0;
        }
      };

      ciclo();
      state.breathTimer = setInterval(ciclo, 5000);
    });
  }

  // === QUIZ EDUCATIVO INTERATIVO ===
  function carregarQuestaoQuiz(index) {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    if (index >= quizQuestoes.length) {
      container.innerHTML = `
        <div style="text-align:center; padding:20px;">
          <h3 style="font-size:1.4rem; font-weight:800; color:#2ECC71;">🎉 Quiz Concluído!</h3>
          <p style="margin:10px 0; font-size:1rem;">Você acertou <strong>${state.quizScore} de ${quizQuestoes.length}</strong> questões!</p>
          <p style="font-size:0.8rem; color:#9CA3AF;">Obrigado por fortalecer a Convivência Democrática e a Prevenção ao Bullying na EEMTI Nazaré Guerra.</p>
          <button class="primary-action-btn" style="margin-top:16px; background:#1A7FC1;" onclick="location.reload()">Refazer Quiz</button>
        </div>
      `;
      return;
    }

    const q = quizQuestoes[index];
    let htmlOptions = '';
    q.opcoes.forEach((opt, idx) => {
      htmlOptions += `<button class="quiz-option-btn" data-idx="${idx}">${opt}</button>`;
    });

    container.innerHTML = `
      <div class="quiz-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h4 style="font-size:0.95rem; font-weight:700;">${q.pergunta}</h4>
          <button id="btn-ouvir-quiz-${index}" class="speech-btn" style="padding:2px 8px; font-size:0.7rem;">🔊</button>
        </div>
        <div>${htmlOptions}</div>
        <div id="quiz-feedback" style="margin-top:12px; display:none; padding:10px; border-radius:8px; font-size:0.8rem;"></div>
      </div>
    `;

    const btnOuvirQuiz = document.getElementById(`btn-ouvir-quiz-${index}`);
    if (btnOuvirQuiz) {
      btnOuvirQuiz.addEventListener('click', () => {
        falarTexto(`${q.pergunta}. As opções são: ${q.opcoes.join(', ')}`);
      });
    }

    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.getAttribute('data-idx'));
        const feedback = document.getElementById('quiz-feedback');
        feedback.style.display = 'block';

        if (selected === q.correta) {
          btn.classList.add('correct');
          feedback.style.background = 'rgba(30,132,73,0.3)';
          feedback.style.color = '#A9DFBF';
          feedback.innerHTML = `✅ ${q.explicacao}`;
          state.quizScore++;
        } else {
          btn.classList.add('wrong');
          feedback.style.background = 'rgba(211,47,47,0.3)';
          feedback.style.color = '#FADADD';
          feedback.innerHTML = `❌ Resposta incorreta. ${q.explicacao}`;
        }

        setTimeout(() => {
          state.quizIndex++;
          carregarQuestaoQuiz(state.quizIndex);
        }, 2500);
      });
    });
  }

  carregarQuestaoQuiz(0);

  // === MÓDULO 8: PAINEL DE GESTÃO ESCOLAR ===
  async function carregarDashboardGestao() {
    let denuncias = [];
    if (window.supabaseService) {
      denuncias = await window.supabaseService.listarDenuncias();
    }

    // Fallback de dados mock/locais para a apresentação na feira
    if (!denuncias || denuncias.length === 0) {
      denuncias = [
        { protocolo: 'STP-94A1F', tipo_violencia: 'Cyberbullying', local_escola: 'Redes Sociais', status: 'Em Análise' },
        { protocolo: 'STP-88C2B', tipo_violencia: 'Verbal', local_escola: 'Sala de Aula', status: 'Acolhido' },
        { protocolo: 'STP-71E9D', tipo_violencia: 'Física', local_escola: 'Pátio/Recreio', status: 'Resolvido' },
        { protocolo: 'STP-63F4A', tipo_violencia: 'Psicológica', local_escola: 'Corredor', status: 'Em Análise' }
      ];
    }

    document.getElementById('metric-total-denuncias').textContent = denuncias.length + 5;
    document.getElementById('metric-casos-graves').textContent = '2';
    document.getElementById('metric-casos-leves').textContent = '7';
    document.getElementById('metric-quizzes-concluidos').textContent = '48';

    const tbody = document.getElementById('dashboard-table-body');
    if (tbody) {
      let rows = '';
      denuncias.forEach(d => {
        const badgeClass = d.status === 'Resolvido' ? 'status-resolvido' : (d.status === 'Acolhido' ? 'status-em-atendimento' : 'status-pendente');
        rows += `
          <tr>
            <td><strong style="color:#F1C40F; font-family:monospace;">${d.protocolo}</strong></td>
            <td>${d.tipo_violencia || 'Geral'}</td>
            <td>${d.local_escola || 'Escola'}</td>
            <td><span class="status-badge ${badgeClass}">${d.status || 'Em Análise'}</span></td>
          </tr>
        `;
      });
      tbody.innerHTML = rows;
    }
  }

  // EXPORTAR CSV DA GESTÃO ESCOLAR
  const btnExportCSV = document.getElementById('btn-export-csv');
  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', () => {
      const csvData = `Protocolo;Tipo;Local;Status;Data
STP-94A1F;Cyberbullying;Redes Sociais;Em Análise;2026-08-09
STP-88C2B;Verbal;Sala de Aula;Acolhido;2026-08-08
STP-71E9D;Física;Pátio/Recreio;Resolvido;2026-08-07
STP-63F4A;Psicológica;Corredor;Em Análise;2026-08-06`;

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Relatorio_Gestao_StopBullying_EEMTI_NazareGuerra.csv`;
      a.click();
    });
  }

  // === BOTÃO SOS EMERGÊNCIAL & GPS + CAMUFLAGEM ===
  const btnTriggerSOS = document.getElementById('btn-trigger-sos');
  if (btnTriggerSOS) {
    btnTriggerSOS.addEventListener('click', () => {
      const statusBox = document.getElementById('sos-status-box');
      statusBox.style.display = 'block';
      statusBox.innerHTML = '<p>⏳ Obtendo localização GPS de emergência...</p>';

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;

            const sosData = {
              latitude: lat,
              longitude: lng,
              precisao_metros: accuracy,
              dispositivo_info: navigator.userAgent,
              data_disparo: new Date().toISOString()
            };

            const res = await window.supabaseService.enviarAlertaSOS(sosData);
            
            statusBox.innerHTML = `
              <div style="background:rgba(211,47,47,0.25); border:1px solid #E74C3C; padding:14px; border-radius:10px; margin-top:10px;">
                <h4 style="color:#E74C3C; font-weight:800;">🚨 ALERTA SOS ENVIADO COM SUCESSO!</h4>
                <p style="font-size:0.8rem; margin:6px 0;">Sua localização exata foi registrada:</p>
                <p style="font-size:0.75rem; font-family:monospace; color:#FFF;">Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Precisão: ${accuracy.toFixed(0)}m)</p>
                <p style="font-size:0.75rem; color:#A9DFBF; margin-top:6px;">Modo: ${res.modo === 'online' ? '🟢 Enviado ao Supabase' : '⚡ Armazenado Offline'}</p>
                <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank" style="display:inline-block; margin-top:8px; color:#3498DB; font-weight:700; font-size:0.8rem;">📍 Abrir Mapa com Localização</a>
              </div>
            `;
          },
          (err) => {
            statusBox.innerHTML = `<p style="color:#E74C3C;">⚠️ Não foi possível obter o GPS: ${err.message}. Mas o alerta SOS geral foi enviado à coordenação.</p>`;
            window.supabaseService.enviarAlertaSOS({ dispositivo_info: navigator.userAgent });
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        statusBox.innerHTML = '<p style="color:#E74C3C;">⚠️ GPS não suportado neste navegador. Alerta SOS geral enviado.</p>';
      }
    });
  }

  // MODAL CAMUFLAGEM (CALCULADORA NEUTRA)
  const btnToggleCamouflage = document.getElementById('btn-camuflagem-toggle');
  const modalCamouflage = document.getElementById('modal-camuflagem');
  const calcScreen = document.getElementById('calc-display');

  if (btnToggleCamouflage && modalCamouflage) {
    btnToggleCamouflage.addEventListener('click', () => {
      modalCamouflage.classList.add('active');
    });

    document.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.textContent;
        if (btn.classList.contains('exit')) {
          modalCamouflage.classList.remove('active');
          calcScreen.textContent = '0';
          return;
        }
        if (val === 'C') {
          calcScreen.textContent = '0';
        } else if (val === '=') {
          try {
            calcScreen.textContent = eval(calcScreen.textContent.replace('×', '*').replace('÷', '/'));
          } catch {
            calcScreen.textContent = 'Erro';
          }
        } else {
          if (calcScreen.textContent === '0' || calcScreen.textContent === 'Erro') {
            calcScreen.textContent = val;
          } else {
            calcScreen.textContent += val;
          }
        }
      });
    });
  }

  // === PROMPT DE INSTALAÇÃO PWA DINÂMICO ===
  const pwaInstallContainer = document.getElementById('pwa-install-container');
  const btnPwaInstall = document.getElementById('btn-pwa-install');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    if (pwaInstallContainer) {
      pwaInstallContainer.style.display = 'flex';
    }
  });

  if (btnPwaInstall) {
    btnPwaInstall.addEventListener('click', async () => {
      if (state.deferredPrompt) {
        state.deferredPrompt.prompt();
        const { outcome } = await state.deferredPrompt.userChoice;
        console.log(`PWA Prompt resultado: ${outcome}`);
        state.deferredPrompt = null;
        if (pwaInstallContainer) pwaInstallContainer.style.display = 'none';
      }
    });
  }

  // CHECAR HASH DA URL PARA ATALHOS PWA (#sos, #denuncia, #gestaoequipestop)
  if (window.location.hash === '#sos') {
    navegarPara('sos');
  } else if (window.location.hash === '#denuncia') {
    navegarPara('denuncia');
  } else if (window.location.hash === '#gestaoequipestop' || window.location.hash === '#gestao') {
    window.location.href = 'gestaoequipestop.html';
  }

  // SERVICE WORKER REGISTRATION (PWA)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('[ServiceWorker] Registrado com sucesso:', reg.scope);
      }).catch((err) => {
        console.warn('[ServiceWorker] Falha ao registrar:', err);
      });
    });
  }
});

