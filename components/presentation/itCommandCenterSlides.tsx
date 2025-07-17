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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The IT Command Center unifies all technology operations under one intelligent dashboard—providing real-time
            visibility, automated responses, and strategic oversight across every system that powers HB's digital
            infrastructure.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From AI-powered automation to comprehensive security monitoring, this centralized platform transforms IT
            from reactive support to proactive strategic advantage—ensuring business continuity and operational
            excellence.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Brain className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">AI Pipelines</div>
              <div className="text-blue-200 text-[10px]">Automated workflows</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <HardDrive className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Assets</div>
              <div className="text-blue-200 text-[10px]">Inventory tracking</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Cloud className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Backup</div>
              <div className="text-blue-200 text-[10px]">Disaster recovery</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Mail className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Email Security</div>
              <div className="text-blue-200 text-[10px]">Threat protection</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Smartphone className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Endpoints</div>
              <div className="text-blue-200 text-[10px]">Device management</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Governance</div>
              <div className="text-blue-200 text-[10px]">Compliance & policy</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Server className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Infrastructure</div>
              <div className="text-blue-200 text-[10px]">System monitoring</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Settings className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Management</div>
              <div className="text-blue-200 text-[10px]">Administrative tools</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Eye className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">SIEM</div>
              <div className="text-blue-200 text-[10px]">Security monitoring</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-6 h-6 text-blue-200" />
              <div className="font-medium text-white text-xs">Consultants</div>
              <div className="text-blue-200 text-[10px]">Vendor management</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-purple-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>AI Pipelines</strong> transform routine IT tasks into intelligent, automated workflows that learn
            from patterns and optimize performance across all systems—reducing manual intervention by 85% while
            improving response times and accuracy.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-purple-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From automated system health checks to predictive maintenance alerts, AI-driven intelligence ensures{" "}
            <strong>proactive problem resolution</strong> before users even notice issues.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤖</div>
              <div className="font-medium text-white">Intelligent Automation</div>
              <div className="text-xs text-purple-200">
                Self-learning workflows that adapt to changing patterns and requirements.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔮</div>
              <div className="font-medium text-white">Predictive Analytics</div>
              <div className="text-xs text-purple-200">Anticipate issues before they impact business operations.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Performance Optimization</div>
              <div className="text-xs text-purple-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-green-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Asset Management</strong> provides complete visibility into every piece of technology across the
            organization—from laptops and mobile devices to servers and network equipment—with real-time tracking,
            lifecycle management, and cost optimization.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-green-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Automated inventory updates, warranty tracking, and depreciation calculations ensure{" "}
            <strong>optimal resource allocation</strong> and strategic technology planning.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📱</div>
              <div className="font-medium text-white">Device Inventory</div>
              <div className="text-xs text-green-200">
                Complete tracking of all endpoints, servers, and network equipment.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📅</div>
              <div className="font-medium text-white">Lifecycle Management</div>
              <div className="text-xs text-green-200">Automated warranty tracking and replacement scheduling.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💰</div>
              <div className="font-medium text-white">Cost Optimization</div>
              <div className="text-xs text-green-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-blue-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Backup & Disaster Recovery</strong> ensures zero data loss and minimal downtime through automated,
            redundant backup systems with real-time replication, instant recovery capabilities, and comprehensive
            testing protocols.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-blue-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With cloud-based redundancy and automated failover systems,{" "}
            <strong>business operations continue seamlessly</strong> even during catastrophic events.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">☁️</div>
              <div className="font-medium text-white">Cloud Redundancy</div>
              <div className="text-xs text-blue-200">
                Automated backup to multiple cloud locations for maximum protection.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Instant Recovery</div>
              <div className="text-xs text-blue-200">
                Point-in-time restoration with minimal downtime and data loss.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔄</div>
              <div className="font-medium text-white">Automated Testing</div>
              <div className="text-xs text-blue-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-red-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Email Security</strong> provides comprehensive protection against phishing, malware, and advanced
            persistent threats through AI-powered detection, real-time threat intelligence, and automated response
            systems that keep business communications secure.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-red-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With 99.9% threat detection accuracy and zero false positives,{" "}
            <strong>critical business communications remain protected</strong> while maintaining productivity.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🛡️</div>
              <div className="font-medium text-white">Threat Detection</div>
              <div className="text-xs text-red-200">
                AI-powered identification of phishing, malware, and social engineering attacks.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Content Filtering</div>
              <div className="text-xs text-red-200">
                Advanced filtering for spam, inappropriate content, and policy violations.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Security Analytics</div>
              <div className="text-xs text-red-200">Real-time threat intelligence and security posture reporting.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-indigo-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Endpoint Management</strong> provides comprehensive control over all devices—laptops, desktops,
            tablets, and mobile phones—with automated software deployment, security policy enforcement, and remote
            troubleshooting capabilities.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-indigo-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From automated patch management to remote device control,{" "}
            <strong>every endpoint is secured, updated, and optimized</strong> for maximum productivity and security.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">💻</div>
              <div className="font-medium text-white">Device Control</div>
              <div className="text-xs text-indigo-200">
                Centralized management of all endpoints across the organization.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔧</div>
              <div className="font-medium text-white">Software Deployment</div>
              <div className="text-xs text-indigo-200">Automated installation and updates across all devices.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔒</div>
              <div className="font-medium text-white">Security Policies</div>
              <div className="text-xs text-indigo-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-emerald-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Governance & Compliance</strong> establishes strategic IT policies, ensures regulatory adherence,
            and provides executive oversight through comprehensive reporting, audit trails, and risk management
            frameworks that align technology with business objectives.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-emerald-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With automated compliance monitoring and strategic planning tools,{" "}
            <strong>IT becomes a strategic business enabler</strong> rather than just a support function.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Policy Management</div>
              <div className="text-xs text-emerald-200">Centralized IT policies and standards across all systems.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Compliance Reporting</div>
              <div className="text-xs text-emerald-200">Automated compliance monitoring and audit preparation.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🎯</div>
              <div className="font-medium text-white">Strategic Planning</div>
              <div className="text-xs text-emerald-200">Technology roadmaps aligned with business objectives.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-orange-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Infrastructure Monitoring</strong> provides real-time visibility into all systems, networks, and
            applications with automated alerting, performance analytics, and predictive maintenance that ensures optimal
            system health and business continuity.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-orange-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With comprehensive monitoring and automated response capabilities,{" "}
            <strong>system issues are resolved before they impact users</strong> and business operations.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📈</div>
              <div className="font-medium text-white">Performance Analytics</div>
              <div className="text-xs text-orange-200">
                Real-time monitoring of system performance and resource utilization.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔔</div>
              <div className="font-medium text-white">Automated Alerting</div>
              <div className="text-xs text-orange-200">
                Intelligent alerts for critical issues and performance degradation.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔮</div>
              <div className="font-medium text-white">Predictive Maintenance</div>
              <div className="text-xs text-orange-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-cyan-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Management & Administration</strong> provides comprehensive administrative tools for user
            management, system configuration, access control, and operational oversight—all centralized in one powerful
            interface that simplifies IT operations.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-cyan-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From user provisioning to system configuration,{" "}
            <strong>every administrative task is streamlined and automated</strong> for maximum efficiency and security.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">👥</div>
              <div className="font-medium text-white">User Management</div>
              <div className="text-xs text-cyan-200">
                Centralized user provisioning, access control, and role management.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚙️</div>
              <div className="font-medium text-white">System Configuration</div>
              <div className="text-xs text-cyan-200">Automated system setup and configuration management.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔐</div>
              <div className="font-medium text-white">Access Control</div>
              <div className="text-xs text-cyan-200">Granular permissions and security policy enforcement.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-rose-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>SIEM & Security Operations</strong> provides comprehensive security monitoring, threat detection,
            and incident response through advanced analytics, real-time correlation, and automated response capabilities
            that protect against modern cyber threats.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-rose-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With 24/7 monitoring and intelligent threat intelligence,{" "}
            <strong>security incidents are detected and resolved</strong> before they can impact business operations.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🔍</div>
              <div className="font-medium text-white">Threat Detection</div>
              <div className="text-xs text-rose-200">
                Advanced analytics for identifying security threats and anomalies.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Security Analytics</div>
              <div className="text-xs text-rose-200">
                Real-time correlation and analysis of security events across all systems.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🚨</div>
              <div className="font-medium text-white">Incident Response</div>
              <div className="text-xs text-rose-200">Automated response and escalation for security incidents.</div>
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-violet-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong>Consultant & Vendor Management</strong> centralizes oversight of all technology partnerships,
            providing performance tracking, contract management, and strategic alignment tools that ensure optimal value
            from every technology investment and partnership.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-violet-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With comprehensive vendor performance analytics and automated contract monitoring,{" "}
            <strong>every technology partnership delivers measurable value</strong> and strategic advantage.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🤝</div>
              <div className="font-medium text-white">Partnership Tracking</div>
              <div className="text-xs text-violet-200">
                Performance monitoring and relationship management for all vendors.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📋</div>
              <div className="font-medium text-white">Contract Management</div>
              <div className="text-xs text-violet-200">Automated contract monitoring and renewal tracking.</div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">📊</div>
              <div className="font-medium text-white">Value Analytics</div>
              <div className="text-xs text-violet-200">
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
        <div className="relative z-10 w-full max-w-full">
          <motion.p
            className="text-base md:text-xl text-amber-100 max-w-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The IT Command Center represents the future of technology management—unifying all IT operations under one
            intelligent platform that transforms reactive support into proactive strategic advantage.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-amber-200 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With AI-powered automation, comprehensive security, and strategic oversight,{" "}
            <strong>technology becomes a true business enabler</strong> that drives innovation, efficiency, and
            competitive advantage.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🚀</div>
              <div className="font-medium text-white">Strategic Advantage</div>
              <div className="text-xs text-amber-200">
                Technology that drives business innovation and competitive edge.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">⚡</div>
              <div className="font-medium text-white">Operational Excellence</div>
              <div className="text-xs text-amber-200">
                Automated processes that maximize efficiency and reliability.
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl">🛡️</div>
              <div className="font-medium text-white">Comprehensive Security</div>
              <div className="text-xs text-amber-200">Protection that enables business growth without compromise.</div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    isFinalSlide: true,
  },
]

export default itCommandCenterSlides
