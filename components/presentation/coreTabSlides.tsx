/**
 * @fileoverview Core Tab Presentation Slide Definitions
 * @module CoreTabSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Core Tab presentation covering:
 * - General Core Project Tools summary
 * - Dashboard with live KPIs
 * - Checklists for project phases
 * - Productivity and Teams integration
 * - Staffing and resource management
 * - Responsibility Matrix
 * - Reports and analytics
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  Users,
  Users2,
  Grid3X3,
  FileText,
  Brain,
  Target,
  TrendingUp,
  Activity,
  RefreshCw,
  MessageSquare,
  Zap,
  Eye,
  AlertTriangle,
  Shield,
  Clock,
  Calendar,
  Settings,
  Sparkles,
  Building2,
  Construction,
  Gauge,
  Monitor,
  Database,
  Network,
  Smartphone,
  Clipboard,
  BookOpen,
  Search,
  Award,
  CheckCircle,
  Plus,
  ArrowRight,
  Layers,
  Wrench,
  HardHat,
  Megaphone,
  Bell,
  Send,
  MessageSquare as MessageSquareIcon,
  HeartHandshake,
  Lightbulb,
  Headphones,
  ClipboardCheck,
  LifeBuoy,
  Stethoscope,
  Truck,
  Flame,
} from "lucide-react"

export const coreTabSlides: PresentationSlide[] = [
  {
    id: "core-overview",
    title: "The Core Tab: Foundation of Project Continuity",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <LayoutDashboard className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Core Tab is our command center for project execution—unifying dashboards, checklists, collaboration
            tools, staffing logic, and accountability frameworks in a single pane of glass.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            No more switching between SharePoint, Excel trackers, or siloed apps. With HB Intel, all our essential
            functions are accessible, centralized, and tailored to each role across the project lifecycle.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Live Dashboard</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Real-time KPIs track health across budget, schedule, and performance.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">✅</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Smart Checklists</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Track milestone completion and compliance with intelligent automation.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">💬</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Team Collaboration</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Microsoft 365 integration drives team productivity and clarity.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">👥</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Staffing Plans</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Centralized workforce planning aligned with active and upcoming work.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🎯</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Responsibility Matrix</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Accountability, ownership, and coverage defined and validated.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📈</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Comprehensive Reports</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Actionable insights with automated reporting across every phase.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "dashboard-kpis",
    title: "Live Dashboards That Keep You Ahead",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <BarChart3 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Static reports and weekly updates are replaced by live, interactive dashboards that show the current state
            of our projects across all key metrics.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            HBI enhances visibility by surfacing predictive insights and role-specific alerts—giving us a clear view of
            what matters, before it becomes an issue.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">At-a-Glance Insights</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Track progress on budget, schedule, quality, and risk in real time.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🤖</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">HBI Intelligence</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                AI-driven alerts for performance gaps and early interventions.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🎯</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Critical Path Analysis</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Forecast delays and optimize sequencing before impact.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "project-checklists",
    title: "Smart Checklists Across the Entire Project Lifecycle",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <CheckSquare className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our StartUp, PreCO, and Closeout checklists are unified in one smart interface—enabling automated progress
            tracking, live status updates, and role-based task views.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            HB Intel brings structure to every phase, ensuring accountability and momentum from our first mobilization
            meeting to final turnover.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🚀</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">StartUp Checklist</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Ensure your project starts strong—with permits, plans, and safety.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🏗️</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">PreCO Checklist</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Proactively prep for inspections, operations, and CO readiness.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">✅</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Closeout Checklist</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Close confidently with docs, punch lists, and warranty initiation.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "team-productivity",
    title: "Streamlined Communication Meets Intelligent Tasking",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Users className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Core Tab brings Microsoft Teams, Planner, and project data together—enabling smarter task assignments,
            conversations in context, and visibility into what's happening now.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            No more bouncing between tabs—HBI keeps our team aligned, accountable, and informed within a single
            workspace.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">💬</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Teams Integration</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Native messaging and channels connected to real project workflows.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📋</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Task Management</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Assign, track, and resolve tasks with Microsoft Planner context.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Activity Feed</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Real-time view of what's happening—what's late, what's next.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "staffing-management",
    title: "Workforce Clarity, From Planning to Execution",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Users2 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The staffing element enables users to analyze the staffing plan's impact on job costs, track and forecast
            staffing assignments related to the specific project based on real schedule activities as they are updated
            throughout the lifecycle of the project.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            When the need for addition or reduction in staffing levels is identified, users can submit Staffing Plan
            Change Request (SPCR) for supervisor review, ensuring proper oversight and approval processes.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">💰</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Cost Impact Analysis</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Analyze staffing plan's impact on job costs and budget.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📅</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Schedule Integration</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Track and forecast staffing based on real schedule activities.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📝</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">SPCR Workflow</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Submit Staffing Plan Change Requests for supervisor review.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "responsibility-matrix",
    title: "Define Responsibility. Prevent Gaps.",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Grid3X3 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Responsibility Matrix delegates primary and supporting responsibility to project team members based on
            predefined typical responsibilities applicable to all projects, plus project-specific responsibilities
            identified through contract and regulatory document review.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Replacing static Excel spreadsheets with dynamic accountability, the platform automatically generates tasks
            via Microsoft Graph API integrations with Teams and Planner when data flags require user attention based on
            responsibility matrix assignments.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🎯</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Accountability Framework</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Delegate primary and supporting responsibilities with clear ownership.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📋</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Document-Driven Setup</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Build matrix from contract and regulatory document analysis.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🤖</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Automated Task Generation</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Microsoft Graph API creates Teams/Planner tasks from data flags.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "comprehensive-reports",
    title: "Insights that Write Themselves",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <FileText className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Reporting is no longer a burden. HB Intel aggregates real-time data across all our Core modules—generating
            meaningful, role-based insights without the need for manual compilation.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Dashboards and reports are customizable, automated, and always available—supporting proactive leadership
            through every project phase.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Automated Analytics</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Real-time metrics, synced across all platform tools.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📈</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Performance Insights</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Track progress trends and generate predictive overviews.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📋</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Custom Dashboards</div>
              <div className="text-xs sm:text-sm text-white opacity-90 text-center">
                Tailored reporting with scheduled delivery to decision-makers.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default coreTabSlides
