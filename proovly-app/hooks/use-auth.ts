"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, tokenStorage, getCurrentUser } from "@/lib/auth"
import type { DecodedToken } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const tokens = await authAPI.login(email, password)
      tokenStorage.setTokens(tokens)
      const currentUser = getCurrentUser()
      setUser(currentUser)
      router.push("/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    }
  }

  const signup = async (email: string, password: string, name: string, role: "donor" | "ngo" | "admin") => {
    try {
      setError(null)
      const tokens = await authAPI.signup(email, password, name, role)
      tokenStorage.setTokens(tokens)
      const currentUser = getCurrentUser()
      setUser(currentUser)
      router.push("/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed"
      setError(message)
      throw err
    }
  }

  const logout = () => {
    tokenStorage.clearTokens()
    setUser(null)
    router.push("/")
  }

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }
}
