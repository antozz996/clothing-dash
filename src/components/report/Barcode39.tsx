'use client'

import React from 'react'

const CODE39_ALPHABET: Record<string, string> = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101',
  '$': '100100100101', '/': '100100101001', '+': '100101001001', '%': '101001001001'
}

interface Barcode39Props {
  value: string
  height?: number
  lineWidth?: number
}

export default function Barcode39({ value, height = 45, lineWidth = 1.5 }: Barcode39Props) {
  const normalizedValue = value.trim().toUpperCase()
  // Filtra caratteri non validi in Code 39
  const validChars = normalizedValue.split('').filter(c => CODE39_ALPHABET[c] !== undefined).join('')
  
  if (!validChars) return null

  // Il formato Code 39 inizia e finisce sempre con l'asterisco '*'
  const fullString = `*${validChars}*`
  
  // Costruisce la sequenza di bit (1 = barra nera, 0 = spazio bianco)
  const bits: string[] = []
  for (let i = 0; i < fullString.length; i++) {
    bits.push(CODE39_ALPHABET[fullString[i]])
    if (i < fullString.length - 1) {
      bits.push('0') // Spazio di divisione tra i caratteri
    }
  }
  
  const bitString = bits.join('')
  const rects: React.ReactNode[] = []
  let currentX = 0
  
  for (let i = 0; i < bitString.length; i++) {
    if (bitString[i] === '1') {
      rects.push(
        <rect 
          key={i} 
          x={currentX * lineWidth} 
          y={0} 
          width={lineWidth} 
          height={height} 
          fill="black" 
        />
      )
    }
    currentX++
  }
  
  const totalWidth = bitString.length * lineWidth
  
  return (
    <div className="flex flex-col items-center w-full">
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${totalWidth} ${height}`} 
        preserveAspectRatio="none"
        className="w-full max-w-[240px]"
      >
        {rects}
      </svg>
      <span className="text-[10px] tracking-[3px] font-bold mt-1 text-slate-700 font-mono">
        {validChars}
      </span>
    </div>
  )
}
