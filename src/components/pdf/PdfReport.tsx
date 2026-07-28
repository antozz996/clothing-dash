import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { formatData, formatEuro } from '@/lib/calcoli'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#000',
    backgroundColor: '#fff',
  },
  
  // Header Superiore
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  companyInfo: {
    width: '55%',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 8,
    marginBottom: 1,
  },
  reportTitleSection: {
    width: '40%',
    textAlign: 'right',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 8,
    color: '#444',
  },

  // Info Bar (Filtri, Totali)
  infoGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  infoCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  infoCellLast: {
    flex: 1,
    padding: 4,
  },
  infoLabel: {
    fontSize: 6,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Table Header
  tableHeader: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  colArticolo: { width: '45%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', textAlign: 'center', fontWeight: 'bold' },
  colImporto: { width: '12%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', textAlign: 'center', fontWeight: 'bold' },
  colGriglia: { width: '43%', padding: 4, textAlign: 'center', fontWeight: 'bold' },
  
  // Table Rows
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#000',
    minHeight: 80,
  },
  rowArticolo: {
    width: '45%',
    flexDirection: 'row',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  productImage: {
    width: 60,
    height: 70,
    marginRight: 10,
    objectFit: 'contain',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  sku: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 8, color: '#333' },
  
  rowImporto: {
    width: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  price: { fontSize: 10, fontWeight: 'bold' },

  rowGriglia: {
    width: '43%',
    padding: 10,
    justifyContent: 'center',
  },

  // Griglia Taglie interna
  matrix: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  matrixHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderBottomWidth: 0.5,
    borderColor: '#000',
  },
  matrixRow: {
    flexDirection: 'row',
  },
  matrixCell: {
    flex: 1,
    padding: 3,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderColor: '#000',
    fontSize: 7,
  },
  matrixCellLast: {
    flex: 1,
    padding: 3,
    textAlign: 'center',
    fontSize: 7,
  },
  matrixColHeader: {
    fontWeight: 'bold',
  },
  matrixTotCell: {
    backgroundColor: '#dcfce7', // Light green
    fontWeight: 'bold',
  },

  // Summary Box Footer
  summarySection: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#000',
    backgroundColor: '#f8fafc',
  },
  notesBox: {
    width: '70%',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  totalsBox: {
    width: '30%',
    padding: 0,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#eee',
    fontWeight: 'bold',
    fontSize: 9,
  },

  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    fontSize: 7,
    color: '#666',
  },
  footerNote: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    fontSize: 7,
    color: '#666',
  }
})

function sortTaglie(sizes: string[]) {
  const orderMap: Record<string, number> = {
    'XXS': 1, 'XS': 2, 'S': 3, 'M': 4, 'L': 5, 'XL': 6, 'XXL': 7, '3XL': 8, 'TU': 99
  }
  return [...sizes].sort((a, b) => {
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB
    }
    if (orderMap[a.toUpperCase()] && orderMap[b.toUpperCase()]) {
      return orderMap[a.toUpperCase()] - orderMap[b.toUpperCase()]
    }
    return a.localeCompare(b, undefined, { numeric: true })
  })
}

interface Props {
  data: {
    totali: {
      capi: number
      valore: number
    }
    prodotti: Array<{
      sku: string
      descrizione: string
      prezzoUnitario: number
      fotoUrl: string | null
      colore: string
      taglie: Record<string, number>
      totale: number
      valore: number
    }>
  }
  filters: {
    from?: string | null
    to?: string | null
    cliente?: string | null
    sku?: string | null
    colore?: string | null
    taglia?: string | null
  }
}

export default function PdfReport({ data, filters }: Props) {
  const prodotti = data.prodotti || []

  return (
    <Document title={`Report_Vendite_${formatData(new Date()).replace(/\//g, '-')}`}>
      <Page size="A4" style={styles.page}>
        {/* Intestazione Aziendale e Titolo Report */}
        <View style={styles.headerSection}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>HORUS S.R.L.</Text>
            <Text style={styles.companyDetail}>Sede Legale: Via San Giacomo 30 - 80133 - Napoli</Text>
            <Text style={styles.companyDetail}>Sede Operativa: Via San Giacomo 30 - 80133 - Napoli</Text>
            <Text style={styles.companyDetail}>Mail: Amministrazione@noirshowroom.it</Text>
            <Text style={styles.companyDetail}>C. Fisc. e P.Iva 09578881212</Text>
          </View>
          <View style={styles.reportTitleSection}>
            <Text style={styles.reportTitle}>REPORT VENDITE</Text>
            <Text style={styles.reportSubtitle}>Generato il {formatData(new Date())}</Text>
          </View>
        </View>

        {/* Info Grid (Recap Filtri e Totali) */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCell, { flex: 1.2 }]}>
            <Text style={styles.infoLabel}>PERIODO</Text>
            <Text style={styles.infoValue}>
              {filters?.from || filters?.to
                ? `${filters.from ? formatData(filters.from) : 'Inizio'} - ${filters.to ? formatData(filters.to) : 'Oggi'}`
                : 'TUTTI'}
            </Text>
          </View>
          <View style={[styles.infoCell, { flex: 1.4 }]}>
            <Text style={styles.infoLabel}>CLIENTE</Text>
            <Text style={styles.infoValue}>
              {filters?.cliente ? filters.cliente.toUpperCase() : 'TUTTI I CLIENTE'}
            </Text>
          </View>
          <View style={[styles.infoCell, { flex: 0.9 }]}>
            <Text style={styles.infoLabel}>TOT. VARIANTI</Text>
            <Text style={styles.infoValue}>{prodotti.length}</Text>
          </View>
          <View style={[styles.infoCell, { flex: 0.9 }]}>
            <Text style={styles.infoLabel}>TOTALE CAPI</Text>
            <Text style={styles.infoValue}>{data?.totali?.capi || 0}</Text>
          </View>
          <View style={[styles.infoCellLast, { flex: 1.2 }]}>
            <Text style={styles.infoLabel}>FATTURATO NETTO</Text>
            <Text style={styles.infoValue}>{formatEuro(data?.totali?.valore || 0)}</Text>
          </View>
        </View>

        {/* Intestazione Tabella */}
        <View style={styles.tableHeader}>
          <Text style={styles.colArticolo}>ARTICOLO</Text>
          <Text style={styles.colImporto}>IMPORTO</Text>
          <Text style={styles.colGriglia}>GRIGLIA TAGLIE</Text>
        </View>

        {/* Righe Articoli */}
        {prodotti.map((item, idx) => {
          const sizes = sortTaglie(Object.keys(item.taglie || {}))

          return (
            <View key={idx} style={styles.tableRow} wrap={false}>
              <View style={styles.rowArticolo}>
                {item.fotoUrl ? (
                  <Image src={item.fotoUrl} style={styles.productImage} />
                ) : (
                  <View style={[styles.productImage, { border: '0.5px solid #eee' }]} />
                )}
                <View style={styles.productDetails}>
                  <Text style={styles.sku}>{item.sku}</Text>
                  <Text style={styles.description}>{item.descrizione}</Text>
                </View>
              </View>
              
              <View style={styles.rowImporto}>
                <Text style={styles.price}>{formatEuro(item.prezzoUnitario)}</Text>
              </View>

              <View style={styles.rowGriglia}>
                <View style={styles.matrix}>
                  {/* Intestazione Taglie */}
                  <View style={styles.matrixHeader}>
                    <Text style={[styles.matrixCell, { width: 40, textAlign: 'left', fontWeight: 'bold' }]}>COL.</Text>
                    {sizes.map(s => (
                      <Text key={s} style={[styles.matrixCell, styles.matrixColHeader]}>{s}</Text>
                    ))}
                    <Text style={[styles.matrixCellLast, styles.matrixColHeader, { width: 30 }]}>ToT.</Text>
                  </View>
                  {/* Valori */}
                  <View style={styles.matrixRow}>
                    <Text style={[styles.matrixCell, { width: 40, textAlign: 'left', fontSize: 6 }]}>{item.colore}</Text>
                    {sizes.map(s => (
                      <Text key={s} style={styles.matrixCell}>{item.taglie[s] || 0}</Text>
                    ))}
                    <Text style={[styles.matrixCellLast, styles.matrixTotCell, { width: 30 }]}>{item.totale}</Text>
                  </View>
                </View>
              </View>
            </View>
          )
        })}

        {/* Riepilogo Finale */}
        <View style={styles.summarySection} wrap={false}>
          <View style={styles.notesBox}>
            <Text style={styles.infoLabel}>NOTE REPORT</Text>
            <Text style={[styles.description, { marginTop: 2 }]}>
              Report Vendite ad uso interno. Elaborato secondo i filtri selezionati.
            </Text>
          </View>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.infoLabel}>TOTALE VARIANTI</Text>
              <Text style={styles.infoValue}>{prodotti.length}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.infoLabel}>TOTALE CAPI</Text>
              <Text style={styles.infoValue}>{data?.totali?.capi || 0}</Text>
            </View>
            <View style={styles.totalFinal}>
              <Text>FATTURATO NETTO</Text>
              <Text>{formatEuro(data?.totali?.valore || 0)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerNote} fixed>
          Documento ad uso interno Horus Srl — Report Vendite
        </Text>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Pagina ${pageNumber} di ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  )
}
