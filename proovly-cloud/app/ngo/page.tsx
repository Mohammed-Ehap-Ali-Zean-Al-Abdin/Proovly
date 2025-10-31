"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import type { Donation } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

// Cloudinary upload widget
declare global {
  interface Window {
    cloudinary?: any
  }
}

export default function NgoOpsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<string>("")
  const [donations, setDonations] = useState<Donation[]>([])
  const [busy, setBusy] = useState(false)
  const [recipient, setRecipient] = useState<Record<string, string>>({})
  const [privKey, setPrivKey] = useState<Record<string, string>>({})
  const [mediaUrl, setMediaUrl] = useState<Record<string, string>>({})
  const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({})
  const [widgetLoaded, setWidgetLoaded] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [loading, user, router])

  useEffect(() => {
    if (!loading && user) refresh()
  }, [loading, user])

  // Load Cloudinary Upload Widget script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.cloudinary) {
      const script = document.createElement("script")
      script.src = "https://upload-widget.cloudinary.com/global/all.js"
      script.async = true
      script.onload = () => setWidgetLoaded(true)
      document.body.appendChild(script)
    } else if (window.cloudinary) {
      setWidgetLoaded(true)
    }
  }, [])

  const refresh = async () => {
    setBusy(true)
    try {
      const list = await apiClient.donations.list({ status: status || undefined })
      setDonations(list)
    } finally {
      setBusy(false)
    }
  }

  const handleAssign = async (id: string) => {
    try {
      setRowBusy((b) => ({ ...b, [id]: true }))
      const r = recipient[id]
      await apiClient.donations.update(id, { status: "assigned", recipientId: r || undefined })
      await refresh()
    } catch (e) {
      console.error(e)
      alert("Assign failed")
    } finally {
      setRowBusy((b) => ({ ...b, [id]: false }))
    }
  }

  const openCloudinaryWidget = async (id: string) => {
    if (!widgetLoaded || !window.cloudinary) return alert("Widget not loaded yet")
    try {
      setRowBusy((b) => ({ ...b, [id]: true }))
      const sig = await apiClient.cloudinary.getSignature()
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: sig.cloudName,
          apiKey: sig.apiKey,
          uploadSignature: sig.signature,
          uploadSignatureTimestamp: sig.timestamp,
          folder: sig.folder,
          multiple: false,
          maxFiles: 1,
          sources: ["local", "camera"],
          resourceType: "image",
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            setMediaUrl((m) => ({ ...m, [id]: result.info.secure_url }))
            setRowBusy((b) => ({ ...b, [id]: false }))
            widget.close()
          } else if (error) {
            console.error("Upload error:", error)
            alert("Upload failed")
            setRowBusy((b) => ({ ...b, [id]: false }))
          }
        }
      )
      widget.open()
    } catch (err: any) {
      console.error(err)
      alert(err?.message || "Failed to open upload widget")
      setRowBusy((b) => ({ ...b, [id]: false }))
    }
  }

  const handleDeliver = async (id: string) => {
    try {
      setRowBusy((b) => ({ ...b, [id]: true }))
      const key = privKey[id]
      if (!key) return alert("Private key required")
      await apiClient.donations.deliver(id, { privateKey: key, mediaUrl: mediaUrl[id] || undefined })
      await refresh()
    } catch (e) {
      console.error(e)
      alert("Delivery failed")
    } finally {
      setRowBusy((b) => ({ ...b, [id]: false }))
    }
  }

  if (loading || !user) return null

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NGO Operations
            </h1>
            <p className="text-slate-600 mt-2">Manage donation assignments and delivery confirmations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              {donations.length} Active Donations
            </span>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-in-right">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl">Donation Management</CardTitle>
              <CardDescription className="mt-1">Track, assign, and confirm delivery of donations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1">
              <Input 
                placeholder="Filter by status..." 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">pending, funded, assigned, delivered</p>
            </div>
            <Button 
              onClick={refresh} 
              disabled={busy}
              className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
            >
              {busy ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh List
                </span>
              )}
            </Button>
            <div className="md:col-span-1 text-xs text-slate-600 bg-blue-50 p-3 rounded-lg">
              💡 <strong>Tip:</strong> Use recipient ID to assign, then upload proof and confirm delivery
            </div>
          </div>
          <div className="space-y-4">
            {donations.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">No donations found</p>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or refresh the list</p>
              </div>
            )}
            {donations.map((d, index) => (
              <div 
                key={d._id} 
                className="border-2 border-slate-200 rounded-xl p-5 space-y-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg text-slate-800 truncate">{d.campaignId}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        d.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        d.status === 'funded' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatCurrency(d.amountUSD)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(d.createdAt)}
                      </span>
                    </div>
                    {d.hederaHcsTxId && (
                      <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Blockchain Verified
                        </span>
                        <a 
                          href={`https://hashscan.io/testnet/transaction/${d.hederaHcsTxId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                        >
                          View on Hedera Explorer
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        {d.htsTxId && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                            🪙 Token Minted
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  {/* Assign Section */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Assign to Beneficiary</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter recipient ID..."
                        value={recipient[d._id] || ""}
                        onChange={(e) => setRecipient((r) => ({ ...r, [d._id]: e.target.value }))}
                        className="flex-1 h-10"
                      />
                      <Button 
                        variant="secondary" 
                        onClick={() => handleAssign(d._id)} 
                        disabled={rowBusy[d._id]}
                        className="h-10 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold"
                      >
                        {rowBusy[d._id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                        ) : (
                          'Assign'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Delivery Section */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Confirm Delivery</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="Private key (passphrase)..."
                          value={privKey[d._id] || ""}
                          onChange={(e) => setPrivKey((r) => ({ ...r, [d._id]: e.target.value }))}
                          className="flex-1 h-10"
                        />
                        <Button 
                          variant="secondary" 
                          onClick={() => openCloudinaryWidget(d._id)} 
                          disabled={rowBusy[d._id] || !widgetLoaded}
                          className="h-10 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold whitespace-nowrap"
                        >
                          📸 Upload
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Media URL (optional)..."
                          value={mediaUrl[d._id] || ""}
                          onChange={(e) => setMediaUrl((m) => ({ ...m, [d._id]: e.target.value }))}
                          className="flex-1 h-10"
                        />
                        <Button 
                          onClick={() => handleDeliver(d._id)} 
                          disabled={rowBusy[d._id]}
                          className="h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-200 font-semibold"
                        >
                          {rowBusy[d._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            '✓ Delivered'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
