"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function SystemLogsCard() {
  const data = mock.systemLogs

  return (
    <CardShell title="System Logs">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-lg font-bold text-red-600">{data.errorLogs}</div>
            <div className="text-xs text-muted-foreground">Errors</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">{data.warningLogs}</div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{data.infoLogs}</div>
            <div className="text-xs text-muted-foreground">Info</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Total: {data.totalLogs.toLocaleString()} entries</div>
        </div>
      </div>
    </CardShell>
  )
}
