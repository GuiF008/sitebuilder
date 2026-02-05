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
