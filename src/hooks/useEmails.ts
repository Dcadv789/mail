import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EmailEnviado, EmailFormData } from '../types';

export const useEmails = () => {
  const [emails, setEmails] = useState<EmailEnviado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('emails_enviados')
        .select(`
          *,
          cliente:clientes(razao_social),
          modelo:modelos_email(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar emails');
    } finally {
      setLoading(false);
    }
  };

  const enviarEmail = async (emailData: EmailFormData) => {
    try {
      // Buscar o modelo para obter o corpo HTML
      const { data: modelo, error: modeloError } = await supabase
        .from('modelos_email')
        .select('corpo_html')
        .eq('id', emailData.modelo_id)
        .single();

      if (modeloError) throw modeloError;

      // Substituir variáveis no corpo HTML
      let corpoFinal = modelo.corpo_html;
      Object.entries(emailData.variaveis_valores).forEach(([variavel, valor]) => {
        const regex = new RegExp(`{{${variavel}}}`, 'g');
        corpoFinal = corpoFinal.replace(regex, valor);
      });

      // Salvar o email como enviado
      const { data, error } = await supabase
        .from('emails_enviados')
        .insert([{
          cliente_id: emailData.cliente_id,
          modelo_id: emailData.modelo_id,
          assunto: emailData.assunto,
          corpo_html: corpoFinal,
          status: 'enviado',
          variaveis_utilizadas: emailData.variaveis_valores,
          data_envio: new Date().toISOString(),
          resposta_api: JSON.stringify({ status: 'success', message: 'Email enviado com sucesso (simulado)' }),
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar lista local
      await fetchEmails();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar email');
      throw err;
    }
  };

  const deleteEmail = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emails_enviados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEmails(prev => prev.filter(email => email.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir email');
      throw err;
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return {
    emails,
    loading,
    error,
    enviarEmail,
    deleteEmail,
    refetch: fetchEmails,
  };
};