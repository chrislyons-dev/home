# Development Guide

Technical guide for developers working on this project.

## Prerequisites

- Node.js 20.x LTS
- npm 10.x
- Git
- VS Code (recommended)

## Setup

```bash
git clone https://github.com/chrislyons-dev/home.git
cd home
npm install
npm run dev
```

Visit `http://localhost:4321`

### Environment Variables

Create `.env` file (optional for local dev):

```bash
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Chris Lyons
```

## Architecture

Static site with island-based interactivity:

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

## Project Structure

```
src/
├── components/       # React components
│   ├── ThemeToggle.tsx
│   ├── TechStack.tsx
│   └── PlantUMLDiagram.tsx
├── layouts/          # Astro layouts
│   └── Layout.astro
├── pages/            # File-based routes
│   ├── index.astro         → /
│   ├── about.astro         → /about
│   └── 404.astro           → 404
├── services/         # Business logic
│   ├── ThemeManager.ts
│   ├── ThemeStorage.ts
│   └── FaviconManager.ts
├── styles/           # Global CSS
│   └── global.css
└── utils/            # Utilities
    └── themeInit.ts
```

## Development Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm run dev

# Run tests
npm test

# Build and verify
npm run build
npm run preview

# Commit with conventional commits
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

## Component Development

### Astro Components

Server-rendered, zero JavaScript by default:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div>
  <h1>{title}</h1>
</div>

<style>
  h1 {
    font-size: 2rem;
  }
</style>
```

### React Components

Interactive islands with hydration strategies:

```tsx
interface Props {
  className?: string;
}

export default function ThemeToggle({ className }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

**Hydration Strategies:**

```astro
<ThemeToggle client:load />      <!-- Load immediately -->
<ThemeToggle client:idle />      <!-- Load when idle -->
<ThemeToggle client:visible />   <!-- Load when visible -->
```

## Styling with Tailwind CSS 4

### Theme Configuration

In `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-accent: oklch(70% 0.2 250);
  --font-sans: system-ui, -apple-system, sans-serif;
}

@variant dark (&:where(.dark, .dark *));
```

### Using Utilities

```astro
<div class="bg-gray-900 text-white p-4 rounded-lg">
  <h2 class="text-2xl font-bold mb-2">Title</h2>
</div>
```

Or use predefined classes in `global.css`:

```astro
<div class="card-hover">
  <h2 class="section-title">Title</h2>
  <button class="btn-primary">Click Me</button>
</div>
```

## Testing

```bash
# Run all tests
npm test

# Watch mode with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Example Test

```typescript
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

## Build Process

### Development Build

```bash
npm run dev
# Fast builds, HMR enabled, source maps
```

### Production Build

```bash
npm run build
# Optimized, minified, tree-shaken, code-split
```

Output in `dist/`:

```
dist/
├── index.html
├── about/index.html
├── _astro/
│   ├── [hash].css
│   └── [hash].js
└── assets/
```

## Performance Optimization

### Bundle Analysis

```bash
npm run build
# Check output sizes in terminal
```

### Best Practices

1. **Minimize JavaScript**: Use Astro components when possible, React only for interactivity
2. **Optimize Images**: Use Astro's Image component with lazy loading
3. **Code Split**: Lazy load heavy components (Mermaid, PlantUML)

## Dependency Management

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Audit security
npm audit
npm audit fix

# Analyze dependency structure
npm run deps:check
npm run deps:graph
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
refactor(scope): description # Code refactoring
test(scope): description     # Tests
chore(scope): description    # Maintenance
```

### Pre-commit Hooks

Husky automatically runs:
- Commit message validation (commitlint)
- Type checking
- Tests

## CI/CD Pipeline

### GitHub Actions Workflows

**CI** (`.github/workflows/ci.yml`):
- Run tests
- Build project
- Lighthouse CI
- Generate architecture docs
- Deploy docs to GitHub Pages

**CD** (`.github/workflows/cd.yml`):
- Deploy to Cloudflare Pages (only on source changes)

## Troubleshooting

**Port in use:**
```bash
# Windows
netstat -ano | findstr :4321
taskkill /PID <pid> /F

# Unix
lsof -ti:4321 | xargs kill
```

**Module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build failures:**
```bash
rm -rf .astro
npm run build
```

**Type errors:**
```bash
npx tsc --noEmit
```

## Resources

- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vitest Docs](https://vitest.dev)

## Next Steps

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [Full Documentation](https://chrislyons-dev.github.io/home/) - Complete guides and architecture
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guides
