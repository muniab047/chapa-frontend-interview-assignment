import { NextRequest, NextResponse } from 'next/server'

const CHAPA_SECRET_KEY = 'CHASECK_TEST-u5JhgpwYJoR1GYak6DXqzk14LW9dCGNO'
const CHAPA_BASE_URL = 'https://api.chapa.co/v1'

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    console.log('Backend: Initializing payment with Chapa API:', paymentData)
    
    // Prepare the exact payload that Chapa API expects
    const chapaPayload = {
      amount: paymentData.amount.toString(),
      currency: paymentData.currency,
      email: paymentData.email,
      first_name: paymentData.first_name,
      last_name: paymentData.last_name,
      phone_number: paymentData.phone_number || '',
      tx_ref: paymentData.tx_ref,
      callback_url: paymentData.callback_url,
      return_url: paymentData.return_url,
      'customization[title]': paymentData.customization?.title || 'Payment via Chapa Dashboard',
      'customization[description]': paymentData.customization?.description || paymentData.description || 'Online payment',
      'meta[hide_receipt]': paymentData.meta?.hide_receipt || 'false'
    }

    console.log('Backend: Sending to Chapa API:', chapaPayload)
    
    const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(chapaPayload),
    })

    const responseText = await response.text()
    console.log(`Backend: Payment initialization response status: ${response.status}`)
    console.log(`Backend: Payment initialization response body: ${responseText}`)

    if (!response.ok) {
      console.error(`Backend: Payment initialization error: ${response.status}`)
      return NextResponse.json(
        { 
          message: `Chapa API error: ${response.status} - ${response.statusText}`, 
          status: 'failed', 
          data: null,
          error_type: 'api_error',
          status_code: response.status,
          raw_response: responseText
        },
        { status: response.status }
      )
    }

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Backend: Failed to parse payment initialization response as JSON:', parseError)
      return NextResponse.json(
        { 
          message: 'Invalid JSON response from Chapa API', 
          status: 'failed', 
          data: null,
          error_type: 'parse_error',
          raw_response: responseText
        },
        { status: 500 }
      )
    }

    // Return exactly what Chapa API returns - no modifications
    console.log('Backend: Raw Chapa payment initialization response:', data)
    
    // Return the raw Chapa response
    return NextResponse.json(data)

  } catch (error) {
    console.error('Backend: Payment initialization error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        message: `Backend error: ${errorMessage}`, 
        status: 'failed', 
        data: null,
        error_type: 'backend_error'
      },
      { status: 500 }
    )
  }
}
