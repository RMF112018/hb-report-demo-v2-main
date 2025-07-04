"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function SiemLogOverviewCard() {
  const data = mock.siem

  return (
    <CardShell title="SIEM & Event Monitor">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-red-600">{data.highPriorityEvents}</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{data.activeThreats}</div>
            <div className="text-sm text-muted-foreground">Active Threats</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Total Events: {data.totalEvents.toLocaleString()}</div>
        </div>
      </div>
    </CardShell>
  )
}
