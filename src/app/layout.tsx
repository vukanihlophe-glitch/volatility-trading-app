import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'V75 Trading Dashboard',
  description: 'Volatility 75 Index — 15-minute strategy engine',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
