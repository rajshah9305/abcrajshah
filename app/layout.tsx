import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "AgentOrchestra - AI Agent Orchestration Platform",
  description: "Deploy, configure, and monitor AI agents across multiple frameworks with enterprise-grade reliability.",
  keywords: ["AI", "agents", "orchestration", "automation", "machine learning"],
  authors: [{ name: "AgentOrchestra Team" }],
  creator: "AgentOrchestra",
  publisher: "AgentOrchestra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://agent-orchestra.vercel.app"),
  openGraph: {
    title: "AgentOrchestra - AI Agent Orchestration Platform",
    description:
      "Deploy, configure, and monitor AI agents across multiple frameworks with enterprise-grade reliability.",
    url: "https://agent-orchestra.vercel.app",
    siteName: "AgentOrchestra",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentOrchestra - AI Agent Orchestration Platform",
    description:
      "Deploy, configure, and monitor AI agents across multiple frameworks with enterprise-grade reliability.",
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
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
