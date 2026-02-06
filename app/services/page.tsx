import React from 'react'
import AllServices from '../components/AllServices'

const page = () => {
  return (
   <section className='w-full flex flex-col items-center pt-30 pb-6 '>
        <div className='flex flex-col items-center md:w-[60%] text-center gap-6 md:py-10 px-4'>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Our Services</h1>
            <p className='text-gray-600 text-sm sm:text-lg '>At B.B.H Care&apos;s, we offer a wide range of healthcare services to meet the diverse needs of our patients. Our dedicated team of healthcare professionals is committed to providing high-quality care in a compassionate and patient-centered environment.</p>
        </div>
        <div className='w-full flex flex-col items-center gap-10 md:gap-20 py-10'>
           <AllServices/>
        </div>
    </section>
  )
}

export default page