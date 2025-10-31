"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [loading, user, router])

  if (loading || !user) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Your role: {user.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Manage ingestion, OFD, and analytics from the nav above.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Upload CSV</li>
            <li>Mint OFD</li>
            <li>View Analytics</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>System health</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">All systems nominal.</p>
        </CardContent>
      </Card>
    </div>
  )
}
