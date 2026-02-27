/**
 * Utilitaires partagés pour le projet
 */

/**
 * Parse JSON de manière sécurisée avec gestion d'erreurs
 */
export function safeJsonParse<T = unknown>(
  json: string,
  fallback: T | null = null
): T | null {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.error('Erreur lors du parsing JSON:', error)
    return fallback
  }
}

/**
 * Parse JSON avec validation et fallback
 */
export function safeJsonParseWithDefault<T>(
  json: string,
  defaultValue: T
): T {
  try {
    const parsed = JSON.parse(json)
    return parsed as T
  } catch (error) {
    console.error('Erreur lors du parsing JSON, utilisation de la valeur par défaut:', error)
    return defaultValue
  }
}

/**
 * Génère un slug unique avec limite de sécurité
 */
export function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>,
  maxAttempts: number = 100
): Promise<string> {
  let slug = baseSlug
  let counter = 1
  let attempts = 0

  return new Promise(async (resolve, reject) => {
    while (attempts < maxAttempts) {
      attempts++
      const exists = await checkExists(slug)
      
      if (!exists) {
        resolve(slug)
        return
      }
      
      slug = `${baseSlug}-${counter++}`
    }
    
    reject(new Error(`Impossible de générer un slug unique après ${maxAttempts} tentatives`))
  })
}

/**
 * Valide une URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize un nom de fichier pour éviter les injections
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.\./g, '_')
    .slice(0, 255)
}

/**
 * Retourne une couleur de texte lisible (noir ou blanc) selon la luminosité du fond
 */
export function getReadableTextColor(hexBackground: string): string {
  const hex = hexBackground.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#111827' : '#FFFFFF'
}

/**
 * Assombrit une couleur hexadécimale (amount entre 0 et 1, ex. 0.2 = 20% plus sombre)
 */
export function darkenColor(hex: string, amount: number): string {
  const h = hex.replace(/^#/, '')
  let r = Math.max(0, parseInt(h.slice(0, 2), 16) * (1 - amount))
  let g = Math.max(0, parseInt(h.slice(2, 4), 16) * (1 - amount))
  let b = Math.max(0, parseInt(h.slice(4, 6), 16) * (1 - amount))
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
}
