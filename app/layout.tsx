import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { OrganizationStructuredData } from '@/components/structured-data'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PT Sapujagat Nirmana Tekna - Software House Indonesia | IoT, Mobile & Web Development',
    template: '%s | PT Sapujagat Nirmana Tekna'
  },
  description: 'PT Sapujagat Nirmana Tekna (Tekna) adalah software house Indonesia terkemuka yang mengkhususkan diri dalam pengembangan IoT, aplikasi mobile, dan website. Solusi teknologi terdepan untuk bisnis Anda.',
  keywords: [
    'software house Indonesia',
    'IoT development',
    'mobile app development',
    'web development',
    'PT Sapujagat Nirmana Tekna',
    'Tekna',
    'Tekna Sapujagat',
    'Tekna Sapujagat Nirmana',
    'Tekna Sapujagat Nirmana Tekna',
    'Tekna Indonesia',
    'jasa pembuatan aplikasi',
    'developer Indonesia',
    'teknologi IoT',
    'aplikasi mobile',
    'website development'
  ],
  authors: [{ name: 'PT Sapujagat Nirmana Tekna' }],
  creator: 'PT Sapujagat Nirmana Tekna',
  publisher: 'PT Sapujagat Nirmana Tekna',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://teknasapujagat.com'),
  alternates: {
    canonical: '/',
  },
      openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: 'https://teknasapujagat.com',
      title: 'PT Sapujagat Nirmana Tekna - Software House Indonesia | IoT, Mobile & Web Development',
      description: 'Software house Indonesia terkemuka untuk pengembangan IoT, aplikasi mobile, dan website. Solusi teknologi terdepan untuk bisnis Anda.',
      siteName: 'PT Sapujagat Nirmana Tekna',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'PT Sapujagat Nirmana Tekna - Software House Indonesia',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PT Sapujagat Nirmana Tekna - Software House Indonesia',
      description: 'Software house Indonesia terkemuka untuk pengembangan IoT, aplikasi mobile, dan website.',
      images: ['/images/twitter-image.jpg'],
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
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://teknasapujagat.com" />
        <meta name="geo.region" content="ID" />
        <meta name="geo.placename" content="Jakarta, Indonesia" />
        <meta name="geo.position" content="-6.2088;106.8456" />
        <meta name="ICBM" content="-6.2088, 106.8456" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="Indonesian" />
        <meta name="country" content="Indonesia" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <AnalyticsTracker>
            {children}
            <OrganizationStructuredData siteUrl="https://teknasapujagat.com" />
          </AnalyticsTracker>
        </SessionProvider>
      </body>
    </html>
  )
}
