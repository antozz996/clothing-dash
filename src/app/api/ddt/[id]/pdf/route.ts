import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import PdfDDT from '@/components/pdf/PdfDDT'
import React from 'react'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ddt = await prisma.ddt.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        ordine: {
          include: { righeGriglia: true }
        },
        righeDdt: true
      }
    })

    if (!ddt) return NextResponse.json({ error: 'DDT non trovato' }, { status: 404 })

    const stream = await renderToStream(React.createElement(PdfDDT, { ddt }))
    const chunks = []
    for await (const chunk of stream) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="DDT_${ddt.numeroDocumento.replace('/', '_')}.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Errore PDF' }, { status: 500 })
  }
}
