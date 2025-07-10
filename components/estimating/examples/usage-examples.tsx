/**
 * @fileoverview Estimating Module Usage Examples
 * @version v3.0.0
 * @description Examples of how to inject estimating components into other pages
 */

"use client"

import React, { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  EstimatingModuleWrapper,
  EstimatingModuleSkeleton,
  LazyEstimatingTracker,
  LazyCostSummaryModule,
  LazyBidManagement,
  AllowancesLog,
  ProjectEstimateOverview,
} from "../index"

// ==========================================
// EXAMPLE 1: Embedded in Project Dashboard
// ==========================================

export function ProjectDashboardWithEstimating({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Project Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project overview takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <EstimatingModuleWrapper
            title="Project Overview"
            description="Comprehensive project estimating overview"
            projectId={projectId}
            userRole="project-manager"
            isEmbedded={true}
            showCard={true}
          >
            <Suspense fallback={<EstimatingModuleSkeleton />}>
              <ProjectEstimateOverview viewMode="overview" userRole="project-manager" />
            </Suspense>
          </EstimatingModuleWrapper>
        </div>

        {/* Cost summary takes 1/3 of the space */}
        <div className="lg:col-span-1">
          <EstimatingModuleWrapper
            title="Cost Summary"
            projectId={projectId}
            userRole="project-manager"
            isEmbedded={true}
            showCard={true}
            className="h-full"
          >
            <Suspense fallback={<EstimatingModuleSkeleton />}>
              <LazyCostSummaryModule projectId={projectId} projectName="Sample Project" />
            </Suspense>
          </EstimatingModuleWrapper>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// EXAMPLE 2: Tabbed Interface
// ==========================================

export function EstimatingTabbedInterface({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estimating Center</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="bids">Bids</TabsTrigger>
          <TabsTrigger value="allowances">Allowances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EstimatingModuleWrapper projectId={projectId} userRole="estimator" isEmbedded={true} showCard={false}>
            <Suspense fallback={<EstimatingModuleSkeleton />}>
              <LazyEstimatingTracker onProjectSelect={(id) => console.log("Selected project:", id)} />
            </Suspense>
          </EstimatingModuleWrapper>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <EstimatingModuleWrapper title="Cost Summary" projectId={projectId} userRole="estimator" isEmbedded={true}>
            <Suspense fallback={<EstimatingModuleSkeleton />}>
              <LazyCostSummaryModule projectId={projectId} projectName="Sample Project" />
            </Suspense>
          </EstimatingModuleWrapper>
        </TabsContent>

        <TabsContent value="bids" className="space-y-4">
          <EstimatingModuleWrapper
            title="Bid Management"
            projectId={projectId}
            userRole="estimator"
            isEmbedded={true}
            showCard={false}
          >
            <Suspense fallback={<EstimatingModuleSkeleton />}>
              <LazyBidManagement userRole="estimator" />
            </Suspense>
          </EstimatingModuleWrapper>
        </TabsContent>

        <TabsContent value="allowances" className="space-y-4">
          <EstimatingModuleWrapper title="Allowances" projectId={projectId} userRole="estimator" isEmbedded={true}>
            <AllowancesLog />
          </EstimatingModuleWrapper>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==========================================
// EXAMPLE 3: Minimal Embedding
// ==========================================

export function MinimalEstimatingEmbed({ projectId }: { projectId: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Quick Cost Summary</h3>

      <EstimatingModuleWrapper
        projectId={projectId}
        userRole="viewer"
        isEmbedded={true}
        showCard={false}
        showHeader={false}
        className="max-h-96 overflow-y-auto"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <LazyCostSummaryModule projectId={projectId} projectName="Sample Project" />
        </Suspense>
      </EstimatingModuleWrapper>
    </div>
  )
}

/*
USAGE INSTRUCTIONS:

1. Import the components you need:
   import { EstimatingModuleWrapper, LazyEstimatingTracker } from '@/components/estimating'

2. Wrap your estimating components with EstimatingModuleWrapper:
   <EstimatingModuleWrapper
     title="Your Title"
     projectId="your-project-id"
     userRole="estimator"
     isEmbedded={true}
   >
     <LazyEstimatingTracker />
   </EstimatingModuleWrapper>

3. Use Suspense for lazy-loaded components:
   <Suspense fallback={<EstimatingModuleSkeleton />}>
     <LazyEstimatingTracker />
   </Suspense>

4. Configure for different use cases:
   - Embedded: isEmbedded={true}
   - Full page: isEmbedded={false}
   - With card: showCard={true}
   - Without card: showCard={false}
   - With header: showHeader={true}
   - Without header: showHeader={false}
*/
