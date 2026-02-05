import React from 'react'
import { Button } from './ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  return (
    <section className='w-full flex flex-col items-center py-10 '>
        <div className='flex flex-col items-center md:w-[60%] text-center gap-10 md:py-10 px-4'>
            <h2 className="text-2xl font-bold text-center text-blue-600">Our Services</h2>
            <h1 className='md:text-5xl text-3xl font-bold  '>Explore comprehensive care for you & your family!</h1>
            <p className='text-gray-600 text-sm sm:text-lg '>At B.B.H Care&apos;s, we offer a wide range of healthcare services to meet the diverse needs of our patients. Our dedicated team of healthcare professionals is committed to providing high-quality care in a compassionate and patient-centered environment. Whether you need routine check-ups, specialized treatments, or emergency care, we are here to support your health and well-being.</p>
            <Link href="/services"><Button variant='link' className='text-lg cursor-pointer text-blue-600 '>View all services <ChevronRight/> </Button> </Link>
        </div>
    </section>
  )
}

export default Services