import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Mail } from 'lucide-react';
import { Cliente, ClienteFormData } from '../types';

interface ClienteFormProps {
  cliente?: Cliente | null;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({ 
  cliente, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<ClienteFormData>({
    razao_social: '',
    cnpj: '',
    telefone_whatsapp: '',
    emails: [{ email: '', principal: true }]
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        razao_social: cliente.razao_social,
        cnpj: cliente.cnpj,
        telefone_whatsapp: cliente.telefone_whatsapp || '',
        emails: cliente.emails?.length ? 
          cliente.emails.map(email => ({
            email: email.email,
            principal: email.principal
          })) : 
          [{ email: '', principal: true }]
      });
    } else {
      setFormData({
        razao_social: '',
        cnpj: '',
        telefone_whatsapp: '',
        emails: [{ email: '', principal: true }]
      });
    }
  }, [cliente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.razao_social && formData.cnpj && formData.emails.some(e => e.email)) {
      await onSubmit(formData);
    }
  };

  const addEmail = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, { email: '', principal: false }]
    });
  };

  const removeEmail = (index: number) => {
    if (formData.emails.length > 1) {
      const newEmails = formData.emails.filter((_, i) => i !== index);
      // Se removeu o email principal, tornar o primeiro como principal
      if (formData.emails[index].principal && newEmails.length > 0) {
        newEmails[0].principal = true;
      }
      setFormData({ ...formData, emails: newEmails });
    }
  };

  const updateEmail = (index: number, field: 'email' | 'principal', value: string | boolean) => {
    const newEmails = [...formData.emails];
    
    if (field === 'principal' && value === true) {
      // Desmarcar todos os outros como principal
      newEmails.forEach((email, i) => {
        email.principal = i === index;
      });
    } else {
      newEmails[index] = { ...newEmails[index], [field]: value };
    }
    
    setFormData({ ...formData, emails: newEmails });
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 13) {
      return numbers.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, '+$1 ($2) $3-$4');
    }
    return value;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {cliente ? 'Editar Cliente' : 'Novo Cliente'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Razão Social *
          </label>
          <input
            type="text"
            value={formData.razao_social}
            onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nome da empresa"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ *
            </label>
            <input
              type="text"
              value={formData.cnpj}
              onChange={(e) => {
                const numbers = e.target.value.replace(/\D/g, '');
                if (numbers.length <= 14) {
                  setFormData({ ...formData, cnpj: numbers });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="00.000.000/0000-00"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: {formatCNPJ(formData.cnpj || '00000000000000')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="text"
              value={formData.telefone_whatsapp}
              onChange={(e) => {
                const numbers = e.target.value.replace(/\D/g, '');
                if (numbers.length <= 13) {
                  setFormData({ ...formData, telefone_whatsapp: numbers });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+55 (11) 99999-9999"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: {formatPhone(formData.telefone_whatsapp || '5511999999999')}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              E-mails *
            </label>
            <button
              type="button"
              onClick={addEmail}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.emails.map((emailData, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={emailData.email}
                  onChange={(e) => updateEmail(index, 'email', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@exemplo.com"
                  required={index === 0}
                />
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="principal"
                    checked={emailData.principal}
                    onChange={() => updateEmail(index, 'principal', true)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-600">Principal</span>
                </label>
                {formData.emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : (cliente ? 'Atualizar' : 'Criar')} Cliente
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