"use client"

import React from "react"
import HrPayrollLayout from "@/components/layouts/HrPayrollLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, Download, MoreHorizontal } from "lucide-react"

export default function EmployeeManagementPage() {
  const employees = [
    {
      id: "EMP001",
      name: "Sarah Johnson",
      position: "Senior Project Manager",
      department: "Operations",
      status: "Active",
      email: "sarah.johnson@hb.com",
      avatar: "/avatars/sarah-johnson.png",
      startDate: "2022-03-15",
      location: "Seattle, WA",
    },
    {
      id: "EMP002",
      name: "Michael Chen",
      position: "Estimator",
      department: "Pre-Construction",
      status: "Active",
      email: "michael.chen@hb.com",
      avatar: "/avatars/michael-chen.png",
      startDate: "2021-08-22",
      location: "Portland, OR",
    },
    {
      id: "EMP003",
      name: "Emily Rodriguez",
      position: "Field Engineer",
      department: "Field Operations",
      status: "Active",
      email: "emily.rodriguez@hb.com",
      avatar: "/avatars/emily-rodriguez.png",
      startDate: "2023-01-10",
      location: "San Francisco, CA",
    },
    {
      id: "EMP004",
      name: "David Thompson",
      position: "Safety Manager",
      department: "Safety",
      status: "Active",
      email: "david.thompson@hb.com",
      avatar: "/avatars/david-thompson.png",
      startDate: "2020-11-05",
      location: "Denver, CO",
    },
    {
      id: "EMP005",
      name: "Lisa Wang",
      position: "Project Coordinator",
      department: "Operations",
      status: "Active",
      email: "lisa.wang@hb.com",
      avatar: "/avatars/lisa-wang.png",
      startDate: "2022-09-18",
      location: "Los Angeles, CA",
    },
  ]

  return (
    <HrPayrollLayout>
      <div className="p-6">
        {/* Employee Management Content */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Badge variant="outline">1,247</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  1,198
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,198</div>
                <p className="text-xs text-muted-foreground">96% active rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <Badge variant="secondary">23</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+5 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Badge variant="outline">12</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Across all locations</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>Manage and view all employee records</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search employees..." className="pl-8" />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.location}</TableCell>
                      <TableCell>{employee.startDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </HrPayrollLayout>
  )
}
