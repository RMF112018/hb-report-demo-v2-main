"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { useTour } from "@/context/tour-context";
import { useRouter } from "next/navigation";
// Removed dashboard layout imports - using SharePoint-style layout instead
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  FileText,
  Settings,
  Download,
  Share2,
  Upload,
  AlertCircle,
  Activity,
  ChevronDown,
  Brain
} from "lucide-react";

// Mock data imports
import projectsData from "@/data/mock/projects.json";
import cashFlowData from "@/data/mock/financial/cash-flow.json";
import constraintsData from "@/data/mock/logs/constraints.json";
import reportsData from "@/data/mock/reports/reports.json";
import procurementData from "@/data/mock/procurement-log.json";
import permitsData from "@/data/mock/logs/permits.json";
import staffingData from "@/data/mock/staffing/staffing.json";

// Components
import { SharePointLibraryViewer } from "@/components/sharepoint/SharePointLibraryViewer";
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ProjectControlCenterPageProps {
  params: {
    projectId: string;
  };
}

/**
 * Project Control Center Page
 * ---------------------------
 * Centralized project-specific workspace for interacting with all data tied to one project.
 * Features:
 * - Project-specific dashboard layout
 * - Filtered mock data by project_id
 * - SharePoint integration for document management
 * - Full light/dark mode support
 */
export default function ProjectControlCenterPage({ params }: ProjectControlCenterPageProps) {
  const { user } = useAuth();
  const { startTour, isTourAvailable } = useTour();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reportSettingsOpen, setReportSettingsOpen] = useState(false);
  const [hbiInsightsOpen, setHbiInsightsOpen] = useState(true);
  const [reportSettings, setReportSettings] = useState({
    'Financial Review': 15,
    'PX Progress': 25,
    'Owner Progress': 5
  });

  const projectId = parseInt(params.projectId);

  // Find the specific project
  const project = useMemo(() => {
    return projectsData.find(p => p.project_id === projectId);
  }, [projectId]);

  // Filter all data by project_id
  const projectData = useMemo(() => {
    if (!project) return null;

    // Filter cash flow data
    const cashFlow = cashFlowData.projects.find(p => p.project_id === projectId);
    
    // Filter constraints
    const constraints = constraintsData.find(c => c.project_id === projectId)?.constraints || [];
    
    // Filter field reports (using reports data as substitute)
    const fieldReports = reportsData?.reports?.filter(r => r.projectId === projectId.toString()) || [];
    
    // Filter procurement data
    const procurement = procurementData.filter(p => p.project_id === `proj-${projectId.toString().padStart(3, '0')}`);
    
    // Filter permits
    const permits = permitsData.find(p => p.project_id === projectId)?.permits || [];
    
    // Filter staffing data
    const staffing = staffingData.filter(s => s.project_id === projectId);

    return {
      project,
      cashFlow,
      constraints,
      fieldReports,
      procurement,
      permits,
      staffing,
    };
  }, [project, projectId]);

  // Analytics metrics for SharePoint-style cards
  const analyticsData = useMemo(() => {
    if (!projectData) return null;

    const currentMonth = projectData.cashFlow?.cashFlowData?.monthlyData?.[0];
    const foldersCount = 18; // Total project folders
    const totalFiles = 556; // Sum of all files in folders (24+18+0+0+12+31+47+23+15+89+0+8+52+7+34+67+156+3)
    
    // Process constraints for Open Issues card
    const allConstraints = projectData.constraints || [];
    const openConstraints = allConstraints.filter(c => c.completionStatus !== 'Closed');
    
    // Calculate overdue constraints (past due date)
    const currentDate = new Date();
    const overdueConstraints = openConstraints.filter(c => {
      if (!c.dueDate) return false;
      const dueDate = new Date(c.dueDate);
      return dueDate < currentDate;
    });
    
    // Calculate critical constraints (>60 days elapsed or overdue)
    const criticalConstraints = openConstraints.filter(c => 
      c.daysElapsed > 60 || overdueConstraints.some(oc => oc.id === c.id)
    );
    
    const activeConstraints = openConstraints.length;
    const completedReports = projectData.fieldReports?.filter(r => r.status === 'approved').length || 0;

    // Calculate project completion percentage
    const startDate = new Date(projectData.project?.contract_date || '2024-01-15');
    const endDate = new Date(projectData.project?.scheduled_completion || '2024-12-31');
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = currentDate.getTime() - startDate.getTime();
    const percentComplete = Math.max(0, Math.min(100, Math.round((elapsedDuration / totalDuration) * 100)));

    // Calculate project health score (based on main dashboard pattern)
    const scheduleHealth = 87.5; // Mock: based on schedule performance
    const budgetHealth = 82.1;   // Mock: based on budget performance  
    const qualityHealth = 91.2;  // Mock: based on quality metrics
    const safetyHealth = 95.8;   // Mock: based on safety record
    const riskHealth = 76.4;     // Mock: based on risk assessment
    
    const projectHealthScore = Math.round((scheduleHealth + budgetHealth + qualityHealth + safetyHealth + riskHealth) / 5);
    
    const getHealthStatus = (score: number) => {
      if (score >= 90) return "Excellent";
      if (score >= 80) return "Good";
      if (score >= 70) return "Fair";
      return "Poor";
    };

    // Mock Notice of Commencement description
    const nocDescription = `Construction of luxury residential estate consisting of custom single-family home with associated site improvements including driveway, landscaping, and utility connections. Project includes foundation, framing, mechanical, electrical, and plumbing systems, interior finishes, and exterior architectural features. Located at 123 Ocean Drive, Palm Beach County, Florida. Estimated completion 365 calendar days from commencement.`;

    // Cash flow metrics
    const netCashFlow = projectData.cashFlow?.cashFlowData?.summary?.netCashFlow || 0;
    const monthlyNetCashFlow = currentMonth?.netCashFlow || 0;
    const cashFlowTrend = monthlyNetCashFlow >= 0 ? 'positive' : 'negative';

    // Schedule health metrics (mock data based on project_id patterns)
    const scheduleHealthData = {
      2525840: { logicIntegrity: 92, constraintValidity: 87, durationReasonableness: 78, resourceLoading: 85, calendarCompliance: 94, progressIntegrity: 89 },
      2525841: { logicIntegrity: 88, constraintValidity: 91, durationReasonableness: 82, resourceLoading: 79, calendarCompliance: 96, progressIntegrity: 85 },
      2525842: { logicIntegrity: 95, constraintValidity: 83, durationReasonableness: 86, resourceLoading: 91, calendarCompliance: 89, progressIntegrity: 92 }
    };
    
    const currentProjectScheduleData = scheduleHealthData[projectId as keyof typeof scheduleHealthData] || 
                                     scheduleHealthData[2525840]; // default fallback
    
    const scheduleHealthScore = Math.round(
      (currentProjectScheduleData.logicIntegrity + 
       currentProjectScheduleData.constraintValidity + 
       currentProjectScheduleData.durationReasonableness + 
       currentProjectScheduleData.resourceLoading + 
       currentProjectScheduleData.calendarCompliance + 
       currentProjectScheduleData.progressIntegrity) / 6
    );
    
    const getScheduleHealthStatus = (score: number) => {
      if (score >= 90) return "Excellent";
      if (score >= 80) return "Good";
      if (score >= 70) return "Fair";
      return "Poor";
    };

    return {
      foldersCount,
      totalFiles,
      documentsCount: totalFiles,
      storageUsed: "4.7 GB",
      recentActivity: 23,
      budget: projectData.project?.contract_value || 0,
      budgetUtilized: currentMonth?.cumulativeCashFlow || 0,
      activeConstraints,
      completedReports,
      teamMembers: projectData.staffing?.length || 0,
      lastActivity: "15 minutes ago",
      contractValue: projectData.project?.contract_value || 0,
      startDate: projectData.project?.contract_date || '2024-01-15',
      percentComplete,
      nocDescription,
      projectHealthScore,
      healthStatus: getHealthStatus(projectHealthScore),
      // Open Issues metrics
      openIssues: openConstraints.length,
      criticalIssues: criticalConstraints.length,
      overdueIssues: overdueConstraints.length,
      recentIssues: openConstraints.filter(c => c.daysElapsed <= 7).length,
      // Cash flow metrics
      netCashFlow,
      monthlyNetCashFlow,
      cashFlowTrend,
      // Schedule health metrics
      scheduleHealthScore,
      scheduleHealthStatus: getScheduleHealthStatus(scheduleHealthScore),
      scheduleHealthData: currentProjectScheduleData,
    };
  }, [projectData]);

  // Project-specific HBI insights using mock data
  const projectInsights = useMemo(() => {
    if (!projectData || !analyticsData) return [];

    const insights = [];
    
    // Cash flow insights
    if (projectData.cashFlow) {
      const netCashFlow = analyticsData.netCashFlow;
      if (netCashFlow < 0) {
        insights.push({
          id: `cash-flow-${projectId}`,
          type: "risk",
          severity: "high",
          title: "Negative Cash Flow Detected",
          text: `Project showing ${Math.abs(netCashFlow / 1000).toFixed(0)}K negative cash flow trend requiring immediate attention.`,
          action: "Accelerate billing milestones and review payment terms with client.",
          confidence: 94,
          relatedMetrics: ["Cash Flow", "Billing Schedule", "Project Margins"],
          project_id: projectId.toString(),
        });
      } else if (netCashFlow > 500000) {
        insights.push({
          id: `cash-positive-${projectId}`,
          type: "opportunity",
          severity: "medium",
          title: "Strong Cash Flow Performance",
          text: `Project generating ${(netCashFlow / 1000).toFixed(0)}K positive cash flow above projections.`,
          action: "Consider accelerating optional scope items while cash position is strong.",
          confidence: 91,
          relatedMetrics: ["Cash Flow", "Project Performance", "Scope Management"],
          project_id: projectId.toString(),
        });
      }
    }

    // Schedule health insights
    if (analyticsData.scheduleHealthScore < 80) {
      insights.push({
        id: `schedule-health-${projectId}`,
        type: "alert",
        severity: "high",
        title: "Schedule Health Below Threshold",
        text: `Schedule health score of ${analyticsData.scheduleHealthScore}% indicates potential coordination issues.`,
        action: "Implement weekly coordination meetings and review critical path activities.",
        confidence: 89,
        relatedMetrics: ["Schedule Health", "Critical Path", "Resource Coordination"],
        project_id: projectId.toString(),
      });
    }

    // Constraints insights
    if (analyticsData.criticalIssues > 5) {
      insights.push({
        id: `constraints-${projectId}`,
        type: "risk",
        severity: "high",
        title: "Critical Constraints Accumulating", 
        text: `${analyticsData.criticalIssues} critical constraints identified requiring immediate resolution.`,
        action: "Prioritize constraint resolution and implement daily constraint tracking.",
        confidence: 96,
        relatedMetrics: ["Constraints", "Project Risk", "Timeline Impact"],
        project_id: projectId.toString(),
      });
    }

    // Procurement insights
    if (projectData.procurement && projectData.procurement.length > 0) {
      const totalProcurementValue = projectData.procurement.reduce((sum, item) => sum + (item.committed_value || 0), 0);
      const budgetUtilization = (totalProcurementValue / (analyticsData.contractValue || 1)) * 100;
      
      if (budgetUtilization > 85) {
        insights.push({
          id: `procurement-${projectId}`,
          type: "alert",
          severity: "medium",
          title: "High Procurement Utilization",
          text: `${budgetUtilization.toFixed(1)}% of budget committed through procurement contracts.`,
          action: "Review remaining scope for potential cost optimization opportunities.",
          confidence: 87,
          relatedMetrics: ["Procurement", "Budget Utilization", "Cost Control"],
          project_id: projectId.toString(),
        });
      }
    }

    // Completion forecast
    if (analyticsData.percentComplete > 0) {
      const daysElapsed = Math.floor((new Date().getTime() - new Date(analyticsData.startDate).getTime()) / (1000 * 3600 * 24));
      const projectedDuration = (daysElapsed / analyticsData.percentComplete) * 100;
      const scheduledDuration = Math.floor((new Date(projectData.project?.scheduled_completion || '2024-12-31').getTime() - new Date(analyticsData.startDate).getTime()) / (1000 * 3600 * 24));
      
      if (projectedDuration > scheduledDuration * 1.1) {
        insights.push({
          id: `completion-forecast-${projectId}`,
          type: "forecast",
          severity: "medium",
          title: "Schedule Extension Likely",
          text: `AI models predict ${Math.round(projectedDuration - scheduledDuration)} day extension based on current progress.`,
          action: "Implement resource acceleration plan for critical path activities.",
          confidence: 83,
          relatedMetrics: ["Project Duration", "Progress Rate", "Critical Path"],
          project_id: projectId.toString(),
        });
      } else if (projectedDuration < scheduledDuration * 0.95) {
        insights.push({
          id: `early-completion-${projectId}`,
          type: "opportunity",
          severity: "low",
          title: "Early Completion Potential",
          text: `Current progress indicates potential ${Math.round(scheduledDuration - projectedDuration)} day early completion.`,
          action: "Consider advancing follow-on project activities or expanding scope.",
          confidence: 78,
          relatedMetrics: ["Project Duration", "Progress Rate", "Scope Opportunities"],
          project_id: projectId.toString(),
        });
      }
    }

    // Performance insights
    if (analyticsData.projectHealthScore >= 85) {
      insights.push({
        id: `performance-${projectId}`,
        type: "performance",
        severity: "low",
        title: "Exceptional Project Performance",
        text: `Project health score of ${analyticsData.projectHealthScore}% exceeds industry benchmarks.`,
        action: "Document best practices for replication on future projects.",
        confidence: 92,
        relatedMetrics: ["Project Health", "Performance Metrics", "Best Practices"],
        project_id: projectId.toString(),
      });
    }

    return insights;
  }, [projectData, analyticsData, projectId]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Navigation handler for Open Issues card
  const handleOpenIssuesClick = () => {
    router.push(`/dashboard/constraints-log?project_id=${projectId}`);
  };

  // Utility function to calculate next due date
  const getNextDueDate = (dayOfMonth: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let targetDate = new Date(currentYear, currentMonth, dayOfMonth);
    
    // If the target day has already passed this month, move to next month
    if (currentDay > dayOfMonth) {
      targetDate = new Date(currentYear, currentMonth + 1, dayOfMonth);
    }
    
    return targetDate;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Mock last submitted dates for demonstration
  const mockLastSubmitted = {
    'Financial Review': new Date('2025-06-15'),
    'PX Progress': new Date('2025-06-20'),
    'Owner Progress': new Date('2025-06-28')
  };

  // Handle report settings change
  const handleReportSettingChange = (reportType: string, dayOfMonth: string) => {
    setReportSettings(prev => ({
      ...prev,
      [reportType]: parseInt(dayOfMonth)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading project data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Building2 className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The project with ID {projectId} could not be found.
            </p>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* SharePoint-style Header - Sticky */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-[1920px] mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects" className="text-muted-foreground hover:text-foreground text-sm">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="font-medium text-sm">
                  {project.name}
                </BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Site Title and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  {project.name}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  {project.project_stage_name}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SharePoint-style Content Layout */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Sidebar - Quick Access & Analytics */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* Project Overview Card */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Project Overview</h3>
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">PROJECT DESCRIPTION</p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {analyticsData?.nocDescription}
                  </p>
                </div>
                
                <div className="border-b border-border"></div>
                
                {/* Key Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value</span>
                    <span className="font-medium">${(analyticsData?.contractValue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">{new Date(analyticsData?.startDate || '').toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">% Complete</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted rounded-full h-2 w-12">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${analyticsData?.percentComplete || 0}%` }}
                        />
                      </div>
                      <span className="font-medium text-xs">{analyticsData?.percentComplete}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Issues Analytics */}
            <div 
              className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200"
              onClick={handleOpenIssuesClick}
              title="Click to view constraints log"
            >
              <h3 className="font-semibold text-sm mb-4 text-foreground">Open Issues</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Open</span>
                  <span className="font-medium">{analyticsData?.openIssues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Critical</span>
                  <span className="font-medium text-red-600">{analyticsData?.criticalIssues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overdue</span>
                  <span className="font-medium text-orange-600">{analyticsData?.overdueIssues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recent (7 days)</span>
                  <span className="font-medium">{analyticsData?.recentIssues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium text-xs ${
                    analyticsData?.criticalIssues === 0 && analyticsData?.overdueIssues === 0 
                      ? 'text-green-600' 
                      : analyticsData?.criticalIssues > 5 || analyticsData?.overdueIssues > 3
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}>
                    {analyticsData?.criticalIssues === 0 && analyticsData?.overdueIssues === 0 
                      ? 'Good' 
                      : analyticsData?.criticalIssues > 5 || analyticsData?.overdueIssues > 3
                      ? 'Critical'
                      : 'Attention Needed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Reporting */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-foreground">Project Reporting</h3>
                <Dialog open={reportSettingsOpen} onOpenChange={setReportSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="h-12 w-12 p-0 bg-transparent hover:bg-muted/30 relative z-50"
                      title="Report Settings"
                    >
                      <Settings className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Project Report Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Project Report</TableHead>
                            <TableHead>Report Due Day</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(reportSettings).map(([reportType, dayOfMonth]) => (
                            <TableRow key={reportType}>
                              <TableCell className="font-medium">{reportType}</TableCell>
                              <TableCell>
                                <Select
                                  value={dayOfMonth.toString()}
                                  onValueChange={(value) => handleReportSettingChange(reportType, value)}
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                      <SelectItem key={day} value={day.toString()}>
                                        {day}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                  <span>Report</span>
                  <span>Due Date</span>
                  <span>Last Submitted</span>
                </div>
                
                {Object.entries(reportSettings).map(([reportType, dayOfMonth]) => {
                  const nextDueDate = getNextDueDate(dayOfMonth);
                  const lastSubmitted = mockLastSubmitted[reportType as keyof typeof mockLastSubmitted];
                  
                  return (
                    <div key={reportType} className="grid grid-cols-3 gap-2 text-xs">
                      <span className="font-medium text-foreground">{reportType}</span>
                      <span className="text-muted-foreground">{formatDate(nextDueDate)}</span>
                      <span className="text-muted-foreground">{formatDate(lastSubmitted)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  New Document
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Share with Team
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Access
                </Button>
              </div>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* Activity Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Project Health</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">{analyticsData?.projectHealthScore}%</p>
                      <span className={`text-sm px-2 py-1 rounded ${
                        analyticsData?.projectHealthScore >= 90 ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' :
                        analyticsData?.projectHealthScore >= 80 ? 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' :
                        analyticsData?.projectHealthScore >= 70 ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' :
                        'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                      }`}>
                        {analyticsData?.healthStatus}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    analyticsData?.projectHealthScore >= 90 ? 'bg-green-100 dark:bg-green-900/20' :
                    analyticsData?.projectHealthScore >= 80 ? 'bg-blue-100 dark:bg-blue-900/20' :
                    analyticsData?.projectHealthScore >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <TrendingUp className={`h-5 w-5 ${
                      analyticsData?.projectHealthScore >= 90 ? 'text-green-600' :
                      analyticsData?.projectHealthScore >= 80 ? 'text-blue-600' :
                      analyticsData?.projectHealthScore >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => router.push('/dashboard/financial-hub?tab=cash-flow')}
                title="Click to view cash flow analysis"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${((analyticsData?.netCashFlow || 0) / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analyticsData?.cashFlowTrend === 'positive' ? '+' : ''}
                      ${((analyticsData?.monthlyNetCashFlow || 0) / 1000).toFixed(0)}K this month
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    (analyticsData?.netCashFlow || 0) >= 0 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <DollarSign className={`h-5 w-5 ${
                      (analyticsData?.netCashFlow || 0) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`} />
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => router.push('/dashboard/scheduler?tab=health-analysis')}
                title="Click to view detailed schedule health analysis"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule Health</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">{analyticsData?.scheduleHealthScore}%</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        analyticsData?.scheduleHealthScore >= 90 ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' :
                        analyticsData?.scheduleHealthScore >= 80 ? 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' :
                        analyticsData?.scheduleHealthScore >= 70 ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' :
                        'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                      }`}>
                        {analyticsData?.scheduleHealthStatus}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    analyticsData?.scheduleHealthScore >= 90 ? 'bg-green-100 dark:bg-green-900/20' :
                    analyticsData?.scheduleHealthScore >= 80 ? 'bg-blue-100 dark:bg-blue-900/20' :
                    analyticsData?.scheduleHealthScore >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <Activity className={`h-5 w-5 ${
                      analyticsData?.scheduleHealthScore >= 90 ? 'text-green-600' :
                      analyticsData?.scheduleHealthScore >= 80 ? 'text-blue-600' :
                      analyticsData?.scheduleHealthScore >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* HBI Project Insights */}
            <Collapsible open={hbiInsightsOpen} onOpenChange={setHbiInsightsOpen}>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-foreground">
                        HBI {project.name} Insights
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered project intelligence and recommendations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {projectInsights.length} insights
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                      hbiInsightsOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="border-t border-border">
                    <div className="h-96">
                      <EnhancedHBIInsights 
                        config={projectInsights}
                        cardId={`project-insights-${projectId}`}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Main Document Library */}
            <SharePointLibraryViewer
              projectId={projectId.toString()}
              projectName={project.name}
              className="min-h-[600px]"
            />

            {/* Additional Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">
                      <Upload className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Daily report uploaded to 09-DailyReport</p>
                      <p className="text-xs text-muted-foreground">by Lisa Garcia • 15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-1 rounded">
                      <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Safety inspection report added to 08-Safety</p>
                      <p className="text-xs text-muted-foreground">by Mark Davis • 1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-1 rounded">
                      <Share2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Submittal package shared in 15-Submittal</p>
                      <p className="text-xs text-muted-foreground">by Sarah Wilson • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-1 rounded">
                      <AlertCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">RFI response updated in 07-RFI</p>
                      <p className="text-xs text-muted-foreground">by John Smith • 3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-1 rounded">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Meeting minutes uploaded to 06-Meeting</p>
                      <p className="text-xs text-muted-foreground">by Emily Davis • 4 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Health */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Project Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Schedule Performance</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 h-2 w-16 rounded-full"></div>
                      <span className="text-sm font-medium">On Track</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Budget Performance</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-500 h-2 w-16 rounded-full"></div>
                      <span className="text-sm font-medium">At Risk</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quality Score</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 h-2 w-16 rounded-full"></div>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Team Productivity</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 h-2 w-16 rounded-full"></div>
                      <span className="text-sm font-medium">High</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 