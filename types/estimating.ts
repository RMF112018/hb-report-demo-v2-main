export interface ProjectPursuit {
  id: string
  name: string
  projectNumber: string
  client: string
  location: string
  schedule: string
  deliverable: string
  bidBookLog: string
  review: string
  programming: string
  pricing: number
  leanEstimating: string
  finalEstimate: string
  contributors: string
  bidBond: string
  currentStage: string
  projectBudget: number
  originalBudget: number
  billedToDate: number
  remainingBudget: number
  estimateType: string
  costPerSqf: number
  costPerLft: number
  submitted: string
  awarded: boolean
  awardedPrecon: boolean
  bidDueDate: string
  status: string
  estimatedCost: number
  lead: string
  confidence: number
  riskLevel: string
  sqft: number
  // Pre-Construction Projects specific fields
  preconBudget?: number
  designBudget?: number
  leadEstimator?: string
  px?: string
}

// --- Takeoff Manager Types ---
export type TakeoffType = "area" | "linear" | "count" | "volume" | "assembly"

export interface TakeoffMeasurement {
  length?: number
  width?: number
  height?: number
  depth?: number
  area?: number
  volume?: number
  count?: number
  weight?: number
}

export interface TakeoffItem {
  id: string
  csiCode: string
  csiDivision: string
  description: string
  takeoffType: TakeoffType
  measurements: TakeoffMeasurement
  unitOfMeasure: string
  unitCost: number
  totalCost: number
  laborHours: number
  laborRate: number
  materialCost: number
  equipmentCost: number
  subcontractorCost: number
  markup: number
  location: string
  floor: string
  phase: string
  status: "draft" | "reviewed" | "approved" | "locked"
  notes?: string
  attachments?: string[]
  lastModified: string
}
