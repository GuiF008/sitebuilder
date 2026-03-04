import { NextRequest, NextResponse } from 'next/server'
import { createReadStream, statSync } from 'fs'
import { stat } from 'fs/promises'
import { join, extname } from 'path'
import { Readable } from 'stream'
import { getUploadsRoot } from '@/lib/uploads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Table MIME inline (pas de dépendance externe)
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

/** Refuse tout segment contenant ".." ou chemins absolus */
function isSafeSegment(seg: string): boolean {
  return seg !== '..' && seg !== '.' && !seg.includes('/') && !seg.includes('\\')
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params

  // Minimum : [siteId, filename]
  if (!segments || segments.length < 2) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Validation anti path-traversal sur chaque segment
  if (!segments.every(isSafeSegment)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const root = getUploadsRoot()
  const requestedPath = join(root, ...segments)

  // Double-vérification : le chemin résolu doit rester sous root
  if (!requestedPath.startsWith(root + '/') && requestedPath !== root) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Vérifier que le fichier existe et est un fichier (pas un dossier)
  try {
    const fileStat = await stat(requestedPath)
    if (!fileStat.isFile()) {
      return new NextResponse('Not Found', { status: 404 })
    }
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Taille pour Content-Length
  let fileSize: number
  try {
    fileSize = statSync(requestedPath).size
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }

  const filename = segments[segments.length - 1]
  const contentType = getMimeType(filename)

  // Stream du fichier vers la réponse
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
