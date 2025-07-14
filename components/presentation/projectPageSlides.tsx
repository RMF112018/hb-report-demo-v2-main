/**
 * @fileoverview Project Page Presentation Slide Definitions
 * @module ProjectPageSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Project Page presentation.
 * Introduces users to the unified project workspace and its capabilities.
 */

import React from "react"
import { PresentationSlide } from "./PresentationCarousel"
import { Building, Layers, Users, Target, Zap, Eye, ArrowRight, CheckCircle, Sparkles } from "lucide-react"

export const projectPageSlides: PresentationSlide[] = [
  {
    id: "project-page-overview",
    title: "Project Page Overview",
    content: (
      <div className="space-y-3 py-1">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
            <Building className="h-8 w-8 text-blue-300" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">One Workspace for Everything</h2>
          <p className="text-base lg:text-lg text-white/90 leading-relaxed">
            This central hub organizes every project activity—from preconstruction to closeout—into an elegant, modular
            workspace.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-sm lg:text-base text-white/90 leading-relaxed">
            The Project Page is designed to offer total visibility, with structured views for financials, procurement,
            staffing, and field performance—all customized per role.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-sm lg:text-base text-white/90 leading-relaxed">
            Whether you're a Project Manager, Executive, Estimator, or Coordinator, this page connects every team and
            tool.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
            <div className="flex items-start space-x-2">
              <Layers className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white text-xs">Unifies all project tools and insights</h3>
                <p className="text-xs text-white/80">into one location</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
            <div className="flex items-start space-x-2">
              <ArrowRight className="h-4 w-4 text-green-300 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white text-xs">Enables seamless transitions</h3>
                <p className="text-xs text-white/80">between phases of work</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
            <div className="flex items-start space-x-2">
              <Users className="h-4 w-4 text-purple-300 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white text-xs">Context-aware tabs</h3>
                <p className="text-xs text-white/80">provide the right features to the right people</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
            <div className="flex items-start space-x-2">
              <Zap className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white text-xs">
                  Optimized for speed, visibility, and decision-making
                </h3>
                <p className="text-xs text-white/80">with HBI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-xl mx-auto mt-2 w-full">
          <div className="flex items-center justify-center mb-2">
            <Building className="h-6 w-6 text-blue-300 mr-2" />
            <h3 className="text-lg font-bold text-blue-300">Your Project Command Center</h3>
          </div>
          <p className="text-base text-white/90 mb-2">
            <strong>Unified workspace. Intelligent insights. Built for project excellence.</strong>
          </p>
          <div className="flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
            <span className="text-sm font-bold text-yellow-300">Ready to explore your project's complete story</span>
          </div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]
