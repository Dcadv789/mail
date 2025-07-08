export interface ModeloEmail {
  id: string;
  nome: string;
  assunto: string;
  corpo_html: string;
  variaveis: string[];
  created_at: string;
  updated_at: string;
}

export interface EmailEnviado {
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
}

export interface ModeloFormData {
  nome: string;
  assunto: string;
  corpo_html: string;
  variaveis?: string[];
}

export interface ModeloWhatsApp {
  id: string;
  nome: string;
  corpo_texto: string;
  variaveis: string[];
  created_at: string;
  updated_at: string;
}

export interface ModeloWhatsAppFormData {
  nome: string;
  corpo_texto: string;
  variaveis?: string[];
}

export interface EmailFormData {
  cliente_id: string;
  modelo_id: string;
  assunto: string;
  variaveis_valores: Record<string, string>;
}

export interface Cliente {
  id: string;
  razao_social: string;
  cnpj: string;
  telefone_whatsapp?: string;
  created_at: string;
  updated_at: string;
  emails?: ClienteEmail[];
}

export interface ClienteEmail {
  id: string;
  cliente_id: string;
  email: string;
  principal: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClienteFormData {
  razao_social: string;
  cnpj: string;
  telefone_whatsapp: string;
  emails: {
    email: string;
    principal: boolean;
  }[];
}