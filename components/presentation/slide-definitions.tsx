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

export const slides: PresentationSlide[] = [
  {
    id: "welcome",
    title: "Welcome to HB Intel",
    content: (
      <div className="space-y-4">
        <p className="text-xl text-muted-foreground">Where continuity becomes your competitive advantage.</p>
        <p className="text-lg">
          For four decades, Hedrick Brothers has built more than structures—we&apos;ve built trust, relationships, and a
          reputation for excellence that defines who we are.
        </p>
        <p className="text-lg">
          Today, we&apos;re introducing the next chapter in that story: HB Intel, our integrated platform designed to
          preserve what makes us great while enabling the growth ahead.
        </p>
      </div>
    ),
  },
  {
    id: "foundation-to-future",
    title: "From Foundation to Future",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          Our 40-year foundation is built on relationships, quality craftsmanship, and the trust that comes from
          consistent delivery. These aren&apos;t just our past—they&apos;re our future.
        </p>
        <p className="text-lg">
          But to grow from where we are today to 4x our size in the next decade, we need systems that can scale our
          values, not just our volume.
        </p>
        <p className="text-lg">
          The question isn&apos;t whether we should evolve—it&apos;s how we evolve while staying true to what has made
          us successful.
        </p>
      </div>
    ),
  },
  {
    id: "chaos-of-today",
    title: "The Chaos of Today",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg">
            Right now, our project information lives in dozens of different places: spreadsheets, email chains,
            third-party platforms, and individual hard drives.
          </p>
          <p className="text-lg">
            When someone leaves, their knowledge walks out the door. When a project moves between phases, critical
            details get lost in translation.
          </p>
        </div>

        {/* Visualization of tangled tools */}
        <div className="my-8">
          <TangledToolsVisualization />
        </div>

        <p className="text-lg">
          We&apos;re spending more time hunting for information than using it to make decisions. This isn&apos;t
          sustainable at our current size—and it&apos;s impossible at 4x scale.
        </p>
      </div>
    ),
  },
  {
    id: "risk-of-fragmentation",
    title: "The Risk of Fragmentation",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          When we depend on external platforms to manage our most valuable asset—our project data—we lose control over
          our own operations.
        </p>
        <p className="text-lg">
          Subscription costs multiply. Data gets trapped in silos. Integration breaks when vendors change their APIs.
          Our intellectual property becomes scattered across systems we don&apos;t own.
        </p>
        <p className="text-lg">
          Most dangerously, we become dependent on other companies&apos; priorities instead of our own. That&apos;s not
          how leaders in any industry operate.
        </p>
      </div>
    ),
  },
  {
    id: "what-industry-leaders-do",
    title: "What Industry Leaders Do",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          Top-tier construction companies don&apos;t just use software—they build systems that reflect their unique
          processes and competitive advantages.
        </p>
        <p className="text-lg">
          They maintain control over their data, standardize their workflows, and create platforms that grow with their
          business rather than constraining it.
        </p>
        <p className="text-lg">
          They understand that technology isn&apos;t just about efficiency—it&apos;s about preserving institutional
          knowledge and scaling the expertise that makes them different.
        </p>
      </div>
    ),
  },
  {
    id: "our-growth-path",
    title: "Our Growth Path",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          Growing 4x in 10 years means we&apos;ll be managing more projects, more complexity, and more team members than
          ever before.
        </p>
        <p className="text-lg">
          The systems that work today will break under that pressure. The informal processes that rely on individual
          relationships won&apos;t scale.
        </p>
        <p className="text-lg">
          We need infrastructure that can grow with us—not just in capacity, but in capability. Systems that preserve
          our culture while enabling new levels of performance.
        </p>
      </div>
    ),
  },
  {
    id: "introducing-hb-intel",
    title: "Introducing HB Intel",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          HB Intel is our integrated platform for project lifecycle management—from initial pursuit through final
          warranty.
        </p>
        <p className="text-lg">
          It includes modules for estimating, project management, financial tracking, field operations, quality control,
          and business intelligence—all designed to work together as a unified system.
        </p>
        <p className="text-lg">
          But the real value isn&apos;t in the features—it&apos;s in the continuity. Every decision, every lesson
          learned, every improvement flows seamlessly from one phase to the next.
        </p>
      </div>
    ),
  },
  {
    id: "architecture-vision",
    title: "Our Architecture Vision",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          HB Intel is built cloud-first, with API-based integration that lets us connect with the tools we need while
          maintaining control over our core processes.
        </p>
        <p className="text-lg">
          Automated backups and redundant systems ensure our data is always secure and accessible. Role-based access
          keeps sensitive information protected while enabling collaboration.
        </p>
        <p className="text-lg">
          Most importantly, it&apos;s designed to evolve with us. As we grow and our needs change, HB Intel
          adapts—without losing the continuity that makes it valuable.
        </p>
      </div>
    ),
  },
  {
    id: "what-happens-next",
    title: "What Happens Next",
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          HB Intel isn&apos;t just about better software—it&apos;s about positioning ourselves for the next phase of our
          success.
        </p>
        <p className="text-lg">
          Implementation begins with pilot projects and gradual rollout, ensuring we maintain operations while building
          the systems that will define our future.
        </p>
        <p className="text-lg">
          Your leadership and adoption of HB Intel will determine whether we simply get bigger, or whether we become the
          industry standard for how construction companies should operate.
        </p>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default slides
