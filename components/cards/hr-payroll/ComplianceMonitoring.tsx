"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  XCircle,
  AlertCircle,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  Download,
  Upload,
} from "lucide-react"

interface ComplianceData {
  documentStatus: {
    totalDocuments: number
    valid: number
    expired: number
    expiringSoon: number
    missing: number
    complianceRate: number
  }
  expirationAlerts: {
    critical: number
    warning: number
    info: number
    totalAlerts: number
  }
  trainingCompliance: {
    totalEmployees: number
    compliant: number
    nonCompliant: number
    complianceRate: number
    requiredTrainings: number
    completedTrainings: number
  }
  auditReadiness: {
    lastAuditDate: string
    nextAuditDate: string
    auditScore: number
    findings: number
    resolvedFindings: number
    openFindings: number
  }
  documentTypes: {
    type: string
    total: number
    valid: number
    expired: number
    missing: number
  }[]
  trainingPrograms: {
    name: string
    required: number
    completed: number
    complianceRate: number
    dueDate: string
  }[]
}

const ComplianceMonitoring: React.FC = () => {
  // Mock compliance data
  const complianceData: ComplianceData = {
    documentStatus: {
      totalDocuments: 2847,
      valid: 2456,
      expired: 156,
      expiringSoon: 89,
      missing: 146,
      complianceRate: 86.3,
    },
    expirationAlerts: {
      critical: 23,
      warning: 45,
      info: 67,
      totalAlerts: 135,
    },
    trainingCompliance: {
      totalEmployees: 1247,
      compliant: 1089,
      nonCompliant: 158,
      complianceRate: 87.3,
      requiredTrainings: 15,
      completedTrainings: 13,
    },
    auditReadiness: {
      lastAuditDate: "2024-09-15",
      nextAuditDate: "2025-03-15",
      auditScore: 92.5,
      findings: 8,
      resolvedFindings: 6,
      openFindings: 2,
    },
    documentTypes: [
      { type: "I-9 Forms", total: 1247, valid: 1189, expired: 34, missing: 24 },
      { type: "W-4 Forms", total: 1247, valid: 1201, expired: 23, missing: 23 },
      { type: "OSHA Certifications", total: 1247, valid: 1156, expired: 67, missing: 24 },
      { type: "Safety Training", total: 1247, valid: 1089, expired: 89, missing: 69 },
      { type: "Background Checks", total: 1247, valid: 1234, expired: 8, missing: 5 },
      { type: "Drug Tests", total: 1247, valid: 1198, expired: 34, missing: 15 },
    ],
    trainingPrograms: [
      { name: "OSHA 10/30", required: 1247, completed: 1156, complianceRate: 92.7, dueDate: "2024-12-31" },
      { name: "Safety Orientation", required: 1247, completed: 1247, complianceRate: 100.0, dueDate: "2024-12-31" },
      { name: "Hazard Communication", required: 1247, completed: 1189, complianceRate: 95.3, dueDate: "2024-12-31" },
      { name: "Fall Protection", required: 456, completed: 423, complianceRate: 92.8, dueDate: "2024-12-31" },
      { name: "Scaffold Safety", required: 234, completed: 198, complianceRate: 84.6, dueDate: "2024-12-31" },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical":
        return "text-red-600 dark:text-red-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "info":
        return "text-blue-600 dark:text-blue-400"
      case "success":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {complianceData.documentStatus.complianceRate}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Document compliance</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {complianceData.expirationAlerts.critical}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">Require immediate attention</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Training Compliance</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {complianceData.trainingCompliance.complianceRate}%
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {complianceData.trainingCompliance.compliant} of {complianceData.trainingCompliance.totalEmployees}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Audit Score</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {complianceData.auditReadiness.auditScore}%
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {complianceData.auditReadiness.openFindings} open findings
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Status Overview */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Document Status Overview
          </CardTitle>
          <CardDescription>Current document compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceData.documentTypes.map((docType, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">{docType.type}</span>
                  <span className="text-sm text-muted-foreground">({docType.total})</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{docType.valid}</p>
                    <p className="text-xs text-muted-foreground">Valid</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{docType.expired}</p>
                    <p className="text-xs text-muted-foreground">Expired</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">{docType.missing}</p>
                    <p className="text-xs text-muted-foreground">Missing</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Compliance & Audit Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" />
              Training Compliance
            </CardTitle>
            <CardDescription>Required training completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceData.trainingPrograms.map((program, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{program.name}</span>
                      <span className="text-sm font-medium">{program.complianceRate}%</span>
                    </div>
                    <Progress value={program.complianceRate} className="h-2" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {program.completed}/{program.required} completed
                      </span>
                      <span className="text-xs text-muted-foreground">Due: {program.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Audit Readiness
            </CardTitle>
            <CardDescription>Audit preparation and findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Audit</span>
                <span className="text-sm font-medium">{complianceData.auditReadiness.lastAuditDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Next Audit</span>
                <span className="text-sm font-medium">{complianceData.auditReadiness.nextAuditDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Findings</span>
                <span className="text-sm font-medium">{complianceData.auditReadiness.findings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resolved</span>
                <span className="text-sm font-medium text-green-600">
                  {complianceData.auditReadiness.resolvedFindings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Open</span>
                <span className="text-sm font-medium text-red-600">{complianceData.auditReadiness.openFindings}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audit Score</span>
                  <Badge variant="default" className="text-sm">
                    {complianceData.auditReadiness.auditScore}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ComplianceMonitoring
