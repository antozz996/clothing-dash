'use client'

import React from 'react'
import Barcode39 from './Barcode39'

interface LabelItemProps {
  sku: string
  colore: string
  taglia: string
  prezzoUnitario: number
  barcodeValue: string
}

export default function LabelItem({
  sku,
  colore,
  taglia,
  prezzoUnitario,
  barcodeValue
}: LabelItemProps) {
  // Formatta il prezzo per assomigliare alla foto (es. 365.0)
  const formattedPrice = prezzoUnitario.toFixed(1)

  return (
    <div className="bg-white border border-slate-300 w-[265px] h-[150px] p-3 rounded-2xl flex flex-col justify-between select-none shadow-sm print:shadow-none print:border-slate-400 print:rounded-2xl print:bg-white print:w-[265px] print:h-[150px] overflow-hidden font-sans">
      {/* Testata: SKU */}
      <div className="border-b border-slate-300 pb-0.5">
        <span className="text-[15px] font-extrabold text-slate-800 tracking-wider">
          {sku}
        </span>
      </div>

      {/* Colore */}
      <div className="border-b border-slate-300 py-0.5 text-[11px] font-bold text-slate-800">
        Color : <span className="uppercase ml-1">{colore}</span>
      </div>

      {/* Taglia e Prezzo */}
      <div className="border-b border-slate-300 grid grid-cols-2 text-[11px] font-bold text-slate-800">
        <div className="py-0.5 border-r border-slate-300 pr-2">
          Size: <span className="ml-1">{taglia}</span>
        </div>
        <div className="py-0.5 pl-2 flex justify-between">
          <span>Price</span>
          <span className="font-extrabold">{formattedPrice}</span>
        </div>
      </div>

      {/* Barcode */}
      <div className="pt-1.5 flex flex-col items-center justify-center flex-1">
        <Barcode39 value={barcodeValue} height={38} lineWidth={1.3} />
      </div>
    </div>
  )
}
