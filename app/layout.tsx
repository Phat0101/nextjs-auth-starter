// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
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
        {children}
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
