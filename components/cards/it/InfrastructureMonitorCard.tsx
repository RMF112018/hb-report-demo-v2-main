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
      <div className="h-full flex flex-col">
        <div className="text-sm text-muted-foreground mb-4">Real-time infrastructure monitoring and system health</div>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{data.uptime}</div>
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">System Uptime</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">Last 30 days</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {data.servers.online}/{data.servers.total}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Servers Online</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active now</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Primary ISP</span>
            <span className="text-sm font-medium">{data.networkHealth.primaryISP.provider}</span>
          </div>
        </div>
      </div>
    </CardShell>
  )
}
