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

      <div className="card overflow-hidden bg-white shadow-md ring-1 ring-slate-200 rounded-2xl">
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
    </div>
  )
}
