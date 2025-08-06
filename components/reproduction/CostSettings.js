import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { reproductionService } from '../../services/reproductionService';

const CostSettings = ({ onClose }) => {
  const [costs, setCosts] = useState(reproductionService.costs);

  const handleCostChange = (field, value) => {
    setCosts(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    reproductionService.updateCosts(costs);
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Custos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coleta">Custo da Coleta</Label>
            <Input
              id="coleta"
              type="number"
              step="0.01"
              value={costs.coleta}
              onChange={(e) => handleCostChange('coleta', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiv">Custo da FIV</Label>
            <Input
              id="fiv"
              type="number"
              step="0.01"
              value={costs.fiv}
              onChange={(e) => handleCostChange('fiv', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="te">Custo da TE</Label>
            <Input
              id="te"
              type="number"
              step="0.01"
              value={costs.te}
              onChange={(e) => handleCostChange('te', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dg">Custo do DG</Label>
            <Input
              id="dg"
              type="number"
              step="0.01"
              value={costs.dg}
              onChange={(e) => handleCostChange('dg', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexagem">Custo da Sexagem</Label>
            <Input
              id="sexagem"
              type="number"
              step="0.01"
              value={costs.sexagem}
              onChange={(e) => handleCostChange('sexagem', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receptora">Custo por Receptora</Label>
            <Input
              id="receptora"
              type="number"
              step="0.01"
              value={costs.receptora}
              onChange={(e) => handleCostChange('receptora', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frete">Custo do Frete</Label>
            <Input
              id="frete"
              type="number"
              step="0.01"
              value={costs.frete}
              onChange={(e) => handleCostChange('frete', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinario">Custo Veterinário</Label>
            <Input
              id="veterinario"
              type="number"
              step="0.01"
              value={costs.veterinario}
              onChange={(e) => handleCostChange('veterinario', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="laboratorio">Custo Laboratório</Label>
            <Input
              id="laboratorio"
              type="number"
              step="0.01"
              value={costs.laboratorio}
              onChange={(e) => handleCostChange('laboratorio', e.target.value)}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Resumo de Custos por Processo</h4>
          <div className="text-sm space-y-1">
            <p>Custo mínimo por processo: {formatCurrency(costs.coleta + costs.fiv + costs.te + costs.dg + costs.veterinario * 3 + costs.laboratorio)}</p>
            <p>Custo com 1 receptora: {formatCurrency(costs.coleta + costs.fiv + costs.te + costs.dg + costs.receptora + costs.frete + costs.veterinario * 3 + costs.laboratorio)}</p>
            <p>Custo com sexagem: {formatCurrency(costs.coleta + costs.fiv + costs.te + costs.dg + costs.sexagem + costs.receptora + costs.frete + costs.veterinario * 3 + costs.laboratorio)}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSettings;