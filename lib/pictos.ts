/**
 * Source unique des pictos pour tout le site (sidebar, sections, éléments, services, landing).
 * Référentiel : OVHcloud Design System - Iconography
 * https://zeroheight.com/6fc8a63f7/p/49e861-iconography
 * Les pictos sont en SVG dans public/pictos/ (alignés sur ce design system).
 */
const PICTOS_BASE = '/pictos'
const ext = '.svg'

export const PICTOS = {
  trophy: `${PICTOS_BASE}/trophy${ext}`,
  speed: `${PICTOS_BASE}/speed${ext}`,
  star: `${PICTOS_BASE}/star${ext}`,
  camera: `${PICTOS_BASE}/camera${ext}`,
  book: `${PICTOS_BASE}/book${ext}`,
  brush: `${PICTOS_BASE}/brush${ext}`,
  settings: `${PICTOS_BASE}/settings${ext}`,
  contacts: `${PICTOS_BASE}/contacts${ext}`,
  cursors: `${PICTOS_BASE}/cursors${ext}`,
  house: `${PICTOS_BASE}/house${ext}`,
  cart: `${PICTOS_BASE}/cart${ext}`,
  mobile: `${PICTOS_BASE}/mobile${ext}`,
  'page-query': `${PICTOS_BASE}/page-query${ext}`,
  'page-script': `${PICTOS_BASE}/page-script${ext}`,
  'page-info': `${PICTOS_BASE}/page-info${ext}`,
  play: `${PICTOS_BASE}/play${ext}`,
  microphone: `${PICTOS_BASE}/microphone${ext}`,
  check: `${PICTOS_BASE}/check${ext}`,
} as const

export type PictoId = keyof typeof PICTOS

export function getPictoUrl(id: PictoId): string {
  return PICTOS[id] ?? `${PICTOS_BASE}/settings${ext}`
}
