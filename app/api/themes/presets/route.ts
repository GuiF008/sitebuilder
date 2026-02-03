import { NextResponse } from 'next/server'
import { themePresets } from '@/lib/themes/presets'

export async function GET() {
  return NextResponse.json({ presets: themePresets })
}
