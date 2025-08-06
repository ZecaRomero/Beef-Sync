import React from "react";

export const Select = ({
  children,
  value,
  onValueChange,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

// Componentes de compatibilidade (não utilizados na versão simplificada)
export const SelectTrigger = ({ children, className = "", ...props }) => {
  return <div className={className} {...props}>{children}</div>;
};

export const SelectValue = ({ placeholder, className = "", ...props }) => {
  return <span className={className} {...props}>{placeholder}</span>;
};

export const SelectContent = ({ children, className = "", ...props }) => {
  return <div className={className} {...props}>{children}</div>;
};

export const SelectItem = ({ children, value, className = "", ...props }) => {
  return (
    <option value={value} className={className} {...props}>
      {children}
    </option>
  );
};