/**
 * @fileoverview Executive Staffing Presentation Slide Definitions
 * @module ExecutiveStaffingSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Executive Staffing presentation.
 * Based on ExecutiveStaffingView.tsx component features including SPCR management,
 * drag-and-drop Gantt chart scheduling, Needing Assignment panel, and executive insights.
 *
 * Updated to follow PresentationCarousel.tsx conventions:
 * - Proper typography hierarchy with responsive text sizing
 * - Simplified layouts optimized for full-screen presentation
 * - Consistent styling with carousel background and animations
 * - Content structured for carousel's motion animation system
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Zap,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Eye,
  Settings,
  Building2,
  UserCheck,
  Sparkles,
} from "lucide-react"

export const executiveStaffingSlides: PresentationSlide[] = [
  {
    id: "from-spreadsheets-to-strategy",
    title: "From Spreadsheets to Strategy",
    content: (
      <div className="space-y-8">
        <p className="text-xl lg:text-2xl xl:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12">
          Replace the <span className="text-red-300 font-semibold">legacy Excel workflow</span> with{" "}
          <span className="text-blue-200 font-semibold">centralized intelligence</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-300" />
              <h3 className="text-lg font-bold text-red-300">Pain Points</h3>
            </div>
            <ul className="space-y-2 text-blue-100">
              <li>• Manual spreadsheet updates</li>
              <li>• Misaligned handoffs</li>
              <li>• Stale, disconnected data</li>
              <li>• Version control chaos</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-8 w-8 text-yellow-300" />
              <h3 className="text-lg font-bold text-yellow-300">Optimization</h3>
            </div>
            <p className="text-blue-100">
              <strong>Centralized project/staffing database</strong> pulls real-time data across all systems
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-300" />
              <h3 className="text-lg font-bold text-green-300">Results</h3>
            </div>
            <div className="space-y-2 text-blue-100">
              <p>
                <strong>Productivity:</strong> Eliminates 5-10 hours/week
              </p>
              <p>
                <strong>Benefit:</strong> Executives make decisions—not format spreadsheets
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "visualizing-workforce",
    title: "Visualizing the Workforce",
    content: (
      <div className="space-y-8">
        <p className="text-xl lg:text-2xl xl:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12">
          See your workforce with <span className="text-purple-300 font-semibold">executive-level staffing matrix</span>{" "}
          grouped by PE → Project → Role.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="h-8 w-8 text-purple-300" />
              <h3 className="text-lg font-bold text-purple-300">Description</h3>
            </div>
            <p className="text-blue-100">
              Executive-level staffing matrix shows hierarchical view:{" "}
              <strong>Project Executive → Project → Role assignments</strong>
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-8 w-8 text-blue-300" />
              <h3 className="text-lg font-bold text-blue-300">Optimization</h3>
            </div>
            <p className="text-blue-100">
              <strong>Drag-and-drop Gantt chart</strong> replaces static timelines with interactive scheduling
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-8 w-8 text-green-300" />
              <h3 className="text-lg font-bold text-green-300">Impact</h3>
            </div>
            <div className="space-y-2 text-blue-100">
              <p>
                <strong>Productivity:</strong> Instant visibility into staffing
              </p>
              <p>
                <strong>Benefit:</strong> Improved load balancing, faster planning
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg font-semibold text-white text-center">
            Visual workforce planning at executive scale—see the big picture, drill down to details.
          </p>
        </motion.div>
      </div>
    ),
  },
  {
    id: "predicting-gaps-before-they-happen",
    title: "Predicting Gaps Before They Happen",
    content: (
      <div className="space-y-8">
        <p className="text-xl lg:text-2xl xl:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12">
          The <span className="text-orange-300 font-semibold">"Needing Assignment" panel</span> detects at-risk
          personnel based on upcoming assignment end dates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-8 w-8 text-orange-300" />
              <h3 className="text-lg font-bold text-orange-300">Description</h3>
            </div>
            <p className="text-blue-100">
              Smart panel automatically flags personnel whose assignments end within <strong>14-62 days</strong>,
              color-coded by urgency
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-8 w-8 text-blue-300" />
              <h3 className="text-lg font-bold text-blue-300">Optimization</h3>
            </div>
            <p className="text-blue-100">
              <strong>Auto-flagging based on date logic</strong> with filterable views by role and criticality
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-300" />
              <h3 className="text-lg font-bold text-green-300">Results</h3>
            </div>
            <div className="space-y-2 text-blue-100">
              <p>
                <strong>Productivity:</strong> Staffing gaps filled weeks earlier
              </p>
              <p>
                <strong>Benefit:</strong> Prevents idle time, protects margins
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-xl font-bold text-center mb-6 text-white">Color-Coded Early Warning System</h3>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="bg-red-500/30 text-red-200 px-4 py-2 rounded-full font-bold mb-2">≤14 days</div>
              <p className="text-sm text-blue-100">Critical</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500/30 text-yellow-200 px-4 py-2 rounded-full font-bold mb-2">15-30 days</div>
              <p className="text-sm text-blue-100">Warning</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/30 text-green-200 px-4 py-2 rounded-full font-bold mb-2">31+ days</div>
              <p className="text-sm text-blue-100">Planning</p>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "assignment-flow-refined",
    title: "The Assignment Flow, Refined",
    content: (
      <div className="space-y-8">
        <p className="text-xl lg:text-2xl xl:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12">
          Smart <span className="text-blue-300 font-semibold">"Create Assignment" modal</span> with position-grouped
          selectors and dual search modes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8 text-blue-300" />
              <h3 className="text-lg font-bold text-blue-300">Description</h3>
            </div>
            <p className="text-blue-100">
              Intelligent modal with <strong>position-grouped staff selectors</strong>, start date filters, and dual
              search modes (by name or role)
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-8 w-8 text-purple-300" />
              <h3 className="text-lg font-bold text-purple-300">Optimization</h3>
            </div>
            <p className="text-blue-100">
              <strong>No more scrolling through endless names</strong>—smart filtering and categorization
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-300" />
              <h3 className="text-lg font-bold text-green-300">Results</h3>
            </div>
            <div className="space-y-2 text-blue-100">
              <p>
                <strong>Productivity:</strong> Create assignment in under 30 seconds
              </p>
              <p>
                <strong>Benefit:</strong> Faster workflows with fewer errors
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Smart Features</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Position-based staff grouping</li>
                <li>• Available date filtering</li>
                <li>• Conflict detection</li>
                <li>• Rate/budget validation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Workflow Steps</h3>
              <ol className="space-y-2 text-blue-100">
                <li>1. Select SPCR requirement</li>
                <li>2. Choose qualified staff</li>
                <li>3. Set assignment dates</li>
                <li>4. Confirm and deploy</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "insights-in-context",
    title: "Insights in Context",
    content: (
      <div className="space-y-8">
        <p className="text-xl lg:text-2xl xl:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12">
          Executive-level trends and <span className="text-red-300 font-semibold">system alerts</span> for
          overallocations and assignment collisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-8 w-8 text-red-300" />
              <h3 className="text-lg font-bold text-red-300">Description</h3>
            </div>
            <p className="text-blue-100">
              Real-time dashboard displays <strong>executive-level trends</strong> and system alerts for
              overallocations, assignment collisions, and resource conflicts
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-300" />
              <h3 className="text-lg font-bold text-blue-300">Optimization</h3>
            </div>
            <p className="text-blue-100">
              <strong>Live, contextual insights</strong> replace anecdotal planning with data-driven intelligence
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-8 w-8 text-green-300" />
              <h3 className="text-lg font-bold text-green-300">Results</h3>
            </div>
            <div className="space-y-2 text-blue-100">
              <p>
                <strong>Productivity:</strong> Execs can triage issues directly
              </p>
              <p>
                <strong>Benefit:</strong> Moves decisions closer to the data
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-xl font-bold text-center mb-6 text-white">Executive Alert System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-red-300">Critical Alerts</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Staff overallocation warnings</li>
                <li>• Schedule conflict detection</li>
                <li>• Budget variance alerts</li>
                <li>• Resource shortage notices</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-300">Trend Analysis</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Utilization rate trends</li>
                <li>• Project timeline health</li>
                <li>• Cost performance metrics</li>
                <li>• Resource optimization opportunities</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "your-staffing-plan-elevated",
    title: "Your Staffing Plan, Elevated",
    content: (
      <div className="space-y-6">
        <p className="text-lg lg:text-xl xl:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
          Integrated into <span className="text-blue-300 font-semibold">HB Intel's unified platform</span>—supporting 4x
          growth without 4x staffing effort.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="h-6 w-6 text-blue-300" />
              <h3 className="text-base font-bold text-blue-300">Platform Integration</h3>
            </div>
            <p className="text-sm text-blue-100">
              Seamlessly fits into <strong>HB Intel's ecosystem</strong> of cross-functional planning
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <Settings className="h-6 w-6 text-purple-300" />
              <h3 className="text-base font-bold text-purple-300">Unified Operations</h3>
            </div>
            <p className="text-sm text-blue-100">
              <strong>Integrated across dashboards and scheduling tools</strong> for seamless workflow
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-6 w-6 text-green-300" />
              <h3 className="text-base font-bold text-green-300">Scale Results</h3>
            </div>
            <p className="text-sm text-blue-100">
              <strong>Supports 4x growth</strong> without proportional staffing increases
            </p>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Transform Your Workforce Strategy Today</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-base font-bold text-orange-200">Strategic Impact</h4>
                <ul className="space-y-1 text-sm text-blue-100">
                  <li>• 85% reduction in planning cycles</li>
                  <li>• 60% improvement in resource utilization</li>
                  <li>• Real-time executive visibility</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-orange-200">Platform Integration</h4>
                <ul className="space-y-1 text-sm text-blue-100">
                  <li>• Unified with project dashboards</li>
                  <li>• Connected to scheduling tools</li>
                  <li>• Seamless HB Intel ecosystem</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Sparkles className="h-5 w-5 text-orange-300" />
              <span className="text-lg font-bold text-white">Ready to Scale Smart?</span>
              <ArrowRight className="h-5 w-5 text-orange-300" />
            </div>
          </div>
        </motion.div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default executiveStaffingSlides
