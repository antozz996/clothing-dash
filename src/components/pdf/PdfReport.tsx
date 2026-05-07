import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { formatData, formatEuro } from '@/lib/calcoli'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Section Filters
  filterBox: {
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  filterItem: {
    fontSize: 8,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 6,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  // Table
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 6,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 6,
  },
  colLg: { flex: 3, flexDirection: 'row', alignItems: 'center' },
  colMd: { flex: 2 },
  colSm: { flex: 1, textAlign: 'right' },
  productImage: {
    width: 40,
    height: 50,
    marginRight: 12,
    objectFit: 'contain',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4f46e5',
    paddingLeft: 8,
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 7,
    color: '#94a3b8',
  }
})

export default function PdfReport({ data, filters }: { data: any, filters: any }) {
  return (
    <Document title={`Report_Vendite_${formatData(new Date()).replace(/\//g, '-')}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>REPORT VENDITE</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>Generato il {formatData(new Date())}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>HORUS S.R.L.</Text>
            <Text style={{ fontSize: 7 }}>P.IVA: 09578881212</Text>
          </View>
        </View>

        {/* Filters Recap */}
        <View style={styles.filterBox}>
          <Text style={styles.filterTitle}>Filtri Applicati</Text>
          <View style={styles.filterGrid}>
            <Text style={styles.filterItem}>Periodo: {filters.from || 'Inizio'} - {filters.to || 'Oggi'}</Text>
            {filters.cliente && <Text style={styles.filterItem}>Cliente: {filters.cliente}</Text>}
            {filters.sku && <Text style={styles.filterItem}>SKU: {filters.sku}</Text>}
            {filters.colore && <Text style={styles.filterItem}>Colore: {filters.colore}</Text>}
            {filters.taglia && <Text style={styles.filterItem}>Taglia: {filters.taglia}</Text>}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Totale Capi</Text>
            <Text style={styles.statValue}>{data.totali.capi}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Fatturato Netto</Text>
            <Text style={styles.statValue}>{formatEuro(data.totali.valore)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Varianti Vendute</Text>
            <Text style={styles.statValue}>{data.perProdotto.length}</Text>
          </View>
        </View>

        {/* Top Prodotti */}
        <Text style={styles.sectionTitle}>Analisi Prodotti (Top 20)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colLg}>Articolo / Variante</Text>
            <Text style={styles.colSm}>Q.tà</Text>
            <Text style={styles.colSm}>Valore</Text>
          </View>
          {data.perProdotto.sort((a: any, b: any) => b.quantita - a.quantita).slice(0, 20).map((p: any, i: number) => (
            <View key={i} style={styles.tableRow} wrap={false}>
              <View style={styles.colLg}>
                {p.fotoUrl ? (
                  <Image src={p.fotoUrl} style={styles.productImage} />
                ) : (
                  <View style={[styles.productImage, { border: '0.5px solid #eee' }]} />
                )}
                <Text>{p.sku} ({p.colore} / {p.taglia})</Text>
              </View>
              <Text style={styles.colSm}>{p.quantita}</Text>
              <Text style={styles.colSm}>{formatEuro(p.valore)}</Text>
            </View>
          ))}
        </View>

        {/* Analisi Clienti */}
        <Text style={styles.sectionTitle}>Analisi Clienti</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colLg}>Ragione Sociale</Text>
            <Text style={styles.colSm}>Capi</Text>
            <Text style={styles.colSm}>Fatturato</Text>
          </View>
          {data.perCliente.sort((a: any, b: any) => b.valore - a.valore).map((c: any, i: number) => (
            <View key={i} style={styles.tableRow} wrap={false}>
              <Text style={styles.colLg}>{c.ragioneSociale}</Text>
              <Text style={styles.colSm}>{c.quantita}</Text>
              <Text style={styles.colSm}>{formatEuro(c.valore)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer} fixed>
          Documento ad uso interno Horus Srl - Pagina generata automaticamente dal sistema gestionale
        </Text>
      </Page>
    </Document>
  )
}
