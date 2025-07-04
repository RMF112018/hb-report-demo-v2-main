"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function AiPipelineStatusCard() {
  const data = mock.aiPipelines

  return (
    <CardShell title="AI Pipeline Status">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">{data.activeJobs}</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{data.completedToday}</div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Monthly Cost: ${data.costs.monthly.toLocaleString()}</div>
        </div>
      </div>
    </CardShell>
  )
}
