import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { SmartsuppChat } from '@/components/smartsupp-chat'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Bitcap Mining - Bitcoin & Ethereum Mining Platform',
    template: '%s | Bitcap Mining',
  },
  description: 'The most trusted Bitcoin Mining and Ethereum platform. Start mining crypto today with Bitcap Mining - secure, reliable, and profitable.',
  keywords: ['bitcoin mining', 'ethereum mining', 'crypto mining', 'cryptocurrency', 'bitcap', 'mining platform', 'BTC', 'ETH'],
  authors: [{ name: 'Bitcap Mining' }],
  creator: 'Bitcap Mining',
  publisher: 'Bitcap Mining',
  metadataBase: new URL('https://bitcapmining.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bitcapmining.com',
    siteName: 'Bitcap Mining',
    title: 'Bitcap Mining - Bitcoin & Ethereum Mining Platform',
    description: 'The most trusted Bitcoin Mining and Ethereum platform. Start mining crypto today with Bitcap Mining.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Bitcap Mining',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcap Mining - Bitcoin & Ethereum Mining Platform',
    description: 'The most trusted Bitcoin Mining and Ethereum platform. Start mining crypto today with Bitcap Mining.',
    images: ['/twitter-image.png'],
    creator: '@bitcapmining',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid #27272a',
              color: '#fff',
            },
          }}
        />
        <SmartsuppChat />
      </body>
    </html>
  )
}
