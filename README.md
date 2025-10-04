# Chris Lyons Personal Website

Personal website for Chris Lyons — developer, architect, and builder — hosted at [chrislyons.dev](https://chrislyons.dev)

> **📖 [Full Documentation](https://chrislyons-dev.github.io/home/)** | **🤝 [Contributing](CONTRIBUTING.md)** | **🛠️ [Development Guide](DEVELOPMENT.md)**

## 🎯 Features

- **Modern Tech Stack**: Built with Astro, React, and TypeScript
- **Blazing Fast**: Static site generation with optimal performance
- **Dark Mode**: System-aware theme with manual toggle
- **View Transitions**: Smooth page navigation with Astro's View Transitions API
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4
- **SEO Optimized**: Meta tags, Open Graph, sitemap, and robots.txt
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **Interactive Components**: React islands for dynamic functionality
- **Performance**: Lighthouse CI automated testing (95+ performance, 95+ accessibility)

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 5.x
- **UI Library**: [React](https://react.dev) 19.x
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4.x via Vite plugin
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Vite](https://vitejs.dev)

## 🚀 Project Structure

```text
/
├── .github/
│   └── workflows/        # CI/CD pipelines
│       ├── ci.yml        # Build, test, docs, GitHub Pages
│       └── cd.yml        # Cloudflare deployment
├── docs/                 # MkDocs documentation
│   ├── getting-started/
│   ├── features/
│   ├── architecture/
│   ├── deployment/
│   └── api/
├── public/               # Static assets
│   ├── cl_*.svg          # Favicons
│   └── robots.txt
├── scripts/              # Build scripts
│   └── generate-architecture-docs.js
├── src/
│   ├── components/       # React components
│   ├── layouts/          # Astro layouts
│   ├── pages/            # File-based routing
│   ├── styles/           # Global styles + Tailwind
│   └── utils/            # Utility functions
├── astro.config.mjs      # Astro configuration
├── mkdocs.yml            # MkDocs configuration
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Test configuration
├── CONTRIBUTING.md       # Contribution guidelines
├── DEVELOPMENT.md        # Development guide
└── DEPLOYMENT.md         # Deployment guide
```

## 🧞 Commands

| Command                | Action                                      |
| :--------------------- | :------------------------------------------ |
| `npm install`          | Install dependencies                        |
| `npm run dev`          | Start dev server at `localhost:4321`        |
| `npm run build`        | Build production site to `./dist/`          |
| `npm run preview`      | Preview production build locally            |
| `npm test`             | Run tests with Vitest                       |
| `npm run test:ui`      | Run tests with UI                           |
| `npm run test:coverage`| Run tests with coverage report              |
| `npm run docs:arch`    | Generate architecture documentation         |
| `npm run deps:check`   | Check dependency structure                  |
| `npm run deps:graph`   | Generate dependency graph (requires Graphviz)|

## 🎨 Design Philosophy

Clean and minimal design with subtle technical sophistication:

- **Performance First**: Optimized bundle sizes, lazy loading, CSS minification
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Modern CSS**: CSS custom properties, oklch colors, view transitions
- **Responsive**: Mobile-first design that scales beautifully

## 🔧 Development

The site uses:

- **View Transitions** for smooth navigation between pages
- **React Islands** for interactive components (theme toggle, tech stack filter)
- **System-aware dark mode** with manual override
- **Reduced motion** support for accessibility
- **SEO optimization** with meta tags and structured data

## 📦 Deployment

Built for static hosting. Primary deployment: **Cloudflare Pages**

```bash
npm run build
```

Output in `dist/` directory ready for deployment.

**Deployment Options:**
- [Cloudflare Pages](https://chrislyons-dev.github.io/home/deployment/cloudflare/) (Primary)
- [Vercel](https://chrislyons-dev.github.io/home/deployment/vercel/)
- [GitHub Pages](https://chrislyons-dev.github.io/home/deployment/github-pages/) (Docs only)

See [DEPLOYMENT.md](DEPLOYMENT.md) for quick start or the [full deployment guide](https://chrislyons-dev.github.io/home/deployment/overview/) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Quick start for contributors:

```bash
git clone https://github.com/chrislyons-dev/home.git
cd home
npm install
npm run dev
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development documentation.

## 📚 Documentation

This repository contains two types of documentation:

### For Users/Consumers

**MkDocs Site:** [chrislyons-dev.github.io/home](https://chrislyons-dev.github.io/home/)

Polished, comprehensive documentation including:
- Getting Started guides
- Feature documentation
- Architecture diagrams
- API reference
- Deployment guides

### For Contributors

**Repository Markdown Files:**
- [README.md](README.md) - Project overview (you are here)
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development setup and workflow
- [DEPLOYMENT.md](DEPLOYMENT.md) - Quick deployment reference

## 📄 License

MIT
