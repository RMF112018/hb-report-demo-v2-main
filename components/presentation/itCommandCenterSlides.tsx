/**
 * @fileoverview IT Command Center Presentation Slide Definitions
 * @module ITCommandCenterSlides
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Complete sequence of slides for the IT Command Center presentation covering:
 * - Centralized IT management overview
 * - AI Pipelines and automation
 * - Asset management and tracking
 * - Backup and disaster recovery
 * - Email security and threat protection
 * - Endpoint management and monitoring
 * - Governance and compliance
 * - Infrastructure monitoring
 * - Management and administration
 * - SIEM and security operations
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Server,
  Shield,
  Database,
  Network,
  Monitor,
  Settings,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain,
  HardDrive,
  Cloud,
  Mail,
  Smartphone,
  Laptop,
  Globe,
  Lock,
  Eye,
  BarChart3,
  TrendingUp,
  Cpu,
  Wifi,
  Key,
  FileText,
  Search,
  Bell,
  Target,
  Sparkles,
  Building2,
  CircuitBoard,
  Gauge,
  Palette,
  Headphones,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  Award,
  Trophy,
  Crown,
  Gem,
  Diamond,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Database as DatabaseIcon,
  Network as NetworkIcon,
  Monitor as MonitorIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Activity as ActivityIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
} from "lucide-react"

export const itCommandCenterSlides: PresentationSlide[] = [
  {
    id: "it-command-center-overview",
    title: "IT Command Center: Centralized Intelligence for Enterprise Operations",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Server className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our IT Command Center unifies all technology operations under one intelligent dashboard—providing real-time
            visibility, automated responses, and strategic oversight across every system that powers our digital
            infrastructure.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From AI-powered automation to comprehensive security monitoring, this centralized platform transforms our IT
            from reactive support to proactive strategic advantage—ensuring business continuity and operational
            excellence.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 max-w-7xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">AI Pipelines</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Automated workflows</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Assets</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Inventory tracking</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Cloud className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Backup</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Disaster recovery</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Email Security</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Threat protection</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Endpoints</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Device management</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Governance</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Compliance & policy</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Server className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Infrastructure</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">System monitoring</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Management</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Administrative tools</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">SIEM</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Security monitoring</div>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-200" />
              <div className="font-medium text-white text-xs sm:text-sm text-center">Consultants</div>
              <div className="text-blue-200 text-[10px] sm:text-xs text-center">Vendor management</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "ai-pipelines-automation",
    title: "AI-Powered Automation: The Future of IT Operations",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Brain className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>AI Pipelines</strong> transform our routine IT tasks into intelligent, automated workflows that
            learn from patterns and optimize performance across all systems—reducing manual intervention by 85% while
            improving response times and accuracy.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From automated system health checks to predictive maintenance alerts, AI-driven intelligence ensures{" "}
            <strong>proactive problem resolution</strong> before our users even notice issues.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🤖</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Intelligent Automation</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Self-learning workflows that adapt to changing patterns and requirements.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔮</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Predictive Analytics</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Anticipate issues before they impact business operations.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">⚡</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Performance Optimization</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Continuous system tuning for maximum efficiency and reliability.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "asset-management-tracking",
    title: "Comprehensive Asset Management: Complete Visibility and Control",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <HardDrive className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Asset Management</strong> provides complete visibility into every piece of technology across our
            organization—from laptops and mobile devices to servers and network equipment—with real-time tracking,
            lifecycle management, and cost optimization.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Automated inventory updates, warranty tracking, and depreciation calculations ensure{" "}
            <strong>optimal resource allocation</strong> and strategic technology planning.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📱</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Device Inventory</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Complete tracking of all endpoints, servers, and network equipment.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📅</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Lifecycle Management</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated warranty tracking and replacement scheduling.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">💰</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Cost Optimization</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Depreciation tracking and budget forecasting for technology investments.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "backup-disaster-recovery",
    title: "Backup & Disaster Recovery: Business Continuity Guaranteed",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Cloud className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Backup & Disaster Recovery</strong> ensures zero data loss and minimal downtime through automated,
            redundant backup systems with real-time replication, instant recovery capabilities, and comprehensive
            testing protocols.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With cloud-based redundancy and automated failover systems,{" "}
            <strong>our business operations continue seamlessly</strong> even during catastrophic events.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">☁️</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Cloud Redundancy</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated backup to multiple cloud locations for maximum protection.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">⚡</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Instant Recovery</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Point-in-time restoration with minimal downtime and data loss.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔄</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Automated Testing</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Regular disaster recovery drills ensure systems work when needed.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "email-security-threat-protection",
    title: "Email Security: Advanced Threat Protection for Modern Business",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Mail className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Email Security</strong> provides comprehensive protection against phishing, malware, and advanced
            persistent threats through AI-powered detection, real-time threat intelligence, and automated response
            systems that keep our business communications secure.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With 99.9% threat detection accuracy and zero false positives,{" "}
            <strong>our critical business communications remain protected</strong> while maintaining productivity.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🛡️</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Threat Detection</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                AI-powered identification of phishing, malware, and social engineering attacks.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔍</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Content Filtering</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Advanced filtering for spam, inappropriate content, and policy violations.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Security Analytics</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Real-time threat intelligence and security posture reporting.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "endpoint-management-monitoring",
    title: "Endpoint Management: Complete Device Control and Security",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Smartphone className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Endpoint Management</strong> provides comprehensive control over all our devices—laptops, desktops,
            tablets, and mobile phones—with automated software deployment, security policy enforcement, and remote
            troubleshooting capabilities.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From automated patch management to remote device control,{" "}
            <strong>every endpoint is secured, updated, and optimized</strong> for maximum productivity and security.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">💻</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Device Control</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Centralized management of all endpoints across the organization.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔧</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Software Deployment</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated installation and updates across all devices.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔒</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Security Policies</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Enforced security standards and compliance across all endpoints.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "governance-compliance",
    title: "Governance & Compliance: Strategic IT Leadership",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Shield className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Governance & Compliance</strong> establishes strategic IT policies, ensures regulatory adherence,
            and provides executive oversight through comprehensive reporting, audit trails, and risk management
            frameworks that align technology with our business objectives.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With automated compliance monitoring and strategic planning tools,{" "}
            <strong>our IT becomes a strategic business enabler</strong> rather than just a support function.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📋</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Policy Management</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Centralized IT policies and standards across all systems.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Compliance Reporting</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated compliance monitoring and audit preparation.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🎯</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Strategic Planning</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Technology roadmaps aligned with business objectives.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "infrastructure-monitoring",
    title: "Infrastructure Monitoring: Proactive System Health Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Server className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Infrastructure Monitoring</strong> provides real-time visibility into all our systems, networks, and
            applications with automated alerting, performance analytics, and predictive maintenance that ensures optimal
            system health and business continuity.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With comprehensive monitoring and automated response capabilities,{" "}
            <strong>system issues are resolved before they impact our users</strong> and business operations.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📈</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Performance Analytics</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Real-time monitoring of system performance and resource utilization.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔔</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Automated Alerting</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Intelligent alerts for critical issues and performance degradation.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔮</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Predictive Maintenance</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Proactive identification of potential system issues before they occur.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "management-administration",
    title: "Management & Administration: Centralized IT Control",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Settings className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Management & Administration</strong> provides comprehensive administrative tools for user
            management, system configuration, access control, and operational oversight—all centralized in one powerful
            interface that simplifies our IT operations.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From user provisioning to system configuration,{" "}
            <strong>every administrative task is streamlined and automated</strong> for maximum efficiency and security.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">👥</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">User Management</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Centralized user provisioning, access control, and role management.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">⚙️</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">System Configuration</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated system setup and configuration management.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔐</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Access Control</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Granular permissions and security policy enforcement.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "siem-security-operations",
    title: "SIEM & Security Operations: Comprehensive Threat Detection",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Eye className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>SIEM & Security Operations</strong> provides comprehensive security monitoring, threat detection,
            and incident response through advanced analytics, real-time correlation, and automated response capabilities
            that protect against modern cyber threats.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With 24/7 monitoring and intelligent threat intelligence,{" "}
            <strong>security incidents are detected and resolved</strong> before they can impact our business
            operations.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🔍</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Threat Detection</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Advanced analytics for identifying security threats and anomalies.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Security Analytics</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Real-time correlation and analysis of security events across all systems.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🚨</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Incident Response</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated response and escalation for security incidents.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "consultant-vendor-management",
    title: "Consultant & Vendor Management: Strategic Partnership Oversight",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <Users className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Consultant & Vendor Management</strong> centralizes oversight of all our technology partnerships,
            providing performance tracking, contract management, and strategic alignment tools that ensure optimal value
            from every technology investment and partnership.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With comprehensive vendor performance analytics and automated contract monitoring,{" "}
            <strong>every technology partnership delivers measurable value</strong> and strategic advantage.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🤝</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Partnership Tracking</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Performance monitoring and relationship management for all vendors.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📋</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Contract Management</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated contract monitoring and renewal tracking.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">📊</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Value Analytics</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                ROI tracking and strategic alignment for technology investments.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "unified-it-intelligence",
    title: "Unified IT Intelligence: The Future of Technology Management",
    content: (
      <div className="h-full w-full max-w-full flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
        {/* Background Icon Overlay */}
        <CircuitBoard className="absolute inset-0 w-96 h-96 m-auto text-white/5 z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-full px-4 sm:px-6">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our IT Command Center represents the future of technology management—unifying all IT operations under one
            intelligent platform that transforms reactive support into proactive strategic advantage.
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-blue-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With AI-powered automation, comprehensive security, and strategic oversight,{" "}
            <strong>our technology becomes a true business enabler</strong> that drives innovation, efficiency, and
            competitive advantage.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🚀</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Strategic Advantage</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Technology that drives business innovation and competitive edge.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">⚡</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Operational Excellence</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Automated processes that maximize efficiency and reliability.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl">🛡️</div>
              <div className="font-medium text-white text-sm sm:text-base text-center">Comprehensive Security</div>
              <div className="text-xs sm:text-sm text-blue-200 text-center">
                Protection that enables business growth without compromise.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default itCommandCenterSlides
