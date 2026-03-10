import { NextRequest, NextResponse } from 'next/server'

interface PharmaceuticalRequestBody {
  name: string
  email: string
  phone: string
  drugNames: string
  deliveryAddress: string
  additionalNotes?: string
  hasImage: boolean
  createdAt: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PharmaceuticalRequestBody = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.drugNames || !body.deliveryAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare request data for logging/database
    const requestData = {
      id: `PHARMA-${Date.now()}`,
      ...body,
      status: 'pending',
    }

    console.log('Pharmaceutical request received:', requestData)

    // TODO: Save to database
    // await db.pharmaceuticalRequests.create(requestData)

    // Send confirmation email (optional)
    await sendConfirmationEmail(body)

    return NextResponse.json(
      {
        success: true,
        message: 'Request received successfully',
        requestId: requestData.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Pharmaceutical request error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

async function sendConfirmationEmail(request: PharmaceuticalRequestBody) {
  try {
    const emailData = {
      to: request.email,
      subject: 'Drug Request Received - Buburuebi Healthcare',
      body: `
Dear ${request.name},

Thank you for your drug request. We have received your order and our pharmacist will contact you shortly via WhatsApp.

*Request Details:*
Drug(s): ${request.drugNames}
Delivery Address: ${request.deliveryAddress}
${request.additionalNotes ? `Notes: ${request.additionalNotes}` : ''}

Our pharmacist will send you pricing and availability details within 30 minutes.

Best regards,
Buburuebi Healthcare Pharmacy Team
      `,
    }

    console.log('Confirmation email to be sent:', emailData)

    // TODO: Implement actual email sending
    // await resend.emails.send({...})

    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}