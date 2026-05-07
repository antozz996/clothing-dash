import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/prodotti/[id]
 * Ritorna il dettaglio di un prodotto.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prodotto = await prisma.prodotto.findUnique({
      where: { id: params.id },
      include: { categoria: true }
    })

    if (!prodotto) {
      return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 })
    }

    return NextResponse.json({
      ...prodotto,
      taglie: JSON.parse(prodotto.taglie),
      colori: JSON.parse(prodotto.colori),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Errore nel recupero prodotto' }, { status: 500 })
  }
}

/**
 * PATCH /api/prodotti/[id]
 * Aggiorna i dati di un prodotto.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const prodottoAggiornato = await prisma.prodotto.update({
      where: { id: params.id },
      data: {
        sku: data.sku,
        descrizione: data.descrizione,
        prezzoUnitario: data.prezzoUnitario ? Number(data.prezzoUnitario) : undefined,
        taglie: data.taglie ? JSON.stringify(data.taglie) : undefined,
        colori: data.colori ? JSON.stringify(data.colori) : undefined,
        fotoUrl: data.fotoUrl,
        attivo: data.attivo,
        categoriaId: data.categoriaId !== undefined ? (data.categoriaId || null) : undefined,
      },
    })

    return NextResponse.json({
      ...prodottoAggiornato,
      taglie: JSON.parse(prodottoAggiornato.taglie),
      colori: JSON.parse(prodottoAggiornato.colori),
    })
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: 'Lo SKU inserito è già esistente' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Errore nell\'aggiornamento prodotto' }, { status: 500 })
  }
}

/**
 * DELETE /api/prodotti/[id]
 * Soft delete del prodotto (attivo = false).
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.prodotto.update({
      where: { id: params.id },
      data: { attivo: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore nell\'eliminazione prodotto' }, { status: 500 })
  }
}
