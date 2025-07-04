"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Settings className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function ChangeGovernancePanelCard() {
  const data = mock.governance

  return (
    <CardShell title="Change Management & Governance">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">{data.pendingChanges}</div>
            <div className="text-sm text-muted-foreground">Pending Changes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{data.approvedChanges}</div>
            <div className="text-sm text-muted-foreground">Approved Changes</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Success Rate: {data.complianceMetrics.changeSuccessRate}%</div>
        </div>
      </div>
    </CardShell>
  )
}
