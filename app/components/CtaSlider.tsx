'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ctaslider } from '@/constants'
import { Button } from '@/app/components/ui/button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const CtaSlider = () => {
  return (
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800} // Smooth transition speed
        loop={true}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        className="w-full"
      >
        {ctaslider.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full flex flex-col md:flex-row items-center justify-center min-h-125">
              {/* Left Content Section */}
              <div className="w-full md:w-1/2 flex flex-col gap-9 md:min-h-125 min-h-85 md:pl-8 p-4 items-start justify-center bg-blue-800">
                <div className="flex flex-col gap-4 sm:w-[80%]">
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {slide.text}
                  </h2>
                  {slide.subtext && (
                    <p className="text-white text-lg">{slide.subtext}</p>
                  )}
                </div>
                <Button className="w-full sm:w-fit bg-white text-blue-800 hover:bg-gray-50 md:px-8 py-8 rounded-full transition-all duration-300">
                  {slide.serviceId ? (
                    <Link
                      href={`/appointments?service=${slide.serviceId}`}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {slide.cta}
                    </Link>
                  ) : (
                    <span>{slide.cta}</span>
                  )}
                </Button>
              </div>

              {/* Right Image Section */}
              <div className="w-full md:w-1/2 relative h-125">
                <Image
                  src={slide.image}
                  alt={slide.text}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Dots */}
      <div className="custom-pagination flex gap-3 absolute bottom-4 left-1/2 -translate-x-1/2 z-10" />
    </div>
  )
}

export default CtaSlider