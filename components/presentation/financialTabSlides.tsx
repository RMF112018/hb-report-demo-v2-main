/**
 * @fileoverview Financial Management Tab Presentation Slide Definitions
 * @module FinancialTabSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the Financial Management tab presentation covering:
 * - Financial Management overview
 * - Budget Analysis with variance tracking
 * - JCHR (Job Cost History Report)
 * - AR Aging analysis
 * - Cash Flow management
 * - AI-Powered Forecasting with HBI integration
 * - Change Management
 * - Pay Authorization workflows
 * - Pay Applications (AIA G702/G703)
 * - Retention Management
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  BarChart3,
  Calculator,
  CreditCard,
  TrendingUp,
  Calendar,
  Receipt,
  FileText,
  DollarSign,
  GitBranch,
  Banknote,
  Brain,
  Target,
  Activity,
  Zap,
  Eye,
  AlertTriangle,
  Shield,
  Clock,
  Settings,
  Sparkles,
  Building2,
  Construction,
  Gauge,
  Monitor,
  Database,
  Network,
  Search,
  Award,
  CheckCircle,
  Plus,
  ArrowRight,
  Layers,
  Wrench,
  HardHat,
  Percent,
  PieChart,
  LineChart,
  AreaChart,
  Briefcase,
  Users,
  BookOpen,
  Lightbulb,
  Star,
  CheckSquare,
  Link,
  Globe,
  Smartphone,
  Tablet,
  MessageSquare,
  Bell,
  Send,
  Edit,
  Save,
  Download,
  Upload,
  Share,
  Copy,
  Folder,
  Home,
  RefreshCw,
  Filter,
  Maximize2,
  TrendingDown,
  PlusCircle,
  MinusCircle,
  CircleDollarSign,
  Coins,
  Wallet,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
} from "lucide-react"

export const financialTabSlides: PresentationSlide[] = [
  {
    id: "financial-overview",
    title: "Financial Management Overview",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <BarChart3 className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Financial Management</strong> transforms scattered financial processes by providing{" "}
            <strong>unified budget tracking, cash flow analysis, and AI-powered forecasting</strong> that eliminates the
            need for multiple Excel spreadsheets and disconnected financial systems.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of juggling separate systems for budget analysis, payment tracking, and financial reporting,{" "}
            <strong>all financial operations are centralized</strong> with real-time integration and intelligent
            automation that follows projects from estimate to final payment.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Budget Analysis</div>
              <div className="text-xs text-blue-200">Real-time budget tracking with variance analysis</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Cash Flow Management</div>
              <div className="text-xs text-blue-200">Automated cash flow forecasting and analysis</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">AI Forecasting</div>
              <div className="text-xs text-blue-200">HBI-powered predictive financial analytics</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Payment Processing</div>
              <div className="text-xs text-blue-200">Integrated pay apps, authorization, and retention</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "budget-analysis",
    title: "Budget Analysis & Variance Tracking",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Calculator className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-green-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Budget Analysis</strong> eliminates manual budget tracking by providing{" "}
            <strong>real-time variance analysis, cost code breakdowns, and automated alerts</strong> that identify
            budget overruns before they impact project profitability.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of waiting for monthly budget reports and manual variance calculations,{" "}
            <strong>budget performance is monitored continuously</strong> with intelligent insights that help project
            managers make informed decisions quickly.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Real-Time Variance</div>
              <div className="text-xs text-green-200">Instant budget vs actual analysis with trend indicators</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Cost Code Breakdown</div>
              <div className="text-xs text-green-200">Detailed cost analysis by trade and work category</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚠️</div>
              <div className="font-medium text-white">Proactive Alerts</div>
              <div className="text-xs text-green-200">Automated notifications for budget threshold breaches</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "jchr-analysis",
    title: "Job Cost History Report (JCHR)",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Receipt className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-purple-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Job Cost History Report</strong> transforms cost tracking by providing{" "}
            <strong>comprehensive cost breakdowns, labor productivity analysis, and historical cost comparisons</strong>
            that eliminate the need for manual cost report compilation.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of spending hours gathering cost data from multiple systems and creating manual reports,{" "}
            <strong>all job costs are automatically tracked and analyzed</strong> with intelligent insights that help
            optimize future project estimates and resource allocation.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💼</div>
              <div className="font-medium text-white">Complete Cost Breakdown</div>
              <div className="text-xs text-purple-200">Detailed analysis of labor, materials, and overhead costs</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Productivity Analysis</div>
              <div className="text-xs text-purple-200">Labor efficiency tracking and performance metrics</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Historical Comparisons</div>
              <div className="text-xs text-purple-200">Cost benchmarking against similar projects and phases</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "ar-aging",
    title: "Accounts Receivable Aging",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <CreditCard className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-red-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>AR Aging Analysis</strong> streamlines accounts receivable management by providing{" "}
            <strong>automated aging reports, collection priority ranking, and cash flow impact analysis</strong>
            that eliminates manual AR tracking and improves collection efficiency.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-red-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing AR spreadsheets and manual follow-up schedules,{" "}
            <strong>all receivables are automatically tracked and prioritized</strong> with intelligent alerts that help
            maintain healthy cash flow and reduce collection delays.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🕐</div>
              <div className="font-medium text-white">Automated Aging</div>
              <div className="text-xs text-red-200">Real-time aging buckets with automated categorization</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Collection Priority</div>
              <div className="text-xs text-red-200">Intelligent ranking based on amount, age, and impact</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Cash Flow Impact</div>
              <div className="text-xs text-red-200">Analysis of AR impact on project cash flow and liquidity</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "cash-flow",
    title: "Cash Flow Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <TrendingUp className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-orange-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Cash Flow Management</strong> transforms financial planning by providing{" "}
            <strong>real-time cash position tracking, automated forecasting, and liquidity analysis</strong>
            that eliminates manual cash flow projections and improves financial decision-making.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of creating weekly cash flow reports and manual projections,{" "}
            <strong>cash flow is monitored continuously</strong> with intelligent insights that help optimize payment
            timing and maintain healthy working capital levels.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Real-Time Position</div>
              <div className="text-xs text-orange-200">Live cash position with incoming and outgoing flows</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔮</div>
              <div className="font-medium text-white">Automated Forecasting</div>
              <div className="text-xs text-orange-200">
                Intelligent cash flow predictions based on project schedules
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💧</div>
              <div className="font-medium text-white">Liquidity Analysis</div>
              <div className="text-xs text-orange-200">Working capital optimization and cash availability tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "ai-forecasting",
    title: "HBI AI-Powered Forecasting",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Brain className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-indigo-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>HBI AI-Powered Forecasting</strong> revolutionizes financial planning by leveraging{" "}
            <strong>proprietary machine learning algorithms, historical project data, and market intelligence</strong>
            to provide unprecedented accuracy in project financial predictions and risk assessment.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-indigo-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of relying on static financial projections and manual analysis,{" "}
            <strong>HBI's intelligent system continuously learns from project outcomes</strong> and adapts forecasts in
            real-time, providing construction-specific insights that generic financial tools cannot match.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">HBI Intelligence</div>
              <div className="text-xs text-indigo-200">Proprietary AI trained on construction project data</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Predictive Analytics</div>
              <div className="text-xs text-indigo-200">Advanced forecasting with seasonal and market adjustments</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Risk Assessment</div>
              <div className="text-xs text-indigo-200">Intelligent risk scoring and mitigation recommendations</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "change-management",
    title: "Change Management & Tracking",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <GitBranch className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-yellow-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Change Management</strong> streamlines change order processes by providing{" "}
            <strong>automated change tracking, approval workflows, and budget impact analysis</strong>
            that eliminates manual change order management and improves approval efficiency.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-yellow-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing change orders through email chains and manual tracking,{" "}
            <strong>all changes are centrally managed</strong> with intelligent routing and automatic budget impact
            calculations that keep projects on track and stakeholders informed.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Automated Tracking</div>
              <div className="text-xs text-yellow-200">Complete change order lifecycle management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Approval Workflows</div>
              <div className="text-xs text-yellow-200">Intelligent routing based on change value and type</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Budget Impact</div>
              <div className="text-xs text-yellow-200">Real-time analysis of change order financial impact</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "pay-authorization",
    title: "Payment Authorization Workflows",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <FileText className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-teal-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Payment Authorization</strong> transforms payment processing by providing{" "}
            <strong>automated approval workflows, compliance validation, and integrated payment tracking</strong>
            that eliminates manual payment approvals and reduces processing delays.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-teal-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing payment approvals through email and manual sign-offs,{" "}
            <strong>all payments are routed intelligently</strong> with automated compliance checks and real-time
            tracking that ensures timely payments and maintains vendor relationships.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Automated Workflows</div>
              <div className="text-xs text-teal-200">Intelligent routing based on payment type and amount</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Compliance Validation</div>
              <div className="text-xs text-teal-200">Automated checks for insurance, licensing, and documentation</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Real-Time Tracking</div>
              <div className="text-xs text-teal-200">Complete payment lifecycle visibility and status updates</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "pay-applications",
    title: "Pay Applications (AIA G702/G703)",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Receipt className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-pink-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Pay Applications</strong> streamlines billing processes by providing{" "}
            <strong>automated AIA G702/G703 generation, progress tracking, and retention calculations</strong>
            that eliminates manual pay application preparation and reduces billing cycle times.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-pink-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of manually creating pay applications and tracking billing progress,{" "}
            <strong>all billing is automated and integrated</strong> with project progress data to ensure accurate,
            timely payment requests that improve cash flow and reduce administrative overhead.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">AIA Form Generation</div>
              <div className="text-xs text-pink-200">Automated G702/G703 creation with progress integration</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Progress Tracking</div>
              <div className="text-xs text-pink-200">Real-time completion percentage and milestone tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Retention Management</div>
              <div className="text-xs text-pink-200">Automated retention calculations and release tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "retention-management",
    title: "Retention Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Banknote className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-cyan-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Retention Management</strong> transforms retention tracking by providing{" "}
            <strong>automated retention calculations, release scheduling, and warranty period monitoring</strong>
            that eliminates manual retention spreadsheets and ensures timely retention releases.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-cyan-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Instead of managing retention through manual calculations and tracking systems,{" "}
            <strong>all retention is automatically monitored</strong> with intelligent alerts for release opportunities
            and warranty period expiration to optimize cash flow and maintain vendor relationships.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔢</div>
              <div className="font-medium text-white">Automated Calculations</div>
              <div className="text-xs text-cyan-200">Intelligent retention percentage and amount tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Release Scheduling</div>
              <div className="text-xs text-cyan-200">Automated alerts for retention release opportunities</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🛡️</div>
              <div className="font-medium text-white">Warranty Monitoring</div>
              <div className="text-xs text-cyan-200">Warranty period tracking and expiration notifications</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default financialTabSlides
