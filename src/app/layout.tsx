import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UX Audit Pro',
  description: 'Professional UX and accessibility auditing tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <UserProvider>
          <div suppressHydrationWarning>
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  )
}