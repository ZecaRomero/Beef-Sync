import { useState, useRef } from "react";
import {
  DocumentArrowUpIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
// XLSX será importado dinamicamente apenas quando necessário

export default function AnimalBulkImport({ isOpen, onClose, onSave }) {
  const [importMode, setImportMode] = useState("manual"); // "manual" ou "excel"
  const [animals, setAnimals] = useState([]);
  const [errors, setErrors] = useState({});
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const defaultAnimal = {
    serie: "",
    rg: "",
    sexo: "",
    era: "", // Nova campo para era/idade
    preco: "",
    observacoes: "",
  };

  const series = ["RPT", "BENT", "CJCJ", "CJCG"];
  const sexos = ["Macho", "Fêmea"];

  const addAnimalRow = () => {
    setAnimals([...animals, { ...defaultAnimal, id: Date.now() }]);
  };

  const removeAnimalRow = (id) => {
    setAnimals(animals.filter(animal => animal.id !== id));
  };

  const updateAnimal = (id, field, value) => {
    setAnimals(animals.map(animal => 
      animal.id === id ? { ...animal, [field]: value } : animal
    ));
  };

  const handleExcelImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Importar XLSX dinamicamente
        const XLSX = await import('xlsx');
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedAnimals = jsonData.map((row, index) => ({
          id: Date.now() + index,
          serie: row.Serie || row.SERIE || row.série || "",
          rg: String(row.RG || row.rg || row.Rg || ""),
          sexo: row.Sexo || row.SEXO || row.sexo || "",
          era: String(row.Era || row.ERA || row.era || row.Idade || row.IDADE || row.idade || ""),
          preco: String(row.Preco || row.PRECO || row.preço || row.Preço || row.Valor || row.VALOR || row.valor || ""),
          observacoes: row.Observacoes || row.OBSERVACOES || row.observações || row.Observações || row.Obs || row.OBS || row.obs || "",
        }));

        setAnimals(importedAnimals);
        alert(`${importedAnimals.length} animais importados do Excel!`);
      } catch (error) {
        console.error("Erro ao importar Excel:", error);
        alert("Erro ao importar arquivo Excel. Verifique o formato do arquivo.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validateAnimals = () => {
    const newErrors = {};
    let hasErrors = false;

    animals.forEach((animal, index) => {
      const animalErrors = {};
      
      if (!animal.serie) {
        animalErrors.serie = "Série obrigatória";
        hasErrors = true;
      }
      
      if (!animal.rg) {
        animalErrors.rg = "RG obrigatório";
        hasErrors = true;
      } else if (animal.rg.length > 6) {
        animalErrors.rg = "RG deve ter no máximo 6 dígitos";
        hasErrors = true;
      }
      
      if (!animal.sexo) {
        animalErrors.sexo = "Sexo obrigatório";
        hasErrors = true;
      }

      if (Object.keys(animalErrors).length > 0) {
        newErrors[animal.id] = animalErrors;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSave = async () => {
    if (animals.length === 0) {
      alert("Adicione pelo menos um animal para salvar.");
      return;
    }

    if (!validateAnimals()) {
      alert("Corrija os erros antes de salvar.");
      return;
    }

    setImporting(true);
    try {
      // Converter dados para o formato esperado pela API
      const animalsToSave = animals.map(animal => ({
        serie: animal.serie,
        rg: animal.rg,
        brinco: `${animal.serie} ${animal.rg}`,
        nome: `${animal.serie} ${animal.rg}`,
        sexo: animal.sexo === "Macho" ? "MACHO" : "FEMEA",
        raca: getDefaultRace(animal.serie),
        status: "ATIVO",
        valorVenda: parseFloat(animal.preco) || null,
        observacoes: animal.observacoes,
        era: animal.era,
        dataNascimento: calculateBirthDate(animal.era),
      }));

      // Salvar em lote
      for (const animal of animalsToSave) {
        await fetch("/api/animals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(animal),
        });
      }

      alert(`${animalsToSave.length} animais salvos com sucesso!`);
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar animais:", error);
      alert("Erro ao salvar animais. Tente novamente.");
    } finally {
      setImporting(false);
    }
  };

  const getDefaultRace = (serie) => {
    const raceMap = {
      'RPT': 'Receptora',
      'BENT': 'Brahman',
      'CJCJ': 'Nelore',
      'CJCG': 'Gir'
    };
    return raceMap[serie] || 'Não definida';
  };

  const calculateBirthDate = (era) => {
    if (!era) return null;
    const months = parseInt(era);
    if (isNaN(months)) return null;
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear(), today.getMonth() - months, today.getDate());
    return birthDate.toISOString().split('T')[0];
  };

  const downloadTemplate = async () => {
    try {
      // Importar XLSX dinamicamente
      const XLSX = await import('xlsx');
      
      const template = [
        {
          Serie: "CJCJ",
          RG: "000001",
          Sexo: "Macho",
          Era: "24",
          Preco: "5000.00",
          Observacoes: "Animal de qualidade"
        },
        {
          Serie: "BENT",
          RG: "000002", 
          Sexo: "Fêmea",
          Era: "18",
          Preco: "4500.00",
          Observacoes: "Boa linhagem"
        }
      ];

      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Animais");
      XLSX.writeFile(wb, "template_animais.xlsx");
    } catch (error) {
      console.error("Erro ao gerar template:", error);
      alert("Erro ao gerar template Excel");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="flex items-center space-x-3">
            <DocumentArrowUpIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                📊 Importação em Lote de Animais
              </h2>
              <p className="text-green-100">
                Cadastre múltiplos animais manualmente ou importe do Excel
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Seletor de Modo */}
          <div className="mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setImportMode("manual")}
                className={`flex-1 px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
                  importMode === "manual"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Cadastro Manual
              </button>
              <button
                onClick={() => setImportMode("excel")}
                className={`flex-1 px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
                  importMode === "excel"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Importar Excel
              </button>
            </div>
          </div>

          {importMode === "excel" && (
            <div className="mb-6 space-y-4">
              {/* Upload de Excel */}
              <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  📁 Importar Planilha Excel
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                      Selecionar Arquivo Excel
                    </button>
                    
                    <button
                      onClick={downloadTemplate}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Baixar Template
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelImport}
                    className="hidden"
                  />

                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-2">📋 Formato esperado da planilha:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Serie</strong>: RPT, BENT, CJCJ, CJCG</li>
                      <li><strong>RG</strong>: Número do registro (até 6 dígitos)</li>
                      <li><strong>Sexo</strong>: Macho ou Fêmea</li>
                      <li><strong>Era</strong>: Idade em meses (opcional)</li>
                      <li><strong>Preco</strong>: Valor do animal (opcional)</li>
                      <li><strong>Observacoes</strong>: Observações (opcional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabela de Animais */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                🐄 Animais para Cadastro ({animals.length})
              </h3>
              {importMode === "manual" && (
                <button
                  onClick={addAnimalRow}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Adicionar Animal
                </button>
              )}
            </div>

            {animals.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🐄</div>
                <div className="text-gray-600 dark:text-gray-400 mb-4">
                  {importMode === "manual" 
                    ? "Nenhum animal adicionado. Clique em 'Adicionar Animal' para começar."
                    : "Nenhum animal importado. Selecione um arquivo Excel para importar."
                  }
                </div>
                {importMode === "manual" && (
                  <button
                    onClick={addAnimalRow}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Adicionar Primeiro Animal
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Série *
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        RG *
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Sexo *
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Era (meses)
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Preço (R$)
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Observações
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal, index) => {
                      const animalErrors = errors[animal.id] || {};
                      const hasErrors = Object.keys(animalErrors).length > 0;
                      
                      return (
                        <tr
                          key={animal.id}
                          className={`border-b border-gray-100 dark:border-gray-800 ${
                            hasErrors ? "bg-red-50 dark:bg-red-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <td className="p-3">
                            <select
                              value={animal.serie}
                              onChange={(e) => updateAnimal(animal.id, "serie", e.target.value)}
                              className={`w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
                                animalErrors.serie ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              <option value="">Selecione...</option>
                              {series.map(serie => (
                                <option key={serie} value={serie}>{serie}</option>
                              ))}
                            </select>
                            {animalErrors.serie && (
                              <p className="text-red-500 text-xs mt-1">{animalErrors.serie}</p>
                            )}
                          </td>
                          
                          <td className="p-3">
                            <input
                              type="text"
                              value={animal.rg}
                              onChange={(e) => updateAnimal(animal.id, "rg", e.target.value)}
                              className={`w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
                                animalErrors.rg ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                              }`}
                              placeholder="000001"
                              maxLength={6}
                            />
                            {animalErrors.rg && (
                              <p className="text-red-500 text-xs mt-1">{animalErrors.rg}</p>
                            )}
                          </td>
                          
                          <td className="p-3">
                            <select
                              value={animal.sexo}
                              onChange={(e) => updateAnimal(animal.id, "sexo", e.target.value)}
                              className={`w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
                                animalErrors.sexo ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              <option value="">Selecione...</option>
                              {sexos.map(sexo => (
                                <option key={sexo} value={sexo}>{sexo}</option>
                              ))}
                            </select>
                            {animalErrors.sexo && (
                              <p className="text-red-500 text-xs mt-1">{animalErrors.sexo}</p>
                            )}
                          </td>
                          
                          <td className="p-3">
                            <input
                              type="number"
                              value={animal.era}
                              onChange={(e) => updateAnimal(animal.id, "era", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              placeholder="24"
                              min="0"
                              max="120"
                            />
                          </td>
                          
                          <td className="p-3">
                            <input
                              type="number"
                              step="0.01"
                              value={animal.preco}
                              onChange={(e) => updateAnimal(animal.id, "preco", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              placeholder="0.00"
                            />
                          </td>
                          
                          <td className="p-3">
                            <input
                              type="text"
                              value={animal.observacoes}
                              onChange={(e) => updateAnimal(animal.id, "observacoes", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              placeholder="Observações..."
                            />
                          </td>
                          
                          <td className="p-3 text-center">
                            {hasErrors ? (
                              <XCircleIcon className="h-5 w-5 text-red-500 mx-auto" title="Dados incompletos" />
                            ) : (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" title="Dados válidos" />
                            )}
                          </td>
                          
                          <td className="p-3 text-center">
                            <button
                              onClick={() => removeAnimalRow(animal.id)}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                              title="Remover animal"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Resumo e Ações */}
          {animals.length > 0 && (
            <div className="mt-6 space-y-4">
              {/* Resumo */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  📊 Resumo da Importação
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {animals.length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {animals.filter(a => !errors[a.id]).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Válidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {Object.keys(errors).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Com Erro</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      R$ {animals.reduce((sum, a) => sum + (parseFloat(a.preco) || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Valor Total</div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={importing || Object.keys(errors).length > 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Salvar {animals.length} Animais
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}