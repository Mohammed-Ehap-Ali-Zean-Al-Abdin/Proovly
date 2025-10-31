"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { DecodedToken } from "@/lib/auth"

interface NotificationSettingsProps {
  user: DecodedToken
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    donationUpdates: true,
    transactionAlerts: true,
    reportNotifications: true,
    weeklyDigest: true,
    marketingEmails: false,
  })

  const handleToggle = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/notification-preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to save preferences")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const notificationOptions = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive email notifications for important updates",
    },
    {
      key: "donationUpdates",
      label: "Donation Updates",
      description: "Get notified when donations are received or processed",
    },
    {
      key: "transactionAlerts",
      label: "Transaction Alerts",
      description: "Receive alerts for all transaction activities",
    },
    {
      key: "reportNotifications",
      label: "Report Notifications",
      description: "Get notified when reports are ready for download",
    },
    {
      key: "weeklyDigest",
      label: "Weekly Digest",
      description: "Receive a weekly summary of your activities",
    },
    {
      key: "marketingEmails",
      label: "Marketing Emails",
      description: "Receive promotional content and updates",
    },
  ]

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Notification Preferences</h2>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Preferences saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 mb-6">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <button
              onClick={() => handleToggle(option.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences[option.key as keyof typeof preferences] ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences[option.key as keyof typeof preferences] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </Card>
  )
}
