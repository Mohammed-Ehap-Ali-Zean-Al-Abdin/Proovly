"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { DecodedToken } from "@/lib/auth"

interface ProfileSettingsProps {
  user: DecodedToken
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: user.email,
    phone: "",
    bio: "",
    website: "",
    location: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update profile")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Profile Information</h2>

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
            <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input id="email" name="email" type="email" value={formData.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-foreground">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-foreground">
              Location
            </label>
            <Input
              id="location"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <label htmlFor="website" className="block text-sm font-medium text-foreground">
            Website
          </label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-foreground">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
