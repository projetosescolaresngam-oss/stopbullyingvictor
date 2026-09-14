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

### 2.2. Cards de Métricas Rápidas
Exibe instantaneamente os totais de:
- **Total de Denúncias Recebidas**
- **Casos Graves / Físicos** (exigem intervenção prioritária)
- **Casos Leves / Moderados** (ações pedagógicas e diálogo)
- **Taxa de Atendimento (%)** (percentual de casos em atendimento ou concluídos)
- **Total de Chamados SOS com GPS**
- **Mensagens da Ouvidoria Escolar**

---

## 3. Guia Operacional das 4 Abas

### 📋 Aba 1: Denúncias Anônimas
- **Distribuição Visual por Tipo de Agressão:** Barras percentuais dinâmicas (Verbal, Cyberbullying, Psicológica e Física).
- **Barra de Pesquisa e Filtros:**
  - Campo de busca instantânea: digite o protocolo (ex: `STP-`), palavras do relato ou local da escola.
  - Filtro por Status: `Em Análise`, `Acolhido` ou `Resolvido`.
  - Filtro por Tipo de Agressão.
- **Visualização de Provas e Evidências:**
  - Clique na linha da denúncia ou em **🔍 Ver Detalhes**.
  - No modal, visualize o relato completo, links externos de cyberbullying e reproduza fotos, vídeos e áudios gravados de até 60 segundos.
- **Atualização do Fluxo de Atendimento:**
  - Selecione o novo status (`Acolhido` ou `Resolvido`) e clique em **💾 Salvar Status**. A alteração é propagada no banco e o aluno poderá consultar com seu protocolo.
- **Exclusão de Registros:**
  - Use o botão **🗑️ Excluir Denúncia de Teste** apenas para higienizar dados de demonstração sem interferir nos casos reais.

### 🚨 Aba 2: Alertas SOS de Emergência (GPS em Tempo Real)
- Destinado a situações de ameaça iminente ou agressão em curso.
- A tabela lista o momento exato do disparo, coordenadas de latitude/longitude e um link direto:  
  👉 **🗺️ Ver no Google Maps** (abre a localização com 1 clique para direcionar a equipe de apoio escolar).
- Botão **✅ Dar Baixa (Atendido)** para registrar o término da assistência.

### 💡 Aba 3: Ouvidoria & Sugestões da Comunidade
- Registra sugestões pedagógicas, elogios à equipe escolar e reclamações sobre a convivência.
- Organizadas por categorias com identificação visual por cores.

### 📊 Aba 4: Métricas Científicas & Triagem (Semáforo)
- Painel analítico com a distribuição dos estudantes que realizaram a autoavaliação (Semáforo do Bullying):
  - **🟢 Baixo Risco (Verde):** Fortalecimento de empatia e prevenção.
  - **🟡 Atenção / Moderado (Amarelo):** Prevenção a pequenos conflitos.
  - **🔴 Alto Risco (Vermelho):** Estudantes em situação de sofrimento encaminhados a suporte especializado.

---

## 4. Exportação de Relatórios para a Feira Científica

No cabeçalho do painel, clique em:  
📥 **Exportar Relatório Completo (CSV)**  
O sistema faz o download de uma planilha em formato CSV compatível com Excel, Google Sheets e LibreOffice Calc contendo todos os dados anonimizados, pronta para ser anexada aos relatórios da banca examinadora.

---

## 5. Roteiro Sugerido para Apresentação na Banca (Ceará Científico 2026)

1. **Apresentar o Problema:** Citar dados do INEP e a Lei 13.185/2015 sobre o silêncio das vítimas por medo de represálias.
2. **Demonstrar o App do Aluno:** Mostrar a facilidade do envio anônimo, a inclusão de mídia (áudio/vídeo) e o modo camuflagem (Pac-Man).
3. **Executar o Atalho:** Digitar discretamente `gestaoequipestop` e abrir o painel em tela cheia no projetor ou tablet da banca.
4. **Demonstrar o Tratamento do Dado:** Abrir uma ocorrência, mostrar a prova anexada, atualizar para `Acolhido` e exibir a atualização instantânea nas métricas.
5. **Mostrar o Alerta SOS com GPS:** Demonstrar a prontidão da equipe escolar para proteger a integridade física dos alunos.
