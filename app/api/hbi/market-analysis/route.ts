import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "HBI Market Analysis API",
    data: {
      marketTrends: [],
      insights: [],
      recommendations: [],
    },
  })
}
