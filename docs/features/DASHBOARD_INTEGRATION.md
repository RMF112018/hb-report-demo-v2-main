# Dashboard Integration Documentation

## Overview

The HB Report Demo application has been enhanced with a comprehensive role-based dashboard system that provides personalized analytics and insights for different user roles. The dashboard uses a modular, card-based layout system that dynamically loads content based on user permissions and responsibilities.

## Architecture

### Core Components

1. **Dashboard Layout System**

   - `DashboardLayout.tsx` - Main layout component with tabs and grid management
   - `DashboardGrid.tsx` - Advanced grid system with drag-and-drop functionality
   - `DashboardCardWrapper.tsx` - Individual card container with actions and theming

2. **Role-Based Content**

   - `RoleDashboard.tsx` - Dynamic dashboard content based on user role
   - `useDashboardLayout.ts` - Hook for loading and managing dashboard layouts
   - Layout JSON files for each role configuration

3. **Main Application Integration**
   - `MainApplicationPage.tsx` - Primary entry point after login
   - `ProjectSidebar.tsx` - Project navigation with role-based filtering
   - `ProjectContent.tsx` - Project-specific content renderer

## User Roles & Dashboards

### Executive Dashboard

- **Role**: `executive`
- **Layouts**: `executive-layout.json` (Overview) + `executive-financial-layout.json` (Financial Review)
- **Features**:
  - Portfolio overview with 10 analytical cards
  - Company-wide financial metrics
  - Strategic insights and KPIs
  - Market intelligence and pipeline analytics
  - Executive-optimized 16-column grid layout
  - **Financial Review Tab**: Comprehensive financial dashboard with portfolio-level analysis

### Project Executive Dashboard

- **Role**: `project-executive`
- **Layouts**: `project-executive-layout.json` (Portfolio) + `project-executive-financial-layout.json` (Financial Review)
- **Features**:
  - Portfolio management with 14 cards
  - Client relations and project oversight
  - Multi-project monitoring and reporting
  - Business development opportunities
  - **Financial Review Tab**: Portfolio financial management and client reporting

### Project Manager Dashboard

- **Role**: `project-manager`
- **Layouts**: `project-manager-layout.json` (Projects) + `project-manager-financial-layout.json` (Financial Review)
- **Features**:
  - Active project management with 13 cards
  - Construction-focused tools and metrics
  - Safety and quality control monitoring
  - Schedule and budget tracking
  - **Financial Review Tab**: Project financial control and cost management

### Estimator Dashboard

- **Role**: `estimator`
- **Layout**: `estimator-layout.json`
- **Features**:
  - Pre-construction and bidding tools
  - Cost analysis and market intelligence
  - Bid tracking and win rate analytics
  - Pipeline management

### IT Administrator Dashboard

- **Role**: `admin`
- **Layout**: `it-layout.json`
- **Features**:
  - System health and infrastructure monitoring
  - Security and backup management
  - User access and asset tracking
  - AI pipeline and consultant dashboard

## Multi-Tab Dashboard System

The dashboard system supports multiple tabs per role, allowing users to switch between different views:

### Available Tabs by Role

1. **Executive**:

   - Overview (default) - Portfolio and strategic insights
   - Financial Review - Executive financial dashboard
   - Action Items - Executive action tracking (planned)
   - Activity Feed - Company-wide activity stream

2. **Project Executive**:

   - Portfolio (default) - Project portfolio management
   - Financial Review - Portfolio financial management
   - Action Items - Project executive action tracking
   - Activity Feed - Portfolio activity stream

3. **Project Manager**:

   - Projects (default) - Active project management
   - Financial Review - Project financial control
   - Action Items - Project manager action tracking
   - Activity Feed - Project activity stream

4. **Estimator**:

   - Dashboard (default) - Pre-construction and bidding tools
   - Activity Feed - Estimating activity stream

5. **IT Administrator**:
   - IT Command Center (default) - System health and monitoring

### Financial Review Tab

The Financial Review tab provides comprehensive financial management capabilities:

- **Executive Level**: Portfolio-wide financial analysis and strategic insights
- **Project Executive Level**: Multi-project financial management and client reporting
- **Project Manager Level**: Active project financial control and cost management

Features include:

- Real-time financial metrics and KPIs
- Budget variance analysis and forecasting
- Cash flow management and planning
- Pay application and change order tracking
- Performance metrics and reporting
- Export capabilities for financial reports

## Technical Implementation

### Layout Configuration

Dashboard layouts are defined in JSON files located in `public/data/mock/layouts/`:

```json
{
  "id": "executive-layout",
  "name": "Executive Dashboard",
  "description": "Portfolio health and financial overview",
  "role": "executive",
  "cards": [
    {
      "id": "financial-review-panel",
      "type": "financial-review-panel",
      "title": "Financial Review Panel",
      "size": "optimal",
      "position": { "x": 0, "y": 0 },
      "span": { "cols": 16, "rows": 5 },
      "visible": true,
      "config": {
        "executiveMode": true,
        "scope": "company-wide"
      }
    }
  ]
}
```

### Card Types

The system supports 30+ card types including:

- **Financial**: `financial-review-panel`, `financial-dashboard`, `cash-flow`, `budget-variance`
- **Operational**: `safety`, `quality-control`, `field-reports`
- **Analytics**: `enhanced-hbi-insights`, `pipeline-analytics`, `market-intelligence`
- **Project**: `project-overview`, `portfolio-overview`, `schedule-monitor`
- **IT**: `infrastructure-monitor`, `security-dashboard`, `backup-status`

**Special Card Types:**

- `financial-dashboard`: Full-featured financial management dashboard with comprehensive analytics, suitable for executive-level financial reporting and project-level cost control

### Grid System

- **16-column grid** optimized for executive dashboards
- **Responsive breakpoints**: Mobile (2), Tablet (4), Desktop (16)
- **Drag-and-drop editing** with collision detection
- **Smart positioning** with automatic layout optimization

## User Experience

### Authentication Flow

1. User logs in via `/login`
2. System determines user role based on email pattern
3. Redirects to `/main-app` (primary dashboard)
4. Loads appropriate dashboard layout for user role

### Navigation

- **Dashboard**: Default view with role-based analytics
- **Projects**: Tree-structured navigation by project stage
- **Project Content**: Detailed project-specific tools and data

### Responsive Design

- **Mobile**: Auto-collapse sidebar, simplified navigation
- **Tablet**: Adaptive grid with reduced columns
- **Desktop**: Full feature set with 16-column grid

## Configuration

### Adding New Roles

1. Create new layout JSON file in `public/data/mock/layouts/`
2. Add role mapping in `useDashboardLayout.ts`
3. Update user role detection in `MainApplicationPage.tsx`
4. Add role-specific card configurations

### Creating New Cards

1. Create card component in `components/cards/`
2. Add card type to `DashboardGrid.tsx` content renderer
3. Define optimal size in `getOptimalSize()` function
4. Add card icon and theming in `DashboardCardWrapper.tsx`

### Customizing Layouts

- **Edit Mode**: Toggle to enable drag-and-drop editing
- **Layout Density**: Compact, Normal, or Spacious spacing
- **Card Configuration**: Per-card settings and preferences
- **Persistence**: Save layouts to localStorage (planned: server sync)

## Performance Optimizations

- **Lazy Loading**: Cards load on demand with code splitting
- **Caching**: Component cache with TTL and LRU eviction
- **Preloading**: Intelligent preloading based on user patterns
- **Bundle Splitting**: 70-90% reduction in initial bundle size

## Testing

Run the dashboard layout validation:

```bash
node scripts/test-dashboard-layouts.js
```

This validates:

- All layout files are accessible
- Required fields are present
- Card configurations are valid
- JSON structure is correct

## Future Enhancements

1. **Server-side persistence** for custom layouts
2. **Real-time updates** via WebSocket integration
3. **Advanced analytics** with machine learning insights
4. **Custom card builder** for user-defined metrics
5. **Multi-tenant support** with organization-specific layouts

## Troubleshooting

### Common Issues

1. **Layout not loading**: Check console for fetch errors, verify files in `public/data/mock/layouts/`
2. **Cards not rendering**: Ensure card type is registered in `DashboardGrid.tsx`
3. **Role not recognized**: Verify email pattern in `MainApplicationPage.tsx`
4. **Grid positioning**: Check `span` and `position` values in layout JSON

### Debug Mode

Enable debug logging by adding to localStorage:

```javascript
localStorage.setItem("hb-dashboard-debug", "true")
```

This provides detailed logging for:

- Layout loading process
- Card rendering lifecycle
- User role detection
- Grid positioning calculations
