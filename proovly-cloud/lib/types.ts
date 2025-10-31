// Shared types matching backend API responses
export type UserRole = "donor" | "ngo" | "admin"
export type DonationStatus = "pending" | "funded" | "assigned" | "delivered"
export type Currency = "USD" | "OFD" | "HBAR"

// User / Auth
export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

export interface DecodedToken {
  sub: string // user ID
  email?: string
  role: UserRole
  iat: number
  exp: number
}

// Donation
export interface Donation {
  _id: string
  donorId: string
  campaignId: string
  amountUSD: number
  currency: Currency
  status: DonationStatus
  recipientId?: string
  hederaHcsTxId?: string
  htsTxId?: string
  mirrorUrl?: string
  createdAt: string
  updatedAt: string
  // Populated fields
  campaign?: Campaign
  donor?: User
  recipient?: User
}

export interface CreateDonationRequest {
  donorId: string
  campaignId: string
  amountUSD: number
  currency?: Currency
}

export interface UpdateDonationRequest {
  status?: DonationStatus
  recipientId?: string | null
}

export interface DeliverDonationRequest {
  privateKey: string
  mediaUrl?: string
}

// Campaign
export interface Campaign {
  _id: string
  title: string
  description: string
  region: string
  goalUSD: number
  raisedUSD: number
  imageUrl?: string
  status: "active" | "completed" | "paused"
  ngoId: string
  createdAt: string
  updatedAt: string
  ngo?: User
}

// Transaction
export interface Transaction {
  _id: string
  type: "donation" | "transfer" | "mint" | "burn"
  fromUserId?: string
  toUserId?: string
  amount: number
  currency: Currency
  hederaTxId?: string
  mirrorUrl?: string
  status: "pending" | "completed" | "failed"
  metadata?: Record<string, any>
  createdAt: string
}

// Analytics
export interface AnalyticsSummary {
  totalDonations: number
  byRegion: Array<{ region: string; amount: number; count: number }>
  chainVerifiedPct: number
  from?: string
  to?: string
}

export interface DailyHashResponse {
  hash: string
  date: string
  hederaTxId?: string
  mirrorUrl?: string
}

// OFD Records
export interface OfdRecord {
  _id: string
  userId: string
  action: "mint" | "burn" | "transfer"
  amount: number
  tokenId?: string
  hederaTxId?: string
  createdAt: string
}

// Positions (Collateralized)
export interface Position {
  _id: string
  userId: string
  collateralSymbol: string
  collateralAmount: number
  debtOFD: number
  status: "open" | "closed" | "liquidated"
  createdAt: string
  updatedAt: string
}

// Payments
export interface Payment {
  _id: string
  fromUserId: string
  toUserId: string
  amountOFD: number
  status: "pending" | "completed" | "failed"
  hederaTxId?: string
  createdAt: string
}

// HedTxLog (for verification)
export interface HedTxLog {
  _id: string
  type: string
  payloadHash: string
  hederaTxId: string
  mirrorUrl: string
  createdAt: string
}

// CSV Ingestion
export interface CsvIngestionResponse {
  jobId?: string
  status: string
  rowsProcessed?: number
}

// API Error
export interface ApiError {
  error: string
  message?: string
  statusCode?: number
}
