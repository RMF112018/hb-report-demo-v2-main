"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  Plus,
  Settings,
  Save,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react"

interface DashboardBuilderProps {
  project: any
  userRole: string
}

export const AdvancedDashboardBuilder = ({ project, userRole }: DashboardBuilderProps) => {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([])
  const [dashboardLayout, setDashboardLayout] = useState("grid")

  const availableWidgets = [
    { id: "schedule", name: "Schedule Performance", icon: Calendar, category: "Performance" },
    { id: "cost", name: "Cost Analysis", icon: DollarSign, category: "Financial" },
    { id: "quality", name: "Quality Metrics", icon: BarChart3, category: "Quality" },
    { id: "team", name: "Team Performance", icon: Users, category: "Resources" },
    { id: "trends", name: "Trend Analysis", icon: LineChart, category: "Analytics" },
    { id: "distribution", name: "Cost Distribution", icon: PieChart, category: "Financial" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          Advanced Dashboard Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="widgets">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableWidgets.map((widget) => (
                <Card key={widget.id} className="cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <widget.icon className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{widget.name}</h4>
                        <p className="text-sm text-muted-foreground">{widget.category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="layout">
            <div className="space-y-4">
              <p>Layout configuration coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <p>Dashboard preview coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
