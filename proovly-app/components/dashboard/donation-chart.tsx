"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DonationChartProps {
  role: "donor" | "organization" | "admin"
}

export function DonationChart({ role }: DonationChartProps) {
  const data = [
    { month: "Jan", donations: 4000, donors: 240, impact: 2400 },
    { month: "Feb", donations: 3000, donors: 221, impact: 2210 },
    { month: "Mar", donations: 2000, donors: 229, impact: 2290 },
    { month: "Apr", donations: 2780, donors: 200, impact: 2000 },
    { month: "May", donations: 1890, donors: 229, impact: 2181 },
    { month: "Jun", donations: 2390, donors: 200, impact: 2500 },
    { month: "Jul", donations: 3490, donors: 210, impact: 2100 },
  ]

  const title =
    role === "donor" ? "Your Donation History" : role === "organization" ? "Fundraising Trends" : "Platform Donations"

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: `1px solid var(--color-border)`,
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="donations"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: "var(--color-primary)", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="impact"
            stroke="var(--color-secondary)"
            strokeWidth={2}
            dot={{ fill: "var(--color-secondary)", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
