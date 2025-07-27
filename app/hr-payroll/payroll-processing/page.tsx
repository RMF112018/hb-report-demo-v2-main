"use client"

import React from "react"
import HrPayrollLayout from "@/components/layouts/HrPayrollLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Users,
  CreditCard,
  FileText,
} from "lucide-react"

export default function PayrollProcessingPage() {
  const payrollRuns = [
    {
      id: "PAY001",
      period: "2024-01-15 to 2024-01-31",
      status: "Completed",
      employees: 1247,
      totalPayroll: 2847500,
      processedDate: "2024-02-01",
      approver: "Sarah Johnson",
      avatar: "/avatars/sarah-johnson.png",
    },
    {
      id: "PAY002",
      period: "2024-02-01 to 2024-02-15",
      status: "In Progress",
      employees: 1247,
      totalPayroll: 2892000,
      processedDate: "2024-02-16",
      approver: "Michael Chen",
      avatar: "/avatars/michael-chen.png",
    },
    {
      id: "PAY003",
      period: "2024-02-16 to 2024-02-29",
      status: "Pending",
      employees: 1247,
      totalPayroll: 2915000,
      processedDate: "2024-03-01",
      approver: "Emily Rodriguez",
      avatar: "/avatars/emily-rodriguez.png",
    },
  ]

  const payrollIssues = [
    {
      id: "ISSUE001",
      employee: "David Thompson",
      issue: "Overtime calculation error",
      priority: "High",
      status: "Pending",
      amount: 1250,
      avatar: "/avatars/david-thompson.png",
    },
    {
      id: "ISSUE002",
      employee: "Lisa Wang",
      issue: "Missing time entries",
      priority: "Medium",
      status: "In Review",
      amount: 850,
      avatar: "/avatars/lisa-wang.png",
    },
    {
      id: "ISSUE003",
      employee: "Alex Rodriguez",
      issue: "Tax withholding adjustment",
      priority: "Low",
      status: "Resolved",
      amount: 320,
      avatar: "/avatars/alex-rodriguez.png",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <HrPayrollLayout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(8654500)}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees Paid</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Current period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Payroll Runs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payroll Runs</CardTitle>
                  <CardDescription>Current and historical payroll processing</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    New Run
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Payroll</TableHead>
                    <TableHead>Processed Date</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">{run.period}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            run.status === "Completed"
                              ? "outline"
                              : run.status === "In Progress"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            run.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : run.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{run.employees.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(run.totalPayroll)}</TableCell>
                      <TableCell>{run.processedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={run.avatar} alt={run.approver} />
                            <AvatarFallback>
                              {run.approver
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{run.approver}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payroll Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Payroll Issues</CardTitle>
              <CardDescription>Issues requiring attention in current payroll run</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={issue.avatar} alt={issue.employee} />
                        <AvatarFallback>
                          {issue.employee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{issue.employee}</h3>
                          <Badge
                            variant={
                              issue.priority === "High"
                                ? "destructive"
                                : issue.priority === "Medium"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {issue.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.issue}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>Amount: {formatCurrency(issue.amount)}</span>
                          <span>Status: {issue.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Document
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Processing Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Current Period Progress</CardTitle>
              <CardDescription>Payroll processing status for current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Collection</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
                <Progress value={100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Calculations</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                </div>
                <Progress value={75} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Review & Approval</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                </div>
                <Progress value={0} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Processing</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    Not Started
                  </Badge>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HrPayrollLayout>
  )
}
