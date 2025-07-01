# AR Aging Module Documentation

## Purpose

The AR Aging module provides comprehensive accounts receivable aging analysis for construction projects within the HB Report Financial Hub. It tracks outstanding receivables across different aging periods (Current, 1-30 days, 31-60 days, and 60+ days) to help construction companies manage cash flow and collections effectively.

## Module Overview

- **Module Name:** AR Aging
- **Location:** `/components/financial-hub/ARAgingCard.tsx`
- **Version:** 2.1
- **Data Source:** Mock JSON from `data/mock/financial/ar-aging.json`
- **Project Filter:** Currently configured for Project ID 2525840 (Palm Beach Luxury Estate)

## Features

### Core Functionality
- **Project-specific filtering:** Displays AR aging records for a single project (2525840)
- **Aging categorization:** Organizes receivables into standard aging buckets
- **Financial totals:** Calculates totals for all aging categories in the table footer
- **Visual indicators:** Color-coded highlighting for overdue accounts
- **Search capability:** Full-text search across project name, manager, and comments
- **Export functionality:** CSV export of AR aging data

### Visual Highlighting
- **Red highlighting (`text-red-600`):** Rows with values in `days_60_plus` column
- **Yellow highlighting (`bg-yellow-100`):** Rows with values in `days_1_30` or `days_31_60` columns
- **Border indicators:** Left border color coding for quick visual assessment

### Summary Statistics
- **Total AR:** Overall accounts receivable balance
- **Current:** Current period receivables (not overdue)
- **1-60 Days:** Combined 1-30 and 31-60 day aging buckets
- **60+ Days:** Critical aging bucket requiring immediate attention

## Data Format

### Expected JSON Structure
```json
[
  {
    "project_id": 2525840,
    "project_name": "PALM BEACH LUXURY ESTATE",
    "project_manager": "Wanda",
    "percent_complete": 30,
    "balance_to_finish": 52971.91,
    "retainage": 0.0,
    "total_ar": 114143.56,
    "current": 55489.0,
    "days_1_30": 58654.56,
    "days_31_60": 0.0,
    "days_60_plus": 0.0,
    "comments": ""
  }
]
```

### Field Definitions
- `project_id`: Unique identifier for the construction project
- `project_name`: Human-readable project name
- `project_manager`: Project manager responsible for the project
- `percent_complete`: Project completion percentage (0-100)
- `balance_to_finish`: Remaining contract balance to be earned
- `retainage`: Amount held in retention
- `total_ar`: Total accounts receivable balance
- `current`: Current period receivables (0-30 days)
- `days_1_30`: Receivables aged 1-30 days
- `days_31_60`: Receivables aged 31-60 days
- `days_60_plus`: Receivables aged 60+ days (critical)
- `comments`: Additional notes or payment status information

## User Roles Impacted

### Primary Users
- **Project Managers:** Monitor individual project AR status and aging
- **Accounting/Finance Teams:** Manage collections and cash flow planning
- **Project Executives:** Review AR aging across project portfolios

### Secondary Users
- **Administrative Staff:** Generate reports and export data
- **Executive Leadership:** High-level AR aging overview and trends

## Filtering Logic

### Current Implementation
- **Hard-coded filter:** `project_id === 2525840`
- **Single project view:** Shows only Palm Beach Luxury Estate project
- **Demo mode:** Includes `DEMO` badge indicating mock data usage

### Search Functionality
- **Project name search:** Case-insensitive matching
- **Project manager search:** Case-insensitive matching  
- **Comments search:** Case-insensitive matching
- **Real-time filtering:** Results update as user types

## UI Components

### Table Structure
- **Sticky headers:** Headers remain visible while scrolling
- **Responsive design:** Adapts to different screen sizes
- **Scrollable container:** Max height prevents excessive vertical space usage
- **Row highlighting:** Conditional styling based on aging status

### Export Features
- **CSV export:** Downloads complete AR aging data
- **Formatted headers:** Human-readable column names
- **Quoted strings:** Proper CSV formatting for text fields

## Technical Implementation

### Key Dependencies
- React hooks (`useState`, `useMemo`)
- Tailwind CSS for styling
- Lucide React icons
- shadcn/ui components

### Performance Considerations
- `useMemo` for filtered data to prevent unnecessary re-calculations
- Efficient search implementation with debounced input
- Lazy loading for large datasets (future enhancement)

## Known Limitations

### Current Constraints
1. **Single project limitation:** Hard-coded to project ID 2525840
2. **Mock data dependency:** Uses static JSON file instead of live API
3. **No real-time updates:** Data refresh requires page reload
4. **Limited search scope:** Search only covers three fields
5. **No advanced filtering:** Cannot filter by aging periods or amount ranges

### Data Quality Issues
- Mock data contains limited comment information
- Some records may have zero values across multiple aging periods
- Project completion percentages may not reflect actual project status

## Future Roadmap

### Phase 1 Enhancements (v2.2)
- [ ] Dynamic project selection capability
- [ ] API integration for real-time data
- [ ] Advanced filtering options (aging periods, amount ranges)
- [ ] Sorting capabilities for all columns
- [ ] Pagination for large datasets

### Phase 2 Enhancements (v2.3)
- [ ] Historical AR aging trends and analytics
- [ ] Integration with collection management workflows
- [ ] Automated aging alerts and notifications
- [ ] Bulk action capabilities (payment posting, write-offs)
- [ ] Dashboard widgets for executive summaries

### Phase 3 Enhancements (v2.4)
- [ ] Predictive analytics for collection probability
- [ ] Integration with accounting systems (QuickBooks, Sage)
- [ ] Customer communication tracking
- [ ] Payment portal integration
- [ ] Mobile-responsive design improvements

## Installation and Usage

### Prerequisites
- Node.js and npm/pnpm installed
- Next.js 14+ application setup
- Tailwind CSS configuration
- shadcn/ui components installed

### Integration Steps
1. Place `ARAgingCard.tsx` in `/components/financial-hub/`
2. Add mock data file to `/data/mock/financial/ar-aging.json`
3. Import component in Financial Hub page
4. Add module to `financialModules` array
5. Test functionality and styling

### Usage Instructions
1. Navigate to Financial Hub in the application
2. Select the "AR Aging" tab
3. Review aging data for the configured project
4. Use search functionality to filter records
5. Export data using the "Export CSV" button
6. Monitor color-coded indicators for collection priorities

## Support and Maintenance

### Contact Information
- **Development Team:** HB Report Development Team
- **Version:** 2.1
- **Last Updated:** [Current Date]
- **Repository:** HB Report Demo v2.1

### Troubleshooting
- Verify mock data file path and structure
- Check component imports and dependencies
- Validate project ID filtering logic
- Review console for JavaScript errors

### Contributing
Please follow the established code style and documentation standards when contributing enhancements or bug fixes to the AR Aging module. 