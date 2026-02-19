'use client'

import { Button } from './ui/button'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import {services} from '@/constants'

const HomePage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  return (
    <section
      style={{ backgroundImage: 'url(/doc.jpeg)' }}
      className="relative min-h-screen flex items-center p-10 bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-black opacity-30" />

      <div className="relative flex flex-col gap-4 md:gap-5 items-center md:items-start text-center md:text-left md:w-1/2">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          BUBURUEBI BRIGHTERLIFE HEALTH CARE SERVICE
        </h1>
        <p className="text-white md:w-1/2">
          Where your health comes first. Your trusted health care partner providing quality
          healthcare services since 2020.
        </p>

        {/* CTA with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="bg-blue-800 hover:bg-blue-700 text-white px-7 py-6 rounded-full shadow-md cursor-pointer flex items-center gap-2"
          >
            Book An Appointment
          </Button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <p className="text-xs text-gray-400 font-semibold px-4 pt-3 pb-1 uppercase tracking-wide">
                Select a Service
              </p>
              <ul className="py-2">
                {services.map((service) => (
                  <li key={service.id}>
                    {service.serviceId ? (
                      <Link
                        href={`/appointments?service=${service.serviceId}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex flex-col px-4 py-3 hover:bg-blue-50 transition-colors group"
                      >
                        <span className="font-semibold text-gray-800 group-hover:text-blue-700 text-sm">
                          {service.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">{service.subtitle}</span>
                      </Link>
                    ) : (
                      <Link
                        href="/services"
                        onClick={() => setDropdownOpen(false)}
                        className="flex flex-col px-4 py-3 hover:bg-blue-50 transition-colors group"
                      >
                        <span className="font-semibold text-gray-800 group-hover:text-blue-700 text-sm">
                          {service.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">{service.subtitle}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 px-4 py-3">
                <Link
                  href="/services"
                  onClick={() => setDropdownOpen(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                  View all services →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomePage