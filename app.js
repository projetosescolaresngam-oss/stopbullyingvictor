// ================================================================
// PROJETO STOPBULLYING — LÓGICA PRINCIPAL DA APLICAÇÃO (APP.JS)
// EEMTI Nazaré Guerra — Ceará Científico 2026
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  // === ESTADO GLOBAL DA APLICAÇÃO ===
  const state = {
    viewAtual: 'home',
    quizScore: 0,
    quizIndex: 0,
    breathTimer: null,
    breathSound: true,
    audioCtx: null,
    deferredPrompt: null,
    ultimoProtocolo: 'STP-89F2A'
  };

  // === ATALHO SECRETO PARA A GESTÃO ESCOLAR (Ctrl + Shift + G) ===
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
      e.preventDefault();
      window.open('gestaoequipestop.html', '_blank');
    }
  });

  // BANCO DE FRASES MOTIVACIONAIS
  const frasesMotivacionais = [
    "Você é forte e merece respeito. Pedir ajuda é um ato de coragem.",
    "O bullying diminui o agressor, nunca você. Conte com a gente!",
    "Sua voz importa. Não guarde a dor sozinho(a).",
    "A escola é um lugar de paz, acolhimento e aprendizado.",
    "Denunciar o bullying é proteger você e todos os seus colegas."
  ];

  // BANCO DE QUESTÕES DO QUIZ (LEI 13.185/2015 & INEP)
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

    // Atualizar classe active nos botões da navbar
    document.querySelectorAll('.nav-link[data-target-view]').forEach(link => {
      if (link.getAttribute('data-target-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Rolar ao topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Log anônimo de navegação
    if (window.supabaseService) {
      window.supabaseService.registrarLog('NAVEGACAO_VIEW', viewId);
    }
  }

  // === ATALHOS DE BOTÕES DE NAVEGAÇÃO ===
  document.querySelectorAll('[data-target-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-target-view');
      if (target) {
        e.preventDefault();
        navegarPara(target);
      }
    });
  });

  // === DENÚNCIA ANÔNIMA (GERADOR DE PROTOCOLO HASH) ===
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
          <div style="background: rgba(16, 185, 129, 0.15); border:1.5px solid #10B981; padding:20px; border-radius:var(--radius-lg); margin-top:20px; animation: fadeIn 0.3s ease;">
            <h3 style="color:#10B981; font-family:var(--font-display); font-weight:800; font-size:1.2rem; margin-bottom:8px;">🟢 Caso Leve / Conflito Pontual</h3>
            <p style="font-size:0.9rem; color:#CFD8DC;">Situação isolada sem violência física nem intimidação sistemática. Recomendamos conversar com um professor de confiança ou com a Mediação Escolar.</p>
            <button class="primary-action-btn" style="margin-top:14px; background:#10B981; max-width: 300px;" data-target-view="apoio">Acessar Apoio Emocional</button>
          </div>
        `;
      } else if (nivel === 'amarelo') {
        html = `
          <div style="background: rgba(245, 158, 11, 0.15); border:1.5px solid #F59E0B; padding:20px; border-radius:var(--radius-lg); margin-top:20px; animation: fadeIn 0.3s ease;">
            <h3 style="color:#F59E0B; font-family:var(--font-display); font-weight:800; font-size:1.2rem; margin-bottom:8px;">🟡 Caso Recorrente / Perseguição</h3>
            <p style="font-size:0.9rem; color:#CFD8DC;">Violência psicológica repetida ou exclusão sistemática. Envolva a Coordenação Pedagógica e a Família imediatamente.</p>
            <button class="primary-action-btn" style="margin-top:14px; background:#F59E0B; max-width: 300px;" data-target-view="denuncia">Fazer Denúncia Anônima</button>
          </div>
        `;
      } else if (nivel === 'vermelho') {
        html = `
          <div style="background: rgba(239, 68, 68, 0.15); border:1.5px solid #EF4444; padding:20px; border-radius:var(--radius-lg); margin-top:20px; animation: fadeIn 0.3s ease;">
            <h3 style="color:#EF4444; font-family:var(--font-display); font-weight:800; font-size:1.2rem; margin-bottom:8px;">🔴 Caso Grave / Urgente</h3>
            <p style="font-size:0.9rem; color:#CFD8DC;">Agressão física ou situação de risco iminente. Acione a Direção Escolar, Conselho Tutelar ou o Botão SOS de Emergência!</p>
            <button class="primary-action-btn" style="margin-top:14px; background:#EF4444; max-width: 340px;" data-target-view="sos">🚨 Acionar SOS com GPS Agora</button>
          </div>
        `;
      }
      containerResult.innerHTML = html;

      // Re-bind listeners on dynamically inserted buttons
      containerResult.querySelectorAll('[data-target-view]').forEach(b => {
        b.addEventListener('click', () => navegarPara(b.getAttribute('data-target-view')));
      });

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
      btnToggleBreathSound.textContent = state.breathSound ? '🔊 Som: LIGADO' : '🔇 Som: MUTADO';
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
          labelBreath.textContent = 'Inhale suavemente pelo nariz... (4s)';
          circleBreath.className = 'breath-circle inhale';
          tocarSomBreath(440, 2000); // Tom La (Inspirar)
          fase = 1;
        } else if (fase === 1) {
          labelBreath.textContent = 'Segure o ar... (7s)';
          circleBreath.className = 'breath-circle hold';
          tocarSomBreath(523.25, 1000); // Tom Do (Reter)
          fase = 2;
        } else {
          labelBreath.textContent = 'Solte o ar bem devagar pela boca... (8s)';
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
        <div style="text-align:center; padding:30px 20px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-glass);">
          <h3 style="font-size:1.6rem; font-family:var(--font-display); font-weight:800; color:#10B981;">🎉 Quiz Concluído!</h3>
          <p style="margin:12px 0; font-size:1.1rem; color:#fff;">Você acertou <strong style="color:#F59E0B;">${state.quizScore} de ${quizQuestoes.length}</strong> questões!</p>
          <p style="font-size:0.88rem; color:#9CA3AF; max-width:500px; margin:0 auto;">Obrigado por fortalecer a Convivência Democrática e a Prevenção ao Bullying na EEMTI Nazaré Guerra.</p>
          <button class="primary-action-btn" style="margin-top:20px; background:var(--blue-scientific); max-width:240px; margin-left:auto; margin-right:auto;" onclick="location.reload()">Refazer Quiz</button>
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
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:10px;">
          <h4 style="font-size:1.05rem; font-weight:700; color:#fff;">${q.pergunta}</h4>
          <button id="btn-ouvir-quiz-${index}" class="speech-btn" style="padding:4px 10px; font-size:0.75rem;">🔊 Ouvir</button>
        </div>
        <div>${htmlOptions}</div>
        <div id="quiz-feedback" style="margin-top:14px; display:none; padding:14px; border-radius:var(--radius-md); font-size:0.88rem;"></div>
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
          feedback.style.background = 'rgba(16, 185, 129, 0.25)';
          feedback.style.border = '1px solid #10B981';
          feedback.style.color = '#A7F3D0';
          feedback.innerHTML = `✅ ${q.explicacao}`;
          state.quizScore++;
        } else {
          btn.classList.add('wrong');
          feedback.style.background = 'rgba(239, 68, 68, 0.25)';
          feedback.style.border = '1px solid #EF4444';
          feedback.style.color = '#FCA5A5';
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

  // === BOTÃO SOS EMERGÊNCIAL & GPS + CAMUFLAGEM ===
  const btnTriggerSOS = document.getElementById('btn-trigger-sos');
  if (btnTriggerSOS) {
    btnTriggerSOS.addEventListener('click', () => {
      const statusBox = document.getElementById('sos-status-box');
      statusBox.style.display = 'block';
      statusBox.innerHTML = '<p style="color:#F59E0B; text-align:center;">⏳ Obtendo localização GPS de emergência...</p>';

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
              <div style="background:rgba(239, 68, 68, 0.2); border:1.5px solid #EF4444; padding:20px; border-radius:var(--radius-lg); margin-top:14px; text-align:center;">
                <h4 style="color:#EF4444; font-family:var(--font-display); font-weight:800; font-size:1.2rem;">🚨 ALERTA SOS TRANSMITIDO COM SUCESSO!</h4>
                <p style="font-size:0.9rem; margin:8px 0; color:#CFD8DC;">Sua localização exata foi transmitida à coordenação escolar:</p>
                <p style="font-size:0.85rem; font-family:monospace; color:#FFF; background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; display:inline-block;">Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Precisão: ${accuracy.toFixed(0)}m)</p>
                <p style="font-size:0.8rem; color:#A7F3D0; margin-top:8px;">Modo: ${res.modo === 'online' ? '🟢 Gravado no Supabase' : '⚡ Armazenado Offline'}</p>
                <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank" class="speech-btn" style="margin-top:12px; background:#3B82F6; color:#fff; text-decoration:none;">📍 Abrir no Mapa GPS</a>
              </div>
            `;
          },
          (err) => {
            statusBox.innerHTML = `<p style="color:#EF4444; text-align:center;">⚠️ Não foi possível obter o GPS: ${err.message}. Mas o alerta SOS geral foi transmitido à coordenação.</p>`;
            window.supabaseService.enviarAlertaSOS({ dispositivo_info: navigator.userAgent });
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        statusBox.innerHTML = '<p style="color:#EF4444; text-align:center;">⚠️ GPS não suportado neste navegador. Alerta SOS geral enviado.</p>';
      }
    });
  }

  // === MODAL CAMUFLAGEM (MINI GAME PAC-MAN RETRO) ===
  const btnToggleCamouflage = document.getElementById('btn-camuflagem-toggle');
  const modalCamouflage = document.getElementById('modal-camuflagem');
  const btnExitCamouflage = document.getElementById('btn-exit-camouflage');
  const canvas = document.getElementById('pacman-canvas');
  const scoreDisplay = document.getElementById('pacman-score');

  let pacGameLoop = null;

  if (btnToggleCamouflage && modalCamouflage && canvas) {
    const ctx = canvas.getContext('2d');
    const tileSize = 24;
    const gridCols = 15;
    const gridRows = 15;

    // Mapa Inicial (1=Parede, 0=Dot, 2=Vazio)
    const initialMap = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,0,1,0,1],
      [1,0,0,0,1,1,2,1,1,0,0,0,0,0,1],
      [1,1,1,0,1,2,2,2,1,0,1,1,1,0,1],
      [1,0,0,0,1,2,2,2,1,0,0,0,0,0,1],
      [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
      [1,0,1,1,0,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,1,1,0,0,0,1,0,0,0,1,1,1,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let gameMap = JSON.parse(JSON.stringify(initialMap));
    let score = 0;
    let chompMouth = 0.2;
    let chompDir = 0.03;

    // Jogador Pac-Man
    let pacman = { x: 1, y: 1, dx: 0, dy: 0, nextDx: 0, nextDy: 0 };

    // Fantasmas (Blinky e Pinky)
    let ghosts = [
      { x: 7, y: 6, dx: 1, dy: 0, color: '#EF4444' },
      { x: 7, y: 5, dx: -1, dy: 0, color: '#EC4899' }
    ];

    function resetPacGame() {
      gameMap = JSON.parse(JSON.stringify(initialMap));
      score = 0;
      pacman = { x: 1, y: 1, dx: 0, dy: 0, nextDx: 0, nextDy: 0 };
      ghosts = [
        { x: 7, y: 6, dx: 1, dy: 0, color: '#EF4444' },
        { x: 7, y: 5, dx: -1, dy: 0, color: '#EC4899' }
      ];
      if (scoreDisplay) scoreDisplay.textContent = '0000';
    }

    function canMoveTo(x, y) {
      if (x < 0 || x >= gridCols || y < 0 || y >= gridRows) return false;
      return gameMap[y][x] !== 1;
    }

    function updatePacman() {
      if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
        if (canMoveTo(pacman.x + pacman.nextDx, pacman.y + pacman.nextDy)) {
          pacman.dx = pacman.nextDx;
          pacman.dy = pacman.nextDy;
          pacman.nextDx = 0;
          pacman.nextDy = 0;
        }
      }

      if (canMoveTo(pacman.x + pacman.dx, pacman.y + pacman.dy)) {
        pacman.x += pacman.dx;
        pacman.y += pacman.dy;

        if (gameMap[pacman.y][pacman.x] === 0) {
          gameMap[pacman.y][pacman.x] = 2;
          score += 10;
          if (scoreDisplay) {
            scoreDisplay.textContent = String(score).padStart(4, '0');
          }
        }
      }

      chompMouth += chompDir;
      if (chompMouth >= 0.45 || chompMouth <= 0.05) {
        chompDir = -chompDir;
      }
    }

    function updateGhosts() {
      ghosts.forEach(g => {
        const directions = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
          { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];

        let validDirs = directions.filter(d => canMoveTo(g.x + d.dx, g.y + d.dy));
        if (validDirs.length > 0) {
          if (canMoveTo(g.x + g.dx, g.y + g.dy) && Math.random() > 0.4) {
            g.x += g.dx;
            g.y += g.dy;
          } else {
            let choice = validDirs[Math.floor(Math.random() * validDirs.length)];
            g.dx = choice.dx;
            g.dy = choice.dy;
            g.x += g.dx;
            g.y += g.dy;
          }
        }
      });
    }

    function drawPacGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const tile = gameMap[r][c];
          const cx = c * tileSize;
          const cy = r * tileSize;

          if (tile === 1) {
            ctx.fillStyle = '#1E3A8A';
            ctx.fillRect(cx, cy, tileSize, tileSize);
            ctx.strokeStyle = '#3B82F6';
            ctx.strokeRect(cx + 2, cy + 2, tileSize - 4, tileSize - 4);
          } else if (tile === 0) {
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(cx + tileSize/2, cy + tileSize/2, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Desenhar Pac-Man
      const px = pacman.x * tileSize + tileSize / 2;
      const py = pacman.y * tileSize + tileSize / 2;
      let startAngle = 0;
      if (pacman.dx === 1) startAngle = 0;
      else if (pacman.dx === -1) startAngle = Math.PI;
      else if (pacman.dy === 1) startAngle = Math.PI / 2;
      else if (pacman.dy === -1) startAngle = (3 * Math.PI) / 2;

      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(
        px, py, tileSize / 2 - 2,
        startAngle + chompMouth,
        startAngle + Math.PI * 2 - chompMouth
      );
      ctx.lineTo(px, py);
      ctx.fill();

      // Desenhar Fantasmas
      ghosts.forEach(g => {
        const gx = g.x * tileSize + tileSize / 2;
        const gy = g.y * tileSize + tileSize / 2;

        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(gx, gy - 2, tileSize / 2 - 2, Math.PI, 0, false);
        ctx.lineTo(gx + tileSize / 2 - 2, gy + tileSize / 2);
        ctx.lineTo(gx - tileSize / 2 + 2, gy + tileSize / 2);
        ctx.fill();

        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(gx - 4, gy - 4, 3, 0, Math.PI * 2);
        ctx.arc(gx + 4, gy - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E3A8A';
        ctx.beginPath();
        ctx.arc(gx - 4 + g.dx * 1.5, gy - 4 + g.dy * 1.5, 1.5, 0, Math.PI * 2);
        ctx.arc(gx + 4 + g.dx * 1.5, gy - 4 + g.dy * 1.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    let moveCounter = 0;

    function gameLoop() {
      if (!modalCamouflage.classList.contains('active')) return;

      moveCounter++;
      if (moveCounter % 10 === 0) {
        updatePacman();
        updateGhosts();
      }

      drawPacGame();
      pacGameLoop = requestAnimationFrame(gameLoop);
    }

    function setDirection(dx, dy) {
      pacman.nextDx = dx;
      pacman.nextDy = dy;
    }

    document.addEventListener('keydown', (e) => {
      if (!modalCamouflage.classList.contains('active')) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) { setDirection(0, -1); e.preventDefault(); }
      else if (['ArrowDown', 'KeyS'].includes(e.code)) { setDirection(0, 1); e.preventDefault(); }
      else if (['ArrowLeft', 'KeyA'].includes(e.code)) { setDirection(-1, 0); e.preventDefault(); }
      else if (['ArrowRight', 'KeyD'].includes(e.code)) { setDirection(1, 0); e.preventDefault(); }
      else if (e.code === 'Escape') {
        modalCamouflage.classList.remove('active');
        if (pacGameLoop) cancelAnimationFrame(pacGameLoop);
      }
    });

    const btnUp = document.getElementById('btn-pac-up');
    const btnDown = document.getElementById('btn-pac-down');
    const btnLeft = document.getElementById('btn-pac-left');
    const btnRight = document.getElementById('btn-pac-right');

    if (btnUp) btnUp.addEventListener('click', () => setDirection(0, -1));
    if (btnDown) btnDown.addEventListener('click', () => setDirection(0, 1));
    if (btnLeft) btnLeft.addEventListener('click', () => setDirection(-1, 0));
    if (btnRight) btnRight.addEventListener('click', () => setDirection(1, 0));

    btnToggleCamouflage.addEventListener('click', () => {
      modalCamouflage.classList.add('active');
      resetPacGame();
      if (pacGameLoop) cancelAnimationFrame(pacGameLoop);
      pacGameLoop = requestAnimationFrame(gameLoop);
    });

    if (btnExitCamouflage) {
      btnExitCamouflage.addEventListener('click', () => {
        modalCamouflage.classList.remove('active');
        if (pacGameLoop) cancelAnimationFrame(pacGameLoop);
      });
    }
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

  // CHECAR HASH DA URL PARA ATALHOS PWA (#sos, #denuncia, #gestao)
  if (window.location.hash === '#sos') {
    navegarPara('sos');
  } else if (window.location.hash === '#denuncia') {
    navegarPara('denuncia');
  } else if (window.location.hash === '#gestao') {
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
