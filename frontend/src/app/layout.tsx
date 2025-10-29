import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Launchstream - Crypto Token Creation Platform',
  description: 'Create and launch tokens on Ethereum with our secure, feature-rich platform. One-click token creation with automatic liquidity and Uniswap integration.',
  keywords: ['token', 'token creation', 'Ethereum', 'Uniswap', 'DeFi', 'cryptocurrency', 'blockchain'],
  authors: [{ name: 'Streams Ethereum Team' }],
  creator: 'Launchstream',
  publisher: 'Launchstream',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://launchstream.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Launchstream - Crypto Token Creation Platform',
    description: 'Create and launch tokens on Ethereum with our secure, feature-rich platform.',
    url: 'https://launchstream.xyz',
    siteName: 'Launchstream',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Launchstream',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Launchstream - Crypto Token Creation Platform',
    description: 'Create and launch tokens on Ethereum with our secure, feature-rich platform.',
    images: ['/og-image.png'],
    creator: '@launchstream',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header />
            <main className="relative">
              {children}
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#f8fafc',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#f8fafc',
                  },
                },
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
