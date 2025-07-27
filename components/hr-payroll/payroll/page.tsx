"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  DollarSign,
  Users,
  FileText,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Calculator,
  CreditCard,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"

// Mock data for payroll calculations
const mockPayrollData = {
  currentCycle: {
    period: "Dec 15-28, 2024",
    grossPay: 284750.0,
    netPay: 198925.0,
    totalDeductions: 85825.0,
    headcount: 47,
    status: "Processing",
  },
  employees: [
    {
      id: "EMP001",
      name: "Sarah Johnson",
      department: "Construction",
      position: "Project Manager",
      grossPay: 8500.0,
      netPay: 5950.0,
      hours: 80,
      overtime: 8,
      expenses: 1250.0,
      status: "Approved",
    },
    {
      id: "EMP002",
      name: "Michael Chen",
      department: "Engineering",
      position: "Site Engineer",
      grossPay: 7200.0,
      netPay: 5040.0,
      hours: 76,
      overtime: 4,
      expenses: 890.0,
      status: "Approved",
    },
    {
      id: "EMP003",
      name: "Lisa Rodriguez",
      department: "Safety",
      position: "Safety Coordinator",
      grossPay: 6800.0,
      netPay: 4760.0,
      hours: 72,
      overtime: 0,
      expenses: 450.0,
      status: "Pending",
    },
    {
      id: "EMP004",
      name: "David Thompson",
      department: "Operations",
      position: "Superintendent",
      grossPay: 9200.0,
      netPay: 6440.0,
      hours: 84,
      overtime: 12,
      expenses: 2100.0,
      status: "Approved",
    },
    {
      id: "EMP005",
      name: "Jennifer Lee",
      department: "Administration",
      position: "Office Manager",
      grossPay: 5800.0,
      netPay: 4060.0,
      hours: 68,
      overtime: 0,
      expenses: 320.0,
      status: "Approved",
    },
  ],
  deductions: {
    federalTax: 56950.0,
    stateTax: 14237.5,
    socialSecurity: 17654.5,
    medicare: 4131.88,
    benefits: 28475.0,
    other: 2847.5,
  },
  timeData: {
    totalHours: 3640,
    regularHours: 3296,
    overtimeHours: 344,
    averageHoursPerEmployee: 77.4,
  },
  expenseData: {
    totalExpenses: 45620.0,
    approvedExpenses: 42350.0,
    pendingExpenses: 3270.0,
    averagePerEmployee: 970.64,
  },
}

// Mock tax calculation logic
const calculateTaxes = (grossPay: number) => {
  const federalRate = 0.2
  const stateRate = 0.05
  const socialSecurityRate = 0.062
  const medicareRate = 0.0145

  return {
    federalTax: grossPay * federalRate,
    stateTax: grossPay * stateRate,
    socialSecurity: grossPay * socialSecurityRate,
    medicare: grossPay * medicareRate,
  }
}

// Mock benefits calculation
const calculateBenefits = (grossPay: number) => {
  const healthInsurance = grossPay * 0.08
  const retirement = grossPay * 0.02
  return healthInsurance + retirement
}

export default function PayrollPage() {
  const [selectedCycle, setSelectedCycle] = useState("current")
  const [showDirectDepositModal, setShowDirectDepositModal] = useState(false)
  const [processingPayroll, setProcessingPayroll] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")

  const payrollData = useMemo(() => mockPayrollData, [])

  const totalDeductions = Object.values(payrollData.deductions).reduce((sum, amount) => sum + amount, 0)
  const deductionPercentage = (totalDeductions / payrollData.currentCycle.grossPay) * 100

  const handleProcessPayroll = () => {
    setProcessingPayroll(true)
    setTimeout(() => {
      setProcessingPayroll(false)
      setShowDirectDepositModal(true)
    }, 2000)
  }

  const handleDirectDeposit = () => {
    setShowDirectDepositModal(false)
    // Mock direct deposit processing
  }

  const handleExportReport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting payroll report in ${format} format`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Dashboard</h1>
          <p className="text-muted-foreground">Manage payroll cycles, process payments, and generate reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExportReport(exportFormat)}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button onClick={handleProcessPayroll} disabled={processingPayroll}>
            {processingPayroll ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Process Payroll
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Payroll Cycle Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payrollData.currentCycle.grossPay.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current cycle: {payrollData.currentCycle.period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Pay</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payrollData.currentCycle.netPay.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After deductions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeductions.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <Progress value={deductionPercentage} className="w-full" />
              <span className="text-xs text-muted-foreground">{deductionPercentage.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Headcount</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollData.currentCycle.headcount}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employee Details</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Time & Expense Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Time & Expense Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Total Hours</Label>
                    <div className="text-2xl font-bold">{payrollData.timeData.totalHours.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {payrollData.timeData.regularHours} regular + {payrollData.timeData.overtimeHours} OT
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Avg Hours/Employee</Label>
                    <div className="text-2xl font-bold">{payrollData.timeData.averageHoursPerEmployee}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Total Expenses</Label>
                    <div className="text-2xl font-bold">${payrollData.expenseData.totalExpenses.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      ${payrollData.expenseData.averagePerEmployee} avg per employee
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Approved Expenses</Label>
                    <div className="text-2xl font-bold text-green-600">
                      ${payrollData.expenseData.approvedExpenses.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {payrollData.expenseData.pendingExpenses > 0 &&
                        `${payrollData.expenseData.pendingExpenses} pending`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Calculations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Tax Calculations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Federal Tax</span>
                    <span className="font-medium">${payrollData.deductions.federalTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">State Tax</span>
                    <span className="font-medium">${payrollData.deductions.stateTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Social Security</span>
                    <span className="font-medium">${payrollData.deductions.socialSecurity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medicare</span>
                    <span className="font-medium">${payrollData.deductions.medicare.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Taxes</span>
                    <span>
                      $
                      {(
                        payrollData.deductions.federalTax +
                        payrollData.deductions.stateTax +
                        payrollData.deductions.socialSecurity +
                        payrollData.deductions.medicare
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Payroll Details</CardTitle>
              <CardDescription>Individual employee payroll information for the current cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollData.employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {employee.position} • {employee.department}
                        </p>
                      </div>
                      <Badge variant={employee.status === "Approved" ? "default" : "secondary"}>
                        {employee.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Gross Pay:</span>
                        <div className="font-medium">${employee.grossPay.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Net Pay:</span>
                        <div className="font-medium">${employee.netPay.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hours:</span>
                        <div className="font-medium">
                          {employee.hours} ({employee.overtime} OT)
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expenses:</span>
                        <div className="font-medium">${employee.expenses.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deductions Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of all payroll deductions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Taxes</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Federal Tax</span>
                        <span>${payrollData.deductions.federalTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State Tax</span>
                        <span>${payrollData.deductions.stateTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Security</span>
                        <span>${payrollData.deductions.socialSecurity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medicare</span>
                        <span>${payrollData.deductions.medicare.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Benefits</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Health Insurance</span>
                        <span>${(payrollData.deductions.benefits * 0.8).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retirement</span>
                        <span>${(payrollData.deductions.benefits * 0.2).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Benefits</span>
                        <span>${payrollData.deductions.benefits.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Other</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Other Deductions</span>
                        <span>${payrollData.deductions.other.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Generate and export payroll reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Report Type</Label>
                    <Select defaultValue="payroll-summary">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payroll-summary">Payroll Summary</SelectItem>
                        <SelectItem value="employee-details">Employee Details</SelectItem>
                        <SelectItem value="tax-summary">Tax Summary</SelectItem>
                        <SelectItem value="deductions-breakdown">Deductions Breakdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleExportReport(exportFormat)} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Reports</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">Payroll Summary - Dec 15-28</div>
                        <div className="text-sm text-muted-foreground">Generated 2 hours ago</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">Tax Summary - Q4 2024</div>
                        <div className="text-sm text-muted-foreground">Generated 1 day ago</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Direct Deposit Modal */}
      <Dialog open={showDirectDepositModal} onOpenChange={setShowDirectDepositModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Direct Deposit Processing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Payroll processed successfully</span>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Direct Deposit Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Employees:</span>
                  <span>{payrollData.currentCycle.headcount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Net Pay:</span>
                  <span>${payrollData.currentCycle.netPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Direct deposits will be processed within 1-2 business days.</p>
          </div>
          <DialogFooter>
            <Button onClick={handleDirectDeposit}>Confirm Direct Deposit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}
