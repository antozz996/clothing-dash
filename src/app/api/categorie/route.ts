import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categorie = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    })
    return NextResponse.json(categorie)
  } catch (error) {
    return NextResponse.json({ error: 'Errore nel recupero categorie' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    if (!data.nome) {
      return NextResponse.json({ error: 'Nome categoria obbligatorio' }, { status: 400 })
    }
    const categoria = await prisma.categoria.create({
      data: {
        nome: data.nome,
        descrizione: data.descrizione,
      },
    })
    return NextResponse.json(categoria)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Categoria già esistente' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Errore nella creazione categoria' }, { status: 500 })
  }
}
