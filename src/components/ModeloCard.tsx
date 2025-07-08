import React from 'react';
import { Edit3, Trash2, Code } from 'lucide-react';
import { ModeloEmail } from '../types';

interface ModeloCardProps {
  modelo: ModeloEmail;
  onEdit: (modelo: ModeloEmail) => void;
  onDelete: (id: string) => void;
}

export const ModeloCard: React.FC<ModeloCardProps> = ({ modelo, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{modelo.nome}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(modelo)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(modelo.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 font-medium">
        <strong>Assunto:</strong> {modelo.assunto}
      </p>
      
      <div className="mb-3">
        <p className="text-gray-500 text-sm line-clamp-3" 
           dangerouslySetInnerHTML={{ __html: modelo.corpo_html.substring(0, 150) + '...' }} />
      </div>

      {modelo.variaveis && modelo.variaveis.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center mb-2">
            <Code className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-xs font-medium text-gray-600">Variáveis:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {modelo.variaveis.map((variavel, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {variavel}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-400">
        Criado em {formatDate(modelo.created_at)}
      </p>
    </div>
  );
};