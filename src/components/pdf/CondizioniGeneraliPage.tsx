import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 7.5,
    fontFamily: 'Helvetica',
    color: '#000',
    backgroundColor: '#fff',
    lineHeight: 1.3,
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10,
    paddingBottom: 5,
    alignItems: 'center'
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  section: {
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 7.5,
    fontWeight: 'normal',
    textTransform: 'uppercase',
  },
  textBlock: {
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    fontStyle: 'italic',
    paddingTop: 20,
  }
})

export default function CondizioniGeneraliPage() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>CONDIZIONI GENERALI DI VENDITA</Text>
      </View>

      <Text style={styles.companyName}>Horus S.r.l.</Text>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          Premessa{"\n"}
          La presente proposta di ordine e le seguenti condizioni generali di vendita disciplinano termini e modalità delle vendite eseguite da Horus S.r.l. (d'ora in poi anche fornitore e/o fornitrice) nei confronti di soggetti (imprese individuali, società ecc.. d'ora in poi proponente e/o acquirente), che esercitano attività di vendita all'ingrosso ed al dettaglio, pertanto, verso soggetti non qualificabili come "consumatori".
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 1: EFFICACIA DELLA PREMESSA. CONCLUSIONE DEL CONTRATTO. REVOCA DELL'ORDINE DA PARTE DEL PROPONENTE. MODIFICA E/O ANNULLAMENTO DELL'ORDINE DA PARTE DEL FORNITORE.{"\n"}</Text>
          La premessa costituisce patto. Ai sensi dell'art. 1329 del c.c., la presente proposta di ordine è revocabile dal proponente, solo in caso di mancata accettazione della stessa da parte della fornitrice entro dieci giorni dalla ricezione. La presente proposta si tramuterà in contratto con l'accettazione da parte dell'impresa fornitrice, accettazione che si potrà formalizzare, anche, con l'invio della fornitura della merce (o di parte di essa) all'acquirente.{"\n"}
          Le parti al riguardo concordano, e IL PROPONENTE/ACQUIRENTE sin da ora accetta che (I) la fornitrice potrà accettare anche parzialmente la proposta di ordine formulata dall'acquirente ovvero annullarla, qualora, ad esempio, il numero di ordini dell'articolo non sia sufficiente a giustificarne la fornitura.{"\n"}
          L'acquirente, in detta circostanza, rinuncia a sollevare eccezioni e/o a rifiutare l'accettazione parziale della merce. La consegna della merce potrà avvenire anche in differenti tranches, ad insindacabile scelta organizzativa della fornitrice.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 2: VARIAZIONI.{"\n"}</Text>
          Nella proposta di ordine devono essere indicati tutti i prodotti oggetto della proposta.{"\n"}
          Eventuali richieste di variazione dell'ordine da parte dell'acquirente dovranno pervenire al fornitore entro 5 giorni lavorativi dalla data di sottoscrizione della proposta.{"\n"}
          In tal caso il fornitore, previa verifica, potrà comunicare, per iscritto o via e-mail, all'acquirente entro 10 giorni lavorativi l'accettazione della variazione. Laddove il fornitore espressamente accetti tutte le variazioni richieste da parte dell'acquirente o una parte di queste, tali variazioni saranno considerate come definitive e valide, fermo quanto sopra previsto all'art. 1, delle presenti condizioni generali di vendita.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 3: CARATTERISTICHE TECNICHE E CONFORMITA' AL CAMPIONE.{"\n"}</Text>
          L'acquirente dichiara che i campioni visionati per l'ordine riguardano esclusivamente l'aspetto estetico e stilistico della merce, il fornitore avrà la facoltà di effettuare modifiche del prodotto finale, rispetto al campione, in sede di produzione, pertanto, alcuni accessori potrebbero essere diversi rispetto al campione ed i colori potrebbero essere differenti.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 4: PREZZO E SUE REVISIONI.{"\n"}</Text>
          Il prezzo della fornitura oggetto della presente proposta di ordine sono da intendersi franco magazzino, e sono al netto di tasse e Iva.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 5: CONSEGNA.{"\n"}</Text>
          Il termine di consegna viene stabilito dal fornitore e comunicato all'acquirente a mezzo pec e/o raccomandata a.r. e/o e-mail, ovvero indicato nell'accettazione della proposta d'ordine.{"\n"}
          Le parti convengono che le consegne possono essere eseguite in più tranches. Il programma di consegne viene indicato sulla proposta d'ordine accettata per iscritto dal fornitore.{"\n"}
          Tale programma non è applicato ai beni per i quali è stato spedito un ordine successivamente all'accettazione delle precedenti proposte d'ordine regolarmente sottoscritte.{"\n"}
          L'acquirente provvederà a propria cura e spese a ritirare la merce nel luogo previsto, entro i termini indicati dal fornitore, che devono ritenersi essenziali.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 6: SPEDIZIONI{"\n"}</Text>
          La merce viaggia sempre per conto, rischio e pericolo dell'acquirente, ivi comprese le spese di spedizioni anche quando trattasi di resi. Di conseguenza l'impresa fornitrice non risponde delle rotture avarie o di ammanchi.{"\n"}
          In ogni caso, il destinatario dovrà rivalersi sul vettore, essendo questo tenuto al ritiro della merce ed a verificarne le condizioni, salvo indicazioni espresse dall'acquirente sul presente ordine, la spedizione verrà effettuata con le modalità che la fornitrice riterrà più convenienti. La mancata richiesta di assicurazione esonera in ogni caso la ditta fornitrice da ogni responsabilità al riguardo.{"\n"}
          In ogni caso, non si accettano reclami decorsi 8 giorni dal ricevimento della merce.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 7: CONTESTAZIONI RELATIVE A DIFETTI DI CONFORMITA' E RESI.{"\n"}</Text>
          L'acquirente si impegna a verificare allo scarico la quantità di capi ricevuta, la relativa qualità e la corrispondenza all'ordine. Eventuali contestazioni relative alla quantità di merce consegnata, alla relativa qualità ovvero a possibili vizi della stessa, dovrà essere inviata, a pena di decadenza, a mezzo pec entro 8 giorni dalla consegna.{"\n"}
          La contestazione dovrà essere circostanziata. In ogni caso i difetti riscontrati sulla merce dovranno essere documentati attraverso foto digitali che dovranno essere spedite in allegato alla contestazione al fornitore. Contestazioni generiche non produrranno alcun effetto giuridico tra le parti e i loro aventi causa.{"\n"}
          Decorsi 8 giorni dalla ricezione della merce, l'acquirente decadrà dalla facoltà di sollevare contestazioni e la merce si riterrà accettata e conforme a quella ordinata ed oggetto di fattura. Le parti concordano che non saranno accettati per nessun motivo resi di merce, se non preventivamente autorizzati per iscritto dalla impresa fornitrice.{"\n"}
          Solo nel caso in cui il fornitore riconosca, scrivendo a mezzo posta elettronica, i difetti e autorizzi espressamente il reso della merce difettosa, l'acquirente potrà in tal caso spedire la merce.{"\n"}
          In nessun caso l'acquirente è autorizzato a restituire la merce senza espressa approvazione scritta del fornitore.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 8: PAGAMENTI. PERDITA DEL BENEFICIO DEL TERMINE.{"\n"}</Text>
          Il pagamento della merce dovrà avvenire mediante contrassegno a 30-60-90 g.g. per ordini superiori ai 2.500,00 euro, per ordini inferiori ai 2.500,00 euro il pagamento della merce dovrà avvenire mediante contrassegno a 30-60 g.g. dalla data della fattura fine mese per ciascuna consegna.{"\n"}
          Il mancato pagamento anche solo di una rata, entro il termine stabilito, farà perdere il beneficio della dilazione all'acquirente e, pertanto, la fornitrice potrà esigere l'intera somma senza attendere la scadenza delle rate successive, il tutto oltre interessi moratori.{"\n"}
          L'ammontare del pagamento corrisponde al valore della merce fatturata. Nel caso in cui l'acquirente non rispetti i termini di pagamento, il fornitore avrà il diritto a sospendere le consegne dei beni all'acquirente e di agire in ogni sede per il recupero dell'intera somma dovuta, oltre interessi moratori, fatto salvo il diritto di richiedere il risarcimento dei danni.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 9: ANNULLAMENTI.{"\n"}</Text>
          Nel caso in cui l'acquirente a qualsiasi titolo e per qualsivoglia ragione decida dopo 10 giorni dalla data di accettazione di rifiutare o cancellare la consegna di tutta o parte della merce inserita nella proposta di ordine, il fornitore potrà applicare una penale pari al 40% del prezzo della merce non consegnata e sarà per questo autorizzato ad emettere fattura all'acquirente di importo uguale al valore della penale.{"\n"}
          Le parti dichiarano che la previsione della penale è stata oggetto di trattativa e l'acquirente rinunzia ad adire l'autorità giudiziaria per chiederne la riduzione, ritenendola congrua.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 10: FORO COMPETENTE{"\n"}</Text>
          Le parti espressamente convengono che, per tutte le controversie relative all'applicazione, esecuzione, interpretazione e violazione della presente proposta di ordine, sarà competente in via esclusiva il Foro di Napoli.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 11: LIMITAZIONE ALLE PROPOSIZIONI DI ECCEZIONI{"\n"}</Text>
          Qualsivoglia eccezione, denuncia di vizi, reclamo o controversia non sospende l'obbligo dell'acquirente di pagare il prezzo nei termini stabiliti e di essere in regola con i pagamenti.{"\n"}
          Ciò è condizione di ammissibilità delle condizioni stesse. Pertanto, l'acquirente dovrà eseguire le prestazioni poste a proprio carico, anche in caso di proposte eccezioni e/o reclami.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.textBlock}>
          <Text style={styles.articleTitle}>Articolo 12: INDEROGABILITA' DELLE CONDIZIONI DI VENDITA.{"\n"}</Text>
          Nessun agente, persona o vettore è autorizzato dalla fornitrice a fare eccezioni, sconti o a derogare alle norme di cui alle presenti condizioni di vendita.{"\n"}
          Qualsiasi modifica alle presenti condizioni dovrà essere eseguita per iscritto a pena di invalidità.
        </Text>
      </View>

      <Text style={styles.footer} fixed>
        Timbro e/o Firma Cliente per accettazione dell'ordine, delle Condizioni Generali di Vendita e per il consenso al trattamento dei dati personali
      </Text>
    </Page>
  )
}
