import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Cliente, ClienteFormData } from '../types';
import { useClientes } from '../hooks/useClientes';
import { ClienteCard } from './ClienteCard';
import { ClienteForm } from './ClienteForm';

export const ClientesTab: React.FC = () => {
  const { clientes, loading, error, createCliente, updateCliente, deleteCliente } = useClientes();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateCliente = async (data: ClienteFormData) => {
    try {
      setFormLoading(true);
      await createCliente(data);
      setIsCreating(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateCliente = async (data: ClienteFormData) => {
    if (!editingCliente) return;
    
    try {
      setFormLoading(true);
      await updateCliente(editingCliente.id, data);
      setEditingCliente(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCliente = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente(id);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCliente(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {isCreating && (
        <ClienteForm
          cliente={editingCliente}
          onSubmit={editingCliente ? handleUpdateCliente : handleCreateCliente}
          onCancel={handleCancel}
          loading={formLoading}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente) => (
          <ClienteCard
            key={cliente.id}
            cliente={cliente}
            onEdit={handleEditCliente}
            onDelete={handleDeleteCliente}
          />
        ))}
      </div>

      {clientes.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum cliente cadastrado ainda</p>
          <p className="text-gray-400">Clique em "Novo Cliente" para começar</p>
        </div>
      )}
    </div>
  );
};