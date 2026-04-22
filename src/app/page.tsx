'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Package, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatEuro, formatData } from '@/lib/calcoli'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [topData, setTopData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resK, resC, resT] = await Promise.all([
        fetch('/api/report/kpi'),
        fetch('/api/report/fatturato'),
        fetch('/api/report/top-data')
      ])
      setKpis(await resK.json())
      setChartData(await resC.json())
      setTopData(await resT.json())
    } finally { setLoading(false) }
  }

  const safeChartData = Array.isArray(chartData) ? chartData : []
  const safeUltimiOrdini = Array.isArray(topData?.ultimiOrdini) ? topData.ultimiOrdini : []
  const safeTopClienti = Array.isArray(topData?.topClienti) ? topData.topClienti : []

  const kpiItems = [
    { label: 'Fatturato Mese', value: formatEuro(kpis?.fatturatoMese || 0), icon: TrendingUp, color: '#10b981', bg: '#d1fae5' },
    { label: 'Ordini Mese', value: kpis?.nOrdiniMese || 0, icon: ClipboardList, color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Capi Mese', value: kpis?.nCapiMese || 0, icon: Package, color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Bozze Aperte', value: kpis?.nBozze || 0, icon: AlertTriangle, color: '#f59e0b', bg: '#fef3c7' },
  ]

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-inter">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiItems.map((item, i) => (
          <div key={i} className="card p-6 bg-white shadow-md ring-1 ring-slate-200 rounded-3xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
              <item.icon className="w-7 h-7" style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-3 card p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-[2rem]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Trend Fatturato Annuale</h3>
           </div>
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(v) => formatEuro(v as number)}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Top Clients */}
        <div className="card p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-[2rem]">
           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8">Top Clienti</h3>
           <div className="space-y-6">
              {safeTopClienti?.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                     {i+1}
                   </div>
                   <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{c.name}</p>
                      <p className="text-[10px] text-indigo-500 font-black mt-0.5">{formatEuro(c.value)}</p>
                   </div>
                </div>
              ))}
              {!safeTopClienti?.length && <p className="text-xs text-slate-400 text-center py-10">Dati non disp.</p>}
           </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="card p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-[2rem]">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Ultimi Ordini Registrati</h3>
            <Link href="/ordini" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-all">
               Vedi Tutti <ArrowRight className="w-3 h-3" />
            </Link>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead>
                  <tr className="border-b border-slate-100">
                     <th className="pb-4 px-2 font-bold text-slate-400 uppercase text-[10px]">Documento</th>
                     <th className="pb-4 px-2 font-bold text-slate-400 uppercase text-[10px]">Cliente</th>
                     <th className="pb-4 px-2 font-bold text-slate-400 uppercase text-[10px] text-right">Importo</th>
                     <th className="pb-4 px-2 font-bold text-slate-400 uppercase text-[10px] text-center">Stato</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {safeUltimiOrdini?.map((ord: any) => (
                    <tr key={ord.id} className="group hover:bg-slate-50 transition-colors">
                       <td className="py-4 px-2 font-bold text-slate-900">{ord.numeroDocumento}</td>
                       <td className="py-4 px-2 font-medium text-slate-600">{ord.cliente.ragioneSociale}</td>
                       <td className="py-4 px-2 text-right font-black text-slate-900">{formatEuro(ord.totaleIvato)}</td>
                       <td className="py-4 px-2 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            ord.stato === 'bozza' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          )}>
                            {ord.stato}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
