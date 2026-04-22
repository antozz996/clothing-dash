import { prisma } from './prisma'

/**
 * Genera il prossimo numero progressivo per un tipo di documento (ORD o DDT).
 * Implementa incremento atomico — nessun rischio di duplicati.
 * 
 * Con SQLite usa upsert di Prisma (equivalente a ON CONFLICT ... DO UPDATE di PostgreSQL).
 * 
 * @param tipo - 'ORD' per ordini, 'DDT' per documenti di trasporto
 * @param anno - Anno di riferimento (default: anno corrente)
 * @returns Oggetto con { progressivo, numeroDocumento } es. { progressivo: 34, numeroDocumento: "34/2026" }
 */
export async function getNextProgressivo(tipo: 'ORD' | 'DDT', anno?: number) {
  const annoCorrente = anno ?? new Date().getFullYear()

  // Upsert atomico: se non esiste crea con 1, se esiste incrementa
  const contatore = await prisma.contatore.upsert({
    where: {
      anno_tipo: {
        anno: annoCorrente,
        tipo: tipo,
      },
    },
    update: {
      ultimoProg: { increment: 1 },
    },
    create: {
      anno: annoCorrente,
      tipo: tipo,
      ultimoProg: 1,
    },
  })

  return {
    progressivo: contatore.ultimoProg,
    numeroDocumento: `${contatore.ultimoProg}/${annoCorrente}`,
  }
}
