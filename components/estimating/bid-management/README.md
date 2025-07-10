# Bid Management Module

## Overview

The Bid Management Module is a comprehensive system for managing bidding projects, packages, and team collaboration within the HB Report Demo v3.0 application. This module follows the v-3.0.mdc architectural standards and implements enterprise-grade production requirements.

## Architecture

### Directory Structure

```
components/estimating/bid-management/
├── index.ts                          # Main exports
├── BidManagementCenter.tsx           # Main orchestrator component
├── components/                       # Feature components
│   ├── BidProjectList.tsx           # Project management
│   ├── BidPackageList.tsx           # Package management
│   ├── BidProjectDetails.tsx        # Project details view
│   ├── BidPackageDetails.tsx        # Package details view
│   ├── BidMessagePanel.tsx          # Message threading
│   ├── BidFileManager.tsx           # File & SharePoint integration
│   ├── BidTeamManager.tsx           # Team assignment
│   └── BidReportsPanel.tsx          # Analytics & reporting
├── hooks/                           # Custom hooks
│   ├── use-bid-projects.ts          # Project state management
│   └── use-bid-packages.ts          # Package state management
├── types/                           # TypeScript definitions
│   └── bid-management.ts            # Core types
└── mock-data/                       # Development data
    ├── bid-projects.json            # Sample projects
    └── bid-packages.json            # Sample packages
```

## Features

### Core Functionality

1. **Project Management**

   - View and manage bidding projects
   - Role-based access control
   - Project status tracking (active, awarded, lost, withdrawn)
   - Key date management
   - Team assignment

2. **Package Management**

   - Create and manage bid packages
   - Subcontractor invitation system
   - Response tracking and evaluation
   - Due date monitoring and alerts
   - Package status workflow

3. **Team Collaboration**

   - Team member assignment
   - Role-based permissions
   - Message threading (planned)
   - File sharing integration (planned)

4. **Analytics & Reporting**
   - Project and package statistics
   - KPI dashboard
   - Due date alerts
   - Performance metrics (planned)

### Technical Features

- **TypeScript Safety**: Comprehensive type definitions
- **React Hooks**: Custom hooks for state management
- **Mock Data Integration**: Development-ready data
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode Support**: Theme-aware components
- **Performance Optimized**: Memoized computations
- **Error Handling**: Graceful error states
- **Loading States**: Skeleton placeholders

## Components

### BidManagementCenter (Main Orchestrator)

The central component that coordinates all bid management functionality:

```typescript
<BidManagementCenter userRole="estimator" projectId="2525841" className="custom-classes" />
```

**Features:**

- Tabbed interface (Projects, Packages, Messages, Files, Team, Reports)
- KPI dashboard with real-time metrics
- Search and filtering capabilities
- Role-based UI adjustments
- Project/package selection workflow

### BidProjectList

Displays and manages a list of bid projects:

```typescript
<BidProjectList
  projects={projects}
  selectedProject={selectedProject}
  onProjectSelect={handleProjectSelect}
  onCreateProject={handleCreateProject}
  userRole="estimator"
/>
```

### BidPackageList

Manages bid packages within a project:

```typescript
<BidPackageList
  projectId="2525841"
  packages={packages}
  selectedPackage={selectedPackage}
  onPackageSelect={handlePackageSelect}
  onPackageCreate={handleCreatePackage}
  onPackageEdit={handlePackageEdit}
  onPackageDelete={handlePackageDelete}
/>
```

## Custom Hooks

### useBidProjects

Manages project state and operations:

```typescript
const {
  biddingProjects,
  selectedProject,
  isLoading,
  error,
  selectProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} = useBidProjects(projectId)
```

### useBidPackages

Manages package state and operations:

```typescript
const {
  packages,
  selectedPackage,
  isLoading,
  error,
  selectPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageStats,
  getPackagesDueSoon,
  getOverduePackages,
} = useBidPackages(projectId)
```

## Data Models

### BidProject

```typescript
interface BidProject {
  id: string
  name: string
  project_number: string
  location: string
  estimated_value: number
  status: "active" | "awarded" | "lost" | "withdrawn"
  client: string
  delivery_method: string
  team_lead?: string
  key_dates: {
    bid_due: string
    project_start: string
    project_end: string
  }
  packages: BidPackage[]
  team: TeamMember[]
  created_date: string
  last_modified: string
}
```

### BidPackage

```typescript
interface BidPackage {
  id: string
  projectId: string
  name: string
  scope: string
  description: string
  dueDate: string
  invitedSubs: string[]
  assignedTeam: TeamMember[]
  status: "draft" | "sent" | "responses-due" | "under-review" | "awarded"
  estimatedValue: number
  responses: BidResponse[]
  requirements: string[]
  attachments: BidAttachment[]
  created_date: string
  last_modified: string
}
```

## Integration

### Dashboard Integration

The module integrates with the estimator dashboard:

```typescript
// In RoleDashboard.tsx
case "bid-management":
  return (
    <EstimatingModuleWrapper
      title="Bid Management Center"
      description="Comprehensive bid management and BuildingConnected integration"
      userRole={userRole}
      isEmbedded={true}
      showCard={false}
      showHeader={false}
    >
      <BidManagementCenter userRole={userRole} />
    </EstimatingModuleWrapper>
  )
```

### EstimatingProvider Integration

Uses the EstimatingModuleWrapper to provide necessary context:

- EstimatingProvider context
- Role-based access control
- Embedded dashboard optimization
- Error boundary protection

## Development

### Mock Data

The module includes realistic mock data for development:

- **5 sample projects** with various statuses
- **3 sample packages** with responses and team assignments
- **Realistic team members** with roles and contact information
- **Bid responses** with line items and evaluation scores

### Testing

Mock data enables comprehensive testing scenarios:

- Project status workflows
- Package due date alerts
- Team assignment functionality
- Response evaluation process

## Implementation Status

### ✅ Completed (Phase 1)

- [x] Core architecture and directory structure
- [x] TypeScript type definitions
- [x] Mock data integration
- [x] Custom hooks for state management
- [x] Main orchestrator component
- [x] Project list and details components
- [x] Package list and details components
- [x] KPI dashboard with real-time metrics
- [x] Search and filtering capabilities
- [x] Role-based access control
- [x] Dashboard integration
- [x] Error handling and loading states
- [x] Responsive design and dark mode support

### 🚧 In Progress (Phase 2)

- [ ] Message threading system
- [ ] File management and SharePoint integration
- [ ] Team management interface
- [ ] Advanced reporting and analytics
- [ ] Create/edit modals for projects and packages
- [ ] Advanced filtering and sorting
- [ ] Export functionality

### 📋 Planned (Phase 3)

- [ ] Real API integration
- [ ] Advanced workflow automation
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Document generation
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] Performance optimizations

## Usage Example

```typescript
import { BidManagementCenter } from "./components/estimating/bid-management"

function EstimatorDashboard() {
  return <BidManagementCenter userRole="estimator" projectId="2525841" className="h-full" />
}
```

## Best Practices

1. **Component Composition**: Use the main orchestrator for full functionality
2. **State Management**: Leverage custom hooks for consistent state
3. **Error Handling**: Always handle loading and error states
4. **Type Safety**: Use provided TypeScript types
5. **Performance**: Utilize memoization for expensive operations
6. **Accessibility**: Follow ARIA guidelines for all interactions

## Contributing

When contributing to this module:

1. Follow the established directory structure
2. Add comprehensive TypeScript types
3. Include proper error handling
4. Add mock data for new features
5. Update this documentation
6. Follow the v-3.0.mdc standards
7. Test with different user roles

## Dependencies

- React 18+
- TypeScript 4.9+
- Lucide React (icons)
- Tailwind CSS (styling)
- UI component library (cards, buttons, etc.)

## License

Part of the HB Report Demo v3.0 application.
