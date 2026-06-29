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
  Loader2,
  Printer
} from 'lucide-react'
import { formatEuro, formatData } from '@/lib/calcoli'
import { cn } from '@/lib/utils'
import LabelPrintModal from '@/components/report/LabelPrintModal'

export default function ReportPage() {
  const [loading, setLoading] = useState(true)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [data, setData] = useState<any>(null)
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  
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
    <div className="space-y-6 md:space-y-8 animate-fade-in px-4 md:px-0 pb-20 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analisi e Reportistica</h1>
          <p className="text-sm text-slate-500 font-medium">Monitora vendite, prodotti e performance clienti</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <button 
             onClick={fetchReport}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
             Applica Filtri
           </button>
           <a
             href={`/api/report/pdf?${new URLSearchParams(filters as any).toString()}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md active:scale-95"
           >
             <Download className="w-4 h-4" />
             Scarica PDF
           </a>
           <button
             onClick={() => setIsPrintModalOpen(true)}
             disabled={!data?.perProdotto || data.perProdotto.length === 0}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
           >
             <Printer className="w-4 h-4" />
             Stampa Etichette
           </button>
           <button 
             onClick={resetFilters}
             className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
           >
             Reset
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 md:p-6 bg-white shadow-lg ring-1 ring-slate-200 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
        {/* Toggle per Mobile */}
        <div 
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="flex md:hidden items-center justify-between cursor-pointer border-b border-slate-100 pb-3"
        >
          <div className="flex items-center gap-2 text-slate-700">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold">Filtri di Ricerca</span>
            {Object.values(filters).some(v => v !== '') && (
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse inline-block" />
            )}
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            {showFiltersMobile ? 'Nascondi' : 'Mostra'}
          </span>
        </div>

        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4",
          showFiltersMobile ? "grid" : "hidden md:grid"
        )}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <div className="card p-4 md:p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-2xl md:rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
               <Package className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Totale Capi Sold</p>
               <h4 className="text-xl md:text-2xl font-black text-slate-900">{data?.totali?.capi || 0}</h4>
            </div>
         </div>

         <div className="card p-4 md:p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-2xl md:rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Fatturato Netto</p>
               <h4 className="text-xl md:text-2xl font-black text-slate-900">{formatEuro(data?.totali?.valore || 0)}</h4>
            </div>
         </div>

         <div className="card p-4 md:p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-2xl md:rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Clienti Unici</p>
               <h4 className="text-xl md:text-2xl font-black text-slate-900">{data?.perCliente?.length || 0}</h4>
            </div>
         </div>

         <div className="card p-4 md:p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-2xl md:rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
               <PieChart className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Varianti Articolo</p>
               <h4 className="text-xl md:text-2xl font-black text-slate-900">{data?.perProdotto?.length || 0}</h4>
            </div>
         </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Top Prodotti */}
          <div className="card bg-white shadow-xl ring-1 ring-slate-200 rounded-2xl md:rounded-3xl overflow-hidden">
             <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-500" />
                  Analisi Prodotti (Taglia/Colore)
                </h3>
             </div>
             
             {/* Mobile View Card List */}
             <div className="block md:hidden divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
                {data?.perProdotto?.length === 0 ? (
                   <div className="p-8 text-center text-xs text-slate-400 font-bold">Nessun dato disponibile</div>
                ) : (
                   data?.perProdotto?.sort((a: any, b: any) => b.quantita - a.quantita).slice(0, 50).map((p: any, i: number) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                         <div className="space-y-1">
                            <div className="font-extrabold text-slate-800 text-sm tracking-tight">{p.sku}</div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                               <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-600 uppercase border border-slate-200">
                                  {p.colore}
                               </span>
                               <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                  TG. {p.taglia}
                               </span>
                            </div>
                         </div>
                         <div className="text-right space-y-0.5 shrink-0">
                            <div className="text-sm font-black text-indigo-600">{p.quantita} <span className="text-[9px] font-bold text-slate-400">pz</span></div>
                            <div className="text-xs font-bold text-slate-500">{formatEuro(p.valore)}</div>
                         </div>
                      </div>
                   ))
                )}
             </div>

             {/* Desktop Table View */}
             <div className="hidden md:block overflow-x-auto">
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
          <div className="card bg-white shadow-xl ring-1 ring-slate-200 rounded-2xl md:rounded-3xl overflow-hidden">
             <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Performance Clienti
                </h3>
             </div>

             {/* Mobile View Card List */}
             <div className="block md:hidden divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
                {data?.perCliente?.length === 0 ? (
                   <div className="p-8 text-center text-xs text-slate-400 font-bold">Nessun dato disponibile</div>
                ) : (
                   data?.perCliente?.sort((a: any, b: any) => b.valore - a.valore).map((c: any, i: number) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center border border-emerald-100 uppercase shrink-0">
                               {c.ragioneSociale.substring(0, 2)}
                            </div>
                            <div className="space-y-0.5">
                               <div className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight">{c.ragioneSociale}</div>
                               <div className="text-[10px] font-semibold text-slate-400">Totale Capi: <span className="font-bold text-slate-600">{c.quantita}</span></div>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <div className="text-sm font-black text-emerald-600">{formatEuro(c.valore)}</div>
                         </div>
                      </div>
                   ))
                )}
             </div>

             {/* Desktop Table View */}
             <div className="hidden md:block overflow-x-auto">
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
      <div className="card bg-white shadow-xl ring-1 ring-slate-200 rounded-2xl md:rounded-3xl overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
           <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-indigo-400" />
             Dettaglio Vendite nel Periodo
           </h3>
           <span className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-widest">{data?.dettaglioRighe?.length || 0} Operazioni</span>
        </div>

        {/* Mobile View Card List */}
        <div className="block md:hidden divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
           {data?.dettaglioRighe?.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-bold">Nessun dato disponibile</div>
           ) : (
              data?.dettaglioRighe?.map((r: any) => (
                 <div key={r.id} className="p-4 space-y-2.5 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-indigo-600 tracking-tight">{r.sku}</span>
                       <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{formatData(r.data)}</span>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                       <div className="space-y-1">
                          <div className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight">{r.cliente}</div>
                          <div className="flex flex-wrap gap-1">
                             <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                                {r.colore}
                             </span>
                             <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                TG. {r.taglia}
                             </span>
                          </div>
                       </div>
                       <div className="text-right space-y-0.5 ml-auto shrink-0">
                          <div className="text-[10px] font-semibold text-slate-400">Pezzi: <span className="font-black text-slate-700">{r.quantita}</span></div>
                          <div className="text-sm font-black text-slate-900">{formatEuro(r.valore)}</div>
                       </div>
                    </div>
                 </div>
              ))
           )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
           <table className="w-full text-sm text-left min-w-[650px]">
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

      {/* Modal di stampa etichette */}
      <LabelPrintModal 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)} 
        items={data?.perProdotto || []} 
      />
    </div>
  )
}
