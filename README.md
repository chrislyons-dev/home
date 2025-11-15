# Chris Lyons Personal Website

Personal website for Chris Lyons — developer, architect, and builder — hosted at [chrislyons.dev](https://chrislyons.dev)

A modern, performant portfolio built with Astro, React, and TypeScript. Features static site generation, island architecture, and Lighthouse CI scores of 95+ across all metrics.

> **📖 [Full Documentation](https://chrislyons-dev.github.io/home/)**

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Astro** 5.x - Static site framework
- **React** 19.x - Interactive components
- **Tailwind CSS** 4.x - Styling
- **TypeScript** - Type safety
- **Vite** - Build tool

## Key Features

- **Blazing Fast**: Static generation, minimal JavaScript, optimized assets
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **Responsive**: Mobile-first design that scales beautifully
- **Dark Mode**: System-aware theme with manual toggle
- **SEO Optimized**: Complete meta tags, sitemap, and structured data

## Project Structure

```text
/
├── src/
│   ├── components/       # React components
│   ├── layouts/          # Astro layouts
│   ├── pages/            # File-based routing
│   ├── services/         # Business logic (ThemeManager, etc.)
│   └── styles/           # Global styles + Tailwind
├── docs/                 # MkDocs documentation
├── public/               # Static assets
└── .github/workflows/    # CI/CD pipelines
```

## Commands

| Command              | Action                     |
| -------------------- | -------------------------- |
| `npm run dev`        | Start dev server           |
| `npm run build`      | Build for production       |
| `npm test`           | Run tests                  |
| `npm run lighthouse` | Run performance audits     |
| `npm run docs:arch`  | Generate architecture docs |

## Deployment

Primary deployment: **Cloudflare Pages** (automatic on push to `main`)

```bash
npm run build  # Output in dist/
```

See [.docs/DEPLOYMENT.md](.docs/DEPLOYMENT.md) for platform-specific guides.

## Security Headers

Strict transport and isolation headers are defined in `public/_headers`. They enforce:

- Hardened CSP aligned with current assets (self-hosted scripts plus hashed inline theme bootstrap)
- Frame protection via `frame-ancestors 'none'` and `X-Frame-Options: DENY`
- COOP/CORP for process isolation, plus HSTS, Referrer-Policy, and restrictive Permissions-Policy

Cloudflare Pages automatically picks up this file at deploy time.

## Contributing

See [.docs/CONTRIBUTING.md](.docs/CONTRIBUTING.md) for guidelines.

```bash
git clone https://github.com/chrislyons-dev/home.git
cd home
npm install
npm run dev
```

For detailed development workflows, see [.docs/DEVELOPMENT.md](.docs/DEVELOPMENT.md).

## Documentation

- **[Full Documentation](https://chrislyons-dev.github.io/home/)** - Comprehensive guides, features, and architecture
- **[.docs/CONTRIBUTING.md](.docs/CONTRIBUTING.md)** - Contribution guidelines
- **[.docs/DEVELOPMENT.md](.docs/DEVELOPMENT.md)** - Development setup and patterns
- **[.docs/DEPLOYMENT.md](.docs/DEPLOYMENT.md)** - Deployment guides

## License

MIT
