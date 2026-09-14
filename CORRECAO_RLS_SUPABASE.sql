-- ================================================================
-- PROJETO STOPBULLYING — EEMTI NAZARÉ GUERRA (CEARÁ CIENTÍFICO 2026)
-- SCRIPT DE CORREÇÃO DAS POLÍTICAS DE ACESSO (ROW LEVEL SECURITY - RLS)
-- Execute este script no SQL Editor do seu Dashboard Supabase
-- (https://supabase.com/dashboard/project/lbqfnqrgbbxounjxxikr/sql)
-- ================================================================

-- 1. HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE IF EXISTS denuncias ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reclamacoes_sugestoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS materiais_apoio ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS logs_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS triagens_resultado ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS alertas_sos ENABLE ROW LEVEL SECURITY;

-- 2. TABELA: DENUNCIAS
DROP POLICY IF EXISTS "Inserir Denúncia Anônima" ON denuncias;
CREATE POLICY "Inserir Denúncia Anônima" ON denuncias 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Consultar Denúncia por Protocolo" ON denuncias;
CREATE POLICY "Consultar Denúncia por Protocolo" ON denuncias 
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Atualizar Status Denúncia" ON denuncias;
CREATE POLICY "Atualizar Status Denúncia" ON denuncias 
  FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Excluir Denúncia Gestão" ON denuncias;
CREATE POLICY "Excluir Denúncia Gestão" ON denuncias 
  FOR DELETE TO anon, authenticated USING (true);

-- 3. TABELA: RECLAMACOES_SUGESTOES (Ouvidoria)
DROP POLICY IF EXISTS "Inserir Sugestão" ON reclamacoes_sugestoes;
CREATE POLICY "Inserir Sugestão" ON reclamacoes_sugestoes 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Consultar Sugestões Gestão" ON reclamacoes_sugestoes;
CREATE POLICY "Consultar Sugestões Gestão" ON reclamacoes_sugestoes 
  FOR SELECT TO anon, authenticated USING (true);

-- 4. TABELA: ALERTAS_SOS (Botão do Pânico com GPS)
DROP POLICY IF EXISTS "Inserir Alerta SOS" ON alertas_sos;
CREATE POLICY "Inserir Alerta SOS" ON alertas_sos 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Consultar Alerta SOS" ON alertas_sos;
CREATE POLICY "Consultar Alerta SOS" ON alertas_sos 
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Atualizar Status SOS Gestão" ON alertas_sos;
CREATE POLICY "Atualizar Status SOS Gestão" ON alertas_sos 
  FOR UPDATE TO anon, authenticated USING (true);

-- 5. TABELA: TRIAGENS_RESULTADO (Semáforo do Bullying)
DROP POLICY IF EXISTS "Inserir Triagem" ON triagens_resultado;
CREATE POLICY "Inserir Triagem" ON triagens_resultado 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Consultar Triagens Gestão" ON triagens_resultado;
CREATE POLICY "Consultar Triagens Gestão" ON triagens_resultado 
  FOR SELECT TO anon, authenticated USING (true);

-- 6. TABELA: LOGS_SISTEMA (Auditoria Anônima)
DROP POLICY IF EXISTS "Inserir Log de Sistema" ON logs_sistema;
CREATE POLICY "Inserir Log de Sistema" ON logs_sistema 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Consultar Logs Gestão" ON logs_sistema;
CREATE POLICY "Consultar Logs Gestão" ON logs_sistema 
  FOR SELECT TO anon, authenticated USING (true);

-- 7. TABELA: MATERIAIS_APOIO
DROP POLICY IF EXISTS "Ler Materiais de Apoio" ON materiais_apoio;
CREATE POLICY "Ler Materiais de Apoio" ON materiais_apoio 
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Inserir Material de Apoio" ON materiais_apoio;
CREATE POLICY "Inserir Material de Apoio" ON materiais_apoio 
  FOR INSERT TO anon, authenticated WITH CHECK (true);
