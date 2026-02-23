import { Skeleton } from "@/components/ui/skeleton"

export default function PremiumSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="mx-auto mt-4 h-6 w-96" />
      </div>

      <Skeleton className="mx-auto mb-8 h-10 w-64" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <Skeleton className="mb-2 h-6 w-24" />
              <Skeleton className="mb-4 h-8 w-32" />
              <Skeleton className="mb-6 h-4 w-full" />

              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="flex items-center">
                      <Skeleton className="mr-2 h-4 w-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>

              <Skeleton className="mt-6 h-10 w-full" />
            </div>
          ))}
      </div>

      <div className="mt-12 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-lg border p-6">
                <Skeleton className="mx-auto mb-4 h-8 w-8" />
                <Skeleton className="mx-auto mb-4 h-6 w-32" />
                <Skeleton className="mx-auto h-16 w-full" />
              </div>
            ))}
        </div>

        <div className="rounded-lg border p-6">
          <Skeleton className="mb-4 h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-2 h-6 w-48" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
