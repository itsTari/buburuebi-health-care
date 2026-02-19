// Types for the booking system

export type ServiceType =
  | 'laboratory'
  | 'dental'
  | 'consultation'
  | 'prescription'
  | 'treatment'
  | 'home'

export interface TestOption {
  id: string
  label: string
  value: string
  description?: string
}

export interface BookingService {
  id: string
  name: string
  type: ServiceType
  description: string
  doctorName: string
  doctorEmail: string
  doctorWhatsApp: string
  availableSlots: string[]
  testOptions?: TestOption[]
  depositAmount?: number   // for home service
  consultationFee?: number // for display in payment step
}

export interface BookingFormData {
  name: string
  email: string
  phone: string
  selectedTest?: string
  symptoms?: string
  timeSlot: string
  serviceId: string
  location?: string      
  treatmentLocation?: 'clinic' | 'home' // for treatment service
}

export interface BookingStep {
  step: 1 | 2 | 3
  isCompleted: boolean
}

export interface BookingState {
  currentStep: 1 | 2 | 3
  formData: Partial<BookingFormData>
  hasSelectedTest: boolean
  hasInputSymptoms: boolean
  paymentCompleted: boolean
}