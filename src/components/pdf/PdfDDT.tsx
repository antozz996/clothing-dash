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
  termsSection: {
    width: '40%',
    textAlign: 'right',
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 2,
    textDecoration: 'underline',
  },
  termsText: {
    fontSize: 5.5,
    marginBottom: 1,
    lineHeight: 1.2,
  },

  // Box Indirizzi
  addressContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 0,
  },
  addressBox: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    minHeight: 60,
  },
  addressBoxLast: {
    flex: 1,
    padding: 5,
    minHeight: 60,
  },
  labelSmall: {
    fontSize: 6,
    fontStyle: 'italic',
    marginBottom: 3,
  },
  addressName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 8,
    marginBottom: 1,
  },

  // Info Bar
  infoGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#000',
    marginBottom: 0,
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
    borderTopWidth: 0,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  colArticolo: { width: '45%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', textAlign: 'center' },
  colImporto: { width: '12%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', textAlign: 'center' },
  colGriglia: { width: '43%', padding: 4, textAlign: 'center' },
  
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
    backgroundColor: '#dcfce7',
    fontWeight: 'bold',
  },

  // Footer / Totals
  summarySection: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#000',
  },
  notesBox: {
    width: '100%',
    padding: 5,
  },

  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 7,
    color: '#666',
  }
})

export default function PdfDDT({ ddt }: { ddt: any }) {
  // Righe possono venire da ordineId (righeGriglia) o righeDdt (standalone)
  const righeRaw = ddt.ordine ? ddt.ordine.righeGriglia : ddt.righeDdt

  // Raggruppa per Prodotto + Colore
  const groupedByProductAndColor = righeRaw.reduce((acc: any, r: any) => {
    const key = `${r.prodottoId || r.sku}-${r.colore}`
    if (!acc[key]) {
      acc[key] = {
        sku: r.sku,
        descrizione: r.descrizione,
        prezzoUnitario: r.prezzoUnitario || 0,
        fotoUrl: r.fotoUrl,
        colore: r.colore,
        taglie: {} as Record<string, number>,
        totale: 0
      }
    }
    acc[key].taglie[r.taglia] = (acc[key].taglie[r.taglia] || 0) + r.quantita
    acc[key].totale += r.quantita
    return acc
  }, {})

  return (
    <Document title={`DDT_${ddt.numeroDocumento.replace('/', '_')}`}>
      <Page size="A4" style={styles.page}>
        {/* Intestazione Aziendale */}
        <View style={styles.headerSection}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>HORUS S.R.L.</Text>
            <Text style={styles.companyDetail}>Sede Legale: Via San Giacomo 30 - 80133 - Napoli</Text>
            <Text style={styles.companyDetail}>Sede Operativa: Via San Giacomo 30 - 80133 - Napoli</Text>
            <Text style={styles.companyDetail}>Mail : Amministrazione@noirshowroom.it</Text>
            <Text style={styles.companyDetail}>Pec: horussrl@pecaruba.it - Codice Univoco KRRH6B9</Text>
            <Text style={styles.companyDetail}>C. Fisc. e P.Iva 09578881212</Text>
          </View>
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>CONDIZIONI GENERALI DI VENDITA</Text>
            <Text style={styles.termsText}>1 Non si accettano reclami trascorsi otto giorni dal ricevimento di quanto fornito</Text>
            <Text style={styles.termsText}>2 La merce viaggia a rischio e pericolo del cliente, anche se venduta franco destino</Text>
            <Text style={styles.termsText}>3 In caso di ritardo dei pagamenti, decorreranno gli interessi moratori nella misura del saggio legale d&apos;interesse aumentato di 7 punti</Text>
            <Text style={styles.termsText}>4 Per qualsiasi controversia adirà Autorità Giudiziaria competente nel territorio della Ditta venditrice per ogni controversia il foro competente è di Napoli</Text>
            <Text style={[styles.termsText, { marginTop: 5, fontWeight: 'bold' }]}>DLGS 196/03 TUTELA DELLA PRIVACY :</Text>
            <Text style={styles.termsText}>i Vs. Dati anagrafici saranno trattati per fini amministrativi e per adempimento obblighi di legge.</Text>
            <Text style={[styles.termsText, { marginTop: 10 }]}>Pregasi controllare esattezza dei dati fiscali del cliente .</Text>
            <Text style={styles.termsText}>In caso di errori non ci riterremo responsabili in solido come previsto dall’art. 41 D.P.R. 26/10/72 n°633</Text>
          </View>
        </View>

        {/* Indirizzi */}
        <View style={styles.addressContainer}>
          <View style={styles.addressBox}>
            <Text style={styles.labelSmall}>SPETT.LE</Text>
            <Text style={styles.addressName}>{ddt.cliente.ragioneSociale}</Text>
            <Text style={styles.addressText}>{ddt.cliente.indirizzo}</Text>
            <Text style={styles.addressText}>{ddt.cliente.cap} {ddt.cliente.citta} ({ddt.cliente.provincia})</Text>
          </View>
          <View style={styles.addressBoxLast}>
            <Text style={styles.labelSmall}>DESTINAZIONE DIVERSA</Text>
            {ddt.destDiversa || ddt.cliente.indirizzoSpedizione ? (
              <>
                <Text style={styles.addressName}>{ddt.destDivNome || ddt.cliente.ragioneSociale}</Text>
                <Text style={styles.addressText}>{ddt.destDivIndirizzo || ddt.cliente.indirizzoSpedizione}</Text>
                <Text style={styles.addressText}>
                  {ddt.destDivCap || ddt.cliente.capSpedizione} {ddt.destDivCitta || ddt.cliente.cittaSpedizione} ({ddt.destDivProvincia || ddt.cliente.provinciaSpedizione})
                </Text>
              </>
            ) : (
              <Text style={[styles.addressText, { fontStyle: 'italic', color: '#999' }]}>Come sede legale</Text>
            )}
          </View>
        </View>

        {/* Info Documento */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
             <Text style={styles.infoLabel}>COD.CLI</Text>
             <Text style={styles.infoValue}>C-{ddt.cliente.id.substring(0,4).toUpperCase()}</Text>
          </View>
          <View style={styles.infoCell}>
             <Text style={styles.infoLabel}>C.F. / P.IVA</Text>
             <Text style={styles.infoValue}>{ddt.cliente.cf || ddt.cliente.piva || '---'}</Text>
          </View>
          <View style={styles.infoCell}>
             <Text style={styles.infoLabel}>AGENTE</Text>
             <Text style={styles.infoValue}>{ddt.agente || 'DIREZIONE'}</Text>
          </View>
          <View style={styles.infoCell}>
             <Text style={styles.infoLabel}>TIPO DOCUMENTO</Text>
             <Text style={styles.infoValue}>DDT DI TRASPORTO</Text>
          </View>
          <View style={styles.infoCell}>
             <Text style={styles.infoLabel}>DATA DOC.</Text>
             <Text style={styles.infoValue}>{formatData(ddt.dataDdt)}</Text>
          </View>
          <View style={styles.infoCellLast}>
             <Text style={styles.infoLabel}>NR.DOC.</Text>
             <Text style={styles.infoValue}>{ddt.numeroDocumento}</Text>
          </View>
        </View>

        {/* Intestazione Tabella */}
        <View style={styles.tableHeader}>
           <Text style={styles.colArticolo}>ARTICOLO</Text>
           <Text style={styles.colImporto}>IMPORTO</Text>
           <Text style={styles.colGriglia}>GRIGLIA TAGLIE</Text>
        </View>

        {/* Righe Articoli */}
        {Object.values(groupedByProductAndColor).map((item: any, idx: number) => {
          const sizes = Object.keys(item.taglie).sort()

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
                   <View style={styles.matrixHeader}>
                      <Text style={[styles.matrixCell, { width: 40, textAlign: 'left', fontWeight: 'bold' }]}>COL.</Text>
                      {sizes.map(s => (
                        <Text key={s} style={[styles.matrixCell, styles.matrixColHeader]}>{s}</Text>
                      ))}
                      <Text style={[styles.matrixCellLast, styles.matrixColHeader, { width: 30 }]}>ToT.</Text>
                   </View>
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
              <Text style={styles.infoLabel}>NOTE / CAUSALE TRASPORTO</Text>
              <Text style={[styles.addressText, { marginTop: 5 }]}>{ddt.note || 'VENDITA'}</Text>
              
              <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-around' }}>
                 <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 5, marginBottom: 10 }}>Firma Conducente</Text>
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', width: 100 }} />
                 </View>
                 <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 5, marginBottom: 10 }}>Firma Destinatario</Text>
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', width: 100 }} />
                 </View>
              </View>
           </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Pagina ${pageNumber} di ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  )
}
