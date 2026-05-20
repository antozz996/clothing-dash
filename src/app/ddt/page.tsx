'use client'

import { useState, useEffect } from 'react'
import { Truck, Plus, Search, FileText, Printer, Trash2, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { formatData } from '@/lib/calcoli'

interface Ddt {
  id: string
  numeroDocumento: string
  dataDdt: string
  cliente: { ragioneSociale: string }
  ordine?: { numeroDocumento: string }
}

export default function DdtPage() {
  const [lista, setLista] = useState<Ddt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDdt() }, [])

  const fetchDdt = async () => {
    try {
      const res = await fetch('/api/ddt')
      const data = await res.json()
      setLista(data)
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 animate-fade-in px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Documenti di Trasporto</h1>
          <p className="text-sm text-slate-500 mt-1 font-inter">Archivio storico spedizioni e DDT emessi</p>
        </div>
        <Link href="/ddt/nuovo" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 shadow-md font-inter">
          <Plus className="w-5 h-5" /> Nuovo DDT
        </Link>
      </div>

      {/* Table Section - Desktop View */}
      <div className="hidden md:block card overflow-hidden bg-white shadow-md ring-1 ring-slate-200 rounded-2xl">
        <table className="w-full text-sm text-left font-inter">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
               <th className="py-4 px-6 font-semibold">N° DDT</th>
               <th className="py-4 px-6 font-semibold">Data</th>
               <th className="py-4 px-6 font-semibold">Cliente</th>
               <th className="py-4 px-6 font-semibold">Rif. Ordine</th>
               <th className="py-4 px-6 text-right font-semibold">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lista.map(d => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="py-4 px-6 font-bold">{d.numeroDocumento}</td>
                <td className="py-4 px-6">{formatData(d.dataDdt)}</td>
                <td className="py-4 px-6">{d.cliente.ragioneSociale}</td>
                <td className="py-4 px-6 text-slate-400 font-bold text-xs">{d.ordine?.numeroDocumento || '-'}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <a href={`/api/ddt/${d.id}/pdf`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Printer className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {lista.length === 0 && !loading && (
              <tr><td colSpan={5} className="py-20 text-center text-slate-400">Nessun DDT emesso.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card-Based List */}
      <div className="block md:hidden space-y-4 pb-12">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="card p-5 bg-white shadow-sm ring-1 ring-slate-200 rounded-2xl animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))
        ) : lista.length > 0 ? (
          lista.map((d) => (
            <div key={d.id} className="card p-5 bg-white shadow-md ring-1 ring-slate-200 rounded-2xl space-y-4 font-inter">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Numero DDT</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{d.numeroDocumento}</p>
                </div>
                <a
                  href={`/api/ddt/${d.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 active:bg-blue-100 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Stampa</span>
                </a>
              </div>

              {/* Content Details */}
              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cliente</span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{d.cliente.ragioneSociale}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Data Spedizione</span>
                    <span className="text-[10px] font-bold text-slate-700 mt-0.5 block">{formatData(d.dataDdt)}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Rif. Ordine</span>
                    <span className="text-[10px] font-black text-slate-700 mt-0.5 block">
                      {d.ordine?.numeroDocumento ? (
                        <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9px]">
                          {d.ordine.numeroDocumento}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">-</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-xs text-slate-400 font-medium">Nessun DDT emesso.</p>
          </div>
        )}
      </div>
    </div>
  )
}
