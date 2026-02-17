import { BookingAppointment } from '@/app/components/BookingAppointment'
import { bookingServices } from '@/constants/booking-services'
import { notFound } from 'next/navigation'

interface AppointmentPageProps {
  searchParams: {
    service?: string
  }
}

export default function AppointmentPage({
  searchParams,
}: AppointmentPageProps) {
  // Get service from query param, default to 'laboratory'
  const serviceId = searchParams.service || 'laboratory'

  // Get the service configuration
  const service = bookingServices[serviceId]

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 via-blue-25 to-indigo-50 py-12">
      <BookingAppointment service={service} />
    </main>
  )
}
