# Estimating Module - v3.0.0

## Overview

The Estimating Module is a comprehensive, modular system for construction project estimation, cost management, and bid processing. Following the **v-3.0.mdc** architectural standards, all components are designed for easy injection into other pages and applications.

## Architecture

### Modular Design Pattern

The estimating system follows a **Wrapper-Content Component Pattern**:

- **Wrapper Components**: Handle layout, context providers, error boundaries, and navigation
- **Content Components**: Pure functional components focused on business logic
- **Provider Components**: Manage state and data flow across the module

### Directory Structure

```
components/estimating/
├── index.ts                    # Main export file
├── README.md                   # This documentation
├── EstimatingProvider.tsx      # Core state management
├── wrappers/                   # Wrapper components
│   ├── index.ts
│   ├── EstimatingModuleWrapper.tsx
│   └── types.ts
├── content/                    # Content-only components
│   ├── index.ts
│   └── types.ts
├── examples/                   # Usage examples
│   └── usage-examples.tsx
└── [individual components]     # Core estimating components
```

## Core Components

### Infrastructure Components

- **EstimatingProvider**: Central state management and data provider
- **EstimatingTracker**: Main project tracking interface
- **ProjectSpecificDashboard**: Project-focused dashboard view
- **ProjectEstimateOverview**: Comprehensive project overview

### Cost Management Components

- **CostSummaryModule**: Project cost breakdown and approval workflow
- **AreaCalculationsModule**: Square footage and area calculations
- **AllowancesLog**: Project allowances management
- **GCGRLog**: General Conditions & General Requirements
- **CostAnalyticsDashboard**: Cost analytics and reporting

### Bid Management Components

- **BidLeveling**: Bid comparison and selection tools
- **BidManagement**: Comprehensive vendor bid management
- **BidTabManagement**: Bid tab creation and management
- **BidManagementCenter**: Centralized bid operations

### Project Management Components

- **ProjectForm**: Project creation and editing
- **TradePartnerLog**: Trade partner management
- **DocumentLog**: Document management system
- **ClarificationsAssumptions**: RFI and clarification tracking

### Analytics Components

- **QuantityTakeoffDashboard**: Quantity takeoff management
- **EstimatingIntelligence**: AI-powered estimating insights

## Usage

### Basic Import

```typescript
import {
  EstimatingModuleWrapper,
  LazyEstimatingTracker,
  LazyCostSummaryModule,
  AllowancesLog,
  EstimatingProvider,
} from "@/components/estimating"
```

### Simple Embedding

```tsx
<EstimatingModuleWrapper title="Cost Summary" projectId="project-123" userRole="estimator" isEmbedded={true}>
  <LazyCostSummaryModule projectId="project-123" projectName="Sample Project" />
</EstimatingModuleWrapper>
```

### Full Page Implementation

```tsx
<EstimatingProvider>
  <div className="container mx-auto px-4 py-8">
    <EstimatingModuleWrapper
      title="Estimating Center"
      projectId="project-123"
      userRole="estimator"
      isEmbedded={false}
      showCard={true}
    >
      <LazyEstimatingTracker />
    </EstimatingModuleWrapper>
  </div>
</EstimatingProvider>
```

### Tabbed Interface

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="costs">Costs</TabsTrigger>
    <TabsTrigger value="bids">Bids</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">
    <EstimatingModuleWrapper projectId="project-123" userRole="estimator" isEmbedded={true} showCard={false}>
      <LazyEstimatingTracker />
    </EstimatingModuleWrapper>
  </TabsContent>

  <TabsContent value="costs">
    <EstimatingModuleWrapper title="Cost Management" projectId="project-123" userRole="estimator" isEmbedded={true}>
      <LazyCostSummaryModule projectId="project-123" projectName="Sample Project" />
    </EstimatingModuleWrapper>
  </TabsContent>
</Tabs>
```

## Configuration Options

### EstimatingModuleWrapper Props

| Prop          | Type     | Default      | Description                     |
| ------------- | -------- | ------------ | ------------------------------- |
| `title`       | string   | -            | Module title                    |
| `description` | string   | -            | Module description              |
| `projectId`   | string   | -            | Project identifier              |
| `userRole`    | string   | **required** | User role (estimator, pm, etc.) |
| `className`   | string   | ''           | Additional CSS classes          |
| `isEmbedded`  | boolean  | false        | Embedded or standalone mode     |
| `showHeader`  | boolean  | true         | Show/hide header                |
| `showCard`    | boolean  | true         | Wrap in card component          |
| `onNavigate`  | function | -            | Navigation handler              |
| `onError`     | function | -            | Error handler                   |
| `loading`     | boolean  | false        | Loading state                   |

### Component Loading

The system provides both synchronous and lazy-loaded components:

- **Synchronous**: Direct imports for immediate use
- **Lazy**: Prefixed with `Lazy` for code splitting and performance

```typescript
// Synchronous loading
import { AllowancesLog } from "@/components/estimating"

// Lazy loading
import { LazyEstimatingTracker } from "@/components/estimating"
```

## State Management

### EstimatingProvider

The `EstimatingProvider` manages all estimating-related state and provides:

- Project data and estimates
- Cost calculations and summaries
- Bid management and comparisons
- Document and trade partner tracking
- Import/export functionality

### Usage with Provider

```tsx
<EstimatingProvider>
  <YourEstimatingComponents />
</EstimatingProvider>
```

### Hook Access

```typescript
import { useEstimating } from "@/components/estimating"

function MyComponent() {
  const {
    estimates,
    addEstimate,
    updateEstimate,
    deleteEstimate,
    // ... other methods
  } = useEstimating()

  // Component logic
}
```

## Performance Optimization

### Lazy Loading

All major components support lazy loading:

```typescript
const LazyEstimatingTracker = lazy(() => import("./EstimatingTracker"))
```

### Suspense Integration

Use with React Suspense for optimal loading:

```tsx
<Suspense fallback={<EstimatingModuleSkeleton />}>
  <LazyEstimatingTracker />
</Suspense>
```

### Error Boundaries

Built-in error boundaries handle component failures gracefully:

```tsx
<EstimatingModuleWrapper onError={(error) => console.error(error)}>
  <YourComponent />
</EstimatingModuleWrapper>
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  EstimatingModuleProps,
  EstimatingContentProps,
  EstimateData,
  ProjectData,
  BidData,
  CostAnalysis,
} from "@/components/estimating"
```

## Responsive Design

All components are responsive by default:

- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Optimized for iPhone SE to 110" displays

## Integration Examples

### Project Dashboard Integration

```tsx
// In your project dashboard
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    <EstimatingModuleWrapper
      title="Project Overview"
      projectId={projectId}
      userRole="project-manager"
      isEmbedded={true}
    >
      <ProjectEstimateOverview />
    </EstimatingModuleWrapper>
  </div>

  <div className="lg:col-span-1">
    <EstimatingModuleWrapper title="Cost Summary" projectId={projectId} userRole="project-manager" isEmbedded={true}>
      <LazyCostSummaryModule />
    </EstimatingModuleWrapper>
  </div>
</div>
```

### Modal Integration

```tsx
<Dialog open={showEstimating} onOpenChange={setShowEstimating}>
  <DialogContent className="max-w-4xl">
    <EstimatingModuleWrapper projectId={projectId} userRole="estimator" isEmbedded={true} showCard={false}>
      <LazyBidManagement />
    </EstimatingModuleWrapper>
  </DialogContent>
</Dialog>
```

## Testing

Components are designed for easy testing:

```typescript
import { render, screen } from "@testing-library/react"
import { EstimatingProvider } from "@/components/estimating"
import { YourComponent } from "./YourComponent"

test("renders estimating component", () => {
  render(
    <EstimatingProvider>
      <YourComponent />
    </EstimatingProvider>
  )

  // Test assertions
})
```

## Migration Guide

### From v2.0 to v3.0

1. Update imports to use the new modular structure
2. Wrap components with `EstimatingModuleWrapper`
3. Update prop interfaces to match new standards
4. Replace direct component usage with lazy-loaded versions

### Breaking Changes

- All components now require `userRole` prop
- Context providers are now required for state management
- Some component props have been renamed for consistency

## Support

For questions or issues:

1. Check the examples in `examples/usage-examples.tsx`
2. Review component documentation in individual files
3. Consult the v-3.0.mdc architectural standards

## Version History

- **v3.0.0**: Full modularization with wrapper-content pattern
- **v2.0.0**: Component-based architecture
- **v1.0.0**: Initial monolithic implementation
