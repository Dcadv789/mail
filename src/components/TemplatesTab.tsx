import React, { useState } from 'react';
import { Plus, BookTemplate as Template, MessageCircle, Mail } from 'lucide-react';
import { ModeloEmail, ModeloFormData } from '../types';
import { ModeloWhatsApp, ModeloWhatsAppFormData } from '../types';
import { useModelos } from '../hooks/useModelos';
import { useModelosWhatsApp } from '../hooks/useModelosWhatsApp';
import { ModeloCard } from './ModeloCard';
import { ModeloForm } from './ModeloForm';
import { ModeloWhatsAppCard } from './ModeloWhatsAppCard';
import { ModeloWhatsAppForm } from './ModeloWhatsAppForm';

export const TemplatesTab: React.FC = () => {
  const { modelos: modelosEmail, loading: loadingEmail, error: errorEmail, createModelo: createModeloEmail, updateModelo: updateModeloEmail, deleteModelo: deleteModeloEmail } = useModelos();
  const { modelos: modelosWhatsApp, loading: loadingWhatsApp, error: errorWhatsApp, createModelo: createModeloWhatsApp, updateModelo: updateModeloWhatsApp, deleteModelo: deleteModeloWhatsApp } = useModelosWhatsApp();
  
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');
  const [isCreatingEmail, setIsCreatingEmail] = useState(false);
  const [isCreatingWhatsApp, setIsCreatingWhatsApp] = useState(false);
  const [editingModelo, setEditingModelo] = useState<ModeloEmail | null>(null);
  const [editingModeloWhatsApp, setEditingModeloWhatsApp] = useState<ModeloWhatsApp | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateModeloEmail = async (data: ModeloFormData) => {
    try {
      setFormLoading(true);
      await createModeloEmail(data);
      setIsCreatingEmail(false);
    } catch (error) {
      console.error('Erro ao criar modelo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateModeloEmail = async (data: ModeloFormData) => {
    if (!editingModelo) return;
    
    try {
      setFormLoading(true);
      await updateModeloEmail(editingModelo.id, data);
      setEditingModelo(null);
      setIsCreatingEmail(false);
    } catch (error) {
      console.error('Erro ao atualizar modelo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateModeloWhatsApp = async (data: ModeloWhatsAppFormData) => {
    try {
      setFormLoading(true);
      await createModeloWhatsApp(data);
      setIsCreatingWhatsApp(false);
    } catch (error) {
      console.error('Erro ao criar modelo WhatsApp:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateModeloWhatsApp = async (data: ModeloWhatsAppFormData) => {
    if (!editingModeloWhatsApp) return;
    
    try {
      setFormLoading(true);
      await updateModeloWhatsApp(editingModeloWhatsApp.id, data);
      setEditingModeloWhatsApp(null);
      setIsCreatingWhatsApp(false);
    } catch (error) {
      console.error('Erro ao atualizar modelo WhatsApp:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteModeloEmail = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      try {
        await deleteModeloEmail(id);
      } catch (error) {
        console.error('Erro ao excluir modelo:', error);
      }
    }
  };

  const handleDeleteModeloWhatsApp = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      try {
        await deleteModeloWhatsApp(id);
      } catch (error) {
        console.error('Erro ao excluir modelo WhatsApp:', error);
      }
    }
  };

  const handleEditModeloEmail = (modelo: ModeloEmail) => {
    setEditingModelo(modelo);
    setIsCreatingEmail(true);
  };

  const handleEditModeloWhatsApp = (modelo: ModeloWhatsApp) => {
    setEditingModeloWhatsApp(modelo);
    setIsCreatingWhatsApp(true);
  };

  const handleCancelEmail = () => {
    setIsCreatingEmail(false);
    setEditingModelo(null);
  };

  const handleCancelWhatsApp = () => {
    setIsCreatingWhatsApp(false);
    setEditingModeloWhatsApp(null);
  };

  const loading = loadingEmail || loadingWhatsApp;
  const error = errorEmail || errorWhatsApp;

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
        <h1 className="text-3xl font-bold text-gray-900">Modelos</h1>
        <div className="flex space-x-3">
          {activeTab === 'email' && (
            <button
              onClick={() => setIsCreatingEmail(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo E-mail</span>
            </button>
          )}
          {activeTab === 'whatsapp' && (
            <button
              onClick={() => setIsCreatingWhatsApp(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo WhatsApp</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'email'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Mail className="h-5 w-5 inline mr-2" />
            Modelos de E-mail ({modelosEmail.length})
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'whatsapp'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="h-5 w-5 inline mr-2" />
            Modelos de WhatsApp ({modelosWhatsApp.length})
          </button>
        </div>
      </div>

      {/* Formulários */}
      {isCreatingEmail && (
        <ModeloForm
          modelo={editingModelo}
          onSubmit={editingModelo ? handleUpdateModeloEmail : handleCreateModeloEmail}
          onCancel={handleCancelEmail}
          loading={formLoading}
        />
      )}

      {isCreatingWhatsApp && (
        <ModeloWhatsAppForm
          modelo={editingModeloWhatsApp}
          onSubmit={editingModeloWhatsApp ? handleUpdateModeloWhatsApp : handleCreateModeloWhatsApp}
          onCancel={handleCancelWhatsApp}
          loading={formLoading}
        />
      )}

      {/* Conteúdo das Tabs */}
      {activeTab === 'email' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modelosEmail.map((modelo) => (
            <ModeloCard
              key={modelo.id}
              modelo={modelo}
              onEdit={handleEditModeloEmail}
              onDelete={handleDeleteModeloEmail}
            />
          ))}
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modelosWhatsApp.map((modelo) => (
            <ModeloWhatsAppCard
              key={modelo.id}
              modelo={modelo}
              onEdit={handleEditModeloWhatsApp}
              onDelete={handleDeleteModeloWhatsApp}
            />
          ))}
        </div>
      )}

      {/* Estados vazios */}
      {activeTab === 'email' && modelosEmail.length === 0 && !isCreatingEmail && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum modelo de e-mail criado ainda</p>
          <p className="text-gray-400">Clique em "Novo E-mail" para começar</p>
        </div>
      )}

      {activeTab === 'whatsapp' && modelosWhatsApp.length === 0 && !isCreatingWhatsApp && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum modelo de WhatsApp criado ainda</p>
          <p className="text-gray-400">Clique em "Novo WhatsApp" para começar</p>
        </div>
      )}
    </div>
  );
};