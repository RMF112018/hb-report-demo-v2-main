import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Shield,
  CheckCircle,
  FileText,
  Users,
  AlertTriangle,
  Activity,
  Search,
  BarChart,
  Wrench,
  Brain,
  Tag,
  Star,
  UserCheck,
  TrendingUp,
  Monitor,
  Zap,
  Bell,
  FileCheck,
} from "lucide-react"

export const complianceSlides: PresentationSlide[] = [
  {
    id: "compliance-overview",
    title: "Compliance Management Overview",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Unified compliance management</strong> across safety, quality, contract, and trade partner domains
            with <strong>integrated platform overlays</strong> for comprehensive project oversight.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Safety Management</h3>
              <p className="text-blue-200 text-xs">SiteMate platform integration</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Quality Control</h3>
              <p className="text-blue-200 text-xs">SiteMate quality inspections</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <FileText className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Contract Compliance</h3>
              <p className="text-blue-200 text-xs">HBI AI-powered analysis</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Trade Partner Management</h3>
              <p className="text-blue-200 text-xs">Compass compliance platform</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "sitemate-safety",
    title: "SiteMate Safety Management System",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>SiteMate platform overlay</strong> providing real-time safety inspection data and field monitoring
            capabilities with <strong>live aggregation</strong> of completed safety tasks.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Field Safety Inspections</h3>
              <p className="text-blue-200 text-xs">Mobile platform with real-time data capture</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Activity className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Real-Time Monitoring</h3>
              <p className="text-blue-200 text-xs">Live aggregation of completed tasks</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Compliance Tracking</h3>
              <p className="text-blue-200 text-xs">Automated verification through SiteMate</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <AlertTriangle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Incident Management</h3>
              <p className="text-blue-200 text-xs">Streamlined reporting with field data</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "sitemate-quality",
    title: "SiteMate Quality Control System",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        <CheckCircle className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>SiteMate quality control platform</strong> overlay aggregating field inspection data and providing{" "}
            <strong>real-time monitoring</strong> of quality tasks and inspections.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Search className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Quality Inspections</h3>
              <p className="text-blue-200 text-xs">Systematic inspections with mobile capture</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Task Monitoring</h3>
              <p className="text-blue-200 text-xs">Real-time task aggregation</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <BarChart className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Data Analytics</h3>
              <p className="text-blue-200 text-xs">Dashboard fed by SiteMate inspection data</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Wrench className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Corrective Actions</h3>
              <p className="text-blue-200 text-xs">Automated workflow for quality issues</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "hbi-contract",
    title: "HBI Contract Document Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        <FileText className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>AI-powered contract analysis</strong> and document management with{" "}
            <strong>intelligent risk assessment</strong> and automated compliance tracking.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Brain className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">AI Contract Analysis</h3>
              <p className="text-blue-200 text-xs">Automated review and risk identification</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Tag className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Smart Document Tagging</h3>
              <p className="text-blue-200 text-xs">Automated categorization and tagging</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <AlertTriangle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Risk Assessment</h3>
              <p className="text-blue-200 text-xs">Intelligent risk scoring and mitigation</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Compliance Tracking</h3>
              <p className="text-blue-200 text-xs">Automated monitoring of deliverables</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "compass-trade-partners",
    title: "Compass Trade Partner Compliance",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        <Users className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Compass compliance platform overlay</strong> providing ratings and pre-qualification assistance for{" "}
            <strong>informed procurement decision making</strong> during the bidding process.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Star className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Partner Ratings</h3>
              <p className="text-blue-200 text-xs">Comprehensive performance ratings</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <UserCheck className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Pre-Qualification Support</h3>
              <p className="text-blue-200 text-xs">Assist project teams in decisions</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Procurement Intelligence</h3>
              <p className="text-blue-200 text-xs">Real-time partner compliance data</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Risk Assessment</h3>
              <p className="text-blue-200 text-xs">Compass insights for compliance risks</p>
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
        <Monitor className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Executive dashboard</strong> providing unified compliance insights across all platforms with{" "}
            <strong>proactive monitoring</strong> and regulatory readiness.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Monitor className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Executive Dashboard</h3>
              <p className="text-blue-200 text-xs">Unified view across all platforms</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Zap className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Platform Integration</h3>
              <p className="text-blue-200 text-xs">Seamless SiteMate and Compass data flow</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Bell className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Proactive Alerts</h3>
              <p className="text-blue-200 text-xs">Real-time compliance notifications</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <FileCheck className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Regulatory Readiness</h3>
              <p className="text-blue-200 text-xs">Comprehensive audit trail preparation</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default complianceSlides
