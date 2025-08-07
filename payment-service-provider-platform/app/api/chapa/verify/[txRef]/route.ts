import { NextRequest, NextResponse } from 'next/server'

const CHAPA_SECRET_KEY = 'CHASECK_TEST-u5JhgpwYJoR1GYak6DXqzk14LW9dCGNO'
const CHAPA_BASE_URL = 'https://api.chapa.co/v1'

export async function GET(
  request: NextRequest,
  { params }: { params: { txRef: string } }
) {
  try {
    const { txRef } = params
    console.log('Backend: Verifying transaction with Chapa API:', txRef)
    
    const response = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${txRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    const responseText = await response.text()
    console.log(`Backend: Transaction verification response status: ${response.status}`)
    console.log(`Backend: Transaction verification response body: ${responseText}`)

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Backend: Failed to parse transaction verification response as JSON:', parseError)
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

    // Return exactly what Chapa API returns - both success and failed responses
    console.log('Backend: Raw Chapa verification response:', data)
    
    // Return the raw Chapa response regardless of success/failure
    return NextResponse.json(data)

  } catch (error) {
    console.error('Backend: Transaction verification error:', error)
    
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
