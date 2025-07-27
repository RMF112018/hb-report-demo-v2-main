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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Icon integrated into content */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Building className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center text-white leading-tight">
          <strong>
            Where{" "}
            <span
              className="font-bold text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              style={{ color: "rgb(250, 70, 22)" }}
            >
              CONTINUITY
            </span>{" "}
            becomes your competitive advantage.
          </strong>
        </p>
        <p className="text-xs sm:text-base md:text-lg text-center opacity-90 leading-relaxed max-w-4xl mx-auto px-2">
          For four decades, we have built more than structures—we&apos;ve built enduring trust and relationships.
        </p>
        <div className="mt-4 sm:mt-6 md:mt-8 p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
          <p className="text-xs sm:text-base md:text-lg font-medium text-center leading-relaxed">
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center leading-tight">
          <strong>
            The principles that built our past—craftsmanship, relationships, trust—must scale into our future.
          </strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 leading-tight">Preserve Our Foundation</h4>
            <p className="text-xs sm:text-base md:text-lg opacity-80 leading-relaxed">
              HB Intel is designed to preserve our principles while enabling operational scale and complexity.
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 leading-tight">Strategic Evolution</h4>
            <p className="text-xs sm:text-base md:text-lg opacity-80 leading-relaxed">
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
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-gray-900/20 to-gray-800/30">
        {/* Background visualization with responsive dimensions */}
        <div className="absolute inset-0 w-full h-full opacity-40">
          <TangledToolsVisualization />
        </div>

        {/* Text content - positioned above background */}
        <div className="relative z-10 flex items-center justify-center h-full p-3 sm:p-4 md:p-6">
          <div className="max-w-lg sm:max-w-2xl md:max-w-3xl text-center space-y-3 sm:space-y-4 md:space-y-6 px-2">
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white leading-relaxed">
              Right now, our project information lives in dozens of different places: spreadsheets, email chains,
              third-party platforms, and individual hard drives.
            </p>
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white leading-relaxed">
              When someone leaves, their knowledge walks out the door. When a project moves between phases, critical
              details get lost in translation.
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100 mt-3 sm:mt-4 md:mt-8 leading-relaxed">
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center leading-tight">
          <strong>
            Our most valuable asset—our project knowledge—shouldn&apos;t be scattered across platforms we don&apos;t
            control.
          </strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-lg md:text-xl font-semibold" style={{ color: "rgb(250, 70, 22)" }}>
              The Fragmentation Problem:
            </p>
            <ul className="text-xs sm:text-base md:text-lg space-y-1 sm:space-y-2 opacity-80 leading-relaxed">
              <li>• Our subscription costs multiply exponentially</li>
              <li>• Our data gets trapped in vendor silos</li>
              <li>• Our integration breaks when vendors change APIs</li>
              <li>• Our critical IP scattered across systems we don&apos;t own</li>
            </ul>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 leading-tight">The Solution</h4>
            <p className="text-xs sm:text-base md:text-lg opacity-80 leading-relaxed">
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Users className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center leading-tight">
          <strong>
            Market leaders design their own continuity—standardizing data, protecting knowledge, and embedding culture
            in their systems.
          </strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Data Control</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Maintain ownership over critical business data and workflows
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Scalable Platforms</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Create systems that grow with business rather than constraining it
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Knowledge Preservation</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Scale institutional expertise that creates competitive differentiation
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "our-growth-path",
    title: "Our Growth Path",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center leading-tight">
          <strong>
            Growth without continuity results in chaos. HB Intel ensures what works now will still work when we&apos;re
            4x larger.
          </strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-lg md:text-xl font-semibold" style={{ color: "rgb(250, 70, 22)" }}>
              Current Systems Breaking Points:
            </p>
            <ul className="text-xs sm:text-base md:text-lg space-y-1 sm:space-y-2 opacity-80 leading-relaxed">
              <li>• Our systems that work today will break under 4x pressure</li>
              <li>• Our informal processes don&apos;t scale with team growth</li>
              <li>• Our individual relationships become bottlenecks</li>
              <li>• Our knowledge transfer becomes critical challenge</li>
            </ul>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 leading-tight">Scalable Infrastructure</h4>
            <p className="text-xs sm:text-base md:text-lg opacity-80 leading-relaxed">
              We need infrastructure that can grow with us—not just in capacity, but in capability. Our systems that
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Brain className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center leading-tight">
          <strong>
            HB Intel is our integrated platform for project lifecycle management—from initial pursuit through final
            warranty.
          </strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Continuous Chain</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Each module is more than a tool—it&apos;s a link in our continuous chain from pursuit to closeout
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Zero Knowledge Loss</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Our knowledge is never lost, no step is skipped, and no insight is siloed
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Full Lifecycle</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Complete coverage of our business development through warranty resolution
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Shield className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center leading-tight">
          <strong>
            Built for change, designed for continuity. HB Intel adapts to growth while anchoring our operations in a
            secure, reliable core.
          </strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Enterprise Security</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Our automated backups and redundant systems ensure our data is always secure and accessible
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Collaborative Access</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Our role-based access keeps our sensitive information protected while enabling collaboration
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-xs sm:text-base md:text-lg font-semibold mb-2 leading-tight">Future-Ready Evolution</h4>
            <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed">
              Designed to evolve with us without losing the continuity that makes our systems valuable
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="p-3 sm:p-4 md:p-6 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/10">
            <Rocket className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" style={{ color: "rgb(250, 70, 22)" }} />
          </div>
        </div>

        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center leading-tight">
          <strong>
            HB Intel isn&apos;t just about better software—it&apos;s about positioning ourselves for the next phase of
            our success.
          </strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 leading-tight">Phased Implementation</h4>
            <p className="text-xs sm:text-base md:text-lg opacity-80 leading-relaxed">
              Our implementation begins with pilot projects and gradual rollout, ensuring we maintain operations while
              building the systems that will define our future.
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h4 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 leading-tight">Our Responsibility</h4>
            <p className="text-xs sm:text-base md:text-lg opacity-80 leading-relaxed">
              With HB Intel, we&apos;re not just getting bigger—we&apos;re becoming smarter, more resilient, and
              future-ready. <strong>Continuity isn&apos;t just our strategy—it&apos;s our responsibility.</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 md:p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 text-center">
          <p className="text-sm sm:text-lg md:text-xl font-medium leading-relaxed">
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
