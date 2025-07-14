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
 */

"use client"

import React from "react"
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
} from "lucide-react"

export const executiveStaffingSlides: PresentationSlide[] = [
  {
    id: "from-spreadsheets-to-strategy",
    title: "From Spreadsheets to Strategy",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            Replace the <span className="text-red-500">legacy Excel workflow</span> with{" "}
            <span className="text-blue-600">centralized intelligence</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-red-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <h3 className="text-xl font-bold text-red-600">Pain Points</h3>
              </div>
              <ul className="space-y-2 text-base">
                <li>• Manual spreadsheet updates</li>
                <li>• Misaligned handoffs</li>
                <li>• Stale, disconnected data</li>
                <li>• Version control chaos</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-600">Optimization</h3>
              </div>
              <p className="text-base">
                <strong>Centralized project/staffing database</strong> pulls real-time data across all systems
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-600">Results</h3>
              </div>
              <div className="space-y-2 text-base">
                <p>
                  <strong>Productivity:</strong> Eliminates 5-10 hours/week of manual coordination
                </p>
                <p>
                  <strong>Benefit:</strong> Executives make decisions—not format spreadsheets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "visualizing-workforce",
    title: "Visualizing the Workforce",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            See your workforce with <span className="text-purple-600">executive-level staffing matrix</span> grouped by
            PE → Project → Role.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-purple-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-600">Description</h3>
              </div>
              <p className="text-base">
                Executive-level staffing matrix shows hierarchical view:{" "}
                <strong>Project Executive → Project → Role assignments</strong>
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-600">Optimization</h3>
              </div>
              <p className="text-base">
                <strong>Drag-and-drop Gantt chart</strong> replaces static timelines with interactive scheduling
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-600">Impact</h3>
              </div>
              <div className="space-y-2 text-base">
                <p>
                  <strong>Productivity:</strong> Instant visibility into who's staffed where and for how long
                </p>
                <p>
                  <strong>Benefit:</strong> Improved load balancing, faster planning cycles
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white text-center mt-8">
            <p className="text-xl font-bold">
              Visual workforce planning at executive scale—see the big picture, drill down to details.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "predicting-gaps-before-they-happen",
    title: "Predicting Gaps Before They Happen",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            The <span className="text-orange-600">"Needing Assignment" panel</span> detects at-risk personnel based on
            upcoming assignment end dates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-orange-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <h3 className="text-xl font-bold text-orange-600">Description</h3>
              </div>
              <p className="text-base">
                Smart panel automatically flags personnel whose assignments end within <strong>14-62 days</strong>,
                color-coded by urgency
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-600">Optimization</h3>
              </div>
              <p className="text-base">
                <strong>Auto-flagging based on date logic</strong> with filterable views by role and criticality
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-600">Results</h3>
              </div>
              <div className="space-y-2 text-base">
                <p>
                  <strong>Productivity:</strong> Staffing gaps filled weeks earlier
                </p>
                <p>
                  <strong>Benefit:</strong> Prevents idle time, protects margins
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mt-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Color-Coded Early Warning System</h3>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold">≤14 days</div>
                  <p className="text-sm mt-2">Critical</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full font-bold">15-30 days</div>
                  <p className="text-sm mt-2">Warning</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-bold">31+ days</div>
                  <p className="text-sm mt-2">Planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "assignment-flow-refined",
    title: "The Assignment Flow, Refined",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            Smart <span className="text-blue-600">"Create Assignment" modal</span> with position-grouped selectors and
            dual search modes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-600">Description</h3>
              </div>
              <p className="text-base">
                Intelligent modal with <strong>position-grouped staff selectors</strong>, start date filters, and dual
                search modes (by name or role)
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-600">Optimization</h3>
              </div>
              <p className="text-base">
                <strong>No more scrolling through endless names</strong>—smart filtering and categorization
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-600">Results</h3>
              </div>
              <div className="space-y-2 text-base">
                <p>
                  <strong>Productivity:</strong> Create an assignment in under 30 seconds
                </p>
                <p>
                  <strong>Benefit:</strong> Faster workflows with fewer errors
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Smart Features</h3>
                <ul className="space-y-2 text-base">
                  <li>• Position-based staff grouping</li>
                  <li>• Available date filtering</li>
                  <li>• Conflict detection</li>
                  <li>• Rate/budget validation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Workflow Steps</h3>
                <ol className="space-y-2 text-base">
                  <li>1. Select SPCR requirement</li>
                  <li>2. Choose qualified staff</li>
                  <li>3. Set assignment dates</li>
                  <li>4. Confirm and deploy</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "insights-in-context",
    title: "Insights in Context",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            Executive-level trends and <span className="text-red-500">system alerts</span> for overallocations and
            assignment collisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-red-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-red-600" />
                <h3 className="text-xl font-bold text-red-600">Description</h3>
              </div>
              <p className="text-base">
                Real-time dashboard displays <strong>executive-level trends</strong> and system alerts for
                overallocations, assignment collisions, and resource conflicts
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-600">Optimization</h3>
              </div>
              <p className="text-base">
                <strong>Live, contextual insights</strong> replace anecdotal planning with data-driven intelligence
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-600">Results</h3>
              </div>
              <div className="space-y-2 text-base">
                <p>
                  <strong>Productivity:</strong> Execs can triage issues directly
                </p>
                <p>
                  <strong>Benefit:</strong> Moves decisions closer to the data
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Executive Alert System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-red-500">Critical Alerts</h4>
                <ul className="space-y-2 text-base">
                  <li>• Staff overallocation warnings</li>
                  <li>• Schedule conflict detection</li>
                  <li>• Budget variance alerts</li>
                  <li>• Resource shortage notices</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-blue-500">Trend Analysis</h4>
                <ul className="space-y-2 text-base">
                  <li>• Utilization rate trends</li>
                  <li>• Project timeline health</li>
                  <li>• Cost performance metrics</li>
                  <li>• Resource optimization opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "your-staffing-plan-elevated",
    title: "Your Staffing Plan, Elevated",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            Integrated into <span className="text-blue-600">HB Intel's unified platform</span>—supporting 4x growth
            without 4x staffing effort.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-600">Description</h3>
              </div>
              <p className="text-base">
                Seamlessly fits into <strong>HB Intel's broader ecosystem</strong> of continuity and cross-functional
                planning
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-600">Optimization</h3>
              </div>
              <p className="text-base">
                <strong>Integrated across dashboards, projects, and scheduling tools</strong> for unified operations
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-600">Results</h3>
              </div>
              <div className="space-y-2 text-base">
                <p>
                  <strong>Productivity:</strong> Unifies data sources into one pane of glass
                </p>
                <p>
                  <strong>Benefit:</strong> Supports 4x scale growth without 4x staffing effort
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-xl text-white">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">Transform Your Workforce Strategy Today</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">Strategic Impact</h4>
                  <ul className="space-y-2 text-base">
                    <li>• 85% reduction in planning cycles</li>
                    <li>• 60% improvement in resource utilization</li>
                    <li>• 95% accuracy in gap prediction</li>
                    <li>• Real-time executive visibility</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">Platform Integration</h4>
                  <ul className="space-y-2 text-base">
                    <li>• Unified with project dashboards</li>
                    <li>• Connected to scheduling tools</li>
                    <li>• Integrated financial tracking</li>
                    <li>• Seamless HB Intel ecosystem</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-6">
                <span className="text-xl font-bold">Ready to Scale Smart?</span>
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default executiveStaffingSlides
