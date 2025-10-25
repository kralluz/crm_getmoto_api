-- Migration: Adicionar campos de autenticação na tabela users
-- Data: 2025-10-23
-- Descrição: Adiciona email, password_hash e role para sistema de autenticação

-- Adicionar colunas
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'ATTENDANT';

-- Criar índice no email para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Adicionar constraint para validar role
ALTER TABLE users
ADD CONSTRAINT IF NOT EXISTS chk_users_role
CHECK (role IN ('ADMIN', 'MANAGER', 'MECHANIC', 'ATTENDANT'));

-- Comentários
COMMENT ON COLUMN users.email IS 'Email único para login';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt da senha';
COMMENT ON COLUMN users.role IS 'Papel do usuário no sistema: ADMIN, MANAGER, MECHANIC, ATTENDANT';
