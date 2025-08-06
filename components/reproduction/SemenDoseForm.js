import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const defaultTouro = { nomeTouro: '', rg: '', raca: '', quantidadeDoses: '', valorIndividual: '' };
const defaultForm = {
    notaFiscal: '',
    fornecedor: '',
    valorTotal: '',
    data: '',
    observacoes: '',
    touros: [{ ...defaultTouro }]
};

const SemenDoseForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [submitError, setSubmitError] = useState('');
    const firstErrorRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                notaFiscal: initialData.notaFiscal || '',
                fornecedor: initialData.fornecedor || '',
                valorTotal: initialData.valor || '',
                data: initialData.data || '',
                observacoes: initialData.observacoes || '',
                touros: [{
                    nomeTouro: initialData.nomeTouro || '',
                    rg: initialData.rg || '',
                    raca: initialData.raca || '',
                    quantidadeDoses: initialData.quantidadeDoses || '',
                    valorIndividual: initialData.valor || ''
                }]
            });
        } else {
            setFormData(defaultForm);
        }
        setSuccess('');
        setSubmitError('');
    }, [initialData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTouroChange = (index, field, value) => {
        const newTouros = [...formData.touros];
        newTouros[index] = { ...newTouros[index], [field]: value };
        setFormData(prev => ({ ...prev, touros: newTouros }));
    };

    const addTouro = () => {
        setFormData(prev => ({ ...prev, touros: [...prev.touros, { ...defaultTouro }] }));
    };

    const removeTouro = (index) => {
        if (formData.touros.length > 1) {
            setFormData(prev => ({ ...prev, touros: prev.touros.filter((_, i) => i !== index) }));
        }
    };

    const validate = () => {
        const errs = {};
        if (!formData.notaFiscal) errs.notaFiscal = 'Obrigatório';
        if (!formData.fornecedor) errs.fornecedor = 'Obrigatório';
        if (!formData.data) errs.data = 'Obrigatório';
        if (!formData.touros[0].nomeTouro) errs.nomeTouro = 'Obrigatório';
        if (!formData.touros[0].quantidadeDoses) errs.quantidadeDoses = 'Obrigatório';
        setErrors(errs);
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess('');
        setSubmitError('');
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            // Foco no primeiro campo com erro
            if (firstErrorRef.current) firstErrorRef.current.focus();
            return;
        }
        try {
            onSubmit(formData, !!initialData);
            setSuccess('Salvo com sucesso!');
        } catch (err) {
            setSubmitError('Erro ao salvar. Tente novamente.');
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{initialData ? 'Editar Dose' : 'Nova Dose'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} aria-label="Formulário de dose de sêmen">
                    {success && <div className="text-green-600 mb-2" role="status">{success}</div>}
                    {submitError && <div className="text-red-600 mb-2" role="alert">{submitError}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="notaFiscal">Nota Fiscal</Label>
                            <Input id="notaFiscal" aria-required="true" value={formData.notaFiscal} onChange={e => handleInputChange('notaFiscal', e.target.value)} ref={errors.notaFiscal ? firstErrorRef : null} />
                            {errors.notaFiscal && <span className="text-red-500 text-xs" role="alert">{errors.notaFiscal}</span>}
                        </div>
                        <div>
                            <Label htmlFor="fornecedor">Fornecedor</Label>
                            <Input id="fornecedor" aria-required="true" value={formData.fornecedor} onChange={e => handleInputChange('fornecedor', e.target.value)} ref={errors.fornecedor && !errors.notaFiscal ? firstErrorRef : null} />
                            {errors.fornecedor && <span className="text-red-500 text-xs" role="alert">{errors.fornecedor}</span>}
                        </div>
                        <div>
                            <Label htmlFor="valorTotal">Valor Total</Label>
                            <Input id="valorTotal" value={formData.valorTotal} onChange={e => handleInputChange('valorTotal', e.target.value)} type="number" />
                        </div>
                        <div>
                            <Label htmlFor="data">Data</Label>
                            <Input id="data" aria-required="true" value={formData.data} onChange={e => handleInputChange('data', e.target.value)} type="date" ref={errors.data && !errors.notaFiscal && !errors.fornecedor ? firstErrorRef : null} />
                            {errors.data && <span className="text-red-500 text-xs" role="alert">{errors.data}</span>}
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea id="observacoes" value={formData.observacoes} onChange={e => handleInputChange('observacoes', e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Label className="block mb-2">Touros</Label>
                        {formData.touros.map((touro, idx) => (
                            <div key={idx} className="flex flex-wrap gap-2 mb-2 items-end">
                                <Input className="w-1/4 min-w-[120px]" placeholder="Nome do Touro" value={touro.nomeTouro} onChange={e => handleTouroChange(idx, 'nomeTouro', e.target.value)} aria-label="Nome do Touro" />
                                <Input className="w-1/6 min-w-[80px]" placeholder="RG" value={touro.rg} onChange={e => handleTouroChange(idx, 'rg', e.target.value)} aria-label="RG" />
                                <Input className="w-1/6 min-w-[80px]" placeholder="Raça" value={touro.raca} onChange={e => handleTouroChange(idx, 'raca', e.target.value)} aria-label="Raça" />
                                <Input className="w-1/6 min-w-[80px]" placeholder="Qtd Doses" value={touro.quantidadeDoses} onChange={e => handleTouroChange(idx, 'quantidadeDoses', e.target.value)} type="number" aria-label="Quantidade de Doses" />
                                <Input className="w-1/6 min-w-[80px]" placeholder="Valor Unitário" value={touro.valorIndividual} onChange={e => handleTouroChange(idx, 'valorIndividual', e.target.value)} type="number" aria-label="Valor Unitário" />
                                <Button type="button" variant="destructive" onClick={() => removeTouro(idx)} disabled={formData.touros.length === 1} aria-label="Remover touro"><TrashIcon className="w-4 h-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addTouro} className="mt-2" aria-label="Adicionar touro"><PlusIcon className="w-4 h-4 mr-1" />Adicionar Touro</Button>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SemenDoseForm;
