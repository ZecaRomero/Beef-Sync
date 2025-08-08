import { useState, useRef } from "react";
import {
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import notificationService from "../services/notificationService";

export default function DirectInvoiceManager({ isOpen, onClose }) {
  const [invoiceData, setInvoiceData] = useState({
    numero: "",
    dataVenda: new Date().toISOString().split('T')[0],
    status: "PENDENTE",
    tipoVenda: "VENDA_DIRETA", // VENDA_DIRETA ou LEILAO
    compradorNome: "",
    compradorCpfCnpj: "",
    compradorEndereco: "",
    compradorCidade: "",
    compradorEstado: "",
    compradorCep: "",
    observacoes: "",
  });

  const [animals, setAnimals] = useState([]);

  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showGTAForm, setShowGTAForm] = useState(false);
  const [gtaNumber, setGtaNumber] = useState('');
  const [emissionDate, setEmissionDate] = useState('');
  const [newAnimal, setNewAnimal] = useState({
    serie: "",
    rg: "",
    sexo: "",
    era: "",
    preco: "",
    raca: "", // Novo campo adicionado
  });

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  const series = ["RPT", "BENT", "CJCJ", "CJCG"];

  const addAnimal = () => {
    if (!newAnimal.serie || !newAnimal.rg || !newAnimal.sexo) {
      alert("Preencha Série, RG e Sexo do animal");
      return;
    }

    // Verificar se já existe animal com mesmo brinco
    const brinco = `${newAnimal.serie} ${newAnimal.rg}`;
    if (animals.find(a => a.brinco === brinco)) {
      alert("Já existe um animal com este brinco na lista");
      return;
    }

    const animal = {
      id: Date.now(),
      serie: newAnimal.serie,
      rg: newAnimal.rg,
      brinco: `${newAnimal.serie} ${newAnimal.rg}`,
      sexo: newAnimal.sexo,
      era: newAnimal.era || null,
      preco: parseFloat(newAnimal.preco) || 0,
      raca: getRacaBySerie(newAnimal.serie),
    };

    setAnimals([...animals, animal]);
    setNewAnimal({
      serie: "",
      rg: "",
      sexo: "",
      era: "",
      preco: "",
    });
  };

  const removeAnimal = (id) => {
    setAnimals(animals.filter(a => a.id !== id));
  };

  const getRacaBySerie = (serie) => {
    const racas = {
      'RPT': 'Receptora',
      'BENT': 'Brahman',
      'CJCJ': 'Nelore',
      'CJCG': 'Gir'
    };
    return racas[serie] || 'Não definida';
  };

  // Função para atualizar raça automaticamente quando série muda
  const handleSerieChange = (serie) => {
    const racaAutomatica = getRacaBySerie(serie);
    setNewAnimal({
      ...newAnimal,
      serie: serie,
      raca: racaAutomatica
    });
  };

  const calculateTotal = () => {
    return animals.reduce((sum, animal) => sum + (animal.preco || 0), 0);
  };

  const handleGTASubmit = async () => {
    if (gtaNumber && emissionDate) {
      const emissionDateObj = new Date(emissionDate);

      try {
        // Criar notificações automáticas de follow-up
        const gtaData = {
          id: `gta-${Date.now()}`, // ID temporário
          numero: gtaNumber,
          dataEmissao: emissionDateObj.toISOString(),
          compradorNome: invoiceData.compradorNome,
          compradorTelefone: invoiceData.compradorCpfCnpj, // Usar CPF/CNPJ como telefone temporariamente
          animais: animals
        };

        // Criar notificações automáticas
        const notifications = await notificationService.createGTAAutomaticNotifications(gtaData);

        alert(`✅ GTA ${gtaNumber} cadastrada com sucesso!\n\n🤖 ${notifications.length} notificações de follow-up criadas:\n• 5 dias antes: Lembrete\n• 20 dias: Confirmação chegada\n• 2 meses: Verificação satisfação\n• 8 meses: Oferta novos animais\n\n📞 Cliente: ${invoiceData.compradorNome || 'A definir'}\n\n🔔 As notificações aparecerão automaticamente no sistema!`);

        setGtaNumber('');
        setEmissionDate('');
        setShowGTAForm(false);
      } catch (error) {
        console.error('Erro ao criar notificações:', error);
        alert(`✅ GTA ${gtaNumber} cadastrada com sucesso!\n\n⚠️ Erro ao criar notificações automáticas. Elas podem ser criadas manualmente.`);
        setGtaNumber('');
        setEmissionDate('');
        setShowGTAForm(false);
      }
    }
  };

  const handleSave = async () => {
    if (!invoiceData.numero || !invoiceData.compradorNome || animals.length === 0) {
      alert("Preencha número da NF, comprador e adicione pelo menos um animal");
      return;
    }

    try {
      // Primeiro, salvar os animais
      const savedAnimals = [];
      for (const animal of animals) {
        const animalData = {
          serie: animal.serie,
          rg: animal.rg,
          brinco: animal.brinco,
          nome: animal.brinco,
          sexo: animal.sexo === "Macho" ? "MACHO" : "FEMEA",
          raca: animal.raca,
          status: "VENDIDO",
          era: animal.era,
          valorVenda: animal.preco,
          observacoes: `Vendido na NF ${invoiceData.numero}`,
          dataNascimento: animal.era ? calculateBirthDate(animal.era) : null,
        };

        const response = await fetch("/api/animals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(animalData),
        });

        if (response.ok) {
          const savedAnimal = await response.json();
          savedAnimals.push({
            id: savedAnimal.id,
            brinco: savedAnimal.brinco,
            nome: savedAnimal.nome,
            raca: savedAnimal.raca,
            sexo: savedAnimal.sexo,
            preco: animal.preco
          });
        }
      }

      // Depois, criar a NF
      const nfData = {
        ...invoiceData,
        tipoVenda: invoiceData.tipoVenda || "VENDA_DIRETA",
        animais: savedAnimals,
        valorTotal: calculateTotal(),
      };

      const nfResponse = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nfData),
      });

      if (nfResponse.ok) {
        alert(`NF ${invoiceData.numero} criada com sucesso! ${animals.length} animais cadastrados.`);
        onClose();
      } else {
        alert("Erro ao criar NF");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar dados");
    }
  };

  const calculateBirthDate = (era) => {
    if (!era) return null;
    const months = parseInt(era);
    if (isNaN(months)) return null;

    const today = new Date();
    const birthDate = new Date(today.getFullYear(), today.getMonth() - months, today.getDate());
    return birthDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                📋 Criar Nota Fiscal
              </h2>
              <p className="text-blue-100">
                Cadastre animais diretamente na NF
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* Dados da NF */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              📄 Dados da Nota Fiscal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Número da NF *
                </label>
                <input
                  type="text"
                  value={invoiceData.numero}
                  onChange={(e) => setInvoiceData({ ...invoiceData, numero: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg font-medium"
                  placeholder="Ex: 001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Tipo de Venda *
                </label>
                <select
                  value={invoiceData.tipoVenda}
                  onChange={(e) => setInvoiceData({ ...invoiceData, tipoVenda: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                >
                  <option value="VENDA_DIRETA">Venda Direta</option>
                  <option value="LEILAO">Leilão</option>
                  <option value="VENDA_ABATE">Venda Abate</option>
                  <option value="VENDA_DESCARTE">Venda Descarte</option>
                  <option value="OUTRO">Outro (Especificar)</option>
                </select>
                {invoiceData.tipoVenda === 'OUTRO' && (
                  <input
                    type="text"
                    placeholder="Especificar tipo de venda..."
                    onChange={(e) => setInvoiceData({ ...invoiceData, tipoVenda: e.target.value })}
                    className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm mt-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Data da Venda *
                </label>
                <input
                  type="date"
                  value={invoiceData.dataVenda}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dataVenda: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Status
                </label>
                <select
                  value={invoiceData.status}
                  onChange={(e) => setInvoiceData({ ...invoiceData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EMITIDA">Emitida</option>
                  <option value="PAGA">Paga</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dados do Comprador */}
          <div className="bg-green-50 dark:bg-green-900 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Dados do Comprador
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Nome/Razão Social *
                </label>
                <input
                  type="text"
                  value={invoiceData.compradorNome}
                  onChange={(e) => setInvoiceData({ ...invoiceData, compradorNome: e.target.value })}
                  className="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                  placeholder="Nome do comprador"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  value={invoiceData.compradorCpfCnpj}
                  onChange={(e) => setInvoiceData({ ...invoiceData, compradorCpfCnpj: e.target.value })}
                  className="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={invoiceData.compradorCidade}
                  onChange={(e) => setInvoiceData({ ...invoiceData, compradorCidade: e.target.value })}
                  className="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                  placeholder="Nome da cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Estado
                </label>
                <select
                  value={invoiceData.compradorEstado}
                  onChange={(e) => setInvoiceData({ ...invoiceData, compradorEstado: e.target.value })}
                  className="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                >
                  <option value="">Selecionar...</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cadastro de Animais */}
          <div className="bg-orange-50 dark:bg-orange-900 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4">
              🐄 Cadastrar Animais na NF
            </h3>

            {/* Formulário para Novo Animal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border-2 border-orange-200 dark:border-orange-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Adicionar Animal Individual</h4>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Série *
                  </label>
                  <select
                    value={newAnimal.serie}
                    onChange={(e) => handleSerieChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione...</option>
                    {series.map(serie => (
                      <option key={serie} value={serie}>{serie}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    RG *
                  </label>
                  <input
                    type="text"
                    value={newAnimal.rg}
                    onChange={(e) => setNewAnimal({ ...newAnimal, rg: e.target.value })}
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="123456"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Raça
                  </label>
                  <input
                    type="text"
                    value={newAnimal.raca}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600"
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sexo *
                  </label>
                  <select
                    value={newAnimal.sexo}
                    onChange={(e) => setNewAnimal({ ...newAnimal, sexo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione...</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Era (meses)
                  </label>
                  <input
                    type="number"
                    value={newAnimal.era}
                    onChange={(e) => setNewAnimal({ ...newAnimal, era: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="24"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAnimal.preco}
                    onChange={(e) => setNewAnimal({ ...newAnimal, preco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="5000.00"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {newAnimal.serie && newAnimal.rg && (
                    <span>Brinco: <strong>{newAnimal.serie} {newAnimal.rg}</strong> | Raça: <strong>{getRacaBySerie(newAnimal.serie)}</strong></span>
                  )}
                </div>
                <button
                  onClick={addAnimal}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Adicionar
                </button>
              </div>
            </div>

            {/* Lista de Animais Adicionados */}
            {animals.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Animais na NF ({animals.length})
                </h4>
                <div className="space-y-2">
                  {animals.map((animal) => (
                    <div key={animal.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium">{animal.brinco}</span>
                          <div className="text-xs text-gray-500">{animal.raca}</div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${animal.sexo === "Macho"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                            }`}>
                            {animal.sexo === "Macho" ? "🐂 Macho" : "🐄 Fêmea"}
                          </span>
                        </div>
                        <div>
                          {animal.era ? `${animal.era} meses` : "N/I"}
                        </div>
                        <div className="font-bold text-green-600">
                          R$ {(animal.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeAnimal(animal.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Remover"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <div className="text-2xl font-bold text-green-600">
                    Total: R$ {(calculateTotal() || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sistema GTA Manual - Substituindo Importação */}
          <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                📋 Cadastro Manual de GTA
              </h3>
              <button
                onClick={() => setShowGTAForm(!showGTAForm)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                {showGTAForm ? 'Cancelar' : '+ Nova GTA'}
              </button>
            </div>

            {showGTAForm && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número da GTA (máx. 7 dígitos)
                    </label>
                    <input
                      type="text"
                      value={gtaNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                        setGtaNumber(value);
                      }}
                      placeholder="1234567"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      maxLength="7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Emissão
                    </label>
                    <input
                      type="date"
                      value={emissionDate}
                      onChange={(e) => setEmissionDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    🤖 Follow-up Automático Pós-Venda:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• <strong>20 dias:</strong> Ligação para confirmar chegada dos animais</li>
                    <li>• <strong>2 meses:</strong> Ligação para verificar satisfação</li>
                    <li>• <strong>8 meses:</strong> Ligação para oferecer novos animais</li>
                  </ul>
                </div>

                <button
                  onClick={handleGTASubmit}
                  disabled={!gtaNumber || !emissionDate}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cadastrar GTA e Ativar Follow-up
                </button>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => setShowBulkAdd(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center shadow-lg"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                📊 Adicionar Lote
              </button>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              📝 Observações
            </h3>
            <textarea
              value={invoiceData.observacoes}
              onChange={(e) => setInvoiceData({ ...invoiceData, observacoes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white"
              rows={3}
              placeholder="Observações sobre a venda..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!invoiceData.numero || !invoiceData.compradorNome || animals.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Criar NF com {animals.length} Animais
            </button>
          </div>
        </div>

        {/* Modal de Adição em Lote */}
        {showBulkAdd && (
          <BulkAddModal
            isOpen={showBulkAdd}
            onClose={() => setShowBulkAdd(false)}
            onAnimalsAdded={(newAnimals) => {
              setAnimals([...animals, ...newAnimals]);
              setShowBulkAdd(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Modal para Adição em Lote
function BulkAddModal({ isOpen, onClose, onAnimalsAdded }) {
  const [bulkAnimals, setBulkAnimals] = useState([
    { id: 1, serie: "", rg: "", sexo: "", era: "", preco: "" }
  ]);

  const addRow = () => {
    setBulkAnimals([...bulkAnimals, {
      id: Date.now(),
      serie: "",
      rg: "",
      sexo: "",
      era: "",
      preco: ""
    }]);
  };

  const removeRow = (id) => {
    setBulkAnimals(bulkAnimals.filter(a => a.id !== id));
  };

  const updateAnimal = (id, field, value) => {
    setBulkAnimals(bulkAnimals.map(animal =>
      animal.id === id ? { ...animal, [field]: value } : animal
    ));
  };

  const getRacaBySerie = (serie) => {
    const racas = {
      'RPT': 'Receptora',
      'BENT': 'Brahman',
      'CJCJ': 'Nelore',
      'CJCG': 'Gir'
    };
    return racas[serie] || 'Não definida';
  };

  const handleSave = () => {
    const validAnimals = bulkAnimals.filter(a => a.serie && a.rg && a.sexo);
    if (validAnimals.length === 0) {
      alert('Preencha pelo menos um animal com Série, RG e Sexo');
      return;
    }

    const formattedAnimals = validAnimals.map(animal => ({
      id: Date.now() + Math.random(),
      serie: animal.serie,
      rg: animal.rg,
      brinco: `${animal.serie} ${animal.rg}`,
      sexo: animal.sexo,
      era: animal.era,
      preco: parseFloat(animal.preco) || 0,
      raca: getRacaBySerie(animal.serie),
    }));

    onAnimalsAdded(formattedAnimals);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="flex items-center space-x-3">
            <PlusIcon className="h-8 w-8 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">📊 Adicionar Lote</h3>
              <p className="text-green-100">Cadastre múltiplos animais de uma vez</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Animais para Adicionar ({bulkAnimals.length})
              </h4>
              <button
                onClick={addRow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Linha
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Série *</th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">RG *</th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Sexo *</th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Era</th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Preço</th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkAnimals.map((animal) => (
                    <tr key={animal.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-3">
                        <select
                          value={animal.serie}
                          onChange={(e) => updateAnimal(animal.id, 'serie', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                        >
                          <option value="">Selecione...</option>
                          <option value="RPT">RPT</option>
                          <option value="BENT">BENT</option>
                          <option value="CJCJ">CJCJ</option>
                          <option value="CJCG">CJCG</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={animal.rg}
                          onChange={(e) => updateAnimal(animal.id, 'rg', e.target.value)}
                          maxLength={6}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                          placeholder="123456"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={animal.sexo}
                          onChange={(e) => updateAnimal(animal.id, 'sexo', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                        >
                          <option value="">Selecione...</option>
                          <option value="Macho">Macho</option>
                          <option value="Fêmea">Fêmea</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={animal.era}
                          onChange={(e) => updateAnimal(animal.id, 'era', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                          placeholder="24"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          value={animal.preco}
                          onChange={(e) => updateAnimal(animal.id, 'preco', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                          placeholder="5000.00"
                        />
                      </td>
                      <td className="p-3 text-center">
                        {bulkAnimals.length > 1 && (
                          <button
                            onClick={() => removeRow(animal.id)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📥 Adicionar Animais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
