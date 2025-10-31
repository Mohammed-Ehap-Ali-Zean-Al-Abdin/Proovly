"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Eye, Download, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  amount: number
  type: "donation" | "withdrawal" | "refund"
  status: "completed" | "pending" | "failed"
  date: string
  description: string
  fromName?: string
  toName?: string
  reference?: string
}

interface TransactionsListProps {
  role: "donor" | "organization" | "admin"
  userId: string
  filters: {
    status: string
    dateRange: string
    searchTerm: string
  }
}

export function TransactionsList({ role, userId, filters }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [userId, role, filters])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams()
      if (filters.status !== "all") params.append("status", filters.status)
      if (filters.dateRange !== "all") params.append("dateRange", filters.dateRange)
      if (filters.searchTerm) params.append("search", filters.searchTerm)

      const endpoint =
        role === "admin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/transactions?${params.toString()}`
          : `${process.env.NEXT_PUBLIC_API_URL}/transactions?userId=${userId}&${params.toString()}`

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "donation":
        return "↓"
      case "withdrawal":
        return "↑"
      case "refund":
        return "↻"
      default:
        return "→"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "donation":
        return "text-green-600"
      case "withdrawal":
        return "text-red-600"
      case "refund":
        return "text-blue-600"
      default:
        return "text-gray-600"
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
        <Button onClick={fetchTransactions} variant="outline" className="mt-4 bg-transparent">
          Retry
        </Button>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No transactions found</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search criteria</p>
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
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              {role === "admin" && <TableHead>From</TableHead>}
              {role === "admin" && <TableHead>To</TableHead>}
              {role !== "admin" && <TableHead>Party</TableHead>}
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-sm">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
                    {getTypeIcon(transaction.type)}{" "}
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{transaction.description}</TableCell>
                {role === "admin" && <TableCell className="text-sm">{transaction.fromName || "N/A"}</TableCell>}
                {role === "admin" && <TableCell className="text-sm">{transaction.toName || "N/A"}</TableCell>}
                {role !== "admin" && (
                  <TableCell className="text-sm">
                    {role === "donor" ? transaction.toName || "N/A" : transaction.fromName || "N/A"}
                  </TableCell>
                )}
                <TableCell className="text-right font-semibold">
                  {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" title="View details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download receipt">
                      <Download className="h-4 w-4" />
                    </Button>
                    {transaction.status === "pending" && (
                      <Button variant="ghost" size="sm" title="Retry transaction">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="px-6 py-4 border-t border-border text-sm text-muted-foreground">
        Showing {transactions.length} transactions
      </div>
    </Card>
  )
}
