import React, { useState, useEffect } from 'react';
import { MessageCircle, Code } from 'lucide-react';
import { ModeloWhatsApp, ModeloWhatsAppFormData } from '../types';

interface ModeloWhatsAppFormProps {
  modelo?: ModeloWhatsApp | null;
  onSubmit: (data: ModeloWhatsAppFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ModeloWhatsAppForm: React.FC<ModeloWhatsAppFormProps> = ({ 
  modelo, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<ModeloWhatsAppFormData>({
    nome: '',
    corpo_texto: '',
    variaveis: []
  });

  useEffect(() => {
    if (modelo) {
      setFormData({
        nome: modelo.nome,
        corpo_texto: modelo.corpo_texto,
        variaveis: modelo.variaveis || []
      });
    } else {
      setFormData({ 
        nome: '', 
        corpo_texto: '',
        variaveis: []
      });
    }
  }, [modelo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.corpo_texto) {
      await onSubmit(formData);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('corpo-whatsapp-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = 
        formData.corpo_texto.substring(0, start) + 
        `{{${variable}}}` + 
        formData.corpo_texto.substring(end);
      setFormData({ ...formData, corpo_texto: newContent });
      
      // Manter o foco no textarea
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  // Extrair variáveis automaticamente do corpo do texto
  const extractVariables = () => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = formData.corpo_texto.match(regex);
    if (matches) {
      const variables = matches.map(match => match.replace(/[{}]/g, ''));
      const uniqueVariables = [...new Set(variables)];
      setFormData({ ...formData, variaveis: uniqueVariables });
    }
  };

  const commonVariables = [
    'nome_cliente',
    'razao_social', 
    'cnpj',
    'valor',
    'data_vencimento',
    'numero_nf',
    'data_emissao',
    'nome_empresa',
    'telefone',
    'email'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
        {modelo ? 'Editar Modelo WhatsApp' : 'Criar Novo Modelo WhatsApp'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Modelo *
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ex: Cobrança WhatsApp"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Mensagem WhatsApp *
            </label>
            <button
              type="button"
              onClick={extractVariables}
              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center space-x-1"
            >
              <Code className="h-4 w-4" />
              <span>Extrair Variáveis</span>
            </button>
          </div>
          <textarea
            id="corpo-whatsapp-textarea"
            value={formData.corpo_texto}
            onChange={(e) => setFormData({ ...formData, corpo_texto: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-48 resize-none text-sm"
            placeholder="Olá {{nome_cliente}}!&#10;&#10;Temos uma pendência financeira em aberto:&#10;&#10;📄 Nota Fiscal: {{numero_nf}}&#10;💰 Valor: {{valor}}&#10;📅 Vencimento: {{data_vencimento}}&#10;&#10;Por favor, regularize o pagamento.&#10;&#10;Atenciosamente,&#10;{{nome_empresa}}"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use quebras de linha normais. Emojis são bem-vindos! 😊
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variáveis Comuns
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {commonVariables.map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() => insertVariable(variable)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>

        {formData.variaveis && formData.variaveis.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variáveis Detectadas
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
              {formData.variaveis.map((variavel, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                >
                  {variavel}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : (modelo ? 'Atualizar' : 'Criar')} Modelo
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};