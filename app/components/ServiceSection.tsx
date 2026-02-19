'use client'

import React from 'react'
import { UseFormSetValue, UseFormWatch, UseFormRegister } from 'react-hook-form'
import { BookingService } from '@/lib/booking-types'
import { dentalTestOptions, laboratoryTestOptions } from '@/constants/booking-services'
import { Check, House, Hospital, TriangleAlert } from 'lucide-react'
import { BookingFormValues } from '@/lib/booking-validation'

interface ServiceSectionProps {
  service: BookingService
  watch: UseFormWatch<BookingFormValues>
  setValue: UseFormSetValue<BookingFormValues>
  register: UseFormRegister<BookingFormValues>
  selectedTest: string | undefined
  symptoms: string | undefined
  checkedOptions: string[]
  treatmentLocation: 'clinic' | 'home' | null
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, label: string) => void
  onTestSelect: (value: string) => void
  onSymptomsInput: (value: string) => void
  onTreatmentLocation: (location: 'clinic' | 'home') => void
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({
  service,
  selectedTest,
  symptoms,
  checkedOptions,
  treatmentLocation,
  onCheckboxChange,
  onTestSelect,
  onSymptomsInput,
  onTreatmentLocation,
  register,
}) => {
  // CONSULTATION & COUNSELLING
  if (service.type === 'consultation') {
    return (
      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          What do you need help with? <span className="text-gray-400 font-normal">(Select up to 2)</span>
        </label>
        {checkedOptions.length === 2 && (
          <p className="text-xs text-amber-600 mb-3">Maximum of 2 options selected.</p>
        )}
        <div className="space-y-3 mt-3">
          {[
            { id: 'general', label: 'General Consultation' },
            { id: 'physician', label: 'Talk to a Physician Today' },
            { id: 'learn', label: 'Learn About Your Health' },
            { id: 'counseling', label: 'Medical Counseling' },
          ].map((option) => {
            const isChecked = checkedOptions.includes(option.label)
            const isDisabled = !isChecked && checkedOptions.length >= 2
            return (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                  ${isChecked ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={(e) => onCheckboxChange(e, option.label)}
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="font-medium text-gray-800">{option.label}</span>
                {isChecked && <Check className="ml-auto w-4 h-4 text-blue-600" />}
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  // PRESCRIPTION & RECOMMENDATION
  if (service.type === 'prescription') {
    return (
      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          You want prescription and recommendation? <span className="text-gray-400 font-normal">(Select up to 2)</span>
        </label>
        {checkedOptions.length === 2 && (
          <p className="text-xs text-amber-600 mb-3">Maximum of 2 options selected.</p>
        )}
        <div className="space-y-3 mt-3">
          {[
            { id: 'unwell', label: 'I Feel Unwell' },
            { id: 'supplements', label: 'Order Supplements' },
          ].map((option) => {
            const isChecked = checkedOptions.includes(option.label)
            const isDisabled = !isChecked && checkedOptions.length >= 2
            return (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                  ${isChecked ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={(e) => onCheckboxChange(e, option.label)}
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="font-medium text-gray-800">{option.label}</span>
                {isChecked && <Check className="ml-auto w-4 h-4 text-blue-600" />}
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  // DENTAL
  if (service.type === 'dental') {
    return (
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Dental Service</label>
          <select
            onChange={(e) => {
              if (e.target.value) onTestSelect(e.target.value)
              else onTestSelect('')
            }}
            disabled={!!symptoms}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition
              ${symptoms ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
          >
            <option value="">Choose a Dental Service</option>
            {dentalTestOptions.map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label} — {opt.description}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Dental Concern</label>
          <textarea
            placeholder="e.g. I have a toothache on my lower left side, it's been hurting for 3 days..."
            value={symptoms}
            onChange={(e) => onSymptomsInput(e.target.value)}
            disabled={!!selectedTest}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition resize-none h-32
              ${selectedTest ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
          />
        </div>
      </div>
    )
  }

  // HOME SERVICE
  if (service.type === 'home') {
    return (
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-amber-800 text-sm font-semibold flex items-center gap-1">
            <House className="inline w-4 h-4 mr-1 text-blue-600" /> <p>Feeling sick and unwell? Need home service?</p>
          </div>
          <p className="text-amber-700 text-xs mt-1">Enter your location below. Our medical team will come to you.</p>
          <div className="text-amber-700 text-xs mt-1 flex items-center gap-1">
            <TriangleAlert className="inline w-3 h-3 text-yellow-500" /> 
            <p>Service currently available within <strong>Bayelsa State only</strong>.</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Address *</label>
          <textarea
            placeholder="e.g. No. 5 Ekeki Road, Yenagoa, Bayelsa State..."
            {...register('location')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition resize-none h-28"
          />
        </div>
        <p className="text-xs text-gray-500">
          A <strong>non-refundable deposit of ₦10,500</strong> is required to confirm your booking. Final fee agreed upon arrival.
        </p>
      </div>
    )
  }

  // TREATMENT & PATIENT MANAGEMENT
  if (service.type === 'treatment') {
    return (
      <div className="border-t border-gray-200 pt-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Where would you like to receive treatment?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['clinic', 'home'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onTreatmentLocation(loc)}
                className={`flex flex-col items-center p-5 border-2 rounded-xl cursor-pointer transition-all
                  ${treatmentLocation === loc ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <span className="text-3xl mb-2">{loc === 'clinic' ? <Hospital className="text-red-600" /> : <House className="text-blue-600" />}</span>
                <span className="font-semibold text-gray-800">
                  {loc === 'clinic' ? 'At the Clinic' : 'Home Service'}
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {loc === 'clinic'
                    ? `Visit our facility — ₦${service.consultationFee?.toLocaleString()}`
                    : `We come to you — ₦${service.depositAmount?.toLocaleString()} deposit`}
                </span>
                {treatmentLocation === loc && <Check className="mt-2 w-5 h-5 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        {treatmentLocation === 'home' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
              <TriangleAlert className="inline w-3 h-3 text-yellow-500" />
              <p className="text-amber-800 text-xs font-medium">
                Home service available within <strong>Bayelsa State only</strong>. A non-refundable deposit of{' '}
                <strong>₦{service.depositAmount?.toLocaleString()}</strong> applies.
              </p>
            </div>
            <label className="block text-sm font-semibold text-gray-700">Your Address *</label>
            <textarea
              placeholder="e.g. No. 5 Ekeki Road, Yenagoa, Bayelsa State..."
              {...register('location')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition resize-none h-28"
            />
          </div>
        )}
      </div>
    )
  }

  // LABORATORY 
  return (
    <div className="border-t border-gray-200 pt-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Laboratory Test</label>
        <select
          onChange={(e) => {
            if (e.target.value) onTestSelect(e.target.value)
            else onTestSelect('')
          }}
          disabled={!!symptoms}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition
            ${symptoms ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        >
          <option value="">Choose a Laboratory Test</option>
          {laboratoryTestOptions.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.label} — {opt.description}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Get Test Recommendation Based on Your Symptoms
        </label>
        <textarea
          placeholder="Describe your symptoms... How do you feel?"
          value={symptoms}
          onChange={(e) => onSymptomsInput(e.target.value)}
          disabled={!!selectedTest}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition resize-none h-32
            ${selectedTest ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        />
      </div>
    </div>
  )
}

export default ServiceSection
