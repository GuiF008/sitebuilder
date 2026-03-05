'use client'

import { ComputedTheme, SectionStyles } from '@/lib/types'
import { SocialIconLogo } from '@/components/shared/SocialIconLogo'

export type BlockData = {
  id: string
  type: string
  order: number
  content: string
  settings?: Record<string, unknown>
}

interface BlockRendererProps {
  blocks: BlockData[]
  theme: ComputedTheme
  sectionStyles?: SectionStyles
  className?: string
  isPublic?: boolean
  publicBasePath?: string
  onBlockClick?: (block: BlockData) => void
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
  onBlockClick,
}: BlockRendererProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  const headingFont = sectionStyles?.headingFont || theme.fonts.heading
  const bodyFont = sectionStyles?.bodyFont || theme.fonts.body
  const headingColor = sectionStyles?.headingColor || theme.colors.text
  const textColor = sectionStyles?.textColor || theme.colors.text
  const buttonStyle = sectionStyles?.buttonStyle || theme.buttonStyle
  const borderRadius = theme.borderRadius

  const roundedClass = isPublic ? 'rounded-lg' : 'rounded-ovh'

  const wrapClickable = (block: BlockData, element: React.ReactNode) => {
    if (!onBlockClick || isPublic) return element
    return (
      <div
        key={`wrap-${block.id}`}
        className="relative group/block cursor-pointer rounded-ovh transition-all hover:outline hover:outline-2 hover:outline-ovh-primary/50 hover:outline-offset-2"
        onClick={(e) => { e.stopPropagation(); onBlockClick(block) }}
        title="Cliquer pour paramétrer"
      >
        {element}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
          <span className="bg-ovh-primary text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
            Modifier
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {sortedBlocks.map((block) => {
        let rendered: React.ReactNode = null
        switch (block.type) {
          case 'title':
            {
              const fontFamily = (block.settings?.textFont as string) || headingFont
              const fontSize = typeof block.settings?.textSize === 'number' ? `${block.settings.textSize}px` : undefined
              const color = (block.settings?.textColor as string) || headingColor
              const fontWeight = block.settings?.textBold ? 700 : 700
              const fontStyle = block.settings?.textItalic ? 'italic' : 'normal'
              const textDecoration = block.settings?.textUnderline ? 'underline' : 'none'
            rendered = (
              <h2
                key={block.id}
                className={`text-3xl font-bold ${
                  block.settings?.alignment === 'center'
                    ? 'text-center'
                    : block.settings?.alignment === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
                style={{ fontFamily, color, fontWeight, fontStyle, textDecoration, fontSize }}
              >
                {block.content}
              </h2>
            )
            break
            }
          case 'subtitle':
            {
              const fontFamily = (block.settings?.textFont as string) || headingFont
              const fontSize = typeof block.settings?.textSize === 'number' ? `${block.settings.textSize}px` : undefined
              const color = (block.settings?.textColor as string) || headingColor
              const fontWeight = block.settings?.textBold ? 600 : 600
              const fontStyle = block.settings?.textItalic ? 'italic' : 'normal'
              const textDecoration = block.settings?.textUnderline ? 'underline' : 'none'
            rendered = (
              <h3
                key={block.id}
                className={`text-xl ${
                  block.settings?.alignment === 'center'
                    ? 'text-center'
                    : block.settings?.alignment === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
                style={{ fontFamily, color, fontWeight, fontStyle, textDecoration, fontSize }}
              >
                {block.content}
              </h3>
            )
            break
            }
          case 'text':
            {
              const fontFamily = (block.settings?.textFont as string) || bodyFont
              const fontSize = typeof block.settings?.textSize === 'number' ? `${block.settings.textSize}px` : undefined
              const color = (block.settings?.textColor as string) || textColor
              const fontWeight = block.settings?.textBold ? 600 : 400
              const fontStyle = block.settings?.textItalic ? 'italic' : 'normal'
              const textDecoration = block.settings?.textUnderline ? 'underline' : 'none'
            rendered = (
              <p
                key={block.id}
                className="text-base leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily, color, fontWeight, fontStyle, textDecoration, fontSize }}
              >
                {block.content}
              </p>
            )
            break
            }
          case 'image': {
            const imgSize = (block.settings?.imageSize as string) || 'full'
            const sizeClasses: Record<string, string> = {
              small: 'max-w-[200px]',
              medium: 'max-w-[400px]',
              large: 'max-w-[600px]',
              full: 'w-full',
            }
            const sizeClass = sizeClasses[imgSize] || 'w-full'
            const alignImg = block.settings?.alignment as string
            const alignWrap = alignImg === 'center' ? 'mx-auto' : alignImg === 'right' ? 'ml-auto' : ''
            const imagePlaceholder = (
              <div key={block.id} className={`w-full min-h-[160px] bg-ovh-gray-50/80 ${roundedClass} flex flex-col items-center justify-center border-2 border-dashed border-ovh-gray-300 hover:border-ovh-primary transition-colors`}>
                <svg className="w-12 h-12 mb-2 text-ovh-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-ovh-gray-500">Cliquez pour ajouter une image</span>
              </div>
            )
            const imageWithOverlay = (
              <div key={block.id} className={`relative group ${sizeClass} ${alignWrap}`}>
                <img
                  src={block.content}
                  alt={(block.settings?.alt as string) || 'Image'}
                  className={`w-full h-auto ${roundedClass} object-cover`}
                />
                {!isPublic && onBlockClick && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit]">
                    <span className="text-sm font-medium text-white">Changer l&apos;image</span>
                  </div>
                )}
              </div>
            )
            rendered = block.content ? imageWithOverlay : imagePlaceholder
            break
          }
          case 'video': {
            const videoSize = (block.settings?.videoSize as string) || 'full'
            const sizeClasses: Record<string, string> = {
              small: 'max-w-[200px]',
              medium: 'max-w-[400px]',
              large: 'max-w-[600px]',
              full: 'w-full',
            }
            const sizeClass = sizeClasses[videoSize] || 'w-full'
            const alignVideo = block.settings?.alignment as string
            const alignWrap = alignVideo === 'center' ? 'mx-auto' : alignVideo === 'right' ? 'ml-auto' : ''

            rendered = block.content ? (
              <div key={block.id} className={`${sizeClass} ${alignWrap}`}>
                <video
                  src={block.content}
                  controls
                  className={`w-full h-auto ${roundedClass}`}
                />
              </div>
            ) : (
              <div key={block.id} className={`w-full h-40 bg-ovh-gray-100 ${roundedClass} flex items-center justify-center border-2 border-dashed border-ovh-gray-300`}>
                <span className="text-sm text-ovh-gray-400">Cliquez pour choisir une vidéo</span>
              </div>
            )
            break
          }
          case 'audio':
            rendered = block.content ? (
              <audio key={block.id} src={block.content} controls className="w-full" />
            ) : (
              <div key={block.id} className={`w-full h-16 bg-ovh-gray-100 ${roundedClass} flex items-center justify-center border-2 border-dashed border-ovh-gray-300`}>
                <span className="text-sm text-ovh-gray-400">Cliquez pour ajouter un audio</span>
              </div>
            )
            break
          case 'button': {
            const { href, isExternal } = getButtonHref(block, isPublic ? publicBasePath : undefined)
            rendered = (
              <a
                key={block.id}
                href={isPublic ? href : undefined}
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
                onClick={isPublic ? undefined : (e) => e.preventDefault()}
              >
                {block.content}
              </a>
            )
            break
          }
          case 'gallery': {
            let galleryImages: string[] = []
            try { galleryImages = JSON.parse(block.content || '[]') } catch { galleryImages = [] }
            const cols = (block.settings?.columns as number) || 3
            rendered = (
              <div key={block.id} className={`grid gap-2 py-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {galleryImages.length > 0 ? galleryImages.map((url, gi) => (
                  <img key={gi} src={url} alt="" className={`w-full aspect-square object-cover ${roundedClass}`} />
                )) : (
                  Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className={`aspect-square bg-ovh-gray-200 ${roundedClass} flex items-center justify-center text-ovh-gray-400 text-xs`}>Image</div>
                  ))
                )}
              </div>
            )
            break
          }
          case 'contact-form':
            rendered = (
              <div key={block.id} className="py-4 space-y-2 max-w-md">
                <input type="text" placeholder="Nom" className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh" readOnly />
                <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh" readOnly />
                <textarea placeholder="Message" className="w-full px-3 py-2 border border-ovh-gray-300 rounded-ovh" rows={3} readOnly />
                <button type="button" className="px-4 py-2 bg-ovh-primary text-white rounded-ovh text-sm">Envoyer</button>
              </div>
            )
            break
          case 'social-icons': {
            const icons = (() => {
              try { return JSON.parse(block.content || '[]') } catch { return [] }
            })() as Array<{ platform: string; url?: string }>
            const fallbackPlatforms = ['facebook', 'instagram', 'tiktok', 'twitter']
            const items =
              icons.length > 0
                ? icons
                : fallbackPlatforms.map((p) => ({ platform: p, url: '' }))

            const iconColor = textColor
            rendered = (
              <div key={block.id} className="flex gap-3 py-2">
                {items.map((icon, i) => {
                  const pill = (
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.08)', color: iconColor }}
                    >
                      <SocialIconLogo platform={icon.platform} color={iconColor} size={18} />
                    </span>
                  )

                  if (!icon.url) {
                    return <span key={i}>{pill}</span>
                  }

                  if (!isPublic) {
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="cursor-pointer"
                      >
                        {pill}
                      </button>
                    )
                  }

                  return (
                    <a
                      key={i}
                      href={icon.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pill}
                    </a>
                  )
                })}
              </div>
            )
            break
          }
          default:
            break
        }
        if (!rendered) return null
        return onBlockClick && !isPublic ? wrapClickable(block, rendered) : rendered
      })}
    </div>
  )
}
