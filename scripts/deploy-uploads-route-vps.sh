#!/bin/sh
# À exécuter sur le VPS depuis la racine du repo (/opt/builder) si app/api/uploads/ n'existe pas.
# Crée app/api/uploads/route.ts et app/api/uploads/[...path]/route.ts
set -e
ROOT="${1:-.}"
cd "$ROOT"
mkdir -p "app/api/uploads/[...path]"

cat > app/api/uploads/route.ts << 'ROUTE1'
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
ROUTE1

cat > 'app/api/uploads/[...path]/route.ts' << 'ROUTE2'
import { NextRequest, NextResponse } from 'next/server'
import { createReadStream, statSync } from 'fs'
import { stat } from 'fs/promises'
import { join, extname } from 'path'
import { Readable } from 'stream'
import { getUploadsRoot } from '@/lib/uploads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MIME_TYPES: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.ogg':  'audio/ogg',
  '.pdf':  'application/pdf',
}

function getMimeType(filename: string): string {
  const ext = extname(filename).toLowerCase()
  return MIME_TYPES[ext] ?? 'application/octet-stream'
}

function isSafeSegment(seg: string): boolean {
  return seg !== '..' && seg !== '.' && !seg.includes('/') && !seg.includes('\\')
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params
  if (!segments || segments.length < 2) {
    return new NextResponse('Not Found', { status: 404 })
  }
  if (!segments.every(isSafeSegment)) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const root = getUploadsRoot()
  const requestedPath = join(root, ...segments)
  if (!requestedPath.startsWith(root + '/') && requestedPath !== root) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  try {
    const fileStat = await stat(requestedPath)
    if (!fileStat.isFile()) {
      return new NextResponse('Not Found', { status: 404 })
    }
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
  let fileSize: number
  try {
    fileSize = statSync(requestedPath).size
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
  const filename = segments[segments.length - 1]
  const contentType = getMimeType(filename)
  const nodeStream = createReadStream(requestedPath)
  const webStream = Readable.toWeb(nodeStream) as ReadableStream
  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(fileSize),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
ROUTE2

echo "OK: app/api/uploads/route.ts et app/api/uploads/[...path]/route.ts créés."
ls -la app/api/uploads/
ls -la 'app/api/uploads/[...path]/'
