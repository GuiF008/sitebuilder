'use client'

import React from 'react'
import { ColorPicker, Card } from '@/components/ui'
import { SiteWithRelations, ComputedTheme } from '@/lib/types'
import { themePresets } from '@/lib/themes/presets'

interface DesignPanelProps {
  site: SiteWithRelations
  theme: ComputedTheme
  onThemeChange: (updates: Record<string, string>) => void
}

const FONTS = [
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Lato', label: 'Lato' },
]

const BUTTON_STYLES = [
  { value: 'square', label: 'Carré' },
  { value: 'rounded', label: 'Arrondi' },
  { value: 'pill', label: 'Pilule' },
]

export function DesignPanel({
  site,
  theme,
  onThemeChange,
}: DesignPanelProps) {
  const handlePresetSelect = (presetId: string) => {
    const preset = themePresets.find(p => p.id === presetId)
    if (!preset) return

    onThemeChange({
      themeFamily: presetId,
      primaryColor: preset.colors.primary,
      secondaryColor: preset.colors.secondary,
      accentColor: preset.colors.accent,
      backgroundColor: preset.colors.background,
      textColor: preset.colors.text,
      headingFont: preset.fonts.heading,
      bodyFont: preset.fonts.body,
      borderRadius: preset.borderRadius,
      buttonStyle: preset.buttonStyle,
    })
  }

  return (
    <div className="space-y-6">
      {/* Theme presets */}
      <div>
        <h3 className="font-semibold text-ovh-gray-800 mb-3">Modèles</h3>
        <div className="grid grid-cols-2 gap-2">
          {themePresets.map((preset) => (
            <Card
              key={preset.id}
              selected={site.themeFamily === preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className="p-2 cursor-pointer theme-preset"
            >
              {/* Mini preview */}
              <div
                className="h-12 rounded mb-2 relative overflow-hidden"
                style={{ backgroundColor: preset.colors.background }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-3"
                  style={{ backgroundColor: preset.colors.primary }}
                />
                <div className="absolute top-5 left-2 right-2">
                  <div
                    className="h-1.5 rounded-full mb-1"
                    style={{ backgroundColor: preset.colors.primary, width: '50%' }}
                  />
                  <div
                    className="h-1 rounded-full"
                    style={{ backgroundColor: preset.colors.muted, width: '70%' }}
                  />
                </div>
              </div>
              <div className="text-xs font-medium text-ovh-gray-700 truncate">
                {preset.name}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold text-ovh-gray-800 mb-3">Couleurs</h3>
        <div className="space-y-3">
          <ColorPicker
            label="Primaire"
            value={theme.colors.primary}
            onChange={(color) => onThemeChange({ primaryColor: color })}
          />
          <ColorPicker
            label="Secondaire"
            value={theme.colors.secondary}
            onChange={(color) => onThemeChange({ secondaryColor: color })}
          />
          <ColorPicker
            label="Accent"
            value={theme.colors.accent}
            onChange={(color) => onThemeChange({ accentColor: color })}
          />
          <ColorPicker
            label="Fond"
            value={theme.colors.background}
            onChange={(color) => onThemeChange({ backgroundColor: color })}
          />
          <ColorPicker
            label="Texte"
            value={theme.colors.text}
            onChange={(color) => onThemeChange({ textColor: color })}
          />
        </div>
      </div>

      {/* Fonts */}
      <div>
        <h3 className="font-semibold text-ovh-gray-800 mb-3">Polices</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">
              Titres
            </label>
            <select
              value={site.siteTheme?.headingFont || 'Source Sans Pro'}
              onChange={(e) => onThemeChange({ headingFont: e.target.value })}
              className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ovh-gray-700 mb-1.5">
              Texte
            </label>
            <select
              value={site.siteTheme?.bodyFont || 'Source Sans Pro'}
              onChange={(e) => onThemeChange({ bodyFont: e.target.value })}
              className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh focus:outline-none focus:ring-2 focus:ring-ovh-primary text-sm"
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Button style */}
      <div>
        <h3 className="font-semibold text-ovh-gray-800 mb-3">Style des boutons</h3>
        <div className="flex gap-2">
          {BUTTON_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => onThemeChange({ buttonStyle: style.value })}
              className={`
                flex-1 py-2 px-3 border-2 text-sm font-medium transition-all
                ${style.value === 'square' ? 'rounded-none' : ''}
                ${style.value === 'rounded' ? 'rounded-ovh' : ''}
                ${style.value === 'pill' ? 'rounded-full' : ''}
                ${theme.buttonStyle === style.value
                  ? 'border-ovh-primary bg-ovh-primary text-white'
                  : 'border-ovh-gray-300 text-ovh-gray-600 hover:border-ovh-gray-400'}
              `}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
