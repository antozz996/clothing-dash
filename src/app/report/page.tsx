import { BarChart3 } from 'lucide-react'

export default function ReportPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Report
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Analisi fatturato, top clienti e prodotti
          </p>
        </div>
        <select className="px-3 py-2 rounded-lg text-sm border"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Fatturato Mensile — Ultimi 12 mesi
          </h3>
          <div className="h-64 flex items-center justify-center rounded-lg"
            style={{ background: 'var(--background)' }}>
            <BarChart3 className="w-12 h-12" style={{ color: 'var(--border)' }} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Top 10 Clienti per Fatturato
          </h3>
          <div className="h-64 flex items-center justify-center rounded-lg"
            style={{ background: 'var(--background)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Dati insufficienti</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Top 10 Prodotti per Quantità
          </h3>
          <div className="h-64 flex items-center justify-center rounded-lg"
            style={{ background: 'var(--background)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Dati insufficienti</p>
          </div>
        </div>
      </div>
    </div>
  )
}
