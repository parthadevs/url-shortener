"use client"

import { Suspense } from "react"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import ProfileContent from "@/components/dashboard/profile-content"

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  )
}
