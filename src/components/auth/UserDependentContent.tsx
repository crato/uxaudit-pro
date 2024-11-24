'use client'

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'

export default function UserDependentContent({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { user, isLoading, error } = useUser()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-destructive">Error: {error.message}</div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login if not authenticated
    router.push('/api/auth/login')
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    )
  }

  return <>{children}</>
}