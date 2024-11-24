import React from 'react'
import Navigation from '../components/layout/Navigation'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to UX Audit Pro
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl text-center mb-8">
          Professional UX and accessibility auditing tool for startups and agencies
        </p>
      </main>
    </>
  )
}