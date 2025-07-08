/*
  # Create clients and client emails tables

  1. New Tables
    - `clientes`
      - `id` (uuid, primary key)
      - `razao_social` (text, not null) - Razão social do cliente
      - `cnpj` (text, not null, unique) - CNPJ do cliente
      - `telefone_whatsapp` (text) - Número de WhatsApp com DDI
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `clientes_emails`
      - `id` (uuid, primary key)
      - `cliente_id` (uuid, foreign key) - Referência para clientes.id
      - `email` (text, not null) - E-mail do cliente
      - `principal` (boolean, default false) - Se é o e-mail principal
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since no authentication is implemented)

  3. Relationships
    - clientes_emails.cliente_id -> clientes.id (foreign key)
*/

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social text NOT NULL,
  cnpj text NOT NULL UNIQUE,
  telefone_whatsapp text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clientes_emails table
CREATE TABLE IF NOT EXISTS clientes_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  email text NOT NULL,
  principal boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_emails ENABLE ROW LEVEL SECURITY;

-- Allow public access to clientes
CREATE POLICY "Allow public access to clientes"
  ON clientes
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow public access to clientes_emails
CREATE POLICY "Allow public access to clientes_emails"
  ON clientes_emails
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON clientes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_emails_cliente_id ON clientes_emails(cliente_id);
CREATE INDEX IF NOT EXISTS idx_clientes_emails_principal ON clientes_emails(principal) WHERE principal = true;

-- Create function to ensure only one principal email per client
CREATE OR REPLACE FUNCTION ensure_single_principal_email()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this email as principal, unset all other principal emails for this client
  IF NEW.principal = true THEN
    UPDATE clientes_emails 
    SET principal = false 
    WHERE cliente_id = NEW.cliente_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one principal email per client
CREATE TRIGGER trigger_ensure_single_principal_email
  BEFORE INSERT OR UPDATE ON clientes_emails
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_principal_email();