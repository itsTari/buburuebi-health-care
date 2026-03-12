import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'

interface EmailAttachment {
  filename: string
  path?: string
  content?: Buffer | string
  contentType?: string
}

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  attachments?: EmailAttachment[]
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendEmail({ to, subject, html, attachments }: SendEmailOptions) {
  try {
    const mailOptions: SendMailOptions = {
      from: `"Buburuebi Healthcare" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    }

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments
    }

    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}