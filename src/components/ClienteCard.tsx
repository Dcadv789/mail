import React from 'react';
import { Edit3, Trash2, Mail, Phone } from 'lucide-react';
import { Cliente } from '../types';

interface ClienteCardProps {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

export const ClienteCard: React.FC<ClienteCardProps> = ({ cliente, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    return phone.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, '+$1 ($2) $3-$4');
  };

  const principalEmail = cliente.emails?.find(email => email.principal);
  const otherEmails = cliente.emails?.filter(email => !email.principal) || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{cliente.razao_social}</h3>
          <p className="text-sm text-gray-600">CNPJ: {formatCNPJ(cliente.cnpj)}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(cliente)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(cliente.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {cliente.telefone_whatsapp && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2 text-green-600" />
            <span>{formatPhone(cliente.telefone_whatsapp)}</span>
          </div>
        )}

        {principalEmail && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">{principalEmail.email}</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Principal</span>
          </div>
        )}

        {otherEmails.map((email) => (
          <div key={email.id} className="flex items-center text-sm text-gray-500 ml-6">
            <Mail className="h-3 w-3 mr-2" />
            <span>{email.email}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Cadastrado em {formatDate(cliente.created_at)}
      </p>
    </div>
  );
};