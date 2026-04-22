import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcolaTotaliOrdine } from '@/lib/calcoli'

/**
 * GET /api/ordini/[id]
 * Dettaglio ordine con righe.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ordine = await prisma.ordine.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        righeGriglia: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!ordine) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    return NextResponse.json(ordine)
  } catch (error) {
    return NextResponse.json({ error: 'Errore nel recupero ordine' }, { status: 500 })
  }
}

/**
 * PATCH /api/ordini/[id]
 * Modifica ordine e righe (solo se in bozza).
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Verifica stato
    const ordineEsistente = await prisma.ordine.findUnique({
      where: { id: params.id }
    })
    
    if (!ordineEsistente) return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    if (ordineEsistente.stato !== 'bozza') {
      return NextResponse.json({ error: 'Solo gli ordini in bozza possono essere modificati' }, { status: 400 })
    }

    // Calcolo nuovi totali
    const totali = calcolaTotaliOrdine(data.righe)

    // Aggiornamento atomico: elimina vecchie righe e metti le nuove
    const ordineAggiornato = await prisma.$transaction(async (tx) => {
      // Elimina righe precedenti
      await tx.rigaGriglia.deleteMany({
        where: { ordineId: params.id }
      })

      // Aggiorna testata e crea nuove righe
      return await tx.ordine.update({
        where: { id: params.id },
        data: {
          note: data.note,
          imponibile: totali.imponibile,
          iva: totali.iva,
          totaleIvato: totali.totaleIvato,
          totaleCapi: totali.totaleCapi,
          righeGriglia: {
            create: data.righe.map((r: any) => ({
              prodottoId: r.prodottoId,
              sku: r.sku,
              descrizione: r.descrizione,
              prezzoUnitario: r.prezzoUnitario,
              fotoUrl: r.fotoUrl,
              colore: r.colore,
              taglia: r.taglia,
              quantita: r.quantita,
              importoRiga: r.quantita * r.prezzoUnitario,
              sortOrder: r.sortOrder || 0,
            }))
          }
        },
        include: { righeGriglia: true }
      })
    })

    return NextResponse.json(ordineAggiornato)
  } catch (error) {
    console.error('Error updating ordine:', error)
    return NextResponse.json({ error: 'Errore nell\'aggiornamento ordine' }, { status: 500 })
  }
}

/**
 * DELETE /api/ordini/[id]
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ordine = await prisma.ordine.findUnique({ where: { id: params.id } })
    if (ordine?.stato !== 'bozza') {
      return NextResponse.json({ error: 'Puoi eliminare solo ordini in bozza' }, { status: 400 })
    }

    await prisma.ordine.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore nell\'eliminazione' }, { status: 500 })
  }
}
