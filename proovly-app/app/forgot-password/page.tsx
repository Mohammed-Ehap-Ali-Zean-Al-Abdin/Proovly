import Link from "next/link"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
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
            <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
            <p className="text-slate-600">Enter your email to receive a reset link</p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
