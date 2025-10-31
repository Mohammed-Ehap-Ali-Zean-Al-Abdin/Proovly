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
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NGO Operations</CardTitle>
          <CardDescription>Assign and confirm deliveries (preview)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <Input placeholder="Filter status (pending, funded, assigned, delivered)" value={status} onChange={(e) => setStatus(e.target.value)} />
            <Button onClick={refresh} disabled={busy}>{busy ? "Loading…" : "Refresh"}</Button>
            <div className="md:col-span-2 text-sm text-muted-foreground">Provide recipient to assign; provide private key (MVP) to confirm delivery. Attach media via Cloudinary widget or URL.</div>
          </div>
          <div className="space-y-2">
            {donations.length === 0 && <div className="text-sm text-muted-foreground">No donations found.</div>}
            {donations.map((d) => (
              <div key={d._id} className="border rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{d.campaignId}</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(d.amountUSD)} • {d.status} • {formatDate(d.createdAt)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Recipient ID"
                      value={recipient[d._id] || ""}
                      onChange={(e) => setRecipient((r) => ({ ...r, [d._id]: e.target.value }))}
                    />
                    <Button variant="secondary" onClick={() => handleAssign(d._id)} disabled={rowBusy[d._id]}>Assign</Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Input
                      type="password"
                      placeholder="Private key (MVP)"
                      value={privKey[d._id] || ""}
                      onChange={(e) => setPrivKey((r) => ({ ...r, [d._id]: e.target.value }))}
                    />
                    <Input
                      placeholder="Media URL (optional)"
                      value={mediaUrl[d._id] || ""}
                      onChange={(e) => setMediaUrl((m) => ({ ...m, [d._id]: e.target.value }))}
                    />
                    <Button variant="secondary" onClick={() => openCloudinaryWidget(d._id)} disabled={rowBusy[d._id] || !widgetLoaded}>Upload</Button>
                    <Button onClick={() => handleDeliver(d._id)} disabled={rowBusy[d._id]}>Mark Delivered</Button>
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
