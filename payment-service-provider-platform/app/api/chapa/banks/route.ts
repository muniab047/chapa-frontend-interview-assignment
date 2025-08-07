import { NextRequest, NextResponse } from 'next/server'

const CHAPA_SECRET_KEY = 'CHASECK_TEST-u5JhgpwYJoR1GYak6DXqzk14LW9dCGNO'
const CHAPA_BASE_URL = 'https://api.chapa.co/v1'

export async function GET() {
  try {
    console.log('Backend: Fetching banks from Chapa API...')
    
    const response = await fetch(`${CHAPA_BASE_URL}/banks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    const responseText = await response.text()
    console.log(`Backend: Chapa API response status: ${response.status}`)
    console.log(`Backend: Chapa API response body: ${responseText}`)

    if (!response.ok) {
      console.error(`Backend: Chapa API Error: ${response.status}`)
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
      console.error('Backend: Failed to parse Chapa API response as JSON:', parseError)
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
    console.log(`Backend: Raw Chapa API response:`, data)
    
    return NextResponse.json({
      message: 'Banks fetched successfully from Chapa API',
      status: 'success',
      data: data, // Return raw Chapa response
      chapa_response: data // Also include original response for debugging
    })

  } catch (error) {
    console.error('Backend: Banks API error:', error)
    
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
