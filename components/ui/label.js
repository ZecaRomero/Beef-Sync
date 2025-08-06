import React from "react";

export const Label = ({
  children,
  className = "",
  htmlFor,
  ...props
}) => {
  const baseClasses =
    "text-sm font-medium text-gray-700 dark:text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  return (
    <label
      htmlFor={htmlFor}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};