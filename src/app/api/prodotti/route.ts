import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/prodotti
 * Ritorna la lista dei prodotti attivi.
 * Supporta filtro ricerca per SKU o descrizione.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const prodotti = await prisma.prodotto.findMany({
      where: {
        attivo: true,
        OR: [
          { sku: { contains: search } },
          { descrizione: { contains: search } },
        ],
      },
      include: {
        categoria: true
      },
      orderBy: { sku: 'asc' },
    })

    // Parse JSON strings for taglie and colori
    const formattedProdotti = prodotti.map(p => ({
      ...p,
      taglie: JSON.parse(p.taglie),
      colori: JSON.parse(p.colori),
    }))

    return NextResponse.json(formattedProdotti)
  } catch (error) {
    console.error('Error fetching prodotti:', error)
    return NextResponse.json({ error: 'Errore nel recupero prodotti' }, { status: 500 })
  }
}

/**
 * POST /api/prodotti
 * Crea un nuovo prodotto.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.sku || !data.descrizione || !data.prezzoUnitario) {
      return NextResponse.json({ error: 'SKU, descrizione e prezzo obbligatori' }, { status: 400 })
    }

    const nuovoProdotto = await prisma.prodotto.create({
      data: {
        sku: data.sku,
        descrizione: data.descrizione,
        prezzoUnitario: Number(data.prezzoUnitario),
        taglie: JSON.stringify(data.taglie || []),
        colori: JSON.stringify(data.colori || []),
        fotoUrl: data.fotoUrl,
        categoriaId: data.categoriaId || null,
      },
    })

    return NextResponse.json({
      ...nuovoProdotto,
      taglie: JSON.parse(nuovoProdotto.taglie),
      colori: JSON.parse(nuovoProdotto.colori),
    })
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: 'Lo SKU inserito è già esistente' }, { status: 400 })
    }
    console.error('Error creating prodotto:', error)
    return NextResponse.json({ error: 'Errore nella creazione prodotto' }, { status: 500 })
  }
}
