# StopBullying — Plataforma PWA & Prevenção ao Bullying Escolar
### EEMTI Nazaré Guerra | Ceará Científico 2026
**Autores**: Gabriel Xavier e Carla Vitória  
**Orientador**: Prof. Antonio Victor Batista da Silva (Biologia)  
**Área**: Robótica, Automação e Aplicação das TIC | **Categoria**: Ensino Médio  

---

## 📱 Visão Geral do Aplicativo PWA ("No Ponto")

O **StopBullying** é um Progressive Web App (PWA) desenvolvido para combater o bullying e o cyberbullying no ambiente escolar, oferecendo canais seguros, anônimos e imediatos de acolhimento e denúncia.

### 🌟 Principais Funcionalidades PWA
1. **Denúncia Anônima Criptografada**: Formulário 100% protegido com protocolo único de acompanhamento (ex: `#STP-89F2A`).
2. **Triagem Inteligente (Semáforo de Gravidade)**: Classificação em Verde (Leve), Amarelo (Recorrente) e Vermelho (Grave).
3. **Módulo de Apoio Emocional**: Exercício de respiração guiada (Técnica 4-7-8), mensagens de incentivo e canais de ajuda 24h (CVV 188 e Disque 100).
4. **Quiz Educativo & Estatísticas**: 10 perguntas baseadas na Lei Federal nº 13.185/2015 e estatísticas do INEP (28% dos estudantes).
5. **Botão de Socorro Emergencial (SOS) com GPS**: Transmissão imediata de coordenadas GPS com mapa dinâmico.
6. **Modo Camuflagem (Calculadora Neutra)**: Transforma a interface do app em uma calculadora funcional para uso discreto em situações de risco.
7. **Central Ceará Científico 2026**: Visualizador interativo em alta definição do Banner Oficial de Feira Científica (90 × 120 cm).
8. **Suporte Offline completo (Service Worker)**: Funciona 100% sem internet via cache PWA e sincronização com Supabase / LocalStorage.

---

## 📂 Estrutura de Arquivos do Repositório

```text
c:\Projeto Victor/
├── 📄 index.html                      # Aplicação Principal PWA (SPA)
├── 🎨 styles.css                      # Design System, Animações e Responsividade
├── ⚡ app.js                          # Lógica Interativa do Aplicativo
├── 🔌 supabase_client.js              # Conector Supabase + Fallback LocalStorage
├── 🗄️ supabase_schema.sql             # Script SQL com Tabelas e RLS do Banco
├── ⚙️ sw.js                            # Service Worker para Funcionamento Offline
├── 📋 manifest.json                   # Web App Manifest PWA (Ícones e Atalhos)
├── 🔒 gestaoequipestop.html           # Painel Gerencial da Equipe (Atalho sem Senha)
├── 🖼️ banner_stopbullying_ceara_...html # Visualizador do Banner Científico 90x120cm
├── 🖼️ Stop Bullying.jpeg               # Logo e Favicon Oficial
├── 🖼️ Stop Bullying 2.jpeg             # Banner de Topo da Interface Mobile
├── 🖼️ Stop Bullying 3.jpeg             # Ícone PWA de Alta Resolução (512x512)
├── 📖 README.md                       # Guia do Projeto
│
└── 📁 elaboracao_projeto/             # MATERIAIS DE ELABORAÇÃO & DOCUMENTAÇÃO
    ├── 📄 PRD_ESPECIFICACAO_TECNICA.md # Requisitos Técnicos e Especificação
    ├── 📄 Olá Somos estudantes.txt     # Apresentação do Projeto e Links
    ├── 📕 Regulamento CEARÁ CIENTÍFICO 2026 (1).pdf # Regulamento Oficial
    ├── 🌐 stopbullying_tela_inicial.html # Protótipo / Mockup Inicial
    ├── 🎬 WhatsApp Video 2026-08-09...mp4 # Vídeo de Apresentação
    ├── 🖼️ Captura de tela *.jpeg       # Registros do Desenvolvimento
    └── 📁 StopBullying_CearaCientifico2026_COMPLETO/
        ├── 📁 01_Projeto_Completo      # Texto completo da pesquisa
        ├── 📁 02_Quadro_Congruencia    # Quadro metodológico
        ├── 📁 03_Tutorial_AppInventor  # Guias de prototipagem
        ├── 📁 04_Projeto_AppInventor   # Arquivos de código AppInventor
        └── 📁 05_Questionario_Forms    # Formulário e resultados de pesquisa
```

---

## 🚀 Como Executar o Aplicativo PWA

1. Abra o arquivo [`index.html`](file:///c:/Projeto%20Victor/index.html) diretamente no seu navegador (Google Chrome, Edge, Safari, Firefox).
2. Para testar o **Modo Celular (Simulador)** ou **Modo Tela Cheia**, utilize os botões no topo da aplicação.
3. Para instalar como aplicativo nativo (PWA), clique na opção **"Instalar StopBullying"** na barra de endereço do seu navegador.
