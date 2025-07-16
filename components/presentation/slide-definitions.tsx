/**
 * @fileoverview HB Intel Leadership Presentation Slide Definitions
 * @module SlideDefinitions
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the HB Intel leadership presentation.
 * Each slide follows a logical flow from legacy to future vision,
 * centered around continuity as the core value proposition.
 */

"use client"

import React from "react"
import { PresentationSlide } from "./PresentationCarousel"
import { TangledToolsVisualization } from "./TangledToolsVisualization"
import {
  Building,
  TrendingUp,
  AlertTriangle,
  Shield,
  Target,
  Zap,
  Brain,
  CheckCircle,
  Sparkles,
  Users,
  BarChart3,
  Rocket,
} from "lucide-react"

export const slides: PresentationSlide[] = [
  {
    id: "welcome",
    title: "Continuity Begins Here",
    content: (
      <div className="space-y-6">
        {/* Icon integrated into content */}
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Building className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center" style={{ color: "rgb(250, 70, 22)" }}>
          <strong>
            Where <span className="font-bold underline">continuity</span> becomes your competitive advantage.
          </strong>
        </p>
        <p className="text-lg text-center opacity-90">
          For four decades, Hedrick Brothers has built more than structures—we&apos;ve built enduring trust and
          relationships.
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
          <p className="text-lg font-medium text-center">
            🏗️ <strong>HB Intel marks the next step in that legacy:</strong> a unified platform that protects what makes
            us great while powering our future.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "foundation-to-future",
    title: "From Foundation to Future",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <TrendingUp className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center">
          <strong>
            The principles that built our past—craftsmanship, relationships, trust—must scale into our future.
          </strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Shield className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Preserve Our Foundation</h4>
            <p className="text-base opacity-80">
              HB Intel is designed to preserve those principles while enabling operational scale and complexity.
            </p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Target className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Strategic Evolution</h4>
            <p className="text-base opacity-80">
              The question isn&apos;t whether we should evolve—it&apos;s how we evolve while staying true to what has
              made us successful.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "chaos-of-today",
    title: "The Chaos of Today",
    content: (
      <div className="relative w-full h-[600px] min-h-[600px] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-gray-900/20 to-gray-800/30">
        {/* Background visualization with fixed dimensions */}
        <div className="absolute inset-0 w-full h-full opacity-40">
          <TangledToolsVisualization />
        </div>

        {/* Text content - positioned above background */}
        <div className="relative z-10 flex items-center justify-center h-full p-6">
          <div className="max-w-3xl text-center space-y-6">
            <p className="text-lg lg:text-xl text-white">
              Right now, our project information lives in dozens of different places: spreadsheets, email chains,
              third-party platforms, and individual hard drives.
            </p>
            <p className="text-lg lg:text-xl text-white">
              When someone leaves, their knowledge walks out the door. When a project moves between phases, critical
              details get lost in translation.
            </p>
            <p className="text-base lg:text-lg text-blue-100 mt-8">
              Information silos erode continuity. Our talent, knowledge, and decisions deserve systems that connect, not
              fragment.
            </p>
          </div>
        </div>
      </div>
    ),
    backgroundGradient: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
  },
  {
    id: "risk-of-fragmentation",
    title: "The Risk of Fragmentation",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <AlertTriangle className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center">
          <strong>
            Our most valuable asset—our project knowledge—shouldn&apos;t be scattered across platforms we don&apos;t
            control.
          </strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <p className="text-lg font-semibold" style={{ color: "rgb(250, 70, 22)" }}>
              The Fragmentation Problem:
            </p>
            <ul className="text-base space-y-2 opacity-80">
              <li>• Subscription costs multiply exponentially</li>
              <li>• Data gets trapped in vendor silos</li>
              <li>• Integration breaks when vendors change APIs</li>
              <li>• Critical IP scattered across systems we don&apos;t own</li>
            </ul>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Shield className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-lg font-semibold mb-2">The Solution</h4>
            <p className="text-base opacity-80">
              <strong>Continuity demands ownership. Fragmentation compromises it.</strong>
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "what-industry-leaders-do",
    title: "What Industry Leaders Do",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Users className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center">
          <strong>
            Market leaders design their own continuity—standardizing data, protecting knowledge, and embedding culture
            in their systems.
          </strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Shield className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Data Control</h4>
            <p className="text-sm opacity-80">Maintain ownership over critical business data and workflows</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Target className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Scalable Platforms</h4>
            <p className="text-sm opacity-80">Create systems that grow with business rather than constraining it</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Brain className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Knowledge Preservation</h4>
            <p className="text-sm opacity-80">Scale institutional expertise that creates competitive differentiation</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "our-growth-path",
    title: "Our Growth Path",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <BarChart3 className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center">
          <strong>
            Growth without continuity results in chaos. HB Intel ensures what works now will still work when we&apos;re
            4x larger.
          </strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <p className="text-lg font-semibold" style={{ color: "rgb(250, 70, 22)" }}>
              Current Systems Breaking Points:
            </p>
            <ul className="text-base space-y-2 opacity-80">
              <li>• Systems that work today will break under 4x pressure</li>
              <li>• Informal processes don&apos;t scale with team growth</li>
              <li>• Individual relationships become bottlenecks</li>
              <li>• Knowledge transfer becomes critical challenge</li>
            </ul>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <TrendingUp className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Scalable Infrastructure</h4>
            <p className="text-base opacity-80">
              We need infrastructure that can grow with us—not just in capacity, but in capability. Systems that
              preserve our culture while enabling new levels of performance.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "introducing-hb-intel",
    title: "Introducing HB Intel",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Brain className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center">
          <strong>
            HB Intel is our integrated platform for project lifecycle management—from initial pursuit through final
            warranty.
          </strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Zap className="h-8 w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Continuous Chain</h4>
            <p className="text-sm opacity-80">
              Each module is more than a tool—it&apos;s a link in a continuous chain from pursuit to closeout
            </p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <CheckCircle className="h-8 w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Zero Knowledge Loss</h4>
            <p className="text-sm opacity-80">No knowledge is lost, no step is skipped, and no insight is siloed</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Target className="h-8 w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Full Lifecycle</h4>
            <p className="text-sm opacity-80">
              Complete coverage from business development through warranty resolution
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "architecture-vision",
    title: "Our Architecture Vision",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Shield className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center">
          <strong>
            Built for change, designed for continuity. HB Intel adapts to growth while anchoring our operations in a
            secure, reliable core.
          </strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Shield className="h-8 w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Enterprise Security</h4>
            <p className="text-sm opacity-80">
              Automated backups and redundant systems ensure data is always secure and accessible
            </p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Users className="h-8 w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Collaborative Access</h4>
            <p className="text-sm opacity-80">
              Role-based access keeps sensitive information protected while enabling collaboration
            </p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <TrendingUp className="h-8 w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-base font-semibold mb-2">Future-Ready Evolution</h4>
            <p className="text-sm opacity-80">
              Designed to evolve with us without losing the continuity that makes it valuable
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "what-happens-next",
    title: "What Happens Next",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Rocket className="h-16 w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-xl lg:text-2xl text-center">
          <strong>
            HB Intel isn&apos;t just about better software—it&apos;s about positioning ourselves for the next phase of
            our success.
          </strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Target className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Phased Implementation</h4>
            <p className="text-base opacity-80">
              Implementation begins with pilot projects and gradual rollout, ensuring we maintain operations while
              building the systems that will define our future.
            </p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-3">
              <Sparkles className="h-6 w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Our Responsibility</h4>
            <p className="text-base opacity-80">
              With HB Intel, we&apos;re not just getting bigger—we&apos;re becoming smarter, more resilient, and
              future-ready. <strong>Continuity isn&apos;t just our strategy—it&apos;s our responsibility.</strong>
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 text-center">
          <p className="text-lg font-medium">
            🚀 <strong>Ready to Transform:</strong> Building the future of construction operations, one continuous step
            at a time.
          </p>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default slides
