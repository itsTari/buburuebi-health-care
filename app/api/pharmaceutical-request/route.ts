import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'
import { companyContact } from '@/constants'
import path from 'path'
import { existsSync } from 'fs'

interface PharmaceuticalRequestBody {
  name: string
  email: string
  phone: string
  drugNames: string
  deliveryAddress: string
  additionalNotes?: string
  hasImage: boolean
  imageUrl?: string
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

    // Prepare request data
    const requestData = {
      id: `PHARMA-${Date.now()}`,
      ...body,
      status: 'pending',
    }

    console.log('Pharmaceutical request received:', requestData)

    // Send confirmation email to customer
    await sendCustomerEmail(body)

    // Send notification email to pharmacy with attachment
    await sendPharmacyEmail(body)

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

async function sendCustomerEmail(request: PharmaceuticalRequestBody) {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px;}
    .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .footer { color: #666; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Drug Request Received<br/>B.B.H CARE'S CLINIC</h2>
    </div>
    
    <div class="content">
      <p>Dear ${request.name},</p>
      
      <p>Thank you for your drug request. We have received your order and our pharmacist will contact you shortly via WhatsApp.</p>
      
      <h3>Request Details:</h3>
      <ul>
        <li><strong>Drug(s) Requested:</strong> ${request.drugNames}</li>
        <li><strong>Delivery Address:</strong> ${request.deliveryAddress}</li>
        ${request.additionalNotes ? `<li><strong>Additional Notes:</strong> ${request.additionalNotes}</li>` : ''}
      </ul>
      
      <p>Our pharmacist will send you pricing and availability details within 30 minutes.</p>
      
      <p>You can also reach us at:</p>
      <ul>
        <li>WhatsApp: ${companyContact.whatsAppNumber}</li>
        <li>Phone: ${companyContact.phone}</li>
        <li>Email: ${companyContact.email}</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>Best regards,<br/>B.B.H CARE'S CLINIC TEAM</p>
    </div>
  </div>
</body>
</html>
    `

    await sendEmail({
      to: request.email,
      subject: "Drug Request Received <br/> B.B.H CARE'S CLINIC",
      html: html,
    })

    console.log('Customer confirmation email sent to:', request.email)
    return true
  } catch (error) {
    console.error('Customer email sending error:', error)
    return false
  }
}

async function sendPharmacyEmail(request: PharmaceuticalRequestBody) {
  try {
    const attachments: Array<{ filename: string; path: string }> = []

    // Add image attachment if available
    if (request.imageUrl) {
      const filename = request.imageUrl.split('/').pop() || 'prescription.jpg'
      const uploadPath = path.join(process.cwd(), 'public', request.imageUrl.replace(/^\//, ''))

      // Check if file exists before attaching
      if (existsSync(uploadPath)) {
        attachments.push({
          filename: filename,
          path: uploadPath,
        })
        console.log('Image attached:', uploadPath)
      } else {
        console.warn('Image file not found:', uploadPath)
      }
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .section { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #ddd; }
    .section:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #0066cc; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 New Drug Request</h2>
    </div>
    
    <div class="content">
      <div class="section">
        <h3>Customer Information:</h3>
        <p><span class="label">Name:</span> ${request.name}</p>
        <p><span class="label">Email:</span> ${request.email}</p>
        <p><span class="label">Phone:</span> ${request.phone}</p>
      </div>
      
      <div class="section">
        <h3>Drug Request Details:</h3>
        <p><span class="label">Drug(s) Requested:</span></p>
        <p style="white-space: pre-wrap;">${request.drugNames}</p>
      </div>
      
      <div class="section">
        <h3>Delivery Information:</h3>
        <p><span class="label">Delivery Address:</span></p>
        <p style="white-space: pre-wrap;">${request.deliveryAddress}</p>
      </div>
      
      ${request.additionalNotes ? `
      <div class="section">
        <h3>Additional Notes:</h3>
        <p style="white-space: pre-wrap;">${request.additionalNotes}</p>
      </div>
      ` : ''}

      ${request.imageUrl ? `
      <div class="section">
        <p><span class="label">📷 Prescription/Drug Photo:</span> Attached to this email</p>
      </div>
      ` : ''}

      <div class="section">
        <p><strong>Request ID:</strong> PHARMA-${Date.now()}</p>
        <p><strong>Requested At:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
      </div>
    </div>
    
    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
      <p><strong>Action Required:</strong></p>
      <p>Please contact the customer via WhatsApp at <strong>+${request.phone}</strong> to discuss pricing and delivery arrangements.</p>
    </div>
  </div>
</body>
</html>
    `

    await sendEmail({
      to: companyContact.email,
      subject: `🔔 New Drug Request from ${request.name}`,
      html: html,
      attachments: attachments, // Nodemailer will attach the file
    })

    console.log('Pharmacy notification email sent successfully with', attachments.length, 'attachment(s)')
    return true
  } catch (error) {
    console.error('Pharmacy email sending error:', error)
    return false
  }
}