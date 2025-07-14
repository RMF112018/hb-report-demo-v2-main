import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Building,
  Users,
  Target,
  Award,
  GitBranch,
  Database,
  Brain,
  Star,
} from "lucide-react"

export const hbIntelPitchSlides: PresentationSlide[] = [
  {
    id: "executive-summary",
    title: "HB Intel Platform: Strategic Technology Investment",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Building className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="w-5 h-5 text-red-300" />
              <span className="text-red-200 font-medium">Current Challenge</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto mb-6">
              <strong>65% of executives report inconsistent KPIs</strong> due to disconnected systems across Procore,
              Sage, SharePoint, and specialized tools
            </p>
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-green-200 font-medium">Strategic Solution</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto">
              <strong>HB Intel unified analytics platform</strong> delivers real-time insights without disrupting
              existing workflows
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-10 h-10 text-green-300" />
              <h3 className="text-white font-bold text-lg">1,569%</h3>
              <p className="text-blue-200 text-sm">10-Year ROI</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Clock className="w-10 h-10 text-blue-300" />
              <h3 className="text-white font-bold text-lg">&lt;12 Mo</h3>
              <p className="text-blue-200 text-sm">Payback Period</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-10 h-10 text-purple-300" />
              <h3 className="text-white font-bold text-lg">20%</h3>
              <p className="text-blue-200 text-sm">Productivity Gain</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-10 h-10 text-yellow-300" />
              <h3 className="text-white font-bold text-lg">15%</h3>
              <p className="text-blue-200 text-sm">Overrun Reduction</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "solution-overview",
    title: "HB Intel: Unified Analytics Without Disruption",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Zap className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Vendor-agnostic overlay</strong> integrates Procore, Sage, SharePoint, Compass, Autodesk, Unanet,
            and SiteMate via APIs while <strong>preserving existing workflows</strong>
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Database className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Unified Data Layer</h3>
              <p className="text-blue-200 text-xs">25-30% faster data retrieval</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Role-Based Dashboards</h3>
              <p className="text-blue-200 text-xs">Executive, PM, Estimator views</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Brain className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">AI-Powered Insights</h3>
              <p className="text-blue-200 text-xs">Natural language queries</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Real-Time Analytics</h3>
              <p className="text-blue-200 text-xs">Decision latency &lt;1 hour</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Cross-System Correlation</h3>
              <p className="text-blue-200 text-xs">Schedule + Budget + Field data</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Clock className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Productivity Gains</h3>
              <p className="text-blue-200 text-xs">10 hours/week saved per user</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-white font-semibold text-lg mb-2">Key Differentiator</h3>
            <p className="text-blue-200">
              <strong>Faster deployment (6-9 months vs 12-18)</strong> with no workflow disruption - ideal for Florida
              firms avoiding system overhauls
            </p>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "vendor-comparison",
    title: "Vendor Analysis: Why Andersen is the Strategic Choice",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Award className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* FireArt Studio */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">FireArt Studio</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-yellow-300 text-sm">4.9/5</span>
                </div>
              </div>
              <div className="text-left space-y-2">
                <p className="text-green-300 text-sm">✓ Most cost-effective ($439K)</p>
                <p className="text-green-300 text-sm">✓ Strong UI/UX focus</p>
                <p className="text-green-300 text-sm">✓ Agile methodology</p>
                <p className="text-red-300 text-sm">✗ Limited construction expertise</p>
                <p className="text-red-300 text-sm">✗ Scalability concerns</p>
              </div>
            </div>

            {/* Chetu Inc */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Chetu Inc</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-yellow-300 text-sm">4.9/5</span>
                </div>
              </div>
              <div className="text-left space-y-2">
                <p className="text-green-300 text-sm">✓ Large workforce & scalability</p>
                <p className="text-green-300 text-sm">✓ Security & QA focus</p>
                <p className="text-green-300 text-sm">✓ Industry partnerships</p>
                <p className="text-red-300 text-sm">✗ Generic proposal approach</p>
                <p className="text-red-300 text-sm">✗ Mixed management reviews</p>
              </div>
            </div>

            {/* Andersen - Recommended */}
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg p-6 backdrop-blur-sm border-2 border-green-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-white font-bold text-lg">Andersen</h3>
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">RECOMMENDED</div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-yellow-300 text-sm">4.9/5</span>
                </div>
              </div>
              <div className="text-left space-y-2">
                <p className="text-green-300 text-sm">✓ Direct construction expertise</p>
                <p className="text-green-300 text-sm">✓ Enterprise clients (Siemens, S&P)</p>
                <p className="text-green-300 text-sm">✓ AI/Power BI specialization</p>
                <p className="text-green-300 text-sm">✓ Comprehensive Discovery phase</p>
                <p className="text-blue-200 text-sm">• Higher upfront investment</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-white font-semibold text-lg mb-2">Strategic Recommendation</h3>
            <p className="text-blue-200">
              <strong>Andersen's construction software specialization</strong> and enterprise-grade experience with
              companies like Siemens and S&P Global makes them the{" "}
              <strong>most aligned for HB Intel's analytics requirements</strong>
            </p>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "financial-impact",
    title: "Financial Impact: Exceptional ROI with Rapid Payback",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <DollarSign className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Investment */}
            <div className="bg-red-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                10-Year Investment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Initial Setup (Discovery)</span>
                  <span className="text-white font-semibold">$1.0M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Annual Maintenance</span>
                  <span className="text-white font-semibold">$200K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Risk Buffer (10%)</span>
                  <span className="text-white font-semibold">$300K</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between">
                    <span className="text-red-200 font-semibold">Total Investment</span>
                    <span className="text-red-200 font-bold text-xl">$3.3M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                10-Year Returns
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Efficiency Gains (82 users)</span>
                  <span className="text-white font-semibold">$42.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Faster Decisions</span>
                  <span className="text-white font-semibold">$2.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Rework Avoidance</span>
                  <span className="text-white font-semibold">$19.1M</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between">
                    <span className="text-green-200 font-semibold">Total Benefits</span>
                    <span className="text-green-200 font-bold text-xl">$63.8M</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-2xl mb-2">1,569%</h3>
              <p className="text-blue-200">Risk-Adjusted ROI</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-2xl mb-2">&lt;12 Mo</h3>
              <p className="text-blue-200">Payback Period</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-2xl mb-2">$33M</h3>
              <p className="text-blue-200">Net Present Value</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "implementation-timeline",
    title: "Implementation Roadmap: 18-Month Strategic Deployment",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <GitBranch className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Phase 1 */}
            <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Phase 1: Foundation</h3>
              <div className="text-left space-y-2">
                <p className="text-blue-200 text-sm font-semibold">Q3-Q4 2025 (Months 1-4)</p>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Map legacy systems</li>
                  <li>• Complete Discovery workshops</li>
                  <li>• Pilot on 2 multifamily projects</li>
                  <li>• Train 50 initial users</li>
                </ul>
                <div className="bg-blue-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">KPI: 85% data integration</p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Phase 2: Integration</h3>
              <div className="text-left space-y-2">
                <p className="text-green-200 text-sm font-semibold">Q1-Q3 2026 (Months 5-10)</p>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>• Connect all systems via APIs</li>
                  <li>• Deploy AI copilots for KPIs</li>
                  <li>• Expand to 5 active projects</li>
                  <li>• Dashboard rollout</li>
                </ul>
                <div className="bg-green-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">KPI: &lt;12hr reporting latency</p>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-purple-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Phase 3: Intelligence</h3>
              <div className="text-left space-y-2">
                <p className="text-purple-200 text-sm font-semibold">Q4 2026-Q1 2027 (Months 11-18)</p>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• Scale predictive analytics</li>
                  <li>• Full field team adoption</li>
                  <li>• ESG reporting capabilities</li>
                  <li>• Advanced AI insights</li>
                </ul>
                <div className="bg-purple-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">KPI: 20% productivity gain</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-white font-semibold text-lg mb-4">Immediate Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-orange-200 font-semibold">August 2025</p>
                <p className="text-orange-200 text-sm">Launch Discovery Phase</p>
              </div>
              <div>
                <p className="text-orange-200 font-semibold">$500K</p>
                <p className="text-orange-200 text-sm">Secure Initial Funding</p>
              </div>
              <div>
                <p className="text-orange-200 font-semibold">COO Champion</p>
                <p className="text-orange-200 text-sm">Form Cross-Functional Team</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "alternative-analysis",
    title: "Why HB Intel Wins vs. Off-the-Shelf Alternatives",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Off-the-Shelf Alternative */}
            <div className="bg-red-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Off-the-Shelf Alternative</h3>
              <div className="text-left space-y-3">
                <div className="border-b border-white/20 pb-2">
                  <p className="text-red-200 font-semibold">SmartPM + Procore Analytics + Power BI</p>
                  <p className="text-red-200 text-sm">$97K/year recurring</p>
                </div>
                <div className="space-y-2">
                  <p className="text-red-300 text-sm">✗ Vendor dependency & lock-in</p>
                  <p className="text-red-300 text-sm">✗ Limited cross-platform integration</p>
                  <p className="text-red-300 text-sm">✗ No custom offline capabilities</p>
                  <p className="text-red-300 text-sm">✗ Manual ETL required (+20-30% costs)</p>
                  <p className="text-red-300 text-sm">✗ Requires BI Analyst ($88K/year)</p>
                </div>
                <div className="bg-red-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">Total: $185K+/year ongoing</p>
                </div>
              </div>
            </div>

            {/* HB Intel Custom Solution */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm border-2 border-green-400/30">
              <h3 className="text-white font-bold text-lg mb-4">HB Intel Custom Platform</h3>
              <div className="text-left space-y-3">
                <div className="border-b border-white/20 pb-2">
                  <p className="text-green-200 font-semibold">Unified Analytics Overlay</p>
                  <p className="text-green-200 text-sm">$330K total investment</p>
                </div>
                <div className="space-y-2">
                  <p className="text-green-300 text-sm">✓ Complete data ownership</p>
                  <p className="text-green-300 text-sm">✓ Unified cross-platform integration</p>
                  <p className="text-green-300 text-sm">✓ Custom offline/modular features</p>
                  <p className="text-green-300 text-sm">✓ Superior long-term ROI</p>
                  <p className="text-green-300 text-sm">✓ Turnkey solution with support</p>
                </div>
                <div className="bg-green-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">1,569% ROI over 10 years</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-white font-semibold text-lg mb-4">Strategic Advantage</h3>
            <p className="text-blue-200 text-base">
              <strong>HB Intel delivers superior customization and ownership</strong> while off-the-shelf solutions
              provide quicker deployment but create{" "}
              <strong>vendor dependency and limited cross-platform unification</strong>
            </p>
          </motion.div>

          <motion.div
            className="mt-6 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-lg p-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-white font-bold text-lg">
              Recommendation: Proceed with HB Intel development through Andersen
            </p>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default hbIntelPitchSlides
