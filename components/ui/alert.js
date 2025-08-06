import React from 'react';

export const Alert = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div
      className={`relative w-full rounded-lg border p-4 text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div
      className={`text-sm text-gray-900 font-medium ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};