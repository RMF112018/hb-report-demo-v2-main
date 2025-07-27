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
              <span className="text-green-200 font-medium">Viability Score: 94/100</span>
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
              <strong>HB Intel unified analytics platform</strong> positions HBC for 10%(+) annual growth through
              AI-driven efficiency gains and operational excellence, now including HR & Payroll suite.
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
              <h3 className="text-white font-bold text-lg">285%</h3>
              <p className="text-blue-200 text-sm">5-Year IRR</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calculator className="w-10 h-10 text-blue-300" />
              <h3 className="text-white font-bold text-lg">$8.7M</h3>
              <p className="text-blue-200 text-sm">Net Present Value</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-10 h-10 text-purple-300" />
              <h3 className="text-white font-bold text-lg">10-15%</h3>
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
                <p className="text-blue-200 text-sm">• Infrastructure investments (IIJA)</p>
                <p className="text-blue-200 text-sm">• Moderate growth with supportive policy</p>
                <p className="text-blue-200 text-sm">• Lower interest rates driving recovery</p>
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
            SiteMate, BambooHR, HH2, SAP Concur, ADP via APIs while <strong>preserving existing workflows</strong>
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
              <p className="text-blue-200 text-xs">Centralized oversight across siloed systems</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Role-Based Dashboards</h3>
              <p className="text-blue-200 text-xs">Custom views for 97 users</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Brain className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">AI-Powered Insights</h3>
              <p className="text-blue-200 text-xs">Agentic and generative HBI framework</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Real-Time Analytics</h3>
              <p className="text-blue-200 text-xs">Power BI embedded with Microsoft Graph</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Cross-System Correlation</h3>
              <p className="text-blue-200 text-xs">Full lifecycle coverage including HR/payroll</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Clock className="w-8 h-8 text-blue-200" />
              <h3 className="text-white font-semibold text-sm">Productivity Gains</h3>
              <p className="text-blue-200 text-xs">10-15% overall improvement</p>
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
              <strong>Faster deployment (4-5 months MVP)</strong> with no workflow disruption - ideal for Florida firms
              avoiding system overhauls, now with integrated HR & Payroll.
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
                <p className="text-green-300 text-sm">✓ Expertise in UI/UX design and frontend</p>
                <p className="text-green-300 text-sm">✓ Creative and innovative solutions</p>
                <p className="text-green-300 text-sm">✓ Punctual and well-managed projects</p>
                <p className="text-blue-200 text-sm">• "We're happy to continuously work with their team."</p>
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
                <p className="text-green-300 text-sm">✓ Cost-effective outsourcing</p>
                <p className="text-green-300 text-sm">✓ Large team with deep tech coverage</p>
                <p className="text-green-300 text-sm">✓ Proactive problem-solving</p>
                <p className="text-blue-200 text-sm">• "Their work is critical to our organization."</p>
                <p className="text-red-300 text-sm">✗ Communication and cultural barriers</p>
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
                <p className="text-green-300 text-sm">✓ Quality, schedule adherence, flexibility</p>
                <p className="text-green-300 text-sm">✓ Competitive pricing ($50–99/hr)</p>
                <p className="text-green-300 text-sm">✓ ISO 9001/27001 certified</p>
                <p className="text-green-300 text-sm">✓ Enterprise experience with AI/scoping</p>
                <p className="text-blue-200 text-sm">• "High-quality code and strong PM"</p>
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
              <strong>Andersen's construction software specialization</strong> and enterprise-grade experience makes
              them the
              <strong> most aligned for HB Intel's analytics and HR requirements</strong>
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
                  <span className="text-white font-semibold">$595K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Annual Maintenance</span>
                  <span className="text-white font-semibold">$262K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">5-Year Maintenance Total</span>
                  <span className="text-white font-semibold">$1.31M</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between">
                    <span className="text-red-200 font-semibold">Total Investment</span>
                    <span className="text-red-200 font-bold text-xl">$1.905M</span>
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
                  <span className="text-blue-200">Productivity Gains (10-15%)</span>
                  <span className="text-white font-semibold">$1.392M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Claims Mitigation</span>
                  <span className="text-white font-semibold">$1.00M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">License Savings</span>
                  <span className="text-white font-semibold">$314K</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between">
                    <span className="text-green-200 font-semibold">Net Annual Cash Flow</span>
                    <span className="text-green-200 font-bold text-xl">$2.706M</span>
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
              <h3 className="text-white font-bold text-2xl mb-2">285%</h3>
              <p className="text-blue-200">Internal Rate of Return</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-2xl mb-2">$8.7M</h3>
              <p className="text-blue-200">Net Present Value</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-2xl mb-2">97 Users</h3>
              <p className="text-blue-200">Target Deployment</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "cost-analysis",
    title: "Cost vs Savings: 10-Year Projection",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-8 text-center relative overflow-hidden">
        <BarChart3 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-full">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full mb-4">
              <LineChart className="w-5 h-5 text-blue-300" />
              <span className="text-blue-200 font-medium">Long-Term Financial Trajectory</span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto mb-6">
              Cumulative costs vs savings over 10 years, with savings starting 6 months post-MVP deployment after
              onboarding and process transfer.
            </p>
          </motion.div>

          <motion.div
            className="relative bg-transparent rounded-lg p-6 max-w-6xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* SVG Line Chart - Behind table, no background */}
            <div className="absolute inset-0 z-0">
              <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                {/* Axes */}
                <line x1="50" y1="250" x2="550" y2="250" stroke="#ffffff30" strokeWidth="2" />
                <line x1="50" y1="250" x2="50" y2="50" stroke="#ffffff30" strokeWidth="2" />

                {/* Grid lines */}
                <line x1="50" y1="200" x2="550" y2="200" stroke="#ffffff10" />
                <line x1="50" y1="150" x2="550" y2="150" stroke="#ffffff10" />
                <line x1="50" y1="100" x2="550" y2="100" stroke="#ffffff10" />
                <line x1="50" y1="50" x2="550" y2="50" stroke="#ffffff10" />

                {/* Labels */}
                <text x="30" y="255" fill="#ffffff80" fontSize="12">
                  0
                </text>
                <text x="30" y="205" fill="#ffffff80" fontSize="12">
                  10M
                </text>
                <text x="30" y="155" fill="#ffffff80" fontSize="12">
                  20M
                </text>
                <text x="30" y="105" fill="#ffffff80" fontSize="12">
                  30M
                </text>
                <text x="30" y="55" fill="#ffffff80" fontSize="12">
                  40M
                </text>

                <text x="50" y="270" fill="#ffffff80" fontSize="12">
                  Y1
                </text>
                <text x="100" y="270" fill="#ffffff80" fontSize="12">
                  Y2
                </text>
                <text x="150" y="270" fill="#ffffff80" fontSize="12">
                  Y3
                </text>
                <text x="200" y="270" fill="#ffffff80" fontSize="12">
                  Y4
                </text>
                <text x="250" y="270" fill="#ffffff80" fontSize="12">
                  Y5
                </text>
                <text x="300" y="270" fill="#ffffff80" fontSize="12">
                  Y6
                </text>
                <text x="350" y="270" fill="#ffffff80" fontSize="12">
                  Y7
                </text>
                <text x="400" y="270" fill="#ffffff80" fontSize="12">
                  Y8
                </text>
                <text x="450" y="270" fill="#ffffff80" fontSize="12">
                  Y9
                </text>
                <text x="500" y="270" fill="#ffffff80" fontSize="12">
                  Y10
                </text>

                {/* Costs Line (Red) */}
                <polyline
                  points="50,248 100,240 150,230 200,218 250,204 300,188 350,170 400,150 450,128 500,104"
                  fill="none"
                  stroke="red"
                  strokeWidth="3"
                />

                {/* Savings Line (Green) - Delayed start */}
                <polyline
                  points="50,250 100,250 150,200 200,140 250,75 300,10 350,-60 400,-135 450,-215 500,-300"
                  fill="none"
                  stroke="green"
                  strokeWidth="3"
                />

                {/* Legend */}
                <rect x="400" y="10" width="140" height="40" fill="#ffffff10" rx="5" />
                <line x1="410" y1="25" x2="430" y2="25" stroke="red" strokeWidth="3" />
                <text x="435" y="28" fill="white" fontSize="12">
                  Costs
                </text>
                <line x1="410" y1="40" x2="430" y2="40" stroke="green" strokeWidth="3" />
                <text x="435" y="43" fill="white" fontSize="12">
                  Savings
                </text>
              </svg>
            </div>

            {/* Table in front */}
            <div className="relative z-10 overflow-x-auto bg-white/10 rounded-lg backdrop-blur-sm">
              <table className="min-w-full text-sm text-left text-blue-200">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-4 py-2">Year</th>
                    <th className="px-4 py-2">Cumulative Costs ($M)</th>
                    <th className="px-4 py-2">Cumulative Savings ($M)</th>
                    <th className="px-4 py-2">Net Position ($M)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">1</td>
                    <td className="px-4 py-2">0.56</td>
                    <td className="px-4 py-2">0</td>
                    <td className="px-4 py-2">-0.56</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">2</td>
                    <td className="px-4 py-2">0.83</td>
                    <td className="px-4 py-2">3.32</td>
                    <td className="px-4 py-2">2.49</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">3</td>
                    <td className="px-4 py-2">1.11</td>
                    <td className="px-4 py-2">6.74</td>
                    <td className="px-4 py-2">5.63</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">4</td>
                    <td className="px-4 py-2">1.42</td>
                    <td className="px-4 py-2">10.26</td>
                    <td className="px-4 py-2">8.84</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">5</td>
                    <td className="px-4 py-2">1.73</td>
                    <td className="px-4 py-2">13.91</td>
                    <td className="px-4 py-2">12.18</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">6-10</td>
                    <td className="px-4 py-2">1.79</td>
                    <td className="px-4 py-2">20.01</td>
                    <td className="px-4 py-2">18.22</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-blue-200 text-sm">
              Projections assume 5% maintenance escalation post-Year 5, 3% annual savings growth. Savings delayed to
              post-deployment (Year 2 full realization after 6-month onboarding). Net turns positive in Year 2, reaching
              $30.4M by Year 10.
            </p>
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
              execution, warranty, and HR/payroll phases through AI-driven workflows.
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
                Time Savings & Efficiency
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
                  <span className="text-blue-200 text-sm">Project Delays</span>
                  <span className="text-green-300 font-semibold text-sm">10-20% reduction</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">HR/Payroll Processing</span>
                  <span className="text-green-300 font-semibold text-sm">20-37% reduction</span>
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
                  <span className="text-blue-200 text-sm">Schedule Risks</span>
                  <span className="text-orange-300 font-semibold text-sm">15-25% mitigation</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Claims & Disputes</span>
                  <span className="text-orange-300 font-semibold text-sm">$1M annual savings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Safety Incidents</span>
                  <span className="text-orange-300 font-semibold text-sm">Proactive foresight</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">Compliance Risks</span>
                  <span className="text-orange-300 font-semibold text-sm">Audit-ready tracking</span>
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
              <p className="text-blue-200 text-xs">
                From 7-10 days industry average to reduced turnaround with AI drafting
              </p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                System Integration
              </h3>
              <p className="text-blue-200 text-xs">Unified data from Procore, Sage, SharePoint, and field/HR systems</p>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Productivity Gains
              </h3>
              <p className="text-blue-200 text-xs">10-15% overall improvement across 97-user deployment</p>
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
              Strategic change management approach addresses the <strong>industry AI adoption at 65%</strong> while
              leveraging HBC's <strong>250-employee scale</strong> for rapid deployment across 97 users.
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
                <p className="text-purple-200 text-sm">• Ethical guidelines & bias audits</p>
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
                  <strong>150% Adoption:</strong> IRR 430%, NPV $13.4M
                </p>
                <p className="text-blue-200 text-sm">
                  <strong>Base Case:</strong> IRR 285%, NPV $8.7M
                </p>
                <p className="text-blue-200 text-sm">
                  <strong>50% Adoption:</strong> IRR 140%, NPV $4.1M
                </p>
              </div>
            </div>

            {/* Risk Mitigation */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Risk Mitigation</h3>
              <div className="text-left space-y-2">
                <p className="text-orange-200 text-sm">• Pilot program with key projects</p>
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
                  <li>• Discovery & architecture with Andersen</li>
                  <li>• UI/UX development with Fireart</li>
                  <li>• Core integrations (Procore, Sage)</li>
                  <li>• Initial AI scoping and HR suite testing</li>
                </ul>
                <div className="bg-blue-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">Investment: $595K</p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Phase 2: Pilot Rollout</h3>
              <div className="text-left space-y-2">
                <p className="text-green-200 text-sm font-semibold">Months 6-12 (80% Adoption)</p>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>• Deploy on select projects</li>
                  <li>• Scale to 97 users</li>
                  <li>• Full AI & HR framework implementation</li>
                  <li>• Performance optimization</li>
                </ul>
                <div className="bg-green-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">Target: 80% user adoption</p>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-purple-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4">Phase 3: Scale & Optimize</h3>
              <div className="text-left space-y-2">
                <p className="text-purple-200 text-sm font-semibold">Years 2-5 (Enterprise)</p>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• Enterprise-wide rollout</li>
                  <li>• Advanced features and SaaS extensions</li>
                  <li>• Partner portal development</li>
                  <li>• Continuous improvement</li>
                </ul>
                <div className="bg-purple-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">ROI: 285% IRR achieved</p>
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
                <p className="text-orange-200 text-sm">Launch with Andersen and Fireart</p>
              </div>
              <div>
                <p className="text-orange-200 font-semibold">$595K Budget</p>
                <p className="text-orange-200 text-sm">Secure MVP funding</p>
              </div>
              <div>
                <p className="text-orange-200 font-semibold">Team Formation</p>
                <p className="text-orange-200 text-sm">Cross-functional oversight committee</p>
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
                <p className="text-green-200 text-sm">✓ Proceed with MVP via Andersen/Fireart</p>
                <p className="text-green-200 text-sm">✓ Prioritize Procore/Sage integrations</p>
                <p className="text-green-200 text-sm">✓ Target 80% adoption in 6 months</p>
                <p className="text-green-200 text-sm">✓ Implement AI governance plan</p>
                <p className="text-green-200 text-sm">✓ Monitor FMI indices quarterly</p>
              </div>
            </div>

            {/* Critical Success Factors */}
            <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                Critical Success Factors
              </h3>
              <div className="text-left space-y-3">
                <p className="text-blue-200 text-sm">• API stability and testing</p>
                <p className="text-blue-200 text-sm">• Budget control at $1M cap</p>
                <p className="text-blue-200 text-sm">• Microsoft training partnerships</p>
                <p className="text-blue-200 text-sm">• User pilots for feedback</p>
                <p className="text-blue-200 text-sm">• Talent for AI specialists</p>
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
                Internal rollout via agile sprints → 2026 SaaS extensions → Partner portals
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2">Strategic Partnerships</h3>
              <p className="text-blue-200 text-sm">Expand Andersen for scalability; Autodesk for BIM synergies</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2">Competitive Advantage</h3>
              <p className="text-green-200 text-sm">
                Proprietary HBI AI for explainable insights and full lifecycle coverage including HR/payroll
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
                  <p className="text-red-200 text-sm">~$97K/year recurring (estimated)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-red-300 text-sm">✗ Vendor dependency & lock-in</p>
                  <p className="text-red-300 text-sm">✗ Limited cross-platform integration</p>
                  <p className="text-red-300 text-sm">✗ No custom offline capabilities</p>
                  <p className="text-red-300 text-sm">✗ Manual ETL required (+20-30% costs)</p>
                  <p className="text-red-300 text-sm">✗ Requires BI Analyst (~$88K/year)</p>
                </div>
                <div className="bg-red-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">Total: ~$185K+/year ongoing</p>
                </div>
              </div>
            </div>

            {/* HB Intel Custom Solution */}
            <div className="bg-green-500/20 rounded-lg p-6 backdrop-blur-sm border-2 border-green-400/30">
              <h3 className="text-white font-bold text-lg mb-4">HB Intel Custom Platform</h3>
              <div className="text-left space-y-3">
                <div className="border-b border-white/20 pb-2">
                  <p className="text-green-200 font-semibold">Unified Analytics Overlay</p>
                  <p className="text-green-200 text-sm">$595K initial + $262K annual</p>
                </div>
                <div className="space-y-2">
                  <p className="text-green-300 text-sm">✓ Complete data ownership</p>
                  <p className="text-green-300 text-sm">✓ Seamless cross-platform integration</p>
                  <p className="text-green-300 text-sm">✓ Custom hybrid cloud/on-prem</p>
                  <p className="text-green-300 text-sm">✓ Superior ROI (285% IRR)</p>
                  <p className="text-green-300 text-sm">✓ Tailored to legacy systems + HR</p>
                </div>
                <div className="bg-green-600/30 rounded p-2 mt-3">
                  <p className="text-white text-xs font-semibold">5-Year NPV: $8.7M</p>
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
              provide quicker deployment but create <strong>vendor dependency and limited unification</strong>
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
