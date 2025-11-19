import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/provider/query-provider';
import { Toaster } from 'react-hot-toast';
import SessionProviderWrapper from '@/components/provider/session-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/favicon.ico',
    apple: '/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <Providers>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </Providers>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
