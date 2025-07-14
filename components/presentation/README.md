# PresentationCarousel Component

A sophisticated full-screen presentation carousel component built with Framer Motion animations, designed for HB Report Demo v3.0 presentations.

## Features

✨ **Full-Screen Experience**

- Renders at `h-screen w-screen` with highest z-index (9999)
- Overrides any background including login page
- Professional gradient backgrounds with animated floating elements

🎭 **Advanced Animations**

- Graceful fade-in + scale-up entrance animation
- Spring-based slide transitions with direction-aware movement
- Smooth exit animations when navigating to dashboard
- Floating background elements with subtle animation

🚀 **Navigation & Interaction**

- Previous/Next button navigation
- Keyboard support (← / → arrows, Escape to exit)
- Interactive progress indicator dots
- Click-to-jump slide selection
- Auto-play functionality (optional)

🎨 **Professional Design**

- Follows v3.0 design standards with HB branding
- Professional blue-gray gradient backgrounds
- Responsive typography and layouts
- Mobile-optimized touch targets

🔧 **Developer Experience**

- TypeScript support with proper interfaces
- Customizable slide content with React nodes
- Flexible background options (gradients, images, colors)
- Completion callbacks and router integration

## Available Slide Sets

### 1. Main Presentation Slides (`slide-definitions.tsx`)

- 9-slide leadership presentation
- Focus on legacy to future vision
- Continuity as core value proposition
- Used during login presentation workflow

### 2. Intel Tour Slides (`intelTourSlides.tsx`)

- 15-slide comprehensive Intel Tour
- Feature-focused with business impact messaging
- Role-based content with efficiency metrics
- Used in main app for presentation users

## Installation & Usage

### Basic Usage

```tsx
import { PresentationCarousel, type PresentationSlide } from "@/components/presentation/PresentationCarousel"

const slides: PresentationSlide[] = [
  {
    id: "welcome",
    title: "Welcome to HB Report",
    content: (
      <div>
        <p>Your presentation content here</p>
      </div>
    ),
    backgroundGradient: "linear-gradient(135deg, #003087 0%, #1e3a8a 50%, #1e40af 100%)",
  },
  {
    id: "final",
    title: "Ready to Begin?",
    content: <p>Final slide content</p>,
    isFinalSlide: true, // Shows the CTA button
  },
]

function MyPresentation() {
  return (
    <PresentationCarousel
      slides={slides}
      onComplete={() => console.log("Presentation completed!")}
      autoPlay={false}
      autoPlayInterval={5000}
    />
  )
}
```

### Intel Tour Usage

```tsx
import { PresentationCarousel } from "@/components/presentation/PresentationCarousel"
import intelTourSlides from "@/components/presentation/intelTourSlides"

function IntelTourPresentation() {
  return (
    <PresentationCarousel
      slides={intelTourSlides}
      onComplete={() => {
        localStorage.setItem("intelTourCompleted", "true")
        // Handle completion
      }}
    />
  )
}
```

### Integration with Login Page

To override the login page background and show a presentation:

```tsx
// In your login page component
import { PresentationExample } from "@/components/presentation/PresentationExample"

export default function LoginPage() {
  const [showPresentation, setShowPresentation] = useState(false)

  if (showPresentation) {
    return <PresentationExample />
  }

  return (
    <div>
      {/* Your normal login form */}
      <button onClick={() => setShowPresentation(true)}>Start Presentation</button>
    </div>
  )
}
```

## API Reference

### PresentationSlide Interface

```typescript
interface PresentationSlide {
  id: string // Unique identifier
  title: string // Main slide title
  content: React.ReactNode // Slide content (JSX)
  image?: string // Optional slide image URL
  background?: string // CSS background value
  backgroundGradient?: string // CSS gradient background
  isFinalSlide?: boolean // Shows CTA button if true
}
```

### PresentationCarouselProps Interface

```typescript
interface PresentationCarouselProps {
  slides: PresentationSlide[] // Array of slides
  onComplete?: () => void // Called when CTA is clicked
  autoPlay?: boolean // Enable auto-advance (default: false)
  autoPlayInterval?: number // Ms between slides (default: 5000)
  className?: string // Additional CSS classes
}
```

## Keyboard Controls

| Key      | Action             |
| -------- | ------------------ |
| `←`      | Previous slide     |
| `→`      | Next slide         |
| `Escape` | Exit to login page |

## Animation Details

### Entrance Animation

- **Duration**: 0.8s
- **Effect**: Fade-in + scale-up from 95% to 100%
- **Stagger**: Child elements animate with 0.1s delay

### Slide Transitions

- **Type**: Spring-based with direction awareness
- **Stiffness**: 100
- **Damping**: 20
- **Direction**: Slides enter from appropriate side based on navigation

### Exit Animation

- **Duration**: 0.6s
- **Effect**: Fade-out + scale-up to 105%
- **Trigger**: CTA button click or Escape key

## Refactoring History

### v3.0 Intel Tour Standardization

- **Previous**: Separate `HbiIntelTourCarousel.tsx` component
- **Current**: Uses standard `PresentationCarousel.tsx` with `intelTourSlides.tsx`
- **Benefits**:
  - Consistent presentation experience across all carousels
  - Reduced code duplication
  - Single source of truth for presentation styling
  - Easier maintenance and updates
  - Icons integrated into slide content for visual consistency

### Migration Guide

If you were using the old `HbiIntelTourCarousel`:

```tsx
// Old implementation
import { HbiIntelTourCarousel } from "@/components/presentation/HbiIntelTourCarousel"

;<HbiIntelTourCarousel onComplete={handleComplete} forceShow={true} />

// New implementation
import { PresentationCarousel } from "@/components/presentation/PresentationCarousel"
import intelTourSlides from "@/components/presentation/intelTourSlides"

;<PresentationCarousel slides={intelTourSlides} onComplete={handleComplete} />
```

## Styling

The component uses Tailwind CSS classes with custom gradients and animations. Key visual elements:

- **Background**: Full-screen gradient overlays
- **Typography**: Responsive text sizing with proper hierarchy
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Integrated into slide content with backdrop blur effects
- **Navigation**: Professional button styling with hover states

## Performance

- **Lazy Loading**: Slides are rendered on-demand
- **Optimized Animations**: Uses transform properties for smooth performance
- **Memory Management**: Proper cleanup of event listeners and timers
- **Responsive**: Adapts to different screen sizes without performance impact

## Build Status

✅ All components compile successfully  
✅ No TypeScript errors  
✅ Responsive design tested  
✅ Animation performance optimized  
✅ Intel Tour refactoring completed  
✅ Single presentation system established
