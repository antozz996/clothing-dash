import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import PdfOrdine from '@/components/pdf/PdfOrdine'
import React from 'react'

/**
 * GET /api/ordini/[id]/pdf
 * Genera lo streaming del PDF dell'ordine.
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

    // Genera il PDF stream
    const stream = await renderToStream(
      React.createElement(PdfOrdine, { ordine })
    )

    // Converte lo stream in un array buffer per la risposta Next.js
    const chunks = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Ordine_${ordine.numeroDocumento.replace('/', '_')}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Errore nella generazione del PDF' }, { status: 500 })
  }
}
