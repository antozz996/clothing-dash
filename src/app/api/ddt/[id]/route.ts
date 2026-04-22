import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ddt = await prisma.ddt.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        ordine: {
          include: { righeGriglia: true }
        },
        righeDdt: true
      }
    })

    if (!ddt) return NextResponse.json({ error: 'DDT non trovato' }, { status: 404 })

    return NextResponse.json(ddt)
  } catch (error) {
    return NextResponse.json({ error: 'Errore recupero DDT' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ddt.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore eliminazione DDT' }, { status: 500 })
  }
}
