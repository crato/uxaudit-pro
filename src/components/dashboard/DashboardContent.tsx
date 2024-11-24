'use client'

import React from 'react'
import { UserProfile } from '@auth0/nextjs-auth0/client'

export default function DashboardContent({ user }: { user: UserProfile }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground">
          Welcome to your UX Audit Pro Dashboard, {user.email}
        </p>
        
          <a href="/api/auth/logout"
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
        >
          Logout
        </a>
      </div>
    </div>
  )
}