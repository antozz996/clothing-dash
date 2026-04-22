'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Calendar, User, FileText, CheckCircle2, XCircle, Printer } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatEuro } from '@/lib/calcoli'
import GrigliaTaglieEditor from './GrigliaTaglieEditor'

interface Cliente {
  id: string
  ragioneSociale: string
}

interface Prodotto {
  id: string
  sku: string
  descrizione: string
  prezzoUnitario: number
  taglie: string[]
  colori: string[]
  fotoUrl: string | null
}

interface GridState {
  [prodottoId: string]: {
    prodotto: Prodotto
    matrix: {
      [colore: string]: {
        [taglia: string]: number
      }
    }
  }
}

export default function OrdineForm({ params }: { params?: { id?: string } }) {
  const router = useRouter()
  const isEdit = !!params?.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  
  // Data State
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  
  // Form State
  const [clienteId, setClienteId] = useState('')
  const [note, setNote] = useState('')
  const [dataGrid, setDataGrid] = useState<GridState>({})
  const [stato, setStato] = useState('bozza')

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [resC, resP] = await Promise.all([
        fetch('/api/clienti'),
        fetch('/api/prodotti')
      ])
      const dataC = await resC.json()
      const dataP = await resP.json()
      
      if (Array.isArray(dataC)) setClienti(dataC)
      if (Array.isArray(dataP)) setProdotti(dataP)

      if (isEdit && params?.id && Array.isArray(dataP)) {
        const resO = await fetch(`/api/ordini/${params?.id}`)
        const dataO = await resO.json()
        setClienteId(dataO.clienteId)
        setNote(dataO.note || '')
        setStato(dataO.stato)
        
        // Ricostruisci GridState dalle righe flat piatte del DB
        const reconstructedGrid: GridState = {}
        if (dataO.righeGriglia && Array.isArray(dataO.righeGriglia)) {
          dataO.righeGriglia.forEach((riga: any) => {
            if (!reconstructedGrid[riga.prodottoId]) {
              // Trova prodotto originale per avere taglie/colori
              const p = dataP.find((x: any) => x.id === riga.prodottoId)
              if (p) {
                reconstructedGrid[riga.prodottoId] = {
                  prodotto: p,
                  matrix: p.colori.reduce((acc: any, col: string) => ({
                    ...acc,
                    [col]: p.taglie.reduce((tagAcc: any, tag: string) => ({ ...tagAcc, [tag]: 0 }), {})
                  }), {})
                }
              }
            }
            if (reconstructedGrid[riga.prodottoId]) {
              reconstructedGrid[riga.prodottoId].matrix[riga.colore][riga.taglia] = riga.quantita
            }
          })
        }
        setDataGrid(reconstructedGrid)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setFetching(false)
    }
  }

  // Calcolo totali real-time
  const totali = useMemo(() => {
    let totCapi = 0
    let imponibile = 0
    
    Object.entries(dataGrid).forEach(([pid, item]) => {
      Object.values(item.matrix).forEach(row => {
        Object.values(row).forEach(qty => {
          totCapi += qty
          imponibile += qty * item.prodotto.prezzoUnitario
        })
      })
    })

    const iva = Math.round(imponibile * 0.22 * 100) / 100
    const totaleIvato = imponibile + iva

    return { totCapi, imponibile, iva, totaleIvato }
  }, [dataGrid])

  const onSubmit = async (statusOverride?: string) => {
    if (!clienteId) return alert('Seleziona un cliente')
    
    // Converti GridState in righe piatte per l'API
    const flatRighe: any[] = []
    Object.entries(dataGrid).forEach(([pid, item]) => {
      Object.entries(item.matrix).forEach(([colore, taglieRow]) => {
        Object.entries(taglieRow).forEach(([taglia, quantita]) => {
          if (quantita > 0) {
            flatRighe.push({
              prodottoId: pid,
              sku: item.prodotto.sku,
              descrizione: item.prodotto.descrizione,
              prezzoUnitario: item.prodotto.prezzoUnitario,
              fotoUrl: item.prodotto.fotoUrl,
              colore,
              taglia,
              quantita
            })
          }
        })
      })
    })

    if (flatRighe.length === 0) return alert('Aggiungi almeno un capo con quantità > 0')

    setLoading(true)
    try {
      const url = isEdit ? `/api/ordini/${params.id}` : '/api/ordini'
      const method = isEdit ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId,
          note,
          stato: statusOverride || stato,
          righe: flatRighe
        }),
      })

      if (res.ok) {
        router.push('/ordini')
        router.refresh()
      } else {
        const err = await res.json()
        alert(err.error || 'Errore durante il salvataggio')
      }
    } catch (error) {
      console.error('Error saving order:', error)
    } finally {
      setLoading(false)
    }
  }

  const isReadOnly = isEdit && stato !== 'bozza'

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium">Inizializzazione ordine...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/ordini"
          className="p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-200 text-slate-400 hover:text-indigo-600 hover:ring-indigo-200 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEdit ? `Modifica Ordine` : 'Nuovo Ordine'}
          </h1>
          <p className="text-sm text-slate-500 font-inter">
            Compila testata e articoli per Dress & Company
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Testata Row */}
          <div className="card p-6 md:p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2 font-inter">
              <User className="w-4 h-4" />
              Testata Documento
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 font-inter">
                <label className="text-xs font-bold text-slate-500 ml-1">Cliente <span className="text-red-500">*</span></label>
                  <select
                    disabled={isReadOnly}
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 transition-all font-inter",
                      !isReadOnly && "focus:bg-white focus:border-indigo-500",
                      isReadOnly && "opacity-70 cursor-not-allowed"
                    )}
                  >
                  <option value="">Seleziona un cliente...</option>
                  {clienti.map(c => (
                    <option key={c.id} value={c.id}>{c.ragioneSociale}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 font-inter">
                <label className="text-xs font-bold text-slate-500 ml-1">Data Ordine</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 font-inter"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    disabled
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5 font-inter">
                <label className="text-xs font-bold text-slate-500 ml-1">Note / Annotazioni</label>
                <textarea
                  disabled={isReadOnly}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 transition-all resize-none text-sm font-inter",
                    !isReadOnly && "focus:bg-white focus:border-indigo-500",
                    isReadOnly && "opacity-70 cursor-not-allowed"
                  )}
                  placeholder="Note interne o per il PDF..."
                />
              </div>
            </div>
          </div>

          {/* Griglia Artisoli */}
          <GrigliaTaglieEditor
            data={dataGrid}
            onChange={setDataGrid}
            prodottiDisponibili={prodotti}
            readOnly={isReadOnly}
          />
        </div>

        {/* Action Sidebar / Sticky Summary */}
        <div className="space-y-6 sticky top-8">
          {/* Totals Card */}
          <div className="card p-6 bg-white shadow-xl ring-2 ring-indigo-500/20 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider font-inter">Riepilogo Ordine</h3>
            
            <div className="space-y-4 font-inter">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Totale Capi</span>
                <span className="font-bold text-slate-900">{totali.totCapi}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Imponibile</span>
                <span className="font-bold text-slate-900">{formatEuro(totali.imponibile)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">IVA (22%)</span>
                <span className="font-bold text-slate-900">{formatEuro(totali.iva)}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Totale Ivato</span>
                <span className="text-xl font-extrabold text-indigo-600">{formatEuro(totali.totaleIvato)}</span>
              </div>
            </div>

            {!isReadOnly ? (
              <div className="pt-2 space-y-3 font-inter">
                <button
                  type="button"
                  onClick={() => onSubmit('bozza')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border-2 border-slate-100 text-slate-600 hover:bg-slate-50 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salva come Bozza
                </button>
                
                <button
                  type="button"
                  onClick={() => onSubmit('confermato')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Conferma Ordine
                </button>
              </div>
            ) : (
              <div className="pt-2 space-y-3 font-inter">
                <a
                  href={`/api/ordini/${params?.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all bg-slate-900 text-white shadow-lg hover:bg-black active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  Scarica PDF Ordine
                </a>
                <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-tight">
                  L&apos;ordine non è più modificabile perché in stato <span className="font-bold text-indigo-500">{stato}</span>
                </p>
              </div>
            )}
          </div>

          <div className={cn(
            "p-4 border rounded-2xl flex items-center gap-3 font-inter",
            isReadOnly ? "bg-indigo-50 border-indigo-100" : "bg-amber-50 border-amber-100"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isReadOnly ? "bg-indigo-500" : "bg-amber-500 animate-pulse"
            )} />
            <span className={cn(
              "text-xs font-bold uppercase tracking-wide",
              isReadOnly ? "text-indigo-600" : "text-amber-600"
            )}>
              Stato: {stato.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
