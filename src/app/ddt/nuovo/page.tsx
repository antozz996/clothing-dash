'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Truck, User, MapPin, ClipboardList, Info } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import GrigliaTaglieEditor from '@/components/ordini/GrigliaTaglieEditor'

export default function DdtForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromOrderId = searchParams.get('orderId')
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!fromOrderId)
  const [order, setOrder] = useState<any>(null)
  
  // State for DDT
  const [clienteId, setClienteId] = useState('')
  const [dataDdt, setDataDdt] = useState(new Date().toISOString().split('T')[0])
  const [destNome, setDestNome] = useState('')
  const [destIndirizzo, setDestIndirizzo] = useState('')
  const [destCap, setDestCap] = useState('')
  const [destCitta, setDestCitta] = useState('')
  const [destProvincia, setDestProvincia] = useState('')
  const [destDiversa, setDestDiversa] = useState(false)
  const [note, setNote] = useState('')
  const [clienti, setClienti] = useState<any[]>([])
  const [prodotti, setProdotti] = useState<any[]>([])
  const [dataGrid, setDataGrid] = useState<any>({})

  useEffect(() => {
    fetchInitialData()
  }, [fromOrderId])

  const fetchInitialData = async () => {
    try {
      const [resC, resP] = await Promise.all([
        fetch('/api/clienti'),
        fetch('/api/prodotti')
      ])
      const dataC = await resC.json()
      const dataP = await resP.json()
      setClienti(dataC || [])
      setProdotti(dataP || [])

      if (fromOrderId) {
        const res = await fetch(`/api/ordini/${fromOrderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
          setClienteId(data.clienteId)
          setDestNome(data.cliente.ragioneSociale)
          setDestIndirizzo(data.cliente.indirizzo || '')
          setDestCap(data.cliente.cap || '')
          setDestCitta(data.cliente.citta || '')
          setDestProvincia(data.cliente.provincia || '')
        }
      }
    } catch (e) { console.error(e) }
    finally { setFetching(false) }
  }

  const handleClienteChange = (id: string) => {
    setClienteId(id)
    const c = clienti.find(x => x.id === id)
    if (c) {
      setDestNome(c.ragioneSociale)
      setDestIndirizzo(c.indirizzo || '')
      setDestCap(c.cap || '')
      setDestCitta(c.citta || '')
      setDestProvincia(c.provincia || '')
    }
  }

  const onSubmit = async () => {
    if (!clienteId) return alert('Seleziona un cliente')
    
    setLoading(true)
    try {
      // Converti GridState in righe piatte (solo se standalone)
      const flatRighe: any[] = []
      if (!fromOrderId) {
        Object.entries(dataGrid).forEach(([pid, item]: [string, any]) => {
          Object.entries(item.matrix).forEach(([colore, taglieRow]: [string, any]) => {
            Object.entries(taglieRow).forEach(([taglia, quantita]: [string, any]) => {
              if (quantita > 0) {
                flatRighe.push({
                  sku: item.prodotto.sku,
                  descrizione: item.prodotto.descrizione,
                  fotoUrl: item.prodotto.fotoUrl,
                  colore,
                  taglia,
                  quantita
                })
              }
            })
          })
        })
        if (flatRighe.length === 0) return alert('Aggiungi almeno un articolo al DDT')
      }

      const res = await fetch('/api/ddt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ordineId: fromOrderId,
          clienteId,
          dataDdt,
          destNome,
          destIndirizzo,
          destCap,
          destCitta,
          destProvincia,
          destDiversa,
          note,
          righe: flatRighe
        })
      })

      if (res.ok) {
        router.push('/ddt')
      } else {
        alert('Errore creazione DDT')
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (fetching) return <div className="p-20 text-center animate-pulse">Caricamento dati ordine...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4">
        <Link href="/ddt" className="p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-200 text-slate-400 font-inter">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nuovo DDT</h1>
          <p className="text-sm text-slate-500 font-inter">Emissione Documento di Trasporto</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Info card if linked to order */}
        {order && (
          <div className="card p-4 bg-blue-50 border-blue-100 flex items-center gap-3 text-blue-700">
            <ClipboardList className="w-5 h-5" />
            <div className="text-sm font-medium font-inter">Collegato all&apos;Ordine: <span className="font-bold">{order.numeroDocumento}</span> ({order.totaleCapi} capi)</div>
          </div>
        )}

        {/* Destinazione */}
        <div className="card p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
           <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider font-inter">
              <MapPin className="w-4 h-4" />
              Dati Consegna
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!fromOrderId && (
                <div className="md:col-span-2 space-y-1.5 font-inter">
                  <label className="text-xs font-bold text-slate-500">Seleziona Cliente Database <span className="text-red-500">*</span></label>
                  <select 
                    value={clienteId} 
                    onChange={e => handleClienteChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all font-inter"
                  >
                    <option value="">Seleziona cliente...</option>
                    {clienti.map(c => <option key={c.id} value={c.id}>{c.ragioneSociale}</option>)}
                  </select>
                </div>
              )}
              <div className="md:col-span-2 space-y-1.5 font-inter">
                 <label className="text-xs font-bold text-slate-500">Destinatario (Ragione Sociale)</label>
                 <input value={destNome} onChange={e => setDestNome(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all" />
              </div>
              <div className="md:col-span-2 space-y-1.5 font-inter">
                 <label className="text-xs font-bold text-slate-500">Indirizzo</label>
                 <input value={destIndirizzo} onChange={e => setDestIndirizzo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-1.5 font-inter">
                 <label className="text-xs font-bold text-slate-500">CAP / Città</label>
                 <div className="flex gap-2 font-inter">
                   <input value={destCap} onChange={e => setDestCap(e.target.value)} className="w-20 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all" />
                   <input value={destCitta} onChange={e => setDestCitta(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all" />
                 </div>
              </div>
              <div className="space-y-1.5 font-inter">
                 <label className="text-xs font-bold text-slate-500">Provincia</label>
                 <input value={destProvincia} onChange={e => setDestProvincia(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 transition-all uppercase" maxLength={5} />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2 font-inter">
               <input type="checkbox" id="destDiversa" checked={destDiversa} onChange={e => setDestDiversa(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
               <label htmlFor="destDiversa" className="text-sm font-semibold text-slate-700 cursor-pointer">Destinazione Diversa</label>
            </div>
        </div>

        {/* Standalone Item Grid */}
        {!fromOrderId && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1 font-inter flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              Articoli DDT (Standalone)
            </h3>
            <GrigliaTaglieEditor 
              data={dataGrid}
              onChange={setDataGrid}
              prodottiDisponibili={prodotti}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-4 font-inter">
           <button onClick={onSubmit} disabled={loading} className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg flex items-center gap-2 active:scale-95 transition-all">
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Emetti DDT
           </button>
        </div>
      </div>
    </div>
  )
}
