'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Truck,
  BarChart3,
  ChevronLeft,
  Menu,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clienti', label: 'Clienti', icon: Users },
  { href: '/prodotti', label: 'Prodotti', icon: Package },
  { href: '/ordini', label: 'Ordini', icon: ClipboardList },
  { href: '/ddt', label: 'DDT', icon: Truck },
  { href: '/report', label: 'Report', icon: BarChart3 },
]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setCollapsed(true)}
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          !collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
        style={{ background: 'var(--sidebar-bg)' }}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-white/10',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">Dress & Company</h1>
                <p className="text-[10px] text-slate-400 font-medium">Gestionale Ordini</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-indigo-500/15 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-5 h-5 flex-shrink-0 transition-transform duration-200',
                  !isActive && 'group-hover:scale-110'
                )}>
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors duration-200',
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                </div>
                {!collapsed && (
                  <span className="animate-fade-in">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer — Collapse toggle */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium',
              'text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200',
              collapsed && 'justify-center px-2'
            )}
          >
            {collapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Comprimi</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
