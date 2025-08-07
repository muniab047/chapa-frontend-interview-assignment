"use client"

import { Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/LoginForm'
import { Dashboard } from '@/components/Dashboard'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { InteractiveLoading } from '@/components/ui/interactive-loading'

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#7DC400]/10 to-[#5a9000]/10">
        <div className="text-center space-y-6">
          {/* Chapa Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/chapa-logo.png" 
              alt="Chapa Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          
          {/* Interactive Loading */}
          <div className="space-y-4">
            <InteractiveLoading size="lg" />
            <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
            <p className="text-gray-500 text-sm">Please wait while we prepare everything for you</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {user ? (
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      ) : (
        <LoginForm />
      )}
    </main>
  )
}
