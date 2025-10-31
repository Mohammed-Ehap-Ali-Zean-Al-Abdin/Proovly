import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getDocsUrl } from "@/lib/utils";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proovly Cloud",
  description: "NGO Portal & API Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const docsUrl = getDocsUrl()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <Image src="/Proovly cloud icon.png" alt="Proovly" width={32} height={32} className="h-8 w-8 rounded-md" />
                <span className="font-semibold">Proovly Cloud</span>
              </div>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground overflow-x-auto">
                <a href="/login" className="hover:text-foreground whitespace-nowrap">Login</a>
                <a href="/dashboard" className="hover:text-foreground whitespace-nowrap">Dashboard</a>
                <a href="/ingest" className="hover:text-foreground whitespace-nowrap">Ingest</a>
                <a href="/ofd" className="hover:text-foreground whitespace-nowrap">OFD</a>
                <a href="/analytics" className="hover:text-foreground whitespace-nowrap">Analytics</a>
                <a href="/ngo" className="hover:text-foreground whitespace-nowrap">NGO Ops</a>
                <a href={docsUrl} target="_blank" rel="noreferrer" className="hover:text-foreground whitespace-nowrap">Docs</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t">
            <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Proovly Cloud
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
