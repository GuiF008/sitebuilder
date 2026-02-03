import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const media = await prisma.media.findMany({
      where: { siteId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ media })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/', 'video/', 'audio/']
    const isValid = validTypes.some((type) => file.type.startsWith(type))
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'bin'
    const filename = `${uuidv4()}.${ext}`

    // Create upload directory
    const uploadDir = join(process.cwd(), 'uploads', id)
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(uploadDir, filename), buffer)

    // Determine type
    let type = 'image'
    if (file.type.startsWith('video/')) type = 'video'
    if (file.type.startsWith('audio/')) type = 'audio'

    // Create media record
    const media = await prisma.media.create({
      data: {
        siteId: id,
        type,
        filename,
        url: `/uploads/${id}/${filename}`,
        mimeType: file.type,
        size: file.size,
      },
    })

    return NextResponse.json({ media })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}
