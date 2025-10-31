import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getDocsUrl } from "@/lib/utils";
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proovly Cloud - NGO Portal",
  description: "Transparent Donation Management Powered by Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const docsUrl = getDocsUrl()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-foreground antialiased font-sans`}>
        <div className="min-h-screen flex flex-col">
          {/* Modern Header with Glass Effect */}
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-blue-100/50 shadow-sm">
            <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-4 min-w-0 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Image 
                    src="/Proovly cloud icon.png" 
                    alt="Proovly Cloud" 
                    width={56} 
                    height={56} 
                    className="h-14 w-14 rounded-xl relative z-10 shadow-lg transform group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Proovly
                  </span>
                  <span className="text-xs text-blue-600/70 font-medium">NGO Management Portal</span>
                </div>
              </div>
              <nav className="flex items-center gap-2 text-sm overflow-x-auto">
                <a href="/login" className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 whitespace-nowrap font-medium">
                  Login
                </a>
                <a href="/dashboard" className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 whitespace-nowrap font-medium">
                  Dashboard
                </a>
                <a href="/ingest" className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 whitespace-nowrap font-medium">
                  Ingest
                </a>
                <a href="/ofd" className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 whitespace-nowrap font-medium">
                  OFD
                </a>
                <a href="/analytics" className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 whitespace-nowrap font-medium">
                  Analytics
                </a>
                <a href="/ngo" className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 whitespace-nowrap font-medium">
                  NGO Ops
                </a>
                <a href={docsUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 whitespace-nowrap font-medium transform hover:scale-105">
                  Docs
                </a>
              </nav>
            </div>
          </header>
          
          {/* Main Content with Animation */}
          <main className="flex-1 animate-fade-in">{children}</main>
          
          {/* Modern Footer */}
          <footer className="backdrop-blur-xl bg-white/60 border-t border-blue-100/50">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Image src="/Proovly cloud icon.png" alt="Proovly" width={32} height={32} className="h-8 w-8 rounded-lg opacity-80" />
                  <span className="text-sm text-slate-600 font-medium">
                    © {new Date().getFullYear()} Proovly - Powered by Blockchain
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
