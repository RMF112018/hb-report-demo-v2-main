# Role-Based Project Access System

## Overview

The HB Report Demo application implements a comprehensive role-based project access control system that filters both the sidebar project menu and dashboard data based on user roles. This system provides a realistic demo environment that reflects real-world project management permissions.

## User Roles and Access Levels

### Executive

- **Access**: All projects across all stages
- **Project Count**: Full portfolio (20 projects)
- **Description**: Full access to all projects across all stages
- **Dashboard**: Portfolio-wide financial analysis and strategic insights

### Project Executive

- **Access**: Specific strategic projects
- **Project Count**: 9 projects
- **Breakdown**:
  - 5 Construction projects
  - 1 BIM Coordination project
  - 2 Pre-Construction projects
  - 1 Bidding project
- **Description**: Portfolio management access to strategic projects
- **Dashboard**: Multi-project financial management and client reporting

### Project Manager

- **Access**: Assigned projects only
- **Project Count**: 2 projects
- **Breakdown**:
  - 1 BIM Coordination project (Tallahassee Government Complex)
  - 1 Construction project (Palm Beach Luxury Estate)
- **Description**: Direct project management access to assigned projects
- **Dashboard**: Active project financial control and cost management

### Estimator

- **Access**: Pre-construction related projects
- **Project Count**: Variable (by stage)
- **Stages**: Pre-Construction, BIM Coordination, Bidding
- **Description**: Access to pre-construction and bidding projects
- **Dashboard**: Estimating and bidding tools

### Administrator

- **Access**: All projects (administrative)
- **Project Count**: Full portfolio
- **Description**: Administrative access to all projects
- **Dashboard**: IT Command Center

### Team Member

- **Access**: Active construction projects
- **Project Count**: Variable (by stage)
- **Stages**: Construction, Closeout, Warranty
- **Description**: Access to active construction projects

### Superintendent

- **Access**: Construction site projects
- **Project Count**: Variable (by stage)
- **Stages**: Construction, Closeout, Warranty
- **Description**: Site supervision access to construction projects

## Implementation Details

### Project Filtering System

The system uses a utility-based approach with centralized configuration:

```typescript
// lib/project-access-utils.ts
export function filterProjectsByRole(projects: ProjectData[], userRole: UserRole): ProjectData[]
```

### Key Features

1. **Centralized Configuration**: All access rules defined in `ROLE_PROJECT_ACCESS` object
2. **Dynamic Filtering**: Projects filtered at application level before passing to components
3. **Statistical Dashboard**: Real-time project statistics based on accessible projects
4. **Sidebar Integration**: Project tree automatically reflects user permissions
5. **Access Information Display**: Users see their access level description in dashboard

### Access Types

- **`all`**: Full access to all projects (Executive, Admin)
- **`specific`**: Access to specific project IDs (Project Executive, Project Manager)
- **`by-stage`**: Access based on project stages (Estimator, Team Member, Superintendent)

## Demo Project Assignments

### Project Executive Portfolio (9 projects)

- **Palm Beach Luxury Estate** (Construction)
- **Fort Lauderdale Hotel Resort** (Construction)
- **Pensacola Corporate Campus** (Construction)
- **Boca Raton Corporate Headquarters** (Construction)
- **Aventura Retail Plaza** (Construction)
- **Tampa Medical Center** (BIM Coordination)
- **Naples Waterfront Condominium** (Pre-Construction)
- **Sarasota Cultural Center** (Pre-Construction)
- **Miami Commercial Tower** (Bidding)

### Project Manager Assignments (2 projects)

- **Tallahassee Government Complex** (BIM Coordination)
- **Palm Beach Luxury Estate** (Construction)

## Benefits

1. **Realistic Demo Environment**: Reflects real-world access patterns
2. **Role-Appropriate Data**: Users see only relevant projects
3. **Simplified Navigation**: Reduced cognitive load from irrelevant projects
4. **Security Demonstration**: Shows access control capabilities
5. **Scalable Architecture**: Easy to modify access rules

## Technical Architecture

### Main Components

1. **Project Access Utils** (`lib/project-access-utils.ts`)

   - Central configuration
   - Filtering functions
   - Statistics calculations

2. **Main Application** (`app/main-app/page.tsx`)

   - Project data transformation
   - Role-based filtering application
   - Data passing to child components

3. **Project Sidebar** (`app/main-app/components/ProjectSidebar.tsx`)

   - Displays filtered projects
   - Stage-based organization
   - Search functionality

4. **Role Dashboard** (`app/main-app/components/RoleDashboard.tsx`)
   - Role-specific welcome messages
   - Project statistics display
   - Access information

### Data Flow

1. User logs in with assigned role
2. All projects loaded from mock data
3. Projects filtered by role using utility function
4. Filtered projects passed to sidebar and dashboard
5. Dashboard displays role-appropriate statistics
6. Sidebar shows only accessible projects

## Future Enhancements

1. **Dynamic Role Assignment**: User interface for changing roles
2. **Project Assignment Management**: Admin interface for assigning projects
3. **Audit Trail**: Logging of project access attempts
4. **Granular Permissions**: Module-level access control within projects
5. **Time-based Access**: Temporary project access with expiration
