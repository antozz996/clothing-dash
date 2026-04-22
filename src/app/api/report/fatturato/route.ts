import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/report/fatturato
 */
export async function GET() {
  try {
    const now = new Date()
    const currentYear = now.getFullYear()
    
    // Recupera tutti gli ordini dell'anno corrente
    const ordini = await prisma.ordine.findMany({
      where: {
        anno: currentYear,
        stato: { not: 'annullato' }
      },
      select: { dataOrdine: true, totaleIvato: true }
    })

    // Raggruppa per mese
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
    const chartData = months.map((m, i) => {
      const tot = ordini
        .filter(o => new Date(o.dataOrdine).getMonth() === i)
        .reduce((s, o) => s + o.totaleIvato, 0)
      return { name: m, value: tot }
    })

    return NextResponse.json(chartData)
  } catch (error) {
    return NextResponse.json({ error: 'Errore Report' }, { status: 500 })
  }
}
