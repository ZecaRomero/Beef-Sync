import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PencilIcon as EditIcon, TrashIcon } from '@heroicons/react/24/outline';

const SemenDoseList = ({ doses, onEdit, onDelete, formatCurrency, getStatusColor }) => (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {doses.map((dose) => (
            <Card key={dose.id} className="p-3 md:p-4" aria-label={`Dose de sêmen do touro ${dose.nomeTouro}`} tabIndex={0}>
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">
                                {dose.nomeTouro}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {dose.raca} • RG: {dose.rg}
                            </p>
                        </div>
                        <div className="flex space-x-1 ml-2 flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(dose)}
                                className="h-7 w-7 md:h-8 md:w-8 p-0"
                                aria-label={`Editar dose do touro ${dose.nomeTouro}`}
                            >
                                <EditIcon className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(dose.id)}
                                className="text-red-600 hover:text-red-700 h-7 w-7 md:h-8 md:w-8 p-0"
                                aria-label={`Remover dose do touro ${dose.nomeTouro}`}
                            >
                                <TrashIcon className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Fornecedor:</p>
                            <p className="text-gray-900 dark:text-gray-100 truncate font-medium">{dose.fornecedor}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Valor:</p>
                            <p className="text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(dose.valor)}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                            <div
                                className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${getStatusColor(dose.quantidadeUsada || 0, parseInt(dose.quantidadeDoses))}`}
                                aria-label="Status de uso"
                            ></div>
                            <span className="text-xs md:text-sm text-gray-900 dark:text-gray-100 font-medium">
                                {(parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0))}/{dose.quantidadeDoses}
                            </span>
                        </div>
                        <Badge variant="outline" className="text-xs px-2 py-1">
                            {Math.round(((dose.quantidadeUsada || 0) / parseInt(dose.quantidadeDoses)) * 100)}%
                        </Badge>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

export default SemenDoseList;
