import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Helper pour gérer les erreurs API de manière standardisée
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Wrapper pour les handlers API avec gestion d'erreurs standardisée
 */
export async function apiHandler<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler()
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.statusCode }
      )
    }

    if (error instanceof ZodError) {
      const zodError = error as ZodError
      return NextResponse.json(
        {
          error: 'Validation error',
          details: zodError.issues.map((e) => ({
            path: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    // Erreur Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: unknown }
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Une ressource avec cette valeur existe déjà' },
          { status: 409 }
        )
      }
      
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Ressource non trouvée' },
          { status: 404 }
        )
      }
    }

    // Logging détaillé pour le debugging
    console.error('=== API Error ===')
    console.error('Timestamp:', new Date().toISOString())
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    console.error('================')
    
    // En développement, inclure plus de détails
    const isDevelopment = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        error: 'Une erreur est survenue',
        ...(isDevelopment && {
          details: error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
            type: error.constructor.name,
          } : String(error),
          timestamp: new Date().toISOString(),
        }),
      },
      { status: 500 }
    )
  }
}

/**
 * Valide le body d'une requête avec un schéma Zod
 */
export function validateBody<T>(
  body: unknown,
  schema: { parse: (data: unknown) => T }
): T {
  return schema.parse(body)
}
