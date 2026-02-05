import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSiteSchema } from '@/lib/validations'
import { validateBody } from '@/lib/api-helpers'

/**
 * Endpoint de diagnostic pour identifier les problèmes
 */
export async function GET() {
  const diagnostics: {
    timestamp: string
    status: string
    checks: Record<string, unknown>
    errors: string[]
  } = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    checks: {},
    errors: [],
  }

  // Vérifier la connexion à la base de données
  try {
    await prisma.$connect()
    const siteCount = await prisma.site.count()
    diagnostics.checks.database = {
      status: 'ok',
      message: 'Connexion réussie',
      siteCount,
      tablesExist: true,
    }
  } catch (error) {
    diagnostics.status = 'error'
    const errorMsg = error instanceof Error ? error.message : String(error)
    diagnostics.errors.push(`Database: ${errorMsg}`)
    diagnostics.checks.database = {
      status: 'error',
      message: errorMsg,
      error: String(error),
    }
  }

  // Vérifier les variables d'environnement
  diagnostics.checks.environment = {
    DATABASE_URL: process.env.DATABASE_URL ? 'défini' : 'manquant',
    NODE_ENV: process.env.NODE_ENV || 'non défini',
  }

  // Tester la validation Zod
  try {
    const testData = {
      name: 'Test',
      contactEmail: 'test@example.com',
      goal: 'vitrine',
      themeFamily: 'ovh-modern',
      sections: [],
      needs: [],
    }
    validateBody(testData, createSiteSchema)
    diagnostics.checks.validation = { status: 'ok', message: 'Validation Zod fonctionne' }
  } catch (error) {
    diagnostics.status = 'error'
    const errorMsg = error instanceof Error ? error.message : String(error)
    diagnostics.errors.push(`Validation: ${errorMsg}`)
    diagnostics.checks.validation = {
      status: 'error',
      message: errorMsg,
    }
  }

  // Vérifier les imports critiques
  try {
    const { apiHandler } = await import('@/lib/api-helpers')
    const { safeJsonParse } = await import('@/lib/utils')
    diagnostics.checks.imports = {
      status: 'ok',
      apiHandler: typeof apiHandler === 'function',
      safeJsonParse: typeof safeJsonParse === 'function',
    }
  } catch (error) {
    diagnostics.status = 'error'
    const errorMsg = error instanceof Error ? error.message : String(error)
    diagnostics.errors.push(`Imports: ${errorMsg}`)
    diagnostics.checks.imports = {
      status: 'error',
      message: errorMsg,
    }
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.status === 'error' ? 500 : 200,
  })
}
