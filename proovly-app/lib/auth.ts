import { jwtDecode } from "jwt-decode"
import type { AuthResponse, DecodedToken, UserRole } from "./types"
import { apiClient } from "./api-client"

// Backend returns { token, user }, not { access_token, refresh_token }
// We'll adapt the interface to match backend response
export interface AuthToken {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

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

  // These endpoints don't exist in backend yet - return placeholder for future
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    throw new Error("Password reset not yet implemented")
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    throw new Error("Password reset not yet implemented")
  },
}

export const tokenStorage = {
  setTokens(authResponse: AuthResponse) {
    localStorage.setItem("access_token", authResponse.token)
    // Store user info for quick access
    localStorage.setItem("user_info", JSON.stringify(authResponse.user))
    
    // Decode token to get expiry
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
