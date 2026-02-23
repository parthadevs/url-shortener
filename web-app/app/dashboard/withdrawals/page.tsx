"use client"

import { Suspense } from "react"

import { WithdrawalsSkeleton } from "@/components/skeletons/withdrawals-skeleton"
import WithdrawalsContent from "@/components/dashboard/withdrawals-content"

export default function WithdrawalsPage() {
  return (
    <Suspense fallback={<WithdrawalsSkeleton />}>
      <WithdrawalsContent />
    </Suspense>
  )
}
