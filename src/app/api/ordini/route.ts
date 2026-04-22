import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNextProgressivo } from '@/lib/contatori'
import { calcolaTotaliOrdine } from '@/lib/calcoli'

/**
 * GET /api/ordini
 * Lista ordini con filtri.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const stato = searchParams.get('stato')
    const clienteId = searchParams.get('clienteId')
    const search = searchParams.get('search')

    const where: any = {}
    if (stato) where.stato = stato
    if (clienteId) where.clienteId = clienteId
    if (search) where.numeroDocumento = { contains: search }

    const ordini = await prisma.ordine.findMany({
      where,
      include: {
        cliente: {
          select: { ragioneSociale: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(ordini)
  } catch (error) {
    console.error('Error fetching ordini:', error)
    return NextResponse.json({ error: 'Errore nel recupero ordini' }, { status: 500 })
  }
}

/**
 * POST /api/ordini
 * Crea un nuovo ordine con righe griglia.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.clienteId || !data.righe || data.righe.length === 0) {
      return NextResponse.json({ error: 'Cliente e almeno un articolo sono obbligatori' }, { status: 400 })
    }

    // 1. Ottieni progressivo atomico
    const { progressivo, numeroDocumento } = await getNextProgressivo('ORD')

    // 2. Calcola totali
    const totali = calcolaTotaliOrdine(data.righe)

    // 3. Crea ordine e righe in transazione
    const nuovoOrdine = await prisma.ordine.create({
      data: {
        progressivo,
        anno: new Date().getFullYear(),
        numeroDocumento,
        clienteId: data.clienteId,
        stato: data.stato || 'bozza',
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
      include: {
        righeGriglia: true,
        cliente: true,
      }
    })

    return NextResponse.json(nuovoOrdine)
  } catch (error) {
    console.error('Error creating ordine:', error)
    return NextResponse.json({ error: 'Errore nella creazione dell\'ordine' }, { status: 500 })
  }
}
