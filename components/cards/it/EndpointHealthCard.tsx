"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Laptop className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function EndpointHealthCard() {
  const data = mock.endpoints

  return (
    <CardShell title="Endpoint Health">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">{data.healthyDevices}</div>
            <div className="text-sm text-muted-foreground">Healthy Devices</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{data.criticalDevices}</div>
            <div className="text-sm text-muted-foreground">Critical Issues</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Patch Compliance: {data.patchCompliance}%</div>
        </div>
      </div>
    </CardShell>
  )
}
