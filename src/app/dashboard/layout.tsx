import React from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}