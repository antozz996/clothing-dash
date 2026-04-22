import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNextProgressivo } from '@/lib/contatori'

/**
 * GET /api/ddt
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    const where: any = {}
    if (search) where.numeroDocumento = { contains: search }

    const ddt = await prisma.ddt.findMany({
      where,
      include: {
        cliente: { select: { ragioneSociale: true } },
        ordine: { select: { numeroDocumento: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(ddt)
  } catch (error) {
    return NextResponse.json({ error: 'Errore recupero DDT' }, { status: 500 })
  }
}

/**
 * POST /api/ddt
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.clienteId) {
      return NextResponse.json({ error: 'Cliente obbligatorio' }, { status: 400 })
    }

    const { progressivo, numeroDocumento } = await getNextProgressivo('DDT')

    const nuovoDdt = await prisma.ddt.create({
      data: {
        progressivo,
        anno: new Date().getFullYear(),
        numeroDocumento,
        ordineId: data.ordineId,
        clienteId: data.clienteId,
        dataDdt: data.dataDdt ? new Date(data.dataDdt) : new Date(),
        mittenteNome: data.mittenteNome,
        mittenteIndirizzo: data.mittenteIndirizzo,
        destNome: data.destNome,
        destIndirizzo: data.destIndirizzo,
        destCap: data.destCap,
        destCitta: data.destCitta,
        destProvincia: data.destProvincia,
        destDiversa: data.destDiversa || false,
        destDivNome: data.destDivNome,
        destDivIndirizzo: data.destDivIndirizzo,
        destDivCap: data.destDivCap,
        destDivCitta: data.destDivCitta,
        destDivProvincia: data.destDivProvincia,
        condizioniPagamento: data.condizioniPagamento,
        bancaAppoggio: data.bancaAppoggio,
        agente: data.agente,
        note: data.note,
        dataConsegnaPrevista: data.dataConsegnaPrevista ? new Date(data.dataConsegnaPrevista) : null,
        righeDdt: {
          create: data.righe?.map((r: any) => ({
            sku: r.sku,
            descrizione: r.descrizione,
            fotoUrl: r.fotoUrl,
            colore: r.colore,
            taglia: r.taglia,
            quantita: r.quantita,
            sortOrder: r.sortOrder || 0
          }))
        }
      },
      include: { righeDdt: true }
    })

    return NextResponse.json(nuovoDdt)
  } catch (error) {
    console.error('Error creating DDT:', error)
    return NextResponse.json({ error: 'Errore creazione DDT' }, { status: 500 })
  }
}
