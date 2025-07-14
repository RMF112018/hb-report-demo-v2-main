/**
 * @fileoverview HB Intel Tour Slide Definitions (Condensed)
 * @module IntelTourSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Intel Tour slide definitions using the standard PresentationSlide interface
 * for consistency with the main presentation carousel system.
 * Condensed to 6 focused slides covering HB Intel v3.0 platform overview.
 */

import React from "react"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Brain,
  Users,
  Building,
  BarChart3,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react"

export const intelTourSlides: PresentationSlide[] = [
  {
    id: "welcome",
    title: "Welcome to HB Intel v3.0",
    content: (
      <div className="space-y-6">
        {/* Icon integrated into content */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Building className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            A purpose-built, role-based operational intelligence platform for large construction and development firms.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Designed to unify visibility and cross-functional coordination across the full project lifecycle—from early
          business development to closeout and turnover.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-base lg:text-lg font-medium">
            🏗️ <strong>Supporting:</strong> Ultra-Luxury Residential • Commercial Construction • Multi-Family
            Development
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "the-challenge",
    title: "The Challenge: Disconnected Systems",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <AlertTriangle className="h-16 w-16 text-orange-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Critical industry issue: Lack of unified visibility due to disconnected systems.</strong>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <p className="text-lg opacity-90">
              <strong>Current State Problems:</strong>
            </p>
            <ul className="text-base space-y-2 opacity-80">
              <li>• Data trapped in silos (Procore, Sage, SharePoint, Excel)</li>
              <li>• Manual reporting and status chasing</li>
              <li>• 2-3 day decision cycle delays</li>
              <li>• Information overload and dashboard fatigue</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-lg opacity-90">
              <strong>Business Impact:</strong>
            </p>
            <ul className="text-base space-y-2 opacity-80">
              <li>• Cost overruns and scheduling delays</li>
              <li>• Increased rework and quality issues</li>
              <li>• Lost productivity across all roles</li>
              <li>• Risk exposure and compliance gaps</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "the-solution",
    title: "The Solution: Intelligent Overlay Platform",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-16 w-16 text-purple-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>
            HB Intel acts as an overlay platform—a layer of intelligence that unifies your existing systems.
          </strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Rather than replacing core systems, HB Intel draws from them, organizes their data, and delivers it in a
          meaningful, context-specific way.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🔗 Unified Data Aggregation</h4>
            <p className="text-sm opacity-80">
              Integrates with Procore, Sage, SharePoint via APIs to create consolidated project views
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🎯 Role-Based Intelligence</h4>
            <p className="text-sm opacity-80">Personalized interfaces for each role, reducing information overload</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "key-features",
    title: "Key Features & Tools",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Zap className="h-16 w-16 text-yellow-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Comprehensive tools for every construction role and workflow.</strong>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 mr-2 text-orange-300" />
              <h4 className="text-base font-semibold">Estimating & Bid Management</h4>
            </div>
            <p className="text-sm opacity-80">BuildingConnected integration, CSI templates, pricing analysis</p>
          </div>
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 mr-2 text-blue-300" />
              <h4 className="text-base font-semibold">Scheduling Oversight</h4>
            </div>
            <p className="text-sm opacity-80">Schedule drift tracking, milestone overlays, look-ahead planning</p>
          </div>
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 mr-2 text-green-300" />
              <h4 className="text-base font-semibold">Financial Forecasting</h4>
            </div>
            <p className="text-sm opacity-80">GCGR workflows, draw forecasts, cost code tracking</p>
          </div>
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 mr-2 text-indigo-300" />
              <h4 className="text-base font-semibold">Field Reporting & QC</h4>
            </div>
            <p className="text-sm opacity-80">Standardized daily reports, safety logs, compliance docs</p>
          </div>
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 mr-2 text-cyan-300" />
              <h4 className="text-base font-semibold">Staffing & Responsibility</h4>
            </div>
            <p className="text-sm opacity-80">Assignment forecasting, gap analysis, accountability tracking</p>
          </div>
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-300" />
              <h4 className="text-base font-semibold">AI-Powered Analytics</h4>
            </div>
            <p className="text-sm opacity-80">Natural language queries, predictive forecasting, automated insights</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "proven-benefits",
    title: "Proven Benefits & ROI",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <TrendingUp className="h-16 w-16 text-green-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Documented benefits based on market benchmarks and deployment results.</strong>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-300 mb-2">25-30%</div>
            <p className="text-sm font-medium">Reduction in Data Retrieval Time</p>
            <p className="text-xs opacity-70 mt-1">Across field, office, and leadership roles</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-3xl font-bold text-orange-300 mb-2">15-20%</div>
            <p className="text-sm font-medium">Reduction in Cost Overruns</p>
            <p className="text-xs opacity-70 mt-1">Through early risk detection</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-300 mb-2">10-15%</div>
            <p className="text-sm font-medium">Reduction in Rework</p>
            <p className="text-xs opacity-70 mt-1">Centralized issue visibility</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
              <span className="text-lg font-semibold">10 hours/week saved</span>
            </div>
            <p className="text-sm opacity-80">Per manager by eliminating manual reporting</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
              <span className="text-lg font-semibold">&lt;1 hour decisions</span>
            </div>
            <p className="text-sm opacity-80">Executive decision cycle vs. 2-3 day delays</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ready-to-transform",
    title: "Ready to Transform Your Operations?",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-16 w-16 text-gradient" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>HB Intel v3.0: Your connective tissue for modern construction operations.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Break down operational silos, accelerate decision-making, and build a foundation for AI-assisted
          intelligence—all within secure, governance-aligned enterprise protocols.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Shield className="h-8 w-8 mx-auto mb-2 text-blue-300" />
            <h4 className="text-sm font-semibold">Enterprise Security</h4>
            <p className="text-xs opacity-70">SSO integration, role-based access, audit logging</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Zap className="h-8 w-8 mx-auto mb-2 text-orange-300" />
            <h4 className="text-sm font-semibold">Rapid Deployment</h4>
            <p className="text-xs opacity-70">6-9 month rollout vs. years for full replacements</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-300" />
            <h4 className="text-sm font-semibold">AI-Ready Platform</h4>
            <p className="text-xs opacity-70">Governance framework for responsible AI adoption</p>
          </div>
        </div>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm text-center">
          <p className="text-base lg:text-lg font-medium">
            🚀 <strong>Deployment Timeline:</strong> 12-18 months phased rollout with minimal workflow disruption
          </p>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default intelTourSlides
