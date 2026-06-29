'use client'

import React, { useState, useEffect } from 'react'
import { X, Printer, Settings, Info, Check, Plus, Minus } from 'lucide-react'
import LabelItem from './LabelItem'

interface VariantItem {
  sku: string
  descrizione: string
  colore: string
  taglia: string
  quantita: number
  valore: number
  prezzoUnitario?: number
  fotoUrl?: string
}

interface LabelPrintModalProps {
  isOpen: boolean
  onClose: () => void
  items: VariantItem[]
}

// Funzione deterministica per generare un codice a barre tipo "V145236"
export function generateBarcodeValue(sku: string, colore: string, taglia: string): string {
  const str = `${sku.trim().toUpperCase()}-${colore.trim().toUpperCase()}-${taglia.trim().toUpperCase()}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Converti in intero a 32 bit
  }
  const num = Math.abs(hash) % 900000 + 100000 // Valore tra 100000 e 999999
  return `V${num}`
}

export default function LabelPrintModal({ isOpen, onClose, items }: LabelPrintModalProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [format, setFormat] = useState<'roll' | 'a4-3x8' | 'a4-4x10'>('roll')
  const [barcodeMode, setBarcodeMode] = useState<'generated' | 'sku'>('generated')

  // Inizializza le selezioni e le quantità quando cambiano gli articoli del report
  useEffect(() => {
    if (items && items.length > 0) {
      const initialSelected: Record<string, boolean> = {}
      const initialQuantities: Record<string, number> = {}

      items.forEach(item => {
        const key = `${item.sku}-${item.colore}-${item.taglia}`
        initialSelected[key] = true
        initialQuantities[key] = item.quantita || 1
      })

      setSelectedItems(initialSelected)
      setQuantities(initialQuantities)
    }
  }, [items])

  if (!isOpen) return null

  const handleToggleSelect = (key: string) => {
    setSelectedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleQuantityChange = (key: string, val: number) => {
    const newVal = Math.max(1, val)
    setQuantities(prev => ({ ...prev, [key]: newVal }))
  }

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedItems).every(v => v)
    const nextState = !allSelected
    const updated: Record<string, boolean> = {}
    items.forEach(item => {
      const key = `${item.sku}-${item.colore}-${item.taglia}`
      updated[key] = nextState
    })
    setSelectedItems(updated)
  }

  // Calcola il totale delle etichette da stampare
  const totalLabels = items.reduce((acc, item) => {
    const key = `${item.sku}-${item.colore}-${item.taglia}`
    if (selectedItems[key]) {
      return acc + (quantities[key] || 0)
    }
    return acc
  }, 0)

  // Recupera il primo articolo selezionato per l'anteprima live
  const previewItem = items.find(item => {
    const key = `${item.sku}-${item.colore}-${item.taglia}`
    return selectedItems[key]
  }) || items[0]

  const handlePrint = () => {
    const labelsToPrint = items
      .filter(item => {
        const key = `${item.sku}-${item.colore}-${item.taglia}`
        return selectedItems[key] && (quantities[key] || 0) > 0
      })
      .map(item => {
        const key = `${item.sku}-${item.colore}-${item.taglia}`
        const qty = quantities[key] || 1
        const price = item.prezzoUnitario || (item.valore / (item.quantita || 1)) || 0
        const barcodeVal = barcodeMode === 'sku' ? item.sku : generateBarcodeValue(item.sku, item.colore, item.taglia)
        
        return {
          sku: item.sku,
          colore: item.colore,
          taglia: item.taglia,
          prezzoUnitario: price,
          barcodeValue: barcodeVal,
          copies: qty
        }
      })

    if (labelsToPrint.length === 0) {
      alert('Seleziona almeno un articolo da stampare!')
      return
    }

    // Salva i dati in localStorage per passarli alla pagina di stampa
    localStorage.setItem('labels-to-print', JSON.stringify(labelsToPrint))
    
    // Apri la pagina di stampa in una nuova scheda
    window.open(`/report/etichette?format=${format}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-inter">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden ring-1 ring-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Stampa Etichette Codici a Barre</h2>
              <p className="text-xs text-slate-500 font-medium">Configura le quantità ed il layout di stampa</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200/60 rounded-xl transition-colors text-slate-400 hover:text-slate-600 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left panel: List of items (Col 7) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto flex flex-col h-full border-r border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Articoli nel report</span>
              <button 
                onClick={handleSelectAll}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                {Object.values(selectedItems).every(v => v) ? 'Deseleziona Tutti' : 'Seleziona Tutti'}
              </button>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {items && items.length > 0 ? (
                items.map((item) => {
                  const key = `${item.sku}-${item.colore}-${item.taglia}`
                  const isSelected = !!selectedItems[key]
                  const qty = quantities[key] || 1
                  const price = item.prezzoUnitario || (item.valore / (item.quantita || 1)) || 0

                  return (
                    <div 
                      key={key} 
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-indigo-100 bg-indigo-50/20' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {/* Checkbox + Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleSelect(key)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-indigo-600 border-indigo-600 text-white' 
                              : 'border-slate-300 bg-white hover:border-slate-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-800 text-sm truncate">{item.sku}</div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold text-slate-500">
                            <span className="uppercase">{item.colore}</span>
                            <span>•</span>
                            <span>TG. {item.taglia}</span>
                            <span>•</span>
                            <span className="text-slate-600">€{price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Qty controller */}
                      <div className="flex items-center gap-2.5 shrink-0 ml-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Etichette</span>
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(key, qty - 1)}
                            disabled={!isSelected}
                            className="p-1.5 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input 
                            type="number"
                            min="1"
                            disabled={!isSelected}
                            value={qty}
                            onChange={(e) => handleQuantityChange(key, parseInt(e.target.value) || 1)}
                            className="w-10 text-center text-xs font-bold text-slate-800 focus:outline-none disabled:opacity-50"
                          />
                          <button
                            onClick={() => handleQuantityChange(key, qty + 1)}
                            disabled={!isSelected}
                            className="p-1.5 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-12 text-center text-slate-400 font-bold text-sm">Nessun articolo trovato</div>
              )}
            </div>
          </div>

          {/* Right panel: Preview and settings (Col 5) */}
          <div className="lg:col-span-5 p-6 bg-slate-50/50 flex flex-col justify-between h-full overflow-y-auto">
            
            {/* Top section: Settings & Live preview */}
            <div className="space-y-6">
              
              {/* Settings Box */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Impostazioni di Stampa
                </div>

                {/* Formato */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-0.5">Formato Layout</label>
                  <select 
                    value={format}
                    onChange={(e: any) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="roll">Rotolo Termico (Singolo, 70x40mm)</option>
                    <option value="a4-3x8">Foglio A4 Adesivo (Griglia 3x8 - 24 Etichette)</option>
                    <option value="a4-4x10">Foglio A4 Adesivo (Griglia 4x10 - 40 Etichette)</option>
                  </select>
                </div>

                {/* Barcode Mode */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-0.5">Valore Codice a Barre</label>
                  <select 
                    value={barcodeMode}
                    onChange={(e: any) => setBarcodeMode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="generated">Generato (Codice Variante es. V145236)</option>
                    <option value="sku">SKU Diretto (es. SSH26038)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-0.5">Anteprima Etichetta</span>
                {previewItem ? (
                  <div className="flex justify-center p-4 bg-white border border-slate-200 rounded-2xl shadow-inner min-h-[180px] items-center">
                    <LabelItem 
                      sku={previewItem.sku}
                      colore={previewItem.colore}
                      taglia={previewItem.taglia}
                      prezzoUnitario={previewItem.prezzoUnitario || (previewItem.valore / (previewItem.quantita || 1)) || 0}
                      barcodeValue={barcodeMode === 'sku' ? previewItem.sku : generateBarcodeValue(previewItem.sku, previewItem.colore, previewItem.taglia)}
                    />
                  </div>
                ) : (
                  <div className="h-[180px] bg-slate-100 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold">
                    Seleziona un capo per l'anteprima
                  </div>
                )}
              </div>

              {/* Info Note */}
              <div className="flex gap-2.5 p-3.5 bg-amber-50 border border-amber-200/60 rounded-xl text-amber-800 text-xs font-medium">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Nota Stampa:</strong> Cliccando su stampa verrai reindirizzato ad una pagina ottimizzata per la stampa. Assicurati di impostare i <strong>margini su Nessuno</strong> nella finestra di dialogo della stampante del browser.
                </p>
              </div>

            </div>

            {/* Bottom Section: Total & Print Button */}
            <div className="mt-6 pt-5 border-t border-slate-100 bg-white p-4 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">Totale Etichette</span>
                <span className="text-2xl font-black text-indigo-600">{totalLabels}</span>
              </div>
              <button
                onClick={handlePrint}
                disabled={totalLabels === 0}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none active:scale-95 duration-150"
              >
                <Printer className="w-4 h-4" />
                Procedi alla Stampa
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
