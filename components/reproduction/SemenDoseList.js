import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { EditIcon, TrashIcon } from '@heroicons/react/24/outline';

const SemenDoseList = ({ doses, onEdit, onDelete, formatCurrency, getStatusColor }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {doses.map((dose) => (
            <Card key={dose.id} className="p-3" aria-label={`Dose de sêmen do touro ${dose.nomeTouro}`} tabIndex={0}>
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-sm" style={{ color: '#111827' }}>
                                {dose.nomeTouro}
                            </h3>
                            <p className="text-xs" style={{ color: '#6b7280' }}>
                                {dose.raca} • RG: {dose.rg}
                            </p>
                        </div>
                        <div className="flex space-x-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(dose)}
                                className="h-6 w-6 p-0"
                                aria-label={`Editar dose do touro ${dose.nomeTouro}`}
                            >
                                <EditIcon className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(dose.id)}
                                className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                                aria-label={`Remover dose do touro ${dose.nomeTouro}`}
                            >
                                <TrashIcon className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p style={{ color: '#6b7280' }}>Fornecedor:</p>
                            <p style={{ color: '#111827' }} className="truncate">{dose.fornecedor}</p>
                        </div>
                        <div>
                            <p style={{ color: '#6b7280' }}>Valor:</p>
                            <p style={{ color: '#111827' }}>{formatCurrency(dose.valor)}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                            <div
                                className={`w-2 h-2 rounded-full ${getStatusColor(dose.quantidadeUsada || 0, parseInt(dose.quantidadeDoses))}`}
                                aria-label="Status de uso"
                            ></div>
                            <span className="text-xs" style={{ color: '#111827' }}>
                                {(parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0))}/{dose.quantidadeDoses}
                            </span>
                        </div>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                            {Math.round(((dose.quantidadeUsada || 0) / parseInt(dose.quantidadeDoses)) * 100)}%
                        </Badge>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

export default SemenDoseList;
