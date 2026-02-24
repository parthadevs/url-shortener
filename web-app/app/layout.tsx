import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

import { Toaster } from "@/components/toaster"
import { AuthProvider } from "@/components/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"


// Font configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

// Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "ShortCash | Premium URL Shortener That Pays You",
    template: "%s | ShortCash",
  },
  description:
    "ShortCash is a premium URL Shortener that pays you for every click. Create short, branded links and monetize your online presence.",
  keywords: [
    "url shortener",
    "link shortener",
    "monetize links",
    "earn money online",
    "short urls",
    "link monetization",
    "premium url shortener",
  ],
  authors: [{ name: "ShortCash Team" }],
  creator: "ShortCash",
  publisher: "ShortCash",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://shortcash.example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shortcash.example.com",
    title: "ShortCash | Premium URL Shortener That Pays You",
    description: "Create short, branded links and earn money with every click. The premium URL shortener that pays.",
    siteName: "ShortCash",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShortCash - Premium URL Shortener",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShortCash | Premium URL Shortener That Pays You",
    description: "Create short, branded links and earn money with every click. The premium URL shortener that pays.",
    images: ["/twitter-image.jpg"],
    creator: "@shortcash",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>

            <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

            <Suspense>{children}</Suspense>
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
