'use client'

import React from 'react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-medium text-ovh-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-ovh border border-ovh-gray-300 cursor-pointer overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs font-mono border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-1 focus:ring-ovh-primary"
        />
      </div>
    </div>
  )
}
