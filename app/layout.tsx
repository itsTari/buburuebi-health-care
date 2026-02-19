import type { Metadata } from "next";
import { Poppins, Inter} from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";



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
       <div className="h-18 md:h-22" />
        {children}
        <Footer/>
    
      </body>
    </html>
  );
}
