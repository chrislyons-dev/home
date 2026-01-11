# Deployment Guide

This site is optimized for deployment to modern static hosting platforms.

> **Note:** For detailed deployment documentation, see the [MkDocs documentation site](https://chrislyons-dev.github.io/home/).

## Quick Deploy

### Cloudflare Pages (Primary)

**Primary production deployment platform.**

1. Connect your GitHub repository to Cloudflare Pages
2. Cloudflare auto-detects Astro configuration
3. Push to configured branches triggers deployment

See [detailed Cloudflare guide](https://chrislyons-dev.github.io/home/deployment/cloudflare/) for full setup.

### Vercel (Alternative)

1. Connect your GitHub repository to Vercel
2. Vercel auto-detects Astro configuration
3. Push to `main` branch triggers deployment

See [detailed Vercel guide](https://chrislyons-dev.github.io/home/deployment/vercel/) for advanced configuration.

### GitHub Pages

**Documentation site deployment.**

MkDocs documentation automatically deploys to GitHub Pages via GitHub Actions.

See [detailed GitHub Pages guide](https://chrislyons-dev.github.io/home/deployment/github-pages/) for setup.

### Other Platforms

Also compatible with:

- Netlify
- AWS S3 + CloudFront
- Any static host

## Manual Deployment

1. Build the site:

   ```bash
   npm run build
   ```

2. The `dist/` directory contains all static files ready for deployment

3. Upload the contents of `dist/` to any static hosting service

## Environment Variables

No environment variables required for the basic site.

Optional:

```bash
PUBLIC_SITE_URL=https://chrislyons.dev
```

## Custom Domain

1. Add your domain in your hosting provider's dashboard
2. Update DNS records as instructed
3. SSL/TLS certificates are typically auto-generated

## Performance

Already optimized for:

- Core Web Vitals
- Static site generation (SSG)
- CSS minification
- Image optimization
- View Transitions API

## Documentation

For comprehensive deployment guides, visit the [documentation site](https://chrislyons-dev.github.io/home/):

- [Deployment Overview](https://chrislyons-dev.github.io/home/deployment/overview/)
- [Cloudflare Pages](https://chrislyons-dev.github.io/home/deployment/cloudflare/) (Primary)
- [Vercel Deployment](https://chrislyons-dev.github.io/home/deployment/vercel/)
- [GitHub Pages Setup](https://chrislyons-dev.github.io/home/deployment/github-pages/)
