import { useState } from 'react'
import { BookingFormData, BookingState } from '@/lib/booking-types'

export const useBooking = () => {
  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: 1,
    formData: {},
    hasSelectedTest: false,
    hasInputSymptoms: false,
    paymentCompleted: false,
  })

  const updateFormData = (data: Partial<BookingFormData>) => {
    setBookingState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }))
  }

  const moveToStep = (step: 1 | 2 | 3) => {
    setBookingState((prev) => ({
      ...prev,
      currentStep: step,
    }))
  }

  const completepayment = () => {
    setBookingState((prev) => ({
      ...prev,
      paymentCompleted: true,
    }))
  }

  return {
    bookingState,
    updateFormData,
    moveToStep,
    completepayment,
  }
}
