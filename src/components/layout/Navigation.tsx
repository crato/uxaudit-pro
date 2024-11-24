'use client'

import React from 'react'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    // Clear any cached data/state here if needed
    router.push('/api/auth/logout')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center font-bold text-xl"
            >
              UX Audit Pro
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : !user ? (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Login
              </Link>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-foreground hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}