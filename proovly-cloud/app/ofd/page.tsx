"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import type { Transaction } from "@/lib/types"

export default function OFDPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [tokenId, setTokenId] = useState("")
  const [amount, setAmount] = useState("")
  const [to, setTo] = useState("")
  const [minting, setMinting] = useState(false)
  const [transferring, setTransferring] = useState(false)
  const [logs, setLogs] = useState<Transaction[]>([])

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [loading, user, router])

  useEffect(() => {
    if (!loading && user) refreshLogs()
  }, [loading, user])

  const refreshLogs = async () => {
    try {
      const list = await apiClient.transactions.list()
      setLogs(list)
    } catch (e) {
      console.error(e)
    }
  }

  const handleMint = async () => {
    try {
      setMinting(true)
      const res = await apiClient.ofd.mint({ tokenId, amount: Number(amount) })
      await refreshLogs()
      alert(`Mint submitted. Tx: ${res.txId}`)
    } catch (e: any) {
      alert(e?.message || "Mint failed")
    } finally {
      setMinting(false)
    }
  }

  const handleTransfer = async () => {
    try {
      setTransferring(true)
      const res = await apiClient.ofd.transfer({ tokenId, toAccount: to, amount: Number(amount) })
      await refreshLogs()
      alert(res.success ? "Transfer submitted" : "Transfer failed")
    } catch (e: any) {
      alert(e?.message || "Transfer failed")
    } finally {
      setTransferring(false)
    }
  }

  if (loading || !user) return null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OFD Operations</CardTitle>
          <CardDescription>Mint and transfer tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Token ID (e.g., 0.0.x)" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
            <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleMint} disabled={minting || !tokenId || !amount}>{minting ? "Minting..." : "Mint"}</Button>
              <Button onClick={handleTransfer} disabled={transferring || !tokenId || !amount || !to}>{transferring ? "Transferring..." : "Transfer"}</Button>
            </div>
          </div>
          <Input placeholder="Recipient (0.0.x or evm addr)" value={to} onChange={(e) => setTo(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Hedera Transactions</CardTitle>
          <CardDescription>Last 10 operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs?.length === 0 && <div className="text-sm text-muted-foreground">No transactions yet.</div>}
            {logs?.map((l) => (
              <div key={l._id} className="flex items-center justify-between border rounded-md p-2 text-sm">
                <div className="truncate">
                  <div className="font-medium capitalize">{l.type}</div>
                  <div className="text-muted-foreground truncate">
                    {l.amount} {l.currency}
                  </div>
                </div>
                {(l.mirrorUrl || l.hederaTxId) && (
                  <a
                    className="text-primary hover:underline"
                    href={l.mirrorUrl || `https://hashscan.io/testnet/transaction/${l.hederaTxId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
