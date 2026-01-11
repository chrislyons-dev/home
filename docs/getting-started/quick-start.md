# Quick Start

Get familiar with the project structure and start building.

## Project Structure

```text
/
 public/               # Static assets
    cl_*.svg         # Favicons
    robots.txt
 src/
    components/      # React components
    layouts/         # Astro layouts
    pages/           # File-based routing
    styles/          # Global styles
 docs/                # Documentation (you are here)
 astro.config.mjs     # Astro configuration
 package.json
```

## Development Workflow

### 1. Start the Dev Server

```bash
npm run dev
```

### 2. Make Changes

Edit files in the `src/` directory. The dev server will hot-reload your changes.

### 3. Test Your Changes

Navigate to `http://localhost:4321` to see your changes live.

### 4. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Creating a New Page

1. Create a new `.astro` file in `src/pages/`
2. Add your content using the Layout component:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="My New Page">
  <h1>Hello World</h1>
  <p>This is my new page!</p>
</Layout>
```

3. The page will be automatically available at `/your-filename`

## Adding a React Component

1. Create a new `.tsx` file in `src/components/`
2. Export your component:

```tsx
import { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

3. Import and use it in an Astro page:

```astro
---
import MyComponent from '../components/MyComponent';
---

<MyComponent client:load />
```

## Styling

This project uses Tailwind CSS 4.x with predefined utility classes in `src/styles/global.css`.

**Recommended:** Use existing utility classes:

```astro
<div class="card">
  <h2 class="section-title">Styled with Existing Classes</h2>
  <button class="btn-primary">Click Me</button>
</div>
```

Available utility classes:

**Layout:**

- `.section-container` - Wide container (max-w-6xl)
- `.section-container-narrow` - Narrow container (max-w-4xl)

**Typography:**

- `.page-title` - Large page heading
- `.section-title` - Section heading (centered)
- `.subsection-title` - Subsection heading (2xl)
- `.feature-title` - Feature/card title (lg)
- `.text-muted` - Muted text color
- `.text-body` - Body text color
- `.text-heading` - Heading text color

**Components:**

- `.btn-primary`, `.btn-secondary` - Buttons
- `.card`, `.card-hover`, `.card-featured` - Cards
- `.badge`, `.badge-primary`, `.badge-secondary` - Tags/badges
- `.icon-box` - Icon container with styling
- `.info-box`, `.info-box-featured` - Info/CTA boxes

**Content:**

- `.prose` - Formatted text with typography

**Alternative:** Use Tailwind utility classes directly:

```astro
<div class="rounded-lg bg-gray-900 p-4 text-white">
  <h2 class="text-2xl font-bold">Custom Tailwind Styles</h2>
</div>
```

## Next Steps

- [Configuration Guide](configuration.md)
- [Features Overview](../features/overview.md)
- [Deployment Guide](../deployment/overview.md)
