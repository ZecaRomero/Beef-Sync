import { useState } from 'react';

export default function WhatsAppConfigModal({ isOpen, onClose, onSend }) {
  const [config, setConfig] = useState({
    includeCharts: true,
    includeInsights: true,
    includeRecommendations: true,
    includeDashboardLink: true,
    reportFormat: 'detailed', // 'summary', 'detailed', 'executive'
    language: 'pt-BR'
  });

  const [contacts, setContacts] = useState([
    { name: '', phone: '', role: 'Investidor' }
  ]);

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '', role: 'Investidor' }]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    contacts.forEach(contact => {
      if (contact.phone) {
        onSend(contact.phone, config);
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            📱 Configurar Envio via WhatsApp
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Configurações do Relatório */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">📊 Configurações do Relatório</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.includeCharts}
                onChange={(e) => setConfig({...config, includeCharts: e.target.checked})}
                className="rounded"
              />
              <span>Incluir gráficos ASCII</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.includeInsights}
                onChange={(e) => setConfig({...config, includeInsights: e.target.checked})}
                className="rounded"
              />
              <span>Incluir insights inteligentes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.includeRecommendations}
                onChange={(e) => setConfig({...config, includeRecommendations: e.target.checked})}
                className="rounded"
              />
              <span>Incluir recomendações</span>
            </label>
          </div>
        </div>

        {/* Lista de Contatos */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">👥 Contatos para Envio</h4>
          {contacts.map((contact, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Nome"
                value={contact.name}
                onChange={(e) => {
                  const newContacts = [...contacts];
                  newContacts[index].name = e.target.value;
                  setContacts(newContacts);
                }}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="+55 11 99999-9999"
                value={contact.phone}
                onChange={(e) => {
                  const newContacts = [...contacts];
                  newContacts[index].phone = e.target.value;
                  setContacts(newContacts);
                }}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <select
                value={contact.role}
                onChange={(e) => {
                  const newContacts = [...contacts];
                  newContacts[index].role = e.target.value;
                  setContacts(newContacts);
                }}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="Investidor">Investidor</option>
                <option value="Parceiro">Parceiro</option>
                <option value="Consultor">Consultor</option>
                <option value="Cliente">Cliente</option>
              </select>
              {contacts.length > 1 && (
                <button
                  onClick={() => removeContact(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addContact}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ➕ Adicionar Contato
          </button>
        </div>

        {/* Botões de Ação */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📱 Enviar Relatórios
          </button>
        </div>
      </div>
    </div>
  );
}
