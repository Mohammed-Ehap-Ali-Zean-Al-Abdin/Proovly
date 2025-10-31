"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatisticsCards } from "@/components/dashboard/statistics-cards"
import { DonationChart } from "@/components/dashboard/donation-chart"
import { ImpactMetrics } from "@/components/dashboard/impact-metrics"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Cards */}
        <StatisticsCards role={user.role} />

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DonationChart role={user.role} />
          </div>
          <div>
            <ImpactMetrics role={user.role} />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity role={user.role} />
      </main>
    </div>
  )
}
