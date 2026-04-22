import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/report/kpi
 */
export async function GET() {
  try {
    const now = new Date()
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // 1. Fatturato Mese (Ordini non annullati)
    const ordiniMese = await prisma.ordine.findMany({
      where: {
        dataOrdine: { gte: firstDayMonth },
        stato: { not: 'annullato' }
      },
      select: { totaleIvato: true, totaleCapi: true }
    })

    const fatturatoMese = ordiniMese.reduce((s, o) => s + o.totaleIvato, 0)
    const nCapiMese = ordiniMese.reduce((s, o) => s + o.totaleCapi, 0)
    const nOrdiniMese = ordiniMese.length

    // 2. Bozze Aperte
    const nBozze = await prisma.ordine.count({
      where: { stato: 'bozza' }
    })

    return NextResponse.json({
      fatturatoMese,
      nOrdiniMese,
      nCapiMese,
      nBozze
    })
  } catch (error) {
    return NextResponse.json({ error: 'Errore KPI' }, { status: 500 })
  }
}
