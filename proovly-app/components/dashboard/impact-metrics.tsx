"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ImpactMetricsProps {
  role: "donor" | "organization" | "admin"
}

export function ImpactMetrics({ role }: ImpactMetricsProps) {
  const metrics = {
    donor: [
      { label: "Education", value: 45 },
      { label: "Healthcare", value: 30 },
      { label: "Environment", value: 25 },
    ],
    organization: [
      { label: "Project A", value: 65 },
      { label: "Project B", value: 45 },
      { label: "Project C", value: 80 },
    ],
    admin: [
      { label: "Verified Orgs", value: 92 },
      { label: "Active Campaigns", value: 78 },
      { label: "Compliance Rate", value: 99 },
    ],
  }

  const currentMetrics = metrics[role]
  const title =
    role === "donor" ? "Cause Distribution" : role === "organization" ? "Project Progress" : "Platform Metrics"

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="space-y-6">
        {currentMetrics.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">{metric.label}</p>
              <p className="text-sm font-semibold text-primary">{metric.value}%</p>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  )
}
