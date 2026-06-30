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
  imponibileOriginale: number
  scontoPercentualeValore: number
  scontoEuroValore: number
  scontoPagamentoValore: number
  imponibile: number
  iva: number
  totaleIvato: number
}

const ALIQUOTA_IVA = 0.22

/**
 * Calcola i totali di un ordine a partire dalle righe griglia e dagli sconti.
 */
export function calcolaTotaliOrdine(
  righe: RigaCalcolo[],
  scontoPercentuale = 0,
  scontoEuro = 0,
  metodoPagamento = ''
): TotaliOrdine {
  let totaleCapi = 0
  let imponibileOriginale = 0

  for (const riga of righe) {
    totaleCapi += riga.quantita
    imponibileOriginale += riga.quantita * riga.prezzoUnitario
  }

  // 1. Sconto percentuale
  const scontoPercentualeValore = Math.round(imponibileOriginale * (scontoPercentuale / 100) * 100) / 100
  let imp = imponibileOriginale - scontoPercentualeValore

  // 2. Sconto euro
  const scontoEuroValore = Math.round(scontoEuro * 100) / 100
  imp = imp - scontoEuroValore

  // 3. Sconto pagamento (disattivato, non automatico)
  const scontoPagamentoValore = 0

  // Imponibile finale (non negativo)
  const imponibile = Math.max(0, Math.round(imp * 100) / 100)
  const iva = Math.round(imponibile * ALIQUOTA_IVA * 100) / 100
  const totaleIvato = Math.round((imponibile + iva) * 100) / 100

  return {
    totaleCapi,
    imponibileOriginale,
    scontoPercentualeValore,
    scontoEuroValore,
    scontoPagamentoValore,
    imponibile,
    iva,
    totaleIvato
  }
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
