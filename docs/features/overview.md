# Features Overview

A comprehensive look at what makes this site special.

## Core Features

### Performance

- **Static Site Generation**: Pre-rendered HTML for instant page loads
- **Optimized Assets**: Compressed images, minified CSS/JS
- **Lazy Loading**: Images and components load on demand
- **View Transitions**: Smooth navigation between pages
- **Lighthouse Score**: 95+ across all metrics (automated CI testing)

[Learn more about performance ](performance.md)

### Modern Design

- **Dark Mode**: System-aware with manual toggle (loads on idle)
- **Responsive**: Mobile-first, works on all devices
- **Clean Interface**: Minimal, focused design
- **Modern CSS**: Tailwind CSS 4.x, oklch colors, GPU-accelerated animations
- **Custom Utilities**: Predefined classes for consistency
- **View Transitions API**: Native browser animations

### Accessibility

- **WCAG Compliant**: AA standard minimum
- **Keyboard Navigation**: Full site accessible via keyboard
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respects user preferences
- **Focus Management**: Clear visual indicators

[Learn more about accessibility ](accessibility.md)

### SEO Optimized

- **Meta Tags**: Comprehensive metadata
- **Open Graph**: Social media previews
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine instructions
- **Structured Data**: JSON-LD for rich snippets

### Developer Experience

- **TypeScript**: Full type safety
- **Hot Reload**: Instant updates during development
- **Component Testing**: Vitest for unit tests
- **Pre-commit Hooks**: Automated code quality checks
- **Dependency Analysis**: Visualize module relationships

[Learn more about the tech stack ](tech-stack.md)

### Observability

- **Web Analytics**: Cloudflare Web Analytics (privacy-focused, no cookies)
- **Performance Monitoring**: Core Web Vitals tracking (LCP, FID, CLS)
- **Build Metrics**: Lighthouse CI on every deployment
- **Error Tracking**: Real-time error rates via Cloudflare
- **Deployment Monitoring**: GitHub Actions + Cloudflare Pages

[Learn more about observability ](observability.md)

## Interactive Components

### Theme Toggle

System-aware dark mode with manual override:

```tsx
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('system');
  // Implementation...
}
```

### Tech Stack Display

Filterable, interactive technology showcase:

- Filter by category
- Smooth animations
- Responsive grid layout

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Next Steps

- [Tech Stack Details](tech-stack.md)
- [Performance Deep Dive](performance.md)
- [Accessibility Guide](accessibility.md)
