# Deployment Guide

This site is optimized for deployment to modern static hosting platforms.

## Quick Deploy

### Vercel (Recommended)

1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

Build command: `npm run build`
Publish directory: `dist`

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages

2. Configuration:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18 or higher

## Manual Deployment

1. Build the site:
   ```bash
   npm run build
   ```

2. The `dist/` directory contains all static files ready for deployment

3. Upload the contents of `dist/` to any static hosting service

## Environment Variables

No environment variables required for the basic site.

## Custom Domain

1. Add your domain in your hosting provider's dashboard
2. Update DNS records as instructed
3. SSL/TLS certificates are typically auto-generated

## Performance Tips

- ✅ Already optimized for Core Web Vitals
- ✅ Static site generation (SSG) enabled
- ✅ CSS minification via Lightning CSS
- ✅ Automatic image optimization
- ✅ View Transitions API for smooth navigation

## Monitoring

Consider adding:
- Google Analytics or Plausible for analytics
- Sentry for error tracking
- Vercel Analytics for performance monitoring
