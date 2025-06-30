"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, RefreshCw, AlertTriangle } from "lucide-react"

interface ProcurementSyncPanelProps {
  onSync: () => void
  isLoading: boolean
  lastSyncTime: Date
  dataScope: {
    scope: string
    projectCount: number
    description: string
    canSync: boolean
  }
}

export function ProcurementSyncPanel({ 
  onSync, 
  isLoading, 
  lastSyncTime, 
  dataScope 
}: ProcurementSyncPanelProps) {
  const formatLastSync = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-[#FF6B35]" />
            Procore Synchronization
          </CardTitle>
          <CardDescription>
            Sync commitment data from Procore to create and update procurement log records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Data Scope</h4>
              <p className="text-sm text-muted-foreground">{dataScope.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{dataScope.projectCount} Projects</Badge>
                <Badge variant="secondary">{dataScope.scope}</Badge>
              </div>
            </div>
            {dataScope.canSync ? (
              <Button 
                onClick={onSync} 
                disabled={isLoading}
                className="bg-[#FF6B35] hover:bg-[#E55A2B]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            ) : (
              <Badge variant="secondary">Sync Restricted</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Last Sync</p>
                    <p className="text-xs text-muted-foreground">{formatLastSync(lastSyncTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Sync Status</p>
                    <p className="text-xs text-muted-foreground">
                      {isLoading ? "In Progress" : "Ready"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Auto Sync</p>
                    <p className="text-xs text-muted-foreground">Every 4 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Process</CardTitle>
          <CardDescription>
            How the Procore synchronization works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Fetch Commitments</h4>
                <p className="text-sm text-muted-foreground">
                  Retrieve commitment data from Procore API for selected projects
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Create Placeholder Records</h4>
                <p className="text-sm text-muted-foreground">
                  Generate procurement log records for each unique commitment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Link to Bid Tabs</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically link records to estimating bid tabs by CSI code and description
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium">Update Existing Records</h4>
                <p className="text-sm text-muted-foreground">
                  Sync changes to existing procurement records while preserving manual data
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 