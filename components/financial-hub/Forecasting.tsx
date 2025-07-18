"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import {
  Calendar,
  TrendingUp,
  Bot,
  Settings,
  Download,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Target,
  BarChart3,
  Send,
  MessageSquare,
  Lightbulb,
  Brain,
  Maximize,
  Minimize,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Edit3,
  Clock,
  Eye,
  Search,
  Loader2,
  CheckCircle2,
  Database,
  TrendingDown,
  Activity,
  TestTube,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ProtectedGrid,
  ProtectedColDef,
  GridRow,
  GridConfig,
  GridEvents,
  createProtectedColumn,
  createReadOnlyColumn,
  createGridWithTotalsAndSticky,
} from "@/components/ui/protected-grid"

interface ForecastingProps {
  userRole: string
  projectData: any
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ForecastAcknowledgment {
  recordId: string
  userId: string
  timestamp: Date
  acknowledged: boolean
  previousMethod: string
  reasoning: string
}

// Updated forecast data structure - removed forecast_method and weight
interface ForecastRecord {
  id: string
  project_id: number
  forecast_type: "gcgr" | "draw"
  cost_code?: string
  cost_code_description?: string
  csi_code?: string
  csi_description?: string
  budget: number
  cost_to_complete: number
  estimated_at_completion: number
  variance: number
  start_date: string
  end_date: string
  actual_remaining_forecast: { [month: string]: number }
  previous_forecast: { [month: string]: number }
  variance_amounts: { [month: string]: number }
}

// New interface for HBI Review Analysis
interface HBIAnalysisMode {
  type: "cost_code" | "csi_code" | "full_forecast"
  record?: ForecastRecord
  label: string
}

interface HBIAnalysisPhase {
  phase: string
  status: "pending" | "analyzing" | "complete"
  content?: string
  duration?: number
}

interface MockChatExchange {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

// Generate monthly columns for the next 12 months
const generateMonthlyColumns = () => {
  const columns = []
  const currentDate = new Date()

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
    const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "2-digit" })
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    columns.push({ label: monthYear, key: monthKey })
  }

  return columns
}

// Mock enhanced forecast data - removed forecast_method and weight
const generateMockForecastData = (): ForecastRecord[] => {
  const monthlyColumns = generateMonthlyColumns()
  const mockData: ForecastRecord[] = []

  // GC & GR Records
  const gcgrRecords = [
    {
      cost_code: "01-00-000",
      cost_code_description: "Presentation/Proposal/Rfq",
      budget: 125000,
    },
    {
      cost_code: "01-01-000",
      cost_code_description: "General Conditions",
      budget: 2500000,
    },
    {
      cost_code: "01-01-022",
      cost_code_description: "Contingency",
      budget: 1800000,
    },
    {
      cost_code: "15-02-227",
      cost_code_description: "Waste Material Disposal",
      budget: 450000,
    },
    {
      cost_code: "10-01-571",
      cost_code_description: "Erosion & Sediment Control",
      budget: 320000,
    },
  ]

  // Draw Records
  const drawRecords = [
    {
      csi_code: "27 26 00",
      csi_description: "Data Communications Programming and Integration",
      budget: 850000,
    },
    {
      csi_code: "23 05 00",
      csi_description: "Common Work Results for HVAC",
      budget: 1200000,
    },
    {
      csi_code: "03 30 00",
      csi_description: "Cast-in-Place Concrete",
      budget: 2800000,
    },
    {
      csi_code: "07 84 00",
      csi_description: "Firestopping",
      budget: 425000,
    },
    {
      csi_code: "26 27 00",
      csi_description: "Low-Voltage Distribution Equipment",
      budget: 675000,
    },
  ]

  // Generate GC & GR records
  gcgrRecords.forEach((record, index) => {
    const cost_to_complete = record.budget * (0.3 + Math.random() * 0.4)
    const estimated_at_completion = record.budget + (Math.random() - 0.5) * record.budget * 0.1

    // Generate monthly data
    const actual_remaining_forecast: { [key: string]: number } = {}
    const previous_forecast: { [key: string]: number } = {}
    const variance_amounts: { [key: string]: number } = {}

    monthlyColumns.forEach((month, monthIndex) => {
      const baseAmount = record.budget / 12
      const currentAmount = baseAmount * (0.8 + Math.random() * 0.4)
      const previousAmount = baseAmount * (0.9 + Math.random() * 0.2)

      actual_remaining_forecast[month.key] = currentAmount
      previous_forecast[month.key] = previousAmount
      variance_amounts[month.key] = currentAmount - previousAmount
    })

    mockData.push({
      id: `gcgr-${index}`,
      project_id: 1001,
      forecast_type: "gcgr",
      cost_code: record.cost_code,
      cost_code_description: record.cost_code_description,
      budget: record.budget,
      cost_to_complete,
      estimated_at_completion,
      variance: estimated_at_completion - record.budget,
      start_date: "2024-01-15",
      end_date: "2024-12-30",
      actual_remaining_forecast,
      previous_forecast,
      variance_amounts,
    })
  })

  // Generate Draw records
  drawRecords.forEach((record, index) => {
    const cost_to_complete = record.budget * (0.25 + Math.random() * 0.5)
    const estimated_at_completion = record.budget + (Math.random() - 0.5) * record.budget * 0.15

    // Generate monthly data
    const actual_remaining_forecast: { [key: string]: number } = {}
    const previous_forecast: { [key: string]: number } = {}
    const variance_amounts: { [key: string]: number } = {}

    monthlyColumns.forEach((month, monthIndex) => {
      const baseAmount = record.budget / 12
      const currentAmount = baseAmount * (0.7 + Math.random() * 0.6)
      const previousAmount = baseAmount * (0.85 + Math.random() * 0.3)

      actual_remaining_forecast[month.key] = currentAmount
      previous_forecast[month.key] = previousAmount
      variance_amounts[month.key] = currentAmount - previousAmount
    })

    mockData.push({
      id: `draw-${index}`,
      project_id: 1001,
      forecast_type: "draw",
      csi_code: record.csi_code,
      csi_description: record.csi_description,
      budget: record.budget,
      cost_to_complete,
      estimated_at_completion,
      variance: estimated_at_completion - record.budget,
      start_date: "2024-02-01",
      end_date: "2024-11-15",
      actual_remaining_forecast,
      previous_forecast,
      variance_amounts,
    })
  })

  return mockData
}

// Mock HBI analysis data generators
const generateMockAnalysisPhases = (analysisMode: HBIAnalysisMode): HBIAnalysisPhase[] => {
  const basePhases = [
    { phase: "Initializing Analysis", status: "pending" as const, duration: 1500 },
    { phase: "Processing Historical Data", status: "pending" as const, duration: 2000 },
    { phase: "Analyzing Project Schedule", status: "pending" as const, duration: 1800 },
    { phase: "Evaluating Market Conditions", status: "pending" as const, duration: 2200 },
    { phase: "Assessing Risk Factors", status: "pending" as const, duration: 1600 },
    { phase: "Generating Insights", status: "pending" as const, duration: 2500 },
    { phase: "Finalizing Analysis", status: "pending" as const, duration: 1200 },
  ]

  if (analysisMode.type === "full_forecast") {
    return [
      ...basePhases.slice(0, 2),
      { phase: "Processing All Cost Codes & CSI Divisions", status: "pending" as const, duration: 3000 },
      { phase: "Cross-referencing Forecast Dependencies", status: "pending" as const, duration: 2800 },
      ...basePhases.slice(2),
    ]
  }

  return basePhases
}

const generateMockAnalysisContent = (analysisMode: HBIAnalysisMode): string => {
  const projectName = "Riverside Plaza Mixed-Use Development"

  if (analysisMode.type === "cost_code" && analysisMode.record) {
    return `## Analysis: ${analysisMode.record.cost_code} - ${analysisMode.record.cost_code_description}

**Forecast Confidence: 94.2%**

### Key Findings:
• **Historical Performance**: Similar cost codes on comparable projects show 92% accuracy within ±3% variance
• **Schedule Integration**: Work completion aligns with critical path activities in Q3-Q4 timeline
• **Resource Availability**: Current market conditions support projected resource allocation
• **Weather Impact**: Seasonal weather patterns may affect outdoor activities by 5-8 days
• **Cost Trends**: Material costs showing 2.1% inflation trend, factored into projections

### Risk Assessment:
- **Low Risk (85%)**: Standard construction activities with proven methodologies
- **Medium Risk (12%)**: Weather dependency for exterior work phases
- **High Risk (3%)**: Potential supply chain disruptions for specialized materials

### Recommendations:
• Monitor weather forecasts closely during Q3 exterior work
• Maintain 10% schedule buffer for weather-related delays
• Consider early procurement of specialized materials
• Establish backup supplier relationships for critical components

**Projected Variance**: +2.3% over budget due to market inflation adjustments`
  }

  if (analysisMode.type === "csi_code" && analysisMode.record) {
    return `## Analysis: ${analysisMode.record.csi_code} - ${analysisMode.record.csi_description}

**Forecast Confidence: 91.7%**

### Key Findings:
• **Industry Benchmarks**: CSI division performance data from 127 similar projects analyzed
• **Trade Coordination**: Optimal sequencing identified with mechanical and electrical trades
• **Technology Integration**: Modern systems require specialized installation expertise
• **Quality Standards**: Enhanced specifications may extend installation timeline by 3-5%
• **Regulatory Compliance**: All code requirements verified and incorporated

### Market Intelligence:
- **Supplier Network**: 3 primary suppliers identified with backup options
- **Labor Availability**: Qualified technicians available within 50-mile radius
- **Equipment Access**: Specialized installation equipment secured through vendor partnerships
- **Warranty Coverage**: Extended warranty options available affecting long-term value

### Financial Impact:
• **Base Cost Accuracy**: 96% confidence in current pricing
• **Escalation Factors**: 1.8% monthly escalation built into projections
• **Value Engineering**: Potential 4% cost savings identified through specification optimization

**Projected Outcome**: On-time completion with 91.7% budget accuracy`
  }

  // Full forecast analysis
  return `## Comprehensive Forecast Analysis: ${projectName}

**Overall Forecast Confidence: 93.5%**

### Portfolio Analysis Summary:
• **Total Records Analyzed**: 10 forecast lines (5 GC&GR + 5 Draw Forecast)
• **Combined Budget Scope**: $8.97M across all divisions
• **Historical Correlation**: 94.1% accuracy based on 200+ comparable projects
• **Risk Distribution**: 78% low risk, 19% medium risk, 3% high risk activities

### Cross-Division Dependencies:
- **Critical Path Integration**: All divisions synchronized with master schedule
- **Resource Coordination**: Optimal crew deployment identified across trades
- **Cash Flow Optimization**: Payment schedules aligned with completion milestones
- **Quality Checkpoints**: Integrated QA/QC protocols across all divisions

### Market Intelligence:
• **Economic Indicators**: Regional construction market showing 3.2% growth
• **Material Availability**: No critical shortages anticipated in forecast period
• **Labor Market**: Skilled trades availability at 94% of required capacity
• **Regulatory Environment**: No pending code changes affecting project scope

### Strategic Recommendations:
1. **Accelerate Procurement**: Front-load material orders for Q4 activities
2. **Weather Contingency**: Build 7-day buffer for weather-sensitive operations
3. **Quality Focus**: Enhanced inspection protocols to prevent rework delays
4. **Cash Flow Management**: Optimize payment applications for improved working capital

### Financial Projections:
- **Total Project Value**: $8,970,000
- **Projected Final Cost**: $9,156,450 (+2.1% favorable variance)
- **Completion Timeline**: On schedule with 5-day contingency buffer
- **Profit Margin Impact**: Maintained at target 8.5% through cost optimization

**Overall Assessment**: Project positioned for successful completion within budget and schedule parameters with strong confidence indicators across all forecast divisions.`
}

const generateMockChatExchange = (analysisMode: HBIAnalysisMode): MockChatExchange[] => {
  const baseTimestamp = new Date()

  if (analysisMode.type === "cost_code") {
    return [
      {
        id: "user-1",
        type: "user",
        content: "What specific factors are driving the 2.3% variance in this cost code forecast?",
        timestamp: new Date(baseTimestamp.getTime() + 30000),
      },
      {
        id: "ai-1",
        type: "assistant",
        content:
          "The 2.3% variance is primarily driven by three factors: (1) Material cost inflation of 2.1% based on current market trends, (2) Weather contingency buffer of 0.8% for exterior work phases, and (3) Labor rate adjustments of 0.6% due to regional market conditions. Historical data shows similar cost codes typically see 1.8-3.2% variances, so this projection falls within normal parameters.",
        timestamp: new Date(baseTimestamp.getTime() + 45000),
      },
      {
        id: "user-2",
        type: "user",
        content: "How reliable is the 94.2% confidence rating? What could reduce this confidence level?",
        timestamp: new Date(baseTimestamp.getTime() + 90000),
      },
      {
        id: "ai-2",
        type: "assistant",
        content:
          "The 94.2% confidence is based on analysis of 127 similar projects with comparable scope and conditions. This confidence could be reduced by: unexpected regulatory changes (impact: -5-8%), major weather events beyond seasonal norms (impact: -3-6%), or significant supply chain disruptions (impact: -8-12%). The model continuously monitors these risk factors and would alert you to confidence level changes as new data becomes available.",
        timestamp: new Date(baseTimestamp.getTime() + 120000),
      },
    ]
  }

  if (analysisMode.type === "csi_code") {
    return [
      {
        id: "user-1",
        type: "user",
        content: "Are there any trade coordination risks that could impact the timeline for this CSI division?",
        timestamp: new Date(baseTimestamp.getTime() + 30000),
      },
      {
        id: "ai-1",
        type: "assistant",
        content:
          "Yes, I've identified two key coordination points: (1) This division requires electrical rough-in completion before proceeding, currently scheduled for Week 12. Any delays in electrical work would directly impact this timeline. (2) There's a 3-day overlap requirement with HVAC installation that needs careful scheduling. I recommend scheduling a coordination meeting with electrical and HVAC trades by Week 8 to confirm sequencing and resolve any conflicts early.",
        timestamp: new Date(baseTimestamp.getTime() + 45000),
      },
      {
        id: "user-2",
        type: "user",
        content: "What's the impact of the value engineering options you mentioned?",
        timestamp: new Date(baseTimestamp.getTime() + 90000),
      },
      {
        id: "ai-2",
        type: "assistant",
        content:
          "The 4% cost savings opportunity comes from specification optimization in three areas: (1) Alternative manufacturer approval for equivalent components (-2.1%), (2) Installation methodology improvements (-1.2%), and (3) Bulk procurement coordination with other divisions (-0.7%). These changes would maintain all performance requirements while reducing costs by approximately $27,000. However, they would require owner approval and may extend procurement timeline by 5-7 days.",
        timestamp: new Date(baseTimestamp.getTime() + 120000),
      },
    ]
  }

  // Full forecast chat
  return [
    {
      id: "user-1",
      type: "user",
      content:
        "Looking at the overall project forecast, which divisions present the highest risk to our completion timeline?",
      timestamp: new Date(baseTimestamp.getTime() + 30000),
    },
    {
      id: "ai-1",
      type: "assistant",
      content:
        "Based on the comprehensive analysis, three divisions require close monitoring: (1) Cast-in-Place Concrete (03 30 00) due to weather sensitivity and critical path positioning, (2) HVAC Common Work (23 05 00) which has equipment procurement lead times, and (3) Data Communications (27 26 00) requiring specialized technicians. The concrete work poses the highest schedule risk due to winter weather constraints in Q4. I recommend prioritizing concrete pours earlier in the season and maintaining alternative curing methods as backup.",
      timestamp: new Date(baseTimestamp.getTime() + 45000),
    },
    {
      id: "user-2",
      type: "user",
      content: "How should we adjust our cash flow management based on this forecast analysis?",
      timestamp: new Date(baseTimestamp.getTime() + 90000),
    },
    {
      id: "ai-2",
      type: "assistant",
      content:
        "The forecast indicates optimal cash flow management through three strategies: (1) Front-load material purchases by 15-20% to capture current pricing and avoid inflation, requiring $1.2M earlier cash outlay but saving $186K in escalation costs, (2) Accelerate payment applications for completed work to improve working capital by submitting bi-weekly instead of monthly during peak activity periods, and (3) Coordinate retention releases with milestone completions to recover $447K in held funds 30 days earlier than standard practice. This approach would improve overall project cash flow by approximately $285K.",
      timestamp: new Date(baseTimestamp.getTime() + 120000),
    },
  ]
}

export default function Forecasting({ userRole, projectData }: ForecastingProps) {
  const [activeTable, setActiveTable] = useState<"gcgr" | "draw">("gcgr")
  const [forecastData, setForecastData] = useState<ForecastRecord[]>([])
  const [monthlyColumns, setMonthlyColumns] = useState<{ label: string; key: string }[]>([])
  const [editingField, setEditingField] = useState<string>("")

  // HBI Review Modal States
  const [showHBIReviewModal, setShowHBIReviewModal] = useState(false)
  const [hbiAnalysisMode, setHBIAnalysisMode] = useState<HBIAnalysisMode | null>(null)
  const [analysisPhases, setAnalysisPhases] = useState<HBIAnalysisPhase[]>([])
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisContent, setAnalysisContent] = useState<string>("")
  const [chatExchange, setChatExchange] = useState<MockChatExchange[]>([])
  const [showChatExchange, setShowChatExchange] = useState(false)
  const [mockChatInput, setMockChatInput] = useState("")
  const [isMockTyping, setIsMockTyping] = useState(false)
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [currentMockSequence, setCurrentMockSequence] = useState<{ question: string; answer: string }[]>([])
  const [mockSequenceIndex, setMockSequenceIndex] = useState(0)

  // Chat container ref for auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when chat exchange updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatExchange, isAIProcessing])

  // Legacy state variables (for backward compatibility)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [chatRecord, setChatRecord] = useState<ForecastRecord | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [showHBIChat, setShowHBIChat] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showHBIDialog, setShowHBIDialog] = useState(false)
  const [hbiExplanation, setHbiExplanation] = useState<any>(null)

  // Legacy function for backward compatibility
  const getHBIForecastExplanation = (record: ForecastRecord) => {
    return {
      reasoning: "AI-powered analysis based on historical data and market conditions.",
      factors: ["Historical performance", "Market trends", "Weather patterns"],
    }
  }

  // Acknowledgment system state
  const [previousMethodMap, setPreviousMethodMap] = useState<{ [recordId: string]: string }>({})
  const [acknowledgmentRequired, setAcknowledgmentRequired] = useState(false)
  const [acknowledgments, setAcknowledgments] = useState<ForecastAcknowledgment[]>([])
  const [showExitAcknowledgment, setShowExitAcknowledgment] = useState(false)

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Initialize data
  useEffect(() => {
    // Initialize monthly columns
    setMonthlyColumns(generateMonthlyColumns())

    const savedData = localStorage.getItem("hb-forecast-data")
    if (savedData) {
      setForecastData(JSON.parse(savedData))
    } else {
      const mockData = generateMockForecastData()
      setForecastData(mockData)
    }

    // Load acknowledgments from localStorage
    const savedAcknowledgments = localStorage.getItem("hb-forecast-acknowledgments")
    if (savedAcknowledgments) {
      const parsed = JSON.parse(savedAcknowledgments)
      // Convert timestamp strings back to Date objects
      const acknowledgementsWithDates = parsed.map((ack: any) => ({
        ...ack,
        timestamp: new Date(ack.timestamp),
      }))
      setAcknowledgments(acknowledgementsWithDates)
    }

    // Load previous method map from localStorage
    const savedPreviousMethods = localStorage.getItem("hb-forecast-previous-methods")
    if (savedPreviousMethods) {
      setPreviousMethodMap(JSON.parse(savedPreviousMethods))
    }
  }, [])

  // Save acknowledgments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("hb-forecast-acknowledgments", JSON.stringify(acknowledgments))
  }, [acknowledgments])

  // Save previous methods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("hb-forecast-previous-methods", JSON.stringify(previousMethodMap))
  }, [previousMethodMap])

  // Filter data by table type
  const filteredData = useMemo(() => {
    return forecastData.filter((record) => record.forecast_type === activeTable)
  }, [forecastData, activeTable])

  // Beta Grid Functions (moved here to avoid hoisting issues)
  const createProtectedGridData = (records: ForecastRecord[]): GridRow[] => {
    const gridData: GridRow[] = []

    records.forEach((record, index) => {
      const displayName =
        record.forecast_type === "gcgr"
          ? `${record.cost_code} - ${record.cost_code_description}`
          : `${record.csi_code} - ${record.csi_description}`

      // Group index for visual styling (alternates every group of 3 rows)
      const groupIndex = index
      const isEvenGroup = groupIndex % 2 === 0

      // Main row with actual/remaining forecast
      const mainRow: GridRow = {
        id: `${record.id}-main`,
        recordId: record.id,
        displayName,
        rowType: "actual",
        description: "Actual / Remaining Forecast",
        budget: record.budget,
        costToComplete: record.cost_to_complete,
        estimatedAtCompletion: record.estimated_at_completion,
        variance: record.variance,
        startDate: record.start_date,
        endDate: record.end_date,
        groupIndex,
        isEvenGroup,
        ...Object.fromEntries(
          monthlyColumns.map((month) => [`month_${month.key}`, record.actual_remaining_forecast[month.key] || 0])
        ),
      }

      // Previous forecast row
      const previousRow: GridRow = {
        id: `${record.id}-previous`,
        recordId: record.id,
        displayName: "",
        rowType: "previous",
        description: "Previous Forecast",
        budget: record.budget * 0.95,
        costToComplete: record.cost_to_complete * 1.05,
        estimatedAtCompletion: record.estimated_at_completion * 0.98,
        variance: record.variance * 0.85,
        startDate: record.start_date,
        endDate: record.end_date,
        groupIndex,
        isEvenGroup,
        ...Object.fromEntries(
          monthlyColumns.map((month) => [`month_${month.key}`, record.previous_forecast[month.key] || 0])
        ),
      }

      // Variance row
      const varianceRow: GridRow = {
        id: `${record.id}-variance`,
        recordId: record.id,
        displayName: "",
        rowType: "variance",
        description: "Variance",
        budget: record.budget * 0.05,
        costToComplete: record.cost_to_complete * -0.05,
        estimatedAtCompletion: record.estimated_at_completion * 0.02,
        variance: record.variance * 0.15,
        startDate: "-",
        endDate: "-",
        groupIndex,
        isEvenGroup,
        ...Object.fromEntries(
          monthlyColumns.map((month) => [`month_${month.key}`, record.variance_amounts[month.key] || 0])
        ),
      }

      gridData.push(mainRow, previousRow, varianceRow)
    })

    return gridData
  }

  const createProtectedGridColumns = (): ProtectedColDef[] => {
    const baseColumns: ProtectedColDef[] = [
      createProtectedColumn(
        "displayName",
        "Cost Code",
        { level: "none" },
        {
          pinned: "left",
          cellStyle: (params: any) => {
            const style: any = {}
            if (params.data?.rowType === "actual") {
              style.fontWeight = "600"
              style.color = "#0f172a" // Darker text for light mode
              style.fontSize = "11px" // Reduced font size
            } else {
              style.paddingLeft = "20px"
              style.fontStyle = "italic"
              style.color = "#64748b" // Better contrast for sub-rows
              style.fontSize = "10px" // Reduced font size for sub-rows
            }

            // Dark mode support
            if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
              if (params.data?.rowType === "actual") {
                style.color = "#f8fafc" // Light text for dark mode
              } else {
                style.color = "#94a3b8" // Better contrast for dark mode sub-rows
              }
            }

            // Add subtle left border for visual grouping
            if (params.data?.rowType === "actual") {
              style.borderLeft = params.data.isEvenGroup
                ? "3px solid rgba(59, 130, 246, 0.3)"
                : "3px solid rgba(156, 163, 175, 0.3)"
            }

            return style
          },
        }
      ),
      createReadOnlyColumn("description", "Type", {
        cellStyle: (params: any) => {
          const style: any = { fontSize: "10px" } // Reduced base font size

          // Enhanced styling based on row type
          if (params.data?.rowType === "actual") {
            style.fontWeight = "600"
            style.color = "#0f172a"
            style.fontSize = "11px" // Reduced font size
          } else if (params.data?.rowType === "previous") {
            style.color = "#64748b"
            style.fontStyle = "italic"
            style.fontSize = "9px" // Reduced font size for previous rows
          } else if (params.data?.rowType === "variance") {
            style.color = params.data.variance >= 0 ? "#059669" : "#dc2626" // Green for positive, red for negative
            style.fontWeight = "500"
            style.fontSize = "10px" // Reduced font size for variance rows
          }

          // Dark mode support
          if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            if (params.data?.rowType === "actual") {
              style.color = "#f8fafc"
            } else if (params.data?.rowType === "previous") {
              style.color = "#94a3b8"
            }
          }

          return style
        },
      }),
      createProtectedColumn(
        "budget",
        "Budget",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value || 0),
          cellStyle: (params: any) => {
            const style: any = { textAlign: "right", fontSize: "10px" } // Reduced font size
            if (params.data?.rowType === "variance") {
              style.color = (params.value || 0) >= 0 ? "#16a34a" : "#dc2626"
              style.fontWeight = "600"
            }
            return style
          },
        }
      ),
      createProtectedColumn(
        "costToComplete",
        "Cost to Complete",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value || 0),
          cellStyle: (params: any) => {
            const style: any = { textAlign: "right", fontSize: "10px" } // Reduced font size
            if (params.data?.rowType === "variance") {
              style.color = (params.value || 0) >= 0 ? "#16a34a" : "#dc2626"
              style.fontWeight = "600"
            }
            return style
          },
        }
      ),
      createProtectedColumn(
        "estimatedAtCompletion",
        "Est. at Completion",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value || 0),
          cellStyle: (params: any) => {
            const style: any = { textAlign: "right", fontSize: "10px" } // Reduced font size
            if (params.data?.rowType === "variance") {
              style.color = (params.value || 0) >= 0 ? "#16a34a" : "#dc2626"
              style.fontWeight = "600"
            }
            return style
          },
        }
      ),
      createProtectedColumn(
        "variance",
        "Variance",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value || 0),
          cellStyle: (params: any) => {
            const style: any = {
              textAlign: "right",
              fontSize: "10px", // Reduced font size
              color: (params.value || 0) >= 0 ? "#16a34a" : "#dc2626",
              fontWeight: "600",
            }
            return style
          },
        }
      ),
      createProtectedColumn(
        "startDate",
        "Start Date",
        { level: "none" },
        {
          cellStyle: { textAlign: "right", fontSize: "10px" }, // Reduced font size
        }
      ),
      createProtectedColumn(
        "endDate",
        "End Date",
        { level: "none" },
        {
          cellStyle: { textAlign: "right", fontSize: "10px" }, // Reduced font size
        }
      ),
    ]

    // Add monthly columns
    const monthlyColumnsData = generateMonthlyColumns()
    monthlyColumnsData.forEach((month) => {
      baseColumns.push(
        createProtectedColumn(
          `month_${month.key}`,
          month.label,
          { level: "none" },
          {
            type: "numericColumn",
            valueFormatter: (params: any) => formatCurrency(params.value || 0),
            cellStyle: (params: any) => {
              const style: any = { textAlign: "right", fontSize: "10px" } // Reduced font size
              if (params.data?.rowType === "variance") {
                style.color = (params.value || 0) >= 0 ? "#16a34a" : "#dc2626"
                style.fontWeight = "600"
              } else if (params.data?.rowType === "previous") {
                style.color = "#666"
                style.fontSize = "9px" // Reduced font size for previous rows
              }
              return style
            },
          }
        )
      )
    })

    return baseColumns
  }

  // Grid configuration and events
  const protectedGridConfig: GridConfig = {
    allowExport: true,
    allowImport: false,
    allowRowSelection: false,
    allowMultiSelection: false,
    allowColumnReordering: true, // Allow column reordering
    allowColumnResizing: true, // Enable column resizing for auto-sizing
    allowSorting: true, // Allow sorting
    allowFiltering: true,
    allowCellEditing: true,
    showToolbar: true,
    showStatusBar: true,
    enableRangeSelection: false, // Disabled - requires enterprise license
    protectionEnabled: true,
    userRole: userRole,
    theme: "quartz", // Use quartz theme for better dark mode support
    enableTotalsRow: true,
    stickyColumnsCount: 3, // Keep first 3 columns sticky for auto-sizing
    rowHeight: 32, // Reduced row height from default
  }

  const protectedGridEvents: GridEvents = {
    onCellValueChanged: (event) => {
      // Handle cell value changes
      console.log("Cell value changed:", event)

      // Update the underlying forecast data
      const recordId = event.data.recordId
      const field = event.column.getColId()

      if (field.startsWith("month_")) {
        const monthKey = field.replace("month_", "")
        setForecastData((prev) =>
          prev.map((record) => {
            if (record.id === recordId) {
              const newActual = { ...record.actual_remaining_forecast }
              newActual[monthKey] = Number(event.newValue)
              return {
                ...record,
                actual_remaining_forecast: newActual,
                variance_amounts: calculateVarianceAmounts({ ...record, actual_remaining_forecast: newActual }),
              }
            }
            return record
          })
        )
      } else {
        updateRecord(recordId, field, event.newValue)
      }

      setHasUnsavedChanges(true)
    },
    onGridReady: (event) => {
      // Auto-size all columns to fit their content
      event.api.autoSizeAllColumns()

      // Apply custom row styling for grouped rows
      const gridOptions = event.api.getGridOption("getRowStyle")
      event.api.setGridOption("getRowStyle", (params: any) => {
        // First apply existing row style (for totals row)
        const existingStyle = gridOptions ? gridOptions(params) : {}

        // Apply forecasting group styling
        if (params.data?.isEvenGroup !== undefined) {
          const groupStyle = {
            backgroundColor: params.data.isEvenGroup ? "rgba(59, 130, 246, 0.02)" : "rgba(255, 255, 255, 0.8)", // Very subtle blue tint for even groups
          }

          // Special styling for different row types within each group
          if (params.data.rowType === "previous") {
            groupStyle.backgroundColor = params.data.isEvenGroup
              ? "rgba(59, 130, 246, 0.04)"
              : "rgba(156, 163, 175, 0.08)" // Slightly darker for previous rows
          } else if (params.data.rowType === "variance") {
            groupStyle.backgroundColor = params.data.isEvenGroup
              ? "rgba(59, 130, 246, 0.06)"
              : "rgba(156, 163, 175, 0.12)" // Even darker for variance rows
          }

          return { ...existingStyle, ...groupStyle }
        }

        return existingStyle
      })
    },
  }

  // Custom totals calculator for forecasting data
  const forecastTotalsCalculator = (data: GridRow[], columnField: string): number | string => {
    // Only calculate totals for "actual" row types (skip previous and variance rows)
    const actualRows = data.filter((row) => row.rowType === "actual")

    if (actualRows.length === 0) return ""

    switch (columnField) {
      case "displayName":
        return "TOTAL"
      case "description":
        return "All Records"
      case "budget":
      case "costToComplete":
      case "estimatedAtCompletion":
      case "variance":
        const total = actualRows.reduce((sum, row) => sum + (Number(row[columnField]) || 0), 0)
        return total
      case "startDate":
        // Show earliest start date
        const startDates = actualRows
          .map((row) => row[columnField])
          .filter((date) => date && date !== "-")
          .sort()
        return startDates.length > 0 ? startDates[0] : ""
      case "endDate":
        // Show latest end date
        const endDates = actualRows
          .map((row) => row[columnField])
          .filter((date) => date && date !== "-")
          .sort()
          .reverse()
        return endDates.length > 0 ? endDates[0] : ""
      default:
        // Handle monthly columns
        if (columnField.startsWith("month_")) {
          const total = actualRows.reduce((sum, row) => sum + (Number(row[columnField]) || 0), 0)
          return total
        }
        return ""
    }
  }

  // Memoized grid data and columns
  const protectedGridData = useMemo(() => {
    return createProtectedGridData(filteredData)
  }, [filteredData, monthlyColumns])

  const protectedGridColumns = useMemo(() => {
    return createProtectedGridColumns()
  }, [monthlyColumns])

  // Calculate totals
  const calculateTotals = useMemo(() => {
    const data = filteredData
    const totals = {
      budget: 0,
      cost_to_complete: 0,
      estimated_at_completion: 0,
      variance: 0,
      monthly_actual: {} as { [key: string]: number },
      monthly_previous: {} as { [key: string]: number },
      monthly_variance: {} as { [key: string]: number },
    }

    data.forEach((record) => {
      totals.budget += record.budget
      totals.cost_to_complete += record.cost_to_complete
      totals.estimated_at_completion += record.estimated_at_completion
      totals.variance += record.variance

      monthlyColumns.forEach((month) => {
        if (!totals.monthly_actual[month.key]) totals.monthly_actual[month.key] = 0
        if (!totals.monthly_previous[month.key]) totals.monthly_previous[month.key] = 0
        if (!totals.monthly_variance[month.key]) totals.monthly_variance[month.key] = 0

        totals.monthly_actual[month.key] += record.actual_remaining_forecast[month.key] || 0
        totals.monthly_previous[month.key] += record.previous_forecast[month.key] || 0
        totals.monthly_variance[month.key] += record.variance_amounts[month.key] || 0
      })
    })

    return totals
  }, [filteredData, monthlyColumns])

  // Update record function
  const updateRecord = (recordId: string, field: string, value: any) => {
    setForecastData((prev) => {
      const updated = prev.map((record) => {
        if (record.id === recordId) {
          const updatedRecord = { ...record, [field]: value }

          // Recalculate monthly values when needed
          if (field === "budget" || field === "cost_to_complete") {
            updatedRecord.actual_remaining_forecast = calculateMonthlyDistribution(updatedRecord)
            updatedRecord.variance_amounts = calculateVarianceAmounts(updatedRecord)
          }

          return updatedRecord
        }
        return record
      })

      setHasUnsavedChanges(true)
      return updated
    })
  }

  // Calculate monthly distribution using standard linear method
  const calculateMonthlyDistribution = (record: ForecastRecord) => {
    const distribution: { [key: string]: number } = {}
    const totalAmount = record.budget

    monthlyColumns.forEach((month, index) => {
      // Use equal distribution for all records
      distribution[month.key] = totalAmount / 12
    })

    return distribution
  }

  // Calculate variance amounts
  const calculateVarianceAmounts = (record: ForecastRecord) => {
    const variance: { [key: string]: number } = {}

    monthlyColumns.forEach((month) => {
      const actual = record.actual_remaining_forecast[month.key] || 0
      const previous = record.previous_forecast[month.key] || 0
      variance[month.key] = actual - previous
    })

    return variance
  }

  // Start HBI chat session for specific record
  const startHBIChat = (record: ForecastRecord) => {
    setChatRecord(record)
    const explanation = getHBIForecastExplanation(record)
    const displayName =
      record.forecast_type === "gcgr"
        ? `${record.cost_code} - ${record.cost_code_description}`
        : `${record.csi_code} - ${record.csi_description}`

    // Initialize chat with HBI's explanation
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: "assistant",
      content: `Hello! I'm the HBI AI agent for ${displayName}. Here's my forecast analysis:\n\n**${
        explanation.reasoning
      }**\n\nKey factors I analyzed:\n${explanation.factors
        .map((f: string) => `• ${f}`)
        .join(
          "\n"
        )}\n\nFeel free to ask me questions about this forecast, explore alternative scenarios, or dive deeper into any aspect of my analysis! When you're ready to finalize this forecast, I'll guide you through the acknowledgment process.`,
      timestamp: new Date(),
    }

    setChatMessages([initialMessage])

    // Check if this record already has an acknowledgment
    const existingAck = acknowledgments.find((a) => a.recordId === record.id && a.acknowledged)
    setAcknowledgmentRequired(!existingAck)

    setShowHBIChat(true)
  }

  // Handle forecast acknowledgment
  const acknowledgeForecast = () => {
    if (!chatRecord) return

    const acknowledgment: ForecastAcknowledgment = {
      recordId: chatRecord.id,
      userId: userRole, // In a real app, this would be the actual user ID
      timestamp: new Date(),
      acknowledged: true,
      previousMethod: previousMethodMap[chatRecord.id] || "Manual",
      reasoning: getHBIForecastExplanation(chatRecord).reasoning,
    }

    setAcknowledgments((prev) => [...prev, acknowledgment])
    setAcknowledgmentRequired(false)

    // Add confirmation message to chat
    const confirmationMessage: ChatMessage = {
      id: `msg-${Date.now()}-ack`,
      type: "assistant",
      content: `✅ **Forecast Acknowledged**\n\nThank you for acknowledging this HBI forecast. Your acknowledgment has been recorded with timestamp: ${acknowledgment.timestamp.toLocaleString()}.\n\nThe HBI forecast is now active for this cost code. You can continue chatting with me about optimizations, scenarios, or any questions you might have!`,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, confirmationMessage])
  }

  // Handle forecast rejection - revert to previous method
  const rejectForecast = () => {
    if (!chatRecord) return

    const previousMethod = previousMethodMap[chatRecord.id] || "Manual"

    // Record the rejection
    const rejection: ForecastAcknowledgment = {
      recordId: chatRecord.id,
      userId: userRole,
      timestamp: new Date(),
      acknowledged: false,
      previousMethod: previousMethod,
      reasoning: "User rejected HBI forecast recommendation",
    }

    setAcknowledgments((prev) => [...prev, rejection])

    // Close the chat modal
    setShowHBIChat(false)
    setAcknowledgmentRequired(false)
    setShowExitAcknowledgment(false)
    setChatMessages([])
    setChatRecord(null)
  }

  // Handle modal close attempt
  const handleModalClose = () => {
    if (acknowledgmentRequired) {
      // Show exit acknowledgment dialog instead of closing
      setShowExitAcknowledgment(true)
    } else {
      // Normal close
      setShowHBIChat(false)
      setChatMessages([])
      setChatRecord(null)
    }
  }

  // Handle acknowledgment completion and close
  const acknowledgeAndClose = () => {
    acknowledgeForecast()
    setShowExitAcknowledgment(false)
    setShowHBIChat(false)
    setChatMessages([])
    setChatRecord(null)
  }

  // Handle rejection and close
  const rejectAndClose = () => {
    rejectForecast()
    setShowExitAcknowledgment(false)
  }

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput, chatRecord)
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Generate contextual AI responses
  const generateAIResponse = (userInput: string, record: ForecastRecord | null): string => {
    const input = userInput.toLowerCase()

    // Context-aware responses based on user input
    if (input.includes("weather") || input.includes("season")) {
      return "Weather is a critical factor in my forecast model. For this cost code, I've analyzed:\n\n• **Seasonal patterns**: Historical data shows 23% variance during winter months\n• **Current forecast**: Extended winter predicted, suggesting front-loading of weather-sensitive work\n• **Risk mitigation**: I recommend a 15% contingency buffer for Q4 activities\n\nWould you like me to adjust the forecast assuming different weather scenarios?"
    }

    if (input.includes("cost") || input.includes("budget") || input.includes("price")) {
      return "Cost optimization is central to my recommendations. Here's my analysis:\n\n• **Material escalation**: 4.2% increase projected based on market trends\n• **Labor costs**: Skilled trades showing premium pricing in peak months\n• **Efficiency gains**: 8% savings possible through optimized scheduling\n\nI can model different cost scenarios - would you like to explore the impact of material price changes or labor rate adjustments?"
    }

    if (input.includes("risk") || input.includes("concern") || input.includes("problem")) {
      return "Risk assessment is one of my core strengths. For this forecast, I've identified:\n\n• **Schedule risk**: Medium (15% probability of delay)\n• **Cost overrun risk**: Low (3% variance expected)\n• **Quality risks**: Minimal with current parameters\n• **External risks**: Weather dependency rated as moderate\n\nWhich specific risks would you like me to analyze further or help you develop mitigation strategies for?"
    }

    if (input.includes("scenario") || input.includes("what if") || input.includes("alternative")) {
      return "I excel at scenario modeling! I can adjust this forecast based on:\n\n• **Schedule compression**: Up to 20% faster delivery\n• **Budget constraints**: Cost reduction scenarios\n• **Resource changes**: Different crew sizes or skill levels\n• **Market conditions**: Material cost fluctuations\n• **Weather variations**: Best/worst case climate scenarios\n\nWhat specific scenario would you like me to model? For example, 'What if we accelerate by 30 days?' or 'What if material costs increase by 10%?'"
    }

    if (input.includes("confidence") || input.includes("accuracy") || input.includes("sure")) {
      return "My confidence level for this forecast is **87%** based on:\n\n• **Historical accuracy**: 94.2% on similar projects\n• **Data quality**: High (127 comparable projects analyzed)\n• **Market stability**: Moderate (some volatility expected)\n• **Project specifics**: Well-defined scope and requirements\n\nThe 13% uncertainty primarily stems from external factors like weather and material availability. I can break down the confidence intervals for each forecast component if you'd like more detail."
    }

    // Default response
    return "That's a great question! Based on my analysis of this cost code, I can provide insights on:\n\n• **Forecast methodology** and why I chose this approach\n• **Risk factors** and mitigation strategies\n• **Alternative scenarios** and their impact\n• **Cost optimization** opportunities\n• **Schedule implications** of different approaches\n\nCould you be more specific about what aspect you'd like to explore? I'm here to help you understand every detail of this forecast!"
  }

  // Show traditional HBI explanation (for detailed view)
  const showHBIExplanation = (record: ForecastRecord) => {
    setHbiExplanation(getHBIForecastExplanation(record))
    setShowHBIDialog(true)
  }

  // Save changes to local storage
  const saveChanges = () => {
    localStorage.setItem("hb-forecast-data", JSON.stringify(forecastData))
    setHasUnsavedChanges(false)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // HBI Review Functions
  const startHBIReview = () => {
    setShowHBIReviewModal(true)
    setHBIAnalysisMode(null)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setShowChatExchange(false)
  }

  const selectAnalysisMode = (mode: HBIAnalysisMode) => {
    setHBIAnalysisMode(mode)
    const phases = generateMockAnalysisPhases(mode)
    setAnalysisPhases(phases.map((p) => ({ ...p, status: "pending" as const })))
    setCurrentPhaseIndex(0)
  }

  const startAnalysis = async () => {
    if (!hbiAnalysisMode) return

    setIsAnalyzing(true)
    setCurrentPhaseIndex(0)

    // Simulate analysis phases
    for (let i = 0; i < analysisPhases.length; i++) {
      setCurrentPhaseIndex(i)
      setAnalysisPhases((prev) => prev.map((phase, idx) => (idx === i ? { ...phase, status: "analyzing" } : phase)))

      await new Promise((resolve) => setTimeout(resolve, analysisPhases[i].duration || 2000))

      setAnalysisPhases((prev) => prev.map((phase, idx) => (idx === i ? { ...phase, status: "complete" } : phase)))
    }

    setIsAnalyzing(false)
    setAnalysisComplete(true)
    setAnalysisContent(generateMockAnalysisContent(hbiAnalysisMode))

    // Start mock chat exchange after brief delay
    setTimeout(() => {
      setShowChatExchange(true)
      startMockChatSequence(hbiAnalysisMode)
    }, 2000)
  }

  const resetHBIReview = () => {
    setHBIAnalysisMode(null)
    setAnalysisPhases([])
    setCurrentPhaseIndex(0)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setAnalysisContent("")
    setChatExchange([])
    setShowChatExchange(false)
    setMockChatInput("")
    setIsMockTyping(false)
    setIsAIProcessing(false)
    setCurrentMockSequence([])
    setMockSequenceIndex(0)
  }

  const startMockChatSequence = (analysisMode: HBIAnalysisMode) => {
    const sequence = generateMockChatSequence(analysisMode)
    setCurrentMockSequence(sequence)
    setMockSequenceIndex(0)
    setChatExchange([])
    simulateMockUserInput(sequence[0])
  }

  const generateMockChatSequence = (analysisMode: HBIAnalysisMode): { question: string; answer: string }[] => {
    const baseSequence = [
      {
        question: "How confident are you in this forecast accuracy?",
        answer:
          "I'm 87% confident in this forecast based on analysis of 127 similar projects. The confidence interval ranges from 82-92% depending on external variables like weather and material availability. Historical data shows my forecasts typically achieve 94.2% accuracy within these confidence bounds.",
      },
      {
        question: "What are the biggest risk factors I should monitor?",
        answer:
          "The top 3 risk factors are: 1) Weather delays (15% probability, 5-day impact), 2) Material price volatility (steel prices showing 8% variance), 3) Labor availability during peak season (skilled trades at 95% capacity). I recommend setting up automated alerts for these factors and maintaining a 12% contingency buffer.",
      },
    ]

    if (analysisMode.type === "cost_code") {
      return [
        {
          question: "Why did you choose this distribution pattern for this cost code?",
          answer:
            "For this specific cost code, I analyzed the work breakdown and dependencies. The front-loaded pattern reflects: 1) Early material procurement needs, 2) Weather-dependent activities scheduled for optimal seasons, 3) Coordination with other trades. Historical data shows this pattern reduces overall project risk by 23%.",
        },
        ...baseSequence,
      ]
    } else if (analysisMode.type === "csi_code") {
      return [
        {
          question: "How does this CSI division impact the overall project timeline?",
          answer:
            "This CSI division is on the critical path with 3 major dependencies. Any delays here cascade to 4 downstream activities. I've factored in: 1) Typical trade coordination challenges, 2) Inspection hold points, 3) Material lead times. The schedule buffer I've included accounts for these interdependencies.",
        },
        ...baseSequence,
      ]
    } else {
      return [
        {
          question: "What methodology did you use for the full forecast analysis?",
          answer:
            "I used a hybrid approach combining: 1) Monte Carlo simulation with 10,000 iterations, 2) Machine learning models trained on 500+ similar projects, 3) Real-time market data integration, 4) Weather pattern analysis, 5) Historical performance metrics. This multi-layered approach provides superior accuracy compared to traditional methods.",
        },
        ...baseSequence,
      ]
    }
  }

  const simulateMockUserInput = async (chatItem: { question: string; answer: string }) => {
    if (!chatItem) return

    setMockChatInput("")
    setIsMockTyping(true)

    // Simulate typing the question character by character
    const question = chatItem.question
    for (let i = 0; i <= question.length; i++) {
      setMockChatInput(question.substring(0, i))
      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 50)) // Vary typing speed
    }

    // Small pause before sending
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Send the message
    const userMessage: MockChatExchange = {
      id: `mock-user-${Date.now()}`,
      type: "user",
      content: question,
      timestamp: new Date(),
    }

    setChatExchange((prev) => [...prev, userMessage])
    setMockChatInput("")
    setIsMockTyping(false)

    // Small delay before AI starts processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Show AI processing state
    setIsAIProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1500)) // Vary processing time

    // Add AI response
    const aiMessage: MockChatExchange = {
      id: `mock-ai-${Date.now()}`,
      type: "assistant",
      content: chatItem.answer,
      timestamp: new Date(),
    }

    setChatExchange((prev) => [...prev, aiMessage])
    setIsAIProcessing(false)

    // Continue with next question after delay
    const nextIndex = mockSequenceIndex + 1
    if (nextIndex < currentMockSequence.length) {
      setMockSequenceIndex(nextIndex)
      setTimeout(() => {
        simulateMockUserInput(currentMockSequence[nextIndex])
      }, 3000 + Math.random() * 2000) // Vary delay between questions
    }
  }

  const getAvailableAnalysisModes = (): HBIAnalysisMode[] => {
    const modes: HBIAnalysisMode[] = [
      {
        type: "full_forecast",
        label: "Full Forecast Analysis",
      },
    ]

    // Add specific record analysis options based on active table
    if (activeTable === "gcgr" && filteredData.length > 0) {
      modes.unshift({
        type: "cost_code",
        record: filteredData[0], // Use first record as example
        label: `Analyze by Cost Code (${filteredData[0].cost_code})`,
      })
    }

    if (activeTable === "draw" && filteredData.length > 0) {
      modes.unshift({
        type: "csi_code",
        record: filteredData[0], // Use first record as example
        label: `Analyze by CSI Code (${filteredData[0].csi_code})`,
      })
    }

    return modes
  }

  // Inline editing component
  const InlineEdit = ({
    value,
    onSave,
    type = "text",
    className = "",
    options = null,
    isWeight = false,
  }: {
    value: any
    onSave: (value: any) => void
    type?: "text" | "number" | "select" | "date"
    className?: string
    options?: { value: string; label: string }[] | null
    isWeight?: boolean
  }) => {
    const fieldKey = `${type}-${value}`
    const isEditing = editingField === fieldKey
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
      onSave(editValue)
      setEditingField("")
    }

    const handleCancel = () => {
      setEditValue(value)
      setEditingField("")
    }

    if (isEditing) {
      if (type === "select" && options) {
        return (
          <div className="flex items-center gap-1">
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
              ✕
            </Button>
          </div>
        )
      }

      if (isWeight) {
        return (
          <div className="flex items-center gap-2 min-w-32">
            <div className="flex-1">
              <Slider
                value={[editValue]}
                onValueChange={(value) => setEditValue(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
            <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
              ✕
            </Button>
          </div>
        )
      }

      return (
        <div className="flex items-center gap-1">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(type === "number" ? Number(e.target.value) : e.target.value)}
            className="w-24 h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
            ✕
          </Button>
        </div>
      )
    }

    return (
      <div
        className={`flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group justify-end ${className}`}
        onClick={() => setEditingField(fieldKey)}
      >
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        <span className="text-xs">
          {isWeight
            ? value <= 3
              ? "Front-Loaded"
              : value >= 8
              ? "Back-Loaded"
              : "Even"
            : type === "number" && typeof value === "number"
            ? formatCurrency(value)
            : value}
        </span>
      </div>
    )
  }

  // Render table row (3 rows per record)
  const renderRecordRows = (record: ForecastRecord) => {
    const displayName =
      record.forecast_type === "gcgr"
        ? `${record.cost_code} - ${record.cost_code_description}`
        : `${record.csi_code} - ${record.csi_description}`

    return (
      <React.Fragment key={record.id}>
        {/* Row 1: Actual / Remaining Forecast */}
        <tr className="border-b hover:bg-muted/50">
          <td className="p-3 font-medium text-sm text-left sticky left-0 bg-white dark:bg-gray-950 z-10">
            <div className="flex items-center gap-2">{displayName}</div>
          </td>
          <td className="p-2 text-[10px] text-muted-foreground text-left">Actual / Remaining Forecast</td>
          <td className="p-2 text-xs text-muted-foreground text-right">{formatCurrency(record.budget)}</td>
          <td className="p-2 text-xs text-muted-foreground text-right">{formatCurrency(record.cost_to_complete)}</td>
          <td className="p-2 text-xs text-muted-foreground text-right">
            {formatCurrency(record.estimated_at_completion)}
          </td>
          <td
            className={`p-2 text-xs font-medium text-right ${record.variance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(record.variance)}
          </td>
          <td className="p-2 text-right">
            <InlineEdit
              value={record.start_date}
              onSave={(value) => updateRecord(record.id, "start_date", value)}
              type="text"
            />
          </td>
          <td className="p-2 text-right">
            <InlineEdit
              value={record.end_date}
              onSave={(value) => updateRecord(record.id, "end_date", value)}
              type="text"
            />
          </td>

          {monthlyColumns.map((month) => (
            <td key={`${record.id}-actual-${month.key}`} className="p-2 text-right">
              <InlineEdit
                value={record.actual_remaining_forecast[month.key] || 0}
                onSave={(value) => {
                  const newActual = { ...record.actual_remaining_forecast }
                  newActual[month.key] = Number(value)
                  updateRecord(record.id, "actual_remaining_forecast", newActual)
                }}
                type="number"
              />
            </td>
          ))}
        </tr>

        {/* Row 2: Previous Forecast */}
        <tr className="border-b bg-muted/20">
          <td className="p-3 sticky left-0 bg-muted/20 z-10"></td>
          <td className="p-2 text-[10px] text-muted-foreground text-left">Previous Forecast</td>
          <td className="p-2 text-xs text-muted-foreground text-right">{formatCurrency(record.budget * 0.95)}</td>
          <td className="p-2 text-xs text-muted-foreground text-right">
            {formatCurrency(record.cost_to_complete * 1.05)}
          </td>
          <td className="p-2 text-xs text-muted-foreground text-right">
            {formatCurrency(record.estimated_at_completion * 0.98)}
          </td>
          <td className="p-2 text-xs text-muted-foreground text-right">{formatCurrency(record.variance * 0.85)}</td>
          <td className="p-2 text-xs text-muted-foreground text-right">{record.start_date}</td>
          <td className="p-2 text-xs text-muted-foreground text-right">{record.end_date}</td>
          {monthlyColumns.map((month) => (
            <td key={`${record.id}-previous-${month.key}`} className="p-2 text-right">
              <div className="text-xs text-muted-foreground">
                {formatCurrency(record.previous_forecast[month.key] || 0)}
              </div>
            </td>
          ))}
        </tr>

        {/* Row 3: Variance */}
        <tr className="border-b bg-muted/10">
          <td className="p-3 sticky left-0 bg-muted/10 z-10"></td>
          <td className="p-2 text-[10px] text-muted-foreground text-left">Variance</td>
          <td className="p-2 text-xs font-medium text-green-600 text-right">{formatCurrency(record.budget * 0.05)}</td>
          <td className="p-2 text-xs font-medium text-red-600 text-right">
            {formatCurrency(record.cost_to_complete * -0.05)}
          </td>
          <td className="p-2 text-xs font-medium text-green-600 text-right">
            {formatCurrency(record.estimated_at_completion * 0.02)}
          </td>
          <td className="p-2 text-xs font-medium text-green-600 text-right">
            {formatCurrency(record.variance * 0.15)}
          </td>
          <td className="p-2 text-right">-</td>
          <td className="p-2 text-right">-</td>
          {monthlyColumns.map((month) => (
            <td key={`${record.id}-variance-${month.key}`} className="p-2 text-right">
              <div
                className={`text-xs font-medium ${
                  (record.variance_amounts[month.key] || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(record.variance_amounts[month.key] || 0)}
              </div>
            </td>
          ))}
        </tr>
      </React.Fragment>
    )
  }

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full overflow-hidden" style={{ width: "100%", maxWidth: "100%" }}>
      {/* Table Selection with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Tabs value={activeTable} onValueChange={(value) => setActiveTable(value as "gcgr" | "draw")}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="gcgr" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                GC & GR Forecast
              </TabsTrigger>
              <TabsTrigger value="draw" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Draw Forecast
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={startHBIReview}
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
          >
            <Brain className="h-4 w-4 mr-2" />
            HBI Review
          </Button>
        </div>
      </div>

      {/* Interactive Forecast Table with Fixed Layout */}
      <div className="w-full min-w-0 max-w-full overflow-hidden">
        <div className="space-y-4">
          <div className="w-full min-w-0 max-w-full overflow-hidden">
            <div className="w-full min-w-0 max-w-full overflow-x-auto overflow-y-visible">
              <div style={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
                <ProtectedGrid
                  title={`${activeTable === "gcgr" ? "GC & GR" : "Draw"} Forecast`}
                  columnDefs={protectedGridColumns}
                  rowData={protectedGridData}
                  config={protectedGridConfig}
                  events={protectedGridEvents}
                  height="700px"
                  width="100%"
                  enableSearch={true}
                  className="border rounded-lg"
                  totalsCalculator={forecastTotalsCalculator}
                />
              </div>
            </div>
          </div>

          {hasUnsavedChanges && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  You have unsaved changes
                </span>
              </div>
              <Button onClick={saveChanges} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* HBI AI Chat Interface - Interactive */}
      <Dialog open={showHBIChat} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-5xl max-h-[85vh] p-0">
          {chatRecord && (
            <>
              <DialogHeader className="p-6 pb-3 border-b">
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900">
                    <Brain className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  HBI AI Agent Chat
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
                  >
                    Live AI
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-base">
                  Interactive HBI Analysis for{" "}
                  {chatRecord?.forecast_type === "gcgr"
                    ? `${chatRecord?.cost_code} - ${chatRecord?.cost_code_description}`
                    : `${chatRecord?.csi_code} - ${chatRecord?.csi_description}`}
                </DialogDescription>
              </DialogHeader>

              <div className="flex h-[60vh]">
                {/* Chat Messages Area */}
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] ${
                              message.type === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 border border-violet-200 dark:border-violet-800"
                            } rounded-lg p-4`}
                          >
                            <div className="flex items-start gap-3">
                              {message.type === "assistant" && (
                                <div className="p-1 rounded-full bg-violet-100 dark:bg-violet-900 flex-shrink-0">
                                  <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div
                                  className={`text-sm ${
                                    message.type === "user" ? "text-white" : "text-gray-900 dark:text-gray-100"
                                  }`}
                                >
                                  {message.content.split("\n").map((line, index) => (
                                    <div key={index}>
                                      {line.startsWith("• ") ? (
                                        <div className="ml-4 mb-1">{line}</div>
                                      ) : line.startsWith("**") && line.endsWith("**") ? (
                                        <div className="font-semibold mb-2">{line.slice(2, -2)}</div>
                                      ) : (
                                        <div className={line ? "mb-2" : "mb-1"}>{line}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div
                                  className={`text-xs mt-2 ${
                                    message.type === "user" ? "text-blue-100" : "text-muted-foreground"
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 border border-violet-200 dark:border-violet-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-1 rounded-full bg-violet-100 dark:bg-violet-900">
                                <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                              </div>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                    <div className="flex gap-3">
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendChatMessage()
                          }
                        }}
                        placeholder="Ask me about this forecast, explore scenarios, or discuss optimizations..."
                        className="flex-1 min-h-[60px] resize-none"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={sendChatMessage}
                        disabled={!chatInput.trim() || isTyping}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Press Enter to send, Shift+Enter for new line
                      {acknowledgmentRequired && (
                        <span className="ml-2 text-yellow-600 font-medium">
                          • Acknowledgment required before closing
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Forecast Context Panel */}
                <div className="w-80 border-l bg-gray-50 dark:bg-gray-900 flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b bg-white dark:bg-gray-800">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-violet-600" />
                      Forecast Context
                    </h4>
                  </div>

                  {/* Scrollable Content */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {/* Compact Budget Card */}
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-md border">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Current Budget</div>
                        <div className="text-sm font-bold text-green-600">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                          }).format(chatRecord?.budget || 0)}
                        </div>
                      </div>

                      {/* Compact Completion Card */}
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-md border">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Est. at Completion</div>
                        <div className="text-sm font-bold text-blue-600">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                          }).format(chatRecord?.estimated_at_completion || 0)}
                        </div>
                      </div>

                      {/* Compact Variance Card */}
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-md border">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Variance</div>
                        <div
                          className={`text-sm font-bold ${
                            (chatRecord?.variance || 0) >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                          }).format(chatRecord?.variance || 0)}
                        </div>
                      </div>

                      {/* Compact Acknowledgment Status */}
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-md border">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Acknowledgment Status</div>
                        {(() => {
                          const ack = acknowledgments.find((a) => a.recordId === chatRecord?.id && a.acknowledged)
                          if (ack) {
                            return (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200 text-xs"
                                  >
                                    Acknowledged
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {ack?.timestamp ? new Date(ack.timestamp).toLocaleString() : ""}
                                </div>
                              </div>
                            )
                          } else if (acknowledgmentRequired) {
                            return (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 text-xs"
                                >
                                  Pending
                                </Badge>
                              </div>
                            )
                          } else {
                            return (
                              <div className="flex items-center gap-2">
                                <Info className="h-3 w-3 text-gray-600" />
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200 text-xs"
                                >
                                  Not Required
                                </Badge>
                              </div>
                            )
                          }
                        })()}
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Quick Actions - Fixed at Bottom */}
                  <div className="p-4 border-t bg-white dark:bg-gray-800">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      Quick Questions
                    </h5>
                    <div className="space-y-2">
                      {[
                        "What weather risks affect this forecast?",
                        "How confident are you in these numbers?",
                        "What if we accelerate by 30 days?",
                        "Show me cost optimization opportunities",
                      ].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setChatInput(suggestion)}
                          className="w-full text-left justify-start text-xs h-auto py-2 px-2"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Exit Acknowledgment Dialog */}
      <Dialog open={showExitAcknowledgment} onOpenChange={() => setShowExitAcknowledgment(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              Acknowledgment Required
              <Badge
                variant="secondary"
                className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              >
                Required
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-base">
              Before closing, you must acknowledge your understanding of this HBI forecast
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Forecast Summary */}
            {chatRecord && (
              <div className="p-4 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 rounded-lg border border-violet-200 dark:border-violet-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-violet-600" />
                  <span className="font-medium text-violet-800 dark:text-violet-200">
                    {chatRecord?.forecast_type === "gcgr"
                      ? `${chatRecord?.cost_code} - ${chatRecord?.cost_code_description}`
                      : `${chatRecord?.csi_code} - ${chatRecord?.csi_description}`}
                  </span>
                </div>
                <p className="text-sm text-violet-700 dark:text-violet-300">
                  {chatRecord ? getHBIForecastExplanation(chatRecord).reasoning : ""}
                </p>
              </div>
            )}

            {/* Acknowledgment Requirements */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                By proceeding, you acknowledge that you have:
              </h4>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Read and understood the forecast reasoning
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Reviewed the AI's methodology and analysis approach
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Reviewed the key influencing factors
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Understand the data points and variables considered
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Agree to apply this AI forecast</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Accept responsibility for implementing this forecast
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button onClick={acknowledgeAndClose} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="h-4 w-4 mr-2" />I Acknowledge & Accept
              </Button>

              <Button
                onClick={rejectAndClose}
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reject & Revert to {previousMethodMap[chatRecord?.id || ""] || "Manual"}
              </Button>
            </div>

            {/* Legal Notice */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Audit Trail:</strong> Your acknowledgment will be recorded with timestamp and user
                  identification for project documentation and compliance purposes. This record cannot be modified after
                  submission.
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* HBI AI Forecast Dialog - Enhanced */}
      <Dialog open={showHBIDialog} onOpenChange={setShowHBIDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900">
                <Zap className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              HBI AI Forecast Analysis
              <Badge
                variant="secondary"
                className="ml-2 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
              >
                Advanced AI
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-base">
              Comprehensive AI-powered forecast reasoning and strategic recommendations
            </DialogDescription>
          </DialogHeader>

          {hbiExplanation && (
            <div className="space-y-6">
              {/* AI Reasoning Section */}
              <div className="p-6 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 rounded-xl border-2 border-violet-200 dark:border-violet-800">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5 text-violet-600" />
                  <h4 className="font-semibold text-violet-800 dark:text-violet-200">AI Reasoning & Strategy</h4>
                </div>
                <p className="text-violet-700 dark:text-violet-300 leading-relaxed">{hbiExplanation.reasoning}</p>
              </div>

              {/* Key Factors Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Data Points Analyzed
                  </h4>
                  <div className="space-y-2">
                    {hbiExplanation.factors.map((factor: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    Risk Assessment
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="font-medium text-green-800 dark:text-green-200">Low Risk</span>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300">Forecast confidence: 87%</p>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">Weather Dependency</span>
                      </div>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">External factor impact: 15%</p>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-blue-800 dark:text-blue-200">Market Stability</span>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Material cost variance: ±2.3%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Performance */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Model Performance & Confidence
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">94.2%</div>
                    <p className="text-xs text-muted-foreground">Historical Accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$2.3M</div>
                    <p className="text-xs text-muted-foreground">Avg. Forecast Precision</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <p className="text-xs text-muted-foreground">Similar Projects Analyzed</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Information */}
              <Alert className="border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950">
                <Zap className="h-4 w-4 text-violet-600" />
                <AlertDescription className="text-violet-800 dark:text-violet-200">
                  <strong>HBI Advantage:</strong> This AI model continuously learns from project patterns, market
                  conditions, weather data, and 50+ other variables to provide the most accurate forecast possible. The
                  system has analyzed over 10,000 similar construction projects to generate these predictions.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New HBI Review Modal */}
      <Dialog open={showHBIReviewModal} onOpenChange={setShowHBIReviewModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900">
                <Brain className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              HBI Forecast Review & Analysis
              <Badge
                variant="secondary"
                className="ml-2 bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
              >
                AI Powered
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-base">
              Comprehensive HBI Analysis of forecast accuracy using historical data, project schedules, and industry
              insights
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-[75vh]">
            {!hbiAnalysisMode ? (
              /* Analysis Mode Selection */
              <div className="flex-1 p-6">
                <h3 className="text-lg font-semibold mb-4">Select Analysis Type</h3>
                <div className="space-y-4">
                  {getAvailableAnalysisModes().map((mode, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-violet-300"
                      onClick={() => selectAnalysisMode(mode)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-lg">{mode.label}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {mode.type === "cost_code" &&
                                "Analyze individual cost code forecast accuracy and factors"}
                              {mode.type === "csi_code" &&
                                "Analyze individual CSI division forecast accuracy and factors"}
                              {mode.type === "full_forecast" &&
                                "Comprehensive analysis of all forecast records and cross-dependencies"}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : !isAnalyzing && !analysisComplete ? (
              /* Analysis Confirmation */
              <div className="flex-1 p-6">
                <div className="max-w-2xl mx-auto text-center">
                  <h3 className="text-xl font-semibold mb-4">Ready to Analyze</h3>
                  <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-lg mb-2">{hbiAnalysisMode?.label}</h4>
                    <p className="text-muted-foreground">
                      The AI will analyze{" "}
                      {hbiAnalysisMode?.type === "full_forecast" ? "all forecast records" : "the selected forecast"}{" "}
                      using:
                    </p>
                    <ul className="mt-3 text-sm space-y-1">
                      <li>• Historical financial data from 200+ similar projects</li>
                      <li>• Current project schedule and milestone data</li>
                      <li>• Market conditions and industry trends</li>
                      <li>• Weather patterns and seasonal factors</li>
                      <li>• Resource availability and supply chain data</li>
                    </ul>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={resetHBIReview}>
                      Back to Selection
                    </Button>
                    <Button onClick={startAnalysis} className="bg-violet-600 hover:bg-violet-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Start Analysis
                    </Button>
                  </div>
                </div>
              </div>
            ) : isAnalyzing ? (
              /* Analysis in Progress */
              <div className="flex-1 p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Analysis in Progress</h3>
                    <p className="text-muted-foreground">HBI AI is processing your forecast data...</p>
                  </div>

                  <div className="space-y-3">
                    {analysisPhases.map((phase, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="flex-shrink-0">
                          {phase.status === "complete" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : phase.status === "analyzing" ? (
                            <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              phase.status === "complete"
                                ? "text-green-700"
                                : phase.status === "analyzing"
                                ? "text-violet-700"
                                : "text-gray-500"
                            }`}
                          >
                            {phase.phase}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Analysis Results */
              <div className="flex-1 overflow-hidden">
                <div className="h-full flex">
                  {/* Analysis Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose prose-sm max-w-none">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          <h3 className="text-xl font-semibold text-green-700">Analysis Complete</h3>
                        </div>
                        <div
                          className="whitespace-pre-wrap text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: analysisContent
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                              .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
                              .replace(/^• (.*$)/gm, '<li class="ml-4">$1</li>'),
                          }}
                        />
                      </div>

                      {showChatExchange && (
                        <div className="border-t pt-6">
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-violet-600" />
                            Interactive AI Conversation Demo
                          </h4>

                          {/* Chat Messages Container with Auto-Scroll */}
                          <div ref={chatContainerRef} className="bg-white dark:bg-gray-800 border rounded-lg">
                            <div className="h-96 overflow-y-auto p-4 space-y-4" id="mock-chat-container">
                              {chatExchange.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${
                                    message.type === "user" ? "justify-end" : "justify-start"
                                  } animate-in slide-in-from-bottom-2 duration-300`}
                                >
                                  <div
                                    className={`max-w-[85%] rounded-lg p-4 ${
                                      message.type === "user"
                                        ? "bg-blue-500 text-white ml-12"
                                        : "bg-violet-50 dark:bg-violet-950 text-violet-900 dark:text-violet-100 border border-violet-200 dark:border-violet-800 mr-12"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      {message.type === "assistant" && (
                                        <Bot className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
                                      )}
                                      <div className="flex-1">
                                        <p className="text-xs font-medium mb-2 opacity-75">
                                          {message.type === "user" ? "Project Manager" : "HBI AI Assistant"}
                                        </p>
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                        <p className="text-xs opacity-60 mt-2">
                                          {message.timestamp.toLocaleTimeString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* AI Processing Indicator */}
                              {isAIProcessing && (
                                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                                  <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-lg p-4 mr-12">
                                    <div className="flex items-center gap-3">
                                      <Bot className="h-5 w-5 text-violet-600" />
                                      <div>
                                        <p className="text-xs font-medium mb-2 opacity-75 text-violet-900 dark:text-violet-100">
                                          HBI AI Assistant
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                                          <span className="text-sm text-violet-700 dark:text-violet-300">
                                            Processing and analyzing your question...
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Chat Input Area */}
                            <div className="border-t p-4 bg-gray-50 dark:bg-gray-900">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={mockChatInput}
                                      readOnly
                                      placeholder={isMockTyping ? "" : "AI will type the next question here..."}
                                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                    {isMockTyping && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="flex space-x-1">
                                          <div
                                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                          ></div>
                                          <div
                                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "150ms" }}
                                          ></div>
                                          <div
                                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                          ></div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  disabled={!mockChatInput.trim() || isMockTyping || isAIProcessing}
                                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-muted-foreground">
                                  {isMockTyping
                                    ? "AI is typing a question..."
                                    : isAIProcessing
                                    ? "AI is processing the response..."
                                    : "Demo conversation in progress"}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Activity className="h-3 w-3" />
                                  <span>Live Demo</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Panel */}
                  <div className="w-80 border-l bg-gray-50 dark:bg-gray-900 p-6">
                    <h4 className="font-semibold mb-4">Analysis Actions</h4>
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          console.log("Export analysis report")
                        }}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                      <Button
                        onClick={() => {
                          console.log("Schedule follow-up")
                        }}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                      <Button onClick={resetHBIReview} variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        New Analysis
                      </Button>
                      <Button
                        onClick={() => setShowHBIReviewModal(false)}
                        className="w-full bg-violet-600 hover:bg-violet-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Review
                      </Button>
                    </div>

                    {hbiAnalysisMode && (
                      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <h5 className="font-medium mb-2">Analysis Summary</h5>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Type:</span> {hbiAnalysisMode?.label}
                          </p>
                          <p>
                            <span className="font-medium">Confidence:</span> 94.2%
                          </p>
                          <p>
                            <span className="font-medium">Completed:</span> {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
