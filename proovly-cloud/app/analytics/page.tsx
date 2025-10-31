"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import type { AnalyticsSummary } from "@/lib/types"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/utils"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [region, setRegion] = useState("")
  const [hashing, setHashing] = useState(false)
  const [verifyHash, setVerifyHash] = useState("")
  const [verifyResult, setVerifyResult] = useState<string>("")

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [loading, user, router])

  useEffect(() => {
    if (!loading && user) fetchSummary()
  }, [loading, user])

  const fetchSummary = async () => {
    const s = await apiClient.analytics.summary({ from, to, region })
    setSummary(s)
  }

  const handleGenerateHash = async () => {
    try {
      setHashing(true)
      const res = await apiClient.analytics.generateDailyHash()
      setVerifyResult(`Hash for ${res.date}: ${res.hash}`)
    } finally {
      setHashing(false)
    }
  }

  const handleVerify = async () => {
    const logs = await apiClient.analytics.verifyHash(verifyHash)
    setVerifyResult(`${logs.length} on-chain entries matched`)
  }

  if (loading || !user) return null

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-slate-600">Track donations, transparency metrics, and blockchain verification</p>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-in-right">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="text-xl">Summary & Breakdown</CardTitle>
          <CardDescription>Filter and analyze donation data</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input 
              placeholder="From (YYYY-MM-DD)" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)}
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500" 
            />
            <Input 
              placeholder="To (YYYY-MM-DD)" 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500" 
            />
            <Input 
              placeholder="Region" 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500" 
            />
            <Button 
              onClick={fetchSummary}
              className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </span>
            </Button>
          </div>
          {summary && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Totals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{formatCurrency(summary.totalDonations)}</div>
                  <div className="text-sm text-muted-foreground">Chain verified: {Math.round((summary.chainVerifiedPct ?? 0) * 100)}%</div>
                </CardContent>
              </Card>
              <div className="col-span-1 lg:col-span-2 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.byRegion} margin={{ left: 16, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value: any, name) => (name === "amount" ? formatCurrency(value) : value)} />
                    <Legend />
                    <Bar dataKey="amount" name="Amount (USD)" fill="hsl(var(--primary))" />
                    <Bar dataKey="count" name="Count" fill="hsl(var(--muted-foreground))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="secondary" onClick={handleGenerateHash} disabled={hashing}>{hashing ? "Generating…" : "Generate Daily Hash"}</Button>
            <Input placeholder="Verify hash" value={verifyHash} onChange={(e) => setVerifyHash(e.target.value)} />
            <Button onClick={handleVerify} disabled={!verifyHash}>Verify</Button>
          </div>
          {verifyResult && <div className="mt-2 text-sm text-muted-foreground">{verifyResult}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
