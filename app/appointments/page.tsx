import BookingAppointment  from '@/app/components/BookingAppointment'
import { bookingServices } from '@/constants/booking-services'
import { notFound } from 'next/navigation'

interface AppointmentPageProps {
  searchParams: Promise<{ service?: string }>
}

export default async function AppointmentPage({ searchParams }: AppointmentPageProps) {
  const { service: serviceParam } = await searchParams
  const serviceId = serviceParam ? serviceParam.toLowerCase() : null
  const service = bookingServices[serviceId]

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 via-white to-indigo-50 py-12">
      <BookingAppointment service={service} />
    </main>
  )
}