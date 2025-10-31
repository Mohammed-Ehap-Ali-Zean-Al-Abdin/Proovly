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
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Summary and breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <Input placeholder="From (YYYY-MM-DD)" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input placeholder="To (YYYY-MM-DD)" value={to} onChange={(e) => setTo(e.target.value)} />
            <Input placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
            <Button onClick={fetchSummary}>Refresh</Button>
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
