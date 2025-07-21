# Activity Feed Feature Documentation

## Overview

The Activity Feed provides a centralized view of completed project-related activities for different user roles. It aggregates data from multiple internal and external systems to provide a comprehensive timeline of project activities.

## Features

### Core Functionality

- **Role-based filtering**: Different data sets based on user role (Executive, Project Executive, Project Manager, Estimator)
- **Real-time activity tracking**: Shows completed activities from various systems
- **Advanced filtering**: Filter by date range, activity type, source system, and search terms
- **Sorting**: Sort by date or activity type in ascending/descending order
- **Pagination**: Efficient handling of large activity sets
- **Export capabilities**: Export filtered results to CSV
- **Responsive design**: Works on desktop, tablet, and mobile devices

### User Role Configurations

#### Executive Activity Feed

- **Scope**: Activities from all projects
- **Data Volume**: 35+ activities spanning multiple project types
- **Sources**: All integrated systems (Procore, Building Connected, Compass, Sage, SiteMate, HB Report)

#### Project Executive Activity Feed

- **Scope**: Activities from 6 unique projects
- **Data Volume**: 15+ activities
- **Sources**: Mixed API tools and internal actions

#### Project Manager Activity Feed

- **Scope**: Activities from 1 assigned project
- **Data Volume**: 8+ activities
- **Sources**: Focus on Procore, SiteMate, and HB Report entries

#### Estimator Activity Feed

- **Scope**: No activities initially
- **Display**: Graceful empty state with informative message

## Data Sources

The Activity Feed integrates with the following systems:

### External Systems

- **Procore**: Submittals, RFIs, Commitments, Change Orders, Change Events, Drawings, Daily Logs, Inspections
- **Autodesk Building Connected**: Project creation, Bid package creation, Bid invitations, Proposal status, Correspondence
- **Compass (Compliance)**: Subcontractor compliance record updates
- **Sage**: Accounting updates (Pay Apps, Contracts, Budgets)
- **SiteMate**: Quality inspections, Deficiencies, Resolutions

### Internal Systems

- **HB Report App**: SPCR submissions, Forecasts, Assignments, Notes, and other internal tool actions

## Technical Implementation

### Components

#### Main Components

- `ProjectActivityFeed`: Main activity feed component with filtering and pagination
- `ProjectSpecificActivityFeed`: Project-scoped version for individual project pages

#### Supporting Files

- `types/activity-feed.ts`: TypeScript interfaces and types
- `data/mock/activity-feed.json`: Mock data for demonstration
- `hooks/use-activity-feed.ts`: Custom hook for data management

### Usage Examples

#### Dashboard Integration

```tsx
// In DashboardLayout.tsx
<ProjectActivityFeed
  config={{
    userRole: "executive",
    showFilters: true,
    showPagination: true,
    itemsPerPage: 20,
    allowExport: true,
  }}
/>
```

#### Project Page Integration

```tsx
// In project/[projectId]/page.tsx
<ProjectSpecificActivityFeed projectId={2525840} userRole="project-manager" />
```

#### Custom Hook Usage

```tsx
// Custom implementation with the hook
const { data, filters, setFilters, exportToCSV } = useActivityFeed({
  userRole: "project-executive",
  projectId: 2525840,
  showFilters: true,
  showPagination: true,
  itemsPerPage: 15,
  allowExport: true,
})
```

### Data Structure

#### Activity Feed Item

```typescript
interface ActivityFeedItem {
  id: string
  project_id: number
  project_name: string
  type: ActivityType
  description: string
  timestamp: string
  source: ActivitySource
  user?: string
  metadata?: {
    [key: string]: any
  }
}
```

#### Activity Types

- `submittal`, `rfi`, `commitment`, `change_order`, `change_event`
- `drawing`, `daily_log`, `inspection`, `bid_package`, `bid_invitation`
- `proposal`, `correspondence`, `compliance`, `pay_app`, `contract`
- `budget`, `quality_inspection`, `deficiency`, `resolution`
- `spcr`, `forecast`, `assignment`, `note`

#### Activity Sources

- `procore`, `building_connected`, `compass`, `sage`, `sitemate`, `hb_report`

## UI/UX Features

### Filtering System

- **Date Range**: Today, This Week, Last 30 Days, Custom Range
- **Activity Types**: Multi-select checkbox filters
- **Sources**: Multi-select checkbox filters
- **Search**: Full-text search across project names, descriptions, and types

### Visual Design

- **Color-coded badges**: Each activity type has a distinct color
- **Alternating row striping**: Improved readability
- **Responsive table**: Collapses appropriately on mobile devices
- **Loading states**: Skeleton loading for better UX
- **Empty states**: Informative messages when no data is available

### Accessibility

- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: Proper ARIA labels and descriptions
- **High contrast**: Accessible color schemes
- **Focus indicators**: Clear focus states for interactive elements

## Future Enhancements

### Phase 1 (Current)

- ✅ Mock data implementation
- ✅ Basic filtering and sorting
- ✅ Role-based data display
- ✅ Export functionality
- ✅ Responsive design

### Phase 2 (Planned)

- 🔄 Real-time data integration with APIs
- 🔄 WebSocket support for live updates
- 🔄 Advanced date range picker
- 🔄 Bulk actions on activities
- 🔄 Activity detail modal/drawer

### Phase 3 (Future)

- 📋 Activity notifications and alerts
- 📋 Custom activity types
- 📋 Advanced analytics and insights
- 📋 Integration with project timelines
- 📋 Mobile app support

## API Integration Points

### Future API Endpoints

```typescript
// GET /api/activity-feed
// Query parameters: role, projectId, dateRange, types, sources, search, page, limit

// GET /api/activity-feed/export
// Query parameters: format (csv, pdf), filters

// POST /api/activity-feed/mark-read
// Body: { activityIds: string[] }

// GET /api/activity-feed/stats
// Returns: activity counts by type, source, and date ranges
```

### Authentication

- All API calls require proper authentication
- Role-based access control enforced at API level
- Project-specific permissions respected

## Performance Considerations

### Optimization Strategies

- **Pagination**: Limits data load per request
- **Debounced search**: Prevents excessive API calls
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual scrolling**: For very large datasets (future enhancement)

### Caching Strategy

- Client-side caching of frequently accessed data
- Server-side caching with appropriate TTL
- Optimistic updates for better perceived performance

## Testing

### Unit Tests

- Component rendering tests
- Filter logic tests
- Data transformation tests
- Export functionality tests

### Integration Tests

- API integration tests
- End-to-end user flows
- Cross-browser compatibility tests

### Performance Tests

- Large dataset rendering tests
- Memory usage optimization tests
- Network request optimization tests

## Deployment Notes

### Environment Variables

```env
NEXT_PUBLIC_ACTIVITY_FEED_API_URL=https://api.example.com/activity-feed
ACTIVITY_FEED_CACHE_TTL=300
ACTIVITY_FEED_MAX_ITEMS_PER_PAGE=50
```

### Database Considerations

- Indexed columns: project_id, timestamp, type, source
- Archiving strategy for old activities
- Backup and recovery procedures

## Support and Maintenance

### Monitoring

- Activity feed performance metrics
- Error tracking and alerting
- Usage analytics and insights

### Documentation Updates

- Keep API documentation synchronized
- Update user guides as features evolve
- Maintain troubleshooting guides

---

_Last updated: December 2024_
_Version: 1.0.0_
