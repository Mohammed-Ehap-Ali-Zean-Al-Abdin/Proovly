"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Heart, DollarSign } from "lucide-react"

interface StatisticsCardsProps {
  role: "donor" | "ngo" | "admin"
}

export function StatisticsCards({ role }: StatisticsCardsProps) {
  const stats = {
    donor: [
      {
        label: "Total Donated",
        value: "$12,450",
        change: "+12.5%",
        icon: DollarSign,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Active Causes",
        value: "8",
        change: "+2 this month",
        icon: Heart,
        color: "bg-teal-50 text-teal-600",
      },
      {
        label: "Impact Score",
        value: "8.5/10",
        change: "+0.5 points",
        icon: TrendingUp,
        color: "bg-purple-50 text-purple-600",
      },
      {
        label: "Lives Impacted",
        value: "1,240",
        change: "+340 this month",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
      },
    ],
    ngo: [
      {
        label: "Total Raised",
        value: "$245,680",
        change: "+28.3%",
        icon: DollarSign,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Active Donors",
        value: "1,240",
        change: "+156 this month",
        icon: Users,
        color: "bg-teal-50 text-teal-600",
      },
      {
        label: "Projects Funded",
        value: "12",
        change: "+3 this month",
        icon: Heart,
        color: "bg-purple-50 text-purple-600",
      },
      {
        label: "Beneficiaries",
        value: "8,450",
        change: "+1,200 this month",
        icon: TrendingUp,
        color: "bg-blue-50 text-blue-600",
      },
    ],
    admin: [
      {
        label: "Total Donations",
        value: "$2.5B+",
        change: "+15.2%",
        icon: DollarSign,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Active ngos",
        value: "50K+",
        change: "+2.3K this month",
        icon: Users,
        color: "bg-teal-50 text-teal-600",
      },
      {
        label: "Active Donors",
        value: "1M+",
        change: "+125K this month",
        icon: Heart,
        color: "bg-purple-50 text-purple-600",
      },
      {
        label: "Platform Health",
        value: "98%",
        change: "+2% this month",
        icon: TrendingUp,
        color: "bg-blue-50 text-blue-600",
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
                <p className="text-xs text-teal-600 mt-2">{stat.change}</p>
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
