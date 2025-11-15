# Tech Stack

Modern technologies powering this site.

## Frontend Framework

### Astro 5.x

Why Astro?

- **Zero JavaScript by Default**: Ship only what you need
- **Island Architecture**: Interactive components where needed
- **Framework Agnostic**: Use React, Vue, Svelte together
- **Content Focus**: Built for content-rich sites
- **Excellent DX**: Fast dev server, great tooling

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

## UI Library

### React 19.x

Used for interactive "islands":

- Theme toggle
- Tech stack filter
- Code blocks

```tsx
// React component with client-side interactivity
import { useState } from 'react';

export default function Interactive() {
  const [state, setState] = useState(0);
  return <button onClick={() => setState((s) => s + 1)}>{state}</button>;
}
```

In Astro pages:

```astro
---
import Interactive from '../components/Interactive';
---

<Interactive client:load />
```

## Styling

### Tailwind CSS 4.x

Next-generation Tailwind via Vite plugin:

- **Smaller Bundle**: Only includes used utilities
- **Modern CSS**: Native cascade layers, oklch colors
- **Better Performance**: Faster build times
- **CSS-first**: No PostCSS required

```css
@import 'tailwindcss';

@theme {
  --color-primary: oklch(0.5 0.2 250);
  --font-sans: system-ui, -apple-system, sans-serif;
}
```

### Custom Utility Classes

Predefined classes in `src/styles/global.css` for common patterns:

**Layout:**

- `.section-container` - Wide container (max-w-6xl)
- `.section-container-narrow` - Narrow container (max-w-4xl)

**Typography:**

- `.page-title`, `.section-title`, `.subsection-title`
- `.text-muted`, `.text-body`, `.text-heading`

**Components:**

- `.btn-primary`, `.btn-secondary` - Buttons with GPU-accelerated hover
- `.card`, `.card-hover`, `.card-featured` - Card variants
- `.badge-primary`, `.badge-secondary` - Tags/labels
- `.icon-box` - Icon containers
- `.info-box`, `.info-box-featured` - Info/CTA boxes

**Performance Optimizations:**

- Hardware-accelerated animations using `transform`
- `will-change: transform` for smooth hover effects
- Composited animations for better performance

## Language

### TypeScript

Full type safety across the codebase:

```typescript
interface PageProps {
  title: string;
  description?: string;
}

const Layout: React.FC<PageProps> = ({ title, description }) => {
  // Fully typed
};
```

## Build Tool

### Vite

Lightning-fast development and building:

- **Instant HMR**: Sub-100ms updates
- **Optimized Builds**: Rollup-based production builds
- **Plugin Ecosystem**: Rich plugin support
- **Modern Output**: ES modules by default

## Development Tools

### Testing

- **Vitest**: Fast unit testing
- **Happy DOM**: Lightweight DOM simulation

```typescript
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('renders correctly', () => {
    expect(true).toBe(true);
  });
});
```

### Code Quality

- **Husky**: Git hooks
- **Commitlint**: Conventional commits
- **Dependency Cruiser**: Dependency analysis

### Documentation

- **MkDocs**: This documentation site
- **Mermaid**: Diagrams in markdown
- **PlantUML**: Architecture diagrams

## Deployment

### Cloudflare Pages

Primary deployment platform:

- **Global Edge Network**: 275+ cities worldwide
- **Automatic HTTPS**: SSL certificates via Cloudflare
- **Preview Deploys**: Every PR gets a preview URL
- **Analytics**: Built-in Web Analytics
- **Security**: DDoS protection, WAF, Bot Management
- **Performance**: HTTP/3, Brotli compression, automatic minification

### GitHub Pages

Documentation hosting:

- **MkDocs Site**: This documentation
- **Architecture Docs**: Auto-generated diagrams
- **GitHub Actions**: Automated deployment

### Vercel (Alternative)

Alternative deployment option:

- Edge network and preview deploys
- See [Vercel deployment guide](../deployment/vercel.md)

## Architecture Tools

### Dependency Analysis

```bash
npm run deps:check  # Validate dependencies
npm run deps:graph  # Generate visual graph
```

### Documentation Generation

```bash
npm run docs:arch   # Generate architecture docs
```

## Package Management

### npm

Using npm for dependency management:

```json
{
  "dependencies": {
    "astro": "^5.14.1",
    "react": "^19.2.0",
    "tailwindcss": "^4.1.14"
  }
}
```

## Next Steps

- [Performance Details](performance.md)
- [Architecture Overview](../architecture/overview.md)
- [Deployment Guide](../deployment/overview.md)
