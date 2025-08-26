import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/session-provider";
import { OrganizationStructuredData } from "@/components/structured-data";
import { ToasterWrapper } from "@/components/ui/toaster-wrapper"
import { AnalyticsTracker } from "@/components/analytics-tracker";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Tekna - Digital Innovation & Technology Solutions",
    template: "%s | Tekna"
  },
  description: "Leading technology solutions provider in Indonesia. We specialize in web development, mobile apps, AI solutions, and digital transformation services.",
  keywords: ["technology", "web development", "mobile apps", "AI", "digital solutions", "Indonesia", "software development", "consulting"],
  authors: [{ name: "PT Sapujagat Nirmana Tekna" }],
  creator: "PT Sapujagat Nirmana Tekna",
  publisher: "PT Sapujagat Nirmana Tekna",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
  title: "Tekna - Digital Innovation & Technology Solutions",
    description: "Leading technology solutions provider in Indonesia. We specialize in web development, mobile apps, AI solutions, and digital transformation services.",
  siteName: "Tekna",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tekna - Digital Innovation & Technology Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tekna - Digital Innovation & Technology Solutions",
    description: "Leading technology solutions provider in Indonesia. We specialize in web development, mobile apps, AI solutions, and digital transformation services.",
    images: ["/images/og-image.jpg"],
    creator: "@tekna",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <OrganizationStructuredData siteUrl={defaultUrl} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AnalyticsTracker>
              {children}
              <ToasterWrapper />
            </AnalyticsTracker>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
