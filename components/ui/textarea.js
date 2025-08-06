import React from 'react';

export const Textarea = ({ 
  className = '', 
  disabled = false,
  rows = 3,
  ...props 
}) => {
  return (
    <textarea
      rows={rows}
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};