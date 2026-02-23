export const TOKEN_KEY = "authToken"
export const TOKEN_EXPIRY_DAYS = 7

interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
    path: string;
    maxAge: number;
}

function getCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === "production"
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * TOKEN_EXPIRY_DAYS,
    }
}

export const setToken = (token: string): void => {
    if (typeof window === "undefined") return

    document.cookie = `${TOKEN_KEY}=${token}; ${getCookieString()}`
    sessionStorage.setItem(TOKEN_KEY, token)
}

function getCookieString(): string {
    const options = getCookieOptions()
    let cookieString = `path=${options.path}; max-age=${options.maxAge}`
    if (options.secure) cookieString += "; secure"
    cookieString += `; SameSite=${options.sameSite}`
    return cookieString
}

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null

    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedToken) return storedToken

    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=")
        if (name === TOKEN_KEY && value) {
            return value
        }
    }

    return sessionStorage.getItem(TOKEN_KEY)
}

export const removeToken = (): void => {
    if (typeof window === "undefined") return

    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`
}
