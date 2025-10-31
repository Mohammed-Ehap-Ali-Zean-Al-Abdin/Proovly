"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Clock } from "lucide-react"

interface TransactionStatsProps {
  role: "donor" | "organization" | "admin"
}

export function TransactionStats({ role }: TransactionStatsProps) {
  const stats = {
    donor: [
      {
        label: "Total Spent",
        value: "$12,450",
        change: "+12.5%",
        icon: ArrowUpRight,
        color: "bg-red-50 text-red-600",
      },
      {
        label: "Transactions",
        value: "24",
        change: "+5 this month",
        icon: TrendingUp,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Pending",
        value: "2",
        change: "Awaiting confirmation",
        icon: Clock,
        color: "bg-yellow-50 text-yellow-600",
      },
      {
        label: "Avg Transaction",
        value: "$519",
        change: "+$45 this month",
        icon: TrendingUp,
        color: "bg-teal-50 text-teal-600",
      },
    ],
    organization: [
      {
        label: "Total Received",
        value: "$245,680",
        change: "+28.3%",
        icon: ArrowDownLeft,
        color: "bg-green-50 text-green-600",
      },
      {
        label: "Transactions",
        value: "342",
        change: "+45 this month",
        icon: TrendingUp,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Pending",
        value: "8",
        change: "Awaiting processing",
        icon: Clock,
        color: "bg-yellow-50 text-yellow-600",
      },
      {
        label: "Avg Transaction",
        value: "$718",
        change: "+$120 this month",
        icon: TrendingUp,
        color: "bg-teal-50 text-teal-600",
      },
    ],
    admin: [
      {
        label: "Total Volume",
        value: "$2.5B+",
        change: "+15.2%",
        icon: TrendingUp,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Transactions",
        value: "50M+",
        change: "+5M this month",
        icon: TrendingUp,
        color: "bg-teal-50 text-teal-600",
      },
      {
        label: "Pending",
        value: "1.2K",
        change: "Awaiting verification",
        icon: Clock,
        color: "bg-yellow-50 text-yellow-600",
      },
      {
        label: "Success Rate",
        value: "99.8%",
        change: "+0.1% this month",
        icon: TrendingUp,
        color: "bg-green-50 text-green-600",
      },
    ],
  }

  const currentStats = stats[role]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {currentStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
