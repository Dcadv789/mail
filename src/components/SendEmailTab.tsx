import React, { useState } from 'react';
import { Send, BookTemplate as Template, User, Search, Plus, Mail, MessageCircle } from 'lucide-react';
import { ModeloEmail, EmailFormData } from '../types';
import { ModeloWhatsApp } from '../types';
import { useModelos } from '../hooks/useModelos';
import { useModelosWhatsApp } from '../hooks/useModelosWhatsApp';
import { useClientes } from '../hooks/useClientes';
import { useEmails } from '../hooks/useEmails';
import { ClienteForm } from './ClienteForm';
import { ClienteFormData } from '../types';

export const SendEmailTab: React.FC = () => {
  const { modelos: modelosEmail, loading: modelosEmailLoading } = useModelos();
  const { modelos: modelosWhatsApp, loading: modelosWhatsAppLoading } = useModelosWhatsApp();
  const { clientes, loading: clientesLoading, createCliente } = useClientes();
  const { enviarEmail, loading: enviandoEmail } = useEmails();
  
  const [selectedModelo, setSelectedModelo] = useState<ModeloEmail | null>(null);
  const [selectedModeloWhatsApp, setSelectedModeloWhatsApp] = useState<ModeloWhatsApp | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showClienteForm, setShowClienteForm] = useState<boolean>(false);
  const [clienteFormLoading, setClienteFormLoading] = useState<boolean>(false);
  const [tipoEnvio, setTipoEnvio] = useState<'email' | 'whatsapp'>('email');
  const [emailData, setEmailData] = useState<EmailFormData>({
    cliente_id: '',
    modelo_id: '',
    assunto: '',
    variaveis_valores: {}
  });
  const [whatsappData, setWhatsappData] = useState<{
    cliente_id: string;
    modelo_id: string;
    variaveis_valores: Record<string, string>;
  }>({
    cliente_id: '',
    modelo_id: '',
    variaveis_valores: {}
  });

  const handleModeloChange = (modelo: ModeloEmail) => {
    setSelectedModelo(modelo);
    setSelectedModeloWhatsApp(null);
    setTipoEnvio('email');
    
    // Inicializar variáveis com valores vazios
    const variaveisVazias: Record<string, string> = {};
    modelo.variaveis?.forEach(variavel => {
      variaveisVazias[variavel] = '';
    });
    
    setEmailData({
      cliente_id: selectedCliente,
      modelo_id: modelo.id,
      assunto: modelo.assunto,
      variaveis_valores: variaveisVazias
    });
  };

  const handleModeloWhatsAppChange = (modelo: ModeloWhatsApp) => {
    setSelectedModeloWhatsApp(modelo);
    setSelectedModelo(null);
    setTipoEnvio('whatsapp');
    
    // Inicializar variáveis com valores vazios
    const variaveisVazias: Record<string, string> = {};
    modelo.variaveis?.forEach(variavel => {
      variaveisVazias[variavel] = '';
    });
    
    setWhatsappData({
      cliente_id: selectedCliente,
      modelo_id: modelo.id,
      variaveis_valores: variaveisVazias
    });
  };

  const handleClienteChange = (clienteId: string) => {
    setSelectedCliente(clienteId);
    setEmailData(prev => ({ ...prev, cliente_id: clienteId }));
    setWhatsappData(prev => ({ ...prev, cliente_id: clienteId }));
  };

  const handleVariavelChange = (variavel: string, valor: string) => {
    if (tipoEnvio === 'email') {
      setEmailData(prev => ({
        ...prev,
        variaveis_valores: {
          ...prev.variaveis_valores,
          [variavel]: valor
        }
      }));
    } else {
      setWhatsappData(prev => ({
        ...prev,
        variaveis_valores: {
          ...prev.variaveis_valores,
          [variavel]: valor
        }
      }));
    }
  };

  const handleSendEmail = async () => {
    if (selectedModelo && selectedCliente && emailData.assunto) {
      try {
        await enviarEmail(emailData);
        
        alert('E-mail enviado com sucesso!');
        
        // Limpar formulário
        setSelectedModelo(null);
        setSelectedCliente('');
        setTipoEnvio('email');
        setEmailData({
          cliente_id: '',
          modelo_id: '',
          assunto: '',
          variaveis_valores: {}
        });
      } catch (error) {
        alert('Erro ao enviar e-mail. Tente novamente.');
      }
    }
  };

  const handleSendWhatsApp = async () => {
    if (selectedModeloWhatsApp && selectedCliente) {
      // Simular envio do WhatsApp
      alert('Mensagem WhatsApp enviada com sucesso! (simulado)');
      
      // Limpar formulário
      setSelectedModeloWhatsApp(null);
      setSelectedCliente('');
      setTipoEnvio('email');
      setWhatsappData({
        cliente_id: '',
        modelo_id: '',
        variaveis_valores: {}
      });
    }
  };

  const generatePreview = () => {
    if (tipoEnvio === 'email' && selectedModelo) {
      let preview = selectedModelo.corpo_html;
      Object.entries(emailData.variaveis_valores).forEach(([variavel, valor]) => {
        const regex = new RegExp(`{{${variavel}}}`, 'g');
        preview = preview.replace(regex, valor || `[${variavel}]`);
      });
      return preview;
    }
    
    if (tipoEnvio === 'whatsapp' && selectedModeloWhatsApp) {
      let preview = selectedModeloWhatsApp.corpo_texto;
      Object.entries(whatsappData.variaveis_valores).forEach(([variavel, valor]) => {
        const regex = new RegExp(`{{${variavel}}}`, 'g');
        preview = preview.replace(regex, valor || `[${variavel}]`);
      });
      return preview;
    }
    
    return '';
  };

  const handleCreateCliente = async (data: ClienteFormData) => {
    try {
      setClienteFormLoading(true);
      await createCliente(data);
      setShowClienteForm(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    } finally {
      setClienteFormLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj.includes(searchTerm) ||
    cliente.emails?.some(email => email.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isFormValid = () => {
    if (tipoEnvio === 'email') {
      if (!selectedModelo || !selectedCliente || !emailData.assunto) return false;
      
      // Verificar se todas as variáveis obrigatórias foram preenchidas
      const variaveisObrigatorias = selectedModelo.variaveis || [];
      return variaveisObrigatorias.every(variavel => 
        emailData.variaveis_valores[variavel]?.trim()
      );
    }
    
    if (tipoEnvio === 'whatsapp') {
      if (!selectedModeloWhatsApp || !selectedCliente) return false;
      
      // Verificar se todas as variáveis obrigatórias foram preenchidas
      const variaveisObrigatorias = selectedModeloWhatsApp.variaveis || [];
      return variaveisObrigatorias.every(variavel => 
        whatsappData.variaveis_valores[variavel]?.trim()
      );
    }
    
    return false;
  };

  const modelosLoading = modelosEmailLoading || modelosWhatsAppLoading;

  if (modelosLoading || clientesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Enviar Mensagem</h1>

      {/* Seleção de Cliente */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Selecionar Cliente
          </h2>
          <button
            onClick={() => setShowClienteForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Busca de Clientes */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por razão social, CNPJ ou e-mail..."
            />
          </div>
        </div>

        {/* Formulário de Novo Cliente */}
        {showClienteForm && (
          <div className="mb-6">
            <ClienteForm
              onSubmit={handleCreateCliente}
              onCancel={() => setShowClienteForm(false)}
              loading={clienteFormLoading}
            />
          </div>
        )}
        
        {filteredClientes.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredClientes.map((cliente) => (
              <button
                key={cliente.id}
                onClick={() => handleClienteChange(cliente.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCliente === cliente.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{cliente.razao_social}</h3>
                <p className="text-sm text-gray-600">CNPJ: {cliente.cnpj}</p>
                {cliente.emails && cliente.emails.length > 0 && (
                  <p className="text-sm text-blue-600">
                    {cliente.emails.find(e => e.principal)?.email || cliente.emails[0].email}
                  </p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? 'Tente buscar com outros termos' : 'Clique em "Novo Cliente" para cadastrar'}
            </p>
          </div>
        )}
      </div>
      {/* Seleção de Modelo */}
      {selectedCliente && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Selecionar Modelo</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Modelos de E-mail */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Modelos de E-mail ({modelosEmail.length})
              </h3>
              {modelosEmail.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {modelosEmail.map((modelo) => (
                    <button
                      key={modelo.id}
                      onClick={() => handleModeloChange(modelo)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedModelo?.id === modelo.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900 text-sm">{modelo.nome}</h4>
                      <p className="text-xs text-gray-600 mt-1">{modelo.assunto}</p>
                      {modelo.variaveis && modelo.variaveis.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {modelo.variaveis.slice(0, 2).map((variavel, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {variavel}
                              </span>
                            ))}
                            {modelo.variaveis.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{modelo.variaveis.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Mail className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Nenhum modelo de e-mail</p>
                </div>
              )}
            </div>

            {/* Modelos de WhatsApp */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                Modelos de WhatsApp ({modelosWhatsApp.length})
              </h3>
              {modelosWhatsApp.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {modelosWhatsApp.map((modelo) => (
                    <button
                      key={modelo.id}
                      onClick={() => handleModeloWhatsAppChange(modelo)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedModeloWhatsApp?.id === modelo.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900 text-sm">{modelo.nome}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {modelo.corpo_texto.substring(0, 80)}...
                      </p>
                      {modelo.variaveis && modelo.variaveis.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {modelo.variaveis.slice(0, 2).map((variavel, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                              >
                                {variavel}
                              </span>
                            ))}
                            {modelo.variaveis.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{modelo.variaveis.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <MessageCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Nenhum modelo de WhatsApp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Envio */}
      {(selectedModelo || selectedModeloWhatsApp) && selectedCliente && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            {tipoEnvio === 'email' ? (
              <>
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Dados do E-mail
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                Dados do WhatsApp
              </>
            )}
          </h2>
          
          <div className="space-y-4">
            {/* Assunto */}
            {tipoEnvio === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={emailData.assunto}
                  onChange={(e) => setEmailData({ ...emailData, assunto: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Assunto do e-mail"
                />
              </div>
            )}

            {/* Variáveis */}
            {((tipoEnvio === 'email' && selectedModelo?.variaveis?.length) || 
              (tipoEnvio === 'whatsapp' && selectedModeloWhatsApp?.variaveis?.length)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preencher Variáveis
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  {(tipoEnvio === 'email' ? selectedModelo?.variaveis : selectedModeloWhatsApp?.variaveis)?.map((variavel) => (
                    <div key={variavel}>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {variavel}
                      </label>
                      <input
                        type="text"
                        value={(tipoEnvio === 'email' ? emailData.variaveis_valores : whatsappData.variaveis_valores)[variavel] || ''}
                        onChange={(e) => handleVariavelChange(variavel, e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 ${
                          tipoEnvio === 'email' ? 'focus:ring-blue-500' : 'focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder={`Digite o valor para ${variavel}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pré-visualização */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Pré-visualização</h3>
              <div className="space-y-2">
                {tipoEnvio === 'email' && (
                  <p><strong>Assunto:</strong> {emailData.assunto}</p>
                )}
                <div className="bg-white p-4 rounded border max-h-60 overflow-y-auto">
                  {tipoEnvio === 'email' ? (
                    <div 
                      className="email-preview"
                      dangerouslySetInnerHTML={{ __html: generatePreview() }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm">
                      {generatePreview()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={tipoEnvio === 'email' ? handleSendEmail : handleSendWhatsApp}
              disabled={!isFormValid() || enviandoEmail}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-white ${
                tipoEnvio === 'email' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {tipoEnvio === 'email' ? (
                <>
                  <Send className="h-5 w-5" />
                  <span>{enviandoEmail ? 'Enviando...' : 'Enviar E-mail'}</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  <span>Enviar WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};