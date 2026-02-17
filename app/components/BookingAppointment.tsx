'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { BookingService, BookingFormData, BookingState } from '@/lib/booking-types'
import { ChevronRight, Check, AlertCircle } from 'lucide-react'

// Validation schema
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  selectedTest: z.string().optional(),
  symptoms: z.string().min(10, 'Symptoms must be at least 10 characters').optional(),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  serviceId: z.string(),
}).refine(
  (data) => data.selectedTest || data.symptoms,
  {
    message: 'Please either select a test or describe your symptoms',
    path: ['selectedTest'],
  }
)

type BookingFormValues = z.infer<typeof bookingSchema>

interface BookingAppointmentProps {
  service: BookingService
  onBookingComplete?: (data: BookingFormData) => void
}

export const BookingAppointment: React.FC<BookingAppointmentProps> = ({
  service,
  onBookingComplete,
}) => {
  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: 1,
    formData: { serviceId: service.id },
    hasSelectedTest: false,
    hasInputSymptoms: false,
    paymentCompleted: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: service.id,
    },
  })

  const selectedTest = watch('selectedTest')
  const symptoms = watch('symptoms')
  const name = watch('name')
  const email = watch('email')
  const phone = watch('phone')
  const timeSlot = watch('timeSlot')

  // Update booking state when test or symptoms change
  useEffect(() => {
    setBookingState((prev) => ({
      ...prev,
      hasSelectedTest: !!selectedTest && selectedTest.length > 0,
      hasInputSymptoms: !!symptoms && symptoms.length > 0,
    }))
  }, [selectedTest, symptoms])

  const handleTestSelect = (testValue: string) => {
    // Clear symptoms when test is selected
    setValue('symptoms', '')
    setValue('selectedTest', testValue)
  }

  const handleSymptomsInput = (symptomsText: string) => {
    // Clear test selection when symptoms are input
    setValue('selectedTest', '')
    setValue('symptoms', symptomsText)
  }

  const proceedToPayment = async () => {
    // Validate step 1
    const isStep1Valid = name && email && phone && (selectedTest || symptoms) && !Object.keys(errors).length

    if (!isStep1Valid) {
      setError('Please fill in all required fields')
      return
    }

    setBookingState((prev) => ({
      ...prev,
      currentStep: 2,
      formData: {
        ...prev.formData,
        name,
        email,
        phone,
        selectedTest: selectedTest || undefined,
        symptoms: symptoms || undefined,
      },
    }))

    setError(null)
  }

  const proceedToConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!timeSlot) {
      setError('Please select a payment method and time slot')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate payment processing - placeholder for actual payment gateway
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setBookingState((prev) => ({
        ...prev,
        currentStep: 3,
        paymentCompleted: true,
        formData: {
          ...prev.formData,
          timeSlot,
        },
      }))
    } catch {
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bookingState.formData.name || !bookingState.formData.email) {
      setError('Missing required information')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Send booking to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingState.formData,
          doctorName: service.doctorName,
          doctorEmail: service.doctorEmail,
          doctorWhatsApp: service.doctorWhatsApp,
          serviceName: service.name,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete booking')
      }

      // Redirect to WhatsApp
      const whatsappMessage = `Hello Dr. ${service.doctorName}, I have booked an appointment for ${service.name}. My name is ${bookingState.formData.name}, email: ${bookingState.formData.email}. Booked time: ${bookingState.formData.timeSlot}`
      const encodedMessage = encodeURIComponent(whatsappMessage)
      window.location.href = `https://wa.me/${service.doctorWhatsApp}?text=${encodedMessage}`

      if (onBookingComplete) {
        onBookingComplete(bookingState.formData as BookingFormData)
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to complete booking. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const resetBooking = () => {
    setBookingState({
      currentStep: 1,
      formData: { serviceId: service.id },
      hasSelectedTest: false,
      hasInputSymptoms: false,
      paymentCompleted: false,
    })
    reset({ serviceId: service.id })
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Book for Appointment
        </h1>
        <p className="text-gray-600">in three easy steps</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between mb-10 relative">
        {/* Connection line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-300 -z-10">
          <div
            className={`h-full bg-blue-600 transition-all duration-300`}
            style={{
              width: `${
                bookingState.currentStep === 1 ? '0%' :
                bookingState.currentStep === 2 ? '50%' :
                '100%'
              }`,
            }}
          ></div>
        </div>

        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                step < bookingState.currentStep
                  ? 'bg-green-600 text-white'
                  : step === bookingState.currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step < bookingState.currentStep ? (
                <Check className="w-6 h-6" />
              ) : (
                step
              )}
            </div>
            <p className="text-sm font-semibold text-gray-700 mt-2 text-center">
              {step === 1 && 'Select Service'}
              {step === 2 && 'Payment'}
              {step === 3 && 'Confirmation'}
            </p>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Service Selection */}
      {bookingState.currentStep === 1 && (
        <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Step 1: Select Your Service</h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                {...register('phone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              {/* Service Selection Method */}
              {service.testOptions && service.testOptions.length > 0 && (
                <>
                  {/* Option A: Test Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Test Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.testOptions.map((test) => (
                        <button
                          key={test.id}
                          type="button"
                          onClick={() => handleTestSelect(test.value)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            selectedTest === test.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          } ${symptoms ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!!symptoms}
                        >
                          <p className="font-medium text-gray-900">{test.label}</p>
                          {test.description && (
                            <p className="text-xs text-gray-600 mt-1">{test.description}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <p className="text-sm text-gray-500 font-medium">OR</p>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                </>
              )}

              {/* Option B: Symptom Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Get Test Recommendation Based on Your Symptoms
                </label>
                <textarea
                  placeholder="Describe your symptoms... How do you feel?"
                  value={symptoms}
                  onChange={(e) => handleSymptomsInput(e.target.value)}
                  disabled={!!selectedTest}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none h-32 ${
                    selectedTest ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={proceedToPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedTest && !symptoms}
          >
            Proceed to Payment <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      )}

      {/* Step 2: Payment */}
      {bookingState.currentStep === 2 && (
        <form onSubmit={proceedToConfirmation} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Step 2: Payment</h2>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Service:</span> <span className="font-medium">{service.name}</span></p>
              <p><span className="text-gray-600">Patient Name:</span> <span className="font-medium">{bookingState.formData.name}</span></p>
              <p>
                <span className="text-gray-600">Selection:</span> 
                <span className="font-medium">
                  {bookingState.formData.selectedTest ? ` ${bookingState.formData.selectedTest}` : ' Symptom-based recommendation'}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method (Placeholder)
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-4 border-2 border-blue-600 rounded-lg bg-blue-50 cursor-pointer">
                  <input type="radio" name="payment" value="card" defaultChecked className="w-4 h-4" />
                  <span className="ml-3 font-medium">Payment Gateway Placeholder</span>
                </label>
                <p className="text-xs text-gray-600 text-center mt-2">
                  Real payment gateway integration will be added here (Stripe, PayPal, etc.)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Appointment Time *
              </label>
              <select
                {...register('timeSlot')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              >
                <option value="">Choose a time slot</option>
                {service.availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.timeSlot && (
                <p className="text-red-600 text-xs mt-1">{errors.timeSlot.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setBookingState((prev) => ({ ...prev, currentStep: 1 }))
              }
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !timeSlot}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm & Proceed'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Confirmation */}
      {bookingState.currentStep === 3 && (
        <form onSubmit={submitBooking} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Confirm Your Booking</h2>
            <p className="text-gray-600 mt-2">Payment confirmed. Please confirm your appointment details below.</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-semibold">Full Name</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.name}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Email</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.email}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Phone</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Time Slot</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.timeSlot}</p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <p className="text-gray-600 font-semibold">Service</p>
              <p className="text-gray-900 font-medium">{service.name}</p>
            </div>

            {bookingState.formData.selectedTest && (
              <div className="border-t border-gray-300 pt-4">
                <p className="text-gray-600 font-semibold">Selected Test</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.selectedTest}</p>
              </div>
            )}

            {bookingState.formData.symptoms && (
              <div className="border-t border-gray-300 pt-4">
                <p className="text-gray-600 font-semibold">Symptoms</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.symptoms}</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              📧 <strong>Confirmation email</strong> will be sent to <strong>{bookingState.formData.email}</strong><br/>
              💬 <strong>WhatsApp notification</strong> will be sent to Dr. {service.doctorName}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetBooking}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition-all"
            >
              Start Over
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2 flex items-center justify-center"
            >
              {loading ? 'Completing...' : 'Complete Booking & Message Doctor'}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
