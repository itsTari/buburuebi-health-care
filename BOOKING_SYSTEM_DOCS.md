# Appointment Booking System Documentation

## Overview

This is a reusable, three-step appointment booking system designed for Buburuebi Healthcare. It allows patients to book appointments for various services (laboratory tests, dental services, consultations, etc.) with flexible service selection based on test type or symptoms.

## Features

### Three-Step Process

1. **Step 1: Service Selection**
   - Patient provides basic information (name, email, phone)
   - Selects service type:
     - **Option A**: Choose from available tests (e.g., Blood Test, Thyroid Test)
     - **Option B**: Describe symptoms for AI/specialist recommendation
   - Only one selection method can be used (mutually exclusive)

2. **Step 2: Payment**
   - Review appointment summary
   - Select payment method (placeholder for real payment gateway)
   - Confirm appointment time slot
   - **Placeholder**: Payment gateway configuration needed

3. **Step 3: Confirmation**
   - Review all booking details
   - Confirm and submit
   - Automatic redirect to doctor's WhatsApp

### Automatic Notifications

- **Email Confirmation**: Sent to patient with booking details
- **WhatsApp Notification**: Sent to doctor with patient info and appointment details
- Booking data saved to database for future reference

## File Structure

```
app/
├── components/
│   └── BookingAppointment.tsx       # Main reusable component
├── appointments/
│   └── page.tsx                      # Dynamic appointment booking page
└── api/
    └── bookings/
        └── route.ts                  # Booking API endpoint

lib/
├── booking-types.ts                  # TypeScript types
├── booking-utils.ts                  # Utility functions

constants/
├── booking-services.ts               # Service configurations
└── index.ts                          # Updated with service IDs

hooks/
└── use-booking.ts                    # Custom booking hook
```

## How to Use

### 1. Basic Usage

Navigate to `/appointments?service=laboratory` where `service` can be:
- `laboratory` - Laboratory tests
- `dental` - Dental services
- `consultation` - Consultations & Counseling

### 2. Adding New Services

Edit `constants/booking-services.ts`:

```typescript
export const newServiceOptions: TestOption[] = [
  { 
    id: 'test-1', 
    label: 'Test Name', 
    value: 'test-name',
    description: 'Description' 
  },
  // ... more options
];

export const bookingServices: { [key: string]: BookingService } = {
  'new-service': {
    id: 'new-service',
    name: 'Service Name',
    description: 'Service Description',
    doctorName: 'Dr. Name',
    doctorEmail: 'doctor@example.com',
    doctorWhatsApp: 'PHONENUMBER',
    availableSlots: ['09:00 AM', '10:00 AM', ...],
    testOptions: newServiceOptions,
  },
};
```

### 3. Integrating Payment Gateway

In `app/components/BookingAppointment.tsx`, replace the payment placeholder:

**For Stripe:**
```typescript
// Install: npm install stripe @stripe/stripe-js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const proceedToConfirmation = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: service.name,
        },
        unit_amount: 5000, // $50.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${window.location.origin}/appointments/success`,
    cancel_url: `${window.location.origin}/appointments?service=${service.id}`,
  });
  
  if (session.url) {
    window.location.href = session.url;
  }
};
```

### 4. Setting Up Email Notifications

Edit `app/api/bookings/route.ts`:

**Using Nodemailer:**
```typescript
import nodemailer from 'nodemailer';
import { generateEmailContent } from '@/lib/booking-utils';

async function sendConfirmationEmail(booking: BookingRequestBody) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailContent = generateEmailContent({
    bookingId: `BOOKING-${Date.now()}`,
    customerName: booking.name,
    customerEmail: booking.email,
    customerPhone: booking.phone,
    serviceName: booking.serviceName,
    selectedTest: booking.selectedTest,
    symptoms: booking.symptoms,
    timeSlot: booking.timeSlot,
    doctorName: booking.doctorName,
    doctorEmail: booking.doctorEmail,
    doctorWhatsApp: booking.doctorWhatsApp,
    createdAt: new Date().toISOString(),
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: booking.email,
    subject: emailContent.subject,
    html: emailContent.html,
  });
}
```

### 5. Setting Up WhatsApp Notifications

**Using Twilio:**
```typescript
import twilio from 'twilio';
import { generateWhatsAppMessage } from '@/lib/booking-utils';

async function sendWhatsAppNotification(booking: BookingRequestBody) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const message = generateWhatsAppMessage({
    bookingId: `BOOKING-${Date.now()}`,
    customerName: booking.name,
    customerEmail: booking.email,
    customerPhone: booking.phone,
    serviceName: booking.serviceName,
    selectedTest: booking.selectedTest,
    symptoms: booking.symptoms,
    timeSlot: booking.timeSlot,
    doctorName: booking.doctorName,
    doctorEmail: booking.doctorEmail,
    doctorWhatsApp: booking.doctorWhatsApp,
    createdAt: new Date().toISOString(),
  });

  await client.messages.create({
    body: message,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:+${booking.doctorWhatsApp}`,
  });
}
```

### 6. Database Integration

Create a booking table to store appointment data:

```sql
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  service_id VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  selected_test VARCHAR(255),
  symptoms TEXT,
  time_slot VARCHAR(50) NOT NULL,
  doctor_name VARCHAR(255) NOT NULL,
  doctor_email VARCHAR(255) NOT NULL,
  doctor_whatsapp VARCHAR(20) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=+1234567890

# Database
DATABASE_URL=your_database_connection_string
```

## Customization

### Styling

The component uses Tailwind CSS. Modify colors and spacing in `BookingAppointment.tsx`:

```typescript
// Change primary color from blue-600 to your color
className="bg-blue-600 hover:bg-blue-700"
// becomes
className="bg-purple-600 hover:bg-purple-700"
```

### Validation Rules

Edit validation schema in `BookingAppointment.tsx`:

```typescript
const bookingSchema = z.object({
  name: z.string().min(3), // Changed from 2 to 3
  email: z.string().email(),
  // ... etc
})
```

### Available Time Slots

Customize per service in `constants/booking-services.ts`:

```typescript
availableSlots: [
  '08:00 AM', '09:00 AM', '10:00 AM',
  // ... add more slots
]
```

## Reusability Tips

1. **For Different Services**: Simply add new entries to `bookingServices` object
2. **For Different Layouts**: Create wrapper components around `BookingAppointment`
3. **For Mobile-First**: Component is already responsive with Tailwind
4. **For Branding**: Update colors, logos, and text through props or constants

## API Endpoints

### POST `/api/bookings`

Creates a new appointment booking.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+234123456789",
  "selectedTest": "blood-test",
  "symptoms": null,
  "timeSlot": "10:00 AM",
  "serviceId": "laboratory",
  "doctorName": "Dr. Lab Specialist",
  "doctorEmail": "lab@buburuebihealthcare.com",
  "doctorWhatsApp": "2349076167977",
  "serviceName": "Medical Laboratory Services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed and notifications sent",
  "bookingId": "BOOKING-1705250400000"
}
```

## Future Enhancements

- [ ] Implement real payment gateway (Stripe, Paystack, etc.)
- [ ] Add database integration
- [ ] Email verification
- [ ] Booking management dashboard for doctors
- [ ] SMS notifications
- [ ] Automated confirmation reminders (24 hours before)
- [ ] Recurring bookings
- [ ] Multilingual support
- [ ] Waiting list feature
- [ ] Integration with calendar systems

## Troubleshooting

**Issue**: WhatsApp redirect not working
- **Solution**: Ensure the WhatsApp number format is correct (without +)

**Issue**: Payments not processing
- **Solution**: Payment gateway integration is a placeholder. Choose and integrate your provider

**Issue**: Emails not sending
- **Solution**: Check SMTP credentials and ensure "Less secure app access" is enabled for Gmail

## Support

For issues or questions, contact: info@buburuebihealthcare.com
