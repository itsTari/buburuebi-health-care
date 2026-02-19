import { Heart, Mail, Phone, Star, Zap, Shield, Leaf } from 'lucide-react'
import { FaFacebookSquare, FaInstagramSquare, FaTiktok, FaTwitterSquare, FaWhatsapp} from "react-icons/fa";

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
    subtext:"message us for partnership and collaboration opportunities",
    cta: "Get in Touch with us!",
    image: "/cta5.jpeg",
    // href: 'mailto:info@buburuebihealthcare.com'
  }
]

// footer sections and social media links
export const footerSections = [
  {
    heading: 'Company',
    items: [
      { label: 'About us', href: '#', icon: undefined },
      { label: 'Our location', href: '#', icon: undefined },
      { label: 'Book an appointment', href: '#', icon: undefined }
    ]
  },
  {
    heading: 'Contact us',
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

export const services = [
  {
    id: 1,
    title: "Dental Services",
    subtitle: "Professional dental care for a healthy smile",
    description: "From routine cleanings to advanced treatments, our dental experts provide comprehensive oral healthcare solutions.",
    image: "/cta6.jpeg",
    cta: "Book Appointment",
    serviceId: "dental"
  },
  {
    id: 2,
    title: "Pharmaceutical Services",
    subtitle: "Quality medications delivered to your doorstep",
    description: "Access a wide range of prescription and over-the-counter medications with professional guidance from our pharmacists.",
    image: "/cta4.jpeg",
    cta: "Place an Order",
    serviceId: null
  },
  {
    id: 3,
    title: "Consultations & Counselling",
    subtitle: "Expert medical advice and mental health support",
    description: "Connect with experienced healthcare professionals for personalized consultations and professional counselling services.",
    image: "/cta1.jpeg",
    cta: "Book Appointment",
    serviceId: "consultation"
  },
  {
    id: 4,
    title: "Treatments & Patient Management",
    subtitle: "Comprehensive treatment plans tailored for you",
    description: "Receive expert treatment and ongoing patient management for various medical conditions with continuous care.",
    image: "/cta2.jpeg",
    cta: "Book Appointment",
    serviceId: "treatment"
  },
  {
    id: 5,
    title: "Medical Laboratory Services",
    subtitle: "Accurate diagnostics for better health insights",
    description: "Advanced laboratory testing and diagnostic services to help identify and monitor your health conditions effectively.",
    image: "/cta7.jpeg",
    cta: "Book Appointment",
    serviceId: "laboratory"
  },
  {
    id: 6,
    title: "Prescription & Recommendation Services",
    subtitle: "Personalized health recommendations from experts",
    description: "Receive expert-prescribed medications and personalized health recommendations based on your specific medical needs.",
    image: "/cta3.jpeg",
    cta: "Book Appointment",
    serviceId: "prescription"
  },
  {
    id: 7,
    title: "Home Service",
    subtitle: "Healthcare delivered right to your doorstep",
    description: "Feeling sick and unable to visit? Our medical team comes to you. Available within Bayelsa State. A non-refundable deposit of ₦10,500 is required to confirm your booking.",
    image: "/doc.jpeg",
    cta: "Request Home Service",
    serviceId: "home"
  },
]

// about us page 
export const values = [
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

