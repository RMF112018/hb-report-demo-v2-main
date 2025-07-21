"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
}

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps): React.JSX.Element => {
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => setMounted(true), [])

  return <NextThemesProvider {...props}>{mounted && children}</NextThemesProvider>
}
