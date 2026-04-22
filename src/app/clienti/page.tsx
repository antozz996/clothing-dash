'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Search, MapPin, Mail, Phone, MoreVertical, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Cliente {
  id: string
  ragioneSociale: string
  indirizzo: string | null
  cap: string | null
  citta: string | null
  provincia: string | null
  piva: string | null
  telefono: string | null
  email: string | null
  attivo: boolean
}

export default function ClientiPage() {
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClienti()
  }, [search])

  const fetchClienti = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/clienti?search=${encodeURIComponent(search)}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setClienti(data)
      }
    } catch (error) {
      console.error('Error fetching clienti:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo cliente?')) return

    try {
      const res = await fetch(`/api/clienti/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchClienti()
      }
    } catch (error) {
      console.error('Error deleting cliente:', error)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Anagrafica Clienti
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestisci i clienti e i loro dati di spedizione per Dress & Company
          </p>
        </div>
        <Link
          href="/clienti/nuovo"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nuovo Cliente
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card p-2 flex items-center bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-2 px-3 py-2 w-full">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per ragione sociale o Partita IVA..."
            className="w-full text-sm bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="card overflow-hidden bg-white shadow-md ring-1 ring-slate-200 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 font-semibold text-slate-700">Ragione Sociale</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Contatti</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Località</th>
                <th className="py-4 px-6 font-semibold text-slate-700">P.IVA / CF</th>
                <th className="py-4 px-6 text-right font-semibold text-slate-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeletons
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-5 px-6"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
                    <td className="py-5 px-6"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
                    <td className="py-5 px-6"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="py-5 px-6"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="py-5 px-6"><div className="h-4 w-8 float-right bg-slate-100 rounded" /></td>
                  </tr>
                ))
              ) : clienti.length > 0 ? (
                clienti.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="font-bold text-slate-900">{cliente.ragioneSociale}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        {cliente.email && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <Mail className="w-3.5 h-3.5" />
                            {cliente.email}
                          </div>
                        )}
                        {cliente.telefono && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <Phone className="w-3.5 h-3.5" />
                            {cliente.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-slate-600">
                      <div className="flex items-start gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400" />
                        <div>
                          {cliente.indirizzo && <div>{cliente.indirizzo}</div>}
                          <div>{cliente.cap} {cliente.citta} {cliente.provincia && `(${cliente.provincia})`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <code className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-700">
                        {cliente.piva || 'N/D'}
                      </code>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/clienti/${cliente.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {search ? 'Nessun risultato trovato' : 'Non ci sono clienti'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {search ? `La ricerca "${search}" non ha prodotto risultati.` : 'Inizia aggiungendo il tuo primo cliente.'}
                        </p>
                      </div>
                      {!search && (
                        <Link
                          href="/clienti/nuovo"
                          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Aggiungi Cliente
                        </Link>
                      )}
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
