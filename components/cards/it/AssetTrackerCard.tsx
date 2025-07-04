"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import mock from "@/data/mock/it/commandCenterMock.json"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Package className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function AssetTrackerCard() {
  const data = mock.assets

  return (
    <CardShell title="Asset & License Tracker">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">{data.totalAssets}</div>
            <div className="text-sm text-muted-foreground">Total Assets</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{data.expiringSoon}</div>
            <div className="text-sm text-muted-foreground">Expiring Soon</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">
            License Cost: ${data.totalLicenseCost.toLocaleString()}/mo
          </div>
        </div>
      </div>
    </CardShell>
  )
}
