import Link from "next/link"
import { Suspense } from "react"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20logo-HW9xEvqq79uHzkMV34COICjk4o62LA.png"
                alt="Proovly"
                className="h-8 w-auto mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-600">Join Proovly and start making an impact</p>
          </div>

          <Suspense fallback={<div className="text-slate-500 text-sm">Loading form…</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
