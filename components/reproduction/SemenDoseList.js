import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PencilIcon as EditIcon, TrashIcon } from '@heroicons/react/24/outline';

const SemenDoseList = ({ doses, onEdit, onDelete, formatCurrency, getStatusColor }) => (
    <div className="grid grid-cols-1 gap-2 md:gap-3 md:grid-cols-2 lg:grid-cols-3">
        {doses.map((dose) => (
            <Card key={dose.id} className="p-2 md:p-3 lg:p-4 cursor-pointer hover:shadow-md transition-all duration-200" 
                  aria-label={`Dose de sêmen do touro ${dose.nomeTouro}`} 
                  tabIndex={0}
                  onClick={() => onEdit(dose)}>
                <div className="space-y-2 md:space-y-3">
                    {/* Header compacto */}
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xs md:text-sm lg:text-base text-gray-900 dark:text-gray-100 truncate">
                                {dose.nomeTouro}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {dose.raca} • RG: {dose.rg}
                            </p>
                        </div>
                        <div className="flex space-x-1 ml-1 flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(dose);
                                }}
                                className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 p-0"
                                aria-label={`Editar dose do touro ${dose.nomeTouro}`}
                            >
                                <EditIcon className="h-3 w-3 md:h-3 md:w-3 lg:h-4 lg:w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(dose.id);
                                }}
                                className="text-red-600 hover:text-red-700 h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 p-0"
                                aria-label={`Remover dose do touro ${dose.nomeTouro}`}
                            >
                                <TrashIcon className="h-3 w-3 md:h-3 md:w-3 lg:h-4 lg:w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Informações compactas */}
                    <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 mb-0.5 text-xs">Fornecedor:</p>
                            <p className="text-gray-900 dark:text-gray-100 truncate font-medium text-xs">{dose.fornecedor}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 mb-0.5 text-xs">Valor:</p>
                            <p className="text-gray-900 dark:text-gray-100 font-medium text-xs">{formatCurrency(dose.valor)}</p>
                        </div>
                    </div>

                    {/* Status compacto */}
                    <div className="flex justify-between items-center pt-1 md:pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <div
                                className={`w-1.5 h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 rounded-full ${getStatusColor(dose.quantidadeUsada || 0, parseInt(dose.quantidadeDoses))}`}
                                aria-label="Status de uso"
                            ></div>
                            <span className="text-xs text-gray-900 dark:text-gray-100 font-medium">
                                {(parseInt(dose.quantidadeDoses) - (dose.quantidadeUsada || 0))}/{dose.quantidadeDoses}
                            </span>
                        </div>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 md:px-2 md:py-1">
                            {Math.round(((dose.quantidadeUsada || 0) / parseInt(dose.quantidadeDoses)) * 100)}%
                        </Badge>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

export default SemenDoseList;
