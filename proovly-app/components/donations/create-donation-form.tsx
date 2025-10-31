"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"
import type { User } from "@/lib/types"

interface CreateDonationFormProps {
  role: "donor" | "ngo"
  userId: string
}

export function CreateDonationForm({ role, userId }: CreateDonationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hederaDetails, setHederaDetails] = useState<{
    txId: string
    htsTxId?: string
    mirrorUrl: string
    message?: string
  } | null>(null)
  const [ngos, setNgos] = useState<User[]>([])
  const [loadingNgos, setLoadingNgos] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    cause: "",
    description: "",
    ngoId: "",
  })

  // Fetch NGOs when component mounts (for donor role)
  useEffect(() => {
    if (role === "donor") {
      fetchNgos()
    }
  }, [role])

  const fetchNgos = async () => {
    try {
      setLoadingNgos(true)
      const ngoList = await apiClient.users.list({ role: "ngo", limit: 100 })
      setNgos(ngoList)
    } catch (err) {
      console.error("Failed to load NGOs:", err)
      setError("Failed to load ngos. Please try again.")
    } finally {
      setLoadingNgos(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // No file upload for MVP – backend expects JSON only

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.amount || !formData.cause) {
        throw new Error("Please fill in all required fields")
      }

      if (role === "donor" && !formData.ngoId) {
        throw new Error("Please select an ngo")
      }

      // Call backend via typed API client
      const response = await apiClient.donations.create({
        donorId: userId,
        // Using "cause" as a simple campaign identifier for MVP
        campaignId: formData.cause || "general",
        amountUSD: Number(formData.amount),
        currency: "USD",
      })

      // Extract Hedera transaction details from response
      if (response.hederaHcsTxId && response.mirrorUrl) {
        setHederaDetails({
          txId: response.hederaHcsTxId,
          htsTxId: response.htsTxId,
          mirrorUrl: response.mirrorUrl,
          message: response.message,
        })
      }

      setSuccess(true)
      setFormData({
        amount: "",
        cause: "",
        description: "",
        ngoId: "",
      })

      // Keep success message visible longer to show Hedera details
      setTimeout(() => {
        setSuccess(false)
        setHederaDetails(null)
      }, 10000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {role === "donor" ? "Make a Donation" : "Create Donation Record"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-semibold">✅ Donation created successfully!</p>
                {hederaDetails && (
                  <div className="text-sm space-y-2">
                    <p className="text-green-700">{hederaDetails.message}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">HCS Proof:</span>
                        <span className="font-mono text-xs bg-green-100 px-2 py-1 rounded">
                          {hederaDetails.txId}
                        </span>
                        <a
                          href={hederaDetails.mirrorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-xs"
                        >
                          View on Explorer →
                        </a>
                      </div>
                      {hederaDetails.htsTxId && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Token:</span>
                          <span className="font-mono text-xs bg-purple-100 px-2 py-1 rounded">
                            {hederaDetails.htsTxId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-foreground">
              Amount (USD) *
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="1000"
              value={formData.amount}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              min="1"
              step="0.01"
            />
          </div>

          {/* Cause */}
          <div className="space-y-2">
            <label htmlFor="cause" className="block text-sm font-medium text-foreground">
              Cause/Category *
            </label>
            <Input
              id="cause"
              name="cause"
              placeholder="e.g., Education, Healthcare, Environment"
              value={formData.cause}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* ngo Selection (for donors) */}
        {role === "donor" && (
          <div className="space-y-2">
            <label htmlFor="ngoId" className="block text-sm font-medium text-foreground">
              ngo *
            </label>
            <select
              id="ngoId"
              name="ngoId"
              value={formData.ngoId}
              onChange={handleInputChange}
              disabled={isLoading || loadingNgos}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">
                {loadingNgos ? "Loading ngos..." : "Select an ngo"}
              </option>
              {ngos.map((ngo) => (
                <option key={ngo._id} value={ngo._id}>
                  {ngo.name} ({ngo.email})
                </option>
              ))}
            </select>
            {ngos.length === 0 && !loadingNgos && (
              <p className="text-sm text-muted-foreground">
                No ngos available. Please contact support.
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Add any additional details about this donation..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={4}
          />
        </div>

        {/* File Upload removed in MVP */}

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Donation"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() =>
              setFormData({
                amount: "",
                cause: "",
                description: "",
                ngoId: "",
              })
            }
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  )
}
