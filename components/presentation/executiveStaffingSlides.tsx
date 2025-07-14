/**
 * @fileoverview Executive Staffing Presentation Slide Definitions
 * @module ExecutiveStaffingSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Executive Staffing presentation.
 * Focuses on ExecutiveStaffingView.tsx layout, drag-and-drop Gantt chart scheduling,
 * real-time assignment visibility, predictive staffing gaps, and role-based filtering.
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
} from "lucide-react"

export const executiveStaffingSlides: PresentationSlide[] = [
  {
    id: "from-spreadsheets-to-strategy",
    title: "From Spreadsheets to Strategy",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            Transform your workforce planning from <span className="text-orange-500">reactive chaos</span> to{" "}
            <span className="text-blue-600">strategic advantage</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600">Old Way</h3>
              </div>
              <ul className="space-y-3 text-lg">
                <li>• Manual spreadsheet tracking</li>
                <li>• Last-minute scrambling</li>
                <li>• Disconnected project data</li>
                <li>• Reactive decision making</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-600">HB Intel Way</h3>
              </div>
              <ul className="space-y-3 text-lg">
                <li>
                  • <strong>Intelligent forecasting</strong>
                </li>
                <li>
                  • <strong>Proactive gap detection</strong>
                </li>
                <li>
                  • <strong>Unified project visibility</strong>
                </li>
                <li>
                  • <strong>Strategic workforce planning</strong>
                </li>
              </ul>
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
            See your entire workforce at a glance with our{" "}
            <span className="text-blue-600">interactive Gantt visualization</span>.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Drag & Drop Assignments</h3>
                <p className="text-lg">Intuitive scheduling with visual feedback and conflict detection</p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Calendar className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Multi-Project Timeline</h3>
                <p className="text-lg">See all projects and assignments across your entire portfolio</p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-purple-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Zap className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Updates</h3>
                <p className="text-lg">Instant visibility into capacity, availability, and utilization</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xl text-center">
              <strong>No more guesswork.</strong> Make informed decisions with complete workforce visibility.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "real-time-assignment-visibility",
    title: "Real-Time Assignment Visibility",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            Track every assignment, every role, every project in <span className="text-green-600">real-time</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">Live Dashboard</h3>
              </div>
              <ul className="space-y-4 text-lg">
                <li>
                  • <strong>Current assignments</strong> across all projects
                </li>
                <li>
                  • <strong>Utilization rates</strong> by role and individual
                </li>
                <li>
                  • <strong>Availability windows</strong> for quick scheduling
                </li>
                <li>
                  • <strong>Skill matching</strong> for optimal placement
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">Instant Alerts</h3>
              </div>
              <ul className="space-y-4 text-lg">
                <li>
                  • <strong>Overallocation warnings</strong> before they happen
                </li>
                <li>
                  • <strong>Schedule conflicts</strong> with resolution suggestions
                </li>
                <li>
                  • <strong>Resource gaps</strong> identified weeks in advance
                </li>
                <li>
                  • <strong>Project milestones</strong> at risk due to staffing
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mt-8">
            <p className="text-xl text-center font-semibold">
              <CheckCircle className="inline h-6 w-6 text-green-600 mr-2" />
              Stay ahead of staffing challenges with <strong>predictive insights</strong> and{" "}
              <strong>automated alerts</strong>.
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
            Our <span className="text-purple-600">AI-powered analytics</span> identify staffing gaps weeks before they
            impact your projects.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-purple-600">Predictive Intelligence</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full mt-1">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Demand Forecasting</p>
                      <p className="text-base opacity-90">
                        Analyze historical patterns and project pipelines to predict future staffing needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full mt-1">
                      <AlertTriangle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Risk Assessment</p>
                      <p className="text-base opacity-90">
                        Identify potential bottlenecks and critical path dependencies
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full mt-1">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Skill Gap Analysis</p>
                      <p className="text-base opacity-90">
                        Match required expertise with available talent across your organization
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-orange-600">Proactive Solutions</h3>
                <div className="space-y-4 text-lg">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-orange-800">3-Week Warning System</p>
                    <p className="text-orange-700">Get advance notice when gaps are detected</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-800">Automated Recommendations</p>
                    <p className="text-green-700">Suggested solutions with impact analysis</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-800">Resource Optimization</p>
                    <p className="text-blue-700">Maximize efficiency across all projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "role-based-filtering-analytics",
    title: "Role-Based Intelligence",
    content: (
      <div className="space-y-8">
        <div className="space-y-6">
          <p className="text-3xl md:text-5xl font-bold leading-tight">
            Tailored insights for every level of your organization, from{" "}
            <span className="text-blue-600">field operations</span> to{" "}
            <span className="text-purple-600">executive strategy</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-600">Project Managers</h3>
              </div>
              <ul className="space-y-2 text-base">
                <li>• Team capacity planning</li>
                <li>• Schedule optimization</li>
                <li>• Resource allocation</li>
                <li>• Performance tracking</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-600">Project Executives</h3>
              </div>
              <ul className="space-y-2 text-base">
                <li>• Portfolio overview</li>
                <li>• Cross-project analytics</li>
                <li>• Strategic planning</li>
                <li>• Risk management</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-600">Executives</h3>
              </div>
              <ul className="space-y-2 text-base">
                <li>• Company-wide metrics</li>
                <li>• Growth planning</li>
                <li>• Market analysis</li>
                <li>• Strategic insights</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
            <p className="text-xl font-bold text-center">
              <strong>Smart Filters:</strong> See exactly what matters to your role, when it matters most.
            </p>
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
            Experience the future of workforce management with{" "}
            <span className="text-blue-600">HB Intel's Executive Staffing Platform</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-600">Immediate Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-lg">
                    <strong>75% reduction</strong> in scheduling conflicts
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-lg">
                    <strong>3-week advance</strong> staffing gap detection
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-lg">
                    <strong>Real-time visibility</strong> across all projects
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-lg">
                    <strong>Automated reporting</strong> and analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-600">Strategic Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <p className="text-lg">
                    <strong>Improved project delivery</strong> timelines
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <p className="text-lg">
                    <strong>Enhanced team utilization</strong> rates
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <p className="text-lg">
                    <strong>Data-driven decisions</strong> for growth
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <p className="text-lg">
                    <strong>Competitive advantage</strong> in market
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-xl text-white text-center">
            <p className="text-2xl font-bold mb-4">Ready to Transform Your Staffing Strategy?</p>
            <p className="text-lg mb-6">Join the next generation of construction workforce management with HB Intel.</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl font-semibold">Experience the Platform</span>
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default executiveStaffingSlides
