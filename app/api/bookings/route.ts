import { NextRequest, NextResponse } from 'next/server'

interface BookingRequestBody {
  name: string
  email: string
  phone: string
  selectedTest?: string
  symptoms?: string
  timeSlot: string
  serviceId: string
  location?: string 
  treatmentLocation?: 'clinic' | 'home' 
  doctorName: string
  doctorEmail: string
  doctorWhatsApp: string
  serviceName: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequestBody = await request.json()

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.timeSlot ||
      !body.serviceId
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare booking data
    const bookingData = {
      id: `BOOKING-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    }

    console.log('Booking data:', bookingData)

    // Send confirmation email
    await sendConfirmationEmail(body)

    // Send WhatsApp notification to doctor
    await sendWhatsAppNotification(body)

    return NextResponse.json(
      {
        success: true,
        message: 'Booking confirmed and notifications sent',
        bookingId: bookingData.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
}

async function sendConfirmationEmail(booking: BookingRequestBody) {
  try {
    const emailData = {
      to: booking.email,
      subject: `Appointment Confirmation - ${booking.serviceName}`,
      body: `
Dear ${booking.name},

Your appointment has been successfully booked.

Service: ${booking.serviceName}
Date & Time: ${booking.timeSlot}
Doctor: ${booking.doctorName}

${booking.selectedTest ? `Selected Option: ${booking.selectedTest}` : ''}
${booking.symptoms ? `Details/Symptoms: ${booking.symptoms}` : ''}
${booking.location ? `Location/Address: ${booking.location}` : ''}
${booking.treatmentLocation ? `Treatment Location: ${booking.treatmentLocation === 'clinic' ? 'At the Clinic' : 'Home Service'}` : ''}

You will receive further communication from our team shortly.

Best regards,
Buburuebi Healthcare Team
      `,
    }

    console.log('Email to be sent:', emailData)

    // TODO: Implement actual email sending with nodemailer or Resend
    // Example with Resend:
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Buburuebi Healthcare <noreply@buburuebihealthcare.com>',
    //   to: booking.email,
    //   subject: emailData.subject,
    //   text: emailData.body,
    // })

    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

async function sendWhatsAppNotification(booking: BookingRequestBody) {
  try {
    const message = `
📋 *New Appointment Booking*

*Patient Information:*
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}

*Service Details:*
Service: ${booking.serviceName}
Time Slot: ${booking.timeSlot}

${booking.selectedTest ? `*Selected Option:* ${booking.selectedTest}\n` : ''}
${booking.symptoms ? `*Details/Symptoms:* ${booking.symptoms}\n` : ''}
${booking.location ? `*Address:* ${booking.location}\n` : ''}
${booking.treatmentLocation ? `*Treatment Location:* ${booking.treatmentLocation === 'clinic' ? 'At the Clinic' : 'Home Service'}\n` : ''}

*Booking ID:* BOOKING-${Date.now()}
    `

    console.log('WhatsApp message to be sent to:', booking.doctorWhatsApp)
    console.log('Message:', message)

    // TODO: Implement WhatsApp Business API integration
    // Option 1: Official WhatsApp Business API via Meta
    // Option 2: Third-party services like Twilio, MessageBird, or Wati
    
    // Example with Meta's WhatsApp Business API:
    // const response = await fetch(
    //   `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       messaging_product: 'whatsapp',
    //       to: booking.doctorWhatsApp,
    //       type: 'text',
    //       text: { body: message },
    //     }),
    //   }
    // )

    return true
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return false
  }
}