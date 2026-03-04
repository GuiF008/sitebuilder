'use client'

import React from 'react'

/** Id reconnu à partir de src (ex: /pictos/trophy.svg → trophy) */
function pictoIdFromSrc(src: string): string {
  const m = src.match(/\/pictos\/([^/.]+)(\.(svg|png))?$/i)
  return m ? m[1] : ''
}

type PictoId =
  | 'trophy' | 'speed' | 'star' | 'camera' | 'book' | 'brush' | 'settings' | 'contacts'
  | 'cursors' | 'house' | 'cart' | 'mobile' | 'page-query' | 'page-script' | 'page-info'
  | 'play' | 'microphone' | 'check'

const INLINE_PICTOS: Record<PictoId, React.ReactNode> = {
  trophy: (
    <>
      <path d="M12 6h24v6h-6v4a12 12 0 0 1-12 12 12 12 0 0 1-12-12v-4H12V6z" />
      <path d="M8 6h4v6H8zM36 6h4v6h-4z" />
      <path d="M16 18h16M18 42v-8h12v8M15 42h18" />
      <circle cx="24" cy="16" r="4" />
    </>
  ),
  speed: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 14v10l6 6" />
      <path d="M24 12V8M24 40v-4M12 24H8M40 24h-4" />
      <path d="M17.66 17.66l-2.83-2.83M33.17 33.17l-2.83-2.83M17.66 30.34l-2.83 2.83M33.17 14.83l-2.83 2.83" />
    </>
  ),
  star: (
    <polygon points="24 4 29 18 44 18 32 28 37 42 24 34 11 42 16 28 4 18 19 18" />
  ),
  camera: (
    <>
      <rect x="4" y="14" width="40" height="28" rx="4" />
      <path d="M16 14V10h16v4" />
      <circle cx="24" cy="28" r="8" />
    </>
  ),
  book: (
    <>
      <path d="M8 6h24a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M32 10v28" />
    </>
  ),
  brush: (
    <>
      <path d="M12 36c-4 0-6-2-6-6V12h24v18c0 4-2 6-6 6" />
      <path d="M12 12h24" />
      <path d="M24 12v24" />
    </>
  ),
  settings: (
    <>
      <circle cx="24" cy="24" r="6" />
      <path d="M24 14v-2M24 36v-2M14 24h-2M36 24h-2" />
      <path d="M20 20l-1.5-1.5M29 29l1.5 1.5M29 19l1.5-1.5M20 28l-1.5 1.5" />
    </>
  ),
  contacts: (
    <>
      <circle cx="24" cy="14" r="6" />
      <path d="M8 38c0-8 7-12 16-12s16 4 16 12" />
    </>
  ),
  cursors: (
    <>
      <path d="M14 14l10 20 4-8 8-4-20-10z" />
      <path d="M24 24v8h8" />
    </>
  ),
  house: (
    <>
      <path d="M8 24L24 8l16 16v16H8V24z" />
      <path d="M18 38V24h12v14" />
    </>
  ),
  cart: (
    <>
      <path d="M8 12L10 18h28l4-14H12" />
      <circle cx="18" cy="34" r="3" />
      <circle cx="32" cy="34" r="3" />
      <path d="M21 34h8" />
    </>
  ),
  mobile: (
    <>
      <rect x="10" y="4" width="28" height="40" rx="4" />
      <path d="M24 38h.01" />
    </>
  ),
  'page-query': (
    <>
      <path d="M14 14h20v20H14z" />
      <path d="M20 24h8M20 28h6" />
    </>
  ),
  'page-script': (
    <>
      <path d="M12 8h24l4 12v20H8V8h4z" />
      <path d="M16 24h16M16 30h12" />
    </>
  ),
  'page-info': (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 22v12M24 18v2" />
    </>
  ),
  play: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M20 18l12 6-12 6V18z" />
    </>
  ),
  microphone: (
    <>
      <path d="M24 32c4 0 8-3 8-8V14c0-4-4-8-8-8s-8 4-8 8v10c0 5 4 8 8 8z" />
      <path d="M12 22v4a12 12 0 0 0 24 0v-4M24 38v6M16 44h16" />
    </>
  ),
  check: (
    <path d="M10 24l10 10 18-20" />
  ),
}

/**
 * Affiche un picto en SVG inline (pas de chargement de fichier).
 * Utilise currentColor pour suivre la couleur du texte (sidebar sélectionnée = bleu, etc.).
 * Référentiel : OVHcloud Design System - Iconography (zeroheight).
 */
export function PictoIcon({
  src,
  alt,
  width = 24,
  height = 24,
  className = '',
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) {
  const rawId = pictoIdFromSrc(src)
  const id = (rawId in INLINE_PICTOS ? rawId : 'settings') as PictoId
  const content = INLINE_PICTOS[id] ?? INLINE_PICTOS.settings

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={width}
      height={height}
      style={{ minWidth: width, minHeight: height, overflow: 'visible' }}
      className={`text-current shrink-0 ${className}`.trim()}
      role="img"
      aria-hidden={!alt}
      aria-label={alt || undefined}
    >
      {content}
    </svg>
  )
}
