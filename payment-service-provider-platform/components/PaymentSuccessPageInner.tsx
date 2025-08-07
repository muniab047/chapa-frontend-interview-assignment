"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, ArrowLeft, ExternalLink, Copy, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import { InteractiveLoading } from '@/components/ui/interactive-loading'
import { chapaService } from '@/services/chapaService'

interface PaymentResult {
  trx_ref: string
  ref_id: string
  status: 'success' | 'pending' | 'failed'
  amount?: number
  currency?: string
  method?: string
  created_at?: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasShownToast, setHasShownToast] = useState(false)

  useEffect(() => {
    const processPaymentResult = async () => {
      // Get payment result from URL parameters (callback from Chapa)
      const trx_ref = searchParams.get('trx_ref')
      const ref_id = searchParams.get('ref_id') 
      const status = searchParams.get('status') as 'success' | 'pending' | 'failed'

      // If we have URL parameters from Chapa callback
      if (trx_ref && ref_id && status) {
        console.log('Payment callback received:', { trx_ref, ref_id, status })
        
        const result: PaymentResult = {
          trx_ref,
          ref_id,
          status
        }
        
        setPaymentResult(result)
        
        // Show success toast only once
        if (!hasShownToast) {
          if (status === 'success') {
            toast({
              title: "Payment Successful! 🎉",
              description: `Your payment has been processed successfully. Transaction ID: ${ref_id}`,
              duration: 5000,
            })
          } else if (status === 'pending') {
            toast({
              title: "Payment Pending ⏳",
              description: `Your payment is being processed. Transaction ID: ${ref_id}`,
              duration: 5000,
            })
          } else if (status === 'failed') {
            toast({
              title: "Payment Failed ❌",
              description: `Your payment could not be processed. Transaction ID: ${ref_id}`,
              variant: "destructive",
              duration: 5000,
            })
          }
          setHasShownToast(true)
        }

        // Verify the transaction to get full details using the exact trx_ref from callback
        await verifyTransaction(trx_ref)
      } else {
        // No URL parameters - check if we have stored payment info from the payment initialization
        const storedPaymentInfo = localStorage.getItem('lastPaymentInfo')
        
        if (storedPaymentInfo) {
          try {
            const paymentInfo = JSON.parse(storedPaymentInfo)
            console.log('Using stored payment info:', paymentInfo)
            
            const result: PaymentResult = {
              trx_ref: paymentInfo.tx_ref,
              ref_id: paymentInfo.tx_ref, // Use tx_ref as ref_id for demo
              status: 'success' // Assume success for demo
            }
            
            setPaymentResult(result)
            
            if (!hasShownToast) {
              toast({
                title: "Payment Completed! 🎉",
                description: `Payment processing completed. Transaction: ${paymentInfo.tx_ref}`,
                duration: 5000,
              })
              setHasShownToast(true)
            }
            
            // Try to verify with the stored transaction reference
            await verifyTransaction(paymentInfo.tx_ref)
          } catch (error) {
            console.error('Error parsing stored payment info:', error)
            // Fallback to redirect
            router.push('/')
            return
          }
        } else {
          // No stored info either - redirect to dashboard
          console.log('No payment information found, redirecting to dashboard')
          router.push('/')
          return
        }
      }
      
      setIsLoading(false)
    }

    // Add a small delay to show the loading state
    setTimeout(processPaymentResult, 1500)
  }, [searchParams, router, toast, hasShownToast])

  const verifyTransaction = async (txRef: string) => {
    if (isVerifying) return // Prevent multiple simultaneous verification calls
    
    setIsVerifying(true)
    setVerificationError(null)

    try {
      console.log('Verifying transaction with exact txRef:', txRef)
      const response = await chapaService.verifyTransaction(txRef)
      console.log('Verification response:', response)
    
      if (response.status === 'success' && response.data) {
        const verifiedData = response.data
        console.log('Verified transaction data:', verifiedData)
        
        // Update payment result with EXACT data from API response
        setPaymentResult(prev => prev ? {
          ...prev,
          // Use exact values from API response
          amount: verifiedData.amount,
          currency: verifiedData.currency,
          method: verifiedData.method,
          created_at: verifiedData.created_at,
          status: verifiedData.status as 'success' | 'pending' | 'failed',
          // Keep original references from callback/stored data
          trx_ref: prev.trx_ref,
          ref_id: verifiedData.reference || prev.ref_id
        } : null)

        // Check if this is demo mode
        const isDemoMode = response.message?.includes('Demo Mode') || false

        // Show verification toast only once
        if (verifiedData.status === 'success' && !hasShownToast) {
          toast({
            title: isDemoMode ? "Payment Verified (Demo Mode)! ✅" : "Payment Verified Successfully! ✅",
            description: `Amount: ${verifiedData.amount} ${verifiedData.currency} | Method: ${verifiedData.method}`,
            duration: 5000,
          })
        }
      } else {
        // Verification failed but don't show error toast repeatedly
        console.log('Verification failed:', response.message)
        setVerificationError(response.message || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Verification failed'
      setVerificationError(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Transaction reference copied to clipboard",
      duration: 2000,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
    }
  }
  const handleGoToDashboard = () => {
    // Send message to the opener (your main window)
    console.log('Sending payment completed message to opener')
   
    // Close the current tab (Chapa tab)
    window.close();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
      case 'failed':
        return <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      default:
        return <RefreshCw className="h-8 w-8 text-gray-600 dark:text-gray-400" />
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7DC400]/10 to-[#5a9000]/10 dark:from-[#7DC400]/5 dark:to-[#5a9000]/5">
        <div className="text-center space-y-6">
          {/* Chapa Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/chapa-logo.png" 
              alt="Chapa Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          
          {/* Interactive Loading */}
          <div className="space-y-4">
            <InteractiveLoading size="lg" />
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Processing payment result...</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Please wait while we verify your transaction</p>
          </div>
        </div>
      </div>
    )
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500 dark:text-red-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Result Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find the payment information.</p>
          <Button onClick={() => handleGoToDashboard} className="bg-[#7DC400] hover:bg-[#6bb000]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {getStatusIcon(paymentResult.status)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payment {paymentResult.status === 'success' ? 'Successful' : 
                    paymentResult.status === 'pending' ? 'Processing' : 'Failed'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {paymentResult.status === 'success' ? 'Your payment has been processed successfully' :
             paymentResult.status === 'pending' ? 'Your payment is being processed' :
             'There was an issue processing your payment'}
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              Payment Details
              <Badge className={getStatusColor(paymentResult.status)}>
                {paymentResult.status.toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Transaction information and verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transaction Reference */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Reference</p>
                <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{paymentResult.trx_ref}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(paymentResult.trx_ref)}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Chapa Reference */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Chapa Reference ID</p>
                <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{paymentResult.ref_id}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(paymentResult.ref_id)}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Amount and Currency */}
            {paymentResult.amount && paymentResult.currency && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</p>
                <p className="text-2xl font-bold text-[#7DC400] dark:text-[#8DD500]">
                  {paymentResult.amount} {paymentResult.currency}
                </p>
              </div>
            )}

            {/* Payment Method */}
            {paymentResult.method && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</p>
                <p className="text-lg capitalize text-gray-900 dark:text-gray-100">{paymentResult.method}</p>
              </div>
            )}

            {/* Transaction Date */}
            {paymentResult.created_at && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Date</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  {new Date(paymentResult.created_at).toLocaleString()}
                </p>
              </div>
            )}

            {/* Verification Status */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Verification Status</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {isVerifying ? 'Verifying transaction...' :
                     verificationError ? 'Verification failed' :
                     paymentResult.amount ? 'Verified successfully' : 'Pending verification'}
                  </p>
                </div>
                {isVerifying && <InteractiveLoading size="sm" />}
              </div>
              
              {verificationError && (
                <div className="mt-2">
                  <p className="text-sm text-red-600 dark:text-red-400">{verificationError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => verifyTransaction(paymentResult.trx_ref)}
                    className="mt-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    disabled={isVerifying}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Verification
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.close()}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
       
          
          {paymentResult.status === 'failed' && (
            <Button
              onClick={() => router.push('/')}
              className="bg-[#7DC400] hover:bg-[#6bb000] text-white"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
