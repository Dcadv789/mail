/*
  # Create email templates table

  1. New Tables
    - `email_templates`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Nome do modelo
      - `subject` (text, not null) - Assunto do email
      - `content` (text, not null) - Conteúdo do email
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `email_templates` table
    - Add policy for public access (since no authentication is implemented)
*/

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Allow public access to email templates (no authentication required)
CREATE POLICY "Allow public access to email templates"
  ON email_templates
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_email_templates_created_at 
  ON email_templates(created_at DESC);