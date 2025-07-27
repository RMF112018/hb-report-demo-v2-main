# Market Intelligence Card Components

This directory contains reusable card components specifically designed for market intelligence dashboards. These components provide a consistent interface for displaying time-based data, progress metrics, and Power BI embedded visualizations.

## Components

### ActivityTrendsCard

A flexible component for displaying time-based charts with trend analysis.

**Features:**

- Multiple chart types: line, area, bar
- Dynamic trend indicators with icons
- Real-time data updates
- Optional AI summary with confidence scoring
- Customizable colors and styling
- Loading states and refresh functionality

**Usage:**

```tsx
import { ActivityTrendsCard } from "@/components/cards/market-intel"
;<ActivityTrendsCard
  title="Florida Market Growth"
  description="Monthly nonresidential construction trends"
  data={[
    { period: "Jan", value: 125000 },
    { period: "Feb", value: 132000 },
    { period: "Mar", value: 128000 },
  ]}
  config={{
    chartType: "area",
    showRealTime: true,
    trendIndicator: true,
    primaryColor: "#3b82f6",
    formatValue: (val) => `$${val.toLocaleString()}`,
  }}
  aiSummary={{
    insight: "Growth trend shows consistent expansion",
    confidence: 87,
    trend: "up",
    recommendation: "Consider increasing capacity",
  }}
/>
```

### EstimatingProgressCard

A comprehensive component for displaying summary metrics with progress indicators.

**Features:**

- Key metrics grid with trend indicators
- Progress bars with targets
- Distribution charts (pie charts)
- AI insights with key metrics highlighting
- Real-time metric updates
- Flexible metric formatting (currency, percentage, number)

**Usage:**

```tsx
import { EstimatingProgressCard } from "@/components/cards/market-intel"
;<EstimatingProgressCard
  title="Developer Sentiment Index"
  description="Market sentiment analysis"
  data={{
    metrics: [
      { label: "Sentiment Score", value: 72, format: "percentage", trend: "up" },
      { label: "Total Projects", value: 45, format: "number", trend: "stable" },
    ],
    progressData: [
      { category: "Market Confidence", value: 75, target: 80 },
      { category: "Risk Assessment", value: 60, target: 70 },
    ],
    distributionData: [
      { name: "Positive", value: 45, color: "#10b981" },
      { name: "Neutral", value: 35, color: "#f59e0b" },
      { name: "Negative", value: 20, color: "#ef4444" },
    ],
  }}
  config={{
    showProgress: true,
    showDistribution: true,
  }}
  aiSummary={{
    insight: "Sentiment improving but insurance costs remain concern",
    confidence: 82,
    keyMetrics: ["Insurance Impact", "Job Growth", "GDP Correlation"],
  }}
/>
```

### PowerBIEmbedCard

A professional component for embedding Power BI reports and complex visualizations.

**Features:**

- Multiple chart types with automatic rendering
- Power BI embed support with report/workspace IDs
- Tabbed interface for multiple datasets
- External link integration
- HBI Analysis with key findings
- Custom actions and filters support
- Professional Power BI styling

**Usage:**

```tsx
import { PowerBIEmbedCard } from "@/components/cards/market-intel"
;<PowerBIEmbedCard
  title="Regional Hotspots Analysis"
  description="Deal activity by region"
  reportId="abc123"
  workspaceId="def456"
  data={chartData}
  config={{
    chartType: "radar",
    showPowerBIBadge: true,
    showExternalLink: true,
    showTabs: true,
    tabsData: [
      { label: "Southeast", value: "se", data: seData },
      { label: "Southwest", value: "sw", data: swData },
      { label: "Central", value: "central", data: centralData },
    ],
  }}
  aiSummary={{
    insight: "Southeast Florida dominates with $3B in deals",
    confidence: 94,
    keyFindings: [
      "SE Florida: $3B in Q1-Q2 2025",
      "Miami-Dade leads commercial development",
      "Office vacancy rates stabilizing",
    ],
    dataQuality: 96,
  }}
/>
```

## Common Configuration Options

### Color Schemes

- `primaryColor`: Main color for charts and indicators
- `secondaryColor`: Secondary color for composed charts
- `gradientColors`: Array of two colors for gradient fills

### Real-time Features

- `showRealTime`: Enable/disable real-time updates
- `refreshInterval`: Update interval in milliseconds (default: 30000)

### AI Integration

- `showAISummary`: Display AI insights panel
- `aiSummary.confidence`: AI confidence percentage (0-100)
- `aiSummary.insight`: Main AI insight text
- `aiSummary.recommendation`: Optional recommendation text

### Layout Options

- `compactView`: Reduce spacing and sizing
- `className`: Custom CSS classes
- `userRole`: Role-based content adjustments

## Best Practices

1. **Consistent Styling**: Use the same color scheme across related cards
2. **Performance**: Disable real-time updates when not needed
3. **Accessibility**: Provide meaningful descriptions and labels
4. **Data Quality**: Always validate data before passing to components
5. **Error Handling**: Implement proper error boundaries around card components

## Integration with HB Report Demo

These components are designed to work seamlessly with the HB Report Demo v3.0 architecture:

- **Role-based Access**: All components support `userRole` prop for content filtering
- **Theme Compatibility**: Full dark/light mode support
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Production Standards**: TypeScript safety, error boundaries, performance optimization

## Dependencies

- React 18+
- Recharts for data visualization
- Lucide React for icons
- Tailwind CSS for styling
- shadcn/ui components

## Support

For questions or issues with these components, please refer to the main HB Report Demo documentation or contact the development team.
