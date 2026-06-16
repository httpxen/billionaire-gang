import type { Metadata } from 'next';
import { Inter, Playfair_Display, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Preloader from '@/components/Preloader';
import BackgroundMusic from '@/components/BackgroundMusic';
import ScrollToTop from '@/components/Scrolltotop';
import NavMenu from '@/components/NavMenu';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: '400'
});

export const metadata: Metadata = {
  title: 'Billionaire Gang Official',
  description: 'The official digital home of the Billionaire Gang — Luxury, Influence, Legacy.',
  icons: {
    icon: '/images/bg-logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} ${bebas.variable} bg-black text-white overflow-x-hidden`}>
        <CustomCursor />
        <Preloader />
        <BackgroundMusic />
        <ScrollToTop />
        <NavMenu />
        {children}
      </body>
    </html>
  );
}