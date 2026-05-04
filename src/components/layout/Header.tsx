'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, Menu } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/clienti': 'Clienti',
  '/prodotti': 'Prodotti',
  '/ordini': 'Ordini',
  '/ddt': 'DDT',
  '/report': 'Report',
}

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  for (const [path, title] of Object.entries(pageTitles)) {
    if (path !== '/' && pathname.startsWith(path)) return title
  }
  return 'Gestionale'
}

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white/80 backdrop-blur-sm border-b sticky top-0 z-30"
      style={{ borderColor: 'var(--border)' }}>
      
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Title */}
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-50 border border-slate-200 text-slate-400">
          <Search className="w-4 h-4" />
          <span className="text-xs">Cerca...</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg transition-colors hover:bg-slate-100">
          <Bell className="w-5 h-5 text-slate-400" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">H</span>
        </div>
      </div>
    </header>
  )
}
