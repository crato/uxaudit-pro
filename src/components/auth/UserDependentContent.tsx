'use client'

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function UserDependentContent({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Please log in to access this page.</div>
      </div>
    )
  }

  return <>{children}</>
}