'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Printer, ArrowLeft, RefreshCw } from 'lucide-react'
import LabelItem from '@/components/report/LabelItem'

interface LabelToPrint {
  sku: string
  colore: string
  taglia: string
  prezzoUnitario: number
  barcodeValue: string
  copies: number
}

function EtichetteStampaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialFormat = (searchParams.get('format') as 'roll' | 'a4-3x8' | 'a4-4x10') || 'roll'
  
  const [format, setFormat] = useState<'roll' | 'a4-3x8' | 'a4-4x10'>(initialFormat)
  const [labels, setLabels] = useState<LabelToPrint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carica le etichette memorizzate in localStorage
    const stored = localStorage.getItem('labels-to-print')
    if (stored) {
      try {
        setLabels(JSON.parse(stored))
      } catch (e) {
        console.error('Error parsing labels to print:', e)
      }
    }
    setLoading(false)
  }, [])

  // Avvia la stampa automatica una volta caricato tutto e se ci sono etichette
  useEffect(() => {
    if (!loading && labels.length > 0) {
      const timer = setTimeout(() => {
        window.print()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [loading, labels])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-inter">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">Caricamento etichette in corso...</p>
      </div>
    )
  }

  if (labels.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-inter p-6">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Printer className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Nessuna etichetta da stampare</h1>
          <p className="text-sm text-slate-500 font-medium">
            Seleziona degli articoli dalla pagina dei report ed imposta le quantità per poter stampare.
          </p>
          <button
            onClick={() => router.push('/report')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al Report
          </button>
        </div>
      </div>
    )
  }

  // Genera l'elenco piatto delle etichette (espandendo in base al numero di copie)
  const flatLabelsList: Omit<LabelToPrint, 'copies'>[] = []
  labels.forEach(label => {
    for (let i = 0; i < label.copies; i++) {
      flatLabelsList.push({
        sku: label.sku,
        colore: label.colore,
        taglia: label.taglia,
        prezzoUnitario: label.prezzoUnitario,
        barcodeValue: label.barcodeValue
      })
    }
  })

  // Funzione per raggruppare le etichette in blocchi per foglio A4
  const chunkLabels = (list: any[], size: number) => {
    const chunks = []
    for (let i = 0; i < list.length; i += size) {
      chunks.push(list.slice(i, i + size))
    }
    return chunks
  }

  // A4 layouts config
  const A4_3X8_SIZE = 24
  const A4_4X10_SIZE = 40

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white font-sans text-slate-900">
      
      {/* Floating control bar (no-print) */}
      <div className="no-print fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-6 max-w-2xl w-11/12 justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/report')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-700 active:scale-95"
            title="Torna indietro"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-black text-slate-800 uppercase tracking-wider">Stampa Etichette</div>
            <div className="text-[10px] text-slate-500 font-bold">
              {flatLabelsList.length} etichette in stampa
            </div>
          </div>
        </div>

        {/* Formato Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Layout:</span>
          <select 
            value={format}
            onChange={(e: any) => setFormat(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="roll">Rotolo Termico</option>
            <option value="a4-3x8">A4 (3x8 - 24pz)</option>
            <option value="a4-4x10">A4 (4x10 - 40pz)</option>
          </select>
        </div>

        {/* Stampa Button */}
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          Stampa
        </button>
      </div>

      {/* Main Container */}
      <div className="pt-24 pb-12 px-4 print:p-0 flex flex-col items-center justify-center">
        
        {/* ==================== 1. ROTOLO TERMICO ==================== */}
        {format === 'roll' && (
          <div className="space-y-6 print:space-y-0 flex flex-col items-center">
            {flatLabelsList.map((label, idx) => (
              <div 
                key={idx} 
                className="print:h-[40mm] print:w-[70mm] print:overflow-hidden print:flex print:items-center print:justify-center print:bg-white print:break-after-page print:page-break-after-always shadow-md print:shadow-none"
              >
                <div className="print:scale-[0.98] print:origin-center">
                  <LabelItem 
                    sku={label.sku}
                    colore={label.colore}
                    taglia={label.taglia}
                    prezzoUnitario={label.prezzoUnitario}
                    barcodeValue={label.barcodeValue}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== 2. GRIGLIA A4 (3x8) ==================== */}
        {format === 'a4-3x8' && (
          <div className="space-y-8 print:space-y-0">
            {chunkLabels(flatLabelsList, A4_3X8_SIZE).map((sheet, sheetIdx) => (
              <div 
                key={sheetIdx}
                className="bg-white border border-slate-300 print:border-none shadow-xl print:shadow-none w-[210mm] h-[297mm] p-[10mm_7mm] box-border grid grid-cols-3 grid-rows-8 gap-x-[3mm] gap-y-[2mm] page-break-after-always break-after-page overflow-hidden"
                style={{
                  gridTemplateColumns: 'repeat(3, 64mm)',
                  gridTemplateRows: 'repeat(8, 33mm)',
                  justifyContent: 'center',
                  alignContent: 'center'
                }}
              >
                {sheet.map((label, idx) => (
                  <div key={idx} className="w-[64mm] h-[33mm] flex items-center justify-center overflow-hidden border border-dashed border-slate-100 print:border-none">
                    <div className="scale-[0.85] origin-center">
                      <LabelItem 
                        sku={label.sku}
                        colore={label.colore}
                        taglia={label.taglia}
                        prezzoUnitario={label.prezzoUnitario}
                        barcodeValue={label.barcodeValue}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ==================== 3. GRIGLIA A4 (4x10) ==================== */}
        {format === 'a4-4x10' && (
          <div className="space-y-8 print:space-y-0">
            {chunkLabels(flatLabelsList, A4_4X10_SIZE).map((sheet, sheetIdx) => (
              <div 
                key={sheetIdx}
                className="bg-white border border-slate-300 print:border-none shadow-xl print:shadow-none w-[210mm] h-[297mm] p-[8mm_6mm] box-border grid grid-cols-4 grid-rows-10 gap-x-[2mm] gap-y-[2mm] page-break-after-always break-after-page overflow-hidden"
                style={{
                  gridTemplateColumns: 'repeat(4, 48mm)',
                  gridTemplateRows: 'repeat(10, 26mm)',
                  justifyContent: 'center',
                  alignContent: 'center'
                }}
              >
                {sheet.map((label, idx) => (
                  <div key={idx} className="w-[48mm] h-[26mm] flex items-center justify-center overflow-hidden border border-dashed border-slate-100 print:border-none">
                    <div className="scale-[0.66] origin-center">
                      <LabelItem 
                        sku={label.sku}
                        colore={label.colore}
                        taglia={label.taglia}
                        prezzoUnitario={label.prezzoUnitario}
                        barcodeValue={label.barcodeValue}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Global CSS overrides for printing */}
      <style jsx global>{`
        @media print {
          /* Rimuovi sfondi e ombre del browser */
          body {
            background-color: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Nascondi la barra comandi */
          .no-print {
            display: none !important;
          }
          
          /* Forza interruzione di pagina */
          .page-break-after-always {
            page-break-after: always !important;
            break-after: page !important;
          }
          
          /* Rimuovi bordi esterni e decorazioni delle pagine in stampa */
          @page {
            margin: 0 !important;
            size: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default function EtichetteStampaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-inter">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">Inizializzazione della stampa...</p>
      </div>
    }>
      <EtichetteStampaContent />
    </Suspense>
  )
}
