import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Cliente, ClienteEmail, ClienteFormData } from '../types';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      
      // Buscar clientes com seus emails
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select(`
          *,
          emails:clientes_emails(*)
        `)
        .order('created_at', { ascending: false });

      if (clientesError) throw clientesError;
      
      setClientes(clientesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (clienteData: ClienteFormData) => {
    try {
      // Criar cliente
      const { data: cliente, error: clienteError } = await supabase
        .from('clientes')
        .insert([{
          razao_social: clienteData.razao_social,
          cnpj: clienteData.cnpj,
          telefone_whatsapp: clienteData.telefone_whatsapp || null,
        }])
        .select()
        .single();

      if (clienteError) throw clienteError;

      // Criar emails do cliente
      if (clienteData.emails.length > 0) {
        const emailsToInsert = clienteData.emails.map(email => ({
          cliente_id: cliente.id,
          email: email.email,
          principal: email.principal,
        }));

        const { error: emailsError } = await supabase
          .from('clientes_emails')
          .insert(emailsToInsert);

        if (emailsError) throw emailsError;
      }

      // Recarregar lista de clientes
      await fetchClientes();
      return cliente;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cliente');
      throw err;
    }
  };

  const updateCliente = async (id: string, clienteData: ClienteFormData) => {
    try {
      // Atualizar dados do cliente
      const { data: cliente, error: clienteError } = await supabase
        .from('clientes')
        .update({
          razao_social: clienteData.razao_social,
          cnpj: clienteData.cnpj,
          telefone_whatsapp: clienteData.telefone_whatsapp || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (clienteError) throw clienteError;

      // Remover emails existentes
      const { error: deleteEmailsError } = await supabase
        .from('clientes_emails')
        .delete()
        .eq('cliente_id', id);

      if (deleteEmailsError) throw deleteEmailsError;

      // Inserir novos emails
      if (clienteData.emails.length > 0) {
        const emailsToInsert = clienteData.emails.map(email => ({
          cliente_id: id,
          email: email.email,
          principal: email.principal,
        }));

        const { error: emailsError } = await supabase
          .from('clientes_emails')
          .insert(emailsToInsert);

        if (emailsError) throw emailsError;
      }

      // Recarregar lista de clientes
      await fetchClientes();
      return cliente;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cliente');
      throw err;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir cliente');
      throw err;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    refetch: fetchClientes,
  };
};