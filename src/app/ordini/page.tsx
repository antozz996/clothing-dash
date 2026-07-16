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
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setSelectedIds([])
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

  const handleDeleteSingle = async (id: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo ordine? L'operazione eliminerà definitivamente l'ordine e tutte le sue righe dal database.")) {
      return
    }
    try {
      const res = await fetch(`/api/ordini/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSelectedIds(prev => prev.filter(item => item !== id))
        fetchOrdini()
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'Errore durante la cancellazione dell\'ordine')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Errore durante la cancellazione dell\'ordine')
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Sei sicuro di voler eliminare i ${selectedIds.length} ordini selezionati? L'operazione eliminerà definitivamente gli ordini e tutte le loro righe dal database.`)) {
      return
    }
    setDeleting(true)
    try {
      const res = await fetch('/api/ordini', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      })
      if (res.ok) {
        setSelectedIds([])
        fetchOrdini()
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'Errore durante la cancellazione degli ordini')
      }
    } catch (error) {
      console.error('Error deleting orders:', error)
      alert('Errore durante la cancellazione degli ordini')
    } finally {
      setDeleting(false)
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

      {/* Table - Desktop View */}
      <div className="hidden md:block card overflow-hidden bg-white shadow-md ring-1 ring-slate-200 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 w-10 text-center font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={ordini.length > 0 && selectedIds.length === ordini.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(ordini.map(o => o.id))
                      } else {
                        setSelectedIds([])
                      }
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                  />
                </th>
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
                    <td colSpan={8} className="py-6 px-6"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                  </tr>
                ))
              ) : ordini.length > 0 ? (
                ordini.map((ord) => (
                  <tr key={ord.id} className={cn("hover:bg-slate-50 transition-colors group", selectedIds.includes(ord.id) && "bg-indigo-50/40 hover:bg-indigo-50/60")}>
                    <td className="py-5 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(ord.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, ord.id])
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== ord.id))
                          }
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                    </td>
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/ordini/${ord.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Dettaglio</span>
                        </Link>
                        
                        <a
                          href={`/api/ordini/${ord.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Stampa</span>
                        </a>

                        {(ord.stato === 'confermato' || ord.stato === 'spedito') && (
                          <Link
                            href={`/ddt/nuovo?orderId=${ord.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Crea DDT</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteSingle(ord.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-all border border-red-200 cursor-pointer"
                          title="Elimina ordine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Elimina</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
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

      {/* Mobile Card-Based List */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card p-5 bg-white shadow-sm ring-1 ring-slate-200 rounded-2xl animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))
        ) : ordini.length > 0 ? (
          ordini.map((ord) => (
            <div key={ord.id} className={cn("card p-5 bg-white shadow-md ring-1 ring-slate-200 rounded-2xl space-y-4 font-inter transition-all", selectedIds.includes(ord.id) && "ring-indigo-500 bg-indigo-50/20")}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ord.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, ord.id])
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== ord.id))
                      }
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Documento</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{ord.numeroDocumento}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  getStatusStyle(ord.stato)
                )}>
                  {ord.stato}
                </span>
              </div>

              {/* Customer */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cliente</span>
                <p className="text-xs font-bold text-slate-700 line-clamp-1">{ord.cliente.ragioneSociale}</p>
              </div>

              {/* Date & Totals */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Data</span>
                  <span className="text-[10px] font-bold text-slate-700 mt-0.5 block">{formatData(ord.dataOrdine)}</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Capi</span>
                  <span className="text-[10px] font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 mt-0.5 inline-block">{ord.totaleCapi}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Tot. Ivato</span>
                  <span className="text-[10px] font-black text-indigo-600 mt-0.5 block">{formatEuro(ord.totaleIvato)}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <Link
                  href={`/ordini/${ord.id}`}
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 active:bg-slate-100 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Vedi</span>
                </Link>
                
                <a
                  href={`/api/ordini/${ord.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 active:bg-slate-100 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Stampa</span>
                </a>

                {(ord.stato === 'confermato' || ord.stato === 'spedito') && (
                  <Link
                    href={`/ddt/nuovo?orderId=${ord.id}`}
                    className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm transition-all"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>DDT</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteSingle(ord.id)}
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-200 active:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Elimina</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-xs text-slate-400 font-medium">Nessun ordine trovato.</p>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-fade-in max-w-[90vw] w-max font-inter">
          <span className="text-sm font-semibold">
            {selectedIds.length} {selectedIds.length === 1 ? 'ordine selezionato' : 'ordini selezionati'}
          </span>
          <div className="h-4 w-px bg-slate-800" />
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Deseleziona
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? 'Eliminazione...' : 'Elimina Selezionati'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
