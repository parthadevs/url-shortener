"use client"

import { SetStateAction, useState } from "react"
import { AreaChart, Card as TremorCard, DonutChart, Title, ProgressBar } from "@tremor/react"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Download,
  Globe,
  Info,
  LinkIcon,
  RefreshCw,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign, // Added DollarSign import
  Search,
} from "lucide-react"
import { motion } from "framer-motion" // Added framer-motion import

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalytics } from "@/hooks/use-analytics"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [showDetails, setShowDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Use our custom hooks to fetch data
  const { overview, topUrls, audience, isLoading, isRefreshing, refresh } = useAnalytics(timeRange)

  // Filter top URLs by search term
  const filteredTopUrls = topUrls.filter(
    (item) =>
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format values for charts
  const valueFormatter = (number: number) => `$${number.toFixed(2)}`
  const clicksFormatter = (number: { toLocaleString: () => any }) => `${number.toLocaleString()}`

  // Handle time range change
  const handleTimeRangeChange = (value: string) => { // Changed type from SetStateAction<string> to string
    setTimeRange(value)
  }

  const timeRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "12m", label: "Last 12 months" },
  ]

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
    <div className="relative space-y-8 min-h-screen overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Analytics Dashboard</h2>
            <p className="text-muted-foreground text-lg">Track your URL performance and earnings in real-time.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-md border-border/50">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={refresh} disabled={isRefreshing} className="bg-background/50 backdrop-blur-md border-border/50 hover:bg-background/80">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-md border-border/50 hover:bg-background/80">
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Clicks", value: (overview?.totalClicks || 0).toLocaleString(), icon: Users, change: (overview?.clicksPercentChange || 0), color: "text-purple-500", bg: "bg-purple-500/10" },
            { title: "Total Earnings", value: `$${Number(overview?.totalEarnings || 0).toFixed(2)}`, icon: DollarSign, change: (overview?.earningsPercentChange || 0), color: "text-green-500", bg: "bg-green-500/10", isCurrency: true },
            { title: "Avg. Earnings/Click", value: `$${Number(overview?.avgEarningsPerClick || 0).toFixed(3)}`, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
            { title: "Active URLs", value: overview?.activeUrlsCount || 0, icon: LinkIcon, subValue: `${overview?.newUrlsCount || 0} new`, color: "text-blue-500", bg: "bg-blue-500/10" }
          ].map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
                <div className={`absolute top-0 right-0 h-1 w-full ${kpi.bg.replace('/10', '/30')}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  <div className={`rounded-full ${kpi.bg} p-1.5 ${kpi.color}`}>
                    {typeof kpi.icon === 'function' ? <kpi.icon className="h-4 w-4" /> : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                      <div className="flex items-center pt-1 text-xs">
                        {kpi.change !== undefined ? (
                          <span className={`flex items-center ${kpi.change >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}`}>
                            {kpi.change >= 0 ? (
                              <ArrowUp className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="mr-1 h-3 w-3" />
                            )}
                            {Math.abs(kpi.change).toFixed(1)}%
                            <span className="ml-1 text-muted-foreground font-normal">from previous</span>
                          </span>
                        ) : kpi.subValue ? (
                          <span className="text-green-500 font-medium">
                            <ArrowUp className="mr-1 h-3 w-3 inline" />
                            {kpi.subValue}
                            <span className="ml-1 text-muted-foreground font-normal">this period</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">In this period</span>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs and charts */}
        <Tabs defaultValue="clicks" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <TabsList className="bg-background/40 backdrop-blur-lg border border-border/50 p-1">
              <TabsTrigger value="clicks" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Clicks</TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Earnings</TabsTrigger>
              <TabsTrigger value="audience" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Audience</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search URLs..."
                className="pl-10 w-full md:w-[250px] bg-background/50 border-border/50 backdrop-blur-md focus:border-primary/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="clicks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Clicks Overview</CardTitle>
                      <CardDescription>Daily clicks for the selected period</CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total clicks received across all links.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-[350px] flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary/20" />
                      </div>
                    ) : (
                      <div className="h-[350px] py-4">
                        <AreaChart
                          data={overview.dailyData}
                          index="date"
                          categories={["clicks"]}
                          colors={["purple"]}
                          className="h-full"
                          showLegend={false}
                          yAxisWidth={55}
                          valueFormatter={clicksFormatter}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Top Performing URLs</CardTitle>
                    <CardDescription>URLs with the most engagement</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
                    ) : filteredTopUrls.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                              <LinkIcon className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-medium truncate max-w-[150px]">{item.url}</span>
                          </div>
                          <span className="font-bold">{item.clicks.toLocaleString()}</span>
                        </div>
                        <ProgressBar value={item.clicks} className="h-1.5" color="purple" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl">
                <CardHeader>
                  <CardTitle>Click Distribution</CardTitle>
                  <CardDescription>Metrics breakdown by device, location, and source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "Device Type", data: audience.deviceData, colors: ["purple", "indigo", "violet"] },
                      { title: "Top Locations", data: audience.locationData, colors: ["purple", "indigo", "violet", "fuchsia", "pink"] },
                      { title: "Traffic Sources", data: audience.referrerData, colors: ["purple", "indigo", "violet", "fuchsia", "pink"] }
                    ].map((chart, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-background/30 border border-border/40">
                        <h4 className="text-sm font-semibold mb-4">{chart.title}</h4>
                        <DonutChart
                          data={chart.data}
                          category="value"
                          index="name"
                          colors={chart.colors}
                          valueFormatter={(val) => `${val}%`}
                          className="h-40"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            {/* Similar pattern for earnings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Earnings Overview</CardTitle>
                    <CardDescription>Revenue generated over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] py-4">
                      <AreaChart
                        data={overview.dailyData}
                        index="date"
                        categories={["earnings"]}
                        colors={["green"]}
                        className="h-full"
                        valueFormatter={valueFormatter}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Top Earning URLs</CardTitle>
                    <CardDescription>Best revenue contributors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {filteredTopUrls.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate max-w-[150px]">{item.url}</span>
                          <span className="font-bold">${Number(item.earnings || 0).toFixed(2)}</span>
                        </div>
                        <ProgressBar value={Number(item.earnings || 0)} className="h-1.5" color="green" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            {/* Audience details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Audience Demographics</CardTitle>
                    <CardDescription>User profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <h4 className="text-sm font-semibold mb-4">Age Groups</h4>
                      {[
                        { label: "18-24", value: 22, color: "purple" },
                        { label: "25-34", value: 38, color: "indigo" },
                        { label: "35-44", value: 27, color: "violet" }
                      ].map((age, i) => (
                        <div key={i} className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{age.label}</span>
                            <span>{age.value}%</span>
                          </div>
                          <ProgressBar value={age.value} color={age.color as any} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Geographic Reach</CardTitle>
                    <CardDescription>Traffic by country</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <div>
                        <div className="text-3xl font-bold">{audience.totalClicks}</div>
                        <p className="text-sm text-muted-foreground">Total Clicks Analyzed</p>
                      </div>
                      <Globe className="w-12 h-12 text-primary/40 animate-spin-slow" />
                    </div>
                    <div className="space-y-4">
                      {audience.locationData.map((loc, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-background/40 transition-colors">
                          <span className="text-sm">{loc.name}</span>
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-none">{loc.value}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Insights Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle>Analytics Insights</CardTitle>
              </div>
              <CardDescription>AI-powered optimization suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { icon: TrendingUp, title: "Performance", desc: "Your CTR is up 12% today. Social media distribution is highly effective right now.", color: "text-purple-500" },
                  { icon: Users, title: "Audience", desc: "Mobile users represent 65% of your traffic. Ensure your landing pages are mobile-friendly.", color: "text-blue-500" },
                  { icon: Share2, title: "Channels", desc: "Twitter/X is driving the highest value per click. Consider scaling your presence there.", color: "text-orange-500" }
                ].map((insight, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-background/30 border border-border/40">
                    <div className="flex items-center gap-3 mb-2">
                      <insight.icon className={`w-4 h-4 ${insight.color}`} />
                      <span className="font-semibold">{insight.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
