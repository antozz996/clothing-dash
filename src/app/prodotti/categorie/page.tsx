'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Categoria {
  id: string
  nome: string
  descrizione?: string
}

export default function CategoriePage() {
  const [categorie, setCategorie] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [descrizione, setDescrizione] = useState('')

  useEffect(() => {
    fetchCategorie()
  }, [])

  const fetchCategorie = async () => {
    setLoading(true)
    const res = await fetch('/api/categorie')
    if (res.ok) {
      setCategorie(await res.json())
    }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return

    const res = await fetch('/api/categorie', {
      method: 'POST',
      body: JSON.stringify({ nome, descrizione }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      setNome('')
      setDescrizione('')
      fetchCategorie()
    } else {
      const data = await res.json()
      alert(data.error || 'Errore creazione categoria')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro? Se la categoria è in uso da un prodotto non potrà essere eliminata.')) return
    const res = await fetch(`/api/categorie/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchCategorie()
    } else {
      const data = await res.json()
      alert(data.error || 'Errore eliminazione')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in px-4 md:px-0">
      <div className="flex items-center gap-4">
        <Link href="/prodotti" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestione Categorie</h1>
          <p className="text-sm text-slate-500">Aggiungi o rimuovi le macro-categorie / stagionalità</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleAdd} className="card p-6 space-y-4">
            <h2 className="font-semibold text-slate-800">Nuova Categoria</h2>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Nome *</label>
              <input
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border focus:border-indigo-500"
                placeholder="es. PE26"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Descrizione</label>
              <input
                value={descrizione}
                onChange={e => setDescrizione(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border focus:border-indigo-500"
                placeholder="Opzionale"
              />
            </div>

            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Aggiungi
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Nome Categoria</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Descrizione</th>
                  <th className="px-6 py-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categorie.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold">{cat.nome}</td>
                    <td className="px-6 py-4 text-slate-500">{cat.descrizione || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {categorie.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Nessuna categoria creata.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
