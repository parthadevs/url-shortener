"use client"

import { useState } from "react"
import { BarChart3, DollarSign, LinkIcon, TrendingUp, Users, Plus, Zap, ArrowRight, Copy, CheckCircle2, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function DashboardContent() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("12m")
  const [originalUrl, setOriginalUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { overview, topUrls, isLoading, refresh } = useAnalytics(timeRange)

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (expiresAt) {
      const expirationDate = new Date(expiresAt)
      if (isNaN(expirationDate.getTime())) {
        toast({
          title: "Invalid Date",
          description: "Please enter a valid expiration date",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (expirationDate <= new Date()) {
        toast({
          title: "Invalid Date",
          description: "Expiration date must be in the future",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
    }

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
          expiresAt: expiresAt || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create URL")
      }

      const fullShortUrl = `${window.location.origin}/s/${data.shortUrl}`
      setShortUrl(fullShortUrl)

      toast({
        title: "Success",
        description: "Short URL created successfully",
      })

      setOriginalUrl("")
      setCustomSlug("")
      setExpiresAt("")
      // setShortUrl("") // Keep it to show the user
      refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section className="relative overflow-hidden">

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8 relative z-10"
      >
        {/* Welcome Header */}

        <div className="flex flex-col gap-1">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Dashboard Overview
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-md italic"
          >
            Monitor your earnings and manage your links in real-time.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Earnings", value: overview?.balance ? `$${Number(overview.balance).toFixed(2)}` : "$0.00", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", trend: "+12%" },
            { title: "Active URLs", value: overview?.activeUrlsCount || "0", icon: LinkIcon, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+5" },
            { title: "Total Clicks", value: overview?.totalClicks || "0", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+150" },
            { title: "Avg. CPC", value: overview?.avgEarningsPerClick ? `$${Number(overview.avgEarningsPerClick).toFixed(3)}` : "$0.000", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10", trend: "Stable" },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
                <div className={`absolute top-0 right-0 h-1 w-full ${stat.bg.replace('/10', '/30')}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 ">
                        <TrendingUp className="w-3 h-3 text-green-500" /> <span className="text-green-500">{stat.trend}</span> from last month
                      </p>
                    </div>
                    <div className={`rounded-2xl ${stat.bg} p-2.5 ${stat.color} shadow-inner`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 ">
          {/* Create URL Form */}
          <motion.div variants={itemVariants} className="lg:col-span-4 ">
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl overflow-hidden group ">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Zap className="w-5 h-5 fill-primary/20" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Create Short URL</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Paste your long link below to generate a short, trackable URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form className="grid gap-6" onSubmit={handleCreateUrl}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 col-span-2">
                      <label htmlFor="url" className="text-sm font-semibold text-foreground/70 ml-1">
                        Destination URL
                      </label>
                      <div className="relative group/input">
                        <Input
                          id="url"
                          name="url"
                          className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all pl-11"
                          placeholder="https://example.com/very-long-link..."
                          type="url"
                          value={originalUrl}
                          onChange={(e) => setOriginalUrl(e.target.value)}
                          required
                        />
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label htmlFor="customSlug" className="text-sm font-semibold text-foreground/70 ml-1">
                        Custom Alias <span className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Optional</span>
                      </label>
                      <div className="relative group/input">
                        <Input
                          id="customSlug"
                          name="customSlug"
                          className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all pl-11"
                          placeholder="my-cool-link"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value)}
                        />
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-sm font-semibold text-foreground/70 ml-1">Expiration Date <span className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Optional</span></label>
                      <div className="relative group/input">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                        <Input
                          type="date"
                          value={expiresAt}
                          onChange={(e) => setExpiresAt(e.target.value)}
                          className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* { show short url } */}
                  {shortUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3"
                    >
                      <label className="text-sm font-bold text-primary flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Your Short URL is ready!
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={shortUrl}
                          readOnly
                          className="h-12 bg-background border-primary/20 focus:ring-primary/20 font-medium"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(shortUrl)
                            toast({
                              title: "Copied!",
                              description: "Short URL copied to clipboard",
                            })
                          }}
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Shorten URL <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top URLs Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Top Earning URLs</CardTitle>
                    <CardDescription>Highest revenue generators</CardDescription>
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary/50" />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-muted rounded" />
                          <div className="h-3 w-1/4 bg-muted rounded" />
                        </div>
                        <div className="w-12 h-6 bg-muted rounded" />
                      </div>
                    ))
                  ) : topUrls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
                      <LinkIcon className="w-8 h-8 mb-2 opacity-20" />
                      <p>No data available yet</p>
                    </div>
                  ) : (
                    topUrls.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="group/item flex items-center justify-between p-2 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all duration-300">
                            <LinkIcon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold truncate max-w-[120px] text-sm">/{item.url}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Link Stats</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-sm text-primary">${item.earnings.toFixed(2)}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Growth</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary py-6" asChild>
                  <Link href="/dashboard/urls" className="flex items-center gap-2">
                    View Comprehensive Report <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
