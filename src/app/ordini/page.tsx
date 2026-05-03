'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Plus, Search, Calendar, User, ShoppingBag, ArrowRight, MoreHorizontal, FileText, Printer, Trash2, Truck } from 'lucide-react'
import Link from 'next/link'
import { formatEuro, formatData } from '@/lib/calcoli'
import { cn } from '@/lib/utils'

interface Ordine {
  id: string
  numeroDocumento: string
  dataOrdine: string
  stato: string
  imponibile: number
  totaleIvato: number
  totaleCapi: number
  cliente: {
    ragioneSociale: string
  }
}

export default function OrdiniPage() {
  const [ordini, setOrdini] = useState<Ordine[]>([])
  const [search, setSearch] = useState('')
  const [statoFilter, setStatoFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrdini()
  }, [search, statoFilter])

  const fetchOrdini = async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (search) qs.append('search', search)
      if (statoFilter) qs.append('stato', statoFilter)
      
      const res = await fetch(`/api/ordini?${qs.toString()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setOrdini(data)
      }
    } catch (error) {
      console.error('Error fetching ordini:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (stato: string) => {
    switch (stato) {
      case 'bozza': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'confermato': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'spedito': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'annullato': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in px-4 md:px-0 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ordini Clienti
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestione e monitoraggio ordini con sviluppo griglia taglie
          </p>
        </div>
        <Link
          href="/ordini/nuovo"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 font-inter"
        >
          <Plus className="w-5 h-5" />
          Nuovo Ordine
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="card flex-1 p-2 flex items-center bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2 px-3 py-2 w-full">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per numero documento (es. 34/2026)..."
              className="w-full text-sm bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-inter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-2 rounded-xl shadow-sm ring-1 ring-slate-200 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-inter">Stato</span>
            <select
              value={statoFilter}
              onChange={(e) => setStatoFilter(e.target.value)}
              className="text-sm font-semibold bg-transparent outline-none text-slate-700 font-inter"
            >
              <option value="">Tutti</option>
              <option value="bozza">Bozza</option>
              <option value="confermato">Confermato</option>
              <option value="spedito">Spedito</option>
              <option value="annullato">Annullato</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden bg-white shadow-md ring-1 ring-slate-200 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 font-semibold text-slate-700">Ref. Documento</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Data</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Cliente</th>
                <th className="py-4 px-6 text-center font-semibold text-slate-700">Capi</th>
                <th className="py-4 px-6 text-right font-semibold text-slate-700">Totale Ivato</th>
                <th className="py-4 px-6 text-center font-semibold text-slate-700">Stato</th>
                <th className="py-4 px-6 text-right font-semibold text-slate-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-6 px-6"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                  </tr>
                ))
              ) : ordini.length > 0 ? (
                ordini.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-6 font-bold text-slate-900">{ord.numeroDocumento}</td>
                    <td className="py-5 px-6 text-slate-500">{formatData(ord.dataOrdine)}</td>
                    <td className="py-5 px-6 font-semibold text-slate-700">{ord.cliente.ragioneSociale}</td>
                    <td className="py-5 px-6 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold text-xs">{ord.totaleCapi}</span>
                    </td>
                    <td className="py-5 px-6 text-right font-bold text-slate-900">{formatEuro(ord.totaleIvato)}</td>
                    <td className="py-5 px-6 text-center">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusStyle(ord.stato)
                      )}>
                        {ord.stato}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/ordini/${ord.id}`}
                          title="Vedi Dettaglio Ordine"
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        <a
                          href={`/api/ordini/${ord.id}/pdf`}
                          target="_blank"
                          title="Stampa Commissione d'Ordine"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Printer className="w-4 h-4" />
                        </a>
                        {(ord.stato === 'confermato' || ord.stato === 'spedito') && (
                          <Link
                            href={`/ddt/nuovo?orderId=${ord.id}`}
                            title="Genera DDT da Ordine"
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <Truck className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                        <ClipboardList className="w-8 h-8 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">Nessun ordine trovato</p>
                        <p className="text-sm text-slate-500">Inizia creando il tuo primo ordine gestendo la griglia taglie.</p>
                      </div>
                      <Link
                        href="/ordini/nuovo"
                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Nuovo Ordine
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
