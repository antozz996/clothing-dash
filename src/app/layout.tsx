import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gestionale Ordini — Dress & Company',
  description: 'Gestionale ordini abbigliamento per Dress & Company S.r.l.',
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
