"use client"

import { Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserDashboard } from '@/components/dashboards/UserDashboard'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { SuperAdminDashboard } from '@/components/dashboards/SuperAdminDashboard'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { AdminDashboardSkeleton } from '@/components/skeletons/AdminDashboardSkeleton'
import { SuperAdminDashboardSkeleton } from '@/components/skeletons/SuperAdminDashboardSkeleton'

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  const renderDashboard = () => {
    switch (user.role) {
      case 'user':
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <UserDashboard />
          </Suspense>
        )
      case 'admin':
        return (
          <Suspense fallback={<AdminDashboardSkeleton />}>
            <AdminDashboard />
          </Suspense>
        )
      case 'super_admin':
        return (
          <Suspense fallback={<SuperAdminDashboardSkeleton />}>
            <SuperAdminDashboard />
          </Suspense>
        )
      default:
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <UserDashboard />
          </Suspense>
        )
    }
  }

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  )
}
