'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pharmaceuticalSchema, PharmaceuticalFormValues } from '@/lib/pharmaceutical-validation'
import { companyContact } from '@/constants'
import { ChevronRight, Check, AlertCircle, Upload, X, Pill } from 'lucide-react'
import Image from 'next/image'



const PharmaceuticalRequestForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm<PharmaceuticalFormValues>({
    resolver: zodResolver(pharmaceuticalSchema),
    mode: 'onBlur',
  })

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }

      setImageFile(file)
      
      // Create preview for display
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        setError(null)
      }
      reader.onerror = () => {
        setError('Failed to read image file')
        setImageFile(null)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove uploaded image
  const removeImage = () => {
    setUploadedImage(null)
    setImageFile(null)
  }

  // Submit form
 // Submit form
const onSubmit = async (data: PharmaceuticalFormValues) => {
  setLoading(true)
  setError(null)

  try {
    let imageUrl = null

    // Upload image if provided
    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const uploadData = await uploadResponse.json()
      imageUrl = uploadData.url
    }

    // Prepare WhatsApp message
    const whatsappMessage = ` *New Drug Request*

*Customer Information:*
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

*Drug(s) Requested:*
${data.drugNames}

*Delivery Address:*
${data.deliveryAddress}

${data.additionalNotes ? `*Additional Notes:*\n${data.additionalNotes}\n\n` : ''}${imageUrl ? `*Prescription/Drug Photo:*\n${window.location.origin}${imageUrl}\n\n` : ''}`

    // Send to API (optional - for record keeping)
    const response = await fetch('/api/pharmaceutical-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        hasImage: !!imageUrl,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      console.warn('Failed to save request to database, but continuing to WhatsApp')
    }

    // Open WhatsApp 
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappURL = `https://wa.me/${companyContact.whatsAppNumber}?text=${encodedMessage}`
    window.open(whatsappURL, '_blank')

      setSuccess(true)
      reset()
      setUploadedImage(null)
      setImageFile(null)
  

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to submit request. Please try again.')
  } finally {
    setLoading(false)
  }
}

  // Reset and start over
  const startOver = () => {
    setSuccess(false)
    reset()
    setUploadedImage(null)
    setImageFile(null)
    setError(null)
  }

  // Success screen
  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your drug request has been sent to our pharmacy team via WhatsApp. 
            Our pharmacist will contact you shortly with pricing and delivery details.
          </p>

          <button
            onClick={startOver}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pill className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Order Drugs & Supplements</h1>
        <p className="text-gray-600">
          Request your medications and our pharmacist will contact you with pricing and delivery options
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>ℹ️ How it works:</strong><br />
          Submit your drug request below. Our pharmacist will send you a quote via WhatsApp 
          within 30 minutes. Once you confirm, we&apos;ll process your order and arrange delivery.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        
        <h2 className="text-xl font-bold text-gray-900">Your Information</h2>

        {/* Name */}
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

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            onBlur={() => trigger('email')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            placeholder="e.g. 08012345678 or +234 801 234 5678"
            {...register('phone')}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '')
              setValue('phone', cleaned, { shouldValidate: false })
            }}
            onBlur={() => trigger('phone')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Drug Request Details</h2>

          {/* Drug Names */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Drug Name(s) / Supplements *
            </label>
            <textarea
              placeholder="e.g. Paracetamol 500mg, Vitamin C 1000mg, Amoxicillin capsules..."
              {...register('drugNames')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition resize-none h-28"
            />
            <p className="text-xs text-gray-500 mt-1">List all drugs or supplements you need, separated by commas</p>
            {errors.drugNames && <p className="text-red-500 text-xs mt-1">{errors.drugNames.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Prescription / Drug Photo (Optional)
            </label>
            
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="drug-image-upload"
                />
                <label htmlFor="drug-image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-blue-300 rounded-lg p-2">
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <Image
                  src={uploadedImage}
                  alt="Uploaded prescription"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Address *
            </label>
            <textarea
              placeholder="e.g. No. 5 Ekeki Road, Yenagoa, Bayelsa State..."
              {...register('deliveryAddress')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition resize-none h-24"
            />
            {errors.deliveryAddress && <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress.message}</p>}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              placeholder="Any special instructions or questions..."
              {...register('additionalNotes')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition resize-none h-20"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Sending Request...' : 'Send Request to Pharmacist'}
          {!loading && <ChevronRight className="w-5 h-5" />}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to be contacted via WhatsApp for pricing and delivery coordination.
        </p>
      </form>
    </div>
  )
}

export default PharmaceuticalRequestForm