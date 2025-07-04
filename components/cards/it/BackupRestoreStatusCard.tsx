"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Database className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function BackupRestoreStatusCard() {
  const data = mock.backup

  return (
    <CardShell title="Backup & DR Status">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">{data.successRate}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{data.totalDataProtected}</div>
            <div className="text-sm text-muted-foreground">Data Protected</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">
            RPO: {data.drMetrics.rpoActual} / RTO: {data.drMetrics.rtoActual}
          </div>
        </div>
      </div>
    </CardShell>
  )
}
