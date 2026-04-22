import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Gestionale Ordini — Dress & Company',
  description: 'Gestionale ordini abbigliamento per Dress & Company S.r.l.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content area — offset by sidebar width */}
          <div className="flex-1 ml-[260px] transition-all duration-300 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
