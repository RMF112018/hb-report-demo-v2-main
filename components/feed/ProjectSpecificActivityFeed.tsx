"use client"

import React from "react"
import { ProjectActivityFeed } from "./ProjectActivityFeed"
import { ActivityFeedConfig } from "@/types/activity-feed"

interface ProjectSpecificActivityFeedProps {
  projectId: number
  userRole: "executive" | "project-executive" | "project-manager" | "estimator" | "admin"
  className?: string
}

/**
 * Project-specific Activity Feed component
 *
 * This component can be used in individual project pages to show
 * only activities related to that specific project.
 */
export function ProjectSpecificActivityFeed({ projectId, userRole, className }: ProjectSpecificActivityFeedProps) {
  const config: ActivityFeedConfig = {
    userRole,
    projectId,
    showFilters: true,
    showPagination: true,
    itemsPerPage: 15,
    allowExport: true,
  }

  return <ProjectActivityFeed config={config} className={className} />
}

// Example usage in a project page:
//
// ```tsx
// import { ProjectSpecificActivityFeed } from "@/components/feed/ProjectSpecificActivityFeed"
//
// export default function ProjectPage({ params }: { params: { projectId: string } }) {
//   const projectId = parseInt(params.projectId)
//   const userRole = "project-manager" // This would come from your auth context
//
//   return (
//     <div className="container mx-auto py-6">
//       <ProjectSpecificActivityFeed
//         projectId={projectId}
//         userRole={userRole}
//       />
//     </div>
//   )
// }
// ```
