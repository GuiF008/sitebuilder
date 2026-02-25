import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'

const THEMES_FOLDER = 'THEME_LIST'

/**
 * Formate un identifiant de thème en nom d'affichage (ex: "solid-state" → "Solid State")
 */
function formatThemeName(id: string): string {
  return id
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * GET /api/themes/php
 * Liste les thèmes PHP (dossiers) disponibles dans THEME_LIST.
 * Chaque sous-dossier est considéré comme un thème.
 */
export async function GET() {
  try {
    const basePath = path.join(process.cwd(), THEMES_FOLDER)
    const entries = await readdir(basePath, { withFileTypes: true })
    const themes = entries
      .filter((ent) => ent.isDirectory() && !ent.name.startsWith('.'))
      .map((ent) => ({
        id: ent.name,
        name: formatThemeName(ent.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ themes })
  } catch (err) {
    console.error('Erreur lecture thèmes PHP:', err)
    return NextResponse.json(
      { themes: [], error: 'Impossible de lire le dossier des thèmes' },
      { status: 200 }
    )
  }
}
