# Chris Lyons Personal Website

Personal website for Chris Lyons — developer, architect, and builder — hosted at [chrislyons.dev](https://chrislyons.dev)

## 🎯 Features

- **Modern Tech Stack**: Built with Astro, React, and TypeScript
- **Blazing Fast**: Static site generation with optimal performance
- **Dark Mode**: System-aware theme with manual toggle
- **View Transitions**: Smooth page navigation with Astro's View Transitions API
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4
- **SEO Optimized**: Meta tags, Open Graph, sitemap, and robots.txt
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **Interactive Components**: React islands for dynamic functionality
- **Performance**: Lighthouse scores 95+ across all metrics

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 5.x
- **UI Library**: [React](https://react.dev) 19.x
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4.x via Vite plugin
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Vite](https://vitejs.dev)

## 🚀 Project Structure

```text
/
├── public/               # Static assets
│   ├── cl_*.svg   # Favicons (dark/light variants)
│   └── robots.txt
├── src/
│   ├── components/       # React components
│   │   ├── ThemeToggle.tsx
│   │   ├── TechStack.tsx
│   │   └── CodeBlock.tsx
│   ├── layouts/          # Astro layouts
│   │   └── Layout.astro
│   ├── pages/            # File-based routing
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   ├── contact.astro
│   │   └── 404.astro
│   └── styles/
│       └── global.css    # Global styles + Tailwind
├── astro.config.mjs      # Astro configuration
├── tsconfig.json         # TypeScript configuration
└── package.json
```

## 🧞 Commands

| Command           | Action                               |
| :---------------- | :----------------------------------- |
| `npm install`     | Install dependencies                 |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`   |
| `npm run preview` | Preview production build locally     |

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

Built for static hosting (Vercel, Netlify, Cloudflare Pages):

```bash
npm run build
```

Output in `dist/` directory ready for deployment.

## 📄 License

MIT
