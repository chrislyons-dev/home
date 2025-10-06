# Performance

How this site achieves exceptional performance.

## Lighthouse Scores

> **Latest CI Results:** [View Lighthouse Report](https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1759579083622-95849.report.html) | Last Updated: 2025-10-04

Current scores across all metrics (tested with Lighthouse CI):

| Metric         | Score  | Details                      |
| -------------- | ------ | ---------------------------- |
| Performance    | 95+    | Optimized assets, minimal JS |
| Accessibility  | 95+    | WCAG AA compliant            |
| Best Practices | 95+    | Modern standards             |
| SEO            | 95+    | Complete meta tags           |

## Optimization Techniques

### 1. Static Site Generation

Pre-rendered HTML for instant page loads:

- **No Server Round-trips**: HTML served immediately
- **CDN Friendly**: Cached at edge locations
- **Predictable Performance**: Consistent load times

### 2. Minimal JavaScript

Zero JS by default, added only where needed:

```astro
---
// Only this component gets JavaScript
import ThemeToggle from '../components/ThemeToggle';
---

<ThemeToggle client:idle />
```

**Loading Strategies:**

- `client:idle` - Load after initial page is idle (used for ThemeToggle)
- `client:visible` - Load when component enters viewport (used for PlantUML diagrams)
- Dynamic imports for heavy libraries (Mermaid loaded on-demand)

**Bundle Sizes:**

- Initial critical path: ~45kb (gzipped) - includes React + core islands
- Mermaid: ~200kb (dynamically imported when diagrams are visible)
- Total build output: ~3.2MB (includes all assets, heavily cached)

### 3. Optimized Assets

**Images:**

- Modern formats (WebP, AVIF)
- Lazy loading
- Responsive sizes
- Compressed with Sharp

**CSS:**

- Tailwind CSS 4.x with tree-shaking
- Custom utility classes for common patterns
- GPU-accelerated animations (`transform`, `will-change`)
- Minified and compressed
- System fonts (no external font loading)

**Fonts:**

- System fonts only (no web font overhead)
- Optimized for performance and consistency
- Font optical sizing for better rendering

### 4. View Transitions

Native browser animations for navigation:

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
</head>
```

Benefits:

- Smooth page transitions
- Preserved scroll position
- Maintained focus state
- No layout shift

### 5. Build Optimizations

**Vite Configuration:**

```javascript
export default {
  build: {
    minify: "terser",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
};
```

### 6. Rendering Optimizations

**Layout Stability:**

- Reserved space for dynamic content (Mermaid diagrams)
- Explicit dimensions to prevent Cumulative Layout Shift (CLS)
- Minimum heights on containers

**Animation Performance:**

- GPU-accelerated transforms instead of layout-triggering properties
- `will-change: transform` hints for the compositor
- Smooth 60fps animations on buttons, cards, and interactive elements

**Resource Loading:**

- DNS prefetch for external resources
- Preconnect to critical origins
- Intersection Observer for lazy loading

### 7. Caching Strategy

**Static Assets:**

- Long-term caching (1 year)
- Content-hashed filenames
- Immutable cache headers

**HTML:**

- Short cache (5 minutes)
- CDN edge caching
- Stale-while-revalidate

## Performance Metrics

### Core Web Vitals

| Metric | Value | Target     |
| ------ | ----- | ---------- |
| LCP    | 0.8s  | < 2.5s ✅  |
| FID    | 10ms  | < 100ms ✅ |
| CLS    | 0.01  | < 0.1 ✅   |

### Load Times

- **Time to First Byte**: ~200ms
- **First Contentful Paint**: ~0.5s
- **Time to Interactive**: ~0.8s
- **Total Page Size**: ~100kb

## Monitoring

### Build-time Analysis

```bash
# Analyze bundle sizes
npm run build

# Generate dependency graph
npm run deps:graph
```

### Runtime Monitoring

Cloudflare Web Analytics tracks:

- Real user metrics (privacy-focused, no cookies)
- Core Web Vitals
- Geographic performance
- Device and browser breakdown
- Page load performance

## Best Practices

### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.png';
---

<Image
  src={heroImage}
  alt="Description"
  loading="lazy"
  quality={80}
/>
```

### Code Splitting

```typescript
// Dynamic imports for large components
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

### Preloading Critical Resources

```astro
<link rel="preload" href="/critical.css" as="style">
```

## Performance Budget

Target budgets for critical path (initial page load):

| Resource   | Budget | Current  | Notes                          |
| ---------- | ------ | -------- | ------------------------------ |
| HTML       | 20kb   | ~15kb ✅  | Per page                       |
| CSS        | 30kb   | ~25kb ✅  | Global styles                  |
| JavaScript | 100kb  | ~45kb ✅  | React + interactive islands    |
| Images     | 500kb  | ~200kb ✅ | Lazy loaded, optimized formats |

**Note:** Total build output (~3.2MB) includes all pages, assets, and vendor libraries. These are aggressively cached (1 year for immutable assets) and loaded on-demand.

## Continuous Monitoring

### GitHub Actions

Performance checks on every PR:

```yaml
- name: Build and analyze
  run: |
    npm run build
    npm run analyze
```

### Lighthouse CI

Automated Lighthouse audits run on every push and PR:

**Local Testing:**

```bash
# Build and run Lighthouse locally
npm run build
npm run lighthouse
```

**CI/CD Integration:**

```yaml
- name: Build project
  run: npm run build

- name: Run Lighthouse CI
  run: npm run lighthouse
  continue-on-error: true

- name: Upload Lighthouse results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: lighthouse-results
    path: .lighthouseci
    retention-days: 30
```

**Configuration:** `.lighthouserc.json` enforces minimum scores:

- Performance: 85+ (warn threshold)
- Accessibility: 90+ (warn threshold)
- Best Practices: 95+ (warn threshold)
- SEO: 95+ (warn threshold)

Results are uploaded as artifacts and available for 30 days.

## Next Steps

- [Tech Stack Details](tech-stack.md)
- [Deployment Guide](../deployment/overview.md)
- [Architecture Overview](../architecture/overview.md)
