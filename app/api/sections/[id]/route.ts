import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiHandler, ApiError, validateBody } from '@/lib/api-helpers'
import { updateSectionSchema } from '@/lib/validations'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiHandler(async () => {
    const { id } = await params
    const body = await request.json()
    const validatedData = validateBody(body, updateSectionSchema)

    // Valider que le JSON est valide si dataJson est fourni
    if (validatedData.dataJson) {
      try {
        JSON.parse(validatedData.dataJson)
      } catch {
        throw new ApiError(400, 'dataJson contient du JSON invalide')
      }
    }

    const section = await prisma.section.update({
      where: { id },
      data: validatedData,
    })

    return { section }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiHandler(async () => {
    const { id } = await params

    await prisma.section.delete({
      where: { id },
    })

    return { success: true }
  })
}
