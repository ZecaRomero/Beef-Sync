import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { semenService } from '../../services/semenService';

const FaseColeta = ({ process, onUpdate }) => {
  const [formData, setFormData] = useState({
    data: "",
    local: "",
    veterinario: "",
    observacoes: "",
    doadoras: [
      {
        nome: "",
        quantidadeOocitos: "",
        touroAcasalamento: ""
      }
    ],
    realizada: false,
  });

  useEffect(() => {
    if (process.faseColeta) {
      setFormData(process.faseColeta);
    }
  }, [process.faseColeta]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(process.id, "faseColeta", newData);
  };

  const handleDoadoraChange = (index, field, value) => {
    const newDoadoras = [...formData.doadoras];
    newDoadoras[index] = { ...newDoadoras[index], [field]: value };
    
    const newData = { ...formData, doadoras: newDoadoras };
    setFormData(newData);
    onUpdate(process.id, "faseColeta", newData);
  };

  const addDoadora = () => {
    const newDoadora = {
      nome: "",
      quantidadeOocitos: "",
      touroAcasalamento: ""
    };
    const newData = { 
      ...formData, 
      doadoras: [...formData.doadoras, newDoadora] 
    };
    setFormData(newData);
    onUpdate(process.id, "faseColeta", newData);
  };

  const removeDoadora = (index) => {
    if (formData.doadoras.length > 1) {
      const newDoadoras = formData.doadoras.filter((_, i) => i !== index);
      const newData = { ...formData, doadoras: newDoadoras };
      setFormData(newData);
      onUpdate(process.id, "faseColeta", newData);
    }
  };

  const handleSave = () => {
    // Calcular totais
    const totalOocitos = formData.doadoras.reduce((total, doadora) => 
      total + (parseInt(doadora.quantidadeOocitos) || 0), 0
    );
    
    // Registrar uso das doses de sêmen
    formData.doadoras.forEach(doadora => {
      const touroSelecionado = tourosDisponiveis.find(t => 
        t.displayName === doadora.touroAcasalamento
      );
      
      if (touroSelecionado) {
        // Usar 1 dose por doadora
        semenService.useDose(touroSelecionado.id, 1);
      }
    });
    
    const savedData = { 
      ...formData, 
      realizada: true,
      totalOocitos: totalOocitos,
      totalDoadoras: formData.doadoras.length
    };
    setFormData(savedData);
    onUpdate(process.id, "faseColeta", savedData);
  };

  // Lista de doadoras (você pode conectar com seu banco de dados)
  const doadoras = [
    "Vaca 001 - Nelore",
    "Vaca 002 - GIR",
    "Vaca 003 - Brahman",
    "Vaca 004 - Gir",
    "Vaca 005 - Guzerá",
  ];

  // Carregar touros do sistema de sêmen
  const [tourosDisponiveis, setTourosDisponiveis] = useState([]);

  useEffect(() => {
    // Carregar touros disponíveis do sistema de sêmen
    const touros = semenService.getAvailableTouros();
    setTourosDisponiveis(touros);
  }, []);

  const touros = [
    "Touro Alpha - Nelore",
    "Touro Beta - GIR",
    "Touro Gamma - Brahman",
    "Touro Delta - Gir",
  ];

  const veterinarios = [
    "Dr. Luciano Abramo Ciambelli",
    "Dra. Dona Monica",
    "Dr. Pedro Oliveira",
    "Dra. Ana Costa",
  ];

  const locais = [
    "Fazenda Central",
    "Fazenda Norte",
    "Fazenda Sul",
    "Clínica Veterinária",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">1ª Fase - Coleta de Óocitos</h3>
        {formData.realizada && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Concluída
          </span>
        )}
      </div>

      {/* Informações Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data da Coleta *</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange("data", e.target.value)}
            disabled={formData.realizada}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="local">Local da Coleta</Label>
          <Input
            id="local"
            value={formData.local}
            onChange={(e) => handleInputChange("local", e.target.value)}
            placeholder="Digite o local da coleta (ex: Fazenda Central)"
            disabled={formData.realizada}
            list="locais-list"
          />
          <datalist id="locais-list">
            {locais.map((local, index) => (
              <option key={index} value={local} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <Label htmlFor="veterinario">Veterinário Responsável</Label>
          <Input
            id="veterinario"
            value={formData.veterinario}
            onChange={(e) => handleInputChange("veterinario", e.target.value)}
            placeholder="Digite o nome do veterinário (ex: Dr. Luciano Abramo Ciambelli)"
            disabled={formData.realizada}
            list="veterinarios-list"
          />
          <datalist id="veterinarios-list">
            {veterinarios.map((vet, index) => (
              <option key={index} value={vet} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Lista de Doadoras */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-medium">
            Doadoras ({formData.doadoras.length})
          </Label>
          {!formData.realizada && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addDoadora}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Adicionar Doadora
            </Button>
          )}
        </div>

        {formData.doadoras.map((doadora, index) => (
          <Card key={index} className="p-4 bg-gray-50">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium" style={{ color: '#111827' }}>
                  Doadora {index + 1}
                </h4>
                {!formData.realizada && formData.doadoras.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeDoadora(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Doadora *</Label>
                  <Input
                    value={doadora.nome}
                    onChange={(e) => handleDoadoraChange(index, 'nome', e.target.value)}
                    placeholder="Digite o nome da doadora (ex: Vaca 001 - Nelore)"
                    disabled={formData.realizada}
                    list={`doadoras-list-${index}`}
                  />
                  <datalist id={`doadoras-list-${index}`}>
                    {doadoras.map((d, idx) => (
                      <option key={idx} value={d} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label>Quantidade de Óocitos</Label>
                  <Input
                    type="number"
                    value={doadora.quantidadeOocitos}
                    onChange={(e) => handleDoadoraChange(index, 'quantidadeOocitos', e.target.value)}
                    placeholder="Ex: 15"
                    disabled={formData.realizada}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Touro para Acasalamento *</Label>
                  <Select 
                    value={doadora.touroAcasalamento} 
                    onValueChange={(value) => handleDoadoraChange(index, 'touroAcasalamento', value)}
                    disabled={formData.realizada}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o touro" />
                    </SelectTrigger>
                    <SelectContent>
                      {tourosDisponiveis.length > 0 && (
                        <>
                          <SelectItem disabled value="header1" className="font-semibold text-blue-600">
                            — Touros com Sêmen Disponível —
                          </SelectItem>
                          {tourosDisponiveis.map((touro) => (
                            <SelectItem key={touro.id} value={touro.displayName}>
                              🧬 {touro.displayName}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      <SelectItem disabled value="header2" className="font-semibold text-gray-600">
                        — Outros Touros —
                      </SelectItem>
                      {touros.map((touro, idx) => (
                        <SelectItem key={`manual-${idx}`} value={touro}>
                          🐂 {touro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {tourosDisponiveis.length === 0 && (
                    <p className="text-xs text-orange-600">
                      ⚠️ Nenhuma dose de sêmen cadastrada. Cadastre doses na aba "Doses de Sêmen"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Resumo */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm" style={{ color: '#2563eb' }}>Total de Doadoras</p>
                <p className="text-xl font-bold" style={{ color: '#1e40af' }}>
                  {formData.doadoras.length}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: '#2563eb' }}>Total de Óocitos</p>
                <p className="text-xl font-bold" style={{ color: '#1e40af' }}>
                  {formData.doadoras.reduce((total, d) => total + (parseInt(d.quantidadeOocitos) || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: '#2563eb' }}>Touros Diferentes</p>
                <p className="text-xl font-bold" style={{ color: '#1e40af' }}>
                  {new Set(formData.doadoras.map(d => d.touroAcasalamento).filter(t => t)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleInputChange("observacoes", e.target.value)}
          placeholder="Observações sobre o procedimento..."
          rows={3}
          disabled={formData.realizada}
        />
      </div>

      {!formData.realizada && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={
              !formData.data || 
              formData.doadoras.some(d => !d.nome || !d.touroAcasalamento)
            }
          >
            Salvar e Avançar para FIV
          </Button>
        </div>
      )}

      {formData.realizada && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-green-800 text-sm">
              ✓ Coleta realizada em {new Date(formData.data).toLocaleDateString()}
              <br />
              ✓ {formData.totalDoadoras} doadoras processadas
              <br />
              ✓ {formData.totalOocitos} óocitos coletados no total
              <br />
              ✓ Próxima fase (FIV) programada para{" "}
              {new Date(
                new Date(formData.data).getTime() + 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaseColeta;
