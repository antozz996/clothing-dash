import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gestionale Ordini — Horus Srl',
  description: 'Gestionale ordini abbigliamento per Horus Srl',
}

import MainLayout from '@/components/layout/MainLayout'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}
