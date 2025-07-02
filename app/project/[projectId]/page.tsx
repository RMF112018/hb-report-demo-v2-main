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
  AlertCircle
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
    const activeConstraints = projectData.constraints?.filter(c => c.completionStatus !== 'Closed').length || 0;
    const completedReports = projectData.fieldReports?.filter(r => r.status === 'approved').length || 0;

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
    };
  }, [projectData]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // SharePoint-style page doesn't need dashboard handlers

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
            
            {/* Project Analytics Card */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Project Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">${(analyticsData?.budget / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Utilized</span>
                  <span className="font-medium">${((analyticsData?.budgetUtilized || 0) / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Team Members</span>
                  <span className="font-medium">{analyticsData?.teamMembers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Issues</span>
                  <span className="font-medium text-orange-600">{analyticsData?.activeConstraints}</span>
                </div>
              </div>
            </div>

            {/* Document Analytics */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Document Library</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project Folders</span>
                  <span className="font-medium">{analyticsData?.foldersCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Files</span>
                  <span className="font-medium">{analyticsData?.totalFiles}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-medium">{analyticsData?.storageUsed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recent Activity</span>
                  <span className="font-medium">{analyticsData?.recentActivity} items</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Update</span>
                  <span className="font-medium">{analyticsData?.lastActivity}</span>
                </div>
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
                    <p className="text-sm text-muted-foreground">Completed Reports</p>
                    <p className="text-2xl font-bold text-foreground">{analyticsData?.completedReports}</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Issues</p>
                    <p className="text-2xl font-bold text-foreground">{analyticsData?.activeConstraints}</p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Storage Usage</p>
                    <p className="text-2xl font-bold text-foreground">{analyticsData?.storageUsed}</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

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