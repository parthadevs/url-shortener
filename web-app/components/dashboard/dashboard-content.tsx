"use client"

import { useState } from "react"
import { BarChart3, DollarSign, LinkIcon, TrendingUp, Users } from "lucide-react"
import { useAuth } from "@/components/auth-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function DashboardContent() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("12m")
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeUrls: 0,
    totalClicks: 0,
    avgEarningsPerClick: 0,
  })
  const [formData, setFormData] = useState({
    url: "",
    customSlug: "",
  })

  const { overview, topUrls, refresh, isLoading } = useAnalytics(timeRange)
  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateUrl = async (e: any) => {
    e.preventDefault()
    const originalUrl = formData.url
    const customSlug = formData.customSlug

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/urls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalUrl,
          customSlug: customSlug || undefined,
        }),
      })


      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create URL")
      }

      toast({
        title: "Success",
        description: "Short URL created successfully",
      })

      // Reset form
      setFormData({
        url: "",
        customSlug: "",
      })

      // Update stats
      setStats((prev) => ({
        ...prev,
        activeUrls: prev.activeUrls + 1,
      }))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <section>
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="rounded-full bg-primary/10 p-1 text-primary">
                <DollarSign className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overview?.balance ? Number(overview.balance).toFixed(2) : "0.00"}</div>
              <p className="text-xs text-muted-foreground">Collected over the last year</p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active URLs</CardTitle>

              <div className="rounded-full bg-primary/10 p-1 text-primary">
                <LinkIcon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.activeUrlsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Collected over the last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>

              <div className="rounded-full bg-primary/10 p-1 text-primary">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.totalClicks || 0}</div>
              <p className="text-xs text-muted-foreground">Collected over the last year</p>
            </CardContent>
          </Card>
          <Card >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Earnings/Click</CardTitle>

              <div className="rounded-full bg-primary/10 p-1 text-primary">
                <BarChart3 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overview?.avgEarningsPerClick ? Number(overview.avgEarningsPerClick).toFixed(3) : "0.000"}</div>
              <p className="text-xs text-muted-foreground">Collected over the last year</p>
            </CardContent>

          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-xl">Create New Short URL</CardTitle>
              <CardDescription>Enter a long URL to create a short link and start earning</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleCreateUrl}>
                <div className="grid gap-2">
                  <label
                    htmlFor="url"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Long URL
                  </label>
                  <input
                    id="url"
                    name="url"
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter you orginal url.."
                    type="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="customSlug"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Custom Slug (Optional)
                  </label>
                  <input
                    id="customSlug"
                    name="customSlug"
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Create custom url.."
                    value={formData.customSlug}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for auto-generated slug</p>
                </div>
                <Button type="submit" className="shadow-[-1px_1px_8px_1px_rgba(0,_0,_0,_0.1)]">Create Short URL</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl">Top Earning URLs</CardTitle>
              <CardDescription>URLs with the highest earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-1 w-full" />
                    </div>
                  ))
              ) : topUrls.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No URLs found</p>
                </div>
              ) : (
                topUrls.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mr-2">
                          <LinkIcon className="h-4 w-4" />
                        </div>
                        <div className="font-medium truncate max-w-[150px]">{item.url}</div>
                      </div>
                      <div className="font-semibold">${item.earnings.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link href="/dashboard/urls">
                  View All URLs
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
