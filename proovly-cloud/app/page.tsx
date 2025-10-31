import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Proovly Cloud</h1>
        <p className="text-muted-foreground mt-3">
          NGO Portal & API Hub for ingestion, OFD management, and analytics.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/analytics">View Analytics</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>CSV Ingestion</CardTitle>
            <CardDescription>Upload and process donation CSVs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Validated and proofed via HCS.</p>
            <div className="mt-4">
              <Button asChild variant="secondary"><Link href="/ingest">Open Ingest</Link></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>OFD Operations</CardTitle>
            <CardDescription>Mint and transfer OFDTest tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Hedera HTS-backed demo flows.</p>
            <div className="mt-4">
              <Button asChild variant="secondary"><Link href="/ofd">Open OFD</Link></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Aggregates and chain verification</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Daily hashes on HCS with links.</p>
            <div className="mt-4">
              <Button asChild variant="secondary"><Link href="/analytics">Open Analytics</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
