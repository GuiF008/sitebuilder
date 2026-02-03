'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-ovh-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 
          border border-ovh-gray-300 rounded-ovh
          text-ovh-gray-800 placeholder:text-ovh-gray-400
          focus:outline-none focus:ring-2 focus:ring-ovh-primary focus:border-transparent
          disabled:bg-ovh-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {hint && !error && (
        <p className="mt-1.5 text-sm text-ovh-gray-500">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
