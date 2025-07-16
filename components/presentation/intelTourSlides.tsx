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
    title: "Welcome to HB Intel",
    content: (
      <div className="space-y-6">
        {/* Icon integrated into content */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Building className="h-16 w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-xl lg:text-2xl">
          <strong>Welcome to HB Intel: Your Platform for Operational Continuity.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          HB Intel is a role-based operational intelligence platform tailored for sophisticated construction and
          development teams.
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          It connects every function—from business development to project closeout—ensuring continuous visibility,
          seamless collaboration, and institutional memory at every step.
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
          <strong>The Hidden Cost of Disconnection: Breaking the Chain of Continuity</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Disconnected tools create information silos, delay decisions, and force teams to spend hours tracking down
          what should be instantly accessible.
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Without continuity, every handoff becomes a risk—and growth compounds the problem.
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
          <strong>HB Intel: A Continuity Layer Across Your Enterprise</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Rather than replacing your core systems, HB Intel overlays them—connecting and contextualizing data to
          eliminate gaps and ensure nothing falls through the cracks.
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Your people stay in sync. Your insights compound. Your growth stays grounded in what already works.
        </p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-2">🔗 Unified Data Aggregation</h4>
            <p className="text-sm opacity-80">
              Integrates with Procore, Sage, SharePoint via APIs to create consolidated project views
            </p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
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
          <strong>One Platform. Every Role. End-to-End Continuity.</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          HB Intel provides tailored tools across all phases—estimating, scheduling, finance, field reporting, staffing,
          and analytics—working together in one unified system.
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          Every module reinforces the others, turning individual efforts into coordinated excellence.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <Target className="h-5 w-5 text-orange-300" />
            </div>
            <h4 className="text-base font-semibold mb-2">Estimating & Bid Management</h4>
            <p className="text-sm opacity-80">BuildingConnected integration, CSI templates, pricing analysis</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <Calendar className="h-5 w-5 text-blue-300" />
            </div>
            <h4 className="text-base font-semibold mb-2">Scheduling Oversight</h4>
            <p className="text-sm opacity-80">Schedule drift tracking, milestone overlays, look-ahead planning</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <DollarSign className="h-5 w-5 text-green-300" />
            </div>
            <h4 className="text-base font-semibold mb-2">Financial Forecasting</h4>
            <p className="text-sm opacity-80">GCGR workflows, draw forecasts, cost code tracking</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <FileText className="h-5 w-5 text-indigo-300" />
            </div>
            <h4 className="text-base font-semibold mb-2">Field Reporting & QC</h4>
            <p className="text-sm opacity-80">Standardized daily reports, safety logs, compliance docs</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <Users className="h-5 w-5 text-cyan-300" />
            </div>
            <h4 className="text-base font-semibold mb-2">Staffing & Responsibility</h4>
            <p className="text-sm opacity-80">Assignment forecasting, gap analysis, accountability tracking</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-purple-300" />
            </div>
            <h4 className="text-base font-semibold mb-2">AI-Powered Analytics</h4>
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
          <strong>Results That Reinforce Your Momentum</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          HB Intel delivers measurable returns—from faster decisions to fewer delays and reduced rework.
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          By ensuring continuity of information and accountability, your teams can act faster, with greater confidence
          and alignment.
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
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-300" />
            </div>
            <span className="text-lg font-semibold block mb-2">10 hours/week saved</span>
            <p className="text-sm opacity-80">Per manager by eliminating manual reporting</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-300" />
            </div>
            <span className="text-lg font-semibold block mb-2">&lt;1 hour decisions</span>
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
          <strong>HB Intel v3.0: The Continuity Engine for Modern Construction</strong>
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          By unifying people, systems, and decisions, HB Intel enables transformational change without disruption.
        </p>
        <p className="text-lg lg:text-xl opacity-90">
          It preserves your strengths, accelerates your operations, and prepares your business for what's next—with
          continuity as the core advantage.
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
