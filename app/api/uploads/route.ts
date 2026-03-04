import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/uploads sans path => 404.
 * Les fichiers sont servis via GET /api/uploads/<siteId>/<filename>
 * (route catch-all dans [...path]/route.ts).
 */
export async function GET() {
  return new NextResponse('Not Found', { status: 404 })
}
