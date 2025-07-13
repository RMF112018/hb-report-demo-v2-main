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

- **Type**: Spring animation with direction-aware sliding
- **Spring Config**: `stiffness: 100, damping: 20`
- **Direction**: Slides enter from left/right based on navigation direction

### Exit Animation

- **Duration**: 0.6s
- **Effect**: Fade-out + scale-up to 105%
- **Loading**: Shows spinner with "Launching HB Report..." message

## Background Options

### Gradient Backgrounds

```tsx
{
  backgroundGradient: "linear-gradient(135deg, #003087 0%, #1e3a8a 50%, #1e40af 100%)"
}
```

### Solid Backgrounds

```tsx
{
  background: "#003087"
}
```

### Image Backgrounds

```tsx
{
  background: "url('/path/to/image.jpg') center/cover"
}
```

## CTA Button Behavior

When `isFinalSlide: true` is set on a slide:

1. **Button Appearance**: "Explore what continuity looks like" with sparkles and arrow icons
2. **Click Action**: Triggers exit animation → navigates to `/main-app` → calls `onComplete()`
3. **Loading State**: Shows loading overlay during transition
4. **Styling**: Orange gradient button with hover effects

## Responsive Design

- **Mobile (< 768px)**: Optimized typography and spacing
- **Tablet (768px - 1023px)**: Balanced layouts
- **Desktop (1024px+)**: Full layout with larger typography
- **Large Displays (1920px+)**: Enhanced spacing and scaling

## Example Content Patterns

### Feature Highlight

```tsx
{
  title: "Powerful Analytics",
  content: (
    <div className="space-y-6">
      <p className="text-xl lg:text-2xl">
        Real-time insights that drive smarter decisions
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {features.map(feature => (
          <div key={feature.id} className="text-center">
            <div className="bg-white/20 rounded-2xl p-6 mb-3">
              <feature.icon className="h-8 w-8 mx-auto text-white" />
            </div>
            <p className="text-sm font-medium">{feature.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Statistics Display

```tsx
{
  title: "Proven Results",
  content: (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="text-center">
        <div className="text-4xl lg:text-5xl font-bold mb-2">99.9%</div>
        <p className="text-lg opacity-80">System Uptime</p>
      </div>
      {/* More stats... */}
    </div>
  )
}
```

## Best Practices

1. **Slide Count**: Keep presentations to 3-7 slides for optimal engagement
2. **Content Length**: Use concise, impactful messaging
3. **Visual Hierarchy**: Use consistent spacing and typography
4. **Background Contrast**: Ensure text readability on gradient backgrounds
5. **Performance**: Optimize images and avoid heavy computations in slide content
6. **Accessibility**: Include proper ARIA labels and keyboard navigation

## Dependencies

- `framer-motion` (v12.19.1+)
- `next/navigation` (for router)
- `@/components/ui/*` (shadcn/ui components)
- `lucide-react` (icons)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors with animation variants, ensure you're using the latest version of Framer Motion and have proper type definitions installed.

### Performance Issues

- Use `React.memo` for slide content with heavy computations
- Optimize images with Next.js Image component
- Limit concurrent animations in slide content

### Mobile Issues

- Test touch targets are at least 44px × 44px
- Verify text is readable on smaller screens
- Check that animations don't cause motion sickness

## Contributing

When contributing to this component:

1. Follow v3.0 design standards
2. Maintain TypeScript type safety
3. Test across all supported browsers
4. Ensure accessibility compliance
5. Update documentation for new features
