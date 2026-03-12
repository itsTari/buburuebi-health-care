'use client'

import { feedbacks } from '@/constants'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css' 

const Feedback = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll animation: slide in from bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={`w-full py-12 px-4 md:px-8 transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="text-center pb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-blue-800 mb-4">
          What Our Patients Say
        </h2>
        <p className="text-sm sm:text-lg max-w-2xl mx-auto">
          Real stories from real people who&apos;ve experienced exceptional healthcare with us.
          Join thousands of satisfied patients who trust us with their wellbeing.
        </p>
      </div>

      {/* Swiper Marquee Slider */}
         <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        speed={3000} 
        autoplay={{
          delay: 0, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true, 
        }}
        freeMode={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="w-full"
      >
        {feedbacks.map((feedback, index) => (
          <SwiperSlide key={index}>
            <div className="w-full bg-blue-50 rounded-xl p-6 shadow-md h-full flex flex-col justify-between min-h-[280px]">
              <div className="pb-4">{renderStars(feedback.rating)}</div>
              <p className="text-base text-gray-700 leading-relaxed pb-6">
                &ldquo;{feedback.testimony}&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-300">
                <span className="font-semibold text-gray-900">{feedback.userName}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Feedback