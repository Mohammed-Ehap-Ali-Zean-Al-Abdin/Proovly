"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Eye, Download, Trash2, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient } from "@/lib/api-client"
import type { Donation, UserRole } from "@/lib/types"

interface DonationsListProps {
  role: UserRole
  userId: string
}

export function DonationsList({ role, userId }: DonationsListProps) {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDonations()
  }, [userId, role])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = role === "admin" ? {} : { userId }
      const data = await apiClient.donations.list(params)
      setDonations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (donationId: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return

    try {
      await apiClient.donations.delete(donationId)
      setDonations((prev) => prev.filter((d) => d._id !== donationId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete donation")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "funded":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        <Button onClick={fetchDonations} variant="outline" className="mt-4 bg-transparent">
          Retry
        </Button>
      </Card>
    )
  }

  if (donations.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No donations found</p>
        <p className="text-sm text-muted-foreground mt-2">
          {role === "donor" ? "Start by making your first donation" : "No donations to display"}
        </p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Cause</TableHead>
              {role === "admin" && <TableHead>Donor</TableHead>}
              {role === "admin" && <TableHead>NGO</TableHead>}
              {role === "donor" && <TableHead>NGO</TableHead>}
              {role === "ngo" && <TableHead>Donor</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation._id}>
                <TableCell className="text-sm">{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold">${donation.amountUSD.toLocaleString()}</TableCell>
                <TableCell>{donation.campaign?.title || donation.campaignId}</TableCell>
                {role === "admin" && <TableCell className="text-sm">{donation.donor?.name || "N/A"}</TableCell>}
                {role === "admin" && <TableCell className="text-sm">{donation.recipient?.name || "N/A"}</TableCell>}
                {role === "donor" && <TableCell className="text-sm">{donation.recipient?.name || "N/A"}</TableCell>}
                {role === "ngo" && <TableCell className="text-sm">{donation.donor?.name || "N/A"}</TableCell>}
                <TableCell>
                  <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" title="View details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download receipt">
                      <Download className="h-4 w-4" />
                    </Button>
                    {(role === "donor" || role === "admin") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(donation._id)}
                        title="Delete donation"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                    {donation.mirrorUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(donation.mirrorUrl, "_blank")}
                        title="View on Hedera"
                      >
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
