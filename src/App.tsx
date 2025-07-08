import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { TemplatesTab } from './components/TemplatesTab';
import { SendEmailTab } from './components/SendEmailTab';
import { ClientesTab } from './components/ClientesTab';

function App() {
  const [activeTab, setActiveTab] = useState<'templates' | 'send' | 'clientes'>('clientes');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'clientes' && <ClientesTab />}
        {activeTab === 'templates' && <TemplatesTab />}
        {activeTab === 'send' && <SendEmailTab />}
      </div>
    </div>
  );
}

export default App;