// Utility functions for booking system

import { BookingFormData } from '@/lib/booking-types'

export interface BookingConfirmation {
  bookingId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  selectedTest?: string
  symptoms?: string
  timeSlot: string
  doctorName: string
  doctorEmail: string
  doctorWhatsApp: string
  createdAt: string
}

/**
 * Generates a unique booking ID
 */
export const generateBookingId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `BK-${timestamp}-${random}`
}

/**
 * Formats booking confirmation email content
 */
export const generateEmailContent = (
  booking: BookingConfirmation
): { subject: string; html: string } => {
  return {
    subject: `Appointment Confirmation - ${booking.serviceName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { padding: 20px; border: 1px solid #ddd; }
            .booking-details { background-color: #f0f4f8; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .label { font-weight: bold; color: #1e40af; }
            .footer { background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.customerName},</p>
              
              <p>Thank you for booking an appointment with Buburuebi Healthcare. Your appointment has been successfully confirmed.</p>
              
              <div class="booking-details">
                <h3 style="color: #1e40af; margin-top: 0;">Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Booking ID:</span>
                  <span>${booking.bookingId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span>${booking.serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Doctor:</span>
                  <span>${booking.doctorName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Appointment Time:</span>
                  <span>${booking.timeSlot}</span>
                </div>
                ${
                  booking.selectedTest
                    ? `
                  <div class="detail-row">
                    <span class="label">Selected Test:</span>
                    <span>${booking.selectedTest}</span>
                  </div>
                  `
                    : ''
                }
                ${
                  booking.symptoms
                    ? `
                  <div class="detail-row">
                    <span class="label">Symptoms/Concerns:</span>
                    <span>${booking.symptoms}</span>
                  </div>
                  `
                    : ''
                }
              </div>
              
              <p>Your appointment details have been sent to Dr. ${booking.doctorName} via WhatsApp for confirmation.</p>
              
              <p>If you need to reschedule or have any questions, please contact us:</p>
              <ul>
                <li>Email: ${booking.doctorEmail}</li>
                <li>WhatsApp: +${booking.doctorWhatsApp}</li>
              </ul>
              
              <p>We look forward to seeing you soon!</p>
              
              <p>Best regards,<br/>
              <strong>Buburuebi Healthcare Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Buburuebi Healthcare Services. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

/**
 * Generates WhatsApp message for doctor
 */
export const generateWhatsAppMessage = (
  booking: BookingConfirmation
): string => {
  return `📋 *New Appointment Booking*

*Patient Information:*
Name: ${booking.customerName}
Email: ${booking.customerEmail}
Phone: ${booking.customerPhone}

*Appointment Details:*
Service: ${booking.serviceName}
Time Slot: ${booking.timeSlot}
Booking ID: ${booking.bookingId}

${
  booking.selectedTest
    ? `*Selected Test:*
${booking.selectedTest}

`
    : ''
}${
    booking.symptoms
      ? `*Symptoms/Concerns:*
${booking.symptoms}

`
      : ''
  }*Booking Confirmation:*
This appointment has been confirmed in the system.
Please contact the patient to confirm or discuss any details.`
}

/**
 * Validates booking data
 */
export const validateBookingData = (
  data: Partial<BookingFormData>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email address')
  }

  if (!data.phone || data.phone.trim().length < 10) {
    errors.push('Phone must be at least 10 characters')
  }

  if (!data.timeSlot || data.timeSlot.trim().length === 0) {
    errors.push('Time slot must be selected')
  }

  if (!data.selectedTest && !data.symptoms) {
    errors.push('Either select a test or describe your symptoms')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Formats webhook event for booking confirmation
 */
export const createBookingWebhookEvent = (
  booking: BookingConfirmation
) => {
  return {
    event: 'booking.confirmed',
    timestamp: new Date().toISOString(),
    data: booking,
  }
}
