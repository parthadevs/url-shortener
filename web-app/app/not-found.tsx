import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, Home, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Page Not Found | ShortCash",
  description: "We couldn't find the page you were looking for.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="mx-auto max-w-md shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <Search className="h-10 w-10 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <CardDescription className="text-xl">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Button asChild className="w-full" variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </CardFooter>
      </div>
    </div>
  )
}
