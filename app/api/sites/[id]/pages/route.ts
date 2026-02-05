import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiHandler, ApiError, validateBody } from '@/lib/api-helpers'
import { createPageSchema } from '@/lib/validations'
import { generateUniqueSlug } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiHandler(async () => {
    const { id } = await params

    const pages = await prisma.page.findMany({
      where: { siteId: id },
      include: { sections: true },
      orderBy: { order: 'asc' },
    })

    return { pages }
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiHandler(async () => {
    const { id } = await params
    const body = await request.json()
    const { title } = validateBody(body, createPageSchema)

    // Vérifier que le site existe
    const site = await prisma.site.findUnique({
      where: { id },
    })

    if (!site) {
      throw new ApiError(404, 'Site non trouvé')
    }

    // Get max order
    const maxOrder = await prisma.page.aggregate({
      where: { siteId: id },
      _max: { order: true },
    })

    // Generate unique slug for this site avec limite de sécurité
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50)

    const slug = await generateUniqueSlug(
      baseSlug,
      async (s) => {
        const existing = await prisma.page.findFirst({
          where: { siteId: id, slug: s },
        })
        return !!existing
      },
      100 // Limite de sécurité
    )

    const page = await prisma.page.create({
      data: {
        siteId: id,
        title,
        slug,
        order: (maxOrder._max.order || 0) + 1,
        isHome: false,
        showInMenu: true,
      },
      include: { sections: true },
    })

    return { page }
  })
}
