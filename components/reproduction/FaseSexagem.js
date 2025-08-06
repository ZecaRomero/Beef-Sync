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
import { Alert, AlertDescription } from "../ui/alert";
import {
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const FaseSexagem = ({ process, onUpdate }) => {
  const [formData, setFormData] = useState({
    data: "",
    receptoras: [],
    observacoes: "",
    realizada: false,
  });

  const [alertaSexagem, setAlertaSexagem] = useState(false);

  useEffect(() => {
    try {
      if (process.faseSexagem) {
        setFormData(process.faseSexagem);
      } else if (process.faseDG?.realizada && Array.isArray(process.faseDG?.receptoras)) {
        // Auto-preencher com receptoras que deram prenha na 4ª fase
        const receptorasPrenhas = process.faseDG.receptoras.filter(r => r && r.resultado === 'prenha');
        
        if (receptorasPrenhas.length > 0) {
          const receptorasComParto = receptorasPrenhas.map(r => {
            const previsaoParto = process.faseTE?.data
              ? new Date(
                  new Date(process.faseTE.data).setMonth(
                    new Date(process.faseTE.data).getMonth() + 9
                  )
                )
                  .toISOString()
                  .split("T")[0]
              : "";

            return {
              codigo: r.codigo || '',
              sexo: "",
              previsaoParto: previsaoParto,
            };
          });

          setFormData((prev) => ({
            ...prev,
            receptoras: receptorasComParto,
          }));
        }
      }

      // Verificar alerta de sexagem disponível
      if (
        process.faseDG?.realizada &&
        Array.isArray(process.faseDG?.receptoras) &&
        process.faseDG.receptoras.some(r => r && r.resultado === 'prenha') &&
        !process.faseSexagem?.realizada
      ) {
        setAlertaSexagem(true);
      }
    } catch (error) {
      console.error('Erro na FaseSexagem useEffect:', error);
    }
  }, [process.faseSexagem, process.faseDG, process.faseTE]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(process.id, "faseSexagem", newData);
  };

  const handleReceptoraChange = (index, field, value) => {
    const newReceptoras = [...formData.receptoras];
    newReceptoras[index] = { ...newReceptoras[index], [field]: value };

    // Se mudou o sexo, recalcular previsão de parto se necessário
    if (field === "sexo" && process.faseTE?.data) {
      const partoDate = new Date(process.faseTE.data);
      partoDate.setMonth(partoDate.getMonth() + 9);
      newReceptoras[index].previsaoParto = partoDate
        .toISOString()
        .split("T")[0];
    }

    handleInputChange("receptoras", newReceptoras);
  };

  const addReceptora = () => {
    const newReceptora = {
      codigo: "",
      sexo: "",
      previsaoParto: "",
    };
    handleInputChange("receptoras", [...formData.receptoras, newReceptora]);
  };

  const removeReceptora = (index) => {
    const newReceptoras = formData.receptoras.filter((_, i) => i !== index);
    handleInputChange("receptoras", newReceptoras);
  };

  const handleSave = () => {
    const savedData = {
      ...formData,
      realizada: true,
      data: formData.data || new Date().toISOString().split("T")[0],
    };
    setFormData(savedData);
    onUpdate(process.id, "faseSexagem", savedData);

    // Automaticamente criar a fase de entrega (2 dias após sexagem)
    const entregaDate = new Date(savedData.data);
    entregaDate.setDate(entregaDate.getDate() + 2);

    const faseEntregaData = {
      data: entregaDate.toISOString().split("T")[0],
      receptoras: formData.receptoras.map((r) => ({
        codigo: r.codigo,
        sexo: r.sexo,
        previsaoParto: r.previsaoParto,
        frente: "",
        dataEntrega: "",
        motorista: "",
        notaFiscal: "",
        valorReceptora: "",
        valorFrete: "",
      })),
      realizada: false,
    };

    onUpdate(process.id, "faseEntrega", faseEntregaData);
  };

  // Verificar se há receptoras prenhas
  const receptorasPrenhas = Array.isArray(process.faseDG?.receptoras) 
    ? process.faseDG.receptoras.filter(r => r && r.resultado === 'prenha') 
    : [];
  
  if (!process.faseDG?.realizada) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <p className="text-yellow-800">
            ⚠️ A 4ª Fase (DG) deve ser concluída antes da sexagem
          </p>
        </CardContent>
      </Card>
    );
  }

  if (receptorasPrenhas.length === 0) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-4">
          <p className="text-red-800">
            ❌ Não há receptoras prenhas para sexagem
            <br />
            Todas as receptoras tiveram resultado "Vazia" no DG
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          5ª Fase - Sexagem dos Embriões
        </h3>
        {formData.realizada && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Concluída
          </span>
        )}
      </div>

      {/* Alerta de sexagem disponível */}
      {alertaSexagem && !formData.realizada && (
        <Alert className="border-blue-200 bg-blue-50">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Sexagem disponível!</strong>
            <br />
            As receptoras com DG positivo estão disponíveis para sexagem
            (opcional).
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-blue-800 text-sm">
            ℹ️ Esta fase é OPCIONAL - Apenas receptoras prenhas do DG
            <br />
            📅 Previsão de parto: 9 meses após TE ({process.faseTE?.data ? new Date(process.faseTE.data).toLocaleDateString() : 'data não definida'})
            <br />
            🐄 {receptorasPrenhas.length} receptora(s) prenha(s) disponível(is) para sexagem
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="data">Data da Sexagem</Label>
        <Input
          id="data"
          type="date"
          value={formData.data}
          onChange={(e) => handleInputChange("data", e.target.value)}
          disabled={formData.realizada}
        />
      </div>

      {/* Lista de Receptoras */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">
            Receptoras Prenhas ({formData.receptoras.length})
          </Label>
          {!formData.realizada && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReceptora}
              className="h-7 text-xs"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {formData.receptoras.map((receptora, index) => (
            <Card key={index} className="p-3 bg-gray-50">
              <div className="space-y-3">
                {/* Código da Receptora */}
                <div className="text-center">
                  <div className="w-20 mx-auto text-center font-mono bg-white p-2 rounded border text-sm font-bold">
                    {receptora.codigo}
                  </div>
                </div>

                {/* Sexo da Cria */}
                <div className="space-y-1">
                  <Label className="text-xs">Sexo</Label>
                  <Select
                    value={receptora.sexo}
                    onValueChange={(value) =>
                      handleReceptoraChange(index, "sexo", value)
                    }
                    disabled={formData.realizada}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="macho">♂ Macho</SelectItem>
                      <SelectItem value="femea">♀ Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Previsão de Parto */}
                <div className="space-y-1">
                  <Label className="text-xs">Parto</Label>
                  <Input
                    type="date"
                    value={receptora.previsaoParto}
                    onChange={(e) =>
                      handleReceptoraChange(
                        index,
                        "previsaoParto",
                        e.target.value
                      )
                    }
                    disabled={formData.realizada}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Botão de remover */}
                {!formData.realizada && formData.receptoras.length > 1 && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReceptora(index)}
                      className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleInputChange("observacoes", e.target.value)}
          placeholder="Observações sobre a sexagem..."
          rows={3}
          disabled={formData.realizada}
        />
      </div>

      {!formData.realizada && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              // Pular sexagem e ir direto para entrega
              const faseEntregaData = {
                data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                receptoras: formData.receptoras.map((r) => ({
                  codigo: r.codigo,
                  sexo: "não informado",
                  previsaoParto: r.previsaoParto,
                  frente: "",
                  dataEntrega: "",
                  motorista: "",
                  notaFiscal: "",
                  valorReceptora: "",
                  valorFrete: "",
                })),
                realizada: false,
              };
              onUpdate(process.id, "faseEntrega", faseEntregaData);
            }}
          >
            Pular Sexagem
          </Button>
          <Button
            onClick={handleSave}
            disabled={formData.receptoras.length === 0}
          >
            Salvar e Programar Entrega
          </Button>
        </div>
      )}

      {formData.realizada && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-green-800 text-sm">
              ✓ Sexagem realizada em{" "}
              {formData.data
                ? new Date(formData.data).toLocaleDateString()
                : "Data não informada"}
              <br />✓ {formData.receptoras.length} receptora(s) processada(s)
              <br />✓ Próxima fase (Entrega) programada para{" "}
              {formData.data
                ? new Date(
                    new Date(formData.data).getTime() + 2 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()
                : "Data não definida"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaseSexagem;
