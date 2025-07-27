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
    title: "Financial Continuity Across Every Project Phase",
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
            <strong>Our Financial Management</strong> ensures unbroken financial continuity by unifying{" "}
            <strong>budget tracking, cash flow visibility, and intelligent forecasting</strong> across the entire
            project lifecycle, replacing fragmented workflows that create gaps in financial oversight.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From initial estimate through final payment and warranty closeout,{" "}
            <strong>financial continuity is preserved</strong> with real-time data and automated intelligence that
            maintains visibility and control throughout every project phase.
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
    title: "Continuous Budget Monitoring & Real-Time Variance Control",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Calculator className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our Budget Analysis</strong> maintains continuous financial oversight with{" "}
            <strong>real-time variance insights, cost breakdowns, and automated threshold alerts</strong>, ensuring
            budget continuity and early identification of issues before they disrupt project flow.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Continuous budget monitoring replaces static reports with <strong>live financial continuity</strong> that
            empowers proactive control and faster response to cost deviations throughout the project lifecycle.
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
              <div className="text-xs text-blue-200">Instant budget vs actual analysis with trend indicators</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Cost Code Breakdown</div>
              <div className="text-xs text-blue-200">Detailed cost analysis by trade and work category</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚠️</div>
              <div className="font-medium text-white">Proactive Alerts</div>
              <div className="text-xs text-blue-200">Automated notifications for budget threshold breaches</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "jchr-analysis",
    title: "Continuous Cost Intelligence & Historical Learning",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Receipt className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our Job Cost History Report</strong> creates continuous cost intelligence through{" "}
            <strong>detailed cost breakdowns, productivity metrics, and historical comparisons</strong>—maintaining
            institutional knowledge continuity that informs future bids and optimizes resource allocation.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Through centralized tracking, <strong>every labor hour and dollar creates continuous learning</strong>,
            building cost intelligence that bridges past experience with future project planning for sustained
            improvement.
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
              <div className="text-xs text-blue-200">Detailed analysis of labor, materials, and overhead costs</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Productivity Analysis</div>
              <div className="text-xs text-blue-200">Labor efficiency tracking and performance metrics</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Historical Comparisons</div>
              <div className="text-xs text-blue-200">Cost benchmarking against similar projects and phases</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "ar-aging",
    title: "Continuous Receivables Management & Cash Flow Protection",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <CreditCard className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our AR Aging Analysis</strong> ensures continuous receivables oversight with{" "}
            <strong>live aging buckets, smart collection prioritization, and cash impact metrics</strong>—maintaining
            cash flow continuity and preventing payment gaps that disrupt operations.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Continuous AR management replaces fragmented tracking with <strong>intelligent continuity</strong> that
            helps teams maintain consistent collection focus and preserve liquidity throughout project lifecycles.
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
              <div className="text-xs text-blue-200">Real-time aging buckets with automated categorization</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Collection Priority</div>
              <div className="text-xs text-blue-200">Intelligent ranking based on amount, age, and impact</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Cash Flow Impact</div>
              <div className="text-xs text-blue-200">Analysis of AR impact on project cash flow and liquidity</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "cash-flow",
    title: "Continuous Cash Flow Visibility & Proactive Capital Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <TrendingUp className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our Cash Flow Management</strong> maintains continuous financial visibility through{" "}
            <strong>real-time monitoring, predictive forecasting, and liquidity analysis</strong>—ensuring cash flow
            continuity across all projects and eliminating funding surprises.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Continuous monitoring replaces reactive planning with <strong>proactive capital continuity</strong>,
            enabling teams to maintain optimal payment timing and capital availability throughout every phase of
            construction.
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
              <div className="text-xs text-blue-200">Live cash position with incoming and outgoing flows</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔮</div>
              <div className="font-medium text-white">Automated Forecasting</div>
              <div className="text-xs text-blue-200">Intelligent cash flow predictions based on project schedules</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💧</div>
              <div className="font-medium text-white">Liquidity Analysis</div>
              <div className="text-xs text-blue-200">Working capital optimization and cash availability tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "ai-forecasting",
    title: "Continuous Intelligence & Evolving Financial Foresight",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Brain className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our HBI Forecasting</strong> creates continuous intelligence by empowering users with{" "}
            <strong>AI-driven analysis, market data, and historical benchmarks</strong> that evolve with every project,
            maintaining forecasting continuity that improves accuracy over time.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Through continuous learning, <strong>HBI delivers construction-specific continuity</strong> that assesses
            forecast quality and provides actionable financial guidance that bridges experience with intelligent
            prediction.
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
              <div className="text-xs text-blue-200">AI-powered analysis to help users evaluate forecast quality</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Data-Driven Insights</div>
              <div className="text-xs text-blue-200">Comprehensive analytics to support user decision-making</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Review Assistance</div>
              <div className="text-xs text-blue-200">Intelligent tools to help users grade and validate forecasts</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "change-management",
    title: "Change Management with Continuous Budget Integrity",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <GitBranch className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our Change Management</strong> preserves project continuity through{" "}
            <strong>automated tracking, smart approvals, and real-time impact analysis</strong>—ensuring changes enhance
            rather than disrupt financial continuity and project flow.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With continuous budget integration, <strong>all change orders maintain financial continuity</strong>,
            enabling faster approvals and clearer stakeholder communication without breaking project momentum.
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
              <div className="text-xs text-blue-200">Complete change order lifecycle management</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Approval Workflows</div>
              <div className="text-xs text-blue-200">Intelligent routing based on change value and type</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Budget Impact</div>
              <div className="text-xs text-blue-200">Real-time analysis of change order financial impact</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "pay-authorization",
    title: "Continuous Payment Workflows & Vendor Relationship Continuity",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <FileText className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our Payment Authorization</strong> ensures continuous payment flow through{" "}
            <strong>automated routing, compliance checks, and live tracking</strong>—maintaining vendor relationship
            continuity and project momentum.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Continuous workflow automation replaces fragmented approval chains with{" "}
            <strong>transparent payment continuity</strong> that ensures timely vendor payments and sustained project
            relationships.
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
              <div className="text-xs text-blue-200">Intelligent routing based on payment type and amount</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">✅</div>
              <div className="font-medium text-white">Compliance Validation</div>
              <div className="text-xs text-blue-200">Automated checks for insurance, licensing, and documentation</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Real-Time Tracking</div>
              <div className="text-xs text-blue-200">Complete payment lifecycle visibility and status updates</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "pay-applications",
    title: "Continuous Billing Cycles & Integrated Revenue Flow",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Receipt className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our Pay Applications</strong> maintain continuous billing flow by automating G702/G703 generation,
            aligning billing with progress, and <strong>managing retention within unified workflows</strong> that
            preserve revenue continuity.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Through continuous project data integration, <strong>billing continuity is preserved</strong> with faster,
            more accurate, and less administrative processes that improve cash flow reliability throughout construction.
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
              <div className="text-xs text-blue-200">Automated G702/G703 creation with progress integration</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Progress Tracking</div>
              <div className="text-xs text-blue-200">Real-time completion percentage and milestone tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Retention Management</div>
              <div className="text-xs text-blue-200">Automated retention calculations and release tracking</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "retention-management",
    title: "Retention Continuity Through Project Closeout & Warranty",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Banknote className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Our Retention Management</strong> ensures continuous financial oversight through{" "}
            <strong>automated calculations, release schedules, and warranty period tracking</strong>—maintaining
            retention continuity from construction completion through final warranty closeout.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Continuous retention monitoring with <strong>intelligent alerts and lifecycle visibility</strong> ensures
            seamless retention continuity, enabling timely releases and stronger vendor trust throughout the entire
            project lifecycle.
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
              <div className="text-xs text-blue-200">Intelligent retention percentage and amount tracking</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Release Scheduling</div>
              <div className="text-xs text-blue-200">Automated alerts for retention release opportunities</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🛡️</div>
              <div className="font-medium text-white">Warranty Monitoring</div>
              <div className="text-xs text-blue-200">Warranty period tracking and expiration notifications</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default financialTabSlides
