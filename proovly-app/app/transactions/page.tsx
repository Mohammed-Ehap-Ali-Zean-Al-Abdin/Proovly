"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { TransactionStats } from "@/components/transactions/transaction-stats"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { Spinner } from "@/components/ui/spinner"

export default function TransactionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    searchTerm: "",
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            {user.role === "donor"
              ? "Track all your donation transactions"
              : user.role === "organization"
                ? "Monitor incoming and outgoing transactions"
                : "View all platform transactions"}
          </p>
        </div>

        {/* Statistics */}
        <TransactionStats role={user.role} />

        {/* Filters */}
        <TransactionFilters filters={filters} setFilters={setFilters} />

        {/* Transactions List */}
        <TransactionsList role={user.role} userId={user.sub} filters={filters} />
      </main>
    </div>
  )
}
