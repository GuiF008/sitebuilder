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
  /** Base path du site public (ex. /s/monsite) pour résoudre les liens Page / Section */
  publicBasePath?: string
}

/**
 * Composant partagé pour rendre les blocs de contenu
 * Utilisé à la fois dans l'éditeur et la page publique
 */
function getButtonHref(
  block: { settings?: Record<string, unknown> },
  publicBasePath?: string
): { href: string; isExternal: boolean } {
  const linkMode = (block.settings?.linkMode as string) || 'url'
  if (linkMode === 'page' && publicBasePath && block.settings?.pageSlug) {
    return { href: `${publicBasePath}?page=${encodeURIComponent(block.settings.pageSlug as string)}`, isExternal: false }
  }
  if (linkMode === 'section' && block.settings?.sectionId) {
    return { href: `#section-${block.settings.sectionId}`, isExternal: false }
  }
  const link = (block.settings?.link as string) || '#'
  const isExternal = link.startsWith('http://') || link.startsWith('https://')
  return { href: link, isExternal }
}

export function BlockRenderer({
  blocks,
  theme,
  sectionStyles,
  className = '',
  isPublic = false,
  publicBasePath = '',
}: BlockRendererProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  const headingFont = sectionStyles?.headingFont || theme.fonts.heading
  const bodyFont = sectionStyles?.bodyFont || theme.fonts.body
  const headingColor = sectionStyles?.headingColor || theme.colors.text
  const textColor = sectionStyles?.textColor || theme.colors.text
  const buttonStyle = sectionStyles?.buttonStyle || theme.buttonStyle
  const borderRadius = theme.borderRadius

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
          case 'button': {
            const { href, isExternal } = getButtonHref(block, isPublic ? publicBasePath : undefined)
            return (
              <a
                key={block.id}
                href={href}
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
                {...(isPublic && isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {block.content}
              </a>
            )
          }
          case 'shape':
            return (
              <div
                key={block.id}
                className="w-24 h-24 rounded-lg"
                style={{ backgroundColor: theme.colors.primary, opacity: 0.3 }}
              />
            )
          case 'gallery':
            return (
              <div key={block.id} className="grid grid-cols-3 gap-2 py-4">
                <div className="aspect-square bg-ovh-gray-200 rounded-lg" />
                <div className="aspect-square bg-ovh-gray-200 rounded-lg" />
                <div className="aspect-square bg-ovh-gray-200 rounded-lg" />
              </div>
            )
          case 'contact-form':
            return (
              <div key={block.id} className="py-4 space-y-2 max-w-md">
                <input type="text" placeholder="Nom" className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh" readOnly />
                <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh" readOnly />
                <textarea placeholder="Message" className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh" rows={3} readOnly />
                <button type="button" className="px-4 py-2 bg-ovh-primary text-white rounded-ovh text-sm">Envoyer</button>
              </div>
            )
          case 'social-icons':
            return (
              <div key={block.id} className="flex gap-3 py-2">
                <span className="w-8 h-8 rounded-full bg-ovh-gray-300" title="Réseau social" />
                <span className="w-8 h-8 rounded-full bg-ovh-gray-300" title="Réseau social" />
                <span className="w-8 h-8 rounded-full bg-ovh-gray-300" title="Réseau social" />
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
