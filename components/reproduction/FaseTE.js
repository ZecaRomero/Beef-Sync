import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';

const FaseTE = ({ process, onUpdate }) => {
  const [formData, setFormData] = useState({
    data: '',
    local: '',
    receptoras: [],
    veterinario: '',
    observacoes: '',
    realizada: false
  });

  useEffect(() => {
    if (process.faseTE) {
      setFormData(process.faseTE);
    } else if (process.faseColeta?.data && process.faseFIV?.realizada) {
      // Auto-preencher data (7 dias após coleta) e receptoras baseado na quantidade de embriões
      const teDate = new Date(process.faseColeta.data);
      teDate.setDate(teDate.getDate() + 7);
      
      // Calcular total de embriões da nova estrutura
      let totalEmbrioes = 0;
      if (process.faseFIV.totalEmbrioes) {
        totalEmbrioes = process.faseFIV.totalEmbrioes;
      } else if (process.faseFIV.resultadosFIV) {
        totalEmbrioes = process.faseFIV.resultadosFIV.reduce((total, r) => 
          total + (parseInt(r.quantidadeEmbrioes) || 0), 0
        );
      }
      
      const receptoras = [];
      for (let i = 0; i < totalEmbrioes; i++) {
        receptoras.push({
          codigo: generateReceptoraCode(),
          status: 'ativa'
        });
      }
      
      setFormData(prev => ({
        ...prev,
        data: teDate.toISOString().split('T')[0],
        receptoras: receptoras
      }));
    }
  }, [process.faseTE, process.faseColeta, process.faseFIV]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(process.id, 'faseTE', newData);
  };

  const handleSave = () => {
    const savedData = { ...formData, realizada: true };
    setFormData(savedData);
    onUpdate(process.id, 'faseTE', savedData);
  };

  const generateReceptoraCode = () => {
    const prefix = 'RPT';
    const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${prefix}${number}`;
  };

  const formatReceptoraCode = (value) => {
    // Remove caracteres não alfanuméricos
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Separar letras e números
    const letters = cleaned.replace(/[0-9]/g, '');
    const numbers = cleaned.replace(/[A-Za-z]/g, '');
    
    // Limitar a 3 letras e 4 números
    const limitedLetters = letters.slice(0, 3);
    const limitedNumbers = numbers.slice(0, 4);
    
    return limitedLetters + limitedNumbers;
  };

  const handleGenerateReceptora = () => {
    const newCode = generateReceptoraCode();
    handleInputChange('receptora', newCode);
  };

  const locais = [
    'Fazenda Central',
    'Fazenda Norte',
    'Fazenda Sul',
    'Clínica Veterinária',
    'Campo Experimental'
  ];

  const veterinarios = [
    'Dr. Luciano Abramo Ciambelli',
    'Dra. Dona Monica',
    'Dr. Pedro Oliveira',
    'Dra. Ana Costa',
    'Dr. Carlos Mendes'
  ];

  if (!process.faseFIV?.realizada) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <p className="text-yellow-800">
            ⚠️ A 2ª Fase (FIV) deve ser concluída antes de iniciar a TE
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">3ª Fase - TE (Transferência de Embriões)</h3>
        {formData.realizada && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Concluída
          </span>
        )}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-blue-800 text-sm">
            📅 Data automática: {formData.data ? new Date(formData.data).toLocaleDateString() : 'Não definida'} 
            (7 dias após a coleta - {process.faseColeta?.data ? new Date(process.faseColeta.data).toLocaleDateString() : 'data da coleta não definida'})
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data da TE</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange('data', e.target.value)}
            disabled={formData.realizada}
          />
          <p className="text-xs text-gray-500">Data calculada automaticamente (7 dias após coleta)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="local">Local da TE *</Label>
          <Input
            id="local"
            value={formData.local}
            onChange={(e) => handleInputChange('local', e.target.value)}
            placeholder="Digite o local da TE (ex: Fazenda Central)"
            disabled={formData.realizada}
            list="locais-te-list"
          />
          <datalist id="locais-te-list">
            {locais.map((local, index) => (
              <option key={index} value={local} />
            ))}
          </datalist>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label>Receptoras ({formData.receptoras.length})</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {formData.receptoras.map((receptora, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Input
                  value={receptora.codigo}
                  onChange={(e) => {
                    const formattedValue = formatReceptoraCode(e.target.value);
                    const newReceptoras = [...formData.receptoras];
                    newReceptoras[index].codigo = formattedValue;
                    handleInputChange('receptoras', newReceptoras);
                  }}
                  placeholder="Ex: RPT0001"
                  disabled={formData.realizada}
                  className="w-24 text-center font-mono"
                  maxLength={7}
                />
                {!formData.realizada && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newReceptoras = [...formData.receptoras];
                      newReceptoras[index].codigo = generateReceptoraCode();
                      handleInputChange('receptoras', newReceptoras);
                    }}
                  >
                    Gerar
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Receptoras geradas automaticamente baseado na quantidade de embriões ({
              process.faseFIV?.totalEmbrioes || 
              (process.faseFIV?.resultadosFIV?.reduce((total, r) => total + (parseInt(r.quantidadeEmbrioes) || 0), 0)) || 
              0
            })
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="veterinario">Veterinário Responsável</Label>
          <Input
            id="veterinario"
            value={formData.veterinario}
            onChange={(e) => handleInputChange('veterinario', e.target.value)}
            placeholder="Digite o nome do veterinário (ex: Dr. Luciano Abramo Ciambelli)"
            disabled={formData.realizada}
            list="veterinarios-te-list"
          />
          <datalist id="veterinarios-te-list">
            {veterinarios.map((vet, index) => (
              <option key={index} value={vet} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          placeholder="Observações sobre a transferência de embriões..."
          rows={3}
          disabled={formData.realizada}
        />
      </div>

      {!formData.realizada && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={!formData.local}
          >
            Salvar e Programar DG
          </Button>
        </div>
      )}

      {formData.realizada && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-green-800 text-sm">
              ✓ TE realizada em {new Date(formData.data).toLocaleDateString()}
              <br />
              ✓ {formData.receptoras.length} receptoras transferidas
              <br />
              ✓ Próxima fase (DG) programada para {formData.data ? new Date(new Date(formData.data).getTime() + 30*24*60*60*1000).toLocaleDateString() : 'Data não definida'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaseTE;