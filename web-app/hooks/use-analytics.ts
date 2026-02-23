"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

// Types for our analytics data
export interface OverviewData {
  balance: number
  totalClicks: number
  totalEarnings: number
  clicksPercentChange: number
  earningsPercentChange: number
  activeUrlsCount: number
  newUrlsCount: number
  avgEarningsPerClick: number
  dailyData: Array<{
    date: string
    clicks: number
    earnings: number
  }>
}

export interface TopUrlData {
  url: string
  originalUrl: string
  clicks: number
  earnings: number
  totalClicks: number
  totalEarnings: number
}

export interface AudienceData {
  deviceData: Array<{ name: string; value: number }>
  referrerData: Array<{ name: string; value: number }>
  locationData: Array<{ name: string; value: number }>
  totalClicks: number
}

// Initial states
const initialOverviewData: OverviewData = {
  balance: 0,
  totalClicks: 0,
  totalEarnings: 0,
  clicksPercentChange: 0,
  earningsPercentChange: 0,
  activeUrlsCount: 0,
  newUrlsCount: 0,
  avgEarningsPerClick: 0,
  dailyData: [],
}

const initialAudienceData: AudienceData = {
  deviceData: [],
  referrerData: [],
  locationData: [],
  totalClicks: 0,
}

import { useAuth } from "@/components/auth-context"

// Hook for fetching overview data
export function useAnalyticsOverview(timeRange: string) {
  const { toast } = useToast()
  const { token } = useAuth()
  const [data, setData] = useState<OverviewData>(initialOverviewData)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (refresh = false) => {
    if (!token) return
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)

    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/overview?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch overview data")
      }
      const overviewData = await response.json()
      setData(overviewData)
    } catch (error) {
      console.error("Error fetching analytics overview:", error)
      setError("Failed to load analytics data")
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeRange, token])


  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchData(true),
  }
}

// Hook for fetching top URLs data
export function useTopUrls(timeRange: string, metric = "clicks", limit = 5) {
  const { toast } = useToast()
  const { token } = useAuth()
  const [data, setData] = useState<TopUrlData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/top-urls?timeRange=${timeRange}&metric=${metric}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch top URLs data")
      }
      const topUrlsData = await response.json()
      setData(topUrlsData)
    } catch (error) {
      console.error("Error fetching top URLs:", error)
      setError("Failed to load top URLs data")
      toast({
        title: "Error",
        description: "Failed to load top URLs data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeRange, metric, limit, token])

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  }
}

// Hook for fetching audience data
export function useAudienceData(timeRange: string) {
  const { toast } = useToast()
  const { token } = useAuth()
  const [data, setData] = useState<AudienceData>(initialAudienceData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/audience?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch audience data")
      }
      const audienceData = await response.json()
      setData(audienceData)
    } catch (error) {
      console.error("Error fetching audience data:", error)
      setError("Failed to load audience data")
      toast({
        title: "Error",
        description: "Failed to load audience data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeRange, token])


  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  }
}

// Combined hook for all analytics data
export function useAnalytics(timeRange: string) {
  const overview = useAnalyticsOverview(timeRange)
  const topUrls = useTopUrls(timeRange)
  const audience = useAudienceData(timeRange)

  const isLoading = overview.isLoading || topUrls.isLoading || audience.isLoading
  const isRefreshing = overview.isRefreshing

  const refreshAll = () => {
    overview.refresh()
    topUrls.refresh()
    audience.refresh()
  }

  return {
    overview: overview.data,
    topUrls: topUrls.data,
    audience: audience.data,
    isLoading,
    isRefreshing,
    refresh: refreshAll,
  }
}
