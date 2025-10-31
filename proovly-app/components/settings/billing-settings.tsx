"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus } from "lucide-react"
import type { DecodedToken } from "@/lib/auth"

interface BillingSettingsProps {
  user: DecodedToken
}

export function BillingSettings({ user }: BillingSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Billing Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-2xl font-bold text-foreground mt-2">Professional</p>
            <p className="text-xs text-muted-foreground mt-1">$99/month</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Billing Cycle</p>
            <p className="text-2xl font-bold text-foreground mt-2">Monthly</p>
            <p className="text-xs text-muted-foreground mt-1">Renews on Dec 15, 2024</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
            <p className="text-xs text-muted-foreground mt-1">All payments up to date</p>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Payment Methods</h2>
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">Default</span>
          </div>
        </div>
        <Button variant="outline" className="bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </Card>

      {/* Invoices */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Invoices</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors">
            <div>
              <p className="font-medium text-foreground">Invoice #INV-2024-12</p>
              <p className="text-sm text-muted-foreground">December 15, 2024 - $99.00</p>
            </div>
            <Button variant="ghost" size="sm">
              Download
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors">
            <div>
              <p className="font-medium text-foreground">Invoice #INV-2024-11</p>
              <p className="text-sm text-muted-foreground">November 15, 2024 - $99.00</p>
            </div>
            <Button variant="ghost" size="sm">
              Download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
