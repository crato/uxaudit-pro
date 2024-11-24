'use client'

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (user) {
      router.push('/dashboard')
      router.refresh()
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-8">Login to UX Audit Pro</h1>
        <div className="space-y-4">
          
          <a  href="/api/auth/login"
            className="w-full flex justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Continue with Auth0
          </a>
          <p className="text-sm text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}