import * as z from 'zod'

export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), {
    message: 'Phone number must be between 10 and 15 digits',
  }),
  selectedTest: z.string().optional(),
  symptoms: z.string().optional(),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  serviceId: z.string(),
  location: z.string().optional(),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
