# 📖 Manual Operacional do Painel Gerencial da Equipe Escolar
## Aplicativo StopBullying — EEMTI Nazaré Guerra (Itatira/CE)
### Projeto Credenciado ao Ceará Científico 2026

---

## 1. Como Acessar o Painel Gerencial

Por decisão da gestão escolar, para evitar barreiras burocráticas ou memorização de senhas complexas durante os atendimentos de urgência na escola, o acesso é protegido por atalhos diretos e discretos:

1. **Atalho por Digitação Direta (Recomendado):**  
   Em qualquer tela do aplicativo do aluno (`index.html`), basta digitar no teclado a sequência de letras:  
   👉 `gestaoequipestop`  
   *(O sistema reconhece o buffer de digitação e abre o painel gerencial imediatamente).*

2. **Atalho Rápido de Teclado:**  
   Pressione simultaneamente:  
   👉 `Ctrl + Shift + G`

3. **Acesso Direto pela URL:**  
   No navegador do computador da coordenação ou secretaria:  
   👉 `http://localhost:8080/gestaoequipestop.html` ou pelo sufixo `#gestao` (`index.html#gestao`).

---

## 2. Visão Geral das Funcionalidades do Painel

### 2.1. Monitor de Conexão com a Nuvem
No canto superior direito, há uma tag indicativa:
- `🟢 Supabase Online (X ms)`: Banco em nuvem sincronizado em tempo real.
- `🟡 Supabase Offline (Cache Local)`: Modo de contingência ativo no dispositivo.

### 2.2. Cards de Métricas Executivas (8 Indicadores em Tempo Real)
Exibe instantaneamente os totais de:
- **Total de Notificações Recebidas** (Canal Anônimo Criptografado)
- **Casos Críticos / Físicos** (Atenção prioritária da gestão)
- **Em Acolhimento Ativo** (Casos em fase de escuta e mediação restaurativa)
- **Casos Resolvidos** (Círculos de paz concluídos)
- **Taxa Geral de Resolutividade (%)** (Percentual de eficácia pedagógica)
- **Alertas SOS com GPS** (Acionamentos emergenciais do botão de pânico)
- **Ouvidoria Escolar** (Sugestões, elogios e relatos da comunidade)
- **Tempo Médio de Acolhimento (< 24h)** (Conformidade com a meta preventiva)

---

## 3. Guia Operacional dos 6 Módulos do Painel

### 📋 Módulo 1: Denúncias Anônimas
- **Distribuição Visual por Tipo de Agressão:** Barras percentuais dinâmicas (Verbal, Cyberbullying, Psicológica e Física).
- **Barra de Pesquisa e Filtros Avançados:**
  - Campo de busca instantânea: digite o protocolo (ex: `STP-`), palavras do relato ou local da escola.
  - Filtro por Status: `Em Análise`, `Acolhido` ou `Resolvido`.
  - Filtro por Tipo de Agressão.
- **Visualização de Provas e Evidências:**
  - Clique na linha da denúncia ou em **🔍 Ver Detalhes**.
  - No modal, visualize o relato completo, links externos de cyberbullying e reproduza fotos, vídeos e áudios gravados de até 60 segundos.
  - **📄 Ficha em PDF:** Clique para gerar e baixar a folha A4 individual do caso para a pasta pedagógica do estudante.
- **Atualização do Fluxo de Atendimento:**
  - Selecione o novo status (`Acolhido` ou `Resolvido`) e clique em **💾 Salvar Status**. A alteração é propagada no banco e o aluno poderá consultar com seu protocolo.
- **Exclusão de Registros:**
  - Use o botão **🗑️ Excluir Denúncia de Teste** apenas para higienizar dados de demonstração sem interferir nos casos reais.

### 📈 Módulo 2: Gráficos & BI Escolar (Business Intelligence)
Contém **6 gráficos interativos de alto nível visual (Chart.js)**:
1. **Tipologia das Agressões (Doughnut):** Proporção exata entre violência verbal, cyberbullying, psicológica e física.
2. **Espaços de Ocorrência na Nazaré Guerra (Barras Horizontais):** Mapeamento de calor nos locais escolares (Sala de Aula, Pátio, Corredores, Banheiros, Quadra Poliesportiva, Entorno e Redes Sociais).
3. **Linha do Tempo & Tendência (Line Chart Suave):** Evolução cronológica dos chamados ao longo das semanas/meses letivos.
4. **Status do Fluxo Pedagógico (Pie Chart):** Eficácia da equipe na conversão de casos pendentes em círculos de paz e acolhimento.
5. **Triagem Científica do Semáforo (Barras Coloridas):** Classificação institucional por nível de vulnerabilidade (🟢 Verde, 🟡 Amarelo, 🔴 Vermelho).
6. **Mídias e Provas Anexadas (Barras):** Volume de fotos, vídeos, áudios e links de cyberbullying recepcionados como comprovação.
- **Controles do BI:** Filtro temporal por período (Histórico, Últimos 30 dias, Mês Atual, Últimos 7 dias) e botão **📸 Salvar BI (Imagens PNG)** para anexar na apresentação de slides da feira.

### 📑 Módulo 3: Central de Relatórios Oficiais em PDF (Formato A4)
Módulo completo de diagramação e emissão de documentos oficiais para apresentação à banca avaliadora, à CREDE 07 e à SEDUC-CE:
- **Modelos Pré-Configurados:**
  - 🏆 *Relatório Executivo Geral (Direção / CREDE / Banca)*
  - 📋 *Relatório Analítico de Notificações & Fluxo Pedagógico*
  - 🚨 *Relatório Emergencial de Acionamentos SOS (GPS)*
  - 💡 *Relatório de Clima Escolar & Ouvidoria*
- **Configurador de Seções:** Opção de marcar/desmarcar cabeçalho SEDUC, scorecards, tabelas analíticas, parecer da coordenação e bloco de assinaturas.
- **Parecer Técnico Editável:** Campo para que a coordenação registre considerações pedagógicas personalizadas antes da impressão.
- **Visualizador em Tempo Real da Folha A4:** Simulação precisa da folha de papel com brasão, marcas institucionais, carimbo de autenticidade digital e dados tabulados.
- **Botões de Exportação:**
  - 📥 **Baixar Relatório em PDF (.pdf):** Download instantâneo de arquivo PDF nítido via `html2pdf.js`.
  - 🖨️ **Visualizar Impressão / Imprimir (A4):** Aciona o diálogo de impressão vetorial nativa do navegador.

### 🚨 Módulo 4: Alertas SOS de Emergência (GPS em Tempo Real)
- Destinado a situações de ameaça iminente ou agressão em curso.
- A tabela lista o momento exato do disparo, coordenadas de latitude/longitude e um link direto:  
  👉 **🗺️ Ver no Google Maps** (abre a localização com 1 clique para direcionar a equipe de apoio escolar).
- Botão **✅ Dar Baixa (Atendido)** para registrar o término da assistência.

### 💡 Módulo 5: Ouvidoria & Sugestões da Comunidade
- Registra sugestões pedagógicas, elogios à equipe escolar e reclamações sobre a convivência.
- Organizadas por categorias com identificação visual por cores.

### 🚦 Módulo 6: Semáforo & Métricas Científicas
- Painel analítico com a distribuição dos estudantes que realizaram a autoavaliação (Semáforo do Bullying):
  - **🟢 Baixo Risco (Verde):** Fortalecimento de empatia e prevenção.
  - **🟡 Atenção / Moderado (Amarelo):** Prevenção a pequenos conflitos.
  - **🔴 Alto Risco (Vermelho):** Estudantes em situação de sofrimento encaminhados a suporte especializado e CVV 188.
- Fundamentação teórica baseada na Lei nº 13.185/2015, Lei Estadual nº 17.525/2021 e dados estatísticos do INEP/Saeb.

---

## 4. Exportação de Relatórios para a Feira Científica

1. **Relatório em PDF Oficial (A4):**  
   Na aba **📑 Central de Relatórios em PDF**, clique em **📥 Baixar Relatório em PDF (.pdf)** ou **🖨️ Imprimir A4**. O documento gerado possui layout ministerial, com tabelas zebradas, carimbo de autenticidade e campos de assinatura formal para a Direção Escolar e para o Prof. Antonio Victor.
2. **Ficha Individual de Caso (PDF):**  
   Ao abrir qualquer denúncia, clique em **📄 Ficha em PDF** para emitir a ficha de atendimento e colocar na pasta pedagógica da escola.
3. **Planilha em Dados Brutos (CSV):**  
   No cabeçalho do painel, clique em **📥 Dados (CSV)** para gerar a planilha compatível com Excel e Google Sheets.

---

## 5. Roteiro Sugerido para Apresentação na Banca (Ceará Científico 2026)

1. **Apresentar o Problema:** Citar dados do INEP (28% das crianças sofrem bullying) e a Lei 13.185/2015 sobre o silêncio das vítimas.
2. **Demonstrar o App do Aluno:** Mostrar a facilidade do envio anônimo, a gravação de áudio/vídeo, o acolhimento guiado 4-7-8 e o modo camuflagem (Pac-Man).
3. **Executar o Atalho Secreto:** Digitar no teclado `gestaoequipestop` (ou `Ctrl + Shift + G`) e abrir o painel gerencial em tela cheia na frente dos avaliadores.
4. **Exibir o Módulo de BI & Gráficos:** Mostrar a distribuição por tipologia e o mapa de calor de locais na EEMTI Nazaré Guerra.
5. **Demonstrar a Emissão do Relatório em PDF Oficial:** Abrir a aba de relatórios, exibir a folha A4 diagramada com cabeçalho da SEDUC e gerar o download do PDF oficial em 1 clique na frente da banca.
6. **Mostrar o Alerta SOS com GPS:** Demonstrar o acionamento emergencial geolocalizado com abertura no Google Maps, comprovando a eficácia técnica e humana do projeto.

