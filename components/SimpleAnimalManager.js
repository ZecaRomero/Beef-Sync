import { useState, useEffect } from "react";
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import AnimalForm from "./AnimalForm";

export default function SimpleAnimalManager({ isOpen, onClose }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAnimals();
    }
  }, [isOpen]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/animals");
      if (response.ok) {
        const data = await response.json();
        setAnimals(data);
      } else {
        console.error("Erro ao carregar animais");
      }
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnimal = async (animalData) => {
    try {
      const url = editingAnimal ? `/api/animals/${editingAnimal.id}` : "/api/animals";
      const method = editingAnimal ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(animalData),
      });

      if (response.ok) {
        loadAnimals();
        setShowAnimalForm(false);
        setEditingAnimal(null);
        alert(editingAnimal ? "Animal atualizado!" : "Animal salvo!");
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro ao salvar animal:", error);
      alert("Erro ao salvar animal");
    }
  };

  const handleEditAnimal = (animal) => {
    setEditingAnimal(animal);
    setShowAnimalForm(true);
  };

  const handleDeleteAnimal = async (animalId) => {
    if (confirm("Excluir este animal?")) {
      try {
        const response = await fetch(`/api/animals/${animalId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          loadAnimals();
          alert("Animal excluído!");
        } else {
          alert("Erro ao excluir");
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                🐄 Cadastro de Animais
              </h2>
              <p className="text-green-100">
                Série • RG • Sexo • Era • Preço
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setEditingAnimal(null);
                setShowAnimalForm(true);
              }}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center font-medium"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Animal
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Lista de Animais */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                🐄 Animais Cadastrados ({animals.length})
              </h3>
              <button
                onClick={() => {
                  setEditingAnimal(null);
                  setShowAnimalForm(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Novo
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <div className="text-gray-600 dark:text-gray-400">
                  Carregando...
                </div>
              </div>
            ) : animals.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🐄</div>
                <div className="text-gray-600 dark:text-gray-400 mb-4">
                  Nenhum animal cadastrado
                </div>
                <button
                  onClick={() => {
                    setEditingAnimal(null);
                    setShowAnimalForm(true);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Cadastrar Primeiro Animal
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                        Série
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                        RG
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                        Sexo
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                        Era
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                        Preço
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal) => (
                      <tr
                        key={animal.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-4">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">
                            {animal.serie || animal.brinco?.split(' ')[0]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {animal.raca}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                            {animal.rg || animal.brinco?.split(' ')[1]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {animal.brinco}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              animal.sexo === "MACHO"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                            }`}
                          >
                            {animal.sexo === "MACHO" ? "🐂 Macho" : "🐄 Fêmea"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {animal.era ? `${animal.era}m` : "N/I"}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="font-bold text-green-600 dark:text-green-400">
                            {animal.valorVenda 
                              ? `R$ ${animal.valorVenda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` 
                              : "N/I"
                            }
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              animal.status === "ATIVO"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : animal.status === "VENDIDO"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {animal.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditAnimal(animal)}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnimal(animal.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal do Formulário */}
        <AnimalForm
          animal={editingAnimal}
          isOpen={showAnimalForm}
          onClose={() => {
            setShowAnimalForm(false);
            setEditingAnimal(null);
          }}
          onSave={handleSaveAnimal}
        />
      </div>
    </div>
  );
}