'use client'

import { ComputedTheme } from '@/lib/types'
import { getThemePreset } from '@/lib/themes/presets'

interface HeaderProps {
  siteName: string
  menuPages: { id: string; title: string }[]
  currentPageId?: string | null
  themeFamily: string
  theme: ComputedTheme
  onPageClick?: (pageId: string) => void
}

export function Header({
  siteName,
  menuPages,
  currentPageId,
  themeFamily,
  theme,
  onPageClick,
}: HeaderProps) {
  const preset = getThemePreset(themeFamily)
  const headerStyle = preset?.headerStyle || {
    type: 'modern',
    showLogo: true,
    showNav: true,
    backgroundColor: theme.colors.primary,
    textColor: '#FFFFFF',
    layout: 'horizontal',
  }

  const bgColor = headerStyle.backgroundColor || theme.colors.primary
  const textColor = headerStyle.textColor || '#FFFFFF'

  return (
    <header
      className="w-full"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {headerStyle.layout === 'horizontal' && (
        <nav className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {headerStyle.showLogo && (
              <div
                className="font-bold text-lg"
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                }}
              >
                {siteName}
              </div>
            )}
          </div>

          {headerStyle.showNav && menuPages.length > 0 && (
            <div className="flex gap-6">
              {menuPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => onPageClick?.(page.id)}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{
                    opacity: currentPageId === page.id ? 1 : 0.7,
                    fontWeight: currentPageId === page.id ? 600 : 400,
                    color: textColor,
                  }}
                >
                  {page.title}
                </button>
              ))}
            </div>
          )}
        </nav>
      )}

      {headerStyle.layout === 'vertical' && (
        <nav className="px-6 py-4 flex flex-col gap-4">
          {headerStyle.showLogo && (
            <div
              className="font-bold text-lg"
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: '1.125rem',
                fontWeight: 700,
              }}
            >
              {siteName}
            </div>
          )}

          {headerStyle.showNav && menuPages.length > 0 && (
            <div className="flex flex-col gap-2">
              {menuPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => onPageClick?.(page.id)}
                  className="text-sm text-left transition-colors hover:opacity-80"
                  style={{
                    opacity: currentPageId === page.id ? 1 : 0.7,
                    fontWeight: currentPageId === page.id ? 600 : 400,
                    color: textColor,
                  }}
                >
                  {page.title}
                </button>
              ))}
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
