"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useProjectContext } from "@/context/project-context";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  FileText, 
  CheckCircle, 
  GitBranch,
  PieChart,
  CreditCard,
  Building2,
  Banknote,
  Receipt,
  Home,
  RefreshCw,
  Download,
  Settings,
  AlertTriangle,
  Calendar,
  TrendingDown,
  Clock,
  CheckCircle2,
  Percent,
  Unlock,
  Target,
  Activity,
  Shield,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppHeader } from "@/components/layout/app-header";

// Financial Module Components
import FinancialOverview from "@/components/financial-hub/FinancialOverview";
import BudgetAnalysis from "@/components/financial-hub/BudgetAnalysis";
import CashFlowAnalysis from "@/components/financial-hub/CashFlowAnalysis";
import { PayApplication } from "@/components/financial-hub/PayApplication";
import ARAgingCard from "@/components/financial-hub/ARAgingCard";
import PayAuthorizations from "@/components/financial-hub/PayAuthorizations";

import ChangeManagement from "@/components/financial-hub/ChangeManagement";
import CostTracking from "@/components/financial-hub/CostTracking";
import ContractManagement from "@/components/financial-hub/ContractManagement";
import RetentionManagement from "@/components/financial-hub/RetentionManagement";

interface FinancialModuleTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  component: React.ComponentType<{ userRole: string; projectData: any }>;
  requiredRoles?: string[];
}

export default function FinancialHubPage() {
  const { user } = useAuth();
  const { projectId } = useProjectContext();
  const [activeTab, setActiveTab] = useState("overview");

  // Role-based data filtering helper
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" };
    
    // If a specific project is selected, show single project view
    if (projectId && projectId !== 'all') {
      return {
        scope: "single",
        projectCount: 1,
        description: `Project View: Project ${projectId}`,
        projects: [`Project ${projectId}`],
        projectId
      };
    }
    
    // Default role-based views when no specific project is selected
    switch (user.role) {
      case "project-manager":
        return { 
          scope: "single", 
          projectCount: 1, 
          description: "Single Project View",
          projects: ["Tropical World Nursery"]
        };
      case "project-executive":
        return { 
          scope: "portfolio", 
          projectCount: 6, 
          description: "Portfolio View (6 Projects)",
          projects: ["Medical Center East", "Tech Campus Phase 2", "Marina Bay Plaza", "Tropical World", "Grandview Heights", "Riverside Plaza"]
        };
      default:
        return { 
          scope: "enterprise", 
          projectCount: 12, 
          description: "Enterprise View (All Projects)",
          projects: []
        };
    }
  };

  const projectScope = getProjectScope();

  // Define available financial modules
  const financialModules: FinancialModuleTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Comprehensive financial dashboard with key metrics and insights",
      component: FinancialOverview,
    },
    {
      id: "budget-analysis",
      label: "Budget Analysis",
      icon: Calculator,
      description: "Detailed budget tracking, variance analysis, and performance metrics",
      component: BudgetAnalysis,
    },
    {
      id: "cash-flow",
      label: "Cash Flow",
      icon: DollarSign,
      description: "Cash flow management, forecasting, and liquidity analysis",
      component: CashFlowAnalysis,
    },
    {
      id: "cost-tracking",
      label: "Cost Tracking",
      icon: PieChart,
      description: "Real-time cost tracking and expense categorization",
      component: CostTracking,
    },
    {
      id: "pay-authorization",
      label: "Pay Application",
      icon: Receipt,
      description: "Generate and manage formal AIA G702/G703 payment applications",
      component: PayApplication,
    },
    {
      id: "pay-authorizations",
      label: "Pay Authorization",
      icon: FileText,
      description: "Payment authorization workflow and approval management",
      component: PayAuthorizations,
    },
    {
      id: "change-management",
      label: "Change Orders",
      icon: GitBranch,
      description: "Change order tracking and financial impact analysis",
      component: ChangeManagement,
    },
    {
      id: "contract-management",
      label: "Contracts",
      icon: Building2,
      description: "Contract value tracking and commitment management",
      component: ContractManagement,
      requiredRoles: ["executive", "project-executive", "admin"],
    },
    {
      id: "retention-management",
      label: "Retention",
      icon: Banknote,
      description: "Retention tracking and release management",
      component: RetentionManagement,
    },
    {
      id: "ar-aging",
      label: "AR Aging",
      icon: CreditCard,
      description: "Accounts receivable aging analysis and collection management",
      component: ARAgingCard,
    },
  ];

  // Filter modules based on user role
  const availableModules = financialModules.filter(module => {
    if (!module.requiredRoles) return true;
    return user?.role && module.requiredRoles.includes(user.role);
  });

  // Get role-specific summary data based on current view
  const getSummaryData = () => {
    const scope = getProjectScope();
    
    // If viewing a single project (either by role or selection)
    if (scope.scope === "single") {
      return {
        totalContractValue: 57235491,
        netCashFlow: 8215006.64,
        profitMargin: 6.8,
        pendingApprovals: 3,
        healthScore: 88
      };
    }
    
    // Portfolio or enterprise views
    switch (user?.role) {
      case "project-executive":
        return {
          totalContractValue: 285480000,
          netCashFlow: 42630000,
          profitMargin: 6.8,
          pendingApprovals: 12,
          healthScore: 86
        };
      default:
        return {
          totalContractValue: 485280000,
          netCashFlow: 72830000,
          profitMargin: 6.4,
          pendingApprovals: 23,
          healthScore: 85
        };
    }
  };

  const summaryData = getSummaryData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get dynamic KPIs based on active tab (5-8 cards per tab)
  const getDynamicKPIs = (activeTab: string) => {
    const baseData = getSummaryData();
    
    // Core KPIs that are always present
    const coreKPIs = [
      {
        icon: Building2,
        value: formatCurrency(baseData.totalContractValue),
        label: "Contract Value",
        color: "blue"
      },
      {
        icon: TrendingUp,
        value: `${baseData.profitMargin}%`,
        label: "Profit Margin",
        color: "purple"
      },
      {
        icon: BarChart3,
        value: `${baseData.healthScore}%`,
        label: "Financial Health",
        color: "red"
      }
    ];

    // Enhanced module-specific KPIs with more insightful cards
    const moduleKPIs: Record<string, any[]> = {
      "overview": [
        {
          icon: DollarSign,
          value: formatCurrency(baseData.netCashFlow),
          label: "Net Cash Flow",
          color: "green"
        },
        {
          icon: CheckCircle,
          value: baseData.pendingApprovals,
          label: "Pending Approvals",
          color: "amber"
        },
        {
          icon: Calculator,
          value: `${((baseData.totalContractValue * 0.87 / baseData.totalContractValue) * 100).toFixed(1)}%`,
          label: "Budget Used",
          color: "emerald"
        },
        {
          icon: Target,
          value: "1.05",
          label: "CPI Score",
          color: "indigo"
        },
        {
          icon: AlertTriangle,
          value: "+2.8%",
          label: "Budget Variance",
          color: "yellow"
        }
      ],
      "budget-analysis": [
        {
          icon: Calculator,
          value: formatCurrency(baseData.totalContractValue * 0.87),
          label: "Actual Costs",
          color: "green"
        },
        {
          icon: Target,
          value: "1.05",
          label: "CPI Score",
          color: "indigo"
        },
        {
          icon: AlertTriangle,
          value: "+2.8%",
          label: "Budget Variance",
          color: "amber"
        },
        {
          icon: Percent,
          value: `${((baseData.totalContractValue * 0.87 / baseData.totalContractValue) * 100).toFixed(1)}%`,
          label: "Budget Utilization",
          color: "emerald"
        },
        {
          icon: TrendingDown,
          value: formatCurrency(baseData.totalContractValue * 0.13),
          label: "Remaining Budget",
          color: "yellow"
        }
      ],
      "cash-flow": [
        {
          icon: TrendingUp,
          value: formatCurrency(baseData.totalContractValue * 0.72),
          label: "Total Inflows",
          color: "green"
        },
        {
          icon: TrendingDown,
          value: formatCurrency(baseData.totalContractValue * 0.68),
          label: "Total Outflows",
          color: "red"
        },
        {
          icon: DollarSign,
          value: formatCurrency(baseData.netCashFlow),
          label: "Net Cash Flow",
          color: "blue"
        },
        {
          icon: Building2,
          value: formatCurrency(baseData.totalContractValue * 0.15),
          label: "Working Capital",
          color: "purple"
        },
        {
          icon: Calendar,
          value: "45 Days",
          label: "Avg Collection",
          color: "amber"
        },
        {
          icon: Activity,
          value: "94.2%",
          label: "Forecast Accuracy",
          color: "emerald"
        }
      ],
      "cost-tracking": [
        {
          icon: PieChart,
          value: formatCurrency(baseData.totalContractValue * 0.82),
          label: "Costs Incurred",
          color: "green"
        },
        {
          icon: TrendingDown,
          value: "2.1%",
          label: "Cost Savings",
          color: "amber"
        },
        {
          icon: Calculator,
          value: formatCurrency(baseData.totalContractValue * 0.65),
          label: "Committed Costs",
          color: "blue"
        },
        {
          icon: Building2,
          value: formatCurrency(baseData.totalContractValue * 0.45),
          label: "Direct Costs",
          color: "purple"
        },
        {
          icon: AlertTriangle,
          value: formatCurrency(baseData.totalContractValue * 0.02),
          label: "Pending Changes",
          color: "yellow"
        }
      ],
      "pay-authorization": [
        {
          icon: Receipt,
          value: formatCurrency(2280257.60),
          label: "Latest Pay App",
          color: "green"
        },
        {
          icon: Clock,
          value: "3 Days",  
          label: "Avg Processing",
          color: "amber"
        },
        {
          icon: FileText,
          value: "12",
          label: "Total Applications",
          color: "blue"
        },
        {
          icon: CheckCircle,
          value: "8",
          label: "Approved This Month",
          color: "emerald"
        },
        {
          icon: DollarSign,
          value: formatCurrency(baseData.totalContractValue * 0.45),
          label: "Total Approved",
          color: "purple"
        }
      ],
      "pay-authorizations": [
        {
          icon: FileText,
          value: baseData.pendingApprovals,
          label: "Pending Authorizations",
          color: "amber"
        },
        {
          icon: CheckCircle2,
          value: "98.2%",
          label: "Approval Rate",
          color: "green"
        },
        {
          icon: Clock,
          value: "2.4 Days",
          label: "Avg Processing Time",
          color: "blue"
        },
        {
          icon: DollarSign,
          value: formatCurrency(baseData.totalContractValue * 0.28),
          label: "Amount Authorized",
          color: "purple"
        },
        {
          icon: Shield,
          value: "100%",
          label: "Compliance Rate",
          color: "emerald"
        }
      ],
      "change-management": [
        {
          icon: CheckCircle,
          value: "14",
          label: "Approved",
          color: "green"
        },
        {
          icon: Clock,
          value: "6",
          label: "Pending",
          color: "amber"
        },
        {
          icon: XCircle,
          value: "2",
          label: "Rejected",
          color: "red"
        },
        {
          icon: GitBranch,
          value: formatCurrency(baseData.totalContractValue * 0.12),
          label: "Total Value",
          color: "blue"
        },
        {
          icon: Percent,
          value: "8.4%",
          label: "Change Rate",
          color: "purple"
        },
        {
          icon: TrendingUp,
          value: formatCurrency(baseData.totalContractValue * 0.05),
          label: "Pending Value",
          color: "yellow"
        }
      ],
      "contract-management": [
        {
          icon: Building2,
          value: "24",
          label: "Active Contracts",
          color: "green"
        },
        {
          icon: Calendar,
          value: "186 Days",
          label: "Avg Duration",
          color: "amber"
        },
        {
          icon: DollarSign,
          value: formatCurrency(baseData.totalContractValue * 0.95),
          label: "Total Contract Value",
          color: "blue"
        },
        {
          icon: CheckCircle,
          value: "22",
          label: "On Track",
          color: "emerald"
        },
        {
          icon: AlertTriangle,
          value: "2",
          label: "At Risk",
          color: "yellow"
        }
      ],
      "retention-management": [
        {
          icon: Shield,
          value: formatCurrency(baseData.totalContractValue * 0.08),
          label: "Total Held",
          color: "blue"
        },
        {
          icon: CheckCircle,
          value: formatCurrency(baseData.totalContractValue * 0.03),
          label: "Total Released",
          color: "green"
        },
        {
          icon: Banknote,
          value: formatCurrency(baseData.totalContractValue * 0.05),
          label: "Current Balance",
          color: "purple"
        },
        {
          icon: Percent,
          value: "5.0%",
          label: "Standard Rate",
          color: "amber"
        },
        {
          icon: Unlock,
          value: "12",
          label: "Ready for Release",
          color: "emerald"
        },
        {
          icon: Calendar,
          value: "8",
          label: "Contractors",
          color: "yellow"
        }
      ],
      "ar-aging": [
        {
          icon: CreditCard,
          value: formatCurrency(baseData.totalContractValue * 0.15),
          label: "Total AR",
          color: "blue"
        },
        {
          icon: TrendingUp,
          value: formatCurrency(baseData.totalContractValue * 0.11),
          label: "Current",
          color: "green"
        },
        {
          icon: Clock,
          value: formatCurrency(baseData.totalContractValue * 0.025),
          label: "1-60 Days",
          color: "amber"
        },
        {
          icon: AlertCircle,
          value: formatCurrency(baseData.totalContractValue * 0.015),
          label: "60+ Days",
          color: "red"
        },
        {
          icon: Calendar,
          value: "28 Days",
          label: "Average Age",
          color: "yellow"
        }
      ]
    };

    return [...coreKPIs, ...(moduleKPIs[activeTab] || [])];
  };

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Financial Hub</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex flex-col gap-4" data-tour="financial-hub-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financial Hub</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive financial management and analysis suite
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="px-3 py-1">
                  {projectScope.description}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  {availableModules.length} Modules
                </Badge>
                <Badge variant="outline" className="px-3 py-1 capitalize">
                  {user?.role?.replace('-', ' ') || 'User'} View
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

        </div>

        {/* Dynamic KPI Widgets */}
        <div 
          className={`grid gap-4 ${(() => {
            const kpiCount = getDynamicKPIs(activeTab).length;
            if (kpiCount <= 5) return "grid-cols-1 md:grid-cols-5";
            if (kpiCount === 6) return "grid-cols-1 md:grid-cols-6";
            if (kpiCount === 7) return "grid-cols-1 md:grid-cols-7";
            return "grid-cols-1 md:grid-cols-8";
          })()}`}
          data-tour="financial-hub-dynamic-kpis"
        >
          {getDynamicKPIs(activeTab).map((kpi, index) => {
            const IconComponent = kpi.icon;
            const colorClasses = {
              blue: "text-blue-600 dark:text-blue-400",
              green: "text-green-600 dark:text-green-400", 
              purple: "text-purple-600 dark:text-purple-400",
              red: "text-red-600 dark:text-red-400",
              amber: "text-amber-600 dark:text-amber-400",
              emerald: "text-emerald-600 dark:text-emerald-400",
              indigo: "text-indigo-600 dark:text-indigo-400",
              yellow: "text-yellow-600 dark:text-yellow-400"
            };
            
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <IconComponent className={`h-5 w-5 ${colorClasses[kpi.color as keyof typeof colorClasses]} mr-2`} />
                    <span className={`text-2xl font-bold ${colorClasses[kpi.color as keyof typeof colorClasses]}`}>
                      {kpi.value}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Financial Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-12 bg-muted border-border" data-tour="financial-hub-navigation">
          {availableModules.map((module) => (
            <TabsTrigger
              key={module.id}
              value={module.id}
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
              data-tour={`financial-hub-tab-${module.id}`}
            >
              <module.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{module.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {availableModules.map((module) => {
          const ModuleComponent = module.component;
          
          return (
            <TabsContent key={module.id} value={module.id} className="space-y-6" data-tour={`financial-hub-content-${module.id}`}>
              {/* Module Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border" data-tour={`financial-hub-header-${module.id}`}>
                <div className="p-2 rounded-lg bg-primary/10 border-primary/20">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{module.label}</h2>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>

              {/* Module Content */}
              <ModuleComponent 
                userRole={projectScope.scope === "single" ? "project-manager" : user?.role || "executive"}
                projectData={projectScope}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
    </>
  );
} 