import { NextResponse } from 'next/server'
import { themePresets } from '@/lib/themes/presets'

/**
 * GET /api/themes/catalog
 * Retourne le catalogue des 10 thèmes du builder.
 */
export async function GET() {
  const themes = themePresets.slice(0, 10).map((preset) => ({
    id: preset.id,
    name: preset.name,
    description: preset.description,
    preview: {
      primary: preset.colors.primary,
      secondary: preset.colors.secondary,
      accent: preset.colors.accent,
      background: preset.colors.background,
    },
  }))

  return NextResponse.json({ themes })
}
