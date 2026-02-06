import { Button } from './ui/button'
import { Input } from './ui/input'
import Link from 'next/link';
import Image from 'next/image';
import { footerSections, socialMediaLinks } from '@/constants';

const Footer = () => {
  return (
    <footer className='md:p-10 p-5 bg-gray-50'>
        <div className='flex flex-col sm:flex-row md:items-center md:justify-between gap-5 py-5 md:pb-10'>
            <div className='flex flex-col gap-5'>
                <h4 className='font-bold md:text-xl  text-gray-700'>Join our newsletter</h4>
                <p className='text-gray-500 md:w-[70%] md:text-lg text-sm'>Get exclusive update, new service announcements, and information that matters to you and your health in just minuets.</p>
            </div>
            <form className='flex flex-col md:flex-row gap-4 md:w-[40%]'>
                <Input type="email" placeholder='Enter your email' className='md:p-6'/>
                <Button className='bg-blue-800 hover:bg-blue-700 md:p-6 '>Subscribe</Button>
            </form>
        </div>
        <div className='md:border-y border-b border-gray-200 mt-5 md:py-12 py-6 text-gray-500 flex flex-col md:flex-row md:justify-between gap-5 justify-start'>
            {footerSections.map((section) => (
              <ul key={section.heading} className='flex flex-col gap-2 md:gap-3 py-2'>
                <li className='font-extrabold pb-2 text-xs md:text-[16px]'>{section.heading}</li>
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index}>
                      <Link href={item.href}>
                        {Icon && <Icon size={14} className="inline mr-2" />}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ))}
            <ul className='flex flex-col gap-2 md:gap-3 py-2'>
              <li className='font-extrabold pb-2 text-xs md:text-[16px]'>follow us on social media</li>
              <ul className='flex gap-4 text-gray-700'>
                {socialMediaLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <li key={index}>
                      <Link href={link.href}>
                        <Icon />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </ul>
        </div>
        <div className='flex flex-col md:flex-row justify-between gap-3 md:items-center py-7'>
            <Image src='/logo-text1.png' alt="logo-text1" width={200} height={50}/>
            <p>© 2026 Buburuebi Health Care.</p>
        </div>
    </footer>
  )
}

export default Footer