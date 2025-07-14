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
    title: "Pre-Construction Command Center",
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
            <strong>Pre-Construction Command Center</strong> transforms disconnected estimating and planning processes
            by <strong>integrating BuildingConnected, scheduling, staffing, and BIM coordination</strong> into one
            unified platform that follows projects through their entire lifecycle.
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
              <div className="text-xs text-blue-200">BuildingConnected integration with Excel workbook management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👥</div>
              <div className="font-medium text-white">Staffing Plans</div>
              <div className="text-xs text-blue-200">Pre-construction team allocation and resource planning</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Schedule Analysis</div>
              <div className="text-xs text-blue-200">Bid package scheduling with HBI risk assessment</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🏗️</div>
              <div className="font-medium text-white">BIM Coordination</div>
              <div className="text-xs text-blue-200">Clash detection, model viewing, and IDS integration</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "unified-estimating",
    title: "Unified Estimating Platform",
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
            <strong>Unified Estimating Platform</strong> eliminates the disconnect between BuildingConnected
            subcontractor bids and Excel workbook development by{" "}
            <strong>overlaying BuildingConnected with integrated estimating tools</strong> that maintain project
            continuity from bid to warranty closeout.
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
              <div className="text-xs text-green-200">Native subcontractor bid management with enhanced workflows</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Estimating Workbooks</div>
              <div className="text-xs text-green-200">Excel-powered estimating with project lifecycle tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Lifecycle Continuity</div>
              <div className="text-xs text-green-200">Seamless data flow from bid through warranty closeout</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "precon-planning",
    title: "Pre-Construction Planning & Risk Analysis",
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
            <strong>Pre-Construction Planning</strong> transforms project preparation by{" "}
            <strong>creating integrated staffing plans, schedule analysis, and HBI-powered risk assessment</strong> that
            combines estimating coverage, schedule constraints, and industry data for comprehensive project
            intelligence.
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
                Pre-construction team allocation supporting estimating process
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Schedule Generation</div>
              <div className="text-xs text-purple-200">
                Bid package and pre-construction schedule creation and analysis
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">HBI Risk Analysis</div>
              <div className="text-xs text-purple-200">AI-powered risk assessment with industry data aggregation</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "bim-coordination",
    title: "IDS & BIM Coordination",
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
            <strong>IDS & BIM Coordination</strong> streamlines model management and clash resolution by{" "}
            <strong>aggregating clash detection data through Autodesk and Procore APIs</strong> while providing model
            viewing, presentation media, and integrated IDS services pricing.
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
              <div className="text-xs text-orange-200">Automated clash aggregation via Autodesk and Procore APIs</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👁️</div>
              <div className="font-medium text-white">Model Viewing</div>
              <div className="text-xs text-orange-200">Integrated model viewing with presentation media rendering</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💼</div>
              <div className="font-medium text-white">IDS Services</div>
              <div className="text-xs text-orange-200">
                Menu of IDS services with pricing integrated into estimating
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default preconTabSlides
