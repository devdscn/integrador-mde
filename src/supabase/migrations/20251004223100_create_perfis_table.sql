-- 20251004223100_create_profiles_table.sql

-- 1. Criação da Tabela 'profiles'
CREATE TABLE public.profiles (
    -- ID: Chave primária e referência ao usuário autenticado (auth.users)
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- CAMPOS DE CONTROLE (em inglês, padrão)
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,

    -- CAMPOS OBRIGATÓRIOS (NOT NULL)
    apelido text UNIQUE NOT NULL,    -- Apelido
    nome text NOT NULL,             -- Nome completo
    telefone text NOT NULL,         -- Telefone

    -- CAMPOS NÃO OBRIGATÓRIOS
    endereco text,                  -- Endereço
    numero text,                    -- Número (da casa/apto)
    bairro text,                    -- Bairro
    cidade text,                    -- Cidade
    uf text,                        -- UF
    cep text,                       -- CEP
    cpf text,                       -- CPF
    cnh text                        -- CNH
);

-- 2. Índice para otimizar pesquisas por apelido
CREATE UNIQUE INDEX profiles_apelido_idx ON public.profiles (apelido);

-- 3. Configuração de Segurança (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLICY DE LEITURA (SELECT)
-- Usuários logados podem ver SOMENTE seu próprio perfil
CREATE POLICY "RLS: Somente usuario logado pode VER seu proprio perfil."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 5. POLICY DE INSERÇÃO/ATUALIZAÇÃO (ALL)
-- Usuários logados podem inserir ou atualizar SOMENTE seu próprio perfil
CREATE POLICY "RLS: Somente usuario logado pode CRIAR ou ATUALIZAR seu proprio perfil."
  ON public.profiles FOR ALL -- Aplica-se a INSERT, UPDATE e DELETE
  USING (auth.uid() = id);