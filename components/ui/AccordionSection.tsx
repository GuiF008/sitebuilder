'use client'

import React, { useState } from 'react'

interface AccordionSectionProps {
  icon: string
  title: string
  subtitle: string
  children: React.ReactNode
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: () => void
}

export function AccordionSection({
  icon,
  title,
  subtitle,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
}: AccordionSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalIsOpen(!internalIsOpen)
    }
  }

  return (
    <div className="border-b border-ovh-gray-200">
      <button
        onClick={handleToggle}
        className={`
          w-full px-5 py-4 flex items-center justify-between
          text-left transition-all duration-200 hover:bg-ovh-gray-50
          ${isOpen ? 'border-l-4 border-l-ovh-primary bg-ovh-gray-50' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="font-semibold text-ovh-gray-800">{title}</div>
            <div className="text-sm text-ovh-gray-500">{subtitle}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-ovh-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-5 py-4 bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}
