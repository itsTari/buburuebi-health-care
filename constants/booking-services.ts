import { BookingService, TestOption } from '@/lib/booking-types';

export const laboratoryTestOptions: TestOption[] = [
  { id: 'blood-test', label: 'Complete Blood Count (CBC)', value: 'blood-test', description: 'Comprehensive blood analysis' },
  { id: 'lipid-panel', label: 'Lipid Panel', value: 'lipid-panel', description: 'Cholesterol and fat levels' },
  { id: 'thyroid', label: 'Thyroid Function Test', value: 'thyroid', description: 'TSH and thyroid hormone levels' },
  { id: 'diabetes', label: 'Diabetes Screening', value: 'diabetes', description: 'Blood glucose and HbA1c tests' },
  { id: 'liver', label: 'Liver Function Test', value: 'liver', description: 'Liver enzyme and bilirubin levels' },
  { id: 'kidney', label: 'Kidney Function Test', value: 'kidney', description: 'Creatinine and kidney health markers' },
];

export const dentalTestOptions: TestOption[] = [
  { id: 'cleaning', label: 'Professional Cleaning', value: 'cleaning', description: 'Deep teeth and gum cleaning' },
  { id: 'checkup', label: 'Dental Checkup', value: 'checkup', description: 'Full mouth examination and X-rays' },
  { id: 'extraction', label: 'Tooth Extraction', value: 'extraction', description: 'Safe extraction procedure' },
  { id: 'filling', label: 'Tooth Filling', value: 'filling', description: 'Cavity treatment and restoration' },
  { id: 'root-canal', label: 'Root Canal Treatment', value: 'root-canal', description: 'Advanced endodontic treatment' },
];

export const bookingServices: { [key: string]: BookingService } = {
  'laboratory': {
    id: 'laboratory',
    name: 'Medical Laboratory Services',
    description: 'Advanced laboratory testing and diagnostic services',
    doctorName: 'Dr. Lab Specialist',
    doctorEmail: 'lab@buburuebihealthcare.com',
    doctorWhatsApp: '2349076167977',
    availableSlots: [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ],
    testOptions: laboratoryTestOptions,
  },
  'dental': {
    id: 'dental',
    name: 'Dental Services',
    description: 'Professional dental care for a healthy smile',
    doctorName: 'Dr. Dental Expert',
    doctorEmail: 'dental@buburuebihealthcare.com',
    doctorWhatsApp: '2349076167977',
    availableSlots: [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ],
    testOptions: dentalTestOptions,
  },
  'consultation': {
    id: 'consultation',
    name: 'Consultations & Counselling',
    description: 'Expert medical advice and mental health support',
    doctorName: 'Dr. Consultation Specialist',
    doctorEmail: 'consultation@buburuebihealthcare.com',
    doctorWhatsApp: '2349076167977',
    availableSlots: [
      '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM',
      '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
    ],
  },
};

export const availableTimeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];
