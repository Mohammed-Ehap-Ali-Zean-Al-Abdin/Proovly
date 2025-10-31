"use client"

import { Card } from "@/components/ui/card"
import { FileText, BarChart3, TrendingUp, Clock } from "lucide-react"

interface ReportStatsProps {
  role: "donor" | "organization" | "admin"
}

export function ReportStats({ role }: ReportStatsProps) {
  const stats = {
    donor: [
      {
        label: "Reports Generated",
        value: "12",
        change: "+3 this month",
        icon: FileText,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Total Impact",
        value: "$12,450",
        change: "Across all donations",
        icon: TrendingUp,
        color: "bg-green-50 text-green-600",
      },
      {
        label: "Causes Supported",
        value: "8",
        change: "Active causes",
        icon: BarChart3,
        color: "bg-purple-50 text-purple-600",
      },
      {
        label: "Last Report",
        value: "2 days ago",
        change: "Monthly summary",
        icon: Clock,
        color: "bg-teal-50 text-teal-600",
      },
    ],
    organization: [
      {
        label: "Reports Generated",
        value: "45",
        change: "+12 this month",
        icon: FileText,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Total Raised",
        value: "$245,680",
        change: "Across all campaigns",
        icon: TrendingUp,
        color: "bg-green-50 text-green-600",
      },
      {
        label: "Beneficiaries",
        value: "8,450",
        change: "Lives impacted",
        icon: BarChart3,
        color: "bg-purple-50 text-purple-600",
      },
      {
        label: "Last Report",
        value: "1 day ago",
        change: "Impact summary",
        icon: Clock,
        color: "bg-teal-50 text-teal-600",
      },
    ],
    admin: [
      {
        label: "Reports Generated",
        value: "1.2K+",
        change: "+250 this month",
        icon: FileText,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Platform Volume",
        value: "$2.5B+",
        change: "Total donations",
        icon: TrendingUp,
        color: "bg-green-50 text-green-600",
      },
      {
        label: "Active Reports",
        value: "342",
        change: "Scheduled reports",
        icon: BarChart3,
        color: "bg-purple-50 text-purple-600",
      },
      {
        label: "System Health",
        value: "99.8%",
        change: "Uptime",
        icon: Clock,
        color: "bg-teal-50 text-teal-600",
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
