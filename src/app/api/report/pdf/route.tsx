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
        ordine: {
          include: {
            cliente: true
          }
        }
      },
      orderBy: { ordine: { dataOrdine: 'desc' }}
    })

    const aggregazioneProdotto: Record<string, any> = {}
    const aggregazioneCliente: Record<string, any> = {}

    righe.forEach(r => {
      const pKey = `${r.sku}-${r.colore}-${r.taglia}`
      if (!aggregazioneProdotto[pKey]) {
        aggregazioneProdotto[pKey] = { sku: r.sku, colore: r.colore, taglia: r.taglia, quantita: 0, valore: 0 }
      }
      aggregazioneProdotto[pKey].quantita += r.quantita
      aggregazioneProdotto[pKey].valore += r.quantita * r.prezzoUnitario

      const cId = r.ordine.clienteId
      if (!aggregazioneCliente[cId]) {
        aggregazioneCliente[cId] = { ragioneSociale: r.ordine.cliente.ragioneSociale, quantita: 0, valore: 0 }
      }
      aggregazioneCliente[cId].quantita += r.quantita
      aggregazioneCliente[cId].valore += r.quantita * r.prezzoUnitario
    })

    const reportData = {
      totali: {
        capi: righe.reduce((s, r) => s + r.quantita, 0),
        valore: righe.reduce((s, r) => s + (r.quantita * r.prezzoUnitario), 0)
      },
      perProdotto: Object.values(aggregazioneProdotto),
      perCliente: Object.values(aggregazioneCliente)
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
