# Change Management Module Documentation

## Overview

The Change Management module provides comprehensive tracking and analysis of change orders, potential change orders (PCOs), prime contract change orders (PCCOs), and commitment change orders (CCOs) within the HB Report Financial Hub. This module enables project teams to monitor change exposure, track approval workflows, and analyze financial impact across all change-related activities.

## Key Features

### 1. Change Order Overview
- **KPI Dashboard**: Real-time metrics for approved, pending, and rejected change orders
- **Monthly Trends**: Visual tracking of change order submission and approval patterns
- **Category Breakdown**: Analysis by trade/category with pie chart visualization
- **Financial Impact**: Cumulative change order impact on project budget

### 2. Change Order Tracking
- **Interactive Table**: Detailed tracking of all change orders with status, amounts, and timelines
- **Status Management**: Visual status indicators (Approved, Pending, Rejected)
- **Category Filtering**: Filter by trade category for focused analysis
- **Impact Assessment**: Schedule and cost impact tracking

### 3. Risk Analysis
- **Value Distribution**: Change order values by approval status
- **Risk Assessment**: Multi-factor risk scoring for schedule, budget, and scope
- **Financial Impact**: Percentage of original budget analysis

### 4. **Exposure Analysis** (New Feature)
Advanced risk metrics for change orders and commitments, providing deep insights into contract change exposure.

## Exposure Analysis Components

### Owner vs Subcontractor Delta
Compares Total Approved Prime Contract Change Orders (PCCOs) with Total Executed Commitment Change Orders (CCOs):
- **Delta Calculation**: PCCO Total – CCO Total
- **Risk Indicators**: 
  - 🟢 Low Risk: <5% variance
  - 🟡 Medium Risk: 5-10% variance
  - 🔴 High Risk: >10% variance
- **Purpose**: Identifies exposure gaps between owner approvals and subcontractor commitments

### Unapproved Exposure
Calculates potential financial exposure from unprocessed changes:
- **Total Identified Exposure**: Sum of Change Events + Pending PCOs
- **Unapproved Exposure**: Identified – Approved PCCOs
- **Risk Thresholds**:
  - 🟢 Low: <$25,000
  - 🟡 Medium: $25,000-$50,000
  - 🔴 High: >$50,000

### Risk Scorecard
Key performance indicators for change management process:
- **% Change Dollars Pending**: Percentage of change value awaiting approval
- **Avg Days PCO to PCCO**: Processing time from submission to execution
- **% PCOs Unlinked to PCCO**: Process gap identification
- **Largest Open Exposure**: Single highest-risk unprocessed item

## Data Sources and Definitions

### Project Filtering
All data is filtered by `project_id: 2525840` (PALM BEACH LUXURY ESTATE) to ensure project-specific analysis.

### Data Sources (Mock JSON)
1. **change-events.json**: Identified change events with pricing
2. **pco.json**: Potential Change Orders submitted for approval
3. **pcco.json**: Prime Contract Change Orders (owner-approved changes)
4. **cco.json**: Commitment Change Orders (subcontractor-executed changes)

### Key Definitions

#### Change Events
Initial identification of potential changes with:
- `event_id`: Unique identifier
- `event_title`: Description of change
- `latest_price`: Current estimated cost
- `over_under_budget`: Budget impact

#### PCO (Potential Change Order)
Formal change request submitted for approval:
- `pco_number`: Unique PCO identifier
- `status`: Pending/Approved/Rejected
- `amount`: Requested change amount
- `change_reason`: Justification category

#### PCCO (Prime Contract Change Order)
Owner-approved change to prime contract:
- `pcco_number`: Unique PCCO identifier
- `status`: Approval status
- `executed`: Implementation status
- `amount`: Approved change amount

#### CCO (Commitment Change Order)
Subcontractor-executed change to commitments:
- `contract`: Related subcontract
- `contract_company`: Executing subcontractor
- `amount`: Executed change amount
- `status`: Execution status

## Calculation Methods

### Delta Analysis
```
Owner vs Subcontractor Delta = Total Approved PCCOs - Total Executed CCOs
Delta Percentage = (Delta / Total Executed CCOs) × 100
```

### Exposure Analysis
```
Total Identified Exposure = Sum(Change Events) + Sum(Pending PCOs)
Unapproved Exposure = Total Identified Exposure - Sum(Approved PCCOs)
```

### Risk Metrics
```
% Change Dollars Pending = (Pending PCO Value / Total PCO Value) × 100
Processing Time = Average days from PCO submission to PCCO execution
Unlinked Percentage = (Unlinked PCOs / Total PCOs) × 100
```

## User Roles and Permissions

### Project Manager
- Full access to all change management features
- Can create and modify change orders
- Access to exposure analysis and risk metrics
- Approval workflow management

### Project Executive
- Strategic overview of multiple projects
- Risk analysis and exposure metrics
- Executive dashboard with key KPIs
- Portfolio-level change analysis

### Accounting/Finance
- Financial impact analysis
- Budget variance tracking
- Cost reporting and analysis
- Audit trail access

## Technical Implementation

### Component Structure
- **Main Component**: `ChangeManagement.tsx`
- **View Modes**: Overview, Tracking, Analysis
- **Data Integration**: Real-time JSON data loading
- **Responsive Design**: Mobile-optimized layouts
- **Dark Theme**: Full dark mode compatibility

### Key Dependencies
- React hooks for state management
- Recharts for data visualization
- Tailwind CSS for styling
- Lucide React for icons

### Performance Considerations
- Memoized calculations for complex risk metrics
- Efficient data filtering by project ID
- Optimized re-renders with useMemo hooks

## Future Enhancements

### Planned Features
1. **Real-time Integration**: Connect to live project management systems
2. **Automated Alerts**: Threshold-based notifications for high-risk exposures
3. **Advanced Analytics**: Machine learning for change prediction
4. **Workflow Automation**: Streamlined approval processes
5. **Document Management**: Attachment and document tracking
6. **Audit Trail**: Complete change history logging

### Integration Roadmap
- **Procore Integration**: Direct PCO/change order synchronization
- **Sage Integration**: Financial system connectivity
- **DocuSign Integration**: Digital approval workflows
- **Mobile App**: Field-based change order creation

## Support and Training

### Getting Started
1. Navigate to Financial Hub → Change Management
2. Review the Overview tab for current status
3. Use Tracking tab for detailed change order management
4. Access Analysis tab for strategic insights
5. Explore Exposure Analysis for risk assessment

### Best Practices
- Regular review of exposure analysis metrics
- Proactive management of high-risk deltas
- Timely PCO processing to minimize exposure
- Documentation of all change justifications
- Cross-reference with budget and schedule impacts

### Troubleshooting
- **Missing Data**: Verify project ID filtering (2525840)
- **Calculation Errors**: Check JSON data completeness
- **Performance Issues**: Clear browser cache and refresh
- **Access Issues**: Verify user role permissions

## Contact Information

For technical support or feature requests related to the Change Management module, please contact the HB Report development team or submit an issue through the project management system.

---

*Last Updated: December 2024*
*Version: 2.1 - Exposure Analysis Enhancement* 