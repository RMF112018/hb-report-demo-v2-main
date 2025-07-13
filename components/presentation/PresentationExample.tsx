/**
 * @fileoverview Example Usage of Presentation Carousel
 * @module PresentationExample
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Demonstrates how to use the PresentationCarousel component
 * with sample slides for HB Report Demo presentations.
 */

"use client"

import React from "react"
import { PresentationCarousel, type PresentationSlide } from "./PresentationCarousel"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  BarChart3,
  Users,
  Shield,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  CheckCircle,
} from "lucide-react"

export const PresentationExample: React.FC = () => {
  const sampleSlides: PresentationSlide[] = [
    {
      id: "welcome",
      title: "Welcome to HB Report",
      content: (
        <div className="space-y-6">
          <p className="text-xl lg:text-2xl">The next generation of construction analytics and project management</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              <Building2 className="h-4 w-4 mr-2" />
              Project Management
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Real-time Analytics
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Enterprise Security
            </Badge>
          </div>
        </div>
      ),
      backgroundGradient: "linear-gradient(135deg, #003087 0%, #1e3a8a 50%, #1e40af 100%)",
    },
    {
      id: "analytics",
      title: "Powerful Analytics",
      content: (
        <div className="space-y-6">
          <p className="text-xl lg:text-2xl">
            Real-time insights that drive smarter decisions across your entire portfolio
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-2xl p-6 mb-3">
                <BarChart3 className="h-8 w-8 mx-auto text-white" />
              </div>
              <p className="text-sm font-medium">Performance Tracking</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-2xl p-6 mb-3">
                <DollarSign className="h-8 w-8 mx-auto text-white" />
              </div>
              <p className="text-sm font-medium">Cost Management</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-2xl p-6 mb-3">
                <Calendar className="h-8 w-8 mx-auto text-white" />
              </div>
              <p className="text-sm font-medium">Schedule Optimization</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-2xl p-6 mb-3">
                <Target className="h-8 w-8 mx-auto text-white" />
              </div>
              <p className="text-sm font-medium">Risk Mitigation</p>
            </div>
          </div>
        </div>
      ),
      backgroundGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
    },
    {
      id: "collaboration",
      title: "Team Collaboration",
      content: (
        <div className="space-y-6">
          <p className="text-xl lg:text-2xl">Seamless coordination across all project stakeholders and teams</p>
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full p-8 mb-4">
                <Users className="h-12 w-12 mx-auto text-white" />
              </div>
              <p className="text-lg font-semibold">30%</p>
              <p className="text-sm opacity-80">Better Communication</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full p-8 mb-4">
                <Zap className="h-12 w-12 mx-auto text-white" />
              </div>
              <p className="text-lg font-semibold">5+ hrs</p>
              <p className="text-sm opacity-80">Time Saved Weekly</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full p-8 mb-4">
                <TrendingUp className="h-12 w-12 mx-auto text-white" />
              </div>
              <p className="text-lg font-semibold">20%</p>
              <p className="text-sm opacity-80">Productivity Increase</p>
            </div>
          </div>
        </div>
      ),
      backgroundGradient: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
    },
    {
      id: "results",
      title: "Proven Results",
      content: (
        <div className="space-y-6">
          <p className="text-xl lg:text-2xl">Construction teams nationwide trust HB Report to deliver results</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">99.9%</div>
              <p className="text-lg opacity-80">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">10%</div>
              <p className="text-lg opacity-80">Reduced Project Delays</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">SOC 2</div>
              <p className="text-lg opacity-80">Security Compliant</p>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">Enterprise Grade</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">Cloud Native</span>
            </div>
          </div>
        </div>
      ),
      backgroundGradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
    },
    {
      id: "cta",
      title: "Ready to Transform Your Projects?",
      content: (
        <div className="space-y-6">
          <p className="text-xl lg:text-2xl">
            Experience the future of construction management with HB Report's comprehensive platform
          </p>
          <div className="text-center mt-8">
            <p className="text-lg opacity-90 mb-6">
              Join thousands of construction professionals who have revolutionized their project delivery
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-300">500+</div>
                <p className="text-sm opacity-80">Active Projects</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-300">50+</div>
                <p className="text-sm opacity-80">Construction Teams</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-300">$2B+</div>
                <p className="text-sm opacity-80">Projects Managed</p>
              </div>
            </div>
          </div>
        </div>
      ),
      backgroundGradient: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)",
      isFinalSlide: true,
    },
  ]

  const handleComplete = () => {
    console.log("Presentation completed!")
  }

  return (
    <PresentationCarousel
      slides={sampleSlides}
      onComplete={handleComplete}
      autoPlay={false} // Set to true for auto-advance
      autoPlayInterval={7000} // 7 seconds per slide
    />
  )
}

export default PresentationExample
