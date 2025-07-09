import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScheduleUpdateProps {
  userRole: string
  projectData: any
  projectId?: string
}

const ScheduleUpdate: React.FC<ScheduleUpdateProps> = ({ userRole, projectData, projectId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Schedule Update
          </CardTitle>
          <CardDescription>Manage schedule updates and synchronization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Last Update</span>
                </div>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Status</span>
                </div>
                <p className="text-sm text-muted-foreground">Synchronized</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Pending Changes</span>
                </div>
                <p className="text-sm text-muted-foreground">3 activities</p>
              </div>
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScheduleUpdate
