import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { PlusIcon, TrashIcon, PencilIcon as EditIcon } from '@heroicons/react/24/outline';
import { semenService } from '../../services/semenService';
import SemenDoseForm from './SemenDoseForm';
import SemenDoseList from './SemenDoseList';

const SemenManager = () => {
  const [semenDoses, setSemenDoses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDose, setEditingDose] = useState(null);

  useEffect(() => {
    loadSemenDoses();
  }, []);

  const loadSemenDoses = () => {
    const doses = semenService.getAllDoses();
    setSemenDoses(doses);
  };

  const handleEdit = (dose) => {
    setEditingDose(dose);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    semenService.deleteDose(id);
    loadSemenDoses();
  };

  const handleFormSubmit = (formData, isEdit) => {
    if (isEdit && editingDose) {
      semenService.updateDose(editingDose.id, formData);
    } else {
      formData.touros.forEach(touro => {
        const doseData = {
          notaFiscal: formData.notaFiscal,
          fornecedor: formData.fornecedor,
          data: formData.data,
          observacoes: formData.observacoes,
          nomeTouro: touro.nomeTouro,
          rg: touro.rg,
          raca: touro.raca,
          quantidadeDoses: touro.quantidadeDoses,
          valor: touro.valorIndividual || (parseFloat(formData.valorTotal) / formData.touros.length)
        };
        semenService.createDose(doseData);
      });
    }
    loadSemenDoses();
    setShowForm(false);
    setEditingDose(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const getStatusColor = (quantidadeUsada, quantidadeTotal) => {
    const percentUsed = (quantidadeUsada / quantidadeTotal) * 100;
    if (percentUsed === 0) return 'bg-green-500';
    if (percentUsed < 50) return 'bg-yellow-500';
    if (percentUsed < 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: '#111827' }}>
          Doses de Sêmen
        </h2>
        <Button onClick={() => { setShowForm(true); setEditingDose(null); }}>Adicionar Dose</Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm" style={{ color: '#2563eb' }}>Total de Lotes</p>
              <p className="text-2xl font-bold" style={{ color: '#1e40af' }}>
                {semenDoses.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm" style={{ color: '#16a34a' }}>Doses Disponíveis</p>
              <p className="text-2xl font-bold" style={{ color: '#166534' }}>
                {semenDoses.reduce((total, dose) =>
                  total + (parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0)), 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm" style={{ color: '#9333ea' }}>Touros Diferentes</p>
              <p className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
                {new Set(semenDoses.map(dose => dose.nomeTouro)).size}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm" style={{ color: '#ea580c' }}>Valor Total</p>
              <p className="text-lg font-bold" style={{ color: '#c2410c' }}>
                {formatCurrency(semenDoses.reduce((total, dose) =>
                  total + (parseFloat(dose.valor) || 0), 0
                ))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Doses - Layout Compacto */}
      <SemenDoseList
        doses={semenDoses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        formatCurrency={formatCurrency}
        getStatusColor={getStatusColor}
      />

      {/* Formulário */}
      {showForm && (
        <SemenDoseForm
          initialData={editingDose}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingDose(null); }}
        />
      )}
    </div>
  );
};

export default SemenManager;
