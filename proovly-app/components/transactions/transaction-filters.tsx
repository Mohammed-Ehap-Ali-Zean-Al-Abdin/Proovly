"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface TransactionFiltersProps {
  filters: {
    status: string
    dateRange: string
    searchTerm: string
  }
  setFilters: (filters: any) => void
}

export function TransactionFilters({ filters, setFilters }: TransactionFiltersProps) {
  const handleStatusChange = (status: string) => {
    setFilters({ ...filters, status })
  }

  const handleDateRangeChange = (dateRange: string) => {
    setFilters({ ...filters, dateRange })
  }

  const handleSearchChange = (searchTerm: string) => {
    setFilters({ ...filters, searchTerm })
  }

  const handleReset = () => {
    setFilters({
      status: "all",
      dateRange: "all",
      searchTerm: "",
    })
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by transaction ID, amount, or description..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {["all", "completed", "pending", "failed"].map((status) => (
                <Button
                  key={status}
                  variant={filters.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                  className={filters.status === status ? "bg-blue-600 hover:bg-blue-700" : "bg-transparent"}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
            <div className="flex flex-wrap gap-2">
              {["all", "today", "week", "month", "year"].map((range) => (
                <Button
                  key={range}
                  variant={filters.dateRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateRangeChange(range)}
                  className={filters.dateRange === range ? "bg-blue-600 hover:bg-blue-700" : "bg-transparent"}
                >
                  {range === "all" ? "All Time" : range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        {(filters.status !== "all" || filters.dateRange !== "all" || filters.searchTerm !== "") && (
          <Button variant="outline" size="sm" onClick={handleReset} className="bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}
      </div>
    </Card>
  )
}
