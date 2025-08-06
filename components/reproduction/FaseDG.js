import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const FaseDG = ({ process, onUpdate }) => {
  const [formData, setFormData] = useState({
    data: '',
    dataRealizada: '',
    receptoras: [],
    veterinario: '',
    observacoes: '',
    realizada: false
  });

  const [alertaDG, setAlertaDG] = useState(null);

  useEffect(() => {
    if (process.faseDG) {
      setFormData(process.faseDG);
    } else if (process.faseTE?.data && process.faseTE?.receptoras) {
      // Auto-preencher data (30 dias após TE) e receptoras
      const dgDate = new Date(process.faseTE.data);
      dgDate.setDate(dgDate.getDate() + 30);
      
      const receptoras = process.faseTE.receptoras.map(r => ({
        ...r,
        resultado: '',
        dataRealizada: ''
      }));
      
      setFormData(prev => ({
        ...prev,
        data: dgDate.toISOString().split('T')[0],
        receptoras: receptoras
      }));
    }

    // Verificar alerta de DG próximo
    if (process.faseTE?.data && !process.faseDG?.realizada) {
      const dgDate = new Date(process.faseTE.data);
      dgDate.setDate(dgDate.getDate() + 30);
      const today = new Date();
      const daysDiff = Math.ceil((dgDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 3 && daysDiff >= 0) {
        setAlertaDG({
          days: daysDiff,
          date: dgDate
        });
      }
    }
  }, [process.faseDG, process.faseTE]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(process.id, 'faseDG', newData);
  };

  const handleReceptoraChange = (index, field, value) => {
    const newReceptoras = [...formData.receptoras];
    newReceptoras[index] = { ...newReceptoras[index], [field]: value };
    
    const newData = { ...formData, receptoras: newReceptoras };
    setFormData(newData);
    onUpdate(process.id, 'faseDG', newData);
  };

  const handleSave = () => {
    const savedData = { 
      ...formData, 
      realizada: true,
      dataRealizada: formData.dataRealizada || new Date().toISOString().split('T')[0]
    };
    setFormData(savedData);
    onUpdate(process.id, 'faseDG', savedData);
    
    // Criar fase de sexagem com receptoras prenhas
    const receptorasPrenhas = formData.receptoras.filter(r => r.resultado === 'prenha');
    
    if (receptorasPrenhas.length > 0) {
      const faseSexagemData = {
        receptoras: receptorasPrenhas.map(r => ({
          codigo: r.codigo,
          sexo: '',
          previsaoParto: process.faseTE?.data ? 
            new Date(new Date(process.faseTE.data).setMonth(new Date(process.faseTE.data).getMonth() + 9)).toISOString().split('T')[0] : ''
        })),
        data: '',
        realizada: false
      };
      
      onUpdate(process.id, 'faseSexagem', faseSexagemData);
    }
  };

  const veterinarios = [
    'Dr. João Silva',
    'Dra. Maria Santos',
    'Dr. Pedro Oliveira',
    'Dra. Ana Costa',
    'Dr. Carlos Mendes'
  ];

  if (!process.faseTE?.realizada) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <p className="text-yellow-800">
            ⚠️ A 3ª Fase (TE) deve ser concluída antes de realizar o DG
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">4ª Fase - DG (Diagnóstico de Prenhez)</h3>
        {formData.realizada && (
          <span className={`px-3 py-1 rounded-full text-sm ${
            formData.resultado === 'prenha' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {formData.resultado === 'prenha' ? 'Prenha ✓' : 'Vazia'}
          </span>
        )}
      </div>

      {/* Alerta de DG próximo */}
      {alertaDG && (
        <Alert className="border-orange-200 bg-orange-50">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>DG deve ser realizado em {alertaDG.days} dias!</strong>
            <br />
            Data programada: {alertaDG.date.toLocaleDateString()}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-blue-800 text-sm">
            📅 Data programada: {formData.data ? new Date(formData.data).toLocaleDateString() : 'Não definida'} 
            (30 dias após a TE - {process.faseTE?.data ? new Date(process.faseTE.data).toLocaleDateString() : 'data da TE não definida'})
            <br />
            🐄 Receptoras: {formData.receptoras.length} transferidas na TE
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data Programada do DG</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange('data', e.target.value)}
            disabled={formData.realizada}
          />
          <p className="text-xs text-gray-500">30 dias após TE</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataRealizada">Data Realizada do DG</Label>
          <Input
            id="dataRealizada"
            type="date"
            value={formData.dataRealizada}
            onChange={(e) => handleInputChange('dataRealizada', e.target.value)}
            disabled={formData.realizada}
          />
          <p className="text-xs text-gray-500">Mesma data para todas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="veterinario">Veterinário Responsável</Label>
          <Input
            id="veterinario"
            value={formData.veterinario}
            onChange={(e) => handleInputChange('veterinario', e.target.value)}
            placeholder="Digite o nome do veterinário"
            disabled={formData.realizada}
            list="veterinarios-dg-list"
          />
          <datalist id="veterinarios-dg-list">
            {veterinarios.map((vet, index) => (
              <option key={index} value={vet} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Lista de Receptoras para DG */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-medium">
            Receptoras ({formData.receptoras.length})
          </Label>
          <span className="text-sm text-gray-500">
            Data única: {formData.dataRealizada ? new Date(formData.dataRealizada).toLocaleDateString() : 'Não definida'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {formData.receptoras.map((receptora, index) => (
            <Card key={index} className="p-3 bg-gray-50">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="w-20 mx-auto text-center font-mono bg-white p-2 rounded border text-sm font-bold">
                    {receptora.codigo}
                  </div>
                </div>

                <div className="space-y-2">
                  <Select 
                    value={receptora.resultado || ''} 
                    onValueChange={(value) => handleReceptoraChange(index, 'resultado', value)}
                    disabled={formData.realizada}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prenha">Prenha</SelectItem>
                      <SelectItem value="vazia">Vazia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Resumo Compacto */}
        <div className="flex justify-center space-x-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <p className="text-sm" style={{ color: '#2563eb' }}>Total</p>
            <p className="text-lg font-bold" style={{ color: '#1e40af' }}>
              {formData.receptoras.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm" style={{ color: '#16a34a' }}>Prenhas</p>
            <p className="text-lg font-bold" style={{ color: '#166534' }}>
              {formData.receptoras.filter(r => r.resultado === 'prenha').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm" style={{ color: '#dc2626' }}>Vazias</p>
            <p className="text-lg font-bold" style={{ color: '#b91c1c' }}>
              {formData.receptoras.filter(r => r.resultado === 'vazia').length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          placeholder="Observações sobre o diagnóstico..."
          rows={2}
          disabled={formData.realizada}
        />
      </div>

      {!formData.realizada && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={formData.receptoras.some(r => !r.resultado)}
          >
            Salvar Resultados
          </Button>
        </div>
      )}

      {formData.realizada && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-green-800 text-sm">
              ✓ DG realizado em {formData.dataRealizada ? new Date(formData.dataRealizada).toLocaleDateString() : 'Data não informada'}
              <br />
              ✓ {formData.receptoras.filter(r => r.resultado === 'prenha').length} receptoras prenhas
              <br />
              ✓ {formData.receptoras.filter(r => r.resultado === 'vazia').length} receptoras vazias
              {formData.receptoras.filter(r => r.resultado === 'prenha').length > 0 && (
                <>
                  <br />
                  ✓ Sexagem disponível para receptoras prenhas
                </>
              )}
            </p>
          </CardContent>
        </Card>
      )}


    </div>
  );
};

export default FaseDG;