'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CheckCircle2, Heart, Star, Zap, Shield, Leaf } from 'lucide-react'

const AboutPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const values = [
    {
      icon: Heart,
      title: "Patient-Centric Care",
      description: "Your health and comfort are at the center of everything we do. We listen, we care, and we act."
    },
    {
      icon: Star,
      title: "Excellence & Expertise",
      description: "Our team consists of highly qualified and experienced healthcare professionals dedicated to your wellness."
    },
    {
      icon: Zap,
      title: "Affordability & Accessibility",
      description: "Quality healthcare should be accessible to everyone. We ensure our services are affordable without compromising quality."
    },
    {
      icon: Zap,
      title: "Innovation & Technology",
      description: "We leverage modern technology to provide efficient, accurate, and timely healthcare solutions."
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "Your trust is our most valuable asset. We operate with absolute transparency and professional integrity."
    },
    {
      icon: Leaf,
      title: "Holistic Wellness",
      description: "We believe in treating the whole person, not just symptoms. Our approach encompasses physical, mental, and emotional health."
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!gridRef.current) return

      const gridTop = gridRef.current.getBoundingClientRect().top
      const gridHeight = gridRef.current.getBoundingClientRect().height
      const windowHeight = window.innerHeight

      // If grid hasn't entered viewport yet, keep it gray
      if (gridTop > windowHeight) {
        setScrollProgress(0)
        return
      }

      // If grid has completely passed, make it fully blue
      if (gridTop < -gridHeight) {
        setScrollProgress(1)
        return
      }

      // Grid is in viewport, calculate progress
      const progress = (windowHeight - gridTop) / (windowHeight + gridHeight)
      setScrollProgress(Math.max(0, Math.min(1, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='w-full'>
      {/* Hero Section with Founder */}
      <section className='w-full pt-30 pb-16 md:pb-24 px-5 md:px-10'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center'>
            {/* Text Content */}
            <div className='animate-fade-in md:flex-1'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                Nice to meet you
              </h1>
              <div className='space-y-6'>
                <div>
                  <h2 className='text-2xl md:text-3xl font-bold text-blue-800 mb-3'>
                    Hello, I&apos;m Mr Gabriel Akwasa
                  </h2>
                  <p className='text-gray-600 text-lg mb-2'>
                    Founder & Chief Healthcare Officer
                  </p>
                </div>
                <p className='text-gray-700 text-base md:text-lg leading-relaxed'>
                  Welcome to Buburuebi Health Care, a healthcare platform born from a simple yet powerful vision: to make quality healthcare accessible, affordable, and convenient for everyone.
                </p>
                <p className='text-gray-700 text-base md:text-lg leading-relaxed'>
                  My journey into healthcare began with a deep-rooted passion to bridge the gap between quality medical services and the everyday people who need them. I realized that many individuals struggle to access timely, professional healthcare due to geographical limitations, high costs, and the complexity of the healthcare system.
                </p>
                <p className='text-gray-700 text-base md:text-lg leading-relaxed'>
                  That&apos;s why I founded Buburuebi Health Care. To create a seamless healthcare experience that puts you in control of your health journey.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className='animate-slide-up flex justify-center w-full shrink-0 md:flex-1'>
              <div className='relative w-full max-w-md h-96 md:max-w-none md:h-125 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500'>
                <Image
                  src='/doc.jpeg'
                  alt='Mr Gabriel Akwasa - Founder'
                  fill
                  className='object-cover hover:scale-105 transition-transform duration-500'
                  priority
                />
                <div className='absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent'></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Buburuebi Section */}
      <section className='w-full py-16 md:py-24 px-5 md:px-10 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
              About Buburuebi Health Care
            </h2>
            <p className='text-lg text-gray-700 leading-relaxed max-w-3xl'>
              Buburuebi Health Care is more than just a healthcare platform. We&apos;re a movement towards a healthier, more informed society. With a comprehensive suite of services ranging from professional consultations and pharmaceutical services to medical laboratory diagnostics and patient management, we&apos;re committed to being your one-stop healthcare solution.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
            <div className='p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow duration-300'>
              <h3 className='text-2xl font-bold text-blue-800 mb-4'>Our Mission</h3>
              <p className='text-gray-700 leading-relaxed'>
                To revolutionize healthcare delivery by making quality medical services accessible, affordable, and convenient to everyone, regardless of their location or economic status.
              </p>
            </div>
            <div className='p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow duration-300'>
              <h3 className='text-2xl font-bold text-blue-800 mb-4'>Our Vision</h3>
              <p className='text-gray-700 leading-relaxed'>
                To create a world where every individual has access to quality healthcare, preventive services, and health education that empowers them to live healthier, happier lives.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className='mb-16'>
            <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>What We Offer</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {['Dental Services', 'Pharmaceutical Services', 'Consultations & Counselling', 'Patient Management Programs', 'Medical Laboratory Services', 'Prescription & Recommendations'].map((service, index) => (
                <div key={index} className='flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300'>
                  <CheckCircle2 className='text-blue-600 shrink-0 mt-1' size={24} />
                  <p className='text-gray-700 font-semibold'>{service}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section with Timeline */}
      <section ref={sectionRef} className='w-full py-16 md:py-24 px-5 md:px-10'>
        <div className='mx-auto'>
          <div ref={gridRef} className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start'>
            {/* Heading - Left side on desktop */}
            <div className=''>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-0'>
                Here&apos;s All The Ways We&apos;re Different
              </h2>
            </div>

            {/* Timeline - Right side on desktop */}
            <div className='relative'>
              {/* Vertical Lines */}
              <div className='hidden md:block absolute left-6 top-0 bottom-0 w-0.5'>
                {/* Background gray line */}
                <div className='absolute inset-0 bg-gray-200 w-full'></div>
                {/* Blue fill line */}
                <div
                  className='absolute inset-x-0 top-0 bg-blue-600 w-full'
                  style={{
                    height: `${scrollProgress * 100}%`,
                  }}
                ></div>
              </div>

              {/* Timeline Items */}
              <div className='space-y-8 md:space-y-12'>
                {values.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <div
                      key={index}
                      className='flex gap-6 md:gap-8 md:pl-20'
                    >
                      {/* Icon Container */}
                      <div className='shrink-0 md:absolute md:left-0 flex items-start'>
                        <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300'>
                          <Icon size={28} className='text-blue-600' />
                        </div>
                      </div>

                      {/* Content */}
                      <div className='flex-1 pt-1 md:pt-0'>
                        <h3 className='text-xl md:text-2xl font-medium text-gray-800 mb-2'>
                          {value.title}
                        </h3>
                        <p className='text-gray-700 leading-relaxed'>
                          {value.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='w-full py-16 md:py-24 px-5 md:px-10 bg-blue-800'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
            Join Our Healthcare Community
          </h2>
          <p className='text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto'>
            Whether you&apos;re looking for immediate healthcare solutions or preventive care, Buburuebi Health Care is here to support your wellness journey.
          </p>
          <button className='px-8 py-4 bg-white text-blue-800 font-bold rounded-lg hover:bg-blue-50 transition-colors duration-300 text-lg'>
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  )
}
export default AboutPage