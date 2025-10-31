import { jwtDecode } from "jwt-decode"
import type { AuthResponse, DecodedToken, UserRole } from "./types"
import { apiClient } from "./api-client"

export const authAPI = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiClient.auth.login(email, password)
  },

  async signup(
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ): Promise<AuthResponse> {
    return apiClient.auth.signup({ email, password, name, role })
  },
}

export const tokenStorage = {
  setTokens(authResponse: AuthResponse) {
    localStorage.setItem("access_token", authResponse.token)
    localStorage.setItem("user_info", JSON.stringify(authResponse.user))
    
    const decoded = decodeToken(authResponse.token)
    if (decoded) {
      localStorage.setItem("token_expires_at", String(decoded.exp * 1000))
    }
  },

  getAccessToken(): string | null {
    return localStorage.getItem("access_token")
  },

  getUserInfo(): AuthResponse["user"] | null {
    const userStr = localStorage.getItem("user_info")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  getTokensExpireAt(): number | null {
    const expiresAt = localStorage.getItem("token_expires_at")
    return expiresAt ? Number.parseInt(expiresAt) : null
  },

  clearTokens() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_info")
    localStorage.removeItem("token_expires_at")
  },

  isTokenExpired(): boolean {
    const expiresAt = this.getTokensExpireAt()
    if (!expiresAt) return true
    return Date.now() >= expiresAt
  },
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token)
  } catch {
    return null
  }
}

export const getCurrentUser = (): DecodedToken | null => {
  const token = tokenStorage.getAccessToken()
  if (!token) return null
  return decodeToken(token)
}
