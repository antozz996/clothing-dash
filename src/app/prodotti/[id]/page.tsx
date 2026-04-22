import ProdottoForm from '@/components/prodotti/ProdottoForm'

export default function ModificaProdottoPage({ params }: { params: { id: string } }) {
  return <ProdottoForm params={params} />
}
