/**
 * @fileoverview HBI Intel Tour Slide Definitions (Refactored)
 * @module IntelTourSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Intel Tour slide definitions using the standard PresentationSlide interface
 * for consistency with the main presentation carousel system.
 * All icons are incorporated into the content for visual consistency.
 */

import React from "react"
import { PresentationSlide } from "./PresentationCarousel"
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

export const intelTourSlides: PresentationSlide[] = [
  {
    id: "welcome",
    title: "Welcome to the HBI Intel Tour",
    content: (
      <div className="space-y-6">
        {/* Icon integrated into content */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-16 w-16 text-blue-300" />
          </div>
        </div>

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
  },
  {
    id: "role-dashboards",
    title: "Role-Based Dashboards",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Users className="h-16 w-16 text-emerald-300" />
          </div>
        </div>

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
  },
  {
    id: "executive-staffing",
    title: "Executive Staff Management",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <UserCheck className="h-16 w-16 text-purple-300" />
          </div>
        </div>

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
  },
  {
    id: "scheduler-planning",
    title: "Scheduler & Planning Suite",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Calendar className="h-16 w-16 text-orange-300" />
          </div>
        </div>

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
  },
  {
    id: "field-reporting",
    title: "Field Reporting & Constraints",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <ClipboardList className="h-16 w-16 text-cyan-300" />
          </div>
        </div>

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
  },
  {
    id: "financial-intelligence",
    title: "Financial Intelligence Hub",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <DollarSign className="h-16 w-16 text-green-300" />
          </div>
        </div>

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
  },
  {
    id: "bid-management",
    title: "Bid Management Center",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Target className="h-16 w-16 text-rose-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Win more work—without reinventing the wheel.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Unified bid tracking, bidder templates, CSI breakdowns, and BuildingConnected API sync.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🎯 <strong>Win Rate:</strong> 15% improvement in successful bids
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "standardized-reports",
    title: "Standardized Reports",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <FileText className="h-16 w-16 text-indigo-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Consistent reporting across all projects.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Automated report generation with standardized templates and consistent formatting.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            📄 <strong>Efficiency:</strong> 60% reduction in report preparation time
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "market-intelligence",
    title: "Market Intelligence",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <TrendingUp className="h-16 w-16 text-yellow-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Stay ahead with market insights.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Track market trends, competitor analysis, and pricing intelligence for strategic advantage.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            📈 <strong>Advantage:</strong> 25% better pricing accuracy
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "ai-copilot",
    title: "AI Copilot & Predictive Analytics",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-16 w-16 text-purple-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>AI-powered insights at your fingertips.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Predictive analytics, risk assessment, and intelligent recommendations for proactive decision-making.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🤖 <strong>Prediction:</strong> 80% accuracy in risk forecasting
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "project-control",
    title: "Project Control Center",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Building className="h-16 w-16 text-slate-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Unified command center for all projects.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Centralized project oversight with real-time status, resource allocation, and performance monitoring.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🎯 <strong>Control:</strong> 35% improvement in project delivery
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "power-bi-analytics",
    title: "Power BI Analytics Integration",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <BarChart3 className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Enterprise-grade business intelligence.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Integrated Power BI dashboards with advanced visualization and comprehensive data analysis.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            📊 <strong>Insight:</strong> 50% faster data-driven decisions
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "it-command-center",
    title: "IT Command Center",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Shield className="h-16 w-16 text-red-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Enterprise IT management and security.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Comprehensive IT operations dashboard with security monitoring, asset management, and system health.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🔒 <strong>Security:</strong> 99.9% uptime with zero security incidents
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "quality-safety",
    title: "AI-Enhanced Quality & Safety",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <CheckCircle className="h-16 w-16 text-lime-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Proactive quality and safety management.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          AI-powered quality control, safety monitoring, and compliance tracking for zero-incident operations.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            ✅ <strong>Impact:</strong> Reduced QC failures and improved inspection pass rates
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "outlook-integration",
    title: "Outlook, Teams, & SharePoint Integration",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Mail className="h-16 w-16 text-blue-300" />
          </div>
        </div>

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
  },
  {
    id: "ready-to-explore",
    title: "Ready to See It in Action?",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-16 w-16 text-gradient" />
          </div>
        </div>

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
    isFinalSlide: true,
  },
]

export default intelTourSlides
