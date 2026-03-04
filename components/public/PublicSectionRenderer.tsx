'use client'

import { ComputedTheme, SectionStyles } from '@/lib/types'
import { SocialIconLogo } from '@/components/shared/SocialIconLogo'
import { PictoIcon } from '@/components/shared/PictoIcon'
import { safeJsonParse } from '@/lib/utils'
import { BlockRenderer } from '@/components/shared/BlockRenderer'
import { getThemeBranding } from '@/lib/themes/branding'

export function getRhythmBackground(index: number, theme: ComputedTheme): string {
  const colors = [theme.colors.background, theme.colors.muted]
  return colors[index % colors.length]
}

interface PublicSectionProps {
  section: { id: string; type: string; dataJson: string }
  sectionIndex: number
  theme: ComputedTheme
  themeFamily: string
  publicBasePath: string
}

export function PublicSection({ section, sectionIndex, theme, themeFamily, publicBasePath }: PublicSectionProps) {
  const data = safeJsonParse<Record<string, unknown>>(section.dataJson, {}) || {}
  const branding = getThemeBranding(themeFamily, theme)

  const getDataValue = (key: string): string => (data[key] as string) || ''

  const sectionStyles: SectionStyles = (data.sectionStyles as SectionStyles) || {
    headingFont: theme.fonts.heading,
    bodyFont: theme.fonts.body,
    headingColor: theme.colors.text,
    textColor: theme.colors.text,
    buttonStyle: theme.buttonStyle,
  }

  const sectionId = `section-${section.id}`
  const rhythmBg = getRhythmBackground(sectionIndex, theme)
  const contentAlignment = (data.contentAlignment as 'left' | 'center' | 'right') || 'left'
  const sectionImages: string[] = Array.isArray(data.sectionImages) ? (data.sectionImages as string[]) : []
  const alignmentClass = contentAlignment === 'center' ? 'text-center' : contentAlignment === 'right' ? 'text-right' : 'text-left'

  const hasBgImage = !!sectionStyles.backgroundImage
  const hasBgVideo = !!sectionStyles.backgroundVideo
  const hasBgMedia = hasBgImage || hasBgVideo
  const bgOverlayColor = sectionStyles.overlayColor || '#000000'
  const bgOverlayOpacity = sectionStyles.overlayOpacity ?? 0.5
  const bgFixed = sectionStyles.bgFixed || false
  const bgPosition = sectionStyles.bgPosition ?? 50
  const isGradient = sectionStyles.bgMode === 'gradient'
  const sectionBgStyle: React.CSSProperties = {
    ...(isGradient
      ? {
          background: `linear-gradient(${sectionStyles.gradientAngle ?? 135}deg, ${sectionStyles.gradientColor1 || '#3385b5'}, ${sectionStyles.gradientColor2 || '#7b2d8e'})`,
        }
      : {
          backgroundColor: sectionStyles.backgroundColor ?? (section.type === 'hero' ? branding.heroBg : rhythmBg),
        }),
    ...(hasBgImage
      ? {
          backgroundImage: `url(${sectionStyles.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: `center ${bgPosition}%`,
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: bgFixed ? 'fixed' : 'scroll',
        }
      : {}),
  }
  const BgOverlay = hasBgMedia ? (
    <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: bgOverlayColor, opacity: bgOverlayOpacity }} />
  ) : null
  const BgVideo =
    hasBgVideo && !hasBgImage ? (
      <video
        src={sectionStyles.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: `center ${bgPosition}%` }}
      />
    ) : null

  if (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0 && section.type !== 'services' && section.type !== 'gallery') {
    return (
      <section id={sectionId} className={`py-8 mb-4 px-4 rounded-lg scroll-mt-16 ${hasBgMedia ? 'relative overflow-hidden' : ''}`} style={sectionBgStyle}>
        {BgVideo}
        {BgOverlay}
        {sectionImages.length > 0 && (
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 ${alignmentClass}`}>
            {sectionImages.slice(0, 4).map((url, i) => (
              <img key={i} src={url} alt="" className="w-full aspect-video object-cover rounded-lg" />
            ))}
          </div>
        )}
        <div className={alignmentClass}>
          <BlockRenderer
            blocks={data.blocks as Array<{ id: string; type: string; order: number; content: string; settings?: Record<string, unknown> }>}
            sectionStyles={sectionStyles}
            theme={theme}
            isPublic={true}
            publicBasePath={publicBasePath}
          />
        </div>
      </section>
    )
  }

  switch (section.type) {
    case 'hero': {
      const ctaLink = (data.ctaLink as string) || '#'
      const isExternalCta = ctaLink.startsWith('http://') || ctaLink.startsWith('https://')
      return (
        <section
          id={sectionId}
          className={`py-20 text-center mb-8 rounded-lg scroll-mt-16 ${hasBgMedia ? 'relative overflow-hidden' : ''}`}
          style={{ ...sectionBgStyle, backgroundColor: sectionStyles.backgroundColor || branding.heroBg }}
        >
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>
            <h1 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: sectionStyles.headingFont }}>
              {getDataValue('title')}
            </h1>
            <p className="text-xl text-white/80 mb-8" style={{ fontFamily: sectionStyles.bodyFont }}>
              {getDataValue('subtitle')}
            </p>
            {getDataValue('ctaText') && (
              <a
                href={ctaLink}
                className="inline-block px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
                style={{
                  backgroundColor: branding.heroCtaBg,
                  color: branding.heroCtaText,
                  borderRadius:
                    sectionStyles.buttonStyle === 'pill' ? '9999px' : sectionStyles.buttonStyle === 'square' ? '0' : theme.borderRadius,
                }}
                {...(isExternalCta ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {getDataValue('ctaText')}
              </a>
            )}
          </div>
        </section>
      )
    }

    case 'about':
      return (
        <section id={sectionId} className={`py-12 mb-8 rounded-lg scroll-mt-16 ${hasBgMedia ? 'relative overflow-hidden' : ''}`} style={sectionBgStyle}>
          {BgVideo}
          {BgOverlay}
          <div className={hasBgMedia ? 'relative z-10' : ''}>
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
              {getDataValue('title')}
            </h2>
            <p className="text-lg leading-relaxed" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
              {getDataValue('content')}
            </p>
          </div>
        </section>
      )

    case 'services':
      return (
        <section id={sectionId} className={`py-12 mb-8 rounded-lg scroll-mt-16 ${hasBgMedia ? 'relative overflow-hidden' : ''}`} style={sectionBgStyle}>
          {BgVideo}
          {BgOverlay}
          <h2 className="text-3xl font-bold text-center" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
            {getDataValue('title')}
          </h2>
          {(getDataValue('subtitle') || getDataValue('content')) ? (
            <p className="text-center mt-2 mb-8 opacity-90" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
              {getDataValue('subtitle') || getDataValue('content')}
            </p>
          ) : (
            <div className="mb-8" />
          )}
          <div className="grid md:grid-cols-3 gap-6">
            {((data.services as Array<{ icon?: string; iconSrc?: string; title: string; description: string }>) || []).map(
              (service, i: number) => (
                <div key={i} className="p-6 rounded-lg text-center" style={{ backgroundColor: `${theme.colors.primary}10` }}>
                  {service.iconSrc ? (
                    <div className="flex justify-center mb-4" style={{ color: sectionStyles.headingColor }}>
                      <PictoIcon src={service.iconSrc} alt={service.title} width={48} height={48} className="w-12 h-12 object-contain" />
                    </div>
                  ) : service.icon ? (
                    <div className="text-4xl mb-4">{service.icon}</div>
                  ) : null}
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
                    {service.title}
                  </h3>
                  <p style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>{service.description}</p>
                </div>
              )
            )}
          </div>
        </section>
      )

    case 'gallery':
      return (
        <section id={sectionId} className={`py-12 mb-8 rounded-lg scroll-mt-16 ${hasBgMedia ? 'relative overflow-hidden' : ''}`} style={sectionBgStyle}>
          {BgVideo}
          {BgOverlay}
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
            {getDataValue('title')}
          </h2>
          {((data.images as Array<{ url: string; alt: string }>) || []).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {((data.images as Array<{ url: string; alt: string }>) || []).map((img, i: number) => (
                <img key={i} src={img.url} alt={img.alt} className="w-full h-48 object-cover rounded-lg" />
              ))}
            </div>
          ) : (
            <p className="text-center" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
              Aucune image
            </p>
          )}
        </section>
      )

    case 'testimonials':
      return (
        <section id={sectionId} className={`py-12 mb-8 rounded-lg scroll-mt-16 ${hasBgMedia ? 'relative overflow-hidden' : ''}`} style={sectionBgStyle}>
          {BgVideo}
          {BgOverlay}
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
            {getDataValue('title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {((data.testimonials as Array<{ name: string; role: string; content: string }>) || []).map((t, i: number) => (
              <div key={i} className="p-6 rounded-lg" style={{ backgroundColor: `${theme.colors.primary}05` }}>
                <p className="italic mb-4" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                  &quot;{t.content}&quot;
                </p>
                <div>
                  <span className="font-semibold" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
                    {t.name}
                  </span>
                  {t.role && (
                    <span className="ml-2" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                      — {t.role}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )

    case 'contact':
      return (
        <section id={sectionId} className={`py-12 mb-8 rounded-lg scroll-mt-16 ${hasBgMedia ? 'relative overflow-hidden' : ''}`} style={sectionBgStyle}>
          {BgVideo}
          {BgOverlay}
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: sectionStyles.headingFont, color: sectionStyles.headingColor }}>
            {getDataValue('title')}
          </h2>
          <div className="max-w-md mx-auto text-center">
            {getDataValue('email') && (
              <p style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                Email :{' '}
                <a href={`mailto:${getDataValue('email')}`} style={{ color: theme.colors.primary }} className="hover:underline">
                  {getDataValue('email')}
                </a>
              </p>
            )}
            {getDataValue('phone') && (
              <p className="mt-2" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                Téléphone : {getDataValue('phone')}
              </p>
            )}
            {getDataValue('address') && (
              <p className="mt-2" style={{ fontFamily: sectionStyles.bodyFont, color: sectionStyles.textColor }}>
                Adresse : {getDataValue('address')}
              </p>
            )}
          </div>
        </section>
      )

    case 'footer': {
      const socialIcons = (() => {
        try {
          return (data.socialIcons as Array<{ platform: string; url: string }>) || []
        } catch {
          return []
        }
      })()
      return (
        <footer id={sectionId} className="py-12 mt-8 rounded-lg scroll-mt-16" style={{ backgroundColor: branding.footerBg }}>
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact + réseaux sociaux */}
            <div>
              <h3 className="text-lg font-bold mb-2" style={{ color: branding.footerText }}>
                {getDataValue('contactTitle') || 'Contact'}
              </h3>
              {getDataValue('contactDesc') && (
                <p className="text-sm mb-4 opacity-90" style={{ color: branding.footerText }}>
                  {getDataValue('contactDesc')}
                </p>
              )}
              {socialIcons.length > 0 && (
                <div className="flex gap-3">
                  {socialIcons.map((icon, i) => (
                    <a
                      key={i}
                      href={icon.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: branding.footerText }}
                      title={icon.platform}
                    >
                      <SocialIconLogo platform={icon.platform} color={branding.footerText} size={20} />
                    </a>
                  ))}
                </div>
              )}
            </div>
            {/* Email / Téléphone */}
            <div>
              <h3 className="text-lg font-bold mb-2" style={{ color: branding.footerText }}>
                EMAIL
              </h3>
              <p className="text-sm space-y-1" style={{ color: branding.footerText }}>
                {getDataValue('phone') && <span className="block">{getDataValue('phone')}</span>}
                {getDataValue('email') && (
                  <a href={`mailto:${getDataValue('email')}`} className="hover:underline opacity-90">
                    {getDataValue('email')}
                  </a>
                )}
              </p>
            </div>
          </div>
          <p className="text-center text-sm" style={{ color: branding.footerText }}>
            {getDataValue('copyright')}
          </p>
        </footer>
      )
    }

    default:
      return null
  }
}
