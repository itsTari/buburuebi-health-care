'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ctaslider } from '@/constants';
import { Button } from '@/app/components/ui/button';

const CtaSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ctaslider.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = ctaslider[currentSlide];

  return (
    <div className="w-full relative items-center ">
      <div className="w-full flex flex-col md:flex-row items-center justify-center min-h-125">
        <div className=" w-full md:w-1/2 flex flex-col gap-9 md:min-h-125 min-h-85 md:pl-8 p-4  items-start justify-center bg-blue-800 ">
            <div className="flex flex-col gap-4 sm:w-[80%] ">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {slide.text}
                </h2>
                <p className="text-white text-lg">{slide.subtext}</p>
            </div>
          <Button
            className=" w-full sm:w-fit  bg-white text-blue-800 hover:bg-gray-50 md:px-8 py-8 rounded-full transition-all duration-300"
          >
            {slide.cta}
          </Button>
        </div>

        <div className="w-full md:w-1/2 relative h-125">
          <div className="w-full h-fulltransition-opacity duration-500">
            <Image
              src={slide.image}
              alt={slide.text}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 absolute bottom-4 left-1/2 -translate-x-1/2">
        {ctaslider.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-blue-600 w-3 h-3'
                : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CtaSlider;