import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET(_request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = decodeURIComponent(params.filename)
    const filePath = join(process.cwd(), "public", "drawings", filename)

    const fileBuffer = await readFile(filePath)

    const response = new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
      },
    })

    // Explicitly set X-Frame-Options to allow iframe embedding
    response.headers.set("X-Frame-Options", "SAMEORIGIN")

    return response
  } catch (error) {
    console.error("Error serving PDF:", error)
    return new NextResponse("PDF not found", { status: 404 })
  }
}
