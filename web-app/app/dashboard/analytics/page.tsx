"use client"

import { Suspense } from "react"
import { AnalyticsSkeleton } from "@/components/skeletons/analytics-skeleton"
import AnalyticsContent from "@/components/dashboard/analytics-content"

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  )
}
