"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ReportsList } from "@/components/reports/reports-list"
import { GenerateReportForm } from "@/components/reports/generate-report-form"
import { ReportStats } from "@/components/reports/report-stats"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  const handleReportGenerated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-2">
            {user.role === "donor"
              ? "Generate and view your donation reports"
              : user.role === "ngo"
                ? "Create impact and fundraising reports"
                : "Access comprehensive platform reports"}
          </p>
        </div>

        {/* Statistics */}
        <ReportStats role={user.role} />

        {/* Main Content */}
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <GenerateReportForm role={user.role} userId={user.sub} onReportGenerated={handleReportGenerated} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <ReportsList role={user.role} userId={user.sub} refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
