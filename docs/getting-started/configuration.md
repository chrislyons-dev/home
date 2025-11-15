# Configuration

Customize the site to your needs.

## Astro Configuration

The main configuration file is `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chrislyons.dev',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Site URL

Update the `site` field to match your domain:

```javascript
site: 'https://yourdomain.com';
```

This is used for:

- Sitemap generation
- Canonical URLs
- Open Graph tags

## TypeScript Configuration

TypeScript settings are in `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

## Tailwind Configuration

Tailwind CSS 4.x is configured via the Vite plugin. Custom styles go in `src/styles/global.css`:

```css
@import 'tailwindcss';

@theme {
  --color-primary: oklch(0.5 0.2 250);
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

## Environment Variables

Create a `.env` file for environment-specific settings:

```bash
PUBLIC_SITE_NAME=Chris Lyons
PUBLIC_SITE_URL=https://chrislyons.dev
```

Access in your code:

```typescript
const siteName = import.meta.env.PUBLIC_SITE_NAME;
```

!!! warning "Security"
Only variables prefixed with `PUBLIC_` are exposed to the client.

## Metadata

Update site metadata in `src/layouts/Layout.astro`:

```astro
---
const { title } = Astro.props;
const description = 'Your site description';
const author = 'Your Name';
---
```

## Deployment Configuration

### Cloudflare Pages (Default)

Configuration in `wrangler.toml`:

```toml
name = "chrislyons-dev"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"

[build.upload]
dir = "./dist"

# Headers for security and performance
[[headers]]
for = "/*"
  [headers.values]
  X-Frame-Options = "DENY"
  X-Content-Type-Options = "nosniff"
```

Deployment is automated via `.github/workflows/cd.yml` with conditional logic:

- **Deploys to Cloudflare Pages** only when source code changes (src/, components/, scripts/, config files)
- **Skips deployment** for documentation-only changes (docs/, \*.md files)
- Can be manually triggered via workflow_dispatch

Required secrets in GitHub repository settings:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### GitHub Pages (Documentation)

MkDocs documentation is deployed to GitHub Pages via `.github/workflows/ci.yml`.

### Vercel (Alternative)

Configuration in `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  }
}
```

## Next Steps

- [Features Overview](../features/overview.md)
- [Architecture Details](../architecture/overview.md)
