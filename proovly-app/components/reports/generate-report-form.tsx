"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GenerateReportFormProps {
  role: "donor" | "ngo" | "admin"
  userId: string
  onReportGenerated: () => void
}

export function GenerateReportForm({ role, userId, onReportGenerated }: GenerateReportFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    reportType: "summary",
    startDate: "",
    endDate: "",
    title: "",
    includeCharts: true,
    exportFormat: "pdf",
    notes: "",
  })

  const reportTypes = {
    donor: [
      { value: "summary", label: "Donation Summary" },
      { value: "impact", label: "Impact Report" },
      { value: "tax", label: "Tax Summary" },
      { value: "detailed", label: "Detailed Transactions" },
    ],
    ngo: [
      { value: "summary", label: "Fundraising Summary" },
      { value: "impact", label: "Impact Report" },
      { value: "donor", label: "Donor Analysis" },
      { value: "financial", label: "Financial Report" },
    ],
    admin: [
      { value: "platform", label: "Platform Overview" },
      { value: "compliance", label: "Compliance Report" },
      { value: "financial", label: "Financial Summary" },
      { value: "user", label: "User Analytics" },
    ],
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.startDate || !formData.endDate) {
        throw new Error("Please select both start and end dates")
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        throw new Error("Start date must be before end date")
      }

      // Call API to generate report
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          userId,
          role,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to generate report")
      }

      const data = await response.json()

      // Handle file download
      if (data.fileUrl) {
        const link = document.createElement("a")
        link.href = data.fileUrl
        link.download = `report-${Date.now()}.${formData.exportFormat}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setSuccess(true)
      onReportGenerated()

      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          reportType: "summary",
          startDate: "",
          endDate: "",
          title: "",
          includeCharts: true,
          exportFormat: "pdf",
          notes: "",
        })
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Generate New Report</h2>

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
            <AlertDescription className="text-green-800">
              Report generated and downloaded successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Report Type */}
          <div className="space-y-2">
            <label htmlFor="reportType" className="block text-sm font-medium text-foreground">
              Report Type *
            </label>
            <select
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              {reportTypes[role].map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <label htmlFor="exportFormat" className="block text-sm font-medium text-foreground">
              Export Format *
            </label>
            <select
              id="exportFormat"
              name="exportFormat"
              value={formData.exportFormat}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-foreground">
              Start Date *
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-medium text-foreground">
              End Date *
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Report Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Report Title (Optional)
          </label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Q4 2024 Impact Report"
            value={formData.title}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Include Charts */}
        <div className="flex items-center gap-3">
          <input
            id="includeCharts"
            name="includeCharts"
            type="checkbox"
            checked={formData.includeCharts}
            onChange={handleInputChange}
            disabled={isLoading}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="includeCharts" className="text-sm font-medium text-foreground cursor-pointer">
            Include charts and visualizations
          </label>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium text-foreground">
            Additional Notes (Optional)
          </label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Add any additional information or context for this report..."
            value={formData.notes}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() =>
              setFormData({
                reportType: "summary",
                startDate: "",
                endDate: "",
                title: "",
                includeCharts: true,
                exportFormat: "pdf",
                notes: "",
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
