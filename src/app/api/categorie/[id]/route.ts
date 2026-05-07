import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if category is used
    const inUse = await prisma.prodotto.count({ where: { categoriaId: params.id } })
    if (inUse > 0) {
      return NextResponse.json({ error: 'Categoria in uso da uno o più prodotti' }, { status: 400 })
    }

    await prisma.categoria.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore eliminazione categoria' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const cat = await prisma.categoria.update({
      where: { id: params.id },
      data: { nome: data.nome, descrizione: data.descrizione },
    })
    return NextResponse.json(cat)
  } catch (error) {
    return NextResponse.json({ error: 'Errore aggiornamento categoria' }, { status: 500 })
  }
}
