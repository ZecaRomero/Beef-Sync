import { useState, useRef } from "react";
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CloudArrowUpIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function SmartGTAImporter({ isOpen, onClose }) {
  const [importMode, setImportMode] = useState("upload"); // "upload", "camera", "manual"
  const [gtaData, setGtaData] = useState(null);
  const [extractedAnimals, setExtractedAnimals] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [errors, setErrors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);

  const handlePDFUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo PDF válido.');
      return;
    }

    setProcessing(true);
    setErrors([]);
    setSuggestions([]);

    try {
      // Importar PDF.js dinamicamente
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
      
      // Processar o texto extraído com IA melhorada
      const processedData = await processGTAWithAI(fullText);
      setGtaData(processedData.gta);
      setExtractedAnimals(processedData.animals);
      setSuggestions(processedData.suggestions);

      if (processedData.animals.length === 0) {
        setErrors(['Nenhum animal foi encontrado no PDF. Tente o modo manual ou verifique o arquivo.']);
      } else {
        setSuggestions([
          `✅ Encontrados ${processedData.animals.length} animais`,
          `📋 GTA ${processedData.gta.numero || 'identificada'}`,
          `🚚 Origem: ${processedData.gta.origem || 'detectada'}`,
          `📍 Destino: ${processedData.gta.destino || 'detectado'}`
        ]);
      }

    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      setErrors(['Erro ao processar o arquivo PDF. Tente o modo manual ou verifique se o arquivo não está corrompido.']);
    } finally {
      setProcessing(false);
    }
  };

  const processGTAWithAI = async (text) => {
    // Processamento inteligente melhorado
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const gta = {
      numero: extractGTANumber(text),
      origem: extractOrigin(text),
      destino: extractDestination(text),
      dataEmissao: extractDate(text),
      finalidade: extractPurpose(text),
      transportador: extractTransporter(text),
      proprietario: extractOwner(text),
      veterinario: extractVeterinarian(text),
    };

    const animals = await extractAnimalsWithAI(text);
    const suggestions = generateSmartSuggestions(gta, animals, text);

    return { gta, animals, suggestions };
  };

  const extractGTANumber = (text) => {
    const patterns = [
      /GTA\s*N[°º]\s*(\d+)/i,
      /GTA\s*N[úu]mero\s*(\d+)/i,
      /N[úu]mero\s*GTA\s*(\d+)/i,
      /N[°º]\s*(\d+)/i,
      /Guia\s*N[°º]\s*(\d+)/i,
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
      /Fazenda\s+origem[:\s]+([^\n]+)/i,
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
      /Fazenda\s+destino[:\s]+([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractDate = (text) => {
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

  const extractOwner = (text) => {
    const patterns = [
      /Propriet[áa]rio[:\s]+([^\n]+)/i,
      /Dono[:\s]+([^\n]+)/i,
      /Respons[áa]vel[:\s]+([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractVeterinarian = (text) => {
    const patterns = [
      /Veterin[áa]rio[:\s]+([^\n]+)/i,
      /M[ée]dico\s+veterin[áa]rio[:\s]+([^\n]+)/i,
      /CRMV[:\s]+([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractAnimalsWithAI = async (text) => {
    const animals = [];
    
    // Padrões melhorados para identificação de animais
    const animalPatterns = [
      /(CJCJ|BENT|RPT|CJCG)\s+(\d{1,6})/gi,
      /(\d{1,6})\s+(CJCJ|BENT|RPT|CJCG)/gi,
      /Brinco[:\s]+(CJCJ|BENT|RPT|CJCG)\s+(\d{1,6})/gi,
    ];
    
    const foundAnimals = new Set();
    
    for (const pattern of animalPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        let serie, rg;
        if (match[1] && /^[A-Z]+$/.test(match[1])) {
          serie = match[1].toUpperCase();
          rg = match[2];
        } else {
          serie = match[2].toUpperCase();
          rg = match[1];
        }
        
        const brinco = `${serie} ${rg}`;
        if (!foundAnimals.has(brinco)) {
          foundAnimals.add(brinco);
          
          // Extrair informações adicionais próximas ao animal
          const animalInfo = extractAnimalInfo(text, brinco);
          
          animals.push({
            id: Date.now() + Math.random(),
            serie,
            rg,
            brinco,
            sexo: animalInfo.sexo || '',
            raca: getDefaultRace(serie),
            idade: animalInfo.idade || '',
            peso: animalInfo.peso || '',
            observacoes: `Importado da GTA ${gtaData?.numero || ''}`,
            confianca: animalInfo.confianca || 'Alta',
          });
        }
      }
    }

    return animals;
  };

  const extractAnimalInfo = (text, animalId) => {
    const lines = text.split('\n');
    const animalLineIndex = lines.findIndex(line => line.includes(animalId));
    
    if (animalLineIndex === -1) return { confianca: 'Baixa' };

    const contextLines = lines.slice(
      Math.max(0, animalLineIndex - 3), 
      Math.min(lines.length, animalLineIndex + 4)
    ).join(' ');

    const info = { confianca: 'Alta' };

    // Extrair sexo com padrões melhorados
    if (/\b(macho|touro|boi)\b/i.test(contextLines)) info.sexo = 'Macho';
    else if (/\b(f[êe]mea|vaca|novilha)\b/i.test(contextLines)) info.sexo = 'Fêmea';

    // Extrair idade
    const idadeMatch = contextLines.match(/(\d+)\s*(meses?|anos?)/i);
    if (idadeMatch) {
      const valor = parseInt(idadeMatch[1]);
      const unidade = idadeMatch[2].toLowerCase();
      info.idade = unidade.includes('ano') ? valor * 12 : valor;
    }

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

  const generateSmartSuggestions = (gta, animals, text) => {
    const suggestions = [];
    
    if (animals.length > 0) {
      suggestions.push(`🎯 Detectados ${animals.length} animais automaticamente`);
      
      const series = [...new Set(animals.map(a => a.serie))];
      suggestions.push(`📊 Séries encontradas: ${series.join(', ')}`);
      
      const withSex = animals.filter(a => a.sexo).length;
      if (withSex > 0) {
        suggestions.push(`⚧ Sexo identificado em ${withSex} animais`);
      }
    }
    
    if (gta.numero) {
      suggestions.push(`📋 GTA ${gta.numero} processada com sucesso`);
    }
    
    if (text.length > 1000) {
      suggestions.push(`📄 Documento extenso analisado (${Math.round(text.length/1000)}k caracteres)`);
    }
    
    return suggestions;
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Câmera traseira
      });
      
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Use o modo de upload.');
    }
  };

  const handleManualEntry = () => {
    setImportMode("manual");
    setExtractedAnimals([{
      id: Date.now(),
      serie: "",
      rg: "",
      brinco: "",
      sexo: "",
      raca: "",
      idade: "",
      peso: "",
      observacoes: "Entrada manual",
      confianca: "Manual",
    }]);
  };

  const updateAnimal = (id, field, value) => {
    setExtractedAnimals(animals => 
      animals.map(animal => 
        animal.id === id 
          ? { 
              ...animal, 
              [field]: value,
              brinco: field === 'serie' || field === 'rg' 
                ? `${field === 'serie' ? value : animal.serie} ${field === 'rg' ? value : animal.rg}`
                : animal.brinco,
              raca: field === 'serie' ? getDefaultRace(value) : animal.raca
            }
          : animal
      )
    );
  };

  const addManualAnimal = () => {
    const newAnimal = {
      id: Date.now(),
      serie: "",
      rg: "",
      brinco: "",
      sexo: "",
      raca: "",
      idade: "",
      peso: "",
      observacoes: "Entrada manual",
      confianca: "Manual",
    };
    setExtractedAnimals([...extractedAnimals, newAnimal]);
  };

  const removeAnimal = (id) => {
    setExtractedAnimals(animals => animals.filter(a => a.id !== id));
  };

  const handleSaveAnimals = async () => {
    if (extractedAnimals.length === 0) {
      alert('Nenhum animal para salvar.');
      return;
    }

    setProcessing(true);
    try {
      // Salvar dados da GTA se existir
      if (gtaData && gtaData.numero) {
        await fetch('/api/gta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gtaData),
        });
      }

      // Salvar animais
      let savedCount = 0;
      for (const animal of extractedAnimals) {
        if (!animal.serie || !animal.rg) continue;
        
        const animalData = {
          serie: animal.serie,
          rg: animal.rg,
          brinco: animal.brinco,
          nome: animal.brinco,
          sexo: animal.sexo === 'Macho' ? 'MACHO' : 'FEMEA',
          raca: animal.raca,
          status: 'ATIVO',
          era: animal.idade,
          observacoes: animal.observacoes,
        };

        const response = await fetch('/api/animals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(animalData),
        });

        if (response.ok) {
          savedCount++;
        }
      }

      alert(`✅ Importação concluída!\n${savedCount} animais salvos com sucesso.`);
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                🚀 Smart GTA Importer
              </h2>
              <p className="text-orange-100">
                IA Avançada para Importação de GTA
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
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
              <button
                onClick={() => setImportMode("upload")}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  importMode === "upload"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                📄 Upload PDF
              </button>
              <button
                onClick={() => {
                  setImportMode("camera");
                  handleCameraCapture();
                }}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  importMode === "camera"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <CameraIcon className="h-5 w-5 mr-2" />
                📸 Câmera
              </button>
              <button
                onClick={handleManualEntry}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  importMode === "manual"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                ✏️ Manual
              </button>
            </div>
          </div>

          {/* Upload de PDF */}
          {importMode === "upload" && !gtaData && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-8 mb-6 border-2 border-dashed border-blue-300 dark:border-blue-600">
              <div className="text-center">
                <CloudArrowUpIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  🤖 Importação Inteligente de GTA
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center mx-auto disabled:opacity-50 shadow-lg"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        🧠 Processando com IA...
                      </>
                    ) : (
                      <>
                        <DocumentArrowUpIcon className="h-6 w-6 mr-3" />
                        📄 Selecionar PDF da GTA
                      </>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handlePDFUpload(e.target.files[0])}
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">🎯 IA Detecta Automaticamente:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Número da GTA</li>
                        <li>• Origem e Destino</li>
                        <li>• Animais (Série + RG)</li>
                        <li>• Sexo dos animais</li>
                        <li>• Idade e peso</li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">✨ Recursos Avançados:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Correção automática de erros</li>
                        <li>• Sugestões inteligentes</li>
                        <li>• Validação de dados</li>
                        <li>• Preview antes de salvar</li>
                        <li>• Histórico de importações</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modo Câmera */}
          {importMode === "camera" && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                📸 Captura por Câmera
              </h3>
              <div className="text-center">
                <video
                  ref={cameraRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-300 dark:border-gray-600"
                />
                <div className="mt-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    📷 Capturar GTA
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  🚧 Funcionalidade em desenvolvimento
                </p>
              </div>
            </div>
          )}

          {/* Sugestões da IA */}
          {suggestions.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-700">
              <h4 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                🤖 Sugestões da IA
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center text-green-800 dark:text-green-200">
                    <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dados da GTA Extraídos */}
          {gtaData && (
            <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                📋 Dados da GTA Extraídos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Número:</span>
                  <div className="text-blue-700 dark:text-blue-300 font-mono text-lg">
                    {gtaData.numero || 'Não encontrado'}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Data:</span>
                  <div className="text-blue-700 dark:text-blue-300">
                    {gtaData.dataEmissao || 'Não encontrada'}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Origem:</span>
                  <div className="text-blue-700 dark:text-blue-300">
                    {gtaData.origem || 'Não encontrada'}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Destino:</span>
                  <div className="text-blue-700 dark:text-blue-300">
                    {gtaData.destino || 'Não encontrado'}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Finalidade:</span>
                  <div className="text-blue-700 dark:text-blue-300">
                    {gtaData.finalidade || 'Não encontrada'}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Transportador:</span>
                  <div className="text-blue-700 dark:text-blue-300">
                    {gtaData.transportador || 'Não encontrado'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animais Extraídos/Manuais */}
          {extractedAnimals.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  🐄 Animais Detectados ({extractedAnimals.length})
                </h3>
                {importMode === "manual" && (
                  <button
                    onClick={addManualAnimal}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Adicionar
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Série</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">RG</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Brinco</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Sexo</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Raça</th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Confiança</th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedAnimals.map((animal) => (
                      <tr key={animal.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="p-3">
                          {importMode === "manual" ? (
                            <select
                              value={animal.serie}
                              onChange={(e) => updateAnimal(animal.id, 'serie', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                            >
                              <option value="">Selecione...</option>
                              <option value="RPT">RPT</option>
                              <option value="BENT">BENT</option>
                              <option value="CJCJ">CJCJ</option>
                              <option value="CJCG">CJCG</option>
                            </select>
                          ) : (
                            <span className="font-bold text-lg">{animal.serie}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {importMode === "manual" ? (
                            <input
                              type="text"
                              value={animal.rg}
                              onChange={(e) => updateAnimal(animal.id, 'rg', e.target.value)}
                              maxLength={6}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              placeholder="123456"
                            />
                          ) : (
                            <span className="font-mono text-lg font-bold">{animal.rg}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-gray-900 dark:text-white">
                            {animal.brinco}
                          </span>
                        </td>
                        <td className="p-3">
                          {importMode === "manual" ? (
                            <select
                              value={animal.sexo}
                              onChange={(e) => updateAnimal(animal.id, 'sexo', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                            >
                              <option value="">Selecione...</option>
                              <option value="Macho">Macho</option>
                              <option value="Fêmea">Fêmea</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              animal.sexo === 'Macho'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : animal.sexo === 'Fêmea'
                                ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {animal.sexo || 'Não definido'}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">
                          {animal.raca}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            animal.confianca === 'Alta'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : animal.confianca === 'Manual'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {animal.confianca}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {importMode === "manual" && (
                            <button
                              onClick={() => removeAnimal(animal.id)}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                              title="Remover animal"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Erros */}
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900 rounded-xl p-4 mb-6 border border-red-200 dark:border-red-700">
              <h4 className="text-red-800 dark:text-red-200 font-medium mb-2 flex items-center">
                <XCircleIcon className="h-5 w-5 mr-2" />
                ⚠️ Problemas Encontrados:
              </h4>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botões de Ação */}
          {extractedAnimals.length > 0 && (
            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAnimals}
                disabled={processing}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-medium disabled:opacity-50 flex items-center shadow-lg"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    🚀 Importar {extractedAnimals.length} Animais
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