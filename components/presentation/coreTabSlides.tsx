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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Core Tab is the command center for project execution—unifying dashboards, checklists, collaboration
            tools, staffing logic, and accountability frameworks in a single pane of glass.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            No more switching between SharePoint, Excel trackers, or siloed apps. With HB Intel, all essential functions
            are accessible, centralized, and tailored to each role across the project lifecycle.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Live Dashboard</div>
              <div className="text-xs text-blue-200">
                Real-time KPIs track health across budget, schedule, and performance.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Smart Checklists</div>
              <div className="text-xs text-blue-200">
                Track milestone completion and compliance with intelligent automation.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💬</div>
              <div className="font-medium text-white">Team Collaboration</div>
              <div className="text-xs text-blue-200">
                Microsoft 365 integration drives team productivity and clarity.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👥</div>
              <div className="font-medium text-white">Staffing Plans</div>
              <div className="text-xs text-blue-200">
                Centralized workforce planning aligned with active and upcoming work.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Responsibility Matrix</div>
              <div className="text-xs text-blue-200">
                Accountability, ownership, and coverage defined and validated.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Comprehensive Reports</div>
              <div className="text-xs text-blue-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-green-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Static reports and weekly updates are replaced by live, interactive dashboards that show the current state
            of your projects across all key metrics.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            HBI enhances visibility by surfacing predictive insights and role-specific alerts—giving you a clear view of
            what matters, before it becomes an issue.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">At-a-Glance Insights</div>
              <div className="text-xs text-green-200">
                Track progress on budget, schedule, quality, and risk in real time.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">HBI Intelligence</div>
              <div className="text-xs text-green-200">
                AI-driven alerts for performance gaps and early interventions.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Critical Path Analysis</div>
              <div className="text-xs text-green-200">Forecast delays and optimize sequencing before impact.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-purple-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            StartUp, PreCO, and Closeout checklists are unified in one smart interface—enabling automated progress
            tracking, live status updates, and role-based task views.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            HB Intel brings structure to every phase, ensuring accountability and momentum from the first mobilization
            meeting to final turnover.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🚀</div>
              <div className="font-medium text-white">StartUp Checklist</div>
              <div className="text-xs text-purple-200">
                Ensure your project starts strong—with permits, plans, and safety.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🏗️</div>
              <div className="font-medium text-white">PreCO Checklist</div>
              <div className="text-xs text-purple-200">
                Proactively prep for inspections, operations, and CO readiness.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Closeout Checklist</div>
              <div className="text-xs text-purple-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Core Tab brings Microsoft Teams, Planner, and project data together—enabling smarter task assignments,
            conversations in context, and visibility into what's happening now.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            No more bouncing between tabs—HBI keeps your team aligned, accountable, and informed within a single
            workspace.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💬</div>
              <div className="font-medium text-white">Teams Integration</div>
              <div className="text-xs text-blue-200">
                Native messaging and channels connected to real project workflows.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Task Management</div>
              <div className="text-xs text-blue-200">
                Assign, track, and resolve tasks with Microsoft Planner context.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Activity Feed</div>
              <div className="text-xs text-blue-200">Real-time view of what's happening—what's late, what's next.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-orange-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Resource planning shifts from manual spreadsheets to dynamic workforce optimization. Visual tools help you
            allocate, adjust, and align staffing with project demands and continuity.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            HBI cross-references schedules, skills, and availability—reducing downtime and double-bookings before they
            happen.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Resource Allocation</div>
              <div className="text-xs text-orange-200">Gantt-based visual planning tailored to project needs.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Skill Matching</div>
              <div className="text-xs text-orange-200">
                Auto-suggested assignments based on availability and experience.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Availability Tracking</div>
              <div className="text-xs text-orange-200">Conflict alerts and capacity insights in real time.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-red-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Responsibility Matrix makes accountability clear, centralizing ownership data across cost codes,
            schedule tasks, and project phases.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-red-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With integrated validation logic, the platform flags unclear handoffs and duplicate assignments—eliminating
            ambiguity before it stalls progress.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👁️</div>
              <div className="font-medium text-white">Centralized Visibility</div>
              <div className="text-xs text-red-200">See ownership across trades, scopes, and teams in one view.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Assignment Validation</div>
              <div className="text-xs text-red-200">Spot gaps, overlaps, and conflicts in real time.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚠️</div>
              <div className="font-medium text-white">Conflict Detection</div>
              <div className="text-xs text-red-200">Proactive issue detection—before confusion leads to delay.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-indigo-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Reporting is no longer a burden. HB Intel aggregates real-time data across all Core modules—generating
            meaningful, role-based insights without the need for manual compilation.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-indigo-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Dashboards and reports are customizable, automated, and always available—supporting proactive leadership
            through every project phase.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Automated Analytics</div>
              <div className="text-xs text-indigo-200">Real-time metrics, synced across all platform tools.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Performance Insights</div>
              <div className="text-xs text-indigo-200">Track progress trends and generate predictive overviews.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Custom Dashboards</div>
              <div className="text-xs text-indigo-200">
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
