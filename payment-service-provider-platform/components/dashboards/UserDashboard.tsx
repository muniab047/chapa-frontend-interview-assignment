"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Wallet, Send, CheckCircle, Clock, XCircle, TrendingUp, ExternalLink, AlertCircle, CheckCircle2, Copy, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Eye, EyeOff } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { chapaService } from '@/services/chapaService'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'success' | 'pending' | 'failed'
  description: string
  date: string
  reference: string
}

export function UserDashboard() {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [walletBalance] = useState(15750.50)
  const [totalTransactions] = useState(47)
  const [pendingPayments] = useState(3)
  const [weeklyUsage] = useState(43)
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 500.00,
      currency: 'ETB',
      status: 'success',
      description: 'Payment to Merchant ABC',
      date: '2024-01-15',
      reference: 'John-Doe-1754527913281'
    },
    {
      id: '2',
      amount: 250.00,
      currency: 'ETB',
      status: 'pending',
      description: 'Transfer to John Doe',
      date: '2024-01-14',
      reference: 'invalid-transaction-ref'
    },
    {
      id: '3',
      amount: 1000.00,
      currency: 'ETB',
      status: 'failed',
      description: 'Payment to Service XYZ',
      date: '2024-01-13',
      reference: 'failed-payment-123'
    }
  ])

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verifyingTxn, setVerifyingTxn] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<{
    checkoutUrl: string
    txRef: string
  } | null>(null)
  const { toast } = useToast()
  const [showBalance, setShowBalance] = useState(true)

  // Simulate data loading
  useEffect(() => {

    const handleMessage = async (event : MessageEvent) => {
      if (event.data?.payment === 'completed') {

        window.location.reload();
      }
    };

  
    const loadDashboardData = async () => {
      // Simulate API calls for dashboard data
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsDataLoaded(true)
    }
    window.addEventListener('message', handleMessage);
    loadDashboardData()
    return () => window.removeEventListener('message', handleMessage);

  }, [])

  // Show skeleton while data is loading
  if (!isDataLoaded) {
    return <DashboardSkeleton />
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setPaymentError(null)
    setPaymentSuccess(null)

    try {
      const txRef = `John-Doe-${Date.now()}`
      
      const paymentData = {
        amount: parseFloat(paymentForm.amount),
        currency: 'ETB',
        email: paymentForm.email,
        first_name: paymentForm.firstName,
        last_name: paymentForm.lastName,
        phone_number: paymentForm.phoneNumber,
        tx_ref: txRef,
        callback_url: `${window.location.origin}/payment-success`,
        return_url: `${window.location.origin}/payment-success`,
        description: paymentForm.description || 'Payment via Chapa Dashboard',
        customization: {
          title: 'Chapa Dashboard Payment',
          description: paymentForm.description || 'Payment via Chapa Dashboard'
        },
        meta: {
          hide_receipt: 'false'
        }
      }

      console.log('Submitting payment with data:', paymentData)

      // Store payment info for success page fallback
      localStorage.setItem('lastPaymentInfo', JSON.stringify({
        tx_ref: txRef,
        amount: paymentData.amount,
        currency: paymentData.currency,
        email: paymentData.email,
        description: paymentData.description,
      }))


      const response = await chapaService.initializePayment(paymentData)
      
      if (response.status === 'success' && response.data?.checkout_url) {
        setPaymentSuccess({
          checkoutUrl: response.data.checkout_url,
          txRef: txRef
        })
        
        toast({
          title: "Payment Link Generated! 🎉",
          description: `Payment of ${paymentForm.amount} ETB initialized successfully. Click the button below to proceed to payment.`,
          duration: 8000,
        })

        setPaymentForm({
          amount: '',
          email: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          description: ''
        })
        
      } else {
        throw new Error(response.message || 'Failed to initialize payment')
      }

    } catch (error) {
      console.error('Payment error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setPaymentError(errorMessage)
      
      toast({
        title: "Payment Initialization Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
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

  const openPaymentLink = (url: string) => {
    const newWindow = window.open(url, '_blank', 'width=600,height=700')
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups for this site or copy the payment link below.",
        variant: "destructive",
        duration: 8000,
      })
    } else {
      toast({
        title: "Payment Window Opened",
        description: "Complete your payment in the new tab that opened.",
        duration: 5000,
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Payment Link Copied! 📋",
        description: "You can paste this link in a new browser tab to complete payment.",
        duration: 5000,
      })
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the payment link.",
        variant: "destructive",
        duration: 3000,
      })
    })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Top Section - Main Balance and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="lg:col-span-1">
          <Card className="card-gradient text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Main Balance</p>
                    <p className="text-3xl font-bold">
                      {showBalance ? `$${walletBalance.toLocaleString()}` : '••••••••'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    {showBalance ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-white/20 rounded"></div>
                    <div className="w-8 h-5 bg-white/30 rounded"></div>
                  </div>
                  <div className="text-sm opacity-90">
                    **** **** **** 1234
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="opacity-75">VALID THRU</p>
                    <p className="font-medium">08/21</p>
                  </div>
                  <div>
                    <p className="opacity-75">CARD HOLDER</p>
                    <p className="font-medium">Franklin Jr.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Limit Card */}
          <Card className="mt-4 bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Limit</p>
                  <p className="text-xl font-bold text-foreground">
                    {showBalance ? '$4,000' : '••••••'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {showBalance ? '/$10,000' : '/••••••'}
                  </p>
                </div>
                <div className="w-12 h-16 bg-gradient-to-t from-[#7DC400] to-[#7DC400]/30 rounded-lg relative">
                  <div className="absolute bottom-0 w-full h-8 bg-[#7DC400] rounded-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Transactions */}
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    4% (30 days)
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-2">{totalTransactions}</p>
                <div className="h-8 flex items-end space-x-1">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#7DC400] rounded-sm opacity-70"
                      style={{ height: `${Math.random() * 100 + 20}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Payments */}
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <div className="flex items-center text-xs text-red-500">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    2% (30 days)
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-2">{pendingPayments}</p>
                <div className="h-8 flex items-end space-x-1">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-orange-400 rounded-sm opacity-70"
                      style={{ height: `${Math.random() * 60 + 10}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Wallet Usage */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Wallet Usage</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">{weeklyUsage}%</span>
                    <span className="text-sm text-muted-foreground ml-2">from last week</span>
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  4% (30 days)
                </div>
              </div>
              <div className="h-16 relative">
                <div className="absolute inset-0 chart-area rounded-lg"></div>
                <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end space-x-1">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#7DC400] rounded-sm opacity-60"
                      style={{ height: `${Math.random() * 100 + 20}%` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Payment Form and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-[#7DC400]" />
              Initialize Payment
            </CardTitle>
            <CardDescription>
              Create a payment link using Chapa API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Payment Success Alert */}
            {paymentSuccess && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium text-green-800 dark:text-green-200">Payment link generated successfully!</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Transaction Reference: {paymentSuccess.txRef}</p>
                    
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment Link:</p>
                      <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all mb-2">
                        {paymentSuccess.checkoutUrl}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => openPaymentLink(paymentSuccess.checkoutUrl)}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Payment Page
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(paymentSuccess.checkoutUrl)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                    
                    <div className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 p-2 rounded">
                      💡 <strong>Tip:</strong> If the payment page doesn't open, try copying the link and opening it in a new browser tab.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Error Alert */}
            {paymentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Payment initialization failed</p>
                    <p className="text-sm">{paymentError}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={paymentForm.firstName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={paymentForm.lastName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={paymentForm.email}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={paymentForm.phoneNumber}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="0912345678"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETB) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Payment description"
                  disabled={isSubmitting}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#7DC400] hover:bg-[#6bb000]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Initializing Payment...</span>
                  </>
                ) : (
                  'Initialize Payment'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
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
