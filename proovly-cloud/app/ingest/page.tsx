"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"

export default function IngestPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [loading, user, router])

  if (loading || !user) return null

  const onUpload = async () => {
    if (!file) return
    setError(null)
    setSuccess(null)
    setBusy(true)
    try {
      const res = await apiClient.ingest.uploadCsv(file)
      setSuccess(`Accepted: ${res.status}${res.jobId ? ` (job ${res.jobId})` : ""}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>CSV Ingestion</CardTitle>
          <CardDescription>Upload donation CSV files for processing</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>
          )}
          {success && (
            <Alert className="mb-4"><AlertDescription>{success}</AlertDescription></Alert>
          )}
          <div className="space-y-4">
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button onClick={onUpload} disabled={!file || busy}>{busy ? "Uploading..." : "Upload"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
