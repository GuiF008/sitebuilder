'use client'

import React from 'react'

interface ColorSwatchButtonProps {
  value: string
  onClick: () => void
  label?: string
  className?: string
}

export function ColorSwatchButton({ value, onClick, label, className = '' }: ColorSwatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-8 h-8 rounded-lg border-2 border-white shadow-md cursor-pointer overflow-hidden flex-shrink-0 hover:scale-105 transition-transform ${className}`.trim()}
      style={{ backgroundColor: value }}
      title={label || 'Choisir une couleur'}
    />
  )
}
