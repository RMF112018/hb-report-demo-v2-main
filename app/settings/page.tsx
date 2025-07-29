"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Zap,
  Clock,
  Construction,
  Building2,
} from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push("/main-app")
  }

  const upcomingFeatures = [
    {
      icon: User,
      title: "Profile Management",
      description: "Update personal information, preferences, and account settings",
      status: "planned",
    },
    {
      icon: Bell,
      title: "Notification Preferences",
      description: "Configure email, SMS, and in-app notification settings",
      status: "planned",
    },
    {
      icon: Shield,
      title: "Security Settings",
      description: "Manage password, two-factor authentication, and access controls",
      status: "planned",
    },
    {
      icon: Palette,
      title: "Theme & Appearance",
      description: "Customize dashboard themes, colors, and layout preferences",
      status: "planned",
    },
    {
      icon: Globe,
      title: "Language & Region",
      description: "Set language preferences and regional formatting options",
      status: "planned",
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Export data, manage storage, and configure backup settings",
      status: "planned",
    },
    {
      icon: Construction,
      title: "Project Templates",
      description: "Create and manage custom project templates and workflows",
      status: "planned",
    },
    {
      icon: Building2,
      title: "Company Settings",
      description: "Manage company information, branding, and organizational settings",
      status: "planned",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#FA4616] rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
            >
              <Clock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coming Soon Message */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-[#FA4616] rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Settings Coming Soon
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  We're working hard to bring you a comprehensive settings experience. Our team is building powerful
                  tools to help you customize your HB Intel experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">What's in Development</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Our development team is currently working on:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#FA4616] rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">User profile management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#FA4616] rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Notification preferences</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#FA4616] rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Security settings</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#FA4616] rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Theme customization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#FA4616] rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Data management tools</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#FA4616] rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Project templates</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleBackToDashboard} className="bg-[#FA4616] hover:bg-[#E03D15] text-white">
                    Return to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => window.open("mailto:support@hedrickbrothers.com", "_blank")}>
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Features */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Features</CardTitle>
                <CardDescription>Preview of settings that will be available soon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingFeatures.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{feature.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{feature.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Current Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Settings</CardTitle>
                <CardDescription>Settings that are currently available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme Toggle</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Profile Access</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View your user profile information</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
