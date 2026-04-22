import OrdineForm from '@/components/ordini/OrdineForm'

export default function ModificaOrdinePage({ params }: { params: { id: string } }) {
  return <OrdineForm params={params} />
}
