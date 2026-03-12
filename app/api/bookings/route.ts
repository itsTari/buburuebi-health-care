import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'

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
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px; text-align: center;}
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .detail { margin: 10px 0; }
    .label { font-weight: bold; color: #0066cc; }
    .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Appointment Confirmed \n B.B.H CARE'S CLINIC</h2>
    </div>
    
    <div class="content">
      <p>Dear ${booking.name},</p>
      
      <p>Your appointment has been successfully booked. We look forward to seeing you!</p>
      
      <h3>Appointment Details:</h3>
      <div class="detail"><span class="label">Service:</span> ${booking.serviceName}</div>
      <div class="detail"><span class="label">Date & Time:</span> ${booking.timeSlot}</div>
      <div class="detail"><span class="label">Doctor:</span> ${booking.doctorName}</div>
      ${booking.selectedTest ? `<div class="detail"><span class="label">Selected Option:</span> ${booking.selectedTest}</div>` : ''}
      ${booking.symptoms ? `<div class="detail"><span class="label">Details/Symptoms:</span> ${booking.symptoms}</div>` : ''}
      ${booking.location ? `<div class="detail"><span class="label">Location:</span> ${booking.location}</div>` : ''}
      ${booking.treatmentLocation ? `<div class="detail"><span class="label">Treatment Location:</span> ${booking.treatmentLocation === 'clinic' ? 'At the Clinic' : 'Home Service'}</div>` : ''}
      
      <p style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 5px;">
        <strong>📞 Expected Contact:</strong> Our doctor will contact you shortly via WhatsApp or phone to confirm final details.
      </p>
      
      <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
    </div>
    
    <div class="footer">
      <p>Best regards,<br/> B.B.H CARE'S CLINIC TEAM</p>
    </div>
  </div>
</body>
</html>
    `

    await sendEmail({
      to: booking.email,
      subject: `Appointment Confirmation \n ${booking.serviceName}`,
      html: html,
    })

    console.log('Confirmation email sent to:', booking.email)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

async function sendWhatsAppNotification(booking: BookingRequestBody) {
  try {
    const message = `
 *New Appointment Booking*

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

    return true
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return false
  }
}