import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/clienti/[id]
 * Ritorna il dettaglio di un cliente.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
    })

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })
    }

    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: 'Errore nel recupero cliente' }, { status: 500 })
  }
}

/**
 * PATCH /api/clienti/[id]
 * Aggiorna i dati di un cliente.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const clienteAggiornato = await prisma.cliente.update({
      where: { id: params.id },
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
        attivo: data.attivo,
        pec: data.pec,
        codiceUnivoco: data.codiceUnivoco,
        indirizzoSpedizione: data.indirizzoSpedizione,
        cittaSpedizione: data.cittaSpedizione,
        capSpedizione: data.capSpedizione,
        provinciaSpedizione: data.provinciaSpedizione,
      },
    })

    return NextResponse.json(clienteAggiornato)
  } catch (error) {
    return NextResponse.json({ error: 'Errore nell\'aggiornamento cliente' }, { status: 500 })
  }
}

/**
 * DELETE /api/clienti/[id]
 * Soft delete del cliente (attivo = false).
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cliente.update({
      where: { id: params.id },
      data: { attivo: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore nell\'eliminazione cliente' }, { status: 500 })
  }
}
