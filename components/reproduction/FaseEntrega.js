import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { PlusIcon, TrashIcon, ExclamationTriangleIcon, TruckIcon } from '@heroicons/react/24/outline';

const FaseEntrega = ({ process, onUpdate }) => {
  const [formData, setFormData] = useState({
    data: '',
    receptoras: [],
    observacoes: '',
    realizada: false
  });

  const [alertaEntrega, setAlertaEntrega] = useState(null);

  useEffect(() => {
    if (process.faseEntrega) {
      setFormData(process.faseEntrega);
    } else if (process.faseSexagem?.realizada || (process.faseDG?.resultado === 'prenha' && process.faseTE?.receptora)) {
      // Auto-preencher com dados da sexagem ou DG
      const baseDate = process.faseSexagem?.data || new Date().toISOString().split('T')[0];
      const entregaDate = new Date(baseDate);
      entregaDate.setDate(entregaDate.getDate() + 2);
      
      const receptoras = process.faseSexagem?.receptoras || [
        {
          codigo: process.faseTE?.receptora || '',
          sexo: 'não informado',
          previsaoParto: process.faseTE?.data ? 
            new Date(new Date(process.faseTE.data).setMonth(new Date(process.faseTE.data).getMonth() + 9)).toISOString().split('T')[0] : ''
        }
      ];
      
      setFormData(prev => ({
        ...prev,
        data: entregaDate.toISOString().split('T')[0],
        receptoras: receptoras.map(r => ({
          ...r,
          frente: '',
          dataEntrega: '',
          motorista: '',
          notaFiscal: '',
          valorReceptora: '',
          valorFrete: ''
        }))
      }));
    }

    // Verificar alerta de entrega próxima
    if (process.faseSexagem?.data && !process.faseEntrega?.realizada) {
      const entregaDate = new Date(process.faseSexagem.data);
      entregaDate.setDate(entregaDate.getDate() + 2);
      const today = new Date();
      const daysDiff = Math.ceil((entregaDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1 && daysDiff >= 0) {
        setAlertaEntrega({
          days: daysDiff,
          date: entregaDate
        });
      }
    }
  }, [process.faseEntrega, process.faseSexagem, process.faseDG, process.faseTE]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(process.id, 'faseEntrega', newData);
  };

  const handleReceptoraChange = (index, field, value) => {
    const newReceptoras = [...formData.receptoras];
    newReceptoras[index] = { ...newReceptoras[index], [field]: value };
    handleInputChange('receptoras', newReceptoras);
  };

  const addReceptora = () => {
    const newReceptora = {
      codigo: '',
      sexo: '',
      previsaoParto: '',
      frente: '',
      dataEntrega: '',
      motorista: '',
      notaFiscal: '',
      valorReceptora: '',
      valorFrete: ''
    };
    handleInputChange('receptoras', [...formData.receptoras, newReceptora]);
  };

  const removeReceptora = (index) => {
    const newReceptoras = formData.receptoras.filter((_, i) => i !== index);
    handleInputChange('receptoras', newReceptoras);
  };

  const handleSave = () => {
    const savedData = { 
      ...formData, 
      realizada: true
    };
    setFormData(savedData);
    onUpdate(process.id, 'faseEntrega', savedData);
  };

  const calcularTotal = (receptora) => {
    const valorReceptora = parseFloat(receptora.valorReceptora) || 0;
    const valorFrete = parseFloat(receptora.valorFrete) || 0;
    return valorReceptora + valorFrete;
  };

  const calcularTotalGeral = () => {
    return formData.receptoras.reduce((total, receptora) => {
      return total + calcularTotal(receptora);
    }, 0);
  };

  const motoristas = [
    'João da Silva',
    'Pedro Santos',
    'Carlos Oliveira',
    'Maria Fernandes',
    'José Almeida'
  ];

  if (!process.faseDG?.resultado === 'prenha' && !process.faseSexagem?.realizada) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <p className="text-yellow-800">
            ⚠️ A entrega só está disponível após DG positivo ou sexagem realizada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">6ª Fase - Entrega das Receptoras</h3>
        {formData.realizada && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Concluída
          </span>
        )}
      </div>

      {/* Alerta de entrega próxima */}
      {alertaEntrega && (
        <Alert className="border-orange-200 bg-orange-50">
          <TruckIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Entrega deve ser feita em {alertaEntrega.days} dias!</strong>
            <br />
            Data programada: {alertaEntrega.date.toLocaleDateString()}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-blue-800 text-sm">
            📅 Data programada: {formData.data ? new Date(formData.data).toLocaleDateString() : 'Não definida'} 
            (2 dias após a sexagem)
            <br />
            🚛 Organize a logística de entrega das receptoras prenhas
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="data">Data Programada da Entrega</Label>
        <Input
          id="data"
          type="date"
          value={formData.data}
          onChange={(e) => handleInputChange('data', e.target.value)}
          disabled={formData.realizada}
        />
        <p className="text-xs text-gray-500">Data calculada automaticamente (2 dias após sexagem)</p>
      </div>

      {/* Lista de Receptoras para Entrega */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Receptoras para Entrega</Label>
          {!formData.realizada && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addReceptora}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Adicionar Receptora
            </Button>
          )}
        </div>

        {formData.receptoras.map((receptora, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Receptora {index + 1}</h4>
                {!formData.realizada && formData.receptoras.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeReceptora(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Código da Receptora</Label>
                  <Input
                    value={receptora.codigo}
                    onChange={(e) => handleReceptoraChange(index, 'codigo', e.target.value)}
                    placeholder="Ex: RPT0001"
                    disabled={formData.realizada}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sexo da Cria</Label>
                  <Input
                    value={receptora.sexo}
                    onChange={(e) => handleReceptoraChange(index, 'sexo', e.target.value)}
                    placeholder="Macho/Fêmea"
                    disabled={formData.realizada}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Previsão de Parto</Label>
                  <Input
                    type="date"
                    value={receptora.previsaoParto}
                    onChange={(e) => handleReceptoraChange(index, 'previsaoParto', e.target.value)}
                    disabled={formData.realizada}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frente (Opcional)</Label>
                  <Input
                    value={receptora.frente}
                    onChange={(e) => handleReceptoraChange(index, 'frente', e.target.value)}
                    placeholder="Nome da frente/destino"
                    disabled={formData.realizada}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data de Entrega</Label>
                  <Input
                    type="date"
                    value={receptora.dataEntrega}
                    onChange={(e) => handleReceptoraChange(index, 'dataEntrega', e.target.value)}
                    disabled={formData.realizada}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Motorista</Label>
                  <Input
                    value={receptora.motorista}
                    onChange={(e) => handleReceptoraChange(index, 'motorista', e.target.value)}
                    placeholder="Digite o nome do motorista (ex: João da Silva)"
                    disabled={formData.realizada}
                    list={`motoristas-list-${index}`}
                  />
                  <datalist id={`motoristas-list-${index}`}>
                    {motoristas.map((motorista, idx) => (
                      <option key={idx} value={motorista} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label>Nota Fiscal</Label>
                  <Input
                    value={receptora.notaFiscal}
                    onChange={(e) => handleReceptoraChange(index, 'notaFiscal', e.target.value)}
                    placeholder="Número da NF"
                    disabled={formData.realizada}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Valor da Receptora (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={receptora.valorReceptora}
                    onChange={(e) => handleReceptoraChange(index, 'valorReceptora', e.target.value)}
                    placeholder="0,00"
                    disabled={formData.realizada}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valor do Frete (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={receptora.valorFrete}
                    onChange={(e) => handleReceptoraChange(index, 'valorFrete', e.target.value)}
                    placeholder="0,00"
                    disabled={formData.realizada}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total (R$)</Label>
                  <Input
                    value={calcularTotal(receptora).toFixed(2)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        {formData.receptoras.length > 0 && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Geral:</span>
                <span className="text-xl font-bold">R$ {calcularTotalGeral().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          placeholder="Observações sobre a entrega..."
          rows={3}
          disabled={formData.realizada}
        />
      </div>

      {!formData.realizada && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={formData.receptoras.length === 0}
          >
            Finalizar Processo
          </Button>
        </div>
      )}

      {formData.realizada && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-green-800 text-sm">
              ✓ Processo de reprodução finalizado!
              <br />
              ✓ {formData.receptoras.length} receptora(s) entregue(s)
              <br />
              ✓ Valor total: R$ {calcularTotalGeral().toFixed(2)}
              <br />
              ✓ Todas as fases do processo FIV foram concluídas com sucesso
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaseEntrega;