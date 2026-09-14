# 📋 Relatório Geral de Desenvolvimento do Projeto

**Projeto**: **StopBullying — Plataforma PWA & Prevenção ao Bullying Escolar**  
**Evento**: Ceará Científico 2026 (EEMTI Nazaré Guerra — Itatira/CE)  
**Autores**: Gabriel Xavier e Carla Vitória | **Orientador**: Prof. Antonio Victor Batista da Silva (Biologia)  
**Área**: Robótica, Automação e Aplicação das TIC | **Categoria**: Ensino Médio  
**Data do Relatório**: 14 de Agosto de 2026  

---

## 📑 Visão Geral

Desenvolvemos uma solução tecnológica completa e inovadora em conformidade com o Regulamento do **Ceará Científico 2026** e embasada na **Lei Federal nº 13.185/2015**. O projeto aborda a subnotificação de casos de bullying e cyberbullying (afetando **28% dos estudantes brasileiros** segundo dados do INEP), oferecendo canais seguros, anônimos e imediatos de acolhimento emocional, triagem inteligente de casos e ferramentas de socorro emergencial com modo camuflado.

---

## 🚀 Linha do Tempo e Módulos Desenvolvidos

### 1. 📢 Denúncia Anônima Criptografada
- Formulário 100% anônimo com gerador de protocolo único de acompanhamento (ex: `#STP-89F2A`).
- Suporte para anexo e gravação de mídias (foto, vídeo e áudio de até 60s).
- Criptografia e salvamento no banco de dados Supabase com fallback automático no `LocalStorage`.

### 2. 🚦 Triagem Inteligente (Semáforo de Gravidade)
- Algoritmo de classificação automática em:
  - 🟢 **Verde (Leve)**: Conflito pontual, mediação escolar simples.
  - 🟡 **Amarelo (Recorrente)**: Conflito frequente, suporte da psicologia escolar.
  - 🔴 **Vermelho (Grave)**: Risco à integridade, acionamento imediato da gestão escolar e conselho tutelar.

### 3. 💚 Apoio Emocional & Respiração Guiada (4-7-8)
- Exercício de respiração guiada (Técnica 4-7-8) com animações SVG/CSS e temporizador relaxante.
- Gerador de mensagens inspiradoras e acionamento direto ao CVV (188) e Disque 100.

### 4. 📚 Quiz Educativo & Estatísticas INEP
- Quiz pedagógico de 10 perguntas com gabarito explicativo baseado na Lei nº 13.185/2015.
- Gráficos comparativos com estatísticas da pesquisa do INEP.

### 5. 🚨 Socorro Emergencial SOS com GPS & Modo Camuflagem (Pac-Man Retro Arcade)
- Transmissão instantânea das coordenadas GPS (Latitude / Longitude).
- **🕹️ Modo Camuflagem (Jogo Pac-Man)**: Transforma instantaneamente a interface do aplicativo em um minigame retrô jogável de **Pac-Man com controles D-Pad touch/mobile**, permitindo privacidade total em situações de risco.

### 6. 🔬 Central Ceará Científico 2026
- Visualizador interativo em alta definição do Banner Oficial de Feira Científica (90 × 120 cm).
- Acesso ao Resumo, Quadro de Congruência e Metodologia da EEMTI Nazaré Guerra.

### 7. 🔒 Painel de Gestão da Equipe Escolar
- Interface para a coordenação e orientador acompanharem denúncias, alterarem status e gerenciarem relatórios.

---

## 🗂️ Estrutura de Arquivos do Repositório (`c:\Projeto Victor`)

```text
c:\Projeto Victor/
├── 📄 index.html                      # Aplicação Principal PWA (SPA)
├── 🎨 styles.css                      # Design System, Animações e Responsividade
├── ⚡ app.js                          # Lógica Interativa, Pac-Man Canvas e GPS
├── 🔌 supabase_client.js              # Conector Supabase + Fallback LocalStorage
├── 🗄️ supabase_schema.sql             # Script SQL com Tabelas e Políticas RLS
├── ⚙️ sw.js                            # Service Worker para Cache e Uso Offline
├── 📋 manifest.json                   # Web App Manifest PWA (Instalação Nativa)
├── 🔒 gestaoequipestop.html           # Painel Gerencial da Equipe Escolar
├── 🖼️ banner_stopbullying_ceara_...html # Visualizador do Banner Científico 90x120cm
├── 📄 RELATORIO_PROJETO.md            # Relatório Geral do Projeto
├── 📖 README.md                       # Guia Principal do Repositório
├── 🔒 gestaoequipestop.html           # Painel Gerencial da Equipe Escolar (Com 4 Abas)
├── 🗄️ supabase_client.js             # Cliente PostgREST & Sincronizador Offline
├── 🗄️ supabase_schema.sql             # Modelagem do Banco (DDL e Políticas RLS)
├── 🛠️ CORRECAO_RLS_SUPABASE.sql       # Script de Correção Imediata de Políticas RLS
├── 📖 DOCUMENTACAO_BANCO_DADOS.md     # Dicionário de Dados e Arquitetura Completa
├── 📖 MANUAL_PAINEL_GESTAO.md         # Manual Operacional da Coordenação e Roteiro da Banca
└── 📁 elaboracao_projeto/             # MATERIAIS DE ELABORAÇÃO & DOCUMENTAÇÃO
    ├── 📄 PRD_ESPECIFICACAO_TECNICA.md # Requisitos Técnicos e Especificação
    ├── 📄 Olá Somos estudantes.txt     # Apresentação do Projeto e Links
    ├── 📕 Regulamento CEARÁ CIENTÍFICO 2026.pdf # Regulamento Oficial
    └── 📁 StopBullying_CearaCientifico2026_COMPLETO/ # Acervo da Pesquisa
```

---

## 🔬 Auditoria e Aprimoramentos Recentes (Conexão do Banco e Painel Gerencial)

Na etapa de auditoria profunda do sistema realizada para a banca do **Ceará Científico 2026**:
1. **Conexão com o Supabase Validada:**
   - O endpoint em nuvem (`https://lbqfnqrgbbxounjxxikr.supabase.co`) e as chaves de API estão plenamente ativos.
   - Todas as 16 denúncias já enviadas foram preservadas com integridade.
   - Criado script de correção `CORRECAO_RLS_SUPABASE.sql` para garantir que as políticas RLS permitam o envio de sugestões da ouvidoria, alertas SOS e logs sem erro 401.
2. **Painel Gerencial Reformulado (`gestaoequipestop.html`):**
   - Correção do bug de `metric-taxa-atendimento` que impedia o cálculo dos percentuais.
   - Implementação de **4 abas gerenciais completas**:
     - 📋 **Denúncias Anônimas:** com pesquisa em tempo real, filtros dinâmicos por gravidade/status e player de mídias anexadas (foto, vídeo e áudio).
     - 🚨 **Central de Alertas SOS (GPS):** acompanhamento em tempo real com link direto para o Google Maps e baixa de socorro.
     - 💡 **Ouvidoria Escolar:** sugestões, reclamações e elogios da comunidade.
     - 📊 **Métricas Científicas:** dados do Semáforo do Bullying tabulados para apresentação.
3. **Atalho por Digitação Direta:**
   - Adicionada detecção global da palavra-chave `gestaoequipestop` digitada em qualquer ponto do app do aluno para abertura instantânea do painel da gestão.

---

## ✅ Conclusão

O sistema **StopBullying** da **EEMTI Nazaré Guerra** atinge o estado da arte pedagógico e tecnológico: 100% responsivo, resiliente com operação offline-first, seguro com criptografia anônima e totalmente documentado para a banca examinadora do **Ceará Científico 2026**.
