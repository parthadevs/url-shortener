"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useTheme } from "next-themes"

export type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  saveThemePreference: (theme: Theme) => Promise<void>
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  saveThemePreference: async () => {},
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function EnhancedThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Save theme preference to user settings
  const saveThemePreference = async (theme: Theme) => {
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appearance: {
            theme,
          },
        }),
      })

      if (!response.ok) {
        console.error("Failed to save theme preference")
      }
    } catch (error) {
      console.error("Error saving theme preference:", error)
    }
  }

  // Load theme preference from user settings
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const response = await fetch("/api/user/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.appearance?.theme) {
            setTheme(data.appearance.theme)
          }
        }
      } catch (error) {
        console.error("Error loading theme preference:", error)
      }
    }

    loadThemePreference()
  }, [setTheme])

  // When mounted on client, set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent theme flash on initial load
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider
      value={{
        theme: (theme as Theme) || defaultTheme,
        setTheme,
        saveThemePreference,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useEnhancedTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useEnhancedTheme must be used within a EnhancedThemeProvider")
  }

  return context
}
