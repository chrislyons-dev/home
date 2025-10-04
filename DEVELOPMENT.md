# Development Guide

Technical guide for developers working on this project.

## Architecture Overview

This project uses a static site architecture with island-based interactivity:

```
┌─────────────────────────────────────┐
│ Astro (Static Site Generator)       │
├─────────────────────────────────────┤
│ React (Interactive Islands)         │
├─────────────────────────────────────┤
│ Tailwind CSS 4 (Styling)            │
├─────────────────────────────────────┤
│ Vite (Build Tool)                   │
└─────────────────────────────────────┘
```

## Development Environment

### Required Tools

- **Node.js**: 20.x LTS
- **npm**: 10.x
- **Git**: Latest
- **Editor**: VS Code (recommended)

### Optional Tools

- **GitHub CLI**: For PR management
- **Vercel CLI**: For deployment testing
- **MkDocs**: For documentation

## Setup

### Initial Setup

```bash
# Clone repository
git clone https://github.com/chrislyons-dev/home.git
cd home

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Environment Variables

Create `.env` file:

```bash
# Public (client-side)
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Chris Lyons

# Private (server-side only)
# None required for local dev
```

## Project Structure

```
home/
├── .github/              # GitHub configs
│   └── workflows/        # CI/CD pipelines
├── docs/                 # MkDocs documentation
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── ThemeToggle.tsx
│   │   ├── TechStack.tsx
│   │   └── CodeBlock.tsx
│   ├── layouts/          # Astro layouts
│   │   └── Layout.astro
│   ├── pages/            # File-based routes
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── 404.astro
│   ├── styles/           # Global styles
│   │   └── global.css
│   └── utils/            # Utilities
│       └── theme.ts
├── scripts/              # Build scripts
│   └── generate-architecture-docs.js
├── tests/                # Test files
├── astro.config.mjs      # Astro config
├── mkdocs.yml            # MkDocs config
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vitest.config.ts      # Test config
```

## Development Workflow

### Daily Workflow

```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Start dev server
npm run dev

# Make changes...

# Run tests
npm test

# Build and verify
npm run build
npm run preview

# Commit and push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

### Hot Module Replacement

The dev server supports HMR:

- **Astro files**: Full page reload
- **React components**: Hot reload
- **CSS**: Instant update
- **TypeScript**: Recompile on save

## Component Development

### Astro Components

Server-rendered, zero JavaScript:

```astro
---
// Frontmatter (runs at build time)
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!-- Template (static HTML) -->
<div>
  <h1>{title}</h1>
</div>

<style>
  /* Scoped styles */
  h1 {
    font-size: 2rem;
  }
</style>
```

### React Components

Interactive islands:

```tsx
// ThemeToggle.tsx
import { useState, useEffect } from 'react';

interface Props {
  className?: string;
}

export default function ThemeToggle({ className }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <button
      className={className}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme
    </button>
  );
}
```

### Component Usage

```astro
---
import ThemeToggle from '../components/ThemeToggle';
---

<!-- Hydration strategies -->
<ThemeToggle client:load />      <!-- Load immediately -->
<ThemeToggle client:idle />      <!-- Load when idle -->
<ThemeToggle client:visible />   <!-- Load when visible -->
```

## Styling

### Tailwind CSS 4

Configuration in `src/styles/global.css`:

```css
@import "tailwindcss";

/* Theme customization */
@theme {
  --color-primary: oklch(0.5 0.2 250);
  --color-bg-light: oklch(1 0 0);
  --color-bg-dark: oklch(0.1 0 0);
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Using Utilities

```astro
<div class="bg-gray-900 text-white p-4 rounded-lg">
  <h2 class="text-2xl font-bold mb-2">Title</h2>
  <p class="text-gray-300">Description</p>
</div>
```

### Custom Styles

Scoped component styles:

```astro
<style>
  h1 {
    @apply text-3xl font-bold;
    /* Custom CSS */
    text-wrap: balance;
  }
</style>
```

## Testing

### Unit Tests

```typescript
// Component.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Component title="Test" />);
    expect(getByText('Test')).toBeDefined();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

## Build Process

### Development Build

```bash
npm run dev
# Fast builds, no optimization
# Source maps enabled
# HMR enabled
```

### Production Build

```bash
npm run build
# Optimized output
# Minified assets
# Tree-shaking
# Code splitting
```

### Build Output

```
dist/
├── index.html              # Homepage
├── about.html             # About page
├── _astro/
│   ├── [hash].css         # Styles
│   └── [hash].js          # Scripts
└── assets/                # Optimized images
```

## Debugging

### VS Code Launch Config

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Astro",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Browser DevTools

```typescript
// Add debugging in components
console.log('Debug:', { theme, isOpen });

// Use React DevTools extension
// Use Astro DevTools (built-in)
```

### Network Debugging

```bash
# View network requests in dev
npm run dev -- --host

# Access from other devices
# http://192.168.x.x:4321
```

## Performance

### Bundle Analysis

```bash
# Build with stats
npm run build

# View bundle visualization
npm run analyze
```

### Performance Monitoring

```typescript
// Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### Optimization Tips

1. **Minimize JavaScript**
   - Use Astro components when possible
   - Defer React to interactive islands

2. **Optimize Images**
   - Use WebP/AVIF formats
   - Implement lazy loading
   - Compress with Sharp

3. **Reduce Bundle Size**
   - Tree-shake unused code
   - Code split by route
   - Lazy load heavy components

## Dependency Management

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all (patch/minor)
npm update

# Update specific package
npm update astro

# Update to latest major
npm install astro@latest
```

### Dependency Analysis

```bash
# Check dependency structure
npm run deps:check

# Generate dependency graph
npm run deps:graph
```

### Security Audits

```bash
# Audit for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

## Git Workflow

### Branch Strategy

- `main` - Production
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation

### Commit Convention

```bash
feat(scope): description     # New feature
fix(scope): description      # Bug fix
docs(scope): description     # Documentation
style(scope): description    # Formatting
refactor(scope): description # Code refactoring
test(scope): description     # Tests
chore(scope): description    # Maintenance
```

### Pre-commit Hooks

Husky runs automatically:

```bash
# On commit
- Lint commit message
- Run type check
- Run tests

# On push
- Verify no secrets
- Check dependencies
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
- Checkout code
- Install dependencies
- Run tests
- Build project
- Deploy to Vercel
- Deploy docs to Pages
```

### Local CI Testing

```bash
# Run same checks as CI
npm test
npm run build

# Check commit messages
npx commitlint --from HEAD~1 --to HEAD
```

## Troubleshooting

### Common Issues

**Port in use:**
```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill
```

**Module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build failures:**
```bash
# Clear Astro cache
rm -rf .astro
npm run build
```

**Type errors:**
```bash
# Check TypeScript
npx tsc --noEmit
```

## Resources

- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [Vitest Docs](https://vitest.dev)

## Next Steps

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Check [Architecture docs](docs/architecture/overview.md) for system design
- Visit [API Reference](docs/api/index.md) for component APIs
