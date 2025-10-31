"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { PreferencesSettings } from "@/components/settings/preferences-settings"
import { BillingSettings } from "@/components/settings/billing-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"

export default function SettingsPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, preferences, and security settings</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            {user.role === "organization" && <TabsTrigger value="billing">Billing</TabsTrigger>}
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings user={user} />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettings user={user} />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings user={user} />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <PreferencesSettings user={user} />
          </TabsContent>

          {user.role === "organization" && (
            <TabsContent value="billing" className="space-y-4">
              <BillingSettings user={user} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
