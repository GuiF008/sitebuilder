'use client'

import { ComputedTheme, SectionStyles } from '@/lib/types'

interface BlockRendererProps {
  blocks: Array<{
    id: string
    type: string
    order: number
    content: string
    settings?: Record<string, unknown>
  }>
  theme: ComputedTheme
  sectionStyles?: SectionStyles
  className?: string
  isPublic?: boolean
}

/**
 * Composant partagé pour rendre les blocs de contenu
 * Utilisé à la fois dans l'éditeur et la page publique
 */
export function BlockRenderer({
  blocks,
  theme,
  sectionStyles,
  className = '',
  isPublic = false,
}: BlockRendererProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  // Utiliser les styles de section ou ceux du thème
  const headingFont = sectionStyles?.headingFont || theme.fonts.heading
  const bodyFont = sectionStyles?.bodyFont || theme.fonts.body
  const headingColor = sectionStyles?.headingColor || theme.colors.text
  const textColor = sectionStyles?.textColor || theme.colors.text
  const buttonStyle = sectionStyles?.buttonStyle || theme.buttonStyle
  const borderRadius = theme.borderRadius

  // Classes CSS selon le contexte (éditeur vs public)
  const roundedClass = isPublic ? 'rounded-lg' : 'rounded-ovh'

  return (
    <div className={`space-y-4 ${className}`}>
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'title':
            return (
              <h2
                key={block.id}
                className={`text-3xl font-bold ${
                  block.settings?.alignment === 'center'
                    ? 'text-center'
                    : block.settings?.alignment === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
                style={{ fontFamily: headingFont, color: headingColor }}
              >
                {block.content}
              </h2>
            )
          case 'subtitle':
            return (
              <h3
                key={block.id}
                className={`text-xl ${
                  block.settings?.alignment === 'center'
                    ? 'text-center'
                    : block.settings?.alignment === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
                style={{ fontFamily: headingFont, color: headingColor }}
              >
                {block.content}
              </h3>
            )
          case 'text':
            return (
              <p
                key={block.id}
                className="text-base leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: bodyFont, color: textColor }}
              >
                {block.content}
              </p>
            )
          case 'image':
            return block.content ? (
              <img
                key={block.id}
                src={block.content}
                alt={(block.settings?.alt as string) || 'Image'}
                className={`w-full h-auto ${roundedClass} object-cover`}
              />
            ) : null
          case 'video':
            return block.content ? (
              <video
                key={block.id}
                src={block.content}
                controls
                className={`w-full ${roundedClass}`}
              />
            ) : null
          case 'audio':
            return block.content ? (
              <audio key={block.id} src={block.content} controls className="w-full" />
            ) : null
          case 'button':
            return (
              <a
                key={block.id}
                href={(block.settings?.link as string) || '#'}
                className={`inline-block px-6 py-3 font-semibold text-white ${
                  isPublic ? 'transition-transform hover:scale-105' : ''
                }`}
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius:
                    buttonStyle === 'pill'
                      ? '9999px'
                      : buttonStyle === 'square'
                        ? '0'
                        : borderRadius,
                }}
              >
                {block.content}
              </a>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
