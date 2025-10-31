"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { DecodedToken } from "@/lib/auth"

interface PreferencesSettingsProps {
  user: DecodedToken
}

export function PreferencesSettings({ user }: PreferencesSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC",
    theme: "light",
    currency: "USD",
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/preferences`, {
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

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Preferences</h2>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Preferences saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Language */}
        <div className="space-y-2">
          <label htmlFor="language" className="block text-sm font-medium text-foreground">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={preferences.language}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="de">Deutsch (German)</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label htmlFor="timezone" className="block text-sm font-medium text-foreground">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={preferences.timezone}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time (EST)</option>
            <option value="CST">Central Time (CST)</option>
            <option value="MST">Mountain Time (MST)</option>
            <option value="PST">Pacific Time (PST)</option>
            <option value="GMT">GMT</option>
            <option value="CET">Central European Time (CET)</option>
            <option value="IST">Indian Standard Time (IST)</option>
            <option value="JST">Japan Standard Time (JST)</option>
          </select>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <label htmlFor="theme" className="block text-sm font-medium text-foreground">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label htmlFor="currency" className="block text-sm font-medium text-foreground">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={preferences.currency}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="SAR">SAR (﷼)</option>
          </select>
        </div>
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="mt-6 bg-blue-600 hover:bg-blue-700">
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
