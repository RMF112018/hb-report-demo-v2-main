/**
 * @fileoverview Compliance Tab Presentation Slide Definitions
 * @module complianceSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive slides for compliance management tools and operations
 */

import { motion } from "framer-motion"
import { Shield, CheckCircle, FileText, Users, AlertTriangle, ClipboardList, Bot, Award } from "lucide-react"
import { PresentationSlide } from "./PresentationCarousel"

export const complianceSlides: PresentationSlide[] = [
  {
    id: "compliance-overview",
    title: "Compliance Management Overview",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-green-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Compliance Management</strong> centralizes all safety, quality, contract, and trade partner
            compliance by providing{" "}
            <strong>integrated monitoring, automated reporting, and proactive risk management</strong> that ensures
            regulatory adherence and operational excellence across all project phases.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing compliance through scattered spreadsheets and manual processes,{" "}
            <strong>HB's unified compliance platform</strong> provides real-time monitoring, automated alerts, and
            comprehensive reporting that transforms compliance from reactive to proactive management.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🛡️</div>
              <div className="font-medium text-white">Unified Compliance</div>
              <div className="text-xs text-green-200">Centralized safety, quality, and contract management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Real-Time Monitoring</div>
              <div className="text-xs text-green-200">Automated alerts and proactive risk management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Regulatory Adherence</div>
              <div className="text-xs text-green-200">Comprehensive reporting and audit trails</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "safety-management",
    title: "Safety Management System",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Safety Management System</strong> provides comprehensive safety oversight through{" "}
            <strong>
              safety programs, inspections, training, incident management, hazard identification, and PPE tracking
            </strong>{" "}
            that ensures zero-incident project execution and regulatory compliance.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform safety management from reactive incident response to proactive hazard prevention with{" "}
            <strong>94.5% training compliance, 47 days without incidents, and 98.2% PPE compliance</strong> through
            integrated safety programs and real-time monitoring.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🦺</div>
              <div className="font-medium text-white">Safety Programs</div>
              <div className="text-xs text-blue-200">Comprehensive safety management and procedures</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Inspections & Training</div>
              <div className="text-xs text-blue-200">Scheduled inspections and certification tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚠️</div>
              <div className="font-medium text-white">Incident Management</div>
              <div className="text-xs text-blue-200">Hazard identification and PPE compliance monitoring</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "quality-control",
    title: "Quality Control System",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <CheckCircle className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-purple-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>AI-Powered Quality Control System</strong> ensures project excellence through{" "}
            <strong>
              automated QC programs, comprehensive inspections, material testing, and corrective action management
            </strong>{" "}
            that maintains 91.2% quality scores and proactive non-conformance resolution.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            HB's Quality Control platform generates{" "}
            <strong>
              AI-driven QC programs, tracks 156 inspections with 91.2% pass rates, manages 67 material tests, and
              provides real-time non-conformance tracking
            </strong>{" "}
            that transforms quality management from reactive to predictive excellence.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">AI QC Programs</div>
              <div className="text-xs text-purple-200">Automated quality control program generation</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔬</div>
              <div className="font-medium text-white">Testing & Inspections</div>
              <div className="text-xs text-purple-200">Material testing and comprehensive inspections</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Corrective Actions</div>
              <div className="text-xs text-purple-200">Non-conformance tracking and resolution management</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "contract-documents",
    title: "Contract Document Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <FileText className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-orange-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>HBI AI-Powered Contract Document Management</strong> revolutionizes contract compliance through{" "}
            <strong>
              intelligent document analysis, automated risk assessment, and integrated responsibility tracking
            </strong>{" "}
            that ensures 94% compliance rates and proactive contract management.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our proprietary HBI engine analyzes{" "}
            <strong>
              247 contract documents with 156 AI-generated insights, 234 tagged sections, and 45 active responsibility
              tasks
            </strong>{" "}
            while automatically linking contract terms to project schedules, procurement, and quality requirements.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🧠</div>
              <div className="font-medium text-white">HBI AI Analysis</div>
              <div className="text-xs text-orange-200">Intelligent contract review and risk assessment</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🏷️</div>
              <div className="font-medium text-white">Smart Tagging</div>
              <div className="text-xs text-orange-200">Automated section tagging and organization</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔗</div>
              <div className="font-medium text-white">Component Integration</div>
              <div className="text-xs text-orange-200">Responsibility matrix and project component linking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "trade-partner-scorecard",
    title: "Trade Partner Compliance",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Users className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-indigo-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Trade Partner Compliance Scorecard</strong> provides comprehensive partner management through{" "}
            <strong>performance tracking, certification monitoring, and compliance verification</strong> that ensures
            only qualified, compliant partners work on your projects.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-indigo-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Real-time partner scorecards track{" "}
            <strong>performance metrics, safety compliance, insurance status, and certification renewals</strong> with
            automated alerts and comprehensive reporting that eliminates compliance gaps and ensures partner
            accountability.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Performance Metrics</div>
              <div className="text-xs text-indigo-200">Real-time scorecards and trend analysis</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🏆</div>
              <div className="font-medium text-white">Certification Tracking</div>
              <div className="text-xs text-indigo-200">Automated renewal alerts and compliance monitoring</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔒</div>
              <div className="font-medium text-white">Compliance Verification</div>
              <div className="text-xs text-indigo-200">Insurance, licensing, and safety compliance tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "integrated-reporting",
    title: "Integrated Compliance Reporting",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <ClipboardList className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-red-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Integrated Compliance Reporting</strong> provides executive-level visibility through{" "}
            <strong>consolidated safety, quality, contract, and partner compliance reports</strong> that transform
            scattered compliance data into actionable business intelligence.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-red-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Automated compliance dashboards aggregate data across all compliance domains, providing{" "}
            <strong>real-time alerts, trend analysis, and predictive insights</strong> that enable proactive compliance
            management and regulatory readiness.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Executive Dashboards</div>
              <div className="text-xs text-red-200">Consolidated compliance visibility and KPIs</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔔</div>
              <div className="font-medium text-white">Proactive Alerts</div>
              <div className="text-xs text-red-200">Automated notifications and risk warnings</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Regulatory Readiness</div>
              <div className="text-xs text-red-200">Audit trails and compliance documentation</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default complianceSlides
