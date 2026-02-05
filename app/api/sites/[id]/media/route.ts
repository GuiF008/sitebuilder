import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { apiHandler, ApiError } from '@/lib/api-helpers'
import { sanitizeFilename } from '@/lib/utils'

// Types MIME autorisés avec extensions correspondantes
const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
}

const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 50 * 1024 * 1024, // 50MB
  audio: 20 * 1024 * 1024, // 20MB
}

/**
 * Valide le type MIME réel d'un fichier en vérifiant les magic bytes
 */
async function validateFileType(file: File): Promise<{ isValid: boolean; type: 'image' | 'video' | 'audio' | null }> {
  // Vérification basique du MIME type déclaré
  const declaredMime = file.type
  if (!ALLOWED_MIME_TYPES[declaredMime as keyof typeof ALLOWED_MIME_TYPES]) {
    return { isValid: false, type: null }
  }

  // Vérification des magic bytes (premiers octets du fichier)
  const buffer = Buffer.from(await file.arrayBuffer())
  const header = buffer.slice(0, 12)

  // Images
  if (
    header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff // JPEG
  ) {
    return { isValid: declaredMime.startsWith('image/'), type: 'image' }
  }
  if (
    header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47 // PNG
  ) {
    return { isValid: declaredMime.startsWith('image/'), type: 'image' }
  }
  if (
    header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46 // GIF
  ) {
    return { isValid: declaredMime.startsWith('image/'), type: 'image' }
  }
  if (
    header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50 // WEBP
  ) {
    return { isValid: declaredMime.startsWith('image/'), type: 'image' }
  }

  // Vidéos
  if (
    header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70 // MP4
  ) {
    return { isValid: declaredMime.startsWith('video/'), type: 'video' }
  }
  if (
    header[0] === 0x1a && header[1] === 0x45 && header[2] === 0xdf && header[3] === 0xa3 // WebM
  ) {
    return { isValid: declaredMime.startsWith('video/'), type: 'video' }
  }

  // Audio
  if (
    header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33 // MP3 ID3
  ) {
    return { isValid: declaredMime.startsWith('audio/'), type: 'audio' }
  }
  if (
    header[0] === 0xff && (header[1] === 0xfb || header[1] === 0xf3 || header[1] === 0xf2) // MP3
  ) {
    return { isValid: declaredMime.startsWith('audio/'), type: 'audio' }
  }
  if (
    header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[8] === 0x57 && header[9] === 0x41 && header[10] === 0x56 && header[11] === 0x45 // WAV
  ) {
    return { isValid: declaredMime.startsWith('audio/'), type: 'audio' }
  }

  // Si on ne reconnaît pas le format, on accepte basé sur le MIME déclaré (fallback)
  if (declaredMime.startsWith('image/')) return { isValid: true, type: 'image' }
  if (declaredMime.startsWith('video/')) return { isValid: true, type: 'video' }
  if (declaredMime.startsWith('audio/')) return { isValid: true, type: 'audio' }

  return { isValid: false, type: null }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiHandler(async () => {
    const { id } = await params

    const media = await prisma.media.findMany({
      where: { siteId: id },
      orderBy: { createdAt: 'desc' },
    })

    return { media }
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiHandler(async () => {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      throw new ApiError(400, 'Aucun fichier fourni')
    }

    // Valider le type de fichier réel
    const validation = await validateFileType(file)
    if (!validation.isValid || !validation.type) {
      throw new ApiError(400, 'Type de fichier non autorisé')
    }

    const fileType = validation.type

    // Valider la taille
    const maxSize = MAX_FILE_SIZES[fileType]
    if (file.size > maxSize) {
      throw new ApiError(
        400,
        `Fichier trop volumineux. Taille max: ${maxSize / 1024 / 1024}MB`
      )
    }

    // Générer un nom de fichier sécurisé
    const originalExt = file.name.split('.').pop() || 'bin'
    const sanitizedExt = sanitizeFilename(originalExt)
    const filename = `${uuidv4()}.${sanitizedExt}`

    // Create upload directory
    const uploadDir = join(process.cwd(), 'uploads', id)
    await mkdir(uploadDir, { recursive: true })

    // Vérifier que le site existe
    const site = await prisma.site.findUnique({
      where: { id },
    })

    if (!site) {
      throw new ApiError(404, 'Site non trouvé')
    }

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(uploadDir, filename), buffer)

    // Create media record
    const media = await prisma.media.create({
      data: {
        siteId: id,
        type: fileType,
        filename,
        url: `/uploads/${id}/${filename}`,
        mimeType: file.type,
        size: file.size,
      },
    })

    return { media }
  })
}
