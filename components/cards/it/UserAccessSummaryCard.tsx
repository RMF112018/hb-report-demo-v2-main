"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function UserAccessSummaryCard() {
  const data = mock.userAccessSummary

  return (
    <CardShell title="User Access Summary">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">{data.activeUsers}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{data.pendingAccess}</div>
            <div className="text-sm text-muted-foreground">Pending Access</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Total: {data.totalUsers} users</div>
        </div>
      </div>
    </CardShell>
  )
}
