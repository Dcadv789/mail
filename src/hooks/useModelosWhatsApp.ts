import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ModeloWhatsApp, ModeloWhatsAppFormData } from '../types';

export const useModelosWhatsApp = () => {
  const [modelos, setModelos] = useState<ModeloWhatsApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modelos_whatsapp')
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

  const createModelo = async (modeloData: ModeloWhatsAppFormData) => {
    try {
      const { data, error } = await supabase
        .from('modelos_whatsapp')
        .insert([{
          nome: modeloData.nome,
          corpo_texto: modeloData.corpo_texto,
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

  const updateModelo = async (id: string, modeloData: ModeloWhatsAppFormData) => {
    try {
      const { data, error } = await supabase
        .from('modelos_whatsapp')
        .update({
          nome: modeloData.nome,
          corpo_texto: modeloData.corpo_texto,
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
        .from('modelos_whatsapp')
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