import type {
  AuthResponse,
  Donation,
  CreateDonationRequest,
  Campaign,
  Transaction,
  AnalyticsSummary,
  DailyHashResponse,
  OfdRecord,
  Position,
  Payment,
  HedTxLog,
  ApiError,
  CsvIngestionResponse,
} from "./types"

const API_BASE_URL =
  typeof window !== "undefined" && (window as any).ENV?.NEXT_PUBLIC_API_URL
    ? (window as any).ENV.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(error.error || error.message || "Request failed")
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      // Handle 202 Accepted
      if (response.status === 202) {
        return response.json()
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Network error occurred")
    }
  }

  // Auth endpoints
  auth = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      return this.request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    },

    signup: async (data: {
      email: string
      password: string
      name: string
      role: "donor" | "ngo" | "admin"
    }): Promise<AuthResponse> => {
      return this.request<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  }

  // Donations endpoints
  donations = {
    list: async (params?: { 
      userId?: string
      campaignId?: string
      status?: string 
    }): Promise<Donation[]> => {
      const query = new URLSearchParams()
      if (params?.userId) query.append("userId", params.userId)
      if (params?.campaignId) query.append("campaignId", params.campaignId)
      if (params?.status) query.append("status", params.status)
      const queryString = query.toString()
      return this.request<Donation[]>(`/donations${queryString ? `?${queryString}` : ""}`)
    },

    get: async (id: string): Promise<Donation> => {
      return this.request<Donation>(`/donations/${id}`)
    },

    create: async (data: CreateDonationRequest): Promise<{ donationId: string; status: string }> => {
      return this.request<{ donationId: string; status: string }>("/donations", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    delete: async (id: string): Promise<void> => {
      return this.request<void>(`/donations/${id}`, {
        method: "DELETE",
      })
    },

    update: async (id: string, data: Partial<Pick<Donation, "status" | "recipientId">>): Promise<Donation> => {
      return this.request<Donation>(`/donations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    deliver: async (id: string, data: { privateKey: string; mediaUrl?: string }): Promise<{ ok: boolean; status: string }> => {
      return this.request<{ ok: boolean; status: string }>(`/donations/${id}/deliver`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  }

  // Campaigns endpoints
  campaigns = {
    list: async (params?: { region?: string; status?: string }): Promise<Campaign[]> => {
      const query = new URLSearchParams()
      if (params?.region) query.append("region", params.region)
      if (params?.status) query.append("status", params.status)
      const queryString = query.toString()
      return this.request<Campaign[]>(`/campaigns${queryString ? `?${queryString}` : ""}`)
    },

    get: async (id: string): Promise<Campaign> => {
      return this.request<Campaign>(`/campaigns/${id}`)
    },

    create: async (data: Partial<Campaign>): Promise<Campaign> => {
      return this.request<Campaign>("/campaigns", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  }

  // Transactions endpoints
  transactions = {
    list: async (params?: {
      userId?: string
      type?: string
      status?: string
    }): Promise<Transaction[]> => {
      const query = new URLSearchParams()
      if (params?.userId) query.append("userId", params.userId)
      if (params?.type) query.append("type", params.type)
      if (params?.status) query.append("status", params.status)
      const queryString = query.toString()
      return this.request<Transaction[]>(`/transactions${queryString ? `?${queryString}` : ""}`)
    },

    get: async (id: string): Promise<Transaction> => {
      return this.request<Transaction>(`/transactions/${id}`)
    },

    create: async (data: Partial<Transaction>): Promise<Transaction> => {
      return this.request<Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  }

  // Analytics endpoints
  analytics = {
    summary: async (params?: {
      from?: string
      to?: string
      region?: string
    }): Promise<AnalyticsSummary> => {
      const query = new URLSearchParams()
      if (params?.from) query.append("from", params.from)
      if (params?.to) query.append("to", params.to)
      if (params?.region) query.append("region", params.region)
      const queryString = query.toString()
      return this.request<AnalyticsSummary>(
        `/analytics/summary${queryString ? `?${queryString}` : ""}`,
      )
    },

    generateDailyHash: async (): Promise<DailyHashResponse> => {
      return this.request<DailyHashResponse>("/analytics/generate-daily-hash", {
        method: "POST",
      })
    },

    verifyHash: async (hash: string): Promise<HedTxLog[]> => {
      return this.request<HedTxLog[]>(`/analytics/verify-hash?hash=${encodeURIComponent(hash)}`)
    },
  }

  // OFD Records endpoints
  ofdRecords = {
    list: async (userId?: string): Promise<OfdRecord[]> => {
      const query = userId ? `?userId=${userId}` : ""
      return this.request<OfdRecord[]>(`/ofd-records${query}`)
    },

    get: async (id: string): Promise<OfdRecord> => {
      return this.request<OfdRecord>(`/ofd-records/${id}`)
    },

    create: async (data: Partial<OfdRecord>): Promise<OfdRecord> => {
      return this.request<OfdRecord>("/ofd-records", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  }

  // OFD Operations (Admin only)
  ofd = {
    mint: async (data: {
      tokenId?: string
      amount: number
      toAccount?: string
    }): Promise<{ txId: string; tokenId: string }> => {
      return this.request<{ txId: string; tokenId: string }>("/ofd/mint", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    transfer: async (data: {
      tokenId?: string
      amount: number
      fromAccount?: string
      toAccount?: string
    }): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>("/ofd/transfer", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  }

  // OFD Positions endpoints
  positions = {
    list: async (userId?: string): Promise<Position[]> => {
      const query = userId ? `?userId=${userId}` : ""
      return this.request<Position[]>(`/ofd/positions${query}`)
    },

    get: async (id: string): Promise<Position> => {
      return this.request<Position>(`/ofd/positions/${id}`)
    },

    open: async (data: { userId: string; collateralSymbol: string }): Promise<Position> => {
      return this.request<Position>("/ofd/positions", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    deposit: async (id: string, amount: number): Promise<void> => {
      return this.request<void>(`/ofd/positions/${id}/deposit`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      })
    },

    mint: async (id: string, amount: number): Promise<{ ofdMinted: number }> => {
      return this.request<{ ofdMinted: number }>(`/ofd/positions/${id}/mint`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      })
    },

    repay: async (id: string, amount: number): Promise<void> => {
      return this.request<void>(`/ofd/positions/${id}/repay`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      })
    },

    withdraw: async (id: string, amount: number): Promise<{ withdrawn: number }> => {
      return this.request<{ withdrawn: number }>(`/ofd/positions/${id}/withdraw`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      })
    },
  }

  // Payments endpoints
  payments = {
    create: async (data: {
      fromAccount?: string
      toAccount?: string
      amountOFD: number
      ofdTokenId?: string
    }): Promise<Payment> => {
      return this.request<Payment>("/payments", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    list: async (userId?: string): Promise<Payment[]> => {
      const query = userId ? `?userId=${userId}` : ""
      return this.request<Payment[]>(`/payments${query}`)
    },
  }

  // CSV Ingestion
  ingest = {
    uploadCsv: async (file: File): Promise<CsvIngestionResponse> => {
      const formData = new FormData()
      formData.append("file", file)

      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${API_BASE_URL}/ingest/csv`, {
        method: "POST",
        headers,
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Upload failed" }))
        throw new Error(error.error || "CSV upload failed")
      }

      return response.json()
    },
    
    uploadSql: async (data: {
      host: string
      port: number
      database: string
      user: string
      password: string
      query: string
    }): Promise<CsvIngestionResponse> => {
      return this.request<CsvIngestionResponse>("/ingest/sql", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  }

  // Media upload (Cloudinary via backend proxy)
  media = {
    upload: async (file: File): Promise<{ url: string; cid: string }> => {
      const form = new FormData()
      form.append('file', file)
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers,
        body: form,
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(error.error || 'Upload failed')
      }
      return response.json()
    },
  }

  // Cloudinary signature for direct browser uploads
  cloudinary = {
    getSignature: async (): Promise<{
      signature: string
      timestamp: number
      cloudName: string
      apiKey: string
      folder: string
    }> => {
      return this.request("/cloudinary/signature", { method: "POST" })
    },
  }
}

export const apiClient = new ApiClient()
