import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/report/top-data
 */
export async function GET() {
  try {
    // Top 5 Clienti
    const topClientiRaw = await prisma.ordine.groupBy({
      by: ['clienteId'],
      where: { stato: { not: 'annullato' } },
      _sum: { totaleIvato: true },
      orderBy: { _sum: { totaleIvato: 'desc' } },
      take: 5
    })

    // Fetch names for these clients
    const topClienti = await Promise.all(topClientiRaw.map(async (item) => {
      const c = await prisma.cliente.findUnique({ where: { id: item.clienteId }, select: { ragioneSociale: true } })
      return { name: c?.ragioneSociale || 'Sconosciuto', value: item._sum.totaleIvato }
    }))

    // Ultimi 5 Ordini
    const ultimiOrdini = await prisma.ordine.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { cliente: { select: { ragioneSociale: true } } }
    })

    return NextResponse.json({ topClienti, ultimiOrdini })
  } catch (error) {
    return NextResponse.json({ error: 'Errore Report' }, { status: 500 })
  }
}
