'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerModalProps {
  value: string
  onChange: (color: string) => void
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement | null>
  /** Palettes de couleurs du thème + couleurs de base */
  themeSwatches?: string[]
  title?: string
}

const DEFAULT_SWATCHES = [
  '#ffffff', '#000000', '#f3f4f6', '#1f2937', '#6b7280',
  '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6',
  '#ec4899', '#14b8a6',
]

function isValidHex(str: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str)
}

function normalizeHex(str: string): string {
  const m = str.replace('#', '').match(/[a-fA-F0-9]{1,6}/)
  if (!m) return '#000000'
  let hex = m[0]
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  if (hex.length < 6) hex = hex.padEnd(6, '0')
  return '#' + hex
}

export function ColorPickerModal({
  value,
  onChange,
  onClose,
  anchorRef,
  themeSwatches = [],
  title = 'Choisir une couleur',
}: ColorPickerModalProps) {
  const safeValue = value && isValidHex(value) ? value : value?.startsWith('#') ? normalizeHex(value) : '#000000'
  const [inputValue, setInputValue] = useState(safeValue)
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('sitebuilder-recent-colors')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(safeValue)
  }, [value, safeValue])

  const handleChange = (color: string) => {
    const hex = color.startsWith('#') ? color : '#' + color
    onChange(hex)
    setInputValue(hex)
  }

  const addToRecent = (color: string) => {
    const hex = color.startsWith('#') ? color : '#' + color
    setRecentColors(prev => {
      const next = [hex, ...prev.filter(c => c.toLowerCase() !== hex.toLowerCase())].slice(0, 8)
      try {
        localStorage.setItem('sitebuilder-recent-colors', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const handleSwatchClick = (c: string) => {
    const hex = c.startsWith('#') ? c : '#' + c
    handleChange(hex)
    addToRecent(hex)
  }

  const handleHexSubmit = () => {
    const hex = normalizeHex(inputValue)
    if (isValidHex(hex)) {
      handleChange(hex)
      addToRecent(hex)
    } else {
      setInputValue(safeValue)
    }
  }

  const handleEyedropper = async () => {
    if (typeof window === 'undefined' || !('EyeDropper' in window)) return
    try {
      const dropper = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper()
      const result = await dropper.open()
      if (result?.sRGBHex) {
        handleChange(result.sRGBHex)
        addToRecent(result.sRGBHex)
      }
    } catch {
      // User cancelled or API not supported
    }
  }

  const content = (
    <div className="fixed inset-0 z-[350] bg-black/30" onClick={onClose}>
      <div
        ref={panelRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 w-[280px] bg-white rounded-xl border border-ovh-gray-200 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-3 py-2 border-b border-ovh-gray-100">
          <h3 className="text-sm font-semibold text-ovh-gray-900">{title}</h3>
        </div>

        <div className="p-3 space-y-3">
          {/* Roue chromatique + luminosité */}
          <div className="flex justify-center">
            <HexColorPicker
              color={safeValue}
              onChange={handleChange}
              style={{ width: '100%', height: 140 }}
              className="!w-full [&_.react-colorful__saturation]:rounded-lg [&_.react-colorful__hue]:rounded-full [&_.react-colorful__hue]:h-2 [&_.react-colorful__hue]:mt-2"
            />
          </div>

          {/* Couleur actuelle + pipette */}
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg border-2 border-ovh-gray-200 flex-shrink-0 shadow-sm"
              style={{ backgroundColor: safeValue }}
            />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={handleHexSubmit}
              onKeyDown={e => e.key === 'Enter' && handleHexSubmit()}
              className="flex-1 px-3 py-1.5 text-xs font-mono border border-ovh-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ovh-primary focus:border-ovh-primary"
              placeholder="#000000"
            />
            {typeof window !== 'undefined' && 'EyeDropper' in window && (
              <button
                type="button"
                onClick={handleEyedropper}
                className="p-2 rounded-lg hover:bg-ovh-gray-100 transition-colors"
                title="Pipette (choisir une couleur à l'écran)"
              >
                <svg className="w-4 h-4 text-ovh-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
            )}
          </div>

          {/* Palettes : thème + récents + prédéfinis */}
          <div className="space-y-1.5">
            {themeSwatches.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-ovh-gray-500 uppercase tracking-wide mb-1">Couleurs du thème</p>
                <div className="flex flex-wrap gap-1">
                  {themeSwatches.map((c, i) => (
                    <button
                      key={`theme-${i}`}
                      type="button"
                      onClick={() => handleSwatchClick(c)}
                      className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                        safeValue.toLowerCase() === (c.startsWith('#') ? c : '#' + c).toLowerCase()
                          ? 'border-ovh-primary ring-2 ring-ovh-primary/30 scale-110'
                          : 'border-white shadow'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
            {recentColors.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-ovh-gray-500 uppercase tracking-wide mb-1">Récemment utilisées</p>
                <div className="flex flex-wrap gap-1">
                  {recentColors.map((c, i) => (
                    <button
                      key={`recent-${i}`}
                      type="button"
                      onClick={() => handleSwatchClick(c)}
                      className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                        safeValue.toLowerCase() === c.toLowerCase() ? 'border-ovh-primary ring-2 ring-ovh-primary/30' : 'border-white shadow'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-medium text-ovh-gray-500 uppercase tracking-wide mb-1">Couleurs prédéfinies</p>
              <div className="flex flex-wrap gap-1">
                {DEFAULT_SWATCHES.map((c, i) => (
                  <button
                    key={`def-${i}`}
                    type="button"
                    onClick={() => handleSwatchClick(c)}
                    className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                      safeValue.toLowerCase() === (c.startsWith('#') ? c : '#' + c).toLowerCase()
                        ? 'border-ovh-primary ring-2 ring-ovh-primary/30 scale-110'
                        : 'border-white shadow'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null
}
