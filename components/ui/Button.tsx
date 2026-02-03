'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-ovh-primary text-white hover:bg-ovh-primary-hover focus:ring-ovh-primary',
    secondary: 'bg-ovh-secondary text-white hover:bg-ovh-secondary/90 focus:ring-ovh-secondary',
    outline: 'border-2 border-ovh-primary text-ovh-primary hover:bg-ovh-primary hover:text-white focus:ring-ovh-primary',
    ghost: 'text-ovh-gray-600 hover:bg-ovh-gray-100 focus:ring-ovh-gray-300',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-ovh',
    md: 'px-5 py-2.5 text-base rounded-ovh',
    lg: 'px-8 py-3.5 text-lg rounded-ovh-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
