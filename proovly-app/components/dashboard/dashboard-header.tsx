"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, Menu, Gift, CreditCard, FileText } from "lucide-react"
import { useState } from "react"
import type { DecodedToken } from "@/lib/auth"

interface DashboardHeaderProps {
  user: DecodedToken
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20logo-HW9xEvqq79uHzkMV34COICjk4o62LA.png"
                alt="Proovly"
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Dashboard</p>
              <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/donations">
              <Button variant="ghost" size="sm">
                <Gift className="h-4 w-4 mr-2" />
                Donations
              </Button>
            </Link>
            <Link href="/transactions">
              <Button variant="ghost" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Transactions
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link href="/donations" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Gift className="h-4 w-4 mr-2" />
                Donations
              </Button>
            </Link>
            <Link href="/transactions" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Transactions
              </Button>
            </Link>
            <Link href="/reports" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
