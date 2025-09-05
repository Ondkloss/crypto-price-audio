import './globals.css'
import type { Metadata } from 'next'

const basePath = process.env.NODE_ENV === 'production' ? '/crypto-price-audio' : ''

export const metadata: Metadata = {
  title: 'Crypto Price Audio',
  description: 'PWA that speaks crypto prices at regular intervals',
  manifest: `${basePath}/manifest.json`,
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
