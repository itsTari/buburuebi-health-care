export const ctaslider = [
  {
    id: 0, 
    text: "You want a Consultation?",
    subtext: "Connect with experienced healthcare professionals at your convenience",
    cta: "Book an Appointment Now!",
    image: "/cta1.jpeg"
  },
  {
    id: 1, 
    text: "Do you feel unwell?",
    subtext: "Get immediate medical guidance anytime, day or night",
    cta: "Contact our 24/7 Support!",
    image: "/cta2.jpeg"
  },
  {
    id: 2,
    text: "Do you want to talk to a physician today?",
    subtext: "Skip the waiting room and get expert medical advice instantly",
    cta: "Talk to a Physician Now!",
    image: "/cta3.jpeg"
  },
  {
    id: 3,
    text: "Do you want to know your health status?",
    subtext: "Comprehensive diagnostics to monitor and maintain your wellbeing",
    cta: "Schedule a Full Body Checkup!",
    image: "/cta4.jpeg"
  },
  {
    id: 4,
    text: "Organisations partner with us for employee health plans and for improved healthcare delivery",
    subtext:" message us @info.com",
    cta: "Get in Touch with us!",
    image: "/cta5.jpeg"
  }
]
// footer sections and social media links
import { Mail, Phone } from 'lucide-react'
import { FaFacebookSquare, FaInstagramSquare, FaTiktok, FaTwitterSquare, FaWhatsapp} from "react-icons/fa";

export const footerSections = [
  {
    heading: 'company',
    items: [
      { label: 'About us', href: '#', icon: undefined },
      { label: 'Our location', href: '#', icon: undefined },
      { label: 'Book an appointment', href: '#', icon: undefined }
    ]
  },
  {
    heading: 'contact us',
    items: [
      { icon: Mail, label: 'info@buburuebihealthcare.com', href: 'mailto:info@buburuebihealthcare.com' },
      { icon: Phone, label: '+234 907 616 7977', href: 'tel:+2349076167977' },
      { icon: FaWhatsapp, label: 'Chat on Watsapp', href: 'https://wa.me/2349076167977' }
    ]
  }
];

export const socialMediaLinks = [
  { icon: FaFacebookSquare, href: '#' },
  { icon: FaTwitterSquare, href: '#' },
  { icon: FaInstagramSquare, href: '#' },
  { icon: FaTiktok, href: '#' }
];

export const feedbacks = [
  {
    id: 0,
    rating: 5,
    testimony: "The healthcare service provided has been exceptional. The doctors are knowledgeable and the support team is incredibly responsive. Highly recommended!",
    userName: "Sarah Johnson",
  },
  {
    id: 1,
    rating: 5,
    testimony: "Outstanding experience from start to finish. The appointment booking was seamless and the consultation was thorough. Best healthcare platform I've used!",
    userName: "Michael Chen",
  },
  {
    id: 2,
    rating: 4,
    testimony: "Very impressed with the 24/7 support team. They responded to my concerns promptly and provided clear guidance. Great service overall.",
    userName: "Emily Rodriguez",
  },
  {
    id: 3,
    rating: 5,
    testimony: "This platform has revolutionized how I manage my health. Easy to use, reliable doctors, and affordable prices. Couldn't ask for better!",
    userName: "David Patel",
  },
  {
    id: 4,
    rating: 5,
    testimony: "Fantastic experience with the full body checkup service. The results were detailed and the follow-up consultations were incredibly helpful. Highly satisfied!",
    userName: "Jessica Williams",
  }
]