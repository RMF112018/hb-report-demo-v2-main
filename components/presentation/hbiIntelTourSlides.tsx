/**
 * @fileoverview HBI Intel Tour Slide Definitions
 * @module HbiIntelTourSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Comprehensive slide definitions for the HBI Intel Tour:
 * - 15 feature-focused slides with business impact messaging
 * - Role-based content with continuity emphasis
 * - Real-world results and efficiency gains
 * - Professional styling with HB branding
 */

import React from "react"
import {
  Brain,
  Users,
  Calendar,
  ClipboardList,
  DollarSign,
  Target,
  FileText,
  TrendingUp,
  MessageSquare,
  Building,
  BarChart3,
  Shield,
  CheckCircle,
  Mail,
  Sparkles,
  Globe,
  UserCheck,
  Clock,
  AlertTriangle,
  PieChart,
  Zap,
  Database,
  Search,
  Settings,
  Award,
} from "lucide-react"

export interface IntelTourSlide {
  id: string
  title: string
  content: React.ReactNode
  icon: React.ReactNode
  background?: string
  backgroundGradient?: string
  isFinalSlide?: boolean
}

export const HBI_INTEL_TOUR_SLIDES: IntelTourSlide[] = [
  {
    id: "welcome",
    title: "Welcome to the HBI Intel Tour",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Explore how we're achieving operational continuity from pursuit through warranty.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Introduction to the tour. Reinforce that HBI Intel bridges gaps between teams, tools, and data silos.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🚀 Discover unified workflows that eliminate silos and accelerate decision-making
          </p>
        </div>
      </div>
    ),
    icon: <Brain className="h-16 w-16 text-blue-300" />,
    backgroundGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
  },
  {
    id: "role-dashboards",
    title: "Role-Based Dashboards",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Every role, fully empowered.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Tailored dashboards for Executives, PXs, PMs, Estimators, and Admins deliver relevant data instantly.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            📊 <strong>Result:</strong> 30% less time searching, 40% faster decisions
          </p>
        </div>
      </div>
    ),
    icon: <Users className="h-16 w-16 text-emerald-300" />,
    backgroundGradient: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
  },
  {
    id: "executive-staffing",
    title: "Executive Staff Management",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Build smarter staffing strategies with foresight.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          View upcoming assignment gaps, filter by position, and forecast needs by project and phase.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            💼 <strong>Value:</strong> Align talent supply with portfolio demands
          </p>
          <p className="text-sm lg:text-base opacity-80 mt-2">
            <strong>Continuity Benefit:</strong> Keeps growth plans on track by anticipating staffing risks months in
            advance
          </p>
        </div>
      </div>
    ),
    icon: <UserCheck className="h-16 w-16 text-purple-300" />,
    backgroundGradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
  },
  {
    id: "scheduler-planning",
    title: "Scheduler & Planning Suite",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Your entire construction schedule in one intelligent view.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Gantt charts, Look Ahead systems, and critical path monitoring—all linked to real-time field data.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            ⚡ <strong>Efficiency Gain:</strong> 20% reduction in delays and reschedules
          </p>
        </div>
      </div>
    ),
    icon: <Calendar className="h-16 w-16 text-orange-300" />,
    backgroundGradient: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)",
  },
  {
    id: "field-reporting",
    title: "Field Reporting & Constraints",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Daily intelligence, not just daily logs.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Standardized daily reports, constraint logs, manpower tracking, weather, and more.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            ⏰ <strong>Time Saved:</strong> 50% cut in documentation effort
          </p>
          <p className="text-sm lg:text-base opacity-80 mt-2">
            <strong>Continuity Win:</strong> Consistent reporting from day one to closeout
          </p>
        </div>
      </div>
    ),
    icon: <ClipboardList className="h-16 w-16 text-cyan-300" />,
    backgroundGradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)",
  },
  {
    id: "financial-intelligence",
    title: "Financial Intelligence Hub",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>From raw numbers to risk-aware forecasting.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Draw management, forecast deltas, variance tracking, and budget health analysis.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🎯 <strong>Impact:</strong> Detect cost issues 2–4 weeks earlier
          </p>
        </div>
      </div>
    ),
    icon: <DollarSign className="h-16 w-16 text-green-300" />,
    backgroundGradient: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #4ade80 100%)",
  },
  {
    id: "bid-management",
    title: "Bid Management Center",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Win more work—without reinventing the wheel.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Unified bid tracking, bidder templates, CSI breakdowns, and BuildingConnected API sync.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🚀 <strong>Efficiency:</strong> 40% faster coordination, better collaboration across estimating teams
          </p>
        </div>
      </div>
    ),
    icon: <Target className="h-16 w-16 text-rose-300" />,
    backgroundGradient: "linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%)",
  },
  {
    id: "standardized-reports",
    title: "Standardized Report Generation",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Monthly reporting, elevated and automated.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Auto-generate Financial Review Reports, PX Progress Summaries, Monthly Owner Reports, and Fully Custom
          Reports. Data pulled directly from project logs and dashboards.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            📄 <strong>Time Saved:</strong> Cuts 6–12 hours per report cycle
          </p>
        </div>
      </div>
    ),
    icon: <FileText className="h-16 w-16 text-indigo-300" />,
    backgroundGradient: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)",
  },
  {
    id: "market-intelligence",
    title: "Market Intelligence & BD Tools",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>See the big picture before your competitors do.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">Overlay pipeline data, market analytics, and CRM intelligence.</p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🎯 <strong>Strategic Edge:</strong> Smarter pursuit decisions, faster go/no-go calls
          </p>
        </div>
      </div>
    ),
    icon: <TrendingUp className="h-16 w-16 text-yellow-300" />,
    backgroundGradient: "linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #facc15 100%)",
  },
  {
    id: "ai-copilot",
    title: "AI Copilot: Ask, Validate, Explain",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Every user becomes a data analyst.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Query data with natural language, check work, generate insights, and receive coaching from the embedded HBI
          model.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🤖 <strong>Differentiator:</strong> Real-time validation + guided decision support
          </p>
        </div>
      </div>
    ),
    icon: <MessageSquare className="h-16 w-16 text-violet-300" />,
    backgroundGradient: "linear-gradient(135deg, #7c2d12 0%, #a855f7 50%, #c084fc 100%)",
  },
  {
    id: "project-control",
    title: "Project Control Center",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>A true single source of truth.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          All project-specific data in one intelligent command hub—linked to schedule, safety, QC, finance, and
          documents.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🔗 <strong>Continuity:</strong> Connects project phases and departments
          </p>
        </div>
      </div>
    ),
    icon: <Building className="h-16 w-16 text-slate-300" />,
    backgroundGradient: "linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%)",
  },
  {
    id: "power-bi-analytics",
    title: "Power BI & Advanced Analytics",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Metrics, modeled.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Live dashboards, KPI tracking, and embedded analytics tools across roles and modules.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            📊 <strong>Result:</strong> 60–80% faster access to enterprise-level insights
          </p>
        </div>
      </div>
    ),
    icon: <BarChart3 className="h-16 w-16 text-amber-300" />,
    backgroundGradient: "linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%)",
  },
  {
    id: "it-command-center",
    title: "IT Command Center",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Modern infrastructure, real-time support.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Full network operations dashboard, asset tracking, help desk ticketing, and cybersecurity monitoring.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🛡️ <strong>Gain:</strong> Preventative IT visibility and operational confidence as we scale
          </p>
        </div>
      </div>
    ),
    icon: <Shield className="h-16 w-16 text-red-300" />,
    backgroundGradient: "linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #f87171 100%)",
  },
  {
    id: "ai-quality-safety",
    title: "AI-Enhanced Quality & Safety",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Lessons learned, built-in.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Auto-generated QC checklists from submittals, toolbox talks tailored to your schedule, risk alerts and
          regulatory updates.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            ✅ <strong>Impact:</strong> Reduced QC failures and improved inspection pass rates
          </p>
        </div>
      </div>
    ),
    icon: <CheckCircle className="h-16 w-16 text-lime-300" />,
    backgroundGradient: "linear-gradient(135deg, #365314 0%, #65a30d 50%, #a3e635 100%)",
  },
  {
    id: "outlook-integration",
    title: "Outlook, Teams, & SharePoint Integration",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>Workflows where you already work.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Sync communication, files, meetings, and email threads directly with project tools.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🔄 <strong>Gain:</strong> 30–50% reduction in context switching
          </p>
        </div>
      </div>
    ),
    icon: <Mail className="h-16 w-16 text-blue-300" />,
    backgroundGradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)",
  },
  {
    id: "ready-to-explore",
    title: "Ready to See It in Action?",
    content: (
      <div className="space-y-6">
        <p className="text-xl lg:text-2xl">
          <strong>This is continuity. This is HBI Intel.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Experience the future of construction intelligence where every process, every role, and every decision is
          connected and optimized.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">🚀 Ready to transform your construction operations?</p>
        </div>
      </div>
    ),
    icon: <Sparkles className="h-16 w-16 text-gradient" />,
    backgroundGradient: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 25%, #ea580c 50%, #059669 75%, #0891b2 100%)",
    isFinalSlide: true,
  },
]

/**
 * Get slides for the HBI Intel Tour
 * @returns Array of IntelTourSlide objects
 */
export const getHbiIntelTourSlides = (): IntelTourSlide[] => {
  return HBI_INTEL_TOUR_SLIDES
}

/**
 * Get a specific slide by ID
 * @param slideId - The ID of the slide to retrieve
 * @returns IntelTourSlide object or undefined if not found
 */
export const getSlideById = (slideId: string): IntelTourSlide | undefined => {
  return HBI_INTEL_TOUR_SLIDES.find((slide) => slide.id === slideId)
}

/**
 * Get total number of slides
 * @returns Number of slides in the tour
 */
export const getTotalSlides = (): number => {
  return HBI_INTEL_TOUR_SLIDES.length
}

/**
 * Check if a slide is the final slide
 * @param slideId - The ID of the slide to check
 * @returns Boolean indicating if it's the final slide
 */
export const isFinalSlide = (slideId: string): boolean => {
  const slide = getSlideById(slideId)
  return slide?.isFinalSlide === true
}
