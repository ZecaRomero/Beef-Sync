import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  PaperAirplaneIcon, 
  PlusIcon, 
  TrashIcon, 
  UserGroupIcon,
  CheckIcon 
} from "@heroicons/react/24/outline";

export default function WhatsAppMultiSender({ isOpen, onClose, reportMessage }) {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Luciano Abramo Ciambelli", number: "+55 11 99999-1234", selected: false },
    { id: 2, name: "Dona Monica", number: "+55 16 98888-5678", selected: false },
    { id: 3, name: "Carlos Mendes", number: "+55 17 97777-9999", selected: false },
    { id: 4, name: "Ana Costa", number: "+55 31 96666-7890", selected: false },
  ]);
  
  const [newContact, setNewContact] = useState({ name: "", number: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [sending, setSending] = useState(false);

  const handleToggleContact = (id) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, selected: !contact.selected }
        : contact
    ));
  };

  const handleSelectAll = () => {
    const allSelected = contacts.every(c => c.selected);
    setContacts(contacts.map(contact => ({
      ...contact,
      selected: !allSelected
    })));
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.number) {
      const newId = Math.max(...contacts.map(c => c.id)) + 1;
      setContacts([...contacts, {
        id: newId,
        name: newContact.name,
        number: newContact.number,
        selected: true
      }]);
      setNewContact({ name: "", number: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleSendToSelected = async () => {
    const selectedContacts = contacts.filter(c => c.selected);
    
    if (selectedContacts.length === 0) {
      alert("Selecione pelo menos um contato para enviar!");
      return;
    }

    setSending(true);
    
    try {
      const promises = selectedContacts.map(async (contact) => {
        const response = await fetch('/api/whatsapp/send-bi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            number: contact.number,
            message: reportMessage,
            contactName: contact.name
          })
        });
        
        return { contact, success: response.ok };
      });

      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;
      const failed = results.length - successful;

      if (successful > 0) {
        alert(`✅ Relatório enviado com sucesso para ${successful} contato(s)!${failed > 0 ? ` (${failed} falharam)` : ''}`);
      } else {
        alert("❌ Erro ao enviar para todos os contatos.");
      }

      if (successful > 0) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      alert('Erro ao enviar relatórios via WhatsApp');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const selectedCount = contacts.filter(c => c.selected).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                📱 Enviar Relatório BI
              </h2>
              <p className="text-green-100">
                Selecione os contatos para envio
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Controles */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {contacts.every(c => c.selected) ? "Desmarcar Todos" : "Selecionar Todos"}
              </Button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCount} de {contacts.length} selecionados
              </span>
            </div>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Contato
            </Button>
          </div>

          {/* Formulário para Novo Contato */}
          {showAddForm && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Adicionar Novo Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome do contato"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
                <Input
                  placeholder="+55 11 99999-9999"
                  value={newContact.number}
                  onChange={(e) => setNewContact({...newContact, number: e.target.value})}
                />
              </div>
              <div className="flex space-x-2 mt-3">
                <Button
                  onClick={handleAddContact}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Adicionar
                </Button>
                <Button
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de Contatos */}
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  contact.selected
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                }`}
                onClick={() => handleToggleContact(contact.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    contact.selected
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}>
                    {contact.selected && (
                      <CheckIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.number}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveContact(contact.id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Preview do Relatório */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📋 Preview do Relatório
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {reportMessage?.substring(0, 300)}...
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCount > 0 ? (
              <span className="text-green-600 dark:text-green-400 font-semibold">
                ✅ {selectedCount} contato(s) selecionado(s)
              </span>
            ) : (
              <span>Nenhum contato selecionado</span>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleSendToSelected}
              disabled={selectedCount === 0 || sending}
              className="bg-green-600 hover:bg-green-700"
            >
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              {sending ? "Enviando..." : `Enviar para ${selectedCount} contato(s)`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}