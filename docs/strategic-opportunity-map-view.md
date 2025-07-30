# Strategic Opportunity Map View

## Overview

The `StrategicOpportunityMapView` component provides a geographic visualization of business development pursuits across the state of Florida. It displays interactive pins on a custom SVG map, allowing users to explore opportunities by location, stage, and market sector.

## Features

### Geographic Focus

- **Florida-only map**: Centered around central Florida (lat 28.0, long -82.0)
- **Major cities**: Miami, Orlando, Tampa, Jacksonville, Tallahassee, Fort Lauderdale
- **Regional filtering**: North, Central, and South Florida regions

### Interactive Pins

- **Color-coded stages**:
  - Gray: Identified
  - Blue: Prequal
  - Yellow: Proposal
  - Orange: Interview
  - Green: Awarded
  - Red: Lost

### Hover Tooltips

- Project name
- City location
- Estimated value
- Current stage

### Click Actions

- Opens `StrategicOpportunityDetailsDrawer` with full pursuit details
- Integrates with existing CRM workflow

### Filtering Options

- **Region filter**: North/Central/South Florida
- **Sector filter**: Market sector dropdown
- **Pursuit counter**: Shows filtered count

## Data Structure

```typescript
interface MapPursuit {
  id: string
  projectName: string
  clientOrg: string
  coordinates: [number, number] // [latitude, longitude]
  marketSector: string
  stage: string
  estValue: number
  assignedRep: string
  region: "North" | "Central" | "South"
  city: string
}
```

## Mock Data

The component includes sample Florida pursuits:

- Orlando Luxury Tower ($64M, Proposal)
- Tampa Medical Campus ($45M, Prequal)
- Miami Beach Resort ($85M, Interview)
- Jacksonville Industrial Park ($28M, Identified)
- Fort Lauderdale Office Complex ($52M, Awarded)
- Tallahassee Government Center ($35M, Lost)

## Integration

### Usage in Strategic Opportunity Intel Page

```tsx
{
  activeTab === "map" && (
    <div className="space-y-6">
      <StrategicOpportunityMapView />
    </div>
  )
}
```

### Props

```tsx
interface StrategicOpportunityMapViewProps {
  pursuits?: MapPursuit[]
  loading?: boolean
  error?: string
}
```

## Technical Implementation

### SVG Map

- Custom Florida outline using SVG path
- Responsive design with viewBox scaling
- Dark mode support with Tailwind classes

### Coordinate System

- Converts lat/lng to SVG coordinates
- Florida bounds: 24.5°N to 31.0°N, 87.5°W to 80.0°W
- Automatic positioning and scaling

### State Management

- Hover state for tooltips
- Filter state for region/sector
- Drawer state for details panel

## Styling

### Theme Support

- Light/dark mode compatible
- Tailwind CSS classes
- Consistent with HB Intel design system

### Responsive Design

- Full-width layout
- Mobile-friendly interactions
- Adaptive tooltip positioning

## Future Enhancements

1. **Real-time data**: Connect to CRM API
2. **Advanced filtering**: Date ranges, value ranges
3. **Clustering**: Group nearby pins for dense areas
4. **Export**: PDF/PNG map exports
5. **Analytics**: Click tracking and usage metrics
6. **Animations**: Smooth transitions and loading states

## Dependencies

- React hooks (useState, useMemo)
- Tailwind CSS for styling
- Lucide React for icons
- Radix UI components (Select, Card, Badge)
- React Leaflet for interactive maps
- Leaflet CSS for map styling
- StrategicOpportunityDetailsDrawer integration
