import React, { useState, useEffect } from 'react';
import { Bold, Italic, Code } from 'lucide-react';
import { ModeloEmail, ModeloFormData } from '../types';

interface ModeloFormProps {
  modelo?: ModeloEmail | null;
  onSubmit: (data: ModeloFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ModeloForm: React.FC<ModeloFormProps> = ({ 
  modelo, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<ModeloFormData>({
    nome: '',
    assunto: '',
    corpo_html: '',
    variaveis: []
  });

  useEffect(() => {
    if (modelo) {
      setFormData({
        nome: modelo.nome,
        assunto: modelo.assunto,
        corpo_html: modelo.corpo_html,
        variaveis: modelo.variaveis || []
      });
    } else {
      setFormData({ 
        nome: '', 
        assunto: '', 
        corpo_html: '',
        variaveis: []
      });
    }
  }, [modelo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.assunto && formData.corpo_html) {
      await onSubmit(formData);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('corpo-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = 
        formData.corpo_html.substring(0, start) + 
        `{{${variable}}}` + 
        formData.corpo_html.substring(end);
      setFormData({ ...formData, corpo_html: newContent });
      
      // Manter o foco no textarea
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  const applyFormatting = (tag: string) => {
    const textarea = document.getElementById('corpo-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      if (selectedText) {
        const newContent = 
          textarea.value.substring(0, start) + 
          `<${tag}>${selectedText}</${tag}>` + 
          textarea.value.substring(end);
        setFormData({ ...formData, corpo_html: newContent });
        
        // Manter o foco no textarea
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + selectedText.length);
        }, 0);
      }
    }
  };

  // Extrair variáveis automaticamente do corpo HTML
  const extractVariables = () => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = formData.corpo_html.match(regex);
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {modelo ? 'Editar Modelo' : 'Criar Novo Modelo'}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Proposta Comercial"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assunto *
          </label>
          <input
            type="text"
            value={formData.assunto}
            onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Proposta para {{nome_cliente}} - {{razao_social}}"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Corpo do E-mail *
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => applyFormatting('strong')}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center space-x-1"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('em')}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center space-x-1"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={extractVariables}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
              >
                <Code className="h-4 w-4" />
                <span>Extrair Variáveis</span>
              </button>
            </div>
          </div>
          <textarea
            id="corpo-textarea"
            value={formData.corpo_html}
            onChange={(e) => setFormData({ ...formData, corpo_html: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 resize-none font-mono text-sm"
            placeholder="Olá {{nome_cliente}},&#10;&#10;Segue proposta no valor de {{valor}}.&#10;&#10;Atenciosamente,&#10;{{nome_empresa}}"
            required
          />
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
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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