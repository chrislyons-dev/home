# API Reference

Component and utility API reference.

## Components

### Layout

Base layout component used by all pages.

**Location:** `src/layouts/Layout.astro`

**Props:**

```typescript
interface Props {
  title: string; // Page title
  description?: string; // Meta description
  ogImage?: string; // Open Graph image
}
```

**Usage:**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="My Page" description="Page description">
  <h1>Content</h1>
</Layout>
```

### ThemeToggle

Dark mode toggle component.

**Location:** `src/components/ThemeToggle.tsx`

**Props:**

```typescript
interface Props {
  className?: string;
}
```

**Usage:**

```astro
---
import ThemeToggle from '../components/ThemeToggle';
---

<ThemeToggle client:load />
```

**Methods:**

```typescript
// Get current theme
const theme = getTheme(); // 'light' | 'dark' | 'system'

// Set theme
setTheme('dark');

// Toggle theme
toggleTheme();
```

### TechStack

Technology stack display component.

**Location:** `src/components/TechStack.tsx`

**Props:**

```typescript
interface Technology {
  name: string;
  category: string;
  description?: string;
}

interface Props {
  technologies: Technology[];
  filterable?: boolean;
}
```

**Usage:**

```astro
---
import TechStack from '../components/TechStack';

const tech = [
  { name: 'Astro', category: 'Framework' },
  { name: 'React', category: 'Library' },
];
---

<TechStack technologies={tech} filterable={true} client:load />
```

### CodeBlock

Syntax-highlighted code blocks.

**Location:** `src/components/CodeBlock.tsx`

**Props:**

```typescript
interface Props {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}
```

**Usage:**

```astro
---
import CodeBlock from '../components/CodeBlock';
---

<CodeBlock
  code="console.log('hello');"
  language="javascript"
  filename="example.js"
  showLineNumbers={true}
  client:load
/>
```

## Utilities

### Theme Management

**Location:** `src/utils/theme.ts`

```typescript
// Get system preference
function getSystemTheme(): 'light' | 'dark';

// Get stored theme
function getStoredTheme(): Theme | null;

// Apply theme to document
function applyTheme(theme: Theme): void;

// Initialize theme system
function initializeTheme(): void;
```

**Usage:**

```typescript
import { initializeTheme, applyTheme } from '@/utils/theme';

// Initialize on page load
initializeTheme();

// Apply specific theme
applyTheme('dark');
```

### SEO Utilities

**Location:** `src/utils/seo.ts`

```typescript
// Generate meta tags
function generateMetaTags(options: MetaOptions): MetaTag[];

// Generate Open Graph tags
function generateOGTags(options: OGOptions): OGTag[];

// Generate JSON-LD structured data
function generateJSONLD(data: StructuredData): string;
```

**Usage:**

```astro
---
import { generateMetaTags } from '@/utils/seo';

const meta = generateMetaTags({
  title: 'Page Title',
  description: 'Page description',
});
---

{meta.map((tag) => <meta {...tag} />)}
```

## Types

### Common Types

```typescript
// Theme types
type Theme = 'light' | 'dark' | 'system';

// Page types
interface Page {
  title: string;
  description?: string;
  layout?: string;
}

// Navigation types
interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

// Metadata types
interface Metadata {
  title: string;
  description: string;
  author?: string;
  keywords?: string[];
  ogImage?: string;
}
```

## Configuration

### Astro Config

**Location:** `astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://chrislyons.dev',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### TypeScript Config

**Location:** `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Environment Variables

### Available Variables

```bash
# Public (exposed to client)
PUBLIC_SITE_URL=https://chrislyons.dev
PUBLIC_SITE_NAME=Chris Lyons

# Private (server only)
VERCEL_TOKEN=xxx
```

### Usage

```typescript
// In Astro components
const siteUrl = import.meta.env.PUBLIC_SITE_URL;

// Type-safe
interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_NAME: string;
}
```

## Build API

### Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Generate docs
npm run docs:arch
```

### Build Output

```
dist/
├── index.html
├── about.html
├── _astro/
│   ├── [hash].css
│   └── [hash].js
└── assets/
```

## Next Steps

- [Features Overview](../features/overview.md)
- [Architecture Guide](../architecture/overview.md)
- [Getting Started](../getting-started/installation.md)
