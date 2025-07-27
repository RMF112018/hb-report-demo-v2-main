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
    id: "digital-headquarters-intro",
    title: "Your Digital Headquarters for Quality & Warranty Excellence",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Users className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            HB Intel serves as the digital headquarters for our Quality Control and Warranty teams—connecting insights,
            actions, and accountability across the entire project lifecycle.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          From preconstruction standards to post-completion claims, this module delivers true operational
          continuity—unifying field inputs, document generation, and team workflows under one platform.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🏢 Digital Headquarters</h4>
            <p className="text-sm opacity-80">
              Centralized command center for all quality and warranty operations across projects
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🔄 Operational Continuity</h4>
            <p className="text-sm opacity-80">
              Seamless lifecycle management from preconstruction standards to post-completion claims
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🤝 Unified Workflows</h4>
            <p className="text-sm opacity-80">
              Connect field inputs, document generation, and team coordination under one platform
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ai-powered-qc-generation",
    title: "Intelligent, Continuous QC Program Generation",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-16 w-16 text-purple-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            We harness HBI to auto-generate project-specific Quality Control programs, continuously aligned with
            evolving specifications, submittals, and compliance requirements.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Reduces manual workload and ensures programs stay current with regulatory and project changes—supporting
          lifecycle continuity from preconstruction to closeout.
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
    title: "A Unified Hub for Continuous Quality & Warranty Oversight",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <CheckCircle className="h-16 w-16 text-green-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            The central command center for all QC operations, integrating SiteMate and transforming field data into
            structured, continuous insights.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          We maintain our familiar field workflows while achieving real-time oversight and program continuity across
          projects.
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
    title: "Preserving Field Workflow While Ensuring Continuous Oversight",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Activity className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            SiteMate remains the frontline tool—HB Intel enhances it by continuously aggregating data and eliminating
            fragmented communication.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Field continuity is preserved while our office and executive teams gain seamless visibility into quality
          performance and emerging risks.
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
    title: "Smart QC Documentation and Seamless Distribution",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <FileText className="h-16 w-16 text-indigo-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            We convert field data into structured, compliant documents with automated formatting, issue flagging, and
            stakeholder routing—all powered by HBI.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          We ensure continuity of documentation standards and reduce compliance gaps through proactive AI assistance.
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
    title: "Built-In Warranty Management with Continuous Accountability",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Shield className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            Warranty tracking doesn't end at closeout—HB Intel ensures ongoing visibility, responsibility assignments,
            and issue closure.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          We create a continuous feedback loop between construction, operations, and post-completion support.
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
    title: "End-to-End Continuity in Quality & Warranty",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-16 w-16 text-gradient" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            Fully integrated into HB Intel—our Quality & Warranty module ensures uninterrupted visibility,
            accountability, and improvement across the project lifecycle.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          We proactively manage quality with AI insight, seamless data flow, and governance-aligned tracking—because
          quality is not a phase, it's a continuum.
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
