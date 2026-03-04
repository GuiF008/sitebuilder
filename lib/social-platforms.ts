/** Plateformes réseaux sociaux - couleurs et métadonnées */
export const SOCIAL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'twitter', label: 'X (Twitter)', color: '#1DA1F2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000' },
  { id: 'tiktok', label: 'TikTok', color: '#000000' },
  { id: 'pinterest', label: 'Pinterest', color: '#BD081C' },
  { id: 'github', label: 'GitHub', color: '#181717' },
] as const

export const PLATFORM_COLORS: Record<string, string> = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.id, p.color])
)
