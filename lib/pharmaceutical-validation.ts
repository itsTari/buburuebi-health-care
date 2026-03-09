import * as z from 'zod'
// Validation schema
export const pharmaceuticalSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').refine(
    (phone) => {
      const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
      return /^\d{10,15}$/.test(cleaned)
    },
    { message: 'Phone number must be 10-15 digits' }
  ),
  drugNames: z.string().min(5, 'Please enter at least one drug name'),
  deliveryAddress: z.string().min(10, 'Please enter your complete delivery address'),
  additionalNotes: z.string().optional(),
})

export type PharmaceuticalFormValues = z.infer<typeof pharmaceuticalSchema>