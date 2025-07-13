/**
 * @fileoverview Safety Module Main Route
 * @module SafetyPage
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Main safety module route with role-based access control
 * Only accessible to Executive users
 */

"use client"

import React from "react"
import { useAuth } from "../../context/auth-context"
import { SafetyDashboard } from "../../components/safety/SafetyDashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { useRouter } from "next/navigation"

export default function SafetyPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Role-based access control - Executive users only
  const isAuthorized = user?.role === "executive"

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Shield className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="flex items-center gap-2 justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Access Restricted
            </CardTitle>
            <CardDescription>The Safety Control Center is only accessible to Executive users.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your current role:</p>
              <Badge variant="outline" className="text-sm">
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1).replace("-", " ")}
              </Badge>
            </div>
            <Button onClick={() => router.push("/main-app")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <SafetyDashboard user={user} />
}
