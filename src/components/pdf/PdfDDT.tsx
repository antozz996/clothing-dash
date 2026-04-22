import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { formatData } from '@/lib/calcoli'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: 'Helvetica', color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  aziendaName: { fontSize: 14, fontWeight: 'bold' },
  docType: { fontSize: 12, fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase' },
  addresses: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  addressBox: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 4, backgroundColor: '#f9f9f9' },
  addressTitle: { fontSize: 7, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', marginBottom: 4 },
  table: { marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#3b82f6', color: '#fff', padding: 6, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', padding: 6, alignItems: 'center' },
  colSku: { width: '15%' },
  colDesc: { width: '55%' },
  colGrid: { width: '20%' },
  colQty: { width: '10%', textAlign: 'right', fontWeight: 'bold' },
  footer: { borderTopWidth: 1, borderTopColor: '#000', paddingTop: 10, marginTop: 20 },
  signBox: { width: 150, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 30, textAlign: 'center', paddingTop: 4, fontSize: 7, color: '#999' }
})

export default function PdfDDT({ ddt }: { ddt: any }) {
  // Righe possono venire da ordineId (righeGriglia) o righeDdt (standalone)
  const righeRaw = ddt.ordine ? ddt.ordine.righeGriglia : ddt.righeDdt
  
  // Raggruppa per griglia nel PDF
  const grouped = righeRaw.reduce((acc: any, r: any) => {
    if (!acc[r.sku]) acc[r.sku] = { sku: r.sku, descrizione: r.descrizione, items: [] }
    acc[r.sku].items.push(r)
    return acc
  }, {})

  return (
    <Document title={`DDT_${ddt.numeroDocumento.replace('/', '_')}`}>
      <Page style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.aziendaName}>DRESS & COMPANY S.R.L.</Text>
            <Text style={{ fontSize: 7 }}>P.IVA: 05433931218 | Terzigno (NA)</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.docType}>D.D.T. DI TRASPORTO</Text>
            <Text>N. {ddt.numeroDocumento} del {formatData(ddt.dataDdt)}</Text>
          </View>
        </View>

        <View style={styles.addresses}>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Destinatario</Text>
            <Text style={{ fontWeight: 'bold' }}>{ddt.destNome || ddt.cliente.ragioneSociale}</Text>
            <Text>{ddt.destIndirizzo}</Text>
            <Text>{ddt.destCap} {ddt.destCitta} ({ddt.destProvincia})</Text>
          </View>
          {ddt.destDiversa && (
            <View style={styles.addressBox}>
              <Text style={styles.addressTitle}>Destinazione Diversa</Text>
              <Text style={{ fontWeight: 'bold' }}>{ddt.destDivNome}</Text>
              <Text>{ddt.destDivIndirizzo}</Text>
              <Text>{ddt.destDivCap} {ddt.destDivCitta}</Text>
            </View>
          )}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colSku}>SKU</Text>
            <Text style={styles.colDesc}>Descrizione Articolo</Text>
            <Text style={styles.colGrid}>Varianti</Text>
            <Text style={styles.colQty}>Q.tà</Text>
          </View>
          {Object.values(grouped).map((item: any, i) => (
            <View key={i} style={styles.tableRow} wrap={false}>
              <Text style={styles.colSku}>{item.sku}</Text>
              <Text style={styles.colDesc}>{item.descrizione}</Text>
              <View style={styles.colGrid}>
                {item.items.map((v: any, j: number) => (
                  <Text key={j} style={{ fontSize: 7 }}>{v.colore}/{v.taglia}: {v.quantita}</Text>
                ))}
              </View>
              <Text style={styles.colQty}>{item.items.reduce((s: number, x: any) => s+x.quantita, 0)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={{ fontSize: 7, color: '#999' }}>Riferimento Ordine: {ddt.ordine?.numeroDocumento || 'Nessuno'}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
             <View style={styles.signBox}><Text>Firma Vettore</Text></View>
             <View style={styles.signBox}><Text>Firma Ricevente</Text></View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
