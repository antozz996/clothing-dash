'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/clienti': 'Clienti',
  '/prodotti': 'Prodotti',
  '/ordini': 'Ordini',
  '/ddt': 'DDT',
  '/report': 'Report',
}

function getPageTitle(pathname: string): string {
  // Exact match
  if (pageTitles[pathname]) return pageTitles[pathname]

  // Check for nested routes
  for (const [path, title] of Object.entries(pageTitles)) {
    if (path !== '/' && pathname.startsWith(path)) return title
  }

  return 'Gestionale'
}

export default function Header() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm border-b"
      style={{ borderColor: 'var(--border)' }}>
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          {title}
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}>
          <Search className="w-4 h-4" />
          <span className="text-xs">Cerca...</span>
          <kbd className="hidden md:inline ml-4 px-1.5 py-0.5 rounded text-[10px] font-medium"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--muted-light)',
            }}>
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg transition-colors hover:bg-slate-100">
          <Bell className="w-5 h-5" style={{ color: 'var(--muted)' }} />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">DC</span>
        </div>
      </div>
    </header>
  )
}
