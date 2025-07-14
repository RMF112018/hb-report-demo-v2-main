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
    title: "Core Project Tools Overview",
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
            <strong>Core Project Tools</strong> provide a unified workspace where{" "}
            <strong>project managers get instant access to all critical project information</strong> — eliminating the
            need to juggle multiple SharePoint tabs, Excel trackers, and scattered documents.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of switching between separate systems for dashboards, checklists, team communications, staffing
            plans, responsibility tracking, and reports,{" "}
            <strong>everything is consolidated into one intelligent interface</strong> that adapts to your role and
            project needs.
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
              <div className="text-xs text-blue-200">Real-time KPIs and project health metrics</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Smart Checklists</div>
              <div className="text-xs text-blue-200">Automated progress tracking and compliance</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💬</div>
              <div className="font-medium text-white">Team Collaboration</div>
              <div className="text-xs text-blue-200">Microsoft Teams integration and task management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👥</div>
              <div className="font-medium text-white">Staffing Plans</div>
              <div className="text-xs text-blue-200">Resource allocation and workforce planning</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Responsibility Matrix</div>
              <div className="text-xs text-blue-200">Clear ownership and accountability tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Comprehensive Reports</div>
              <div className="text-xs text-blue-200">Automated reporting and analytics</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "dashboard-kpis",
    title: "Live Dashboard & KPIs",
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
            <strong>Live Dashboard</strong> replaces weekly email briefings and static reports with{" "}
            <strong>real-time project status and performance metrics</strong> that update automatically as work
            progresses across all project areas.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of waiting for status meetings or chasing down updates from multiple team members,{" "}
            <strong>HBI AI intelligence provides role-tailored insights</strong> that surface critical issues and
            opportunities before they become problems.
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
              <div className="text-xs text-green-200">Budget, schedule, and quality metrics in one view</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">HBI Intelligence</div>
              <div className="text-xs text-green-200">AI-powered alerts and predictive recommendations</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Critical Path Analysis</div>
              <div className="text-xs text-green-200">Automated risk detection and schedule optimization</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "project-checklists",
    title: "Project Checklists",
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
            <strong>Project Checklists</strong> eliminate the chaos of scattered task lists and manual tracking by{" "}
            <strong>providing automated progress monitoring across StartUp, PreCO, and Closeout phases</strong> with
            real-time completion status.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of juggling multiple Excel spreadsheets, printed checklists, and email reminders,{" "}
            <strong>all project milestones are centrally managed</strong> with automatic progress calculation and
            compliance validation.
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
              <div className="text-xs text-purple-200">Essential startup tasks and documentation tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🏗️</div>
              <div className="font-medium text-white">PreCO Checklist</div>
              <div className="text-xs text-purple-200">Pre-construction activities and preparations</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Closeout Checklist</div>
              <div className="text-xs text-purple-200">Project completion and closure activities</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "team-productivity",
    title: "Team Productivity & Collaboration",
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
            <strong>Team Productivity</strong> transforms scattered communications and task management by{" "}
            <strong>integrating Microsoft Teams directly into project workflows</strong> with unified messaging, task
            tracking, and activity feeds.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of switching between email, Teams, Planner, and multiple project platforms,{" "}
            <strong>everything is integrated into one collaborative workspace</strong> with enterprise-grade Microsoft
            365 connectivity.
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
              <div className="text-xs text-blue-200">Native Microsoft Teams messaging and channels</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Task Management</div>
              <div className="text-xs text-blue-200">Microsoft Planner integration with project context</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Activity Feed</div>
              <div className="text-xs text-blue-200">Real-time project updates and progress tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "staffing-management",
    title: "Staffing & Resource Management",
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
            <strong>Staffing & Resource Management</strong> eliminates complex workforce planning spreadsheets by{" "}
            <strong>providing visual staff allocation and resource optimization</strong> with real-time availability
            tracking and skill matching.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing multiple Excel files for crew assignments, availability tracking, and skill inventories,{" "}
            <strong>all workforce planning is centralized</strong> with automated conflict detection and optimization
            recommendations.
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
              <div className="text-xs text-orange-200">Visual workforce planning with Gantt charts</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Skill Matching</div>
              <div className="text-xs text-orange-200">Automated crew assignment based on expertise</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Availability Tracking</div>
              <div className="text-xs text-orange-200">Real-time crew availability and conflict detection</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "responsibility-matrix",
    title: "Responsibility Matrix",
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
            <strong>Responsibility Matrix</strong> eliminates "who owns this?" delays in meetings by{" "}
            <strong>providing centralized visibility into role assignments and accountability</strong> across all
            project phases and cost codes.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-red-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of scattered assignment documents and unclear ownership boundaries,{" "}
            <strong>all responsibilities are clearly defined and validated</strong> with real-time updates tied directly
            to staffing and scheduling tools.
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
              <div className="text-xs text-red-200">Clear view of who's assigned to what across all phases</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Assignment Validation</div>
              <div className="text-xs text-red-200">Cross-validates clarity and flags gaps automatically</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚠️</div>
              <div className="font-medium text-white">Conflict Detection</div>
              <div className="text-xs text-red-200">
                Identifies overlapping responsibilities before they impact work
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "comprehensive-reports",
    title: "Comprehensive Reports & Analytics",
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
            <strong>Comprehensive Reports</strong> eliminate manual report compilation and data hunting by{" "}
            <strong>providing automated analytics and insights</strong> with real-time data integration across all
            project modules.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-indigo-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of spending hours gathering data from multiple systems and creating reports manually,{" "}
            <strong>all project metrics are automatically aggregated</strong> with customizable dashboards and scheduled
            reporting.
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
              <div className="text-xs text-indigo-200">Real-time data integration across all project modules</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Performance Insights</div>
              <div className="text-xs text-indigo-200">Trend analysis and predictive reporting</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Custom Dashboards</div>
              <div className="text-xs text-indigo-200">Role-based reporting with scheduled delivery</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default coreTabSlides
