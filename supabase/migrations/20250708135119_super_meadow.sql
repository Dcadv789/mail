/*
  # Create WhatsApp models table

  1. New Tables
    - `modelos_whatsapp`
      - `id` (uuid, primary key)
      - `nome` (text, not null) - Nome do modelo
      - `corpo_texto` (text, not null) - Conteúdo da mensagem WhatsApp
      - `variaveis` (text[], not null, default '{}') - Lista de variáveis utilizadas
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `modelos_whatsapp` table
    - Add policy for public access (since no authentication is implemented)

  3. Functions and Triggers
    - Auto-extract variables from corpo_texto
    - Auto-update updated_at timestamp
*/

-- Create modelos_whatsapp table
CREATE TABLE IF NOT EXISTS modelos_whatsapp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  corpo_texto text NOT NULL,
  variaveis text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE modelos_whatsapp ENABLE ROW LEVEL SECURITY;

-- Allow public access to modelos_whatsapp
CREATE POLICY "Allow public access to modelos_whatsapp"
  ON modelos_whatsapp
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modelos_whatsapp_created_at ON modelos_whatsapp(created_at DESC);

-- Function to extract variables from text content
CREATE OR REPLACE FUNCTION extract_variables_from_text(text_content text)
RETURNS text[] AS $$
DECLARE
  variables text[];
BEGIN
  -- Extract all {{variable}} patterns from the text content
  SELECT array_agg(DISTINCT matches[1])
  INTO variables
  FROM (
    SELECT regexp_matches(text_content, '\{\{([^}]+)\}\}', 'g') AS matches
  ) AS extracted;
  
  RETURN COALESCE(variables, '{}');
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update variables when corpo_texto changes
CREATE OR REPLACE FUNCTION update_whatsapp_variables_on_text_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-extract variables from corpo_texto if variaveis is empty or not provided
  IF array_length(NEW.variaveis, 1) IS NULL OR NEW.variaveis = '{}' THEN
    NEW.variaveis := extract_variables_from_text(NEW.corpo_texto);
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update variables
CREATE TRIGGER trigger_update_whatsapp_variables_on_text_change
  BEFORE INSERT OR UPDATE ON modelos_whatsapp
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_variables_on_text_change();

-- Create trigger for modelos_whatsapp updated_at
CREATE TRIGGER trigger_update_modelos_whatsapp_updated_at
  BEFORE UPDATE ON modelos_whatsapp
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();