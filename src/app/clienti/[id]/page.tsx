import ClienteForm from '@/components/clienti/ClienteForm'

export default function ModificaClientePage({ params }: { params: { id: string } }) {
  return <ClienteForm params={params} />
}
