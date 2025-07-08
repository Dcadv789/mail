import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ModeloEmail, ModeloFormData } from '../types';

export const useModelos = () => {
  const [modelos, setModelos] = useState<ModeloEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modelos_email')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModelos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar modelos');
    } finally {
      setLoading(false);
    }
  };

  const createModelo = async (modeloData: ModeloFormData) => {
    try {
      const { data, error } = await supabase
        .from('modelos_email')
        .insert([{
          nome: modeloData.nome,
          assunto: modeloData.assunto,
          corpo_html: modeloData.corpo_html,
          variaveis: modeloData.variaveis || [],
        }])
        .select()
        .single();

      if (error) throw error;
      setModelos(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar modelo');
      throw err;
    }
  };

  const updateModelo = async (id: string, modeloData: ModeloFormData) => {
    try {
      const { data, error } = await supabase
        .from('modelos_email')
        .update({
          nome: modeloData.nome,
          assunto: modeloData.assunto,
          corpo_html: modeloData.corpo_html,
          variaveis: modeloData.variaveis || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setModelos(prev => prev.map(modelo => 
        modelo.id === id ? data : modelo
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar modelo');
      throw err;
    }
  };

  const deleteModelo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('modelos_email')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setModelos(prev => prev.filter(modelo => modelo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir modelo');
      throw err;
    }
  };

  useEffect(() => {
    fetchModelos();
  }, []);

  return {
    modelos,
    loading,
    error,
    createModelo,
    updateModelo,
    deleteModelo,
    refetch: fetchModelos,
  };
};