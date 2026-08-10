-- ================================================================
-- PROJETO STOPBULLYING — CEARÁ CIENTÍFICO 2026
-- ESQUEMA DO BANCO DE DADOS SUPABASE (SQL DDL)
-- Escola: EEMTI Nazaré Guerra (Itatira/CE)
-- Autores: Gabriel Xavier & Carla Vitória | Orientador: Prof. Antonio Victor
-- ================================================================

-- 0. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE DENÚNCIAS ANÔNIMAS
CREATE TABLE IF NOT EXISTS denuncias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocolo VARCHAR(20) UNIQUE NOT NULL,
    tipo_violencia VARCHAR(60) NOT NULL,
    local_escola VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    link_cyberbullying TEXT,
    nivel_gravidade VARCHAR(20) DEFAULT 'Pendente',
    status VARCHAR(30) DEFAULT 'Em Análise',
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE RECLAMAÇÕES E SUGESTÕES DA COMUNIDADE ESCOLAR
CREATE TABLE IF NOT EXISTS reclamacoes_sugestoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(30) NOT NULL, -- 'Sugestão', 'Reclamação', 'Elogio'
    mensagem TEXT NOT NULL,
    categoria VARCHAR(50) DEFAULT 'Geral',
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE MATERIAIS DE APOIO E DICAS DE PREVENÇÃO
CREATE TABLE IF NOT EXISTS materiais_apoio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(200) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'Saúde Mental', 'Legislação', 'Prevenção', 'Emergência'
    conteudo TEXT NOT NULL,
    link_externo TEXT,
    icone VARCHAR(10) DEFAULT '📚',
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE LOGS DE SISTEMA E AUDITORIA ANÔNIMA
CREATE TABLE IF NOT EXISTS logs_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_evento VARCHAR(60) NOT NULL,
    detalhes TEXT,
    modo_offline BOOLEAN DEFAULT FALSE,
    data_log TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE RESULTADOS DE TRIAGEM (SEMÁFORO)
CREATE TABLE IF NOT EXISTS triagens_resultado (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nivel_calculado VARCHAR(20) NOT NULL, -- 'Verde', 'Amarelo', 'Vermelho'
    pontuacao INT DEFAULT 0,
    respostas_json JSONB,
    data_triagem TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DE ALERTAS SOS DE EMERGÊNCIA (GPS)
CREATE TABLE IF NOT EXISTS alertas_sos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    precisao_metros NUMERIC(8, 2),
    dispositivo_info TEXT,
    status VARCHAR(30) DEFAULT 'URGENTE',
    data_disparo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- POLÍTICAS DE SEGURANÇA POR LINHA (ROW LEVEL SECURITY - RLS)
-- ================================================================

ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;
ALTER TABLE reclamacoes_sugestoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais_apoio ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE triagens_resultado ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_sos ENABLE ROW LEVEL SECURITY;

-- Políticas de inserção e leitura pública anônima (anônimos podem inserir e consultar)
DROP POLICY IF EXISTS "Inserir Denúncia Anônima" ON denuncias;
CREATE POLICY "Inserir Denúncia Anônima" ON denuncias FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Consultar Denúncia por Protocolo" ON denuncias;
CREATE POLICY "Consultar Denúncia por Protocolo" ON denuncias FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserir Sugestão" ON reclamacoes_sugestoes;
CREATE POLICY "Inserir Sugestão" ON reclamacoes_sugestoes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Ler Materiais de Apoio" ON materiais_apoio;
CREATE POLICY "Ler Materiais de Apoio" ON materiais_apoio FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserir Log de Sistema" ON logs_sistema;
CREATE POLICY "Inserir Log de Sistema" ON logs_sistema FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Inserir Triagem" ON triagens_resultado;
CREATE POLICY "Inserir Triagem" ON triagens_resultado FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Inserir Alerta SOS" ON alertas_sos;
CREATE POLICY "Inserir Alerta SOS" ON alertas_sos FOR INSERT WITH CHECK (true);

-- ================================================================
-- INSERÇÃO DE DADOS INICIAIS DE MATERIAIS DE APOIO (SEED DATA)
-- ================================================================

INSERT INTO materiais_apoio (titulo, categoria, conteudo, link_externo, icone) VALUES
('Você Não Está Sozinho(a)', 'Saúde Mental', 'Pedir ajuda é um sinal de coragem, nunca de fraqueza. Procure o professor orientador ou a gestão da EEMTI Nazaré Guerra. Estamos com você.', '', '💚'),
('CVV - Centro de Valorização da Vida', 'Emergência', 'Atendimento emocional gratuito e confidencial 24 horas por dia por telefone ou chat.', 'tel:188', '📞'),
('Lei Federal nº 13.185/2015', 'Legislação', 'Institui o Programa de Combate à Intimidação Sistemática (Bullying) em todo o território nacional. A lei exige medidas de prevenção e assistência nas escolas.', 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13185.htm', '⚖️'),
('Disque 100 - Direitos Humanos', 'Emergência', 'Canal oficial do governo federal para denúncias de violações de direitos de crianças e adolescentes. Gratuito e anônimo.', 'tel:100', '🛡️'),
('Dicas para Testemunhas de Bullying', 'Prevenção', 'Não seja um espectador silencioso. Apoie a vítima, não ria de agressões e denuncie anonimamente no app StopBullying.', '', '🤝');
