# HB Report Demo v3.0

## Overview

Enterprise-grade construction project management platform with comprehensive role-based dashboards, fluid navigation architecture, and integrated IT operations management. HB Report Demo v3.0 represents the next evolution in construction intelligence with enterprise-grade production standards and responsive design across all device sizes.

## Architecture Overview

### Fluid Navigation System

HB Report Demo v3.0 features a sophisticated fluid navigation architecture designed for enterprise productivity:

- **64px Perpetual Collapsed Sidebar**: Always-visible navigation with quick access to core functions
- **320px Expandable Content Panels**: Rich content areas that expand on demand
- **HB Logo Integration**: Professional 180x60px branding with responsive header positioning
- **Mobile-Responsive Design**: Optimized for all device sizes with adaptive UI elements
- **Role-Based Content Loading**: Dynamic content delivery based on user permissions

### Authentication & Role Management

The platform supports comprehensive role-based access control:

```typescript
type UserRole =
  | "executive"
  | "project-executive"
  | "project-manager"
  | "estimator"
  | "admin"
  | "presentation"
  | "hr-payroll"
```

Each role provides tailored dashboard experiences and access to specific tools and features.

## Core Application Flow

### 1. Login & Authentication

**Route**: `/login`

- **Role-based authentication** with demo users for each role type
- **Seamless role switching** for demonstration purposes
- **Presentation mode** with guided tours and showcases
- **Enterprise SSO ready** for production deployment

### 2. Role-Based Dashboard Routing

#### Executive Dashboard

**Route**: `/main-app` (Executive role)

- **Portfolio Overview**: Comprehensive company-wide project metrics
- **Financial Review Panel**: Budget health, forecast indices, and cash flow analysis
- **Market Intelligence**: Business development opportunities and market positioning
- **Performance Metrics**: Schedule health, quality scores, and risk assessments
- **Strategic KPIs**: Executive-level dashboard cards with enterprise insights

#### Project Executive Dashboard

**Route**: `/main-app` (Project Executive role)

- **Project Portfolio Management**: Multi-project oversight and coordination
- **Resource Allocation**: Staffing and equipment distribution across projects
- **Risk Management**: Project-level risk assessment and mitigation strategies
- **Performance Analytics**: Project health scores and trend analysis
- **Responsibility Overview**: Task assignments and accountability tracking

#### Project Manager Dashboard

**Route**: `/main-app` (Project Manager role)

- **Active Project Management**: Real-time project status and progress tracking
- **Schedule Coordination**: Gantt charts, look-ahead scheduling, and milestone tracking
- **Team Management**: Staff assignments, productivity metrics, and communication
- **Quality Control**: Inspection schedules, compliance tracking, and documentation
- **Budget Monitoring**: Cost tracking, change orders, and financial health

#### Estimator Dashboard

**Route**: `/main-app` (Estimator role)

- **BidManagementCenter**: Primary tab with comprehensive bid management tools
- **BuildingConnected Integration**: Projects dashboard with API synchronization
- **Bid Form Templates**: Dynamic form builder with CSI scopes and regions
- **Cost Analytics**: Pricing analysis, historical data, and market trends
- **Proposal Management**: Bid tracking, submission workflows, and client communication

#### IT Administrator Dashboard

**Route**: `/it-command-center`

- **IT Command Center**: Comprehensive IT operations dashboard
- **System Overview**: Infrastructure monitoring and performance metrics
- **Help Desk Management**: Ticket tracking, priorities, and resolution metrics
- **Security Operations**: SIEM integration, threat monitoring, and compliance
- **Asset Management**: Hardware inventory, software licenses, and maintenance schedules

#### HR & Payroll Manager Dashboard

**Route**: `/main-app` (HR & Payroll Manager role)

- **HR Overview**: Employee management, payroll status, and benefits tracking
- **My Dashboard**: Personalized HR dashboard with key metrics and insights
- **Activity Feed**: Recent HR activities and updates
- **Employee Management**: Staff records, performance tracking, and compliance
- **Payroll Processing**: Payroll status monitoring and processing workflows

## Core Features & Modules

### 1. Project Management Suite

#### Scheduler & Planning

- **Project Schedule Gantt Chart**: Columnar layout with sticky columns (Activity ID, Activity, BL Start, BL Finish, Start, Finish)
- **Look Ahead System**: Streamlined single-column interface with 1-12 week planning windows
- **Update Management**: Progress tracking with previous update column support
- **Critical Path Analysis**: Schedule health monitoring and variance tracking

#### Field Operations

- **Field Reports**: Daily logs, weather integration, and progress documentation
- **Constraints Management**: Issue tracking, resolution workflows, and impact analysis
- **Permit Log**: Regulatory compliance tracking and submission management
- **Safety Management**: Incident reporting, certification tracking, and compliance monitoring

#### Financial Management

- **Budget Analysis**: Real-time budget health and variance tracking
- **Cash Flow Management**: Forecasting, AR aging, and payment processing
- **Change Order Management**: Approval workflows and cost impact analysis
- **Pay Application Processing**: AIA forms, billing cycles, and payment tracking

### 2. Pre-Construction Suite

#### Estimating & Bidding

- **BidManagementCenter**: Complete bid lifecycle management
- **BuildingConnected Platform**: API integration with filtering, sorting, and search
- **Bidder List Templates**: CSI scope organization and regional templates
- **Cost Summary Module**: Detailed cost breakdowns and analysis
- **Area Calculations**: Automated quantity takeoffs and measurements

#### Business Development

- **Pipeline Management**: Opportunity tracking and conversion analysis
- **Market Intelligence**: Competitive analysis and market positioning
- **Proposal Generation**: Automated proposal creation and customization
- **Client Relationship Management**: Contact tracking and communication history

### 3. IT Command Center

#### Comprehensive IT Operations

- **AI Pipelines**: Machine learning workflow management and monitoring
- **Asset Management**: Hardware and software inventory with lifecycle tracking
- **Backup Systems**: Data protection, recovery planning, and compliance
- **Consultant Management**: External IT service provider coordination
- **Email Security**: Threat protection, compliance, and user training
- **Endpoint Management**: Device security, policy enforcement, and updates
- **Governance**: IT policy management and compliance tracking
- **Infrastructure**: Network monitoring, performance optimization, and capacity planning
- **Management Tools**: IT service management and workflow automation
- **SIEM Integration**: Security information and event management

#### Help Desk Operations

- **Ticket Management**: Comprehensive issue tracking and resolution
- **Priority Classification**: Automated priority assignment and escalation
- **Performance Metrics**: Response times, resolution rates, and satisfaction scores
- **Knowledge Base**: Self-service documentation and troubleshooting guides

### 4. Advanced Analytics & Reporting

#### Power BI Integration

- **Embedded Visualizations**: Professional chart libraries with real-time data
- **Custom Chart Types**: Funnel charts, line charts, pie charts, bar charts, heatmaps, radar charts, and area charts
- **Performance Dashboards**: Live data badges and HB brand styling
- **Trend Analysis**: Historical data analysis and predictive modeling

#### Business Intelligence

- **KPI Dashboards**: Executive-level metrics and performance indicators
- **Operational Reporting**: Detailed operational reports and analytics
- **Compliance Reporting**: Regulatory compliance tracking and documentation
- **Custom Report Builder**: User-defined reports and visualizations

## Technical Architecture

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: React Context API with custom hooks
- **Data Visualization**: Recharts, Chart.js, and custom Power BI components
- **Authentication**: Enterprise-ready authentication system
- **Icons**: Lucide React icon library
- **Responsive Design**: Mobile-first approach with breakpoint optimization

### Performance & Scalability

- **Lazy Loading**: Dynamic component loading for optimal performance
- **Error Boundaries**: Comprehensive error handling and recovery
- **TypeScript Safety**: Full type safety throughout the application
- **Code Splitting**: Optimized bundle loading and caching
- **SEO Optimization**: Server-side rendering and metadata management

### Enterprise Features

- **Accessibility Compliance**: WCAG 2.1 AA compliance throughout
- **Security Standards**: Enterprise-grade security implementation
- **Audit Trail**: Comprehensive logging and activity tracking
- **Multi-tenancy Ready**: Scalable architecture for enterprise deployment
- **API Integration**: RESTful APIs with comprehensive documentation

## Navigation Structure

### Primary Navigation

```
├── Login (/login)
├── Main App (/main-app)
│   ├── Executive Dashboard (role: executive)
│   ├── Project Executive Dashboard (role: project-executive)
│   ├── Project Manager Dashboard (role: project-manager)
│   ├── Estimator Dashboard (role: estimator)
│   └── HR & Payroll Manager Dashboard (role: hr-payroll)
├── IT Command Center (/it-command-center)
├── Project Pages (/project/[projectId])
│   ├── Core Project Tools
│   ├── Scheduler
│   ├── Field Reports
│   ├── Financial Hub
│   ├── Quality Control
│   └── Safety Management
└── Pre-Construction (/pre-con)
    ├── Estimating
    ├── Business Development
    └── Pipeline Management
```

### Responsive Design

- **Desktop**: Full feature set with expanded navigation and panels
- **Tablet**: Optimized layout with collapsible panels and touch-friendly controls
- **Mobile**: Streamlined interface with hidden elements and gesture navigation
- **iPhone Specific**: Optimized badge and button visibility

## Development & Deployment

### Getting Started

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd hb-report-demo
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   # Configure environment variables
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Access Application**
   - Local: `http://localhost:3000`
   - Login with demo credentials for each role

### Production Deployment

- **Build Optimization**: `npm run build`
- **Static Export**: `npm run export`
- **Docker Ready**: Container deployment configuration
- **CDN Integration**: Asset optimization and delivery
- **Environment Management**: Multi-environment configuration

## Documentation & Support

### Component Documentation

- **Storybook Integration**: Comprehensive component documentation
- **API Documentation**: RESTful API specifications
- **Type Definitions**: Complete TypeScript type documentation
- **Code Examples**: Implementation examples and best practices

### Enterprise Support

- **Training Materials**: User guides and training documentation
- **Implementation Support**: Technical implementation assistance
- **Customization Services**: Tailored feature development
- **Integration Support**: Third-party system integration

## Version Information

**Current Version**: 3.0.0  
**Release Date**: 2024  
**License**: Enterprise License - Contact HB Development Team

### Key Improvements in v3.0

- **Complete architectural redesign** with fluid navigation
- **Enhanced role-based access control** and personalized dashboards
- **Comprehensive IT Command Center** with full operations management
- **Advanced Power BI integration** with custom visualizations
- **Mobile-responsive design** with optimized user experience
- **Enterprise-grade security** and compliance features
- **Modular architecture** for scalability and maintainability

---

_For technical support, customization requests, or enterprise licensing information, contact the HB Development Team._

# HB Intel Platform - Storybook Documentation

## Overview

This directory contains Storybook stories and documentation for the HB Intel Platform's Subcontract Buyout and Material Procurement feature. The stories demonstrate component usage across different user roles and scenarios with comprehensive AIA compliance support.

## Quick Start

### Prerequisites
- Node.js 18+
- Storybook 7+
- All project dependencies installed

### Running Storybook

\`\`\`bash
# Install Storybook (if not already installed)
npx storybook@latest init

# Start Storybook development server
npm run storybook
\`\`\`

### Building Storybook

\`\`\`bash
# Build static Storybook for deployment
npm run build-storybook
\`\`\`

## Story Structure

### Buyout Stories (`/stories/buyout/`)

1. **buyout-schedule.stories.tsx** - Main dashboard interface
2. **buyout-analytics.stories.tsx** - Analytics and performance metrics
3. **enhanced-buyout-form.stories.tsx** - Comprehensive buyout form
4. **material-procurement-table.stories.tsx** - Material management table
5. **bid-comparison-tool.stories.tsx** - Vendor bid analysis tool
6. **hbi-buyout-insights.stories.tsx** - AI-powered insights
7. **buyout-distribution-modal.stories.tsx** - Email distribution system

## User Role Scenarios

### Project Manager (PM) Stories
- Creating new buyout records from templates
- Managing material procurement and specifications
- Using bid comparison tools for vendor selection
- Submitting records for approval workflow
- Distributing contracts and documentation

### Project Executive (PX) Stories
- Reviewing submitted buyout records
- Approving/rejecting with detailed comments
- Managing multi-project oversight
- Monitoring compliance and risk metrics
- Accessing approval analytics

### Executive Stories
- Company-wide buyout overview
- Read-only access to approved records
- Portfolio analytics and trend visualization
- Strategic insights and market intelligence
- Executive dashboard exports

## Mock Data

Stories use realistic mock data from:
- `/data/mock-buyout-records.json` - Buyout data and metadata
- `/data/mock-material-procurement.json` - Material procurement records

### Mock Data Structure

**Buyout Records**:
\`\`\`json
{
  "buyoutRecords": [
    {
      "id": "bo_001",
      "projectId": "proj_001",
      "name": "Site Work & Excavation",
      "vendorName": "Pacific Excavation Inc.",
      "status": "active",
      "contractAmount": 1180000,
      "budgetAmount": 1200000,
      "complianceStatus": "compliant"
    }
  ]
}
\`\`\`

**Material Procurement**:
\`\`\`json
{
  "materialProcurementRecords": [
    {
      "id": "mp_001",
      "projectId": "proj_001",
      "item": {
        "name": "Structural Steel Beams",
        "quantity": 50,
        "unit": "tons"
      },
      "vendor": {
        "name": "Steel Supply Co"
      },
      "orderedStatus": "Delivered"
    }
  ]
}
\`\`\`

## Component Props Documentation

Each story includes comprehensive props documentation with:
- **Control types** for interactive testing
- **Description text** explaining prop usage
- **Default values** and expected formats
- **Validation rules** and constraints
- **AIA compliance** requirements

### Example Props Documentation

\`\`\`typescript
interface BuyoutAnalyticsProps {
  buyoutRecords: BuyoutRecord[]
  materialRecords: MaterialProcurement[]
  onDrillDown?: (metric: string, filters: any) => void
  className?: string
}
\`\`\`

## Interactive Features

### Controls Panel
Use Storybook's Controls panel to:
- Switch between user roles (PM, PX, Executive)
- Modify component props in real-time
- Test different data scenarios
- Simulate API connection states
- Adjust compliance settings

### Actions Panel
Monitor component interactions:
- Form submissions and validations
- API call simulations
- State changes and updates
- Error handling scenarios
- Approval workflow actions

## AIA Compliance Testing

### Compliance Scenarios

Stories include specific scenarios for testing AIA compliance:

1. **Complete Compliance**: All requirements met
2. **Partial Compliance**: Some requirements pending
3. **Non-Compliance**: Critical requirements missing
4. **Waiver Scenarios**: Approved compliance waivers

### AIA Document Generation

Test AIA-compliant document generation:
- **G702 Forms**: Application and Certificate for Payment
- **G703 Forms**: Continuation Sheet
- **Schedule of Values**: Detailed cost breakdown
- **Retention Calculations**: Proper retention handling
- **Lien Waivers**: Conditional and unconditional waivers

### Compliance Validation

Stories demonstrate compliance validation:
\`\`\`typescript
// Example compliance check
const complianceChecks = [
  { requirement: 'General Liability Insurance', status: 'approved' },
  { requirement: 'Performance Bond', status: 'pending' },
  { requirement: 'W-9 Form', status: 'missing' }
]
\`\`\`

## API Integration Testing

### Mock API Responses

Stories simulate various API integration states:

**BuildingConnected API**:
- Vendor performance data
- Bid history and win rates
- Project completion metrics

**Compass API**:
- Compliance status monitoring
- Risk assessment scores
- Documentation tracking

**SiteMate API**:
- Safety incident reports
- Quality inspection results
- Performance ratings

**Procore API**:
- Cost code integration
- Budget variance tracking
- Progress monitoring

**Sage 300 API**:
- Financial data integration
- Payment history tracking
- Vendor credit ratings

### Connection States

Test different API connection scenarios:
- **Connected**: Full API integration active
- **Disconnected**: Offline mode with cached data
- **Loading**: Connection in progress
- **Error**: API connection failures

## Development Workflow

### Adding New Stories

1. **Create Story File**
\`\`\`typescript
// stories/buyout/new-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { NewComponent } from '../../components/buyout/new-component'

const meta: Meta<typeof NewComponent> = {
  title: 'Buyout/NewComponent',
  component: NewComponent,
  parameters: {
    docs: {
      description: {
        component: 'Component description here'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof NewComponent>

export const Default: Story = {
  args: {
    // Default props
  }
}
\`\`\`

2. **Add Role-Based Variations**
\`\`\`typescript
export const PMView: Story = {
  args: {
    userRole: 'PM',
    // PM-specific props
  }
}

export const PXView: Story = {
  args: {
    userRole: 'PX',
    // PX-specific props
  }
}

export const ExecutiveView: Story = {
  args: {
    userRole: 'Executive',
    // Executive-specific props
  }
}
\`\`\`

3. **Include AIA Compliance Scenarios**
\`\`\`typescript
export const AIACompliant: Story = {
  args: {
    complianceStatus: 'compliant',
    aiaDocuments: {
      g702: true,
      g703: true,
      scheduleOfValues: true
    }
  }
}

export const AIANonCompliant: Story = {
  args: {
    complianceStatus: 'non-compliant',
    missingDocuments: ['insurance', 'bond']
  }
}
\`\`\`

### Testing Stories

\`\`\`bash
# Run story tests
npm run test-storybook

# Visual regression testing
npm run chromatic

# Accessibility testing
npm run test-storybook -- --testNamePattern="a11y"
\`\`\`

## Deployment

### Static Build
\`\`\`bash
# Build for deployment
npm run build-storybook

# Deploy to hosting service
# (Configure based on your deployment target)
\`\`\`

### Integration with CI/CD
Add Storybook builds to your CI pipeline:

\`\`\`yaml
# .github/workflows/storybook.yml
name: Build Storybook
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build-storybook
      - run: npm run test-storybook
\`\`\`

## Best Practices

### Story Organization
- Group related stories by feature area
- Use consistent naming conventions
- Include comprehensive prop documentation
- Provide realistic mock data
- Test all user role scenarios

### Documentation
- Write clear component descriptions
- Include usage examples and code snippets
- Document AIA compliance requirements
- Explain complex interactions
- Provide troubleshooting guidance

### Testing
- Cover all major user scenarios
- Test error states and edge cases
- Include accessibility testing
- Validate responsive behavior
- Test API integration states

### AIA Compliance
- Test all compliance scenarios
- Validate document generation
- Check retention calculations
- Verify lien waiver processing
- Test approval workflows

## Troubleshooting

### Common Issues

**Stories Not Loading**
- Check import paths are correct
- Verify component exports match imports
- Ensure mock data files exist
- Check TypeScript compilation errors

**Controls Not Working**
- Verify argTypes configuration
- Check prop types match controls
- Ensure component accepts props correctly
- Review default values

**Mock Data Issues**
- Validate JSON syntax in data files
- Check file paths in story imports
- Verify data structure matches interfaces
- Ensure all required fields are present

**AIA Compliance Issues**
- Check compliance data structure
- Verify document generation logic
- Test retention calculations
- Validate approval workflows

### Debug Mode

Enable Storybook debug logging:
\`\`\`bash
DEBUG=storybook:* npm run storybook
\`\`\`

### Performance Issues

Optimize large datasets:
\`\`\`typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component implementation
})

// Implement virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window'
\`\`\`

## Contributing

1. Follow established story patterns
2. Include comprehensive documentation
3. Test stories across different viewports
4. Ensure AIA compliance scenarios
5. Update this README for new features

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Documentation](/docs/buyout-procurement.md)
- [TypeScript Interfaces](/types/procurement.ts)
- [Mock Data Schemas](/data/)
- [AIA Standards](https://www.aia.org/resources/6076-standard-form-documents)

## Support

For questions about Storybook setup or story development:
1. Check the troubleshooting section above
2. Review existing stories for patterns
3. Consult the main project documentation
4. Contact the development team

---

## Story Examples

### Basic Story Structure
\`\`\`typescript
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Description of what this story demonstrates'
      }
    }
  },
  args: {
    // Component props
  }
}
\`\`\`

### Role-Based Story
\`\`\`typescript
export const ProjectManagerView: Story = {
  parameters: {
    docs: {
      description: {
        story: 'PM-specific functionality and permissions'
      }
    },
    mockData: {
      user: { role: 'PM', permissions: ['create', 'edit'] }
    }
  },
  args: {
    userRole: 'PM'
  }
}
\`\`\`

### AIA Compliance Story
\`\`\`typescript
export const AIACompliantBuyout: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buyout record meeting all AIA requirements'
      }
    }
  },
  args: {
    buyoutRecord: {
      complianceStatus: 'compliant',
      aiaDocuments: {
        g702: true,
        g703: true,
        scheduleOfValues: true,
        insurance: true,
        bond: true
      }
    }
  }
}
\`\`\`

### API Integration Story
\`\`\`typescript
export const WithAPIIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Component with full API integration'
      }
    },
    mockData: {
      apiStatus: {
        buildingConnected: 'connected',
        compass: 'connected',
        siteMate: 'connected',
        procore: 'connected',
        sage300: 'connected'
      }
    }
  },
  args: {
    // Component props
  }
}
\`\`\`

This comprehensive Storybook setup provides thorough testing and documentation for the HB Intel Platform's Buyout & Procurement features, ensuring proper functionality across all user roles and AIA compliance scenarios.
