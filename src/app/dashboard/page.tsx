import React from 'react'
import UserDependentContent from '../../components/auth/UserDependentContent'
import Navigation from '../../components/layout/Navigation'

export default function DashboardPage() {
  return (
    <div>
      <Navigation />
      <UserDependentContent>
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              Welcome to your UX Audit Pro Dashboard
            </p>
            
             <a href="/api/auth/logout"
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
            >
              Logout
            </a>
          </div>
        </div>
      </UserDependentContent>
    </div>
  )
}