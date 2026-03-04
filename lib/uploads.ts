import { join } from 'path'

/**
 * Retourne le chemin racine du dossier d'uploads.
 * Utilisé par la route POST media et la route GET uploads.
 *
 * - Si UPLOADS_DIR est défini (ex: /app/uploads en Docker) => l'utiliser
 * - Sinon fallback: join(process.cwd(), 'uploads')
 */
export function getUploadsRoot(): string {
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR
  }
  return join(process.cwd(), 'uploads')
}
