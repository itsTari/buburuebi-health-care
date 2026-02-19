'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookingService, BookingFormData, BookingState } from '@/lib/booking-types'
import { bookingSchema, BookingFormValues } from '@/lib/booking-validation'
import { ServiceSection } from '@/app/components/ServiceSection'
import { ChevronRight, Check, AlertCircle } from 'lucide-react'

interface BookingAppointmentProps {
  service: BookingService
  onBookingComplete?: (data: BookingFormData) => void
}

const BookingAppointment: React.FC<BookingAppointmentProps> = ({
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
  const [checkedOptions, setCheckedOptions] = useState<string[]>([])
  const [treatmentLocation, setTreatmentLocation] = useState<'clinic' | 'home' | null>(null)

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { serviceId: service.id },
  })

  const selectedTest = watch('selectedTest')
  const symptoms = watch('symptoms')
  const name = watch('name')
  const email = watch('email')
  const phone = watch('phone')
  const timeSlot = watch('timeSlot')
  const location = watch('location')

  useEffect(() => {
    setBookingState((prev) => ({
      ...prev,
      hasSelectedTest: !!selectedTest && selectedTest.length > 0,
      hasInputSymptoms: !!symptoms && symptoms.length > 0,
    }))
  }, [selectedTest, symptoms])

  // Per-service step 1 validation 
  const isStep1Valid = (() => {
    const hasPersonalInfo = !!(name && email && phone)
    switch (service.type) {
      case 'consultation':
      case 'prescription':
        return hasPersonalInfo && checkedOptions.length > 0
      case 'dental':
        return hasPersonalInfo && (!!selectedTest || (!!symptoms && symptoms.length >= 5))
      case 'home':
        return hasPersonalInfo && !!location && location.length > 5
      case 'treatment':
        return (
          hasPersonalInfo &&
          !!treatmentLocation &&
          (treatmentLocation === 'clinic' ||
            (treatmentLocation === 'home' && !!location && location.length > 5))
        )
      case 'laboratory':
      default:
        return hasPersonalInfo && (!!selectedTest || (!!symptoms && symptoms.length >= 5))
    }
  })()

  // Helpers
  const handleTestSelect = (testValue: string) => {
    setValue('symptoms', '')
    setValue('selectedTest', testValue)
  }

  const handleSymptomsInput = (val: string) => {
    setValue('selectedTest', '')
    setValue('symptoms', val)
  }

  // Max 2 checkboxes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    setCheckedOptions((prev) => {
      if (e.target.checked) {
        if (prev.length >= 2) return prev
        const updated = [...prev, label]
        setValue('symptoms', updated.join(', '))
        return updated
      } else {
        const updated = prev.filter((item) => item !== label)
        setValue('symptoms', updated.join(', '))
        return updated
      }
    })
  }

  const handleTreatmentLocation = (loc: 'clinic' | 'home') => {
    setTreatmentLocation(loc)
    setValue('selectedTest', loc)
    if (loc === 'clinic') setValue('location', '')
  }

  // Fee display based on service type and treatment location
  const getFee = () => {
    if (service.type === 'treatment') {
      return treatmentLocation === 'home'
        ? `₦${service.depositAmount?.toLocaleString()} (Non-refundable deposit)`
        : `₦${service.consultationFee?.toLocaleString()}`
    }
    if (service.type === 'home') {
      return `₦${service.depositAmount?.toLocaleString()} (Non-refundable deposit)`
    }
    return `₦${service.consultationFee?.toLocaleString()}`
  }

  // Step navigation
  const proceedToPayment = () => {
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
        location: location || undefined,
        treatmentLocation: treatmentLocation || undefined,
      },
    }))
    setError(null)
  }

  const proceedToConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!timeSlot) {
      setError('Please select a time slot')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setBookingState((prev) => ({
        ...prev,
        currentStep: 3,
        paymentCompleted: true,
        formData: { ...prev.formData, timeSlot },
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
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingState.formData,
          doctorName: service.doctorName,
          doctorEmail: service.doctorEmail,
          doctorWhatsApp: service.doctorWhatsApp,
          serviceName: service.name,
        }),
      })
      if (!response.ok) throw new Error('Failed to complete booking')

      const whatsappMessage = `Hello Dr. ${service.doctorName}, I have booked an appointment for ${service.name}. My name is ${bookingState.formData.name}, email: ${bookingState.formData.email}. Booked time: ${bookingState.formData.timeSlot}${bookingState.formData.location ? `. Location: ${bookingState.formData.location}` : ''}`
      window.location.href = `https://wa.me/${service.doctorWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`

      if (onBookingComplete) {
        onBookingComplete(bookingState.formData as BookingFormData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete booking. Please try again.')
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
    setCheckedOptions([])
    setTreatmentLocation(null)
    setError(null)
  }

  // SERVICE-SPECIFIC SECTION
  const renderServiceSection = () => {
    return (
      <ServiceSection
        service={service}
        watch={watch}
        setValue={setValue}
        register={register}
        selectedTest={selectedTest}
        symptoms={symptoms}
        checkedOptions={checkedOptions}
        treatmentLocation={treatmentLocation}
        onCheckboxChange={handleCheckboxChange}
        onTestSelect={handleTestSelect}
        onSymptomsInput={handleSymptomsInput}
        onTreatmentLocation={handleTreatmentLocation}
      />
    )
  }


  return (
    <div className="max-w-4xl mx-auto px-4 py-2">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Book an Appointment</h1>
        <p className="text-gray-500">Complete your booking in three easy steps</p>
        <p className="text-blue-700 font-semibold mt-1">{service.name}</p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mb-10 relative">
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width:
                bookingState.currentStep === 1 ? '0%'
                : bookingState.currentStep === 2 ? '50%'
                : '100%',
            }}
          />
        </div>
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
              ${step < bookingState.currentStep ? 'bg-green-600 text-white'
              : step === bookingState.currentStep ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'}`}
            >
              {step < bookingState.currentStep ? <Check className="w-6 h-6" /> : step}
            </div>
            <p className="text-sm font-semibold text-gray-600 mt-2">
              {step === 1 ? 'Select Service' : step === 2 ? 'Payment' : 'Confirmation'}
            </p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/*  STEP 1 */}
      {bookingState.currentStep === 1 && (
        <form className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Step 1: Your Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register('name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                {...register('phone')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Dynamic service-specific section */}
          {renderServiceSection()}

          <button
            type="button"
            onClick={proceedToPayment}
            disabled={!isStep1Valid}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            Proceed to Payment <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      )}

      {/* STEP 2 */}
      {bookingState.currentStep === 2 && (
        <form onSubmit={proceedToConfirmation} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Step 2: Payment</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Patient:</span>
                <span className="font-medium text-gray-900">{bookingState.formData.name}</span>
              </div>
              {bookingState.formData.symptoms && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Selection:</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">
                    {bookingState.formData.symptoms}
                  </span>
                </div>
              )}
              {bookingState.formData.selectedTest && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {bookingState.formData.selectedTest}
                  </span>
                </div>
              )}
              {bookingState.formData.location && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">
                    {bookingState.formData.location}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                <span className="text-gray-700 font-semibold">Amount Due:</span>
                <span className="font-bold text-blue-700 text-base">{getFee()}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
            <div className="p-4 border-2 border-blue-200 rounded-xl bg-blue-50 text-center">
              <p className="font-medium text-blue-900">Payment Gateway — Coming Soon</p>
              <p className="text-xs text-blue-700 mt-1">Stripe / Paystack integration will be added here</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Appointment Time *
            </label>
            <select
              {...register('timeSlot')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
            >
              <option value="">Choose a time slot</option>
              {service.availableSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot.message}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setBookingState((prev) => ({ ...prev, currentStep: 1 }))}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !timeSlot}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? 'Processing...' : 'Confirm & Proceed'}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3 */}
      {bookingState.currentStep === 3 && (
        <form onSubmit={submitBooking} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Confirm Your Booking</h2>
            <p className="text-gray-500 mt-1">Please review your appointment details below</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: bookingState.formData.name },
                { label: 'Email', value: bookingState.formData.email },
                { label: 'Phone', value: bookingState.formData.phone },
                { label: 'Time Slot', value: bookingState.formData.timeSlot },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-500 font-semibold">{label}</p>
                  <p className="text-gray-900 font-medium">{value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-500 font-semibold">Service</p>
              <p className="text-gray-900 font-medium">{service.name}</p>
            </div>

            {bookingState.formData.selectedTest && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-500 font-semibold">Selected Option</p>
                <p className="text-gray-900 font-medium capitalize">{bookingState.formData.selectedTest}</p>
              </div>
            )}

            {bookingState.formData.symptoms && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-500 font-semibold">Symptoms / Selection</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.symptoms}</p>
              </div>
            )}

            {bookingState.formData.location && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-500 font-semibold">Address</p>
                <p className="text-gray-900 font-medium">{bookingState.formData.location}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <p className="text-gray-700 font-bold">Amount Due</p>
              <p className="text-blue-700 font-bold">{getFee()}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-sm text-blue-900">
            📧 Confirmation email will be sent to <strong>{bookingState.formData.email}</strong><br />
            💬 Dr. {service.doctorName} will be notified via WhatsApp
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetBooking}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-all"
            >
              Start Over
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
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
export default BookingAppointment