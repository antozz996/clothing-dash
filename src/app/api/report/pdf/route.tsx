import { renderToStream } from '@react-pdf/renderer'
import { prisma } from '@/lib/prisma'
import PdfReport from '@/components/pdf/PdfReport'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fromDate = searchParams.get('from')
  const toDate = searchParams.get('to')
  const clienteId = searchParams.get('clienteId')
  const sku = searchParams.get('sku')
  const colore = searchParams.get('colore')
  const taglia = searchParams.get('taglia')

  try {
    const where: any = {
      ordine: {
        stato: { not: 'annullato' }
      }
    }

    if (fromDate || toDate) {
      where.ordine.dataOrdine = {}
      if (fromDate) where.ordine.dataOrdine.gte = new Date(fromDate)
      if (toDate) where.ordine.dataOrdine.lte = new Date(toDate)
    }

    let clienteNome = ''
    if (clienteId) {
      where.ordine.clienteId = clienteId
      const c = await prisma.cliente.findUnique({ where: { id: clienteId }})
      if (c) clienteNome = c.ragioneSociale
    }

    if (sku) where.sku = { contains: sku, mode: 'insensitive' }
    if (colore) where.colore = colore
    if (taglia) where.taglia = taglia

    const righe = await prisma.rigaGriglia.findMany({
      where,
      include: {
        prodotto: true,
        ordine: {
          include: {
            cliente: true
          }
        }
      },
      orderBy: { ordine: { dataOrdine: 'desc' }}
    })

    // Raggruppamento per Prodotto + Colore (esattamente come negli Ordini)
    const groupedProducts: Record<string, any> = {}

    righe.forEach(r => {
      const key = `${r.prodottoId || r.sku}-${r.colore}`
      if (!groupedProducts[key]) {
        groupedProducts[key] = {
          sku: r.sku,
          descrizione: r.prodotto?.descrizione || r.descrizione || '',
          prezzoUnitario: r.prezzoUnitario,
          fotoUrl: r.prodotto?.fotoUrl || r.fotoUrl || null,
          colore: r.colore,
          taglie: {} as Record<string, number>,
          totale: 0,
          valore: 0
        }
      }
      groupedProducts[key].taglie[r.taglia] = (groupedProducts[key].taglie[r.taglia] || 0) + r.quantita
      groupedProducts[key].totale += r.quantita
      groupedProducts[key].valore += r.quantita * r.prezzoUnitario
    })

    const sortedProducts = Object.values(groupedProducts).sort((a: any, b: any) => {
      const skuCompare = (a.sku || '').localeCompare(b.sku || '', undefined, { numeric: true, sensitivity: 'base' })
      if (skuCompare !== 0) return skuCompare
      return (a.colore || '').localeCompare(b.colore || '', undefined, { numeric: true, sensitivity: 'base' })
    })

    const reportData = {
      totali: {
        capi: righe.reduce((s, r) => s + r.quantita, 0),
        valore: righe.reduce((s, r) => s + (r.quantita * r.prezzoUnitario), 0)
      },
      prodotti: sortedProducts
    }

    const filtersRecap = {
      from: fromDate,
      to: toDate,
      cliente: clienteNome,
      sku,
      colore,
      taglia
    }

    const stream = await renderToStream(<PdfReport data={reportData} filters={filtersRecap} />)
    
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=Report_Vendite.pdf`,
      },
    })
  } catch (error) {
    console.error('PDF Report API Error:', error)
    return NextResponse.json({ error: 'Errore generazione PDF report' }, { status: 500 })
  }
}
