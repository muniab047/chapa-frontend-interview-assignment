// Chapa API Service - Backend Proxy Implementation
// This service makes requests to our Next.js API routes which proxy to Chapa API
// This avoids CORS issues and keeps the secret key secure on the server

import { BASE_URL } from "@/app/core/const/constane"

interface PaymentData {
  amount: number
  currency: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  tx_ref: string
  callback_url: string
  return_url: string
  description?: string
  customization?: {
    title?: string
    description?: string
  }
  meta?: {
    hide_receipt?: string
  }
}

interface TransferData {
  amount: number
  currency: string
  account_name: string
  account_number: string
  bank_code: string
  tx_ref: string
  reference?: string
}

interface ApiResponse<T = any> {
  message: string
  status: 'success' | 'failed'
  data: T | null
  error_type?: string
  status_code?: number
}

interface PaymentResponse {
  checkout_url: string
}

interface VerificationResponse {
  first_name: string
  last_name: string
  email: string
  currency: string
  amount: number
  charge: number
  mode: string
  method: string
  type: string
  status: string
  reference: string
  tx_ref: string
  customization: {
    title: string
    description: string
    logo: string | null
  }
  meta: any
  created_at: string
  updated_at: string
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

// Remove all mock data and fallbacks - use only real Chapa API responses

class ChapaService {
  private readonly baseUrl = BASE_URL
  private readonly secretKey = process.env.CHAPA_SECRET_KEY

  private async makeRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `/api/chapa${endpoint}`
    
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      console.log(`Making request to backend proxy: ${url}`)

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseText = await response.text()
      console.log(`Backend proxy response status: ${response.status}`)
      console.log(`Backend proxy response body: ${responseText}`)

      let data: ApiResponse<T>
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse backend response as JSON:', parseError)
        console.error('Response text was:', responseText.substring(0, 500))
        throw new Error(`Invalid JSON response from backend proxy`)
      }

      // Always return the response - let the calling code handle success/failure
      console.log('Backend proxy response received:', data)
      return data

    } catch (error) {
      console.error('Backend proxy request failed:', error)
      
      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - Please check your internet connection')
      } else if (error.name === 'AbortError') {
        throw new Error('Request timeout - Please try again')
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Unknown error occurred')
      }
    }
  }

  // 1. Initialize Payment Endpoint - NO MOCK DATA
  async initializePayment(paymentData: PaymentData): Promise<ApiResponse<PaymentResponse>> {
    try {
      console.log('Initializing payment via backend proxy (REAL CHAPA API):', paymentData)
      
      const response = await this.makeRequest<PaymentResponse>('/initialize', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      })
      
      console.log('Real Chapa payment initialization response:', response)
      return response
    } catch (error) {
      console.error('Real Chapa payment initialization failed:', error)
      throw error
    }
  }

  // 2. Verify Transaction Endpoint - NO MOCK DATA
  async verifyTransaction(txRef: string): Promise<ApiResponse<VerificationResponse>> {
    try {
      console.log('Verifying transaction via backend proxy (REAL CHAPA API):', txRef)
      
      const response = await this.makeRequest<VerificationResponse>(`/verify/${txRef}`, {
        method: 'GET',
      })
      
      console.log('Real Chapa transaction verification response:', response)
      
      // Return the real response regardless of success/failed status
      return response
    } catch (error) {
      console.error('Real Chapa transaction verification failed:', error)
      throw error
    }
  }

  // 3. Get Banks Endpoint - NO MOCK DATA
  async getBanks(): Promise<Bank[]> {
    try {
      console.log('Fetching banks via backend proxy (REAL CHAPA API)')
      
      const response = await this.makeRequest<any>('/banks', {
        method: 'GET',
      })
      
      console.log('Real Chapa banks response:', response)
      
      // Handle the real Chapa API response structure
      if (response.status === 'success' && response.data) {
        // Check if response.data is the banks array or contains banks
        let banksArray: Bank[] = []
        
        if (Array.isArray(response.data)) {
          banksArray = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          banksArray = response.data.data
        } else if (response.chapa_response && Array.isArray(response.chapa_response)) {
          banksArray = response.chapa_response
        } else {
          console.warn('Unexpected banks response structure from real Chapa API:', response)
          throw new Error('Unexpected response format from Chapa API')
        }
        
        console.log('Real Chapa banks fetched successfully:', banksArray.length, 'banks')
        return banksArray
      } else {
        // Real API returned failed status or no data
        console.error('Real Chapa API returned failed status:', response)
        throw new Error(response.message || 'Failed to fetch banks from Chapa API')
      }
    } catch (error) {
      console.error('Failed to fetch banks from real Chapa API:', error)
      throw error
    }
  }

  // Transfer endpoints - Keep as demo since transfer API may not be available in test mode
  async initializeTransfer(transferData: TransferData): Promise<ApiResponse<any>> {
    try {
      console.log('Transfer functionality - Demo mode (Transfer API not available in test environment):', transferData)
      
      // Note: Transfer API is typically not available in test mode
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return {
        message: 'Transfer initialized successfully (Demo Mode - Transfer API not available in test environment)',
        status: 'success',
        data: {
          transfer_id: `transfer_${Date.now()}`,
          tx_ref: transferData.tx_ref,
          status: 'pending',
          amount: transferData.amount,
          currency: transferData.currency
        }
      }
    } catch (error) {
      console.error('Transfer initialization failed:', error)
      throw error
    }
  }

  async verifyTransfer(txRef: string): Promise<ApiResponse<any>> {
    try {
      console.log('Transfer verification - Demo mode:', txRef)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        message: 'Transfer verified successfully (Demo Mode)',
        status: 'success',
        data: {
          tx_ref: txRef,
          status: 'success',
          amount: 1000,
          currency: 'ETB'
        }
      }
    } catch (error) {
      console.error('Transfer verification failed:', error)
      throw error
    }
  }

  // Health check method
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/chapa/banks', {
        method: 'HEAD',
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export const chapaService = new ChapaService()
