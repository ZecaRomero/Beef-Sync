import { useState, useRef } from "react";
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
// PDF.js será importado dinamicamente apenas no cliente

export default function GTAImporter({ isOpen, onClose, onSave }) {
  const [gtaData, setGtaData] = useState(null);
  const [extractedAnimals, setExtractedAnimals] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo PDF válido.');
      return;
    }

    setProcessing(true);
    setErrors([]);

    try {
      // Importar PDF.js dinamicamente apenas no cliente
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      let fullText = '';
      
      // Extrair texto de todas as páginas
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      setPdfText(fullText);
      
      // Processar o texto extraído
      const processedData = processGTAText(fullText);
      setGtaData(processedData.gta);
      setExtractedAnimals(processedData.animals);

      if (processedData.animals.length === 0) {
        setErrors(['Nenhum animal foi encontrado no PDF. Verifique se o formato está correto.']);
      }

    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      setErrors(['Erro ao processar o arquivo PDF. Verifique se o arquivo não está corrompido.']);
    } finally {
      setProcessing(false);
    }
  };

  const processGTAText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const gta = {
      numero: extractGTANumber(text),
      origem: extractOrigin(text),
      destino: extractDestination(text),
      dataEmissao: extractDate(text),
      finalidade: extractPurpose(text),
      transportador: extractTransporter(text),
    };

    const animals = extractAnimals(text);

    return { gta, animals };
  };

  const extractGTANumber = (text) => {
    // Procurar por padrões como "GTA N°", "GTA Nº", "Número:", etc.
    const patterns = [
      /GTA\s*N[°º]\s*(\d+)/i,
      /GTA\s*N[úu]mero\s*(\d+)/i,
      /N[úu]mero\s*GTA\s*(\d+)/i,
      /N[°º]\s*(\d+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  const extractOrigin = (text) => {
    const patterns = [
      /Origem[:\s]+([^\n]+)/i,
      /Propriedade\s+de\s+origem[:\s]+([^\n]+)/i,
      /Remetente[:\s]+([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractDestination = (text) => {
    const patterns = [
      /Destino[:\s]+([^\n]+)/i,
      /Propriedade\s+de\s+destino[:\s]+([^\n]+)/i,
      /Destinat[áa]rio[:\s]+([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractDate = (text) => {
    // Procurar por datas no formato DD/MM/AAAA
    const datePattern = /(\d{1,2}\/\d{1,2}\/\d{4})/g;
    const dates = text.match(datePattern);
    return dates ? dates[0] : '';
  };

  const extractPurpose = (text) => {
    const patterns = [
      /Finalidade[:\s]+([^\n]+)/i,
      /Motivo[:\s]+([^\n]+)/i,
      /Objetivo[:\s]+([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractTransporter = (text) => {
    const patterns = [
      /Transportador[:\s]+([^\n]+)/i,
      /Condutor[:\s]+([^\n]+)/i,
      /Respons[áa]vel\s+pelo\s+transporte[:\s]+([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractAnimals = (text) => {
    const animals = [];
    const lines = text.split('\n');
    
    // Procurar por padrões de identificação de animais
    // Exemplo: "CJCJ 123456", "BENT 789012", etc.
    const animalPattern = /(CJCJ|BENT|RPT|CJCG)\s+(\d{1,6})/gi;
    const matches = text.matchAll(animalPattern);
    
    for (const match of matches) {
      const serie = match[1].toUpperCase();
      const rg = match[2];
      
      // Tentar extrair informações adicionais próximas ao animal
      const animalInfo = extractAnimalInfo(text, `${serie} ${rg}`);
      
      animals.push({
        id: Date.now() + Math.random(),
        serie,
        rg,
        brinco: `${serie} ${rg}`,
        sexo: animalInfo.sexo || '',
        raca: getDefaultRace(serie),
        idade: animalInfo.idade || '',
        peso: animalInfo.peso || '',
        observacoes: `Importado da GTA ${gtaData?.numero || ''}`,
      });
    }

    // Remover duplicatas baseado no brinco
    const uniqueAnimals = animals.filter((animal, index, self) => 
      index === self.findIndex(a => a.brinco === animal.brinco)
    );

    return uniqueAnimals;
  };

  const extractAnimalInfo = (text, animalId) => {
    // Procurar informações próximas ao ID do animal
    const lines = text.split('\n');
    const animalLineIndex = lines.findIndex(line => line.includes(animalId));
    
    if (animalLineIndex === -1) return {};

    // Verificar linhas próximas para extrair sexo, idade, peso
    const contextLines = lines.slice(
      Math.max(0, animalLineIndex - 2), 
      Math.min(lines.length, animalLineIndex + 3)
    ).join(' ');

    const info = {};

    // Extrair sexo
    if (/macho/i.test(contextLines)) info.sexo = 'Macho';
    else if (/f[êe]mea/i.test(contextLines)) info.sexo = 'Fêmea';

    // Extrair idade (em meses)
    const idadeMatch = contextLines.match(/(\d+)\s*meses?/i);
    if (idadeMatch) info.idade = idadeMatch[1];

    // Extrair peso
    const pesoMatch = contextLines.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
    if (pesoMatch) info.peso = pesoMatch[1].replace(',', '.');

    return info;
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

  const handleSaveAnimals = async () => {
    if (extractedAnimals.length === 0) {
      alert('Nenhum animal para salvar.');
      return;
    }

    setProcessing(true);
    try {
      // Salvar dados da GTA
      if (gtaData) {
        await fetch('/api/gta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gtaData),
        });
      }

      // Salvar animais
      for (const animal of extractedAnimals) {
        const animalData = {
          serie: animal.serie,
          rg: animal.rg,
          brinco: animal.brinco,
          nome: animal.brinco,
          sexo: animal.sexo === 'Macho' ? 'MACHO' : 'FEMEA',
          raca: animal.raca,
          status: 'ATIVO',
          observacoes: animal.observacoes,
        };

        await fetch('/api/animals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(animalData),
        });
      }

      alert(`GTA processada com sucesso! ${extractedAnimals.length} animais importados.`);
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dados da GTA:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                📄 Importar GTA (PDF)
              </h2>
              <p className="text-orange-100">
                Extrair dados de animais de Guia de Trânsito Animal
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
          {/* Upload de PDF */}
          {!gtaData && (
            <div className="bg-orange-50 dark:bg-orange-900 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">
                📁 Selecionar Arquivo GTA (PDF)
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processando PDF...
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                        Selecionar Arquivo PDF
                      </>
                    )}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                />

                <div className="text-sm text-orange-700 dark:text-orange-300">
                  <p className="font-medium mb-2">📋 Informações importantes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Selecione apenas arquivos PDF de GTA</li>
                    <li>O sistema tentará extrair automaticamente os dados dos animais</li>
                    <li>Formatos suportados: CJCJ, BENT, RPT, CJCG + número</li>
                    <li>Verifique os dados extraídos antes de salvar</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Erros */}
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900 rounded-xl p-4 mb-6">
              <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">
                ⚠️ Erros encontrados:
              </h4>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Dados da GTA */}
          {gtaData && (
            <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                📋 Dados da GTA Extraídos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Número:</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">{gtaData.numero || 'Não encontrado'}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Data:</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">{gtaData.dataEmissao || 'Não encontrada'}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Origem:</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">{gtaData.origem || 'Não encontrada'}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Destino:</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">{gtaData.destino || 'Não encontrado'}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Finalidade:</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">{gtaData.finalidade || 'Não encontrada'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Animais Extraídos */}
          {extractedAnimals.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🐄 Animais Extraídos ({extractedAnimals.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Brinco
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Série
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        RG
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Sexo
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Raça
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedAnimals.map((animal) => (
                      <tr
                        key={animal.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-3 font-medium text-gray-900 dark:text-white">
                          {animal.brinco}
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">
                          {animal.serie}
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">
                          {animal.rg}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            animal.sexo === 'Macho'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : animal.sexo === 'Fêmea'
                              ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {animal.sexo || 'Não definido'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">
                          {animal.raca}
                        </td>
                        <td className="p-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" title="Pronto para importar" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Texto Extraído (Debug) */}
          {pdfText && (
            <div className="mt-6">
              <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">
                  🔍 Ver texto extraído do PDF (debug)
                </summary>
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border text-xs font-mono max-h-40 overflow-y-auto">
                  {pdfText}
                </div>
              </details>
            </div>
          )}

          {/* Botões de Ação */}
          {extractedAnimals.length > 0 && (
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAnimals}
                disabled={processing}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Importar {extractedAnimals.length} Animais
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}