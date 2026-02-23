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
} from "lucide-react"

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
  const handleTimeRangeChange = (value: SetStateAction<string>) => {
    setTimeRange(value)
  }

  const timeRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "12m", label: "Last 12 months" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your URL performance and earnings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
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
          <Button variant="outline" size="icon" onClick={refresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <div className="rounded-full bg-primary/10 p-1 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{(overview?.totalClicks || 0).toLocaleString()}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <span
                    className={`flex items-center ${(overview?.clicksPercentChange || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {(overview?.clicksPercentChange || 0) >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(overview?.clicksPercentChange || 0).toFixed(1)}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <div className="rounded-full bg-primary/10 p-1 text-primary">
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
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">${Number(overview?.totalEarnings || 0).toFixed(2)}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <span
                    className={`flex items-center ${(overview?.earningsPercentChange || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {(overview?.earningsPercentChange || 0) >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(overview?.earningsPercentChange || 0).toFixed(1)}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Earnings/Click</CardTitle>
            <div className="rounded-full bg-primary/10 p-1 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">${Number(overview?.avgEarningsPerClick || 0).toFixed(3)}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <span className="ml-1">per click in this period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active URLs</CardTitle>
            <div className="rounded-full bg-primary/10 p-1 text-primary">
              <LinkIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview?.activeUrlsCount || 0}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center text-green-500">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {overview?.newUrlsCount || 0}
                  </span>
                  <span className="ml-1">new this period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="clicks" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="clicks">Clicks</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search URLs..."
              className="max-w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="clicks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
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
                      <p>This chart shows the number of clicks your URLs received over time.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                    </div>
                  </div>
                ) : overview.dailyData.length === 0 ? (
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">No data available for this time period</p>
                    </div>
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
                      showXAxis={true}
                      showYAxis={true}
                      yAxisWidth={55}
                      valueFormatter={clicksFormatter}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <div>Updated {isLoading ? "..." : "just now"}</div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    Premium
                  </Badge>
                  <span>Real-time data available</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing URLs</CardTitle>
                <CardDescription>URLs with the most clicks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                ) : filteredTopUrls.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No URLs found</p>
                  </div>
                ) : (
                  filteredTopUrls.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mr-2">
                            <LinkIcon className="h-4 w-4" />
                          </div>
                          <div className="font-medium truncate max-w-[150px]">{item.url}</div>
                        </div>
                        <div className="font-semibold">{item.clicks.toLocaleString()}</div>
                      </div>
                      <ProgressBar
                        value={item.clicks}
                        className="h-1"
                        color="purple"
                      />
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All URLs
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Click Distribution</CardTitle>
              <CardDescription>How your clicks are distributed across different metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-40 w-full rounded-lg" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TremorCard className="max-w-full">
                    <Title>Device Type</Title>
                    <DonutChart
                      data={audience.deviceData}
                      category="value"
                      index="name"
                      colors={["purple", "indigo", "violet"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-40 mt-4"
                    />
                  </TremorCard>
                  <TremorCard className="max-w-full">
                    <Title>Top Locations</Title>
                    <DonutChart
                      data={audience.locationData}
                      category="value"
                      index="name"
                      colors={["purple", "indigo", "violet", "fuchsia", "pink", "rose"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-40 mt-4"
                    />
                  </TremorCard>
                  <TremorCard className="max-w-full">
                    <Title>Traffic Sources</Title>
                    <DonutChart
                      data={audience.referrerData}
                      category="value"
                      index="name"
                      colors={["purple", "indigo", "violet", "fuchsia", "pink"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-40 mt-4"
                    />
                  </TremorCard>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Daily earnings for the selected period</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This chart shows your earnings from URL clicks over time.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                    </div>
                  </div>
                ) : overview.dailyData.length === 0 ? (
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">No data available for this time period</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[350px] py-4">
                    <AreaChart
                      data={overview.dailyData}
                      index="date"
                      categories={["earnings"]}
                      colors={["purple"]}
                      className="h-full"
                      showLegend={false}
                      showXAxis={true}
                      showYAxis={true}
                      yAxisWidth={55}
                      valueFormatter={valueFormatter}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <div>Updated {isLoading ? "..." : "just now"}</div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    Premium
                  </Badge>
                  <span>Real-time data available</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Earning URLs</CardTitle>
                <CardDescription>URLs with the highest earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                ) : filteredTopUrls.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No URLs found</p>
                  </div>
                ) : (
                  filteredTopUrls.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mr-2">
                            <LinkIcon className="h-4 w-4" />
                          </div>
                          <div className="font-medium truncate max-w-[150px]">{item.url}</div>
                        </div>
                        <div className="font-semibold">${Number(item.earnings || 0).toFixed(2)}</div>
                      </div>
                      <ProgressBar
                        value={Number(item.earnings || 0)}
                        className="h-1"
                        color="purple"
                      />
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All URLs
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-4">
            <button
              className="flex items-center text-sm text-muted-foreground"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              {showDetails ? "Hide payment details" : "Show payment details"}
            </button>

            {showDetails && (
              <div className="mt-4 bg-muted/30 p-6 rounded-lg text-sm space-y-4 border">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Payment Information</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-1">Payment Processing</p>
                    <p className="text-muted-foreground">
                      Payments are typically processed within 24 hours after request.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Transaction Fees</p>
                    <p className="text-muted-foreground">A 2.9% + $0.30 fee is applied to each transaction.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Payout Schedule</p>
                    <p className="text-muted-foreground">
                      Payouts are automatically processed every 30 days, provided your balance exceeds $5.00.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Payment Methods</p>
                    <p className="text-muted-foreground">
                      We support PayPal, bank transfers, and cryptocurrency payments.
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Full Payment Terms
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>Understand who is clicking on your links</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-8">
                    {Array(2)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="space-y-4">
                          <Skeleton className="h-6 w-32" />
                          {Array(5)
                            .fill(0)
                            .map((_, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <Skeleton className="h-4 w-16" />
                                  <Skeleton className="h-4 w-8" />
                                </div>
                                <Skeleton className="h-1 w-full" />
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <div className="font-medium">Age Groups</div>
                        <div className="text-muted-foreground">Percentage</div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>18-24</div>
                            <div>22%</div>
                          </div>
                          <ProgressBar value={22} className="h-1" color="purple" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>25-34</div>
                            <div>38%</div>
                          </div>
                          <ProgressBar value={38} className="h-1" color="purple" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>35-44</div>
                            <div>27%</div>
                          </div>
                          <ProgressBar value={27} className="h-1" color="purple" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>45-54</div>
                            <div>10%</div>
                          </div>
                          <ProgressBar value={10} className="h-1" color="purple" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>55+</div>
                            <div>3%</div>
                          </div>
                          <ProgressBar value={3} className="h-1" color="purple" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <div className="font-medium">Gender</div>
                        <div className="text-muted-foreground">Percentage</div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>Male</div>
                            <div>54%</div>
                          </div>
                          <ProgressBar value={54} className="h-1" color="indigo" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>Female</div>
                            <div>42%</div>
                          </div>
                          <ProgressBar value={42} className="h-1" color="pink" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>Other</div>
                            <div>4%</div>
                          </div>
                          <ProgressBar value={4} className="h-1" color="violet" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Where your audience is located</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-16 w-32" />
                      <Skeleton className="h-16 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-32" />
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{audience.totalClicks}</div>
                        <div className="text-xs text-muted-foreground">Total clicks analyzed</div>
                      </div>
                      <div className="h-16 w-16">
                        <Globe className="h-16 w-16 text-primary/20" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm font-medium">Top Countries</div>
                      {audience.locationData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 text-center text-xs font-medium text-muted-foreground">{index + 1}</div>
                            <div>{item.name}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-muted-foreground">
                              {Math.round((item.value / 100) * audience.totalClicks)} clicks
                            </div>
                            <Badge variant="outline">{item.value}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Full Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Insights</CardTitle>
          <CardDescription>AI-powered insights to help you optimize your links</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} className="h-32 w-full" />
                ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="font-medium">Performance Trend</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {overview.clicksPercentChange > 0
                    ? `Your click-through rate has increased by ${Math.abs(overview.clicksPercentChange).toFixed(1)}% compared to last period. Keep up the good work!`
                    : `Your click-through rate has decreased by ${Math.abs(overview.clicksPercentChange).toFixed(1)}% compared to last period. Consider optimizing your links.`}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="font-medium">Audience Insight</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {audience.deviceData.length > 0 && audience.deviceData[0].value > 40
                    ? `Most of your traffic (${audience.deviceData[0].value}%) comes from ${audience.deviceData[0].name.toLowerCase()} devices. Consider optimizing your landing pages for these users.`
                    : "Your traffic is well-distributed across different device types. Continue providing a responsive experience."}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div className="font-medium">Distribution Strategy</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {audience.referrerData.length > 0
                    ? `${audience.referrerData[0].name} drives ${audience.referrerData[0].value}% of your clicks. Focus on sharing more links on these platforms for better results.`
                    : "Try diversifying your link distribution channels to reach a wider audience."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate More Insights
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
