import { Suspense } from "react"

import { UrlsSkeleton } from "@/components/skeletons/urls-skeleton"
import UrlsContent from "@/components/dashboard/urls-content"

export default function UrlsPage() {
  return (
    <Suspense fallback={<UrlsSkeleton />}>
      <UrlsContent />
    </Suspense>
  )
}
