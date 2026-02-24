import { BarChart3, LinkIcon, TrendingUp, Users, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Earnings", icon: TrendingUp },
          { title: "Active URLs", icon: LinkIcon },
          { title: "Total Clicks", icon: Users },
          { title: "Avg. CPC", icon: BarChart3 },
        ].map((stat, idx) => (
          <Card key={idx} className="border-border/50 bg-background/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="rounded-2xl bg-muted p-2.5">
                  <stat.icon className="w-5 h-5 text-muted-foreground/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-background/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-muted">
                <Zap className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <Skeleton className="h-7 w-48" />
            </div>
            <Skeleton className="h-5 w-80" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="grid gap-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 bg-background/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
              <TrendingUp className="w-5 h-5 text-muted-foreground/30" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
