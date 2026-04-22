'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Camera, ChevronRight, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
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

interface RigaGriglia {
  prodottoId: string
  sku: string
  descrizione: string
  prezzoUnitario: number
  fotoUrl: string | null
  colore: string
  taglia: string
  quantita: number
}

// Struttura per raggruppare le righe piatte in una griglia SKU -> Colore -> Taglia
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

  readOnly?: boolean
 }
 
 export default function GrigliaTaglieEditor({ data, onChange, prodottiDisponibili, readOnly }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)

  const filteredProdotti = useMemo(() => {
    if (!searchTerm) return []
    return prodottiDisponibili.filter(p => 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
  }, [searchTerm, prodottiDisponibili])

  const addProdotto = (p: Prodotto) => {
    if (data[p.id]) return // Già aggiunto
    
    const newState = { ...data }
    newState[p.id] = {
      prodotto: p,
      matrix: p.colori.reduce((acc, col) => ({
        ...acc,
        [col]: p.taglie.reduce((tagAcc, tag) => ({ ...tagAcc, [tag]: 0 }), {})
      }), {})
    }
    onChange(newState)
    setSearchTerm('')
    setShowResults(false)
  }

  const removeProdotto = (id: string) => {
    const newState = { ...data }
    delete newState[id]
    onChange(newState)
  }

  const updateQty = (prodottoId: string, colore: string, taglia: string, qty: number) => {
    const value = Math.max(0, qty)
    const newState = { ...data }
    newState[prodottoId].matrix[colore][taglia] = value
    onChange(newState)
  }

  const getTotaleProdotto = (prodottoId: string) => {
    let tot = 0
    Object.values(data[prodottoId].matrix).forEach(colorRow => {
      Object.values(colorRow).forEach(qty => tot += qty)
    })
    return tot
  }

  return (
    <div className="space-y-8 font-inter">
      {!readOnly && (
        <div className="relative group">
          <label className="text-xs font-bold text-slate-500 mb-2 block ml-1 uppercase tracking-wider">Aggiungi Articolo a Ordine</label>
          <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-500",
            showResults ? "rounded-b-none border-b-transparent ring-0" : ""
          )}>
            <SearchProductIcon className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Scrivi SKU o descrizione per aggiungere un articolo..."
              className="w-full text-sm outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => {
                 setSearchTerm(e.target.value)
                 setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
            />
          </div>
  
          {showResults && searchTerm && filteredProdotti.length > 0 && (
            <div className="absolute z-50 w-full bg-white border border-t-0 border-slate-200 rounded-b-2xl shadow-xl overflow-hidden animate-fade-in ring-1 ring-slate-200">
              {filteredProdotti.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addProdotto(p)}
                  className="flex items-center gap-4 w-full p-4 text-left hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-100 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.fotoUrl ? <img src={p.fotoUrl} alt="" className="w-full h-full object-cover" /> : <Camera className="w-5 h-5 text-slate-300" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-wider">{p.sku}</span>
                      <span className="text-sm font-bold text-slate-900">{formatEuro(p.prezzoUnitario)}</span>
                    </div>
                    <h4 className="text-sm font-medium text-slate-700 mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.descrizione}</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid of added products */}
      <div className="space-y-6">
        {Object.keys(data).length === 0 && (
          <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-sm text-slate-400 font-medium">Nessun articolo aggiunto. Usa la barra di ricerca sopra per iniziare.</p>
          </div>
        )}

        {Object.entries(data).map(([id, item]) => {
          const { prodotto, matrix } = item
          const totaleCapi = getTotaleProdotto(id)
          const totaleEuro = totaleCapi * prodotto.prezzoUnitario

          return (
            <div key={id} className="card bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl overflow-hidden animate-fade-in">
              {/* Item Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                    {prodotto.fotoUrl ? <img src={prodotto.fotoUrl} alt="" className="w-full h-full object-cover" /> : <Camera className="w-4 h-4 text-slate-300" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-900 tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded">{prodotto.sku}</span>
                       <span className="text-sm font-bold text-indigo-600">{formatEuro(prodotto.prezzoUnitario)}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{prodotto.descrizione}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tot. Articolo</p>
                    <p className="text-sm font-bold text-slate-900">{totaleCapi} Capi / {formatEuro(totaleEuro)}</p>
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => removeProdotto(id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid Body */}
              <div className="p-6 overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr>
                      <th className="py-2 px-1 text-left">
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Hash className="w-3 h-3" /> Colore \ Taglia
                         </div>
                      </th>
                      {prodotto.taglie.map(tag => (
                        <th key={tag} className="py-2 px-1 text-center min-w-[50px]">
                          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">{tag}</span>
                        </th>
                      ))}
                      <th className="py-2 px-1 text-right min-w-[60px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tot.</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prodotto.colori.map(col => {
                      let totCol = 0
                      Object.values(matrix[col]).forEach(q => totCol += q)
                      
                      return (
                        <tr key={col} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-1">
                            <span className="text-xs font-bold text-slate-700 uppercase group-hover:text-indigo-600 transition-colors">{col}</span>
                          </td>
                          {prodotto.taglie.map(tag => (
                            <td key={tag} className="py-2 px-1 text-center">
                              <input
                                type="number"
                                disabled={readOnly}
                                value={matrix[col][tag] || ''}
                                onChange={(e) => updateQty(id, col, tag, parseInt(e.target.value) || 0)}
                                className={cn(
                                  "w-12 h-10 text-center text-sm font-bold rounded-xl border transition-all outline-none",
                                  matrix[col][tag] > 0
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 focus:border-indigo-500",
                                  readOnly && "opacity-70 cursor-not-allowed bg-slate-50 border-slate-100"
                                )}
                              />
                            </td>
                          ))}
                          <td className="py-4 px-1 text-right">
                            <span className={cn(
                              "text-sm font-bold",
                              totCol > 0 ? "text-slate-900" : "text-slate-300"
                            )}>{totCol}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SearchProductIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )
}
