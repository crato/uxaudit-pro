import React from 'react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-8">Login to UX Audit Pro</h1>
      
       <a href="/api/auth/login"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Login with Auth0
      </a>
    </div>
  )
}