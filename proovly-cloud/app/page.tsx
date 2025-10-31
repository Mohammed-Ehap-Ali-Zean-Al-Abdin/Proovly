import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-20">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
            <Image 
              src="/Proovly cloud icon.png" 
              alt="Proovly Cloud" 
              width={120} 
              height={120} 
              className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Proovly
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-4 leading-relaxed">
          NGO Portal & API Hub for Transparent Donation Management
        </p>
        
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          Powered by blockchain technology to ensure every donation is tracked, verified, and delivered with complete transparency.
        </p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button asChild size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
            <Link href="/login" className="flex items-center gap-2">
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
            <Link href="/analytics">
              View Analytics
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Blockchain Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">100% Transparent</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span className="font-semibold">NGO Trusted</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-in-right">
        <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:-translate-y-2 card-hover">
          <CardHeader>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <CardTitle className="text-2xl">CSV Ingestion</CardTitle>
            <CardDescription className="text-base">Upload and process donation data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Bulk import donation records with automatic validation and blockchain proof via HCS.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200">
              <Link href="/ingest">Open Ingest →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-pink-50 hover:-translate-y-2 card-hover">
          <CardHeader>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <CardTitle className="text-2xl">OFD Operations</CardTitle>
            <CardDescription className="text-base">Mint and transfer OFD tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Hedera HTS-backed token operations for transparent fund distribution.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200">
              <Link href="/ofd">Open OFD →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-emerald-50 to-teal-50 hover:-translate-y-2 card-hover">
          <CardHeader>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Analytics</CardTitle>
            <CardDescription className="text-base">Real-time insights and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Comprehensive dashboard with transparency metrics and blockchain verification stats.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-200">
              <Link href="/analytics">Open Analytics →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl animate-scale-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-bold">100%</div>
            <div className="text-blue-100">Transparent</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold">24/7</div>
            <div className="text-blue-100">Real-time Tracking</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold">∞</div>
            <div className="text-blue-100">Immutable Records</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold">🔒</div>
            <div className="text-blue-100">Blockchain Secured</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center max-w-3xl mx-auto animate-fade-in">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Ready to Transform Donation Management?
        </h2>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          Join NGOs worldwide using blockchain technology to ensure every donation reaches its intended destination.
        </p>
        <Button asChild size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
          <Link href="/login" className="flex items-center gap-2">
            Start Your Journey
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  )
}
