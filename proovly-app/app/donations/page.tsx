"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DonationsList } from "@/components/donations/donations-list"
import { CreateDonationForm } from "@/components/donations/create-donation-form"
import { DonationStats } from "@/components/donations/donation-stats"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DonationsPage() {
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
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donations Management</h1>
          <p className="text-muted-foreground mt-2">
            {user.role === "donor"
              ? "Track and manage your donations"
              : user.role === "ngo"
                ? "Manage donations received by your organization"
                : "Monitor all platform donations"}
          </p>
        </div>

        {/* Statistics */}
        <DonationStats role={user.role} />

        {/* Main Content */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Donations</TabsTrigger>
            {user.role !== "admin" && <TabsTrigger value="create">New Donation</TabsTrigger>}
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <DonationsList role={user.role} userId={user.sub} />
          </TabsContent>

          {user.role !== "admin" && (
            <TabsContent value="create" className="space-y-4">
              <CreateDonationForm role={user.role} userId={user.sub} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
