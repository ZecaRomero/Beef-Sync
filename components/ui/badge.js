import React from "react";

export const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors";

  const variants = {
    default: "bg-blue-600 text-white dark:bg-blue-500 dark:text-white",
    outline: "border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300",
    success: "bg-green-600 text-white dark:bg-green-500 dark:text-white",
    warning: "bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white",
    error: "bg-red-600 text-white dark:bg-red-500 dark:text-white",
    secondary: "bg-gray-600 text-white dark:bg-gray-500 dark:text-white",
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};