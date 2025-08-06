import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Constantes para o formulário
const series = [
  { value: 'RPT', label: 'RPT - Receptora', raca: 'Receptora' },
  { value: 'BENT', label: 'BENT - Brahman', raca: 'Brahman' },
  { value: 'CJCJ', label: 'CJCJ - Nelore', raca: 'Nelore' },
  { value: 'CJCG', label: 'CJCG - Gir', raca: 'Gir' }
];

export default function AnimalForm({ animal, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    serie: "",
    rg: "",
    sexo: "",
    era: "",
    preco: "",
    observacoes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (animal) {
      setFormData({
        serie: animal.serie || "",
        rg: animal.rg || "",
        sexo: animal.sexo === "MACHO" ? "Macho" : "Fêmea",
        era: animal.era || "",
        preco: animal.valorVenda || "",
        observacoes: animal.observacoes || "",
      });
    } else {
      setFormData({
        serie: "",
        rg: "",
        sexo: "",
        era: "",
        preco: "",
        observacoes: "",
      });
    }
  }, [animal]);



  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.serie) {
      newErrors.serie = "Série é obrigatória (RPT, BENT, CJCJ, CJCG)";
    } else if (!["RPT", "BENT", "CJCJ", "CJCG"].includes(formData.serie)) {
      newErrors.serie = "Série deve ser RPT, BENT, CJCJ ou CJCG";
    }

    if (!formData.rg) {
      newErrors.rg = "RG é obrigatório";
    } else if (formData.rg.length > 6) {
      newErrors.rg = "RG deve ter no máximo 6 dígitos";
    } else if (!/^\d+$/.test(formData.rg)) {
      newErrors.rg = "RG deve conter apenas números";
    }

    if (!formData.sexo) {
      newErrors.sexo = "Sexo é obrigatório (Macho ou Fêmea)";
    } else if (!["Macho", "Fêmea"].includes(formData.sexo)) {
      newErrors.sexo = "Sexo deve ser Macho ou Fêmea";
    }

    // Validações opcionais (se preenchidas)
    if (formData.era && (isNaN(formData.era) || formData.era < 0 || formData.era > 120)) {
      newErrors.era = "Era deve ser um número entre 0 e 120 meses";
    }

    if (formData.preco && (isNaN(formData.preco) || formData.preco < 0)) {
      newErrors.preco = "Preço deve ser um valor positivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Converter dados para o formato esperado pela API
      const animalData = {
        // Campos obrigatórios
        serie: formData.serie.toUpperCase(),
        rg: formData.rg,
        brinco: `${formData.serie.toUpperCase()} ${formData.rg}`,
        nome: `${formData.serie.toUpperCase()} ${formData.rg}`, // Nome igual ao brinco
        sexo: formData.sexo === "Macho" ? "MACHO" : "FEMEA",
        raca: getDefaultRace(formData.serie), // Raça baseada na série
        status: "ATIVO", // Status padrão
        
        // Campos opcionais
        era: formData.era || null,
        valorVenda: formData.preco ? parseFloat(formData.preco) : null,
        observacoes: formData.observacoes || null,
        
        // Campos auto-calculados
        dataNascimento: calculateBirthDate(formData.era),
        
        // Metadados
        createdAt: new Date().toISOString(),
      };
      
      console.log("Dados do animal a serem salvos:", animalData);
      onSave(animalData);
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {animal ? "Editar Animal" : "Novo Animal"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campos Obrigatórios */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
            <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-6 flex items-center">
              ⭐ Campos Obrigatórios
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Série */}
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-200 mb-3">
                  SÉRIE *
                </label>
                <select
                  value={formData.serie}
                  onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 dark:bg-gray-700 dark:text-white text-lg font-medium ${
                    errors.serie ? "border-red-500 bg-red-50" : "border-blue-300 dark:border-blue-600"
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="RPT">RPT</option>
                  <option value="BENT">BENT</option>
                  <option value="CJCJ">CJCJ</option>
                  <option value="CJCG">CJCG</option>
                </select>
                {errors.serie && (
                  <p className="text-red-600 text-sm mt-2 font-medium">⚠️ {errors.serie}</p>
                )}
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2 font-medium">
                  {formData.serie === "RPT" && "Receptora"}
                  {formData.serie === "BENT" && "Brahman"}
                  {formData.serie === "CJCJ" && "Nelore"}
                  {formData.serie === "CJCG" && "Gir"}
                </p>
              </div>

              {/* RG */}
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-200 mb-3">
                  RG (REGISTRO) *
                </label>
                <input
                  type="text"
                  value={formData.rg}
                  onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                  maxLength={6}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 dark:bg-gray-700 dark:text-white text-lg font-mono ${
                    errors.rg ? "border-red-500 bg-red-50" : "border-blue-300 dark:border-blue-600"
                  }`}
                  placeholder="123456"
                />
                {errors.rg && (
                  <p className="text-red-600 text-sm mt-2 font-medium">⚠️ {errors.rg}</p>
                )}
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2 font-medium">
                  Até 6 dígitos
                </p>
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-200 mb-3">
                  SEXO *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sexo: "Macho" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-base font-bold ${
                      formData.sexo === "Macho"
                        ? "border-blue-500 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 shadow-lg scale-105"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    }`}
                  >
                    🐂<br/>MACHO
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sexo: "Fêmea" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-base font-bold ${
                      formData.sexo === "Fêmea"
                        ? "border-pink-500 bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-200 shadow-lg scale-105"
                        : "border-gray-300 dark:border-gray-600 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30"
                    }`}
                  >
                    🐄<br/>FÊMEA
                  </button>
                </div>
                {errors.sexo && (
                  <p className="text-red-600 text-sm mt-2 font-medium">⚠️ {errors.sexo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Campos Opcionais */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
            <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-6 flex items-center">
              📝 Campos Opcionais
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Era */}
              <div>
                <label className="block text-sm font-bold text-green-800 dark:text-green-200 mb-3">
                  ERA (IDADE EM MESES)
                </label>
                <input
                  type="number"
                  value={formData.era}
                  onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-green-300 dark:border-green-600 rounded-xl focus:ring-4 focus:ring-green-300 dark:bg-gray-700 dark:text-white text-lg font-medium"
                  placeholder="24"
                  min="0"
                  max="120"
                />
                <p className="text-xs text-green-600 dark:text-green-300 mt-2 font-medium">
                  Idade do animal em meses (0-120)
                </p>
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-bold text-green-800 dark:text-green-200 mb-3">
                  PREÇO (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-green-300 dark:border-green-600 rounded-xl focus:ring-4 focus:ring-green-300 dark:bg-gray-700 dark:text-white text-lg font-medium"
                  placeholder="5000.00"
                />
                <p className="text-xs text-green-600 dark:text-green-300 mt-2 font-medium">
                  Valor do animal em reais
                </p>
              </div>
            </div>

            {/* Observações */}
            <div className="mt-6">
              <label className="block text-sm font-bold text-green-800 dark:text-green-200 mb-3">
                OBSERVAÇÕES
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full px-4 py-4 border-2 border-green-300 dark:border-green-600 rounded-xl focus:ring-4 focus:ring-green-300 dark:bg-gray-700 dark:text-white text-base"
                rows={4}
                placeholder="Informações adicionais sobre o animal..."
              />
              <p className="text-xs text-green-600 dark:text-green-300 mt-2 font-medium">
                Texto livre para observações
              </p>
            </div>
          </div>

          {/* Preview do Animal */}
          {(formData.serie && formData.rg) && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
              <h4 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
                👁️ Preview do Animal
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2">BRINCO</div>
                  <div className="text-2xl font-mono font-bold text-purple-900 dark:text-purple-100 bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-purple-300">
                    {formData.serie} {formData.rg}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2">RAÇA</div>
                  <div className="text-lg font-bold text-purple-900 dark:text-purple-100 bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-purple-300">
                    {getDefaultRace(formData.serie)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2">SEXO</div>
                  <div className="text-lg font-bold text-purple-900 dark:text-purple-100 bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-purple-300">
                    {formData.sexo || "Não definido"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2">ERA</div>
                  <div className="text-lg font-bold text-purple-900 dark:text-purple-100 bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-purple-300">
                    {formData.era ? `${formData.era}m` : "N/I"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2">PREÇO</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-purple-300">
                    {formData.preco ? `R$ ${parseFloat(formData.preco).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : "N/I"}
                  </div>
                </div>
              </div>
              
              {/* Status Auto-gerado */}
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-300">
                <h5 className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2">🔧 DADOS AUTO-GERADOS:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700 dark:text-purple-300">Nome:</span>
                    <div className="font-mono text-purple-900 dark:text-purple-100">{formData.serie} {formData.rg}</div>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700 dark:text-purple-300">Status:</span>
                    <div className="text-green-600 font-bold">ATIVO</div>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700 dark:text-purple-300">Data Nasc:</span>
                    <div className="text-purple-900 dark:text-purple-100">
                      {formData.era ? "Calculada" : "N/I"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700 dark:text-purple-300">Brinco Único:</span>
                    <div className="text-green-600 font-bold">✓ Validado</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumo de Validações */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              ✅ Status de Validação
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className={`text-2xl mb-2 ${formData.serie ? "text-green-500" : "text-red-500"}`}>
                  {formData.serie ? "✅" : "❌"}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Série {formData.serie ? "✓" : "(obrigatório)"}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl mb-2 ${formData.rg && formData.rg.length <= 6 ? "text-green-500" : "text-red-500"}`}>
                  {formData.rg && formData.rg.length <= 6 ? "✅" : "❌"}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  RG {formData.rg && formData.rg.length <= 6 ? "✓" : "(obrigatório)"}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl mb-2 ${formData.sexo ? "text-green-500" : "text-red-500"}`}>
                  {formData.sexo ? "✅" : "❌"}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sexo {formData.sexo ? "✓" : "(obrigatório)"}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl mb-2 ${formData.era ? "text-blue-500" : "text-gray-400"}`}>
                  {formData.era ? "📅" : "⚪"}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Era {formData.era ? "✓" : "(opcional)"}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl mb-2 ${formData.preco ? "text-green-500" : "text-gray-400"}`}>
                  {formData.preco ? "💰" : "⚪"}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preço {formData.preco ? "✓" : "(opcional)"}
                </div>
              </div>
            </div>
            
            {/* Indicador de Brinco Único */}
            {formData.serie && formData.rg && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg border border-green-300 dark:border-green-700">
                <div className="flex items-center justify-center">
                  <div className="text-green-600 dark:text-green-400 font-bold">
                    🎯 Brinco único será: <span className="font-mono text-lg">{formData.serie} {formData.rg}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="font-medium">Campos obrigatórios: Série, RG, Sexo</div>
              <div>Campos opcionais: Era, Preço, Observações</div>
            </div>
            <div className="flex space-x-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-bold text-lg"
              >
                ❌ Cancelar
              </button>
              <button 
                type="submit" 
                disabled={!formData.serie || !formData.rg || !formData.sexo}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold text-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {animal ? "✏️ ATUALIZAR ANIMAL" : "💾 SALVAR ANIMAL"}
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
