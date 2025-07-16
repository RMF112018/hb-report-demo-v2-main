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
    title: "From Chaos to Clarity: A Continuity-Driven Shift",
    content: (
      <div className="space-y-6">
        <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
          Replace fragmented spreadsheets with{" "}
          <span className="text-blue-200 font-semibold">connected workforce intelligence</span>—a foundation for
          scalable growth and strategic continuity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-red-300" />
            </div>
            <h3 className="text-base font-bold text-red-300 mb-3">Pain Points</h3>
            <ul className="space-y-1 text-sm text-blue-100">
              <li>• Inefficient manual updates</li>
              <li>• Disjointed handoffs between departments</li>
              <li>• Delayed insights due to siloed data</li>
              <li>• Inconsistent version control across files</li>
            </ul>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Zap className="h-6 w-6 text-yellow-300" />
            </div>
            <h3 className="text-base font-bold text-yellow-300 mb-3">Optimization</h3>
            <p className="text-sm text-blue-100">
              A <strong>centralized staffing platform</strong> ensures real-time continuity across teams, systems, and
              decisions
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-base font-bold text-green-300 mb-3">Results</h3>
            <div className="space-y-1 text-sm text-blue-100">
              <p>
                <strong>Efficiency:</strong> Save 5–10 hours per week
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Empower executives to make decisions with live data, not legacy
                files
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "visualizing-workforce",
    title: "Organizational Clarity through Visual Continuity",
    content: (
      <div className="space-y-6">
        <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
          Gain top-down visibility across your workforce—structured by{" "}
          <span className="text-purple-300 font-semibold">Project Executive → Project → Role</span>—for informed
          planning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <Eye className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-base font-bold text-purple-300 mb-3">Description</h3>
            <p className="text-sm text-blue-100">
              <strong>Executive matrix</strong> reveals organizational structure, enabling proactive workforce alignment
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Settings className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-base font-bold text-blue-300 mb-3">Optimization</h3>
            <p className="text-sm text-blue-100">
              Interactive <strong>drag-and-drop Gantt</strong> ensures scheduling continuity and eliminates timeline
              silos
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-base font-bold text-green-300 mb-3">Impact</h3>
            <div className="space-y-1 text-sm text-blue-100">
              <p>
                <strong>Efficiency:</strong> Real-time staffing insight
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Smarter load balancing across all projects
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-base font-semibold text-white text-center">
            Visual workforce planning at executive scale—see the big picture, drill down to details.
          </p>
        </motion.div>
      </div>
    ),
  },
  {
    id: "predicting-gaps-before-they-happen",
    title: "Continuity Guardrails: Forecasting Workforce Risk",
    content: (
      <div className="space-y-6">
        <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
          The <span className="text-orange-300 font-semibold">"Needing Assignment" panel</span> maintains staffing
          continuity by identifying upcoming gaps before they occur.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <Clock className="h-6 w-6 text-orange-300" />
            </div>
            <h3 className="text-base font-bold text-orange-300 mb-3">Description</h3>
            <p className="text-sm text-blue-100">
              <strong>Smart logic</strong> highlights staff whose assignments end within the next 30 days, color-coded
              by urgency
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Target className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-base font-bold text-blue-300 mb-3">Optimization</h3>
            <p className="text-sm text-blue-100">
              <strong>Auto-flagging logic</strong> enhances planning continuity, filterable by role or impact
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-base font-bold text-green-300 mb-3">Results</h3>
            <div className="space-y-1 text-sm text-blue-100">
              <p>
                <strong>Efficiency:</strong> Fill staffing gaps weeks in advance
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Safeguard against project disruptions and idle labor
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-bold text-center mb-4 text-white">Color-Coded Early Warning System</h3>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="bg-red-500/30 text-red-200 px-3 py-1 rounded-full text-sm font-bold mb-1">≤14 days</div>
              <p className="text-xs text-blue-100">Critical</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full text-sm font-bold mb-1">
                15-30 days
              </div>
              <p className="text-xs text-blue-100">Warning</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-sm font-bold mb-1">
                31+ days
              </div>
              <p className="text-xs text-blue-100">Planning</p>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "assignment-flow-refined",
    title: "Structured Assignment Flow for Seamless Continuity",
    content: (
      <div className="space-y-6">
        <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
          Simplify workforce planning with an intuitive modal that supports{" "}
          <span className="text-blue-300 font-semibold">consistent assignment logic</span> and decision continuity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <FileText className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-base font-bold text-blue-300 mb-3">Description</h3>
            <p className="text-sm text-blue-100">
              <strong>Position-grouped selectors</strong> and dual search paths (by staff or date) minimize errors and
              streamline workflows
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Zap className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-base font-bold text-purple-300 mb-3">Optimization</h3>
            <p className="text-sm text-blue-100">
              <strong>Dynamic filtering</strong> maintains focus and continuity in critical staffing actions
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-base font-bold text-green-300 mb-3">Results</h3>
            <div className="space-y-1 text-sm text-blue-100">
              <p>
                <strong>Efficiency:</strong> Assign roles in under 30 seconds
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Fewer errors, faster transitions
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-bold mb-3 text-white">Smart Features</h3>
              <ul className="space-y-1 text-sm text-blue-100">
                <li>• Position-based grouping</li>
                <li>• Availability filters</li>
                <li>• Conflict and budget checks</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3 text-white">Workflow Steps</h3>
              <ol className="space-y-1 text-sm text-blue-100">
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
    title: "Real-Time Oversight with Strategic Continuity",
    content: (
      <div className="space-y-6">
        <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
          Gain contextual insights across projects, with{" "}
          <span className="text-red-300 font-semibold">system-generated alerts</span> for misalignment, overuse, or
          scheduling threats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-red-300" />
            </div>
            <h3 className="text-base font-bold text-red-300 mb-3">Description</h3>
            <p className="text-sm text-blue-100">
              <strong>Live dashboard</strong> reveals real-time trends and alerts to support continuity in workforce
              health and planning
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-base font-bold text-blue-300 mb-3">Optimization</h3>
            <p className="text-sm text-blue-100">
              Moves beyond static reports to <strong>living data environments</strong> for fast executive triage
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <Target className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-base font-bold text-green-300 mb-3">Results</h3>
            <div className="space-y-1 text-sm text-blue-100">
              <p>
                <strong>Efficiency:</strong> Direct decision-making at executive level
              </p>
              <p>
                <strong>Continuity Benefit:</strong> Connect planning, action, and oversight in one place
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-bold text-center mb-4 text-white">Executive Alert System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-red-300">Critical Alerts</h4>
              <ul className="space-y-1 text-sm text-blue-100">
                <li>• Staff overallocation warnings</li>
                <li>• Schedule conflict detection</li>
                <li>• Budget variance alerts</li>
                <li>• Resource shortage notices</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-blue-300">Trend Analysis</h4>
              <ul className="space-y-1 text-sm text-blue-100">
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
    title: "Scaling with Continuity at the Core",
    content: (
      <div className="space-y-5">
        <p className="text-base lg:text-lg text-blue-100 max-w-4xl mx-auto leading-relaxed mb-6">
          <span className="text-blue-300 font-semibold">HB Intel's unified staffing platform</span> enables sustainable
          growth—maintaining operational continuity while expanding capacity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-2">
              <Building2 className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-sm font-bold text-blue-300 mb-2">Platform Integration</h3>
            <p className="text-xs text-blue-100">
              Seamlessly connects to <strong>HB Intel's cross-functional tools</strong>, ensuring visibility across all
              initiatives
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center mb-2">
              <Settings className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-sm font-bold text-purple-300 mb-2">Unified Operations</h3>
            <p className="text-xs text-blue-100">
              Combines <strong>dashboards, planning tools, and insights</strong> into a single strategic staffing
              ecosystem
            </p>
          </motion.div>

          <motion.div
            className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-sm font-bold text-green-300 mb-2">Scale Results</h3>
            <div className="space-y-1 text-xs text-blue-100">
              <p>
                <strong>Support 4× growth</strong> without 4× headcount
              </p>
              <p>Maintain planning accuracy and continuity at scale</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center space-y-3">
            <h3 className="text-lg font-bold text-white">Transform Your Workforce Strategy Today</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-orange-200">Strategic Impact</h4>
                <ul className="space-y-1 text-xs text-blue-100">
                  <li>• 85% reduction in planning cycles</li>
                  <li>• 60% resource utilization improvement</li>
                  <li>• Real-time visibility with executive oversight</li>
                </ul>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-orange-200">Platform Integration</h4>
                <ul className="space-y-1 text-xs text-blue-100">
                  <li>• Unified with project dashboards</li>
                  <li>• Connected to scheduling tools</li>
                  <li>• Seamless HB Intel ecosystem</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <Sparkles className="h-4 w-4 text-orange-300" />
              <span className="text-base font-bold text-white">Ready to Scale Smart?</span>
              <ArrowRight className="h-4 w-4 text-orange-300" />
            </div>
          </div>
        </motion.div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default executiveStaffingSlides
