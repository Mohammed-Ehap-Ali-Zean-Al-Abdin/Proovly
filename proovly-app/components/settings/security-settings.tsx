"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { DecodedToken } from "@/lib/auth"

interface SecuritySettingsProps {
  user: DecodedToken
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to change password")
      }

      setSuccess(true)
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Password changed successfully!</AlertDescription>
            </Alert>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground">
              Current Password
            </label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">At least 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Two-Factor Authentication</h2>
        <p className="text-muted-foreground mb-6">Add an extra layer of security to your account</p>
        <Button variant="outline" className="bg-transparent">
          Enable Two-Factor Authentication
        </Button>
      </Card>

      {/* Active Sessions */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Active Sessions</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Current Session</p>
              <p className="text-sm text-muted-foreground">Last active: Just now</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">Active</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
