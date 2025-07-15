// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './Header'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DTAL Audit',
  description: 'DTAL customs audit system',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce')
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
      {/* Add nonce to Next.js scripts */}
      <script
        nonce={nonce || ''}
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              // Your custom scripts here
            })();
          `,
        }}
      ></script>
    </html>
  )
}
