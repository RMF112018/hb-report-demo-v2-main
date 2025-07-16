/**
 * @fileoverview Pre-Construction Tab Presentation Slide Definitions
 * @module PreconTabSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Pre-Construction tab presentation covering:
 * - Tab Summary of Pre-Construction features
 * - Estimating with BuildingConnected integration
 * - Pre-Construction planning with staffing, scheduling, and risk analysis
 * - IDS & BIM Coordination with clash detection and model viewing
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Calculator,
  Building2,
  Users2,
  Calendar,
  Target,
  TrendingUp,
  Database,
  Network,
  FileText,
  Zap,
  Eye,
  AlertTriangle,
  Shield,
  Clock,
  Settings,
  Sparkles,
  Construction,
  Gauge,
  Monitor,
  Search,
  Award,
  CheckCircle,
  ArrowRight,
  Layers,
  Wrench,
  HardHat,
  DollarSign,
  BarChart3,
  Brain,
  Activity,
  Clipboard,
  Box,
  Play,
  Image,
  Video,
  Workflow,
  GitBranch,
  Merge,
  Scan,
  MousePointer,
  Maximize,
  PieChart,
  LineChart,
  AreaChart,
  Briefcase,
  MapPin,
  Users,
  BookOpen,
  Lightbulb,
  Star,
  CheckSquare,
  Link,
  Globe,
  Smartphone,
  Tablet,
  Headphones,
  MessageSquare,
  Bell,
  Send,
  Plus,
  Minus,
  Edit,
  Save,
  Download,
  Upload,
  Share,
  Copy,
  Trash,
  Archive,
  Folder,
  FolderOpen,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  MoreVertical,
  Filter,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react"

export const preconTabSlides: PresentationSlide[] = [
  {
    id: "precon-overview",
    title: "Pre-Construction: From Bid to Build, Connected by Continuity",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Building2 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Pre-Construction Command Center unifies the earliest phases of project planning by integrating
            estimating, staffing, scheduling, and BIM coordination into one intelligent workspace. By centralizing every
            preconstruction tool, team, and timeline, HB Intel brings true lifecycle continuity from initial bid through
            final closeout.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of juggling separate Excel workbooks, BuildingConnected interfaces, and scattered planning
            documents, <strong>everything is centralized and connected</strong> from initial bid through final warranty
            closeout.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Unified Estimating</div>
              <div className="text-xs text-blue-200">
                Connected workflows from bid solicitation to workbook creation.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👥</div>
              <div className="font-medium text-white">Staffing Plans</div>
              <div className="text-xs text-blue-200">Plan and allocate precon teams with lifecycle alignment.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Schedule Analysis</div>
              <div className="text-xs text-blue-200">
                Build logic-tied preconstruction schedules with risk insights.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🏗️</div>
              <div className="font-medium text-white">BIM Coordination</div>
              <div className="text-xs text-blue-200">
                Integrated model management with clash detection and IDS support.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "unified-estimating",
    title: "Estimating Without Gaps, From BuildingConnected to Closeout",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Calculator className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-green-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Unified Estimating Platform bridges the gap between subcontractor bid management and estimating
            workbooks. By integrating BuildingConnected directly into HB Intel's estimating environment, continuity is
            preserved throughout the entire project lifecycle—from the first bid to final closeout.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing separate BuildingConnected and Excel systems that lose connection as projects progress,{" "}
            <strong>both subcontractor bid management and estimating workbooks are unified</strong> in one central
            location that follows the project lifecycle.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔗</div>
              <div className="font-medium text-white">BuildingConnected Integration</div>
              <div className="text-xs text-green-200">Real-time subcontractor bid management, fully embedded.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Estimating Workbooks</div>
              <div className="text-xs text-green-200">Excel-powered estimates with centralized project alignment.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Lifecycle Continuity</div>
              <div className="text-xs text-green-200">No handoffs lost—estimates evolve with the project.</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "precon-planning",
    title: "Strategic Preconstruction Planning with HBI Foresight",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Target className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-purple-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Pre-Construction Planning connects the dots between estimating, staffing, schedule logic, and early-stage
            risk identification. With support from HBI, your preconstruction team gains AI-driven intelligence to align
            resources and mitigate risks before construction begins.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of separate staffing spreadsheets, disconnected schedules, and manual risk assessments,{" "}
            <strong>HBI AI aggregates trusted industry sources</strong> to provide comprehensive project intelligence
            and constructibility analysis.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👥</div>
              <div className="font-medium text-white">Staffing Plans</div>
              <div className="text-xs text-purple-200">
                Precon staffing aligned with estimating and future execution.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Schedule Generation</div>
              <div className="text-xs text-purple-200">Smart bid-phase schedules with embedded phase logic.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">HBI Risk Analysis</div>
              <div className="text-xs text-purple-200">AI-powered insights guide better decisions, earlier.</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "bim-coordination",
    title: "BIM & Model Coordination—Seamless, Visual, Intelligent",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Box className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-orange-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            IDS & BIM Coordination simplifies model aggregation, clash detection, and presentation management. Through
            Autodesk and Procore APIs, HBI centralizes BIM workflows and makes it easy to identify issues, communicate
            visually, and integrate IDS pricing into estimates—maintaining continuity from coordination to contract.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of switching between multiple BIM platforms and manual clash tracking,{" "}
            <strong>all model coordination is centralized</strong> with direct integration to IDS department services
            and estimating workflows.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Clash Detection</div>
              <div className="text-xs text-orange-200">
                Aggregated and visualized clashes from Autodesk and Procore.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👁️</div>
              <div className="font-medium text-white">Model Viewing</div>
              <div className="text-xs text-orange-200">Presentation-ready model viewers built into each phase.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💼</div>
              <div className="font-medium text-white">IDS Services</div>
              <div className="text-xs text-orange-200">Track IDS offerings and costs—directly within estimating.</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default preconTabSlides
