"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Shield, Users, DollarSign, TrendingUp, UserPlus, Building2, Activity, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { chapaService } from '@/services/chapaService'
import { SuperAdminDashboardSkeleton } from '@/components/skeletons/SuperAdminDashboardSkeleton'


interface Admin {
  id: string
  name: string
  email: string
  role: 'admin' | 'super_admin'
  isActive: boolean
  createdAt: string
}

interface SystemStats {
  totalPayments: number
  activeUsers: number
  totalTransactions: number
  successRate: number
}
interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'success' | 'pending' | 'failed'
  description: string
  date: string
  reference: string
  user: string
}

export function SuperAdminDashboard() {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [verifyingTxn, setVerifyingTxn] = useState<string | null>(null)
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: '1',
      name: 'Jane Smith',
      email: 'admin@chapa.co',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'superadmin@chapa.co',
      role: 'super_admin',
      isActive: true,
      createdAt: '2024-01-01'
    }
  ])
  const [transactions] = useState<Transaction[]>([
      {
        id: '1',
        user: 'Jane Smith',
        amount: 500.00,
        currency: 'ETB',
        status: 'success',
        description: 'Payment to Merchant ABC',
        date: '2024-01-15',
        reference: 'John-Doe-1754527913281'
      },
      {
        id: '2',
        user: 'Mike Johnson',
        amount: 250.00,
        currency: 'ETB',
        status: 'pending',
        description: 'Transfer to John Doe',
        date: '2024-01-14',
        reference: 'invalid-transaction-ref'
      },
      {
        id: '3',
        user: 'Jane Smith',
        amount: 1000.00,
        currency: 'ETB',
        status: 'failed',
        description: 'Payment to Service XYZ',
        date: '2024-01-13',
        reference: 'failed-payment-123'
      }
    ])
  

  const [systemStats] = useState<SystemStats>({
    totalPayments: 1250000,
    activeUsers: 2847,
    totalTransactions: 15420,
    successRate: 98.5
  })

  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'super_admin'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transferForm, setTransferForm] = useState({
    amount: '',
    account_name: '',
    account_number: '',
    bank_code: '',
    reference: ''
  })
  const [isTransferring, setIsTransferring] = useState(false)
  const { toast } = useToast()

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulate API calls for dashboard data
      await new Promise(resolve => setTimeout(resolve, 1800))
      setIsDataLoaded(true)
    }

    loadDashboardData()
  }, [])

  // Show skeleton while data is loading
  if (!isDataLoaded) {
    return <SuperAdminDashboardSkeleton />
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newAdmin: Admin = {
      id: Date.now().toString(),
      ...newAdminForm,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setAdmins(prev => [...prev, newAdmin])
    setNewAdminForm({ name: '', email: '', role: 'admin' })

    toast({
      title: "Admin Added",
      description: `${newAdmin.name} has been added as ${newAdmin.role}.`,
    })

    setIsSubmitting(false)
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const toggleAdminStatus = async (adminId: string) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, isActive: !admin.isActive }
        : admin
    ))

    toast({
      title: "Admin Status Updated",
      description: "Admin status has been updated successfully.",
    })
  }

  const removeAdmin = async (adminId: string) => {
    setAdmins(prev => prev.filter(admin => admin.id !== adminId))
    
    toast({
      title: "Admin Removed",
      description: "Admin has been removed successfully.",
    })
  }
  const handleVerifyTransaction = async (txnId: string) => {
    setVerifyingTxn(txnId)
    
    try {
      console.log('Verifying transaction:', txnId)
      const result = await chapaService.verifyTransaction(txnId)
      
      console.log('Verification result:', result)
    
      if (result.status === 'success' && result.data) {
        const { status, amount, currency, reference, method } = result.data
      
        toast({
          title: "Transaction Verified Successfully! ✅",
          description: `Status: ${status.toUpperCase()} | Amount: ${amount} ${currency} | Method: ${method} | Ref: ${reference}`,
          duration: 5000,
        })
      } else if (result.status === 'failed') {
        toast({
          title: "Transaction Verification Failed ❌",
          description: result.message || 'Transaction not found or invalid',
          variant: "destructive",
          duration: 5000,
        })
      } else {
        toast({
          title: "Verification Response Received",
          description: `Status: ${result.status} | Message: ${result.message}`,
          variant: "default",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Verification failed'
    
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setVerifyingTxn(null)
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTransferring(true)

    try {
      const transferData = {
        amount: parseFloat(transferForm.amount),
        currency: 'ETB',
        account_name: transferForm.account_name,
        account_number: transferForm.account_number,
        bank_code: transferForm.bank_code,
        tx_ref: `TRANSFER-${Date.now()}`,
        reference: transferForm.reference || `Transfer to ${transferForm.account_name}`
      }

      const response = await chapaService.initializeTransfer(transferData)
      
      toast({
        title: "Transfer Initiated Successfully! 💸",
        description: `Transfer of ${transferForm.amount} ETB to ${transferForm.account_name} has been processed.`,
      })

      setTransferForm({
        amount: '',
        account_name: '',
        account_number: '',
        bank_code: '',
        reference: ''
      })

    } catch (error) {
      console.error('Transfer error:', error)
      toast({
        title: "Demo Mode Active",
        description: "Transfer simulation completed. In production, this would process a real transfer through Chapa API.",
        variant: "default"
      })
      
      // Still reset form in demo mode
      setTransferForm({
        amount: '',
        account_name: '',
        account_number: '',
        bank_code: '',
        reference: ''
      })
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Super Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-[#7DC400]">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">Super Admin Panel</span>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalPayments.toLocaleString()} ETB</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#7DC400]" />
              Admin Management
            </CardTitle>
            <CardDescription>Add and manage admin users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Admin Form */}
            <form onSubmit={handleAddAdmin} className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium">Add New Admin</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'super_admin' }))}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#7DC400] hover:bg-[#6bb000]"
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : 'Add Admin'}
              </Button>
            </form>

            {/* Admin List */}
            <div className="space-y-3">
              <h4 className="font-medium">Current Admins</h4>
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                      <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                        {admin.role.replace('_', ' ')}
                      </Badge>
                      <Badge variant={admin.isActive ? "default" : "secondary"}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={admin.isActive}
                      onCheckedChange={() => toggleAdminStatus(admin.id)}
                    />
                    {admin.role !== 'super_admin' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeAdmin(admin.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transfer Management */}
        <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Your latest payment activities (Try verifying different transactions to see real API responses)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(transaction.status)}
                            <div>
                              <p className="font-medium text-sm text-foreground">{transaction.user}</p>
                              <p className="font-medium text-sm text-foreground">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                              <p className="text-xs text-muted-foreground font-mono">{transaction.reference}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">{transaction.amount} {transaction.currency}</p>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyTransaction(transaction.reference)}
                                disabled={verifyingTxn === transaction.reference}
                                className="text-xs h-6"
                              >
                                {verifyingTxn === transaction.reference ? (
                                  <LoadingSpinner size="xs" />
                                ) : (
                                  'Verify'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
      </div>
    </div>
  )
}
