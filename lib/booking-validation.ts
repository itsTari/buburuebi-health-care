import * as z from 'zod'

export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').refine(
    (phone) => {
      // Remove spaces, dashes, parentheses, and + sign
      const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
      return /^\d{11,15}$/.test(cleaned)
    },
    { message: 'Phone number must be 11-15 digits' }
  ),
  selectedTest: z.string().optional(),
  symptoms: z.string().optional(),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  serviceId: z.string(),
  location: z.string().optional(),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
