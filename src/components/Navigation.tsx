import React from 'react';
import { Mail, BookTemplate as Template, Send, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: 'templates' | 'send' | 'clientes';
  onTabChange: (tab: 'templates' | 'send' | 'clientes') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Mail className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EmailCraft</span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('clientes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'clientes'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Clientes
            </button>
            <button
              onClick={() => onTabChange('templates')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Template className="h-4 w-4 inline mr-2" />
              Modelos
            </button>
            <button
              onClick={() => onTabChange('send')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'send'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Send className="h-4 w-4 inline mr-2" />
              Enviar E-mail
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};