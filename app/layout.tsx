import type { Metadata } from "next";
import { Poppins, Inter} from "next/font/google";
import "./globals.css";
import Header from "./components/Header";



const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "B.B.H CARE'S",
  description: "BUBURUEBI BRIGHTERLIFE HEALTH CARE PLATFORM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} font-sans`}
      >
      <Header />
        {children}
    
      </body>
    </html>
  );
}
