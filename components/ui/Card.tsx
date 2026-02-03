'use client'

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  selected?: boolean
  onClick?: () => void
  hoverable?: boolean
}

export function Card({
  children,
  className = '',
  selected = false,
  onClick,
  hoverable = false,
}: CardProps) {
  const isClickable = !!onClick

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-ovh-lg border-2 
        transition-all duration-200
        ${selected 
          ? 'border-ovh-primary shadow-lg ring-2 ring-ovh-primary/20' 
          : 'border-ovh-gray-200'}
        ${isClickable || hoverable 
          ? 'cursor-pointer hover:border-ovh-primary/50 hover:shadow-md' 
          : ''}
        ${className}
      `}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {children}
    </div>
  )
}
