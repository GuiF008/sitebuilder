'use client'

import React, { useState } from 'react'
import { ColorPickerModal, ColorSwatchButton, Card } from '@/components/ui'
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

type ColorKey = 'primary' | 'secondary' | 'accent' | 'background' | 'text'

const COLOR_KEYS: { key: ColorKey; label: string }[] = [
  { key: 'primary', label: 'Primaire' },
  { key: 'secondary', label: 'Secondaire' },
  { key: 'accent', label: 'Accent' },
  { key: 'background', label: 'Fond' },
  { key: 'text', label: 'Texte' },
]

export function DesignPanel({
  site,
  theme,
  onThemeChange,
}: DesignPanelProps) {
  const [colorPickerKey, setColorPickerKey] = useState<ColorKey | null>(null)

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
        <div className="flex flex-wrap gap-3 items-center">
          {COLOR_KEYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-sm text-ovh-gray-700">{label}</span>
              <ColorSwatchButton
                value={theme.colors[key]}
                onClick={() => setColorPickerKey(key)}
                label={label}
              />
            </div>
          ))}
        </div>
      </div>
      {colorPickerKey && (
        <ColorPickerModal
          value={theme.colors[colorPickerKey]}
          onChange={(color) => {
            const map: Record<ColorKey, Record<string, string>> = {
              primary: { primaryColor: color },
              secondary: { secondaryColor: color },
              accent: { accentColor: color },
              background: { backgroundColor: color },
              text: { textColor: color },
            }
            onThemeChange(map[colorPickerKey])
          }}
          onClose={() => setColorPickerKey(null)}
          themeSwatches={[theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.text, theme.colors.background, theme.colors.muted]}
          title={`Couleur ${COLOR_KEYS.find((c) => c.key === colorPickerKey)?.label ?? ''}`}
        />
      )}

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

      {/* Boutons : Primaire / Secondaire - spec Styles du site */}
      <div>
        <h3 className="font-semibold text-ovh-gray-800 mb-3">Boutons (Primaire / Secondaire)</h3>
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

      {/* Animations - spec : Sans animation, Fondu, Diapositive, Échelle */}
      <div>
        <h3 className="font-semibold text-ovh-gray-800 mb-3">Animations</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'none', label: 'Sans animation' },
            { value: 'fade', label: 'Fondu' },
            { value: 'slide', label: 'Diapositive' },
            { value: 'scale', label: 'Échelle' },
          ].map((anim) => (
            <button
              key={anim.value}
              type="button"
              onClick={() => onThemeChange({ animation: anim.value })}
              className={`
                py-2 px-3 border-2 text-sm font-medium transition-all rounded-ovh
                ${(site.siteTheme as { animation?: string } | null)?.animation === anim.value
                  ? 'border-ovh-primary bg-ovh-primary/10 text-ovh-primary'
                  : 'border-ovh-gray-200 text-ovh-gray-600 hover:border-ovh-gray-300'}
              `}
            >
              {anim.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
