"use client"

import React from "react"
import { Package } from "lucide-react"

export default function AssetsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
          <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset & License Lifecycle</h1>
          <p className="text-muted-foreground">IT asset and license management</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Asset & License Lifecycle</h2>
          <p className="text-muted-foreground">
            This module will provide comprehensive IT asset and license management capabilities.
          </p>
        </div>
      </div>
    </div>
  )
}
