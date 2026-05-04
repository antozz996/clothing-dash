'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { cn } from '@/lib/utils'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true) // Default to collapsed/hidden for mobile first

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar con passaggio stato */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Area principale — il margine si adatta allo stato della sidebar solo su desktop */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <Header onMenuClick={() => setCollapsed(false)} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
