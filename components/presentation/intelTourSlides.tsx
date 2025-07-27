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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Icon integrated into content */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Building className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-300" />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight">
          <strong>Welcome to HB Intel: Our Platform for Operational Continuity.</strong>
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          HB Intel is our role-based operational intelligence platform tailored for sophisticated construction and
          development teams.
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          It connects every function—from business development to project closeout—ensuring continuous visibility,
          seamless collaboration, and institutional memory at every step.
        </p>
        <div className="mt-4 sm:mt-6 md:mt-8 p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed">
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-orange-300" />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight">
          <strong>The Hidden Cost of Disconnection: Breaking Our Chain of Continuity</strong>
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          Disconnected tools create information silos, delay decisions, and force teams to spend hours tracking down
          what should be instantly accessible.
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          Without continuity, every handoff becomes a risk—and growth compounds the problem.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90 font-semibold">
              <strong>Current State Problems:</strong>
            </p>
            <ul className="text-xs sm:text-sm md:text-base space-y-1 sm:space-y-2 opacity-80 leading-relaxed">
              <li>• Data trapped in silos (Procore, Sage, SharePoint, Excel)</li>
              <li>• Manual reporting and status chasing</li>
              <li>• 2-3 day decision cycle delays</li>
              <li>• Information overload and dashboard fatigue</li>
            </ul>
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90 font-semibold">
              <strong>Business Impact:</strong>
            </p>
            <ul className="text-xs sm:text-sm md:text-base space-y-1 sm:space-y-2 opacity-80 leading-relaxed">
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Brain className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-purple-300" />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight">
          <strong>HB Intel: A Continuity Layer Across Our Enterprise</strong>
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          Rather than replacing our core systems, HB Intel overlays them—connecting and contextualizing data to
          eliminate gaps and ensure nothing falls through the cracks.
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          Our people stay in sync. Our insights compound. Our growth stays grounded in what already works.
        </p>
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="text-center p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">
              🔗 Unified Data Aggregation
            </h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Integrates with Procore, Sage, SharePoint via APIs to create consolidated project views
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">
              🎯 Role-Based Intelligence
            </h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Personalized interfaces for each role, reducing information overload
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "key-features",
    title: "Key Features & Tools",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Zap className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-yellow-300" />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight">
          <strong>One Platform. Every Role. End-to-End Continuity.</strong>
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          HB Intel provides tailored tools across all phases—estimating, scheduling, finance, field reporting, staffing,
          and analytics—working together in one unified system.
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          Every module reinforces the others, turning individual efforts into coordinated excellence.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-orange-300" />
            </div>
            <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2">Estimating & Bid Management</h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              BuildingConnected integration, CSI templates, pricing analysis
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
            </div>
            <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2">Scheduling Oversight</h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Schedule drift tracking, milestone overlays, look-ahead planning
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
            </div>
            <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2">Financial Forecasting</h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              GCGR workflows, draw forecasts, cost code tracking
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-300" />
            </div>
            <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2">Field Reporting & QC</h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Standardized daily reports, safety logs, compliance docs
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-300" />
            </div>
            <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2">Staffing & Responsibility</h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Assignment forecasting, gap analysis, accountability tracking
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
            </div>
            <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2">AI-Powered Analytics</h4>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Natural language queries, predictive forecasting, automated insights
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "proven-benefits",
    title: "Proven Benefits & ROI",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-green-300" />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight">
          <strong>Results That Reinforce Our Momentum</strong>
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          HB Intel delivers measurable returns—from faster decisions to fewer delays and reduced rework.
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          By ensuring continuity of information and accountability, our teams can act faster, with greater confidence
          and alignment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-300 mb-1 sm:mb-2">
              25-30%
            </div>
            <p className="text-xs sm:text-sm font-medium">Reduction in Data Retrieval Time</p>
            <p className="text-xs opacity-70 mt-1">Across field, office, and leadership roles</p>
          </div>
          <div className="text-center p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-300 mb-1 sm:mb-2">
              15-20%
            </div>
            <p className="text-xs sm:text-sm font-medium">Reduction in Cost Overruns</p>
            <p className="text-xs opacity-70 mt-1">Through early risk detection</p>
          </div>
          <div className="text-center p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-300 mb-1 sm:mb-2">
              10-15%
            </div>
            <p className="text-xs sm:text-sm font-medium">Reduction in Rework</p>
            <p className="text-xs opacity-70 mt-1">Centralized issue visibility</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
          <div className="text-center p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
            </div>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold block mb-1 sm:mb-2">
              10 hours/week saved
            </span>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">Per manager by eliminating manual reporting</p>
          </div>
          <div className="text-center p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex justify-center mb-1 sm:mb-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
            </div>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold block mb-1 sm:mb-2">
              &lt;1 hour decisions
            </span>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">Executive decision cycle vs. 2-3 day delays</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ready-to-transform",
    title: "Ready to Transform Your Operations?",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gradient" />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight">
          <strong>HB Intel v3.0: The Continuity Engine for Modern Construction</strong>
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          By unifying people, systems, and decisions, HB Intel enables transformational change without disruption.
        </p>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
          It preserves our strengths, accelerates our operations, and prepares our business for what's next—with
          continuity as the core advantage.
        </p>
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-1 sm:mb-2 text-blue-300" />
            <h4 className="text-xs sm:text-sm font-semibold">Enterprise Security</h4>
            <p className="text-xs opacity-70 leading-relaxed">SSO integration, role-based access, audit logging</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Zap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-1 sm:mb-2 text-orange-300" />
            <h4 className="text-xs sm:text-sm font-semibold">Rapid Deployment</h4>
            <p className="text-xs opacity-70 leading-relaxed">6-9 month rollout vs. years for full replacements</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Brain className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-1 sm:mb-2 text-purple-300" />
            <h4 className="text-xs sm:text-sm font-semibold">AI-Ready Platform</h4>
            <p className="text-xs opacity-70 leading-relaxed">Governance framework for responsible AI adoption</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 md:mt-8 p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm text-center">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed">
            🚀 <strong>Deployment Timeline:</strong> 12-18 months phased rollout with minimal workflow disruption
          </p>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default intelTourSlides
