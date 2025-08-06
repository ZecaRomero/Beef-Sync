import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";

const FaseFIV = ({ process, onUpdate }) => {
  const [formData, setFormData] = useState({
    data: "",
    laboratorio: "",
    veterinario: "",
    observacoes: "",
    resultadosFIV: [], // Array com resultados por doadora
    realizada: false,
  });

  useEffect(() => {
    if (process.faseFIV) {
      setFormData(process.faseFIV);
    } else if (process.faseColeta?.realizada && process.faseColeta?.doadoras) {
      // Auto-preencher data (1 dia após coleta) e criar resultados para cada doadora
      const fivDate = new Date(process.faseColeta.data);
      fivDate.setDate(fivDate.getDate() + 1);

      const resultadosFIV = process.faseColeta.doadoras.map((doadora) => ({
        doadoraNome: doadora.nome,
        touroAcasalamento: doadora.touroAcasalamento,
        quantidadeOocitos: doadora.quantidadeOocitos,
        quantidadeEmbrioes: "",
        observacoes: "",
      }));

      setFormData((prev) => ({
        ...prev,
        data: fivDate.toISOString().split("T")[0],
        resultadosFIV: resultadosFIV,
      }));
    }
  }, [process.faseFIV, process.faseColeta]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(process.id, "faseFIV", newData);
  };

  const handleResultadoChange = (index, field, value) => {
    const newResultados = [...formData.resultadosFIV];
    newResultados[index] = { ...newResultados[index], [field]: value };

    const newData = { ...formData, resultadosFIV: newResultados };
    setFormData(newData);
    onUpdate(process.id, "faseFIV", newData);
  };

  const handleSave = () => {
    // Calcular totais
    const totalEmbrioes = formData.resultadosFIV.reduce(
      (total, resultado) =>
        total + (parseInt(resultado.quantidadeEmbrioes) || 0),
      0
    );

    const savedData = {
      ...formData,
      realizada: true,
      totalEmbrioes: totalEmbrioes,
    };
    setFormData(savedData);
    onUpdate(process.id, "faseFIV", savedData);
  };

  const laboratorios = [
    "Lab Genética Avançada",
    "Lab Reprodução Animal",
    "Lab FIV Especializado",
    "Lab Central",
    "Lab Universitário",
  ];

  const veterinarios = [
    "Dr. João Silva",
    "Dra. Maria Santos",
    "Dr. Pedro Oliveira",
    "Dra. Ana Costa",
    "Dr. Carlos Mendes",
  ];

  const touros = [
    "Touro Alpha - Nelore",
    "Touro Beta - Angus",
    "Touro Gamma - Brahman",
    "Touro Delta - Gir",
  ];

  if (!process.faseColeta?.realizada) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <p className="text-yellow-800">
            ⚠️ A 1ª Fase (Coleta) deve ser concluída antes de iniciar a FIV
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          2ª Fase - FIV (Fertilização In Vitro)
        </h3>
        {formData.realizada && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Concluída
          </span>
        )}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-blue-800 text-sm">
            📅 Data automática:{" "}
            {formData.data
              ? new Date(formData.data).toLocaleDateString()
              : "Não definida"}
            (1 dia após a coleta)
          </p>
        </CardContent>
      </Card>

      {/* Informações Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data da FIV</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange("data", e.target.value)}
            disabled={formData.realizada}
          />
          <p className="text-xs text-gray-500">
            Data calculada automaticamente (1 dia após coleta)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="laboratorio">Laboratório *</Label>
          <Input
            id="laboratorio"
            value={formData.laboratorio}
            onChange={(e) => handleInputChange("laboratorio", e.target.value)}
            placeholder="Digite o nome do laboratório (ex: Lab Genética Avançada)"
            disabled={formData.realizada}
            list="laboratorios-list"
          />
          <datalist id="laboratorios-list">
            {laboratorios.map((lab, index) => (
              <option key={index} value={lab} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <Label htmlFor="veterinario">Veterinário Responsável</Label>
          <Input
            id="veterinario"
            value={formData.veterinario}
            onChange={(e) => handleInputChange("veterinario", e.target.value)}
            placeholder="Digite o nome do veterinário (ex: Dr. João Silva)"
            disabled={formData.realizada}
            list="veterinarios-fiv-list"
          />
          <datalist id="veterinarios-fiv-list">
            {veterinarios.map((vet, index) => (
              <option key={index} value={vet} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Resultados por Doadora */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">
          Resultados da FIV por Doadora ({formData.resultadosFIV.length})
        </Label>

        {formData.resultadosFIV.map((resultado, index) => (
          <Card key={index} className="p-4 bg-gray-50">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium" style={{ color: "#111827" }}>
                  {resultado.doadoraNome} × {resultado.touroAcasalamento}
                </h4>
                <span className="text-sm text-gray-500">
                  {resultado.quantidadeOocitos} óocitos coletados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade de Embriões Produzidos</Label>
                  <Input
                    type="number"
                    value={resultado.quantidadeEmbrioes}
                    onChange={(e) =>
                      handleResultadoChange(
                        index,
                        "quantidadeEmbrioes",
                        e.target.value
                      )
                    }
                    placeholder="Ex: 8"
                    disabled={formData.realizada}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Observações Específicas</Label>
                  <Input
                    value={resultado.observacoes}
                    onChange={(e) =>
                      handleResultadoChange(
                        index,
                        "observacoes",
                        e.target.value
                      )
                    }
                    placeholder="Observações específicas desta doadora..."
                    disabled={formData.realizada}
                  />
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
                <p className="text-sm" style={{ color: "#2563eb" }}>
                  Total de Doadoras
                </p>
                <p className="text-xl font-bold" style={{ color: "#1e40af" }}>
                  {formData.resultadosFIV.length}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "#2563eb" }}>
                  Total de Embriões
                </p>
                <p className="text-xl font-bold" style={{ color: "#1e40af" }}>
                  {formData.resultadosFIV.reduce(
                    (total, r) => total + (parseInt(r.quantidadeEmbrioes) || 0),
                    0
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "#2563eb" }}>
                  Taxa de Conversão
                </p>
                <p className="text-xl font-bold" style={{ color: "#1e40af" }}>
                  {(() => {
                    const totalOocitos = formData.resultadosFIV.reduce(
                      (total, r) =>
                        total + (parseInt(r.quantidadeOocitos) || 0),
                      0
                    );
                    const totalEmbrioes = formData.resultadosFIV.reduce(
                      (total, r) =>
                        total + (parseInt(r.quantidadeEmbrioes) || 0),
                      0
                    );
                    return totalOocitos > 0
                      ? `${Math.round((totalEmbrioes / totalOocitos) * 100)}%`
                      : "0%";
                  })()}
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
          placeholder="Observações sobre o procedimento de FIV..."
          rows={3}
          disabled={formData.realizada}
        />
      </div>

      {!formData.realizada && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!formData.laboratorio}>
            Salvar e Programar TE
          </Button>
        </div>
      )}

      {formData.realizada && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-green-800 text-sm">
              ✓ FIV realizada em {new Date(formData.data).toLocaleDateString()}
              <br />✓ {formData.totalEmbrioes} embriões produzidos no total
              <br />✓ {formData.resultadosFIV.length} doadoras processadas
              <br />✓ Próxima fase (TE) programada para{" "}
              {process.faseColeta?.data
                ? new Date(
                    new Date(process.faseColeta.data).getTime() +
                      7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()
                : "Data não definida"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaseFIV;
