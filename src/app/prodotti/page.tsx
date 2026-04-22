'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Edit, Trash2, Camera } from 'lucide-react'
import Link from 'next/link'
import { formatEuro } from '@/lib/calcoli'

interface Prodotto {
  id: string
  sku: string
  descrizione: string
  prezzoUnitario: number
  taglie: string[]
  colori: string[]
  fotoUrl: string | null
}

export default function ProdottiPage() {
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProdotti()
  }, [search])

  const fetchProdotti = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/prodotti?search=${encodeURIComponent(search)}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setProdotti(data)
      }
    } catch (error) {
      console.error('Error fetching prodotti:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return

    try {
      const res = await fetch(`/api/prodotti/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchProdotti()
      }
    } catch (error) {
      console.error('Error deleting prodotto:', error)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Catalogo Prodotti
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestisci SKU, varianti di taglie/colori e listino prezzi
          </p>
        </div>
        <Link
          href="/prodotti/nuovo"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nuovo Prodotto
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card p-2 flex items-center bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-2 px-3 py-2 w-full">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per SKU o descrizione prodotto..."
            className="w-full text-sm bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-64 animate-pulse bg-slate-50" />
          ))}
        </div>
      ) : prodotti.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {prodotti.map((prodotto) => (
            <div key={prodotto.id} className="card group bg-white shadow-md ring-1 ring-slate-200 rounded-3xl overflow-hidden flex flex-col hover:shadow-xl transition-all hover:-translate-y-1">
              {/* Product Image Placeholder */}
              <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                {prodotto.fotoUrl ? (
                  <img src={prodotto.fotoUrl} alt={prodotto.sku} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Camera className="w-10 h-10" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Nessuna Foto</span>
                  </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <Link
                    href={`/prodotti/${prodotto.id}`}
                    className="p-3 rounded-full bg-white text-slate-900 hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-90"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(prodotto.id)}
                    className="p-3 rounded-full bg-white text-slate-900 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {prodotto.sku}
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {formatEuro(prodotto.prezzoUnitario)}
                  </div>
                </div>
                
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem] mb-4">
                  {prodotto.descrizione}
                </h3>

                <div className="mt-auto space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {prodotto.taglie.slice(0, 4).map(t => (
                      <span key={t} className="text-[9px] font-bold border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                        {t}
                      </span>
                    ))}
                    {prodotto.taglie.length > 4 && <span className="text-[9px] text-slate-400">+{prodotto.taglie.length - 4}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {prodotto.colori.slice(0, 3).map(c => (
                      <span key={c} className="text-[9px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase">
                        {c}
                      </span>
                    ))}
                    {prodotto.colori.length > 3 && <span className="text-[9px] text-slate-400">+{prodotto.colori.length - 3}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-20 text-center bg-white shadow-md ring-1 ring-slate-200 rounded-3xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">
                {search ? 'Nessun prodotto trovato' : 'Catalogo vuoto'}
              </p>
              <p className="text-sm text-slate-500">
                {search ? `La ricerca "${search}" non ha prodotto risultati.` : 'Inizia caricando il tuo primo SKU in anagrafica.'}
              </p>
            </div>
            {!search && (
              <Link
                href="/prodotti/nuovo"
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Crea Prodotto
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
