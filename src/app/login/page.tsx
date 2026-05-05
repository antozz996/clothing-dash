'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, Package, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError('Password non valida. Riprova.')
      }
    } catch (err) {
      setError('Si è verificato un errore.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-inter">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20">
            <Package className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">HORUS S.R.L.</h1>
            <p className="text-slate-400 font-medium mt-2">Gestionale Ordini Abbigliamento</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
          <div className="flex items-center gap-3 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Accesso Riservato</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password di Sistema</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="Inserisci password..."
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Entra nel Sistema
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs font-medium">
          &copy; 2026 Horus S.r.l. &bull; Tutti i diritti riservati
        </p>
      </div>
    </div>
  )
}
