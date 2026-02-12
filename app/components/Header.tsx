'use client'
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu} from "lucide-react"
import Image from "next/image"

const Header = () => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const toggleSidebar = () => {
    setOpenSidebar(prev => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openSidebar &&
        sidebarRef.current &&
        buttonRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpenSidebar(false)
      }
    }

    if (openSidebar) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openSidebar])

  return (
    <nav
     className="flex fixed z-10 items-center justify-between  w-full px-6 md:px-10 md:py-4 p-2 bg-white">
      <div className="w-1/2 md:w-1/4 flex items-center gap-6 p-2">
      <Image src='/logo.jpeg' alt="logo" width={50} height={50}/>
      <Image src='/logo-text1.png' alt="logo-text1" width={200} height={50}/>
      </div>
      <ul className="gap-4 hidden md:flex ">
        <li className="hover:text-blue-800"><Link href="/" >Home</Link></li>
        <li className="hover:text-blue-800"><Link href="/about">About</Link></li>
        <li className="hover:text-blue-800"><Link href="/services">Our services</Link></li>
        <li className="hover:text-blue-800"><Link href="/contact">Contact</Link></li>
      </ul>

      <button 
        ref={buttonRef}
        onClick={toggleSidebar} 
        className={`md:hidden transition-colors duration-2 p-3 rounded-md shadow-sm ${openSidebar ? "bg-blue-800 text-white" : "bg-slate-100 text-black"}`}
      >
        <Menu />
      </button>
      

      <div
        ref={sidebarRef}
        className={`absolute top-0 mt-30 left-1/2 -translate-x-1/2 z-10
        w-[90%] bg-white rounded-xl shadow-lg
        transform transition-all duration-300
        ${openSidebar
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-7 px-6 py-8 ">
          <li className="hover:text-blue-800" onClick={toggleSidebar}><Link href="/">Home</Link></li>
          <li className="hover:text-blue-800" onClick={toggleSidebar}><Link href="/about">About</Link></li>
          <li className="hover:text-blue-800" onClick={toggleSidebar}><Link href="/services">Our services</Link></li>
          <li className="hover:text-blue-800" onClick={toggleSidebar}><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Header