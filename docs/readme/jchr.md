# JCHR (Job Cost History Report) Module

## Overview
The JCHR module provides comprehensive job cost history reporting with detailed breakdown of project costs, variance analysis, and financial performance metrics. It enables project managers and executives to track actual vs. budgeted costs across all divisions and cost codes.

## Module Purpose
- **Cost Tracking**: Monitor actual costs against budgeted amounts across all project divisions
- **Variance Analysis**: Identify cost overruns and savings opportunities
- **Financial Performance**: Calculate profit margins, budget utilization, and project health indicators
- **Division Management**: Organize costs by division with collapsible sections for detailed analysis
- **Real-time Insights**: Provide current period spend analysis and budget progression tracking

## Data Schema Reference (jchr.json)

### Project Structure
```json
{
  "project_id": 2525804,
  "project_name": "HB Report Demo Project",
  "jobCostItems": [
    {
      "costCode": "1000.10-01-571.MAT",
      "description": "1000 - HB REPORT DEMO PROJECT-CONSTR.EROSION & SEDIMENT CONTROL.Materials",
      "budgetAmount": 1850000.00,
      "actualCost": 1925000.00,
      "commitments": 1800000.00,
      "variance": 75000.00,
      "percentComplete": 65.2,
      "lastUpdated": "2025-01-27T14:41:42Z"
    }
  ]
}
```

### Cost Code Format
Cost codes follow the format: `DIVISION.SECTION-CATEGORY-CODE.TYPE`
- **DIVISION**: Major project division (e.g., 1000, 2000, 3000)
- **SECTION**: Sub-division within major division
- **CATEGORY**: Specific cost category
- **CODE**: Unique identifier
- **TYPE**: Cost type (MAT, LAB, LBN, SUB, OVH)

### Cost Types
- **MAT**: Materials
- **LAB**: Labor
- **LBN**: Labor Burden
- **SUB**: Subcontractor
- **OVH**: Overhead

## Widget Definition Logic

### Summary Widgets (Top Row)
1. **Contract Value**: Total budget × 1.15 (15% markup assumption)
2. **Profit Margin**: ((Contract Value - Actual Cost) / Contract Value) × 100
3. **Financial Health**: 100 - (|Total Variance| / Total Budget) × 100
4. **Total Cost to Date**: Sum of all actualCost values
5. **Current Period Spend**: actualCost × 0.12 (12% assumption for current period)
6. **% Budget Spent**: (actualCost / budgetAmount) × 100

### Variance to Budget Widget
- **Calculation**: actualCost - budgetAmount
- **Color Coding**: 
  - Red: Over budget (positive variance)
  - Green: Under budget (negative variance)

## UI Behavior and Filtering

### Table Features
- **Sortable Columns**: Cost Code, Budget, Actual Cost, Variance
- **Collapsible Divisions**: Click chevron to expand/collapse division details
- **Category Filtering**: Dropdown filter for Material, Labor, Labor Burden, Subcontract, Overhead
- **Search Functionality**: Search by cost code or description
- **Export Functionality**: Export table data (placeholder implementation)

### Division Grouping
- Costs are automatically grouped by division (extracted from cost code)
- Each division shows subtotals for Budget, Actual, Commitments, Variance
- Grand total row shows project-wide totals

### Color Coding
- **Materials**: Blue badges and borders
- **Labor**: Green badges and borders  
- **Labor Burden**: Yellow badges and borders
- **Subcontract**: Purple badges and borders
- **Overhead**: Gray badges and borders
- **Variance**: Red (over budget) / Green (under budget)

### Responsive Design
- **Mobile**: 2-column widget layout
- **Tablet**: 3-column widget layout
- **Desktop**: 6-column widget layout
- **Table**: Horizontal scrolling on small screens

## Integration Points

### Financial Hub Integration
- Added as tab in Financial Hub with ID: "jchr"
- Uses standard Financial Hub layout and theming
- Integrates with role-based access control
- Follows existing module patterns

### Data Filtering
- Filters data by `project_id: 2525804` as specified
- Supports multiple projects in data structure
- Graceful fallback to first project if target not found

## Future Enhancements

### Planned Features
1. **Cost Forecast Overlays**: Predictive analytics for future cost trends
2. **Commitment Tracking**: Enhanced commitment vs. actual cost analysis
3. **Time-series Analysis**: Historical cost progression charts
4. **Drill-down Capabilities**: Link to detailed cost transactions
5. **Budget Revision Tracking**: Track budget changes over time
6. **Real-time Updates**: Live data synchronization
7. **Advanced Filtering**: Date range, vendor, and multi-select filters
8. **Export Enhancements**: PDF reports, Excel exports with formatting
9. **Benchmark Comparisons**: Compare against similar projects
10. **Alert System**: Automated notifications for budget overruns

### Technical Improvements
- **Performance Optimization**: Lazy loading for large datasets
- **Caching Strategy**: Implement data caching for faster load times
- **API Integration**: Replace mock data with real API endpoints
- **Real-time Data**: WebSocket integration for live updates
- **Data Validation**: Enhanced error handling and data validation

### UI/UX Enhancements
- **Interactive Charts**: Add cost trend visualizations
- **Advanced Filters**: Multi-select, date range, and saved filter sets
- **Customizable Views**: User-defined column visibility and ordering
- **Bulk Operations**: Multi-select and bulk update capabilities
- **Mobile Optimization**: Enhanced mobile experience

## File Structure
```
components/financial-hub/JCHRCard.tsx     # Main component
data/mock/financial/jchr.json             # Mock data source
app/dashboard/financial-hub/page.tsx      # Integration point
docs/readme/jchr.md                       # This documentation
```

## Dependencies
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Shadcn/ui components
- Next.js framework

## Usage Example
```tsx
import JCHRCard from "@/components/financial-hub/JCHRCard";

<JCHRCard 
  userRole="project-manager"
  projectData={projectData}
/>
```

## Notes
- Component uses project_id: 2525804 as specified in requirements
- Mock data includes 15 cost items across 3 divisions (1000, 2000, 3000)
- All currency values are formatted using Intl.NumberFormat
- Responsive design follows established patterns from other Financial Hub modules
- Error handling includes graceful fallbacks for missing data 