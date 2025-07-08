import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nizuqttzejzmadvfyxle.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5penVxdHR6ZWp6bWFkdmZ5eGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzgwNDAsImV4cCI6MjA2NzU1NDA0MH0.eq3wTbuzT39fRZlSBFfjww6TZmfScb9VAocUl-5XEdg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      modelos_email: {
        Row: {
          id: string;
          nome: string;
          assunto: string;
          corpo_html: string;
          variaveis: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          assunto: string;
          corpo_html: string;
          variaveis: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          assunto?: string;
          corpo_html?: string;
          variaveis?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      emails_enviados: {
        Row: {
          id: string;
          cliente_id: string;
          modelo_id: string;
          assunto: string;
          corpo_html: string;
          status: 'pendente' | 'enviado' | 'erro';
          variaveis_utilizadas: Record<string, string>;
          data_envio: string | null;
          resposta_api: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          modelo_id: string;
          assunto: string;
          corpo_html: string;
          status?: 'pendente' | 'enviado' | 'erro';
          variaveis_utilizadas: Record<string, string>;
          data_envio?: string | null;
          resposta_api?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          modelo_id?: string;
          assunto?: string;
          corpo_html?: string;
          status?: 'pendente' | 'enviado' | 'erro';
          variaveis_utilizadas?: Record<string, string>;
          data_envio?: string | null;
          resposta_api?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      modelos_whatsapp: {
        Row: {
          id: string;
          nome: string;
          corpo_texto: string;
          variaveis: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          corpo_texto: string;
          variaveis?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          corpo_texto?: string;
          variaveis?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          razao_social: string;
          cnpj: string;
          telefone_whatsapp: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          razao_social: string;
          cnpj: string;
          telefone_whatsapp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          razao_social?: string;
          cnpj?: string;
          telefone_whatsapp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clientes_emails: {
        Row: {
          id: string;
          cliente_id: string;
          email: string;
          principal: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          email: string;
          principal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          email?: string;
          principal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};