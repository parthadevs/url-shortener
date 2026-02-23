"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UpgradeContent } from "@/components/dashboard/upgrade-content"
import UpgradeSkeleton from "@/components/skeletons/upgrade-skeleton"
import { Suspense } from "react"

export default function PremiumPage() {
  const router = useRouter()
  const isAccess = false // Replace this with your actual logic

  useEffect(() => {
    if (!isAccess) {
      router.push("/") // Works correctly with next/navigation
    }
  }, [isAccess, router])

  if (!isAccess) {
    return null
  }

  return (
    <Suspense fallback={<UpgradeSkeleton />}>
      <UpgradeContent />
    </Suspense>
  )
}
