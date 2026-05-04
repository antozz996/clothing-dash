'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Search, 
  Calendar, 
  Users, 
  Package, 
  Filter, 
  ArrowUpDown, 
  TrendingUp, 
  PieChart, 
  Download,
  Loader2
} from 'lucide-react'
import { formatEuro, formatData } from '@/lib/calcoli'
import { cn } from '@/lib/utils'

export default function ReportPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  
  // Filtri
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    clienteId: '',
    sku: '',
    colore: '',
    taglia: ''
  })

  // Dati per i filtri
  const [clienti, setClienti] = useState<any[]>([])
  
  useEffect(() => {
    fetch('/api/clienti').then(res => res.json()).then(setClienti)
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams(filters as any).toString()
      const res = await fetch(`/api/report?${q}`)
      const d = await res.json()
      setData(d)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }))
  }

  const resetFilters = () => {
    setFilters({
      from: '',
      to: '',
      clienteId: '',
      sku: '',
      colore: '',
      taglia: ''
    })
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analisi e Reportistica</h1>
          <p className="text-sm text-slate-500 font-medium">Monitora vendite, prodotti e performance clienti</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={fetchReport}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
             Applica Filtri
           </button>
           <a
             href={`/api/report/pdf?${new URLSearchParams(filters as any).toString()}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md active:scale-95"
           >
             <Download className="w-4 h-4" />
             Scarica Report PDF
           </a>
           <button 
             onClick={resetFilters}
             className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
           >
             Reset
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-6 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
           {/* Periodo */}
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Da Data</label>
             <input 
               type="date" 
               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
               value={filters.from}
               onChange={(e) => handleFilterChange('from', e.target.value)}
             />
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">A Data</label>
             <input 
               type="date" 
               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
               value={filters.to}
               onChange={(e) => handleFilterChange('to', e.target.value)}
             />
           </div>

           {/* Cliente */}
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cliente</label>
             <select 
               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
               value={filters.clienteId}
               onChange={(e) => handleFilterChange('clienteId', e.target.value)}
             >
               <option value="">Tutti i Clienti</option>
               {clienti.map(c => <option key={c.id} value={c.id}>{c.ragioneSociale}</option>)}
             </select>
           </div>

           {/* Prodotto SKU */}
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Articolo (SKU)</label>
             <input 
               type="text" 
               placeholder="Cerca SKU..."
               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
               value={filters.sku}
               onChange={(e) => handleFilterChange('sku', e.target.value)}
             />
           </div>

           {/* Colore */}
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Colore</label>
             <input 
               type="text" 
               placeholder="Es. Nero"
               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
               value={filters.colore}
               onChange={(e) => handleFilterChange('colore', e.target.value)}
             />
           </div>

           {/* Taglia */}
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Taglia</label>
             <input 
               type="text" 
               placeholder="Es. 42"
               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
               value={filters.taglia}
               onChange={(e) => handleFilterChange('taglia', e.target.value)}
             />
           </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="card p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <Package className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Totale Capi Sold</p>
               <h4 className="text-2xl font-black text-slate-900">{data?.totali?.capi || 0}</h4>
            </div>
         </div>

         <div className="card p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Fatturato Netto</p>
               <h4 className="text-2xl font-black text-slate-900">{formatEuro(data?.totali?.valore || 0)}</h4>
            </div>
         </div>

         <div className="card p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Clienti Unici</p>
               <h4 className="text-2xl font-black text-slate-900">{data?.perCliente?.length || 0}</h4>
            </div>
         </div>

         <div className="card p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
               <PieChart className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Varianti Articolo</p>
               <h4 className="text-2xl font-black text-slate-900">{data?.perProdotto?.length || 0}</h4>
            </div>
         </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Prodotti */}
         <div className="card bg-white shadow-xl ring-1 ring-slate-200 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                 <Package className="w-5 h-5 text-indigo-500" />
                 Analisi Prodotti (Taglia/Colore)
               </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                     <tr>
                        <th className="px-6 py-3">Articolo / Col / Tag</th>
                        <th className="px-6 py-3 text-right">Q.tà</th>
                        <th className="px-6 py-3 text-right">Valore</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {data?.perProdotto?.sort((a: any, b: any) => b.quantita - a.quantita).slice(0, 50).map((p: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{p.sku}</div>
                              <div className="text-[10px] text-slate-500 uppercase">{p.colore} — Taglia {p.taglia}</div>
                           </td>
                           <td className="px-6 py-4 text-right font-black text-indigo-600">{p.quantita}</td>
                           <td className="px-6 py-4 text-right text-slate-500 font-medium">{formatEuro(p.valore)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Analisi Clienti */}
         <div className="card bg-white shadow-xl ring-1 ring-slate-200 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                 <Users className="w-5 h-5 text-emerald-500" />
                 Performance Clienti
               </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                     <tr>
                        <th className="px-6 py-3">Cliente</th>
                        <th className="px-6 py-3 text-right">Pezzi</th>
                        <th className="px-6 py-3 text-right">Fatturato</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {data?.perCliente?.sort((a: any, b: any) => b.valore - a.valore).map((c: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-bold text-slate-900">{c.ragioneSociale}</td>
                           <td className="px-6 py-4 text-right font-black text-slate-700">{c.quantita}</td>
                           <td className="px-6 py-4 text-right font-black text-emerald-600">{formatEuro(c.valore)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Dettaglio Operazioni */}
      <div className="card bg-white shadow-xl ring-1 ring-slate-200 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
           <h3 className="font-bold flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-indigo-400" />
             Dettaglio Vendite nel Periodo
           </h3>
           <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{data?.dettaglioRighe?.length || 0} Operazioni</span>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                 <tr>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">Var.</th>
                    <th className="px-6 py-3 text-right">Q.tà</th>
                    <th className="px-6 py-3 text-right">Importo</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data?.dettaglioRighe?.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 text-slate-500 font-medium">{formatData(r.data)}</td>
                       <td className="px-6 py-4 font-bold text-slate-900">{r.cliente}</td>
                       <td className="px-6 py-4 font-bold text-indigo-600">{r.sku}</td>
                       <td className="px-6 py-4">
                          <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold uppercase">{r.colore}</span>
                          <span className="text-[10px] ml-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold">{r.taglia}</span>
                       </td>
                       <td className="px-6 py-4 text-right font-black">{r.quantita}</td>
                       <td className="px-6 py-4 text-right font-black text-slate-900">{formatEuro(r.valore)}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  )
}
