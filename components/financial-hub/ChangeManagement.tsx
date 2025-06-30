"use client";

import React, { useState } from "react";
import { GitBranch, TrendingUp, Clock, CheckCircle, XCircle, DollarSign, FileText, Plus, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle";
import { CollapseWrapper } from "@/components/ui/collapse-wrapper";
import { useFinancialHubStore } from "@/hooks/use-financial-hub-store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChangeManagementProps {
  userRole: string;
  projectData: any;
}

// Mock change order data
const changeOrderData = [
  {
    id: "CO-001",
    description: "Additional electrical work - Phase 2",
    amount: 125000,
    status: "Approved",
    submittedDate: "2024-08-15",
    approvedDate: "2024-08-20",
    category: "Electrical",
    impact: "Schedule",
    reason: "Design Change"
  },
  {
    id: "CO-002", 
    description: "HVAC system upgrade",
    amount: 89500,
    status: "Pending",
    submittedDate: "2024-09-01",
    approvedDate: null,
    category: "HVAC",
    impact: "Cost",
    reason: "Owner Request"
  },
  {
    id: "CO-003",
    description: "Concrete foundation modifications",
    amount: 245000,
    status: "Approved",
    submittedDate: "2024-07-10",
    approvedDate: "2024-07-18",
    category: "Structural",
    impact: "Both",
    reason: "Site Conditions"
  },
  {
    id: "CO-004",
    description: "Landscaping scope expansion",
    amount: 67000,
    status: "Rejected",
    submittedDate: "2024-08-25",
    approvedDate: null,
    category: "Site Work",
    impact: "None",
    reason: "Owner Request"
  },
  {
    id: "CO-005",
    description: "Interior finishes upgrade",
    amount: 156000,
    status: "Pending",
    submittedDate: "2024-09-10",
    approvedDate: null,
    category: "Interior",
    impact: "Cost",
    reason: "Design Change"
  }
];

const monthlyChangeData = [
  { month: "May", submitted: 2, approved: 1, rejected: 0, value: 245000 },
  { month: "Jun", submitted: 1, approved: 1, rejected: 0, value: 125000 },
  { month: "Jul", submitted: 3, approved: 2, rejected: 1, value: 312000 },
  { month: "Aug", submitted: 2, approved: 1, rejected: 0, value: 89500 },
  { month: "Sep", submitted: 1, approved: 0, rejected: 0, value: 156000 },
];

const categoryBreakdown = [
  { name: "Electrical", value: 125000, count: 1, color: "#3b82f6" },
  { name: "HVAC", value: 89500, count: 1, color: "#10b981" },
  { name: "Structural", value: 245000, count: 1, color: "#f59e0b" },
  { name: "Site Work", value: 67000, count: 1, color: "#ef4444" },
  { name: "Interior", value: 156000, count: 1, color: "#8b5cf6" },
];

type ViewMode = "overview" | "tracking" | "analysis";

export default function ChangeManagement({ userRole, projectData }: ChangeManagementProps) {
  const { isFullscreen, toggleFullscreen } = useFinancialHubStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>("overview");

  const getChangeOrderData = () => {
    switch (userRole) {
      case 'project-manager':
        return {
          approved: 5,
          pending: 2,
          rejected: 1,
          totalValue: 864509,
          approvedValue: 685000,
          pendingValue: 179509
        };
      case 'project-executive':
        return {
          approved: 15,
          pending: 7,
          rejected: 3,
          totalValue: 4440000,
          approvedValue: 3200000,
          pendingValue: 1240000
        };
      default:
        return {
          approved: 28,
          pending: 12,
          rejected: 6,
          totalValue: 6870000,
          approvedValue: 5100000,
          pendingValue: 1770000
        };
    }
  };

  const data = getChangeOrderData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const ViewToggle = () => (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {[
        { key: "overview", label: "Overview", icon: GitBranch },
        { key: "tracking", label: "Tracking", icon: FileText },
        { key: "analysis", label: "Analysis", icon: TrendingUp }
      ].map((item) => (
        <Button
          key={item.key}
          variant={viewMode === item.key ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode(item.key as ViewMode)}
          className="flex items-center gap-2"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Monthly Change Order Trends
                </CardTitle>
                <CardDescription>Submission and approval patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyChangeData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'value' ? formatCurrency(value) : value,
                        name === 'value' ? 'Total Value' : name
                      ]}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="submitted" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Submitted"
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="approved" 
                      stackId="2"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Approved"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      name="Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-purple-600" />
                    Change Orders by Category
                  </CardTitle>
                  <CardDescription>Distribution by work category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.value)}</div>
                          <div className="text-xs text-muted-foreground">{item.count} item{item.count > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Process Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Process Performance
                  </CardTitle>
                  <CardDescription>Change order approval metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approval Rate</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {((data.approved / (data.approved + data.rejected)) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Processing Time</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">5.2 days</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Impact</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {((data.totalValue / 57235491) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Volume Distribution</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Approved</span>
                          <span>{data.approved}</span>
                        </div>
                        <Progress value={(data.approved / (data.approved + data.pending + data.rejected)) * 100} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Pending</span>
                          <span>{data.pending}</span>
                        </div>
                        <Progress value={(data.pending / (data.approved + data.pending + data.rejected)) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "tracking":
        return (
          <div className="space-y-6">
            {/* Change Orders Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Change Orders
                    </CardTitle>
                    <CardDescription>Active change order tracking and management</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Change Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">ID</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2">Amount</th>
                        <th className="text-center p-2">Status</th>
                        <th className="text-center p-2">Category</th>
                        <th className="text-center p-2">Impact</th>
                        <th className="text-center p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {changeOrderData.map((co, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{co.id}</td>
                          <td className="p-2 max-w-xs">
                            <div className="truncate" title={co.description}>
                              {co.description}
                            </div>
                          </td>
                          <td className="text-right p-2 font-mono">
                            {formatCurrency(co.amount)}
                          </td>
                          <td className="text-center p-2">
                            <Badge variant={
                              co.status === "Approved" ? "default" : 
                              co.status === "Pending" ? "secondary" : "destructive"
                            }>
                              {co.status}
                            </Badge>
                          </td>
                          <td className="text-center p-2">{co.category}</td>
                          <td className="text-center p-2">
                            <Badge variant="outline" className="text-xs">
                              {co.impact}
                            </Badge>
                          </td>
                          <td className="text-center p-2 text-muted-foreground">
                            {new Date(co.submittedDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "analysis":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Value Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Value Distribution
                  </CardTitle>
                  <CardDescription>Change order values by approval status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { status: 'Approved', value: data.approvedValue },
                      { status: 'Pending', value: data.pendingValue },
                      { status: 'Rejected', value: data.totalValue - data.approvedValue - data.pendingValue }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="status" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>Change order impact analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Schedule Impact Risk</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Variance Risk</span>
                      <Badge variant="default">Low</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scope Creep Risk</span>
                      <Badge variant="destructive">High</Badge>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="text-sm text-muted-foreground">Key Risk Factors:</div>
                      <ul className="text-sm space-y-1 pl-4">
                        <li>• 30% of changes due to design modifications</li>
                        <li>• Average value increasing by 15% per month</li>
                        <li>• 2 pending changes with schedule impact</li>
                        <li>• Owner-requested changes trending up</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Financial Impact Analysis
                </CardTitle>
                <CardDescription>Cumulative change order impact on project budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(data.totalValue)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Change Orders</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {((data.totalValue / 57235491) * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">% of Original Budget</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(data.pendingValue)}
                    </div>
                    <p className="text-sm text-muted-foreground">Pending Approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen.changeOrders ? 'fixed inset-0 z-[9999] bg-background p-6 overflow-auto' : ''}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <ViewToggle />
        <FullscreenToggle
          isFullscreen={isFullscreen.changeOrders}
          onToggle={() => toggleFullscreen('changeOrders')}
        />
      </div>

      {/* Collapsible KPI Metrics */}
      <CollapseWrapper
        title="Change Order Metrics"
        subtitle="Real-time change order performance indicators"
        defaultCollapsed={false}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{data.approved}</div>
              <div className="text-xs text-green-600 dark:text-green-400">{formatCurrency(data.approvedValue)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{data.pending}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">{formatCurrency(data.pendingValue)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">{data.rejected}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Denied requests</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(data.totalValue)}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">All change orders</div>
            </CardContent>
          </Card>
        </div>
      </CollapseWrapper>

      {/* Collapsible HBI Intelligence */}
      <CollapseWrapper
        title="HBI Change Management Intelligence"
        subtitle="AI-powered change order insights and analysis"
        defaultCollapsed={true}
      >
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Process Health</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    {((data.approved / (data.approved + data.rejected)) * 100).toFixed(0)}% approval rate with 5.2 day average processing time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GitBranch className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Budget Impact</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    {((data.totalValue / 57235491) * 100).toFixed(1)}% of original budget with {data.pending} pending approval
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Risk Factors</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Scope creep trending up, 30% due to design changes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapseWrapper>

      {/* Main Content Area */}
      {renderContent()}
    </div>
  );
} 