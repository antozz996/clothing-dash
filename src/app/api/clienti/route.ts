import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/clienti
 * Ritorna la lista dei clienti attivi.
 * Supporta filtro ricerca per ragione sociale o piva.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const clienti = await prisma.cliente.findMany({
      where: {
        attivo: true,
        OR: [
          { ragioneSociale: { contains: search } },
          { piva: { contains: search } },
        ],
      },
      orderBy: { ragioneSociale: 'asc' },
    })

    return NextResponse.json(clienti)
  } catch (error) {
    console.error('Error fetching clienti:', error)
    return NextResponse.json({ error: 'Errore nel recupero clienti' }, { status: 500 })
  }
}

/**
 * POST /api/clienti
 * Crea un nuovo cliente.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.ragioneSociale) {
      return NextResponse.json({ error: 'Ragione sociale obbligatoria' }, { status: 400 })
    }

    const nuovoCliente = await prisma.cliente.create({
      data: {
        ragioneSociale: data.ragioneSociale,
        indirizzo: data.indirizzo,
        cap: data.cap,
        citta: data.citta,
        provincia: data.provincia,
        piva: data.piva,
        cf: data.cf,
        email: data.email,
        telefono: data.telefono,
        note: data.note,
      },
    })

    return NextResponse.json(nuovoCliente)
  } catch (error) {
    console.error('Error creating cliente:', error)
    return NextResponse.json({ error: 'Errore nella creazione cliente' }, { status: 500 })
  }
}
