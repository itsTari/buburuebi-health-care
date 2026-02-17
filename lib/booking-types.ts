// Types for the booking system
export interface BookingService {
  id: string;
  name: string;
  description: string;
  doctorName: string;
  doctorEmail: string;
  doctorWhatsApp: string;
  availableSlots: string[];
  testOptions?: TestOption[];
}

export interface TestOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  selectedTest?: string;
  symptoms?: string;
  timeSlot: string;
  serviceId: string;
}

export interface BookingStep {
  step: 1 | 2 | 3;
  isCompleted: boolean;
}

export interface BookingState {
  currentStep: 1 | 2 | 3;
  formData: Partial<BookingFormData>;
  hasSelectedTest: boolean;
  hasInputSymptoms: boolean;
  paymentCompleted: boolean;
}
