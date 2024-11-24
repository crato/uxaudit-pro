'use client'

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function AuthStatus() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  if (!user) {
    return <div className="text-sm text-muted-foreground">Not logged in</div>
  }

  return <div className="text-sm text-muted-foreground">Logged in as {user.email}</div>
}