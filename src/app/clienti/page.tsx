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
            Gestisci i clienti e i loro dati di spedizione per Horus Srl
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

      {/* Table Section - Desktop View */}
      <div className="hidden md:block card overflow-hidden bg-white shadow-md ring-1 ring-slate-200 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase font-semibold border-b border-slate-200">
              <tr>
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modifica</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-100"
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

      {/* Mobile Card-Based List */}
      <div className="block md:hidden space-y-4 pb-12">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="card p-5 bg-white shadow-sm ring-1 ring-slate-200 rounded-2xl animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
            </div>
          ))
        ) : clienti.length > 0 ? (
          clienti.map((cliente) => (
            <div key={cliente.id} className="card p-5 bg-white shadow-md ring-1 ring-slate-200 rounded-2xl space-y-4 font-inter">
              {/* Header with name and P.IVA */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Ragione Sociale</span>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-black text-slate-900 leading-tight">{cliente.ragioneSociale}</h3>
                  <code className="shrink-0 text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-mono text-slate-600 font-bold">
                    {cliente.piva || 'N/D'}
                  </code>
                </div>
              </div>

              {/* Location Block */}
              {(cliente.indirizzo || cliente.citta) && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sede e Spedizione</span>
                  <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      {cliente.indirizzo && <p className="font-bold text-slate-700">{cliente.indirizzo}</p>}
                      <p className="text-slate-500 mt-0.5">
                        {cliente.cap} {cliente.citta} {cliente.provincia && `(${cliente.provincia})`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Contacts */}
              {(cliente.telefono || cliente.email) && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contatto Rapido</span>
                  <div className="grid grid-cols-2 gap-2">
                    {cliente.telefono ? (
                      <a
                        href={`tel:${cliente.telefono}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 active:bg-slate-100 active:scale-95 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Chiama</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Non Disp.</span>
                      </div>
                    )}
                    {cliente.email ? (
                      <a
                        href={`mailto:${cliente.email}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 active:bg-slate-100 active:scale-95 transition-all"
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Invia Email</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Non Disp.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link
                  href={`/clienti/${cliente.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 active:bg-slate-100 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Modifica</span>
                </Link>
                <button
                  onClick={() => handleDelete(cliente.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-100 active:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Elimina</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-xs text-slate-400 font-medium">Nessun cliente trovato.</p>
          </div>
        )}
      </div>
    </div>
  )
}
