"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Monitor className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function InfrastructureMonitorCard() {
  const data = mock.infrastructure

  return (
    <CardShell title="Infrastructure Monitor">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">{data.uptime}</div>
            <div className="text-sm text-muted-foreground">System Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {data.servers.online}/{data.servers.total}
            </div>
            <div className="text-sm text-muted-foreground">Servers Online</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">ISP: {data.networkHealth.primaryISP.provider}</div>
        </div>
      </div>
    </CardShell>
  )
}
