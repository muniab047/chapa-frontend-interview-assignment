"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Users, Building2, TrendingUp, DollarSign, AlertCircle, CheckCircle2, RefreshCw, WifiOff, Server, Database, Shield } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { chapaService } from '@/services/chapaService'
import { AdminDashboardSkeleton } from '@/components/skeletons/AdminDashboardSkeleton'

interface User {
  id: string
  name: string
  email: string
  totalPayments: number
  isActive: boolean
  joinDate: string
}

interface Bank {
  id: number
  slug: string
  swift: string
  name: string
  acct_length: number
  country_id: number
  is_mobilemoney: boolean | null
  is_active: number
  is_rtgs: number
  active: number
  is_24hrs: number | null
  created_at: string
  updated_at: string
  currency: string
}

export function AdminDashboard() {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      totalPayments: 15420.50,
      isActive: true,
      joinDate: '2024-01-10'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      totalPayments: 8750.25,
      isActive: false,
      joinDate: '2024-01-08'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      totalPayments: 22100.75,
      isActive: true,
      joinDate: '2024-01-05'
    }
  ])

  const [banks, setBanks] = useState<Bank[]>([])
  const [loadingBanks, setLoadingBanks] = useState(false)
  const [banksError, setBanksError] = useState<string | null>(null)
  const [banksErrorType, setBanksErrorType] = useState<string | null>(null)
  const [banksSuccess, setBanksSuccess] = useState(false)
  const [userStates, setUserStates] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const loadBanks = async () => {
    setLoadingBanks(true)
    setBanksError(null)
    setBanksErrorType(null)
    setBanksSuccess(false)
    setBanks([])
    
    try {
      console.log('Loading banks via backend proxy...')
      const banksData = await chapaService.getBanks()
      
      console.log('Received banks data:', banksData)
      
      if (Array.isArray(banksData) && banksData.length > 0) {
        setBanks(banksData)
        setBanksSuccess(true)
        
        toast({
          title: "Banks Loaded Successfully! 🏦",
          description: `Successfully loaded ${banksData.length} supported banks via backend proxy from Chapa API.`,
        })
      } else if (Array.isArray(banksData) && banksData.length === 0) {
        setBanks([])
        setBanksError('Chapa API returned no banks data')
        setBanksErrorType('empty_response')
        
        toast({
          title: "No Banks Found",
          description: "Chapa API returned an empty banks list.",
          variant: "destructive"
        })
      } else {
        setBanks([])
        setBanksError('Unexpected data format from Chapa API')
        setBanksErrorType('format_error')
        
        toast({
          title: "Data Format Error",
          description: "Chapa API returned unexpected data format.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Banks loading error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load banks'
      setBanksError(errorMessage)
      setBanks([])
      
      if (errorMessage.includes('Network')) {
        setBanksErrorType('network_error')
      } else if (errorMessage.includes('timeout')) {
        setBanksErrorType('timeout_error')
      } else if (errorMessage.includes('Invalid API Key') || errorMessage.includes('401')) {
        setBanksErrorType('auth_error')
      } else if (errorMessage.includes('structure') || errorMessage.includes('format')) {
        setBanksErrorType('structure_error')
      } else {
        setBanksErrorType('backend_error')
      }
      
      toast({
        title: "Failed to Load Banks",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoadingBanks(false)
    }
  }

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulate API calls for dashboard data
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Initialize user states
      const initialStates = users.reduce((acc, user) => {
        acc[user.id] = user.isActive
        return acc
      }, {} as Record<string, boolean>)
      setUserStates(initialStates)

      setIsDataLoaded(true)
      
      // Load banks after dashboard data is loaded
      loadBanks()
    }

    loadDashboardData()
  }, [])

  // Show skeleton while data is loading
  if (!isDataLoaded) {
    return <AdminDashboardSkeleton />
  }

  const toggleUserStatus = async (userId: string) => {
    const newStatus = !userStates[userId]
    setUserStates(prev => ({ ...prev, [userId]: newStatus }))

    await new Promise(resolve => setTimeout(resolve, 500))

    toast({
      title: "User Status Updated",
      description: `User has been ${newStatus ? 'activated' : 'deactivated'}.`,
    })
  }

  const getErrorIcon = (errorType: string | null) => {
    switch (errorType) {
      case 'network_error':
        return <WifiOff className="h-4 w-4 text-red-600" />
      case 'backend_error':
        return <Server className="h-4 w-4 text-red-600" />
      case 'auth_error':
        return <Shield className="h-4 w-4 text-red-600" />
      case 'empty_response':
        return <Database className="h-4 w-4 text-yellow-600" />
      case 'timeout_error':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getErrorMessage = (errorType: string | null, errorMessage: string) => {
    switch (errorType) {
      case 'network_error':
        return 'Network connection failed. Please check your internet connection and try again.'
      case 'backend_error':
        return 'Backend proxy error. The server may be experiencing issues connecting to Chapa API.'
      case 'auth_error':
        return 'Authentication failed. Please check your Chapa API credentials.'
      case 'empty_response':
        return 'No banks data available from Chapa API at this time.'
      case 'timeout_error':
        return 'Request timed out. The Chapa API may be slow to respond.'
      case 'structure_error':
      case 'format_error':
        return 'Chapa API returned data in an unexpected format.'
      default:
        return errorMessage
    }
  }

  const totalUsers = users.length
  const activeUsers = Object.values(userStates).filter(Boolean).length
  const totalPayments = users.reduce((sum, user) => sum + user.totalPayments, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-[#7DC400]">
          <Building2 className="h-5 w-5" />
          <span className="text-sm font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments.toLocaleString()} ETB</div>
            <p className="text-xs text-muted-foreground">
              Across all users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((activeUsers / totalUsers) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              User activation rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Badge variant={userStates[user.id] ? "default" : "secondary"}>
                        {userStates[user.id] ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Total Payments: <span className="font-medium">{user.totalPayments.toLocaleString()} ETB</span>
                    </div>
                  </div>
                  <Switch
                    checked={userStates[user.id]}
                    onCheckedChange={() => toggleUserStatus(user.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supported Banks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#7DC400]" />
              Supported Banks
            </CardTitle>
            <CardDescription>Banks supported by Chapa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Banks Error Alert */}
            {banksError && (
              <Alert variant="destructive">
                {getErrorIcon(banksErrorType)}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Failed to load banks via backend proxy</p>
                    <p className="text-sm">{getErrorMessage(banksErrorType, banksError)}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loadingBanks ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <LoadingSpinner size="md" />
                  <p className="text-sm text-gray-600">Loading banks via backend proxy...</p>
                </div>
              </div>
            ) : (
              /* Banks List or Empty State */
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {banks.length > 0 ? (
                  banks.map((bank) => (
                    <div key={bank.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{bank.name}</p>
                            <p className="text-sm text-gray-500">
                              Code: {bank.swift} | Length: {bank.acct_length} digits
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{bank.currency}</Badge>
                            {bank.is_24hrs && (
                              <Badge variant="secondary" className="text-xs">24/7</Badge>
                            )}
                            {bank.is_rtgs && (
                              <Badge variant="secondary" className="text-xs">RTGS</Badge>
                            )}
                            {bank.is_mobilemoney && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Mobile Money</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* Empty State */
                  <div className="text-center py-12 text-gray-500">
                    <Building2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No Banks Available</p>
                    <p className="text-sm mb-4">
                      {banksError 
                        ? 'Unable to load banks via backend proxy' 
                        : 'No banks data returned from the API'
                      }
                    </p>
                    <Button
                      onClick={loadBanks}
                      variant="outline"
                      size="sm"
                      disabled={loadingBanks}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Refresh Button */}
            <Button 
              onClick={loadBanks} 
              variant="outline" 
              className="w-full"
              disabled={loadingBanks}
            >
              {loadingBanks ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Loading Banks...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Banks
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
