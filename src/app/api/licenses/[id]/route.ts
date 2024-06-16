import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
const prisma = new PrismaClient()

// GET /api/licenses/[id]
export async function GET(
  request: NextRequest,
  context: {
    params: { id: string }
  }
) {
  try {
    const { id } = context.params
    const license = await prisma.licenses.findUnique({
      where: { id: Number(id) },
    })

    return new Response(JSON.stringify(license), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}

// PUT /api/licenses/[id]
export async function PUT(
  request: NextRequest,
  context: {
    params: { id: string }
  }
) {
  try {
    const { id } = context.params
    const body = await request.json()

    const license = await prisma.licenses.update({
      where: { id: Number(id) },
      data: body,
    })

    return new Response(JSON.stringify(license), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}

// DELETE /api/licenses/[id]
export async function DELETE(
  request: NextRequest,
  context: {
    params: { id: string }
  }
) {
  try {
    const { id } = context.params
    await prisma.licenses.delete({ where: { id: Number(id) } })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}
