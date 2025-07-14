/**
 * @fileoverview Quality Control & Warranty Presentation Slide Definitions
 * @module QualitySlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Quality Control & Warranty presentation.
 * Based on quality components including QCProgramGenerator, AIWarrantyAnalysisPanel,
 * SiteMate integration, and HBI AI-powered content generation.
 *
 * Updated to follow intelTourSlides.tsx structure with simple space-y-6 layouts.
 */

import React from "react"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Brain,
  CheckCircle,
  Activity,
  FileText,
  Shield,
  Sparkles,
  Database,
  Eye,
  Settings,
  Users,
  Zap,
  Target,
} from "lucide-react"

export const qualitySlides: PresentationSlide[] = [
  {
    id: "ai-powered-qc-generation",
    title: "AI-Powered QC Program Generation",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-16 w-16 text-purple-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            HBI AI generates comprehensive, project-specific Quality Control programs by analyzing specifications,
            approved submittals, manufacturer guidelines, and building codes with 91% confidence.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Automated QC program generation reduces manual effort while ensuring compliance with industry standards and
          project-specific requirements.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🔍 AI Data Integration</h4>
            <p className="text-sm opacity-80">Analyzes specifications, submittals, and building codes automatically</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">📋 Complete QC Manuals</h4>
            <p className="text-sm opacity-80">Generates standards, procedures, checkpoints, and testing protocols</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🎯 Milestone Integration</h4>
            <p className="text-sm opacity-80">Links QC activities to project phases and critical milestones</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "welcome-to-quality-warranty",
    title: "Welcome to Quality & Warranty Oversight",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <CheckCircle className="h-16 w-16 text-green-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            Your central hub for QC operations, with SiteMate overlay turning fragmented data into actionable
            intelligence.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Unified quality management dashboard provides real-time visibility across all projects while maintaining
          existing field workflows.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🏢 Central Hub</h4>
            <p className="text-sm opacity-80">
              Unified QC operations dashboard with real-time oversight across all projects
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🔄 SiteMate Overlay</h4>
            <p className="text-sm opacity-80">
              Aggregates field data seamlessly while maintaining SiteMate as primary field app
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🧠 Actionable Intelligence</h4>
            <p className="text-sm opacity-80">
              Transforms fragmented data into structured insights for decision-making
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "overlaying-sitemate",
    title: "Overlaying SiteMate for Total Field Visibility",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Activity className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            SiteMate remains your primary field app, while our tool synchronizes inputs and replaces email chains with
            live aggregation.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Seamless integration preserves field team workflows while providing office teams with centralized quality
          intelligence and automated reporting.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">📱 Field App Continuity</h4>
            <p className="text-sm opacity-80">
              SiteMate stays as primary field tool - no workflow disruption for field teams
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">⚡ Live Synchronization</h4>
            <p className="text-sm opacity-80">
              Real-time data aggregation from SiteMate inputs into centralized intelligence
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">📧 Email Replacement</h4>
            <p className="text-sm opacity-80">
              Eliminates email chains with live aggregation and automated distribution
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "smart-documents-generation",
    title: "Generate Smart Documents & Distributions with HBI",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <FileText className="h-16 w-16 text-indigo-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            HBI analyzes field data to auto-generate reports, allows staff to flag issues, and handles automated
            formatting for compliance.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Transform raw field data into structured compliance reports with automated formatting and intelligent
          distribution to stakeholders.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🤖 AI Analysis</h4>
            <p className="text-sm opacity-80">
              HBI processes field data automatically to generate structured reports and insights
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🚩 Staff Flagging</h4>
            <p className="text-sm opacity-80">
              Field staff can flag issues directly in system for immediate attention and tracking
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">✅ Compliance Formatting</h4>
            <p className="text-sm opacity-80">
              Automated compliance formatting ensures reports meet regulatory standards
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "warranty-integration",
    title: "Warranty Integration Built In",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Shield className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            Post-closeout warranty tracking with responsibilities clearly assigned to subs/vendors and complete
            transparency throughout.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Seamless warranty management continues beyond project completion with automated tracking, notifications, and
          clear responsibility assignments.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🔄 Post-Closeout Tracking</h4>
            <p className="text-sm opacity-80">
              Seamless warranty period management continues beyond project completion
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🎯 Clear Responsibilities</h4>
            <p className="text-sm opacity-80">
              Responsibilities assigned to subs/vendors with automated tracking and notifications
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">👁️ Complete Transparency</h4>
            <p className="text-sm opacity-80">
              Full visibility into warranty status for all stakeholders throughout process
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "start-managing-what-matters",
    title: "Start Managing What Matters",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-16 w-16 text-gradient" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            Integrated into HB Intel's unified platform—comprehensive quality and warranty management built for
            construction excellence.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Transform your quality management with AI-powered intelligence, seamless integrations, and proactive warranty
          tracking within secure, enterprise-grade protocols.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🔗 Integrated Ecosystem</h4>
            <p className="text-sm opacity-80">Unified quality management across all HB Intel components</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🚀 AI-Powered Intelligence</h4>
            <p className="text-sm opacity-80">HBI analysis drives predictive quality management and prevention</p>
          </div>
        </div>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm text-center">
          <p className="text-base lg:text-lg font-medium">
            🎯 <strong>Data-driven. AI-powered. Built for quality excellence.</strong>
          </p>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default qualitySlides
