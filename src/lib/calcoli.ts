/**
 * Calcoli business — Gestionale Ordini
 * IVA fissa al 22%, prezzo unico per SKU
 */

export interface RigaCalcolo {
  quantita: number
  prezzoUnitario: number
}

export interface TotaliOrdine {
  totaleCapi: number
  imponibile: number
  iva: number
  totaleIvato: number
}

const ALIQUOTA_IVA = 0.22

/**
 * Calcola i totali di un ordine a partire dalle righe griglia.
 */
export function calcolaTotaliOrdine(righe: RigaCalcolo[]): TotaliOrdine {
  let totaleCapi = 0
  let imponibile = 0

  for (const riga of righe) {
    totaleCapi += riga.quantita
    imponibile += riga.quantita * riga.prezzoUnitario
  }

  // Arrotondamento a 2 decimali
  imponibile = Math.round(imponibile * 100) / 100
  const iva = Math.round(imponibile * ALIQUOTA_IVA * 100) / 100
  const totaleIvato = Math.round((imponibile + iva) * 100) / 100

  return { totaleCapi, imponibile, iva, totaleIvato }
}

/**
 * Calcola l'importo di una singola riga (qty × prezzo).
 */
export function calcolaImportoRiga(quantita: number, prezzoUnitario: number): number {
  return Math.round(quantita * prezzoUnitario * 100) / 100
}

/**
 * Formatta un importo in euro con separatore italiano.
 * Es. 5417.00 → "€ 5.417,00"
 */
export function formatEuro(importo: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(importo)
}

/**
 * Formatta una data in formato italiano.
 * Es. 2026-04-19 → "19/04/2026"
 */
export function formatData(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data
  return new Intl.DateTimeFormat('it-IT').format(d)
}
