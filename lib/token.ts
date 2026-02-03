import crypto from 'crypto'

/**
 * Génère un token unique de 64 caractères
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash un token avec SHA-256
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Vérifie si un token correspond à un hash
 */
export function verifyToken(token: string, hash: string): boolean {
  return hashToken(token) === hash
}

/**
 * Génère un slug à partir d'un nom
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '')          // Supprime les tirets en début/fin
    .slice(0, 50)                     // Limite la longueur

  // Ajoute un suffixe unique
  const suffix = crypto.randomBytes(4).toString('hex')
  return `${base}-${suffix}`
}
