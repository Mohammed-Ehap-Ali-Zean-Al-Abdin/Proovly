"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Download, Eye, Trash2, Share2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Report {
  id: string
  title: string
  type: string
  format: string
  createdAt: string
  fileSize: string
  status: "completed" | "processing" | "failed"
  downloadUrl?: string
}

interface ReportsListProps {
  role: "donor" | "ngo" | "admin"
  userId: string
  refreshTrigger: number
}

export function ReportsList({ role, userId, refreshTrigger }: ReportsListProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
  }, [userId, role, refreshTrigger])

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)

      const endpoint =
        role === "admin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/reports`
          : `${process.env.NEXT_PUBLIC_API_URL}/reports?userId=${userId}`

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch reports")
      }

      const data = await response.json()
      setReports(data.reports || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (report: Report) => {
    if (report.downloadUrl) {
      const link = document.createElement("a")
      link.href = report.downloadUrl
      link.download = `${report.title}.${report.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete report")
      }

      setReports((prev) => prev.filter((r) => r.id !== reportId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete report")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      summary: "Summary",
      impact: "Impact",
      tax: "Tax",
      detailed: "Detailed",
      donor: "Donor Analysis",
      financial: "Financial",
      platform: "Platform",
      compliance: "Compliance",
      user: "User Analytics",
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-800">{error}</p>
        <Button onClick={fetchReports} variant="outline" className="mt-4 bg-transparent">
          Retry
        </Button>
      </Card>
    )
  }

  if (reports.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No reports generated yet</p>
        <p className="text-sm text-muted-foreground mt-2">Create your first report to get started</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.title || "Untitled Report"}</TableCell>
                <TableCell className="text-sm">{getTypeLabel(report.type)}</TableCell>
                <TableCell className="text-sm uppercase">{report.format}</TableCell>
                <TableCell className="text-sm">{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-sm">{report.fileSize}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {report.status === "completed" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(report)}
                          title="Download report"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="View report">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Share report">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)} title="Delete report">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 border-t border-border text-sm text-muted-foreground">
        Showing {reports.length} report{reports.length !== 1 ? "s" : ""}
      </div>
    </Card>
  )
}
