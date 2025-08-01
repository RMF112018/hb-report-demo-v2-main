import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ProjectProvider } from "@/context/project-context"
import { TourProvider } from "@/context/tour-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TourModal } from "@/components/ui/TourModal"
import { TakeTourButton } from "@/components/TakeTourButton"
import { AppLayoutShell } from "@/components/layout/AppLayoutShell"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HB Intel | Hedrick Brothers Construction",
  description: "Construction Intelligence Platform",
  keywords: ["construction", "analytics", "project management", "reporting", "hedrick brothers"],
  authors: [{ name: "Hedrick Brothers Construction" }],
  creator: "Hedrick Brothers Construction",
  publisher: "Hedrick Brothers Construction",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://report.hedrickbrothers.com"),
  openGraph: {
    title: "HB Intel | Construction Analytics",
    description: "Construction Intelligence Platform",
    url: "https://report.hedrickbrothers.com",
    siteName: "HB Intel",
    locale: "en_US",
    type: "website",
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
    google: "google-site-verification-code",
  },
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-950 text-foreground">
        <ErrorBoundary>
          <AuthProvider>
            <TourProvider>
              <ProjectProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  <AppLayoutShell showHeader={false}>{children}</AppLayoutShell>
                  <TourModal />
                  <TakeTourButton />
                  <Toaster />
                </ThemeProvider>
              </ProjectProvider>
            </TourProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
