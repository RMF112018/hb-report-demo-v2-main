import { useState, useEffect, useCallback } from "react"

export interface UnanetPursuit {
  id: string
  name: string
  client: string
  stage: string
  value: number
  probability: number
  clientType: "commercial" | "public" | "healthcare" | "education"
  bidDueDate: string
  lead: string
  location: string
  submittedDate?: string
  status: "active" | "submitted" | "won" | "lost"
}

export interface UnanetProposal {
  id: string
  rfqNumber: string
  agency: string
  title: string
  value: number
  dueDate: string
  status: "draft" | "submitted" | "under_review" | "shortlisted" | "awarded" | "declined"
  submissionDate?: string
  category: "infrastructure" | "buildings" | "utilities" | "transportation"
  location: string
}

export interface UnanetWinLoss {
  date: string
  wins: number
  losses: number
  winValue: number
  lossValue: number
  winRate: number
}

export interface UnanetData {
  pursuits: UnanetPursuit[]
  proposals: UnanetProposal[]
  winsLosses: UnanetWinLoss[]
  lastSynced: Date
  isLoading: boolean
  error: string | null
}

const mockPursuits: UnanetPursuit[] = [
  {
    id: "UNA-2025-001",
    name: "Miami Convention Center Expansion",
    client: "Miami-Dade County",
    stage: "DD",
    value: 450000000,
    probability: 85,
    clientType: "public",
    bidDueDate: "2025-03-15",
    lead: "Sarah Chen",
    location: "Miami, FL",
    status: "active",
  },
  {
    id: "UNA-2025-002",
    name: "Jacksonville Medical Complex",
    client: "Baptist Health",
    stage: "CD",
    value: 320000000,
    probability: 92,
    clientType: "healthcare",
    bidDueDate: "2025-02-28",
    lead: "Mike Rodriguez",
    location: "Jacksonville, FL",
    status: "active",
  },
  {
    id: "UNA-2025-003",
    name: "Tampa Office Tower",
    client: "Meridian Development",
    stage: "BID",
    value: 180000000,
    probability: 75,
    clientType: "commercial",
    bidDueDate: "2025-02-10",
    lead: "Jennifer Lee",
    location: "Tampa, FL",
    submittedDate: "2025-02-08",
    status: "submitted",
  },
  {
    id: "UNA-2025-004",
    name: "University Research Building",
    client: "Florida International University",
    stage: "SD",
    value: 95000000,
    probability: 68,
    clientType: "education",
    bidDueDate: "2025-04-01",
    lead: "David Kim",
    location: "Miami, FL",
    status: "active",
  },
  {
    id: "UNA-2025-005",
    name: "Fort Lauderdale Luxury Resort",
    client: "Coastal Hospitality Group",
    stage: "CONSTRUCTION",
    value: 275000000,
    probability: 88,
    clientType: "commercial",
    bidDueDate: "2025-01-25",
    lead: "Amanda Torres",
    location: "Fort Lauderdale, FL",
    submittedDate: "2025-01-23",
    status: "won",
  },
]

const mockProposals: UnanetProposal[] = [
  {
    id: "RFQ-2025-FL-001",
    rfqNumber: "FL-DOT-2025-001",
    agency: "Florida Department of Transportation",
    title: "I-95 Bridge Replacement Project",
    value: 125000000,
    dueDate: "2025-03-20",
    status: "under_review",
    submissionDate: "2025-02-15",
    category: "infrastructure",
    location: "Palm Beach County, FL",
  },
  {
    id: "RFQ-2025-FL-002",
    rfqNumber: "MIA-2025-003",
    agency: "Miami-Dade Public Schools",
    title: "New Elementary School Construction",
    value: 45000000,
    dueDate: "2025-02-28",
    status: "shortlisted",
    submissionDate: "2025-02-20",
    category: "buildings",
    location: "Miami, FL",
  },
  {
    id: "RFQ-2025-FL-003",
    rfqNumber: "TB-UTIL-2025-001",
    agency: "Tampa Bay Water",
    title: "Water Treatment Facility Upgrade",
    value: 89000000,
    dueDate: "2025-04-10",
    status: "draft",
    category: "utilities",
    location: "Tampa, FL",
  },
  {
    id: "RFQ-2025-FL-004",
    rfqNumber: "JAX-TRAN-2025-002",
    agency: "Jacksonville Transportation Authority",
    title: "Bus Rapid Transit Stations",
    value: 67000000,
    dueDate: "2025-03-05",
    status: "submitted",
    submissionDate: "2025-03-01",
    category: "transportation",
    location: "Jacksonville, FL",
  },
]

const mockWinsLosses: UnanetWinLoss[] = [
  { date: "2025-01", wins: 3, losses: 1, winValue: 425000000, lossValue: 75000000, winRate: 75 },
  { date: "2024-12", wins: 2, losses: 2, winValue: 290000000, lossValue: 180000000, winRate: 50 },
  { date: "2024-11", wins: 4, losses: 1, winValue: 380000000, lossValue: 65000000, winRate: 80 },
  { date: "2024-10", wins: 2, losses: 3, winValue: 150000000, lossValue: 240000000, winRate: 40 },
  { date: "2024-09", wins: 5, losses: 0, winValue: 520000000, lossValue: 0, winRate: 100 },
  { date: "2024-08", wins: 1, losses: 2, winValue: 95000000, lossValue: 165000000, winRate: 33 },
]

export function useUnanetData() {
  const [data, setData] = useState<UnanetData>({
    pursuits: [],
    proposals: [],
    winsLosses: [],
    lastSynced: new Date(),
    isLoading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800))

      // Simulate occasional API errors (5% chance)
      if (Math.random() < 0.05) {
        throw new Error("Unanet API temporarily unavailable")
      }

      setData({
        pursuits: mockPursuits,
        proposals: mockProposals,
        winsLosses: mockWinsLosses,
        lastSynced: new Date(),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  return {
    ...data,
    refetch: fetchData,
  }
}
