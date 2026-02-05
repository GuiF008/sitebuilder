import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Créer une nouvelle section
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params
    const { type } = await request.json()

    // Vérifier que la page existe
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { sections: true },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Déterminer l'ordre (dernier + 1)
    const maxOrder = page.sections.length > 0
      ? Math.max(...page.sections.map(s => s.order))
      : -1

    // Données par défaut selon le type
    const defaultData: Record<string, unknown> = {
      hero: {
        title: 'Titre principal',
        subtitle: 'Sous-titre',
        ctaText: 'En savoir plus',
        ctaLink: '#',
      },
      about: {
        title: 'À propos',
        content: 'Votre texte ici...',
      },
      text: {
        title: 'Titre',
        subtitle: 'Sous-titre',
        content: 'Votre contenu ici...',
      },
      'image-text': {
        title: 'Titre',
        subtitle: 'Sous-titre',
        content: 'Votre contenu ici...',
        image: '',
      },
      services: {
        title: 'Nos services',
        services: [
          { icon: '⚙️', title: 'Service 1', description: 'Description' },
        ],
      },
      gallery: {
        title: 'Galerie',
        images: [],
      },
      contact: {
        title: 'Contact',
        email: '',
      },
    }

    const section = await prisma.section.create({
      data: {
        pageId,
        type,
        order: maxOrder + 1,
        dataJson: JSON.stringify(defaultData[type] || {}),
      },
    })

    return NextResponse.json({ section })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    )
  }
}

// Réordonner les sections
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params
    const { sectionId, direction } = await request.json()

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { sections: { orderBy: { order: 'asc' } } },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    const sectionIndex = page.sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1
    if (targetIndex < 0 || targetIndex >= page.sections.length) {
      return NextResponse.json(
        { error: 'Invalid move' },
        { status: 400 }
      )
    }

    const currentSection = page.sections[sectionIndex]
    const targetSection = page.sections[targetIndex]

    // Échanger les ordres
    await prisma.section.update({
      where: { id: currentSection.id },
      data: { order: targetSection.order },
    })

    await prisma.section.update({
      where: { id: targetSection.id },
      data: { order: currentSection.order },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering sections:', error)
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    )
  }
}
