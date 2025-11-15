# Deploying to Vercel

Deploy the main site to Vercel's global edge network.

## Why Vercel?

- **Zero Configuration**: Detects Astro automatically
- **Global CDN**: Edge network in 100+ locations
- **Automatic HTTPS**: Free SSL certificates
- **Preview Deployments**: Every PR gets a URL
- **Analytics**: Built-in performance monitoring
- **Edge Functions**: Optional serverless functions

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Repository on GitHub

## Initial Setup

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/in with GitHub
3. Click "Add New Project"
4. Import your repository

### 2. Configure Project

Vercel auto-detects Astro:

**Framework Preset:** Astro
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### 3. Environment Variables

Add any required environment variables:

```bash
PUBLIC_SITE_URL=https://yourdomain.com
```

### 4. Deploy

Click "Deploy" and wait ~2 minutes.

## Automatic Deployments

### Production Deployments

Every push to `main` deploys to production:

```bash
git checkout main
git pull
git merge feature/my-feature
git push origin main
# Automatic deployment starts
```

### Preview Deployments

Every PR gets a preview URL:

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# Create PR on GitHub
# Preview URL appears in PR comments
```

## Custom Domain

### Add Domain

1. Go to Project Settings → Domains
2. Add your domain: `yourdomain.com`
3. Configure DNS:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (~24 hours)

### SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.

## Configuration File

Create `vercel.json` for advanced config:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Analytics

### Enable Analytics

1. Go to Project Settings → Analytics
2. Enable "Web Analytics"
3. Add snippet to `Layout.astro`:

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
  {import.meta.env.PROD && <script defer src="/_vercel/insights/script.js" />}
</head>
```

### View Metrics

Monitor in Vercel dashboard:

- Page views
- Unique visitors
- Core Web Vitals
- Geographic distribution

## Performance

### Edge Caching

Vercel automatically caches static assets:

```
HTML:     5 minutes
Assets:   1 year (immutable)
```

### Optimization

Vercel applies:

- Brotli compression
- HTTP/2 push
- Image optimization
- Smart CDN routing

## Troubleshooting

### Build Failures

Check build logs in Vercel dashboard.

Common issues:

**Missing dependencies:**

```bash
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "fix: add lock file"
```

**Environment variables:**

```bash
# Add in Vercel dashboard
Settings → Environment Variables
```

### Deployment Issues

**Old version showing:**

- Clear CDN cache in Vercel
- Hard refresh browser (Ctrl+Shift+R)

**Domain not working:**

- Verify DNS settings
- Wait for propagation
- Check SSL certificate status

## CLI Deployment

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy from Terminal

```bash
# First time
vercel

# Production
vercel --prod

# Preview
vercel
```

## Environment-Specific Builds

### Production Build

```bash
# Sets NODE_ENV=production
npm run build
```

### Preview Build

Same as production, but deployed to preview URL.

## Monitoring

### Deployment Status

View in Vercel dashboard:

- Build logs
- Deployment status
- Error reports

### Real-Time Logs

```bash
# Install CLI
npm install -g vercel

# View logs
vercel logs
```

## Security

### Security Headers

Configured via `vercel.json`:

- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Content-Security-Policy

### DDoS Protection

Vercel provides:

- Rate limiting
- DDoS mitigation
- WAF (on Pro plan)

## Cost

### Free Tier

Includes:

- 100 GB bandwidth
- Unlimited deployments
- Preview deployments
- SSL certificates

### Pro Tier ($20/month)

Adds:

- 1 TB bandwidth
- Advanced analytics
- Password protection
- More team members

## Next Steps

- [GitHub Pages Setup](github-pages.md)
- [Deployment Overview](overview.md)
- [Architecture Guide](../architecture/overview.md)
