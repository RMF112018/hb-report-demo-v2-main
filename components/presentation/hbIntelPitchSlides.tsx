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
  Globe,
  Gauge,
  Factory,
  Calculator,
  LineChart,
  ArrowUpRight,
  Briefcase,
  Settings,
  FileText,
  Activity,
  Layers,
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
            <div className="inline-flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-green-200 font-medium">Viability Score: 92/100</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto mb-6">
              Construction productivity has <strong>stagnated for decades</strong> while other industries surge ahead.
              <strong>65% of contractors now use AI/ML</strong>, creating a strategic imperative for digital
              transformation.
            </p>
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full mb-4">
              <Target className="w-5 h-5 text-blue-300" />
              <span className="text-blue-200 font-medium">Path to $1B Revenue by 2032-2035</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto">
              <strong>HB Intel unified analytics platform</strong> positions HBC for &gt;10% annual growth through
              AI-driven efficiency gains and operational excellence
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
              <h3 className="text-white font-bold text-lg">259%</h3>
              <p className="text-blue-200 text-sm">5-Year IRR</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calculator className="w-10 h-10 text-blue-300" />
              <h3 className="text-white font-bold text-lg">$7.3M</h3>
              <p className="text-blue-200 text-sm">Net Present Value</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-10 h-10 text-purple-300" />
              <h3 className="text-white font-bold text-lg">15%</h3>
              <p className="text-blue-200 text-sm">Productivity Gains</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-10 h-10 text-yellow-300" />
              <h3 className="text-white font-bold text-lg">$1M</h3>
              <p className="text-blue-200 text-sm">Annual Claims Savings</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "industry-context",
    title: "Construction Industry: Ready for Digital Transformation",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Factory className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-300" />
              <span className="text-orange-200 font-medium">Industry Disruption Opportunity</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto mb-6">
              Construction productivity has <strong>remained stagnant while other industries surge</strong>. McKinsey
              estimates <strong>$1.6T value potential</strong> if construction matches economy-wide productivity.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-red-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <Gauge className="w-6 h-6 mr-2" />
                Market Conditions
              </h3>
              <div className="text-left space-y-2">
                <p className="text-red-200 text-sm">• FMI Sentiment Index: 54 (cautious optimism)</p>
                <p className="text-red-200 text-sm">• 382K monthly job openings</p>
                <p className="text-red-200 text-sm">• 8.3M job shortage projected</p>
                <p className="text-red-200 text-sm">• 41% workforce retiring by 2031</p>
              </div>
            </div>

            <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <LineChart className="w-6 h-6 mr-2" />
                Growth Outlook
              </h3>
              <div className="text-left space-y-2">
                <p className="text-blue-200 text-sm">• 3.8% total construction growth forecast</p>
                <p className="text-blue-200 text-sm">• 8.6% starts increase predicted 2025</p>
                <p className="text-blue-200 text-sm">• Infrastructure investments (IIJA)</p>
                <p className="text-blue-200 text-sm">• Moderate growth with supportive policy</p>
              </div>
            </div>

            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                AI Adoption Surge
              </h3>
              <div className="text-left space-y-2">
                <p className="text-green-200 text-sm">• 65% contractors use AI/ML (2024)</p>
                <p className="text-green-200 text-sm">• 49% have AI fully integrated</p>
                <p className="text-green-200 text-sm">• Digital tools reduce delays 10-20%</p>
                <p className="text-green-200 text-sm">• 50-60% productivity potential</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-white font-semibold text-lg mb-2">Strategic Window</h3>
            <p className="text-blue-200">
              <strong>Perfect storm of talent shortages, growth opportunities, and AI adoption</strong> creates
              unprecedented opportunity for firms that deploy intelligent analytics platforms.
            </p>
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
    title: "Vendor Comparison: Capabilities, Costs, and Fit",
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
              <div className="mb-4 text-left">
                <h3 className="text-white font-bold text-lg">Fireart Studio</h3>
                <p className="text-gray-300 text-sm">4.9/5 (38 reviews)</p>
              </div>
              <div className="text-left space-y-2">
                <p className="text-green-300 text-sm">✓ Role model in UI/UX, creativity, visual polish</p>
                <p className="text-green-300 text-sm">✓ Punctual, secure, well-managed projects</p>
                <p className="text-green-300 text-sm">✓ Award-winning: top app developer, Clutch, Dribbble</p>
                <p className="text-blue-200 text-sm">• "Very creative ... think outside the box" feedback</p>
                <p className="text-red-300 text-sm">✗ Minor QA process improvements noted</p>
              </div>
            </div>

            {/* Chetu Inc */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="mb-4 text-left">
                <h3 className="text-white font-bold text-lg">Chetu</h3>
                <p className="text-gray-300 text-sm">4.3/5 (80 reviews)</p>
              </div>
              <div className="text-left space-y-2">
                <p className="text-green-300 text-sm">✓ Strong at competitive, cost-effective dev outsourcing</p>
                <p className="text-green-300 text-sm">✓ Large global team (~1,000–9,999), deep tech coverage</p>
                <p className="text-green-300 text-sm">✓ Recognized regionally on Clutch/The Manifest</p>
                <p className="text-blue-200 text-sm">• Clients highlight affordability, good PM</p>
                <p className="text-red-300 text-sm">✗ Some communication/cultural consistency issues</p>
              </div>
            </div>

            {/* Andersen - Recommended */}
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg p-6 backdrop-blur-sm border-2 border-green-400/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold text-lg">Andersen</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                </div>
              </div>
              <div className="mb-4 text-left">
                <p className="text-gray-300 text-sm">4.9/5 (126 reviews)</p>
              </div>
              <div className="text-left space-y-2">
                <p className="text-green-300 text-sm">✓ Highly rated for quality, schedule, proactivity, flexibility</p>
                <p className="text-green-300 text-sm">✓ Competitive pricing ($50–99/hr), broad project scope</p>
                <p className="text-green-300 text-sm">✓ Certified (ISO 9001/27001), enterprise client base</p>
                <p className="text-green-300 text-sm">✓ Global recognition in top Clutch rankings</p>
                <p className="text-blue-200 text-sm">• Professional, well-documented quality delivery</p>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">RECOMMENDED</div>
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
    title: "Financial Model: 5-Year ROI Analysis",
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
                5-Year Investment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">MVP Development (Andersen)</span>
                  <span className="text-white font-semibold">$825K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Annual Maintenance</span>
                  <span className="text-white font-semibold">$250K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">5-Year Maintenance Total</span>
                  <span className="text-white font-semibold">$1.25M</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between">
                    <span className="text-red-200 font-semibold">Total Investment</span>
                    <span className="text-red-200 font-bold text-xl">$2.075M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                5-Year Annual Benefits
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Productivity Gains (15%)</span>
                  <span className="text-white font-semibold">$1.14M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Claims Mitigation</span>
                  <span className="text-white font-semibold">$1.00M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">License Savings</span>
                  <span className="text-white font-semibold">$247K</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between">
                    <span className="text-green-200 font-semibold">Net Annual Cash Flow</span>
                    <span className="text-green-200 font-bold text-xl">$2.14M</span>
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
              <h3 className="text-white font-bold text-2xl mb-2">259%</h3>
              <p className="text-blue-200">Internal Rate of Return</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-2xl mb-2">$7.3M</h3>
              <p className="text-blue-200">Net Present Value</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-2xl mb-2">80 Users</h3>
              <p className="text-blue-200">Target Deployment</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "operational-impact",
    title: "Operational Impact: Transforming Construction Workflows",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Activity className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full mb-4">
              <Settings className="w-5 h-5 text-blue-300" />
              <span className="text-blue-200 font-medium">Measurable Performance Improvements</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto mb-6">
              HB Intel delivers <strong>quantifiable operational improvements</strong> across preconstruction,
              execution, and warranty phases through AI-driven workflows.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Time Savings */}
            <div className="bg-green-500/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Time Savings &amp; Efficiency
              </h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Administrative Tasks</span>
                  <span className="text-green-300 font-semibold text-sm">20-30% reduction</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">RFI Turnaround</span>
                  <span className="text-green-300 font-semibold text-sm">30-50% faster</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Resource Planning</span>
                  <span className="text-green-300 font-semibold text-sm">15-20% accuracy gain</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Data Retrieval</span>
                  <span className="text-green-300 font-semibold text-sm">25-30% faster</span>
                </div>
              </div>
            </div>

            {/* Risk Reduction */}
            <div className="bg-red-500/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Risk Mitigation
              </h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Rework Reduction</span>
                  <span className="text-orange-300 font-semibold text-sm">10-15% decrease</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Schedule Delays</span>
                  <span className="text-orange-300 font-semibold text-sm">15-25% mitigation</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Claims &amp; Disputes</span>
                  <span className="text-orange-300 font-semibold text-sm">$1M annual savings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Safety Incidents</span>
                  <span className="text-orange-300 font-semibold text-sm">Enhanced monitoring</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                RFI Processing
              </h3>
              <p className="text-blue-200 text-xs">From 7-10 days industry average to &lt;5 days with AI drafting</p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                System Integration
              </h3>
              <p className="text-blue-200 text-xs">Unified data from Procore, Sage, SharePoint, and field systems</p>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Productivity Gains
              </h3>
              <p className="text-blue-200 text-xs">15% overall productivity improvement across 80-user deployment</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "adoption-strategy",
    title: "Adoption Strategy: Mitigating Organizational Risk",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Users className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full mb-4">
              <Briefcase className="w-5 h-5 text-green-300" />
              <span className="text-green-200 font-medium">80% Target Adoption Rate</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto mb-6">
              Strategic change management approach addresses the <strong>65% AI comfort level</strong> in construction
              while leveraging HBC's <strong>250-employee scale</strong> for rapid deployment.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Organizational Readiness */}
            <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <Building className="w-6 h-6 mr-2" />
                HBC Readiness
              </h3>
              <div className="text-left space-y-2">
                <p className="text-blue-200 text-sm">• 250 employees (ideal scale)</p>
                <p className="text-blue-200 text-sm">• Florida-focused operations</p>
                <p className="text-blue-200 text-sm">• Moderate change maturity</p>
                <p className="text-blue-200 text-sm">• Existing Microsoft ecosystem</p>
              </div>
            </div>

            {/* Training Strategy */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                Training Program
              </h3>
              <div className="text-left space-y-2">
                <p className="text-green-200 text-sm">• 20-hour HBI training modules</p>
                <p className="text-green-200 text-sm">• 2-3 AI specialists required</p>
                <p className="text-green-200 text-sm">• Microsoft partnership support</p>
                <p className="text-green-200 text-sm">• Phased user onboarding</p>
              </div>
            </div>

            {/* Governance Framework */}
            <div className="bg-purple-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                AI Governance
              </h3>
              <div className="text-left space-y-2">
                <p className="text-purple-200 text-sm">• Ethical guidelines &amp; bias audits</p>
                <p className="text-purple-200 text-sm">• Data stewardship compliance</p>
                <p className="text-purple-200 text-sm">• Oversight committee formation</p>
                <p className="text-purple-200 text-sm">• User feedback integration</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Success Scenarios */}
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Success Scenarios</h3>
              <div className="text-left space-y-2">
                <p className="text-blue-200 text-sm">
                  <strong>100% Adoption:</strong> IRR 405%, NPV $11.8M
                </p>
                <p className="text-blue-200 text-sm">
                  <strong>80% Target:</strong> IRR 259%, NPV $7.3M
                </p>
                <p className="text-blue-200 text-sm">
                  <strong>Conservative 50%:</strong> IRR 112%, NPV $2.8M
                </p>
              </div>
            </div>

            {/* Risk Mitigation */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Risk Mitigation</h3>
              <div className="text-left space-y-2">
                <p className="text-orange-200 text-sm">• Pilot program with 2 multifamily projects</p>
                <p className="text-orange-200 text-sm">• Phased rollout reduces disruption</p>
                <p className="text-orange-200 text-sm">• Budget caps at $1M total commitment</p>
                <p className="text-orange-200 text-sm">• 6-month adoption milestones</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "implementation-timeline",
    title: "Implementation Roadmap: MVP to Enterprise Scale",
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
              <h3 className="text-white font-bold text-lg mb-4">Phase 1: MVP Development</h3>
              <div className="text-left space-y-2">
                <p className="text-blue-200 text-sm font-semibold">Months 1-5 (MVP Completion)</p>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Discovery &amp; system mapping</li>
                  <li>• MVP development with Andersen</li>
                  <li>• Procore &amp; Sage API integration</li>
                  <li>• Initial user training (50 users)</li>
                </ul>
                <div className="bg-blue-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">Investment: $825K</p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Phase 2: Pilot Rollout</h3>
              <div className="text-left space-y-2">
                <p className="text-green-200 text-sm font-semibold">Months 6-12 (80% Adoption)</p>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>• Deploy on 2 multifamily projects</li>
                  <li>• Scale to 80 user target</li>
                  <li>• AI copilot implementation</li>
                  <li>• Performance monitoring</li>
                </ul>
                <div className="bg-green-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">Target: 80% user adoption</p>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-purple-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Phase 3: Scale &amp; Optimize</h3>
              <div className="text-left space-y-2">
                <p className="text-purple-200 text-sm font-semibold">Years 2-5 (Enterprise)</p>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• Full enterprise deployment</li>
                  <li>• Advanced AI features</li>
                  <li>• Partner SaaS extensions</li>
                  <li>• Continuous optimization</li>
                </ul>
                <div className="bg-purple-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">ROI: 259% IRR achieved</p>
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
            <h3 className="text-white font-semibold text-lg mb-4">Immediate Strategic Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-orange-200 font-semibold">MVP Rollout</p>
                <p className="text-orange-200 text-sm">Launch Discovery Phase with Andersen</p>
              </div>
              <div>
                <p className="text-orange-200 font-semibold">$825K Budget</p>
                <p className="text-orange-200 text-sm">Secure initial MVP development funding</p>
              </div>
              <div>
                <p className="text-orange-200 font-semibold">COO Leadership</p>
                <p className="text-orange-200 text-sm">Form cross-functional implementation team</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "strategic-recommendations",
    title: "Strategic Recommendations: Path Forward",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <Target className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-green-200 font-medium">Proceed with MVP Development</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto mb-6">
              <strong>Strategic window of opportunity</strong> aligns with industry AI adoption surge and HBC's growth
              trajectory to <strong>$1B revenue by 2032-2035</strong>.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Primary Recommendations */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2" />
                Primary Recommendations
              </h3>
              <div className="text-left space-y-3">
                <p className="text-green-200 text-sm">✓ Proceed with MVP rollout via Andersen partnership</p>
                <p className="text-green-200 text-sm">✓ Prioritize Procore and Sage integrations first</p>
                <p className="text-green-200 text-sm">✓ Target 80% adoption within 6 months</p>
                <p className="text-green-200 text-sm">✓ Establish AI governance framework</p>
                <p className="text-green-200 text-sm">✓ Form COO-led cross-functional team</p>
              </div>
            </div>

            {/* Critical Success Factors */}
            <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                Critical Success Factors
              </h3>
              <div className="text-left space-y-3">
                <p className="text-blue-200 text-sm">• API stability from Procore &amp; Sage</p>
                <p className="text-blue-200 text-sm">• Budget cap enforcement at $1M total</p>
                <p className="text-blue-200 text-sm">• Microsoft partnership for training</p>
                <p className="text-blue-200 text-sm">• Phased rollout risk mitigation</p>
                <p className="text-blue-200 text-sm">• Quarterly FMI index monitoring</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2">Scale Path</h3>
              <p className="text-orange-200 text-sm">
                Internal enterprise rollout → 2026 SaaS extensions → Partner ecosystem
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2">Strategic Partnerships</h3>
              <p className="text-blue-200 text-sm">
                Expand Andersen for scalability, collaborate with Autodesk for BIM synergies
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2">Competitive Advantage</h3>
              <p className="text-green-200 text-sm">
                First-mover advantage in unified construction analytics with proprietary HBI AI layer
              </p>
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
