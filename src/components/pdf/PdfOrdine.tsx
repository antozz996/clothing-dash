import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { formatData, formatEuro } from '@/lib/calcoli'

// Font registration (using default Helvetica for reliability)
// If custom fonts are needed, they would be registered here.

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#333',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  aziendaInfo: {
    flexDirection: 'column',
    gap: 2,
  },
  aziendaName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  aziendaSmall: {
    fontSize: 7,
    color: '#666',
  },
  titleBlock: {
    textAlign: 'right',
  },
  docType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4f46e5',
    textTransform: 'uppercase',
  },
  docNumber: {
    fontSize: 10,
    fontWeight: 'normal',
    color: '#000',
    marginTop: 2,
  },
  
  // Addresses
  addresses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 20,
  },
  addressBox: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  addressTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  addressContent: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
  },
  addressSub: {
    fontSize: 8,
    color: '#555',
  },

  // Info Row (Code, Date, Agent)
  infoBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  infoCol: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 6,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },

  // Table
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: 6,
    fontWeight: 'bold',
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
    alignItems: 'center',
    minHeight: 40,
  },
  colImg: { width: '12%' },
  colDesc: { width: '40%' },
  colPrice: { width: '10%', textAlign: 'right' },
  colGrid: { width: '30%', paddingLeft: 10 },
  colTot: { width: '8%', textAlign: 'right', fontWeight: 'bold' },

  photo: {
    width: 30,
    height: 35,
    borderRadius: 2,
    objectFit: 'cover',
  },
  skuText: { fontSize: 8, fontWeight: 'bold' },
  descText: { fontSize: 7, color: '#666' },

  gridRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  gridCell: {
    fontSize: 7,
    color: '#444',
  },

  // Totals
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  noteBox: {
    width: '60%',
  },
  totalsBox: {
    width: '35%',
    gap: 4,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalFinal: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4f46e5',
  }
})

interface Props {
  ordine: any
}

export default function PdfOrdine({ ordine }: Props) {
  // Raggruppa le righe per SKU/ProdottoId per mostrare la griglia compatta
  const groupedItems = ordine.righeGriglia.reduce((acc: any, r: any) => {
    if (!acc[r.sku]) {
      acc[r.sku] = {
        sku: r.sku,
        descrizione: r.descrizione,
        prezzoUnitario: r.prezzoUnitario,
        fotoUrl: r.fotoUrl,
        variants: []
      }
    }
    acc[r.sku].variants.push(r)
    return acc
  }, {})

  return (
    <Document title={`Ordine_${ordine.numeroDocumento.replace('/', '_')}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.aziendaInfo}>
            <Text style={styles.aziendaName}>DRESS & COMPANY S.R.L.</Text>
            <Text style={styles.aziendaSmall}>Via Avini - Parco De Martino, 82/84 | 80040 Terzigno (NA)</Text>
            <Text style={styles.aziendaSmall}>P.IVA: 05433931218 | Tel: +39 081 8271345</Text>
            <Text style={styles.aziendaSmall}>Email: amministrazione@dressecompany.it</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.docType}>Commissione d&apos;Ordine</Text>
            <Text style={styles.docNumber}>N. {ordine.numeroDocumento}</Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addresses}>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Spett.le Cliente</Text>
            <Text style={styles.addressContent}>{ordine.cliente.ragioneSociale}</Text>
            <Text style={styles.addressSub}>{ordine.cliente.indirizzo}</Text>
            <Text style={styles.addressSub}>{ordine.cliente.cap} {ordine.cliente.citta} ({ordine.cliente.provincia})</Text>
            <Text style={styles.addressSub}>P.IVA: {ordine.cliente.piva}</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Info Documento</Text>
            <Text style={styles.addressSub}>Data Documento: {formatData(ordine.dataOrdine)}</Text>
            <Text style={styles.addressSub}>Cond. Pagamento: Vedi accordi</Text>
            <Text style={styles.addressSub}>Agente: Direzione</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={[styles.tableHeader]}>
            <Text style={styles.colImg}>Articolo</Text>
            <Text style={styles.colDesc}>Descrizione</Text>
            <Text style={styles.colPrice}>Prezzo</Text>
            <Text style={styles.colGrid}>Griglia Taglie / Colori</Text>
            <Text style={styles.colTot}>Q.tà</Text>
          </View>

          {Object.values(groupedItems).map((item: any, idx: number) => {
            const totItem = item.variants.reduce((sum: number, v: any) => sum + v.quantita, 0)
            
            return (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <View style={styles.colImg}>
                   {item.fotoUrl ? (
                     <Image src={item.fotoUrl} style={styles.photo} />
                   ) : (
                     <View style={[styles.photo, { border: '1px solid #eee' }]} />
                   )}
                </View>
                <View style={styles.colDesc}>
                   <Text style={styles.skuText}>{item.sku}</Text>
                   <Text style={styles.descText}>{item.descrizione}</Text>
                </View>
                <View style={styles.colPrice}>
                  <Text>{formatEuro(item.prezzoUnitario)}</Text>
                </View>
                <View style={styles.colGrid}>
                  <View style={styles.gridRow}>
                    {item.variants.map((v: any, vIdx: number) => (
                      <Text key={vIdx} style={styles.gridCell}>
                        {v.colore} | {v.taglia}: {v.quantita}
                      </Text>
                    ))}
                  </View>
                </View>
                <View style={styles.colTot}>
                  <Text>{totItem}</Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Totals Section */}
        <View style={styles.footer} wrap={false}>
          <View style={styles.noteBox}>
            <Text style={styles.addressTitle}>Note ed Annotazioni</Text>
            <Text style={styles.addressSub}>{ordine.note || 'Nessuna nota aggiuntiva.'}</Text>
            
            <View style={{ marginTop: 20 }}>
               <Text style={[styles.addressTitle, { fontSize: 6 }]}>Firma per accettazione</Text>
               <View style={{ borderBottomWidth: 1, borderBottomColor: '#eee', width: 150, marginTop: 15 }} />
            </View>
          </View>
          
          <View style={styles.totalsBox}>
            <View style={styles.totalLine}>
              <Text>Totale Capi:</Text>
              <Text>{ordine.totaleCapi}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text>Imponibile:</Text>
              <Text>{formatEuro(ordine.imponibile)}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text>IVA 22%:</Text>
              <Text>{formatEuro(ordine.iva)}</Text>
            </View>
            <View style={[styles.totalLine, styles.totalFinal]}>
              <Text>TOTALE DOCUMENTO:</Text>
              <Text>{formatEuro(ordine.totaleIvato)}</Text>
            </View>
          </View>
        </View>

        {/* Page Number */}
        <Text style={{ position: 'absolute', bottom: 20, right: 30, fontSize: 8, color: '#999' }} 
          render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} di ${totalPages}`} />
      </Page>
    </Document>
  )
}
