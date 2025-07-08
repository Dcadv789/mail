/*
  # Create new email system tables

  1. New Tables
    - `modelos_email`
      - `id` (uuid, primary key)
      - `nome` (text, not null) - Nome do modelo
      - `assunto` (text, not null) - Assunto padrão do email
      - `corpo_html` (text, not null) - Corpo do email com placeholders
      - `variaveis` (text[], not null) - Array de variáveis utilizadas
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `emails_enviados`
      - `id` (uuid, primary key)
      - `cliente_id` (uuid, foreign key) - Referência para clientes.id
      - `modelo_id` (uuid, foreign key) - Referência para modelos_email.id
      - `assunto` (text, not null) - Assunto do envio
      - `corpo_html` (text, not null) - Corpo final gerado
      - `status` (enum) - Status do envio
      - `variaveis_utilizadas` (jsonb) - Variáveis e valores utilizados
      - `data_envio` (timestamptz) - Data/hora de envio
      - `resposta_api` (text) - Retorno da API
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public access

  3. Relationships
    - emails_enviados.cliente_id -> clientes.id
    - emails_enviados.modelo_id -> modelos_email.id
*/

-- Drop old table if exists
DROP TABLE IF EXISTS email_templates CASCADE;

-- Create enum for email status
CREATE TYPE email_status AS ENUM ('pendente', 'enviado', 'erro');

-- Create modelos_email table
CREATE TABLE IF NOT EXISTS modelos_email (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  assunto text NOT NULL,
  corpo_html text NOT NULL,
  variaveis text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emails_enviados table
CREATE TABLE IF NOT EXISTS emails_enviados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  modelo_id uuid NOT NULL REFERENCES modelos_email(id) ON DELETE CASCADE,
  assunto text NOT NULL,
  corpo_html text NOT NULL,
  status email_status DEFAULT 'pendente',
  variaveis_utilizadas jsonb NOT NULL DEFAULT '{}',
  data_envio timestamptz,
  resposta_api text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE modelos_email ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_enviados ENABLE ROW LEVEL SECURITY;

-- Allow public access to modelos_email
CREATE POLICY "Allow public access to modelos_email"
  ON modelos_email
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow public access to emails_enviados
CREATE POLICY "Allow public access to emails_enviados"
  ON emails_enviados
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modelos_email_created_at ON modelos_email(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_enviados_cliente_id ON emails_enviados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_emails_enviados_modelo_id ON emails_enviados(modelo_id);
CREATE INDEX IF NOT EXISTS idx_emails_enviados_status ON emails_enviados(status);
CREATE INDEX IF NOT EXISTS idx_emails_enviados_data_envio ON emails_enviados(data_envio DESC);

-- Function to extract variables from HTML content
CREATE OR REPLACE FUNCTION extract_variables_from_html(html_content text)
RETURNS text[] AS $$
DECLARE
  variables text[];
BEGIN
  -- Extract all {{variable}} patterns from the HTML content
  SELECT array_agg(DISTINCT matches[1])
  INTO variables
  FROM (
    SELECT regexp_matches(html_content, '\{\{([^}]+)\}\}', 'g') AS matches
  ) AS extracted;
  
  RETURN COALESCE(variables, '{}');
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update variables when corpo_html changes
CREATE OR REPLACE FUNCTION update_variables_on_html_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-extract variables from corpo_html if variaveis is empty or not provided
  IF array_length(NEW.variaveis, 1) IS NULL OR NEW.variaveis = '{}' THEN
    NEW.variaveis := extract_variables_from_html(NEW.corpo_html);
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update variables
CREATE TRIGGER trigger_update_variables_on_html_change
  BEFORE INSERT OR UPDATE ON modelos_email
  FOR EACH ROW
  EXECUTE FUNCTION update_variables_on_html_change();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for emails_enviados updated_at
CREATE TRIGGER trigger_update_emails_enviados_updated_at
  BEFORE UPDATE ON emails_enviados
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();