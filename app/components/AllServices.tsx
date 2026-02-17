'use client'

import Image from 'next/image';
import { Button } from './ui/button';
import { services } from '@/constants';
import { useState } from 'react';
import Link from 'next/link';

const AllServices = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className='py-10 px-5 md:px-10 bg-white'>
      {/* Services Grid */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {services.map((service, index) => (
          <div
            key={service.id}
            className='group h-full animate-slide-up'
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            onMouseEnter={() => setHoveredId(service.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Service Card */}
            <div className='h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300'>
              <div className='relative h-64 overflow-hidden bg-gray-200'>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </div>

              <div className='flex-1 p-6 md:p-8 flex flex-col justify-between'>
                <div>
                  <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors duration-300'>
                    {service.title}
                  </h3>
                  <p className='text-sm md:text-base font-semibold text-blue-600 mb-3'>
                    {service.subtitle}
                  </p>
                  <p className='text-gray-600 text-sm md:text-base leading-relaxed mb-6'>
                    {service.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div
                  className={`transform transition-all duration-300 ease-out ${
                    hoveredId === service.id
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-2 opacity-90'
                  }`}
                >
                  <Button
                    className='w-full bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg'
                  >
                    {service.serviceId ? (
                      <Link href={`/appointments?service=${service.serviceId}`}>{service.cta}</Link>
                    ) : (
                      <span>{service.cta}</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllServices;