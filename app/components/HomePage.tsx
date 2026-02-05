import { Button } from './ui/button'
import Link from 'next/link'

const HomePage = () => {
  return (
    <section style={{backgroundImage: 'url(/doc.jpeg)'}}  className="relative min-h-screen flex items-center p-10 bg-cover bg-center">
       <div className="absolute inset-0 bg-black opacity-30"></div>
       <div className="relative flex flex-col gap-4 md:gap-5 items-center md:items-start text-center md:text-left  md:w-1/3 ">
          <h1 className='text-4xl font-bold text-blue-800' >BUBURUEBI BRIGHTERLIFE HEALTH CARE SERVICE</h1>
          <p className="text-white"> where your health comes first. Your trusted health care partner providing quality healthcare services since 2020</p>
          <Button className=" bg-blue-800 hover:bg-blue-700 text-white p-7 rounded-full shadow-md cursor-pointer"><Link href="/appointments">Book an Appointment</Link></Button>
       </div>
    </section>
  )
}

export default HomePage