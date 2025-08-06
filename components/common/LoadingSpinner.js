import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Carregando...', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mb-4`}></div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;