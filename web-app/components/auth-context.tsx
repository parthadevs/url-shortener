"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getToken, removeToken, setToken as saveToken } from "@/lib/auth"

interface User {
    id: string
    email: string
    name?: string
    username?: string
    role?: string
    balance?: number
    image?: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = getToken()
            if (savedToken) {
                setToken(savedToken)
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                        headers: {
                            Authorization: `Bearer ${savedToken}`,
                        },
                    })
                    if (res.ok) {
                        const userData = await res.json()
                        setUser(userData)
                    } else {
                        // Token invalid
                        logout()
                    }
                } catch (error) {
                    console.error("Failed to fetch profile:", error)
                }
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = (newToken: string, newUser: User) => {
        setToken(newToken)
        setUser(newUser)
        saveToken(newToken)
        router.push("/dashboard")
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        removeToken()
        if (pathname.startsWith("/dashboard")) {
            router.push("/login")
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
