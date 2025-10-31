"use client"

import { Card } from "@/components/ui/card"
import { Heart, TrendingUp, Users, Award } from "lucide-react"

interface RecentActivityProps {
  role: "donor" | "organization" | "admin"
}

export function RecentActivity({ role }: RecentActivityProps) {
  const activities = {
    donor: [
      {
        icon: Heart,
        title: "Donation Received",
        description: "Your $500 donation to Clean Water Initiative",
        time: "2 hours ago",
        color: "text-red-600",
      },
      {
        icon: TrendingUp,
        title: "Impact Update",
        description: "Your donations helped 50 families this month",
        time: "1 day ago",
        color: "text-blue-600",
      },
      {
        icon: Award,
        title: "Achievement Unlocked",
        description: "You've reached $10,000 in total donations",
        time: "3 days ago",
        color: "text-purple-600",
      },
    ],
    organization: [
      {
        icon: Users,
        title: "New Donor",
        description: "Jane Smith donated $1,000 to your organization",
        time: "1 hour ago",
        color: "text-blue-600",
      },
      {
        icon: TrendingUp,
        title: "Campaign Milestone",
        description: "Your fundraising campaign reached 75% of goal",
        time: "5 hours ago",
        color: "text-teal-600",
      },
      {
        icon: Heart,
        title: "Project Update",
        description: "Project Alpha has impacted 500 beneficiaries",
        time: "1 day ago",
        color: "text-red-600",
      },
    ],
    admin: [
      {
        icon: Users,
        title: "New Organization",
        description: "Global Health Initiative registered on platform",
        time: "30 minutes ago",
        color: "text-blue-600",
      },
      {
        icon: TrendingUp,
        title: "Platform Milestone",
        description: "Total donations reached $2.5 billion",
        time: "2 hours ago",
        color: "text-teal-600",
      },
      {
        icon: Award,
        title: "Compliance Check",
        description: "Monthly compliance audit completed successfully",
        time: "1 day ago",
        color: "text-purple-600",
      },
    ],
  }

  const currentActivities = activities[role]
  const title =
    role === "donor" ? "Your Activity" : role === "organization" ? "Organization Activity" : "Platform Activity"

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="space-y-4">
        {currentActivities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
