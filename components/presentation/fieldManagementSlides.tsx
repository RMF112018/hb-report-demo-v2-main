/**
 * @fileoverview Field Management Slides Component
 * @module fieldManagementSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive slides for field management tools and operations
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Building2,
  Calendar,
  AlertTriangle,
  Shield,
  ClipboardList,
  Package,
  Brain,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  Activity,
  Target,
  Zap,
  GitBranch,
  Eye,
  Settings,
  Monitor,
  FileText,
  MapPin,
  Wrench,
} from "lucide-react"

export interface FieldManagementSlide {
  id: string
  title: string
  content: React.ReactNode
}

export const fieldManagementSlides: FieldManagementSlide[] = [
  {
    id: "overview",
    title: "Field Management Overview",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Building2 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Field Management</strong> transforms construction operations by providing{" "}
            <strong>unified tools for scheduling, constraints, permits, and reporting</strong>
            that eliminate scattered spreadsheets and manual processes across your project sites.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of juggling multiple disconnected tools and paper forms,{" "}
            <strong>HB's integrated field management system</strong> streamlines every aspect of field operations from
            procurement to daily reporting in one centralized platform.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Integrated Operations</div>
              <div className="text-xs text-blue-200">Unified field management vs scattered tools</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Real-Time Visibility</div>
              <div className="text-xs text-blue-200">Live field updates and instant reporting</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Streamlined Workflows</div>
              <div className="text-xs text-blue-200">Automated processes for maximum efficiency</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "procurement",
    title: "Procurement Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Package className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-green-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Procurement Management</strong> centralizes all procurement activities by providing{" "}
            <strong>commitment tracking, vendor management, and Procore integration</strong>
            that eliminates manual procurement processes and ensures complete visibility into project spending.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing procurement through separate systems and spreadsheets,{" "}
            <strong>HB's procurement system integrates seamlessly with Procore</strong>, providing real-time commitment
            tracking and intelligent procurement insights that drive better decision-making.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Commitment Tracking</div>
              <div className="text-xs text-green-200">Real-time procurement commitments and spending</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Procore Integration</div>
              <div className="text-xs text-green-200">Seamless synchronization with Procore systems</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🧠</div>
              <div className="font-medium text-white">AI Insights</div>
              <div className="text-xs text-green-200">Intelligent procurement analytics and recommendations</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "scheduler",
    title: "Project Scheduler",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Calendar className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-purple-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Project Scheduler</strong> revolutionizes project timeline management by providing{" "}
            <strong>integrated scheduling, look-ahead planning, and real-time updates</strong>
            that keep projects on track and stakeholders informed across all project phases.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing schedules through static documents and manual updates,{" "}
            <strong>HB's dynamic scheduling system</strong> provides real-time Gantt charts, automated look-ahead
            planning, and comprehensive schedule analysis that drives proactive project management.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Dynamic Scheduling</div>
              <div className="text-xs text-purple-200">Real-time Gantt charts and timeline management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔮</div>
              <div className="font-medium text-white">Look-Ahead Planning</div>
              <div className="text-xs text-purple-200">Automated multi-week planning and forecasting</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Schedule Analysis</div>
              <div className="text-xs text-purple-200">Comprehensive progress tracking and variance analysis</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "constraints-log",
    title: "Constraints Log Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <AlertTriangle className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-red-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Constraints Log Management</strong> transforms issue tracking by providing{" "}
            <strong>centralized constraint logging, resolution tracking, and timeline visualization</strong>
            that ensures no project obstacles slip through the cracks or delay completion.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-red-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of tracking constraints through scattered emails and informal notes,{" "}
            <strong>HB's constraint management system</strong> provides comprehensive logging, automated escalation, and
            visual timeline tracking that drives faster resolution and better project outcomes.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🚨</div>
              <div className="font-medium text-white">Issue Tracking</div>
              <div className="text-xs text-red-200">Centralized constraint logging and categorization</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Resolution Management</div>
              <div className="text-xs text-red-200">Automated workflow and escalation processes</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Timeline Visualization</div>
              <div className="text-xs text-red-200">Visual constraint timeline and impact analysis</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "permit-log",
    title: "Permit Log & Inspection Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-cyan-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Permit Log & Inspection Management</strong> streamlines regulatory compliance by providing{" "}
            <strong>permit tracking, inspection scheduling, and calendar integration</strong>
            that ensures all regulatory requirements are met on time and within compliance standards.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-cyan-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing permits through paper files and manual tracking,{" "}
            <strong>HB's permit management system</strong> provides automated tracking, inspection scheduling, and
            regulatory compliance monitoring that prevents costly delays and violations.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Permit Tracking</div>
              <div className="text-xs text-cyan-200">Comprehensive permit status and deadline management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Inspection Management</div>
              <div className="text-xs text-cyan-200">Automated inspection scheduling and tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Calendar Integration</div>
              <div className="text-xs text-cyan-200">Visual permit and inspection calendar management</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "field-reports",
    title: "Field Reports & Documentation",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <ClipboardList className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-orange-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Field Reports & Documentation</strong> revolutionizes field documentation by providing{" "}
            <strong>digital daily logs, safety audits, and quality control tracking</strong>
            that eliminates paper forms and ensures complete project documentation and compliance.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing field reports through paper forms and manual data entry,{" "}
            <strong>HB's digital reporting system</strong> provides real-time data capture, automated compliance
            tracking, and comprehensive analytics that drive better field management decisions.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📝</div>
              <div className="font-medium text-white">Daily Logs</div>
              <div className="text-xs text-orange-200">Digital daily reporting and manpower tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🛡️</div>
              <div className="font-medium text-white">Safety Audits</div>
              <div className="text-xs text-orange-200">Comprehensive safety compliance and audit tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Quality Control</div>
              <div className="text-xs text-orange-200">Automated quality inspections and defect tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
]
