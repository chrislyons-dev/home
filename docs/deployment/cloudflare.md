# Deploying to Cloudflare Pages

Deploy your site to Cloudflare's global edge network.

## Why Cloudflare Pages?

- **Global Edge Network**: 300+ locations worldwide
- **Zero Configuration**: Auto-detects Astro
- **Unlimited Bandwidth**: No bandwidth limits on free tier
- **Preview Deployments**: Every branch gets a URL
- **Built-in Analytics**: Free Web Analytics
- **Edge Functions**: Serverless functions at the edge

## Prerequisites

- Cloudflare account (free tier works)
- GitHub repository
- Repository pushed to GitHub

## Setup via Dashboard

### 1. Connect Repository

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create application**
3. Select **Pages** → **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select your repository: `chrislyons-dev/home`

### 2. Configure Build

Cloudflare auto-detects Astro, but verify these settings:

**Build Configuration:**

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (default)
- **Node version**: 20

**Environment Variables:**

```
PUBLIC_SITE_URL=https://chrislyons.dev
```

### 3. Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes for initial build
3. Your site will be live at `https://chrislyons-dev.pages.dev`

## Branch Deployments

### Production Branch

Set your production branch in project settings:

1. **Settings** → **Builds & deployments**
2. **Production branch**: `main`
3. Every push to `main` deploys to production

### Preview Branches

All other branches automatically get preview URLs:

```bash
# Create feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Preview URL: `https://[commit-hash].chrislyons-dev.pages.dev`

### Branch-Specific Deployments

Configure which branches trigger deployments:

1. **Settings** → **Builds & deployments**
2. **Branch deployments**
3. Add branches:
   - `main` → Production
   - `staging` → Staging environment
   - `develop` → Development preview

## Setup via GitHub Actions

For more control, use the GitHub Actions workflow.

### 1. Get Cloudflare Credentials

**API Token:**

1. Cloudflare Dashboard → **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Copy the token

**Account ID:**

1. Cloudflare Dashboard → **Workers & Pages**
2. Copy **Account ID** from the right sidebar

### 2. Add GitHub Secrets

1. GitHub Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: [your API token]
4. Add:
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: [your account ID]

### 3. Workflow Configuration

The workflow in `.github/workflows/cloudflare.yml` handles deployment:

```yaml
on:
  push:
    branches:
      - main # Production
      - staging # Staging environment
      - develop # Development preview
```

**Customize branches** by editing the workflow file.

### 4. Deploy

```bash
git add .
git commit -m "feat: configure Cloudflare Pages"
git push origin main
```

GitHub Actions will build and deploy automatically.

## Custom Domain

### Add Custom Domain

1. **Custom domains** → **Set up a custom domain**
2. Enter your domain: `chrislyons.dev`
3. Choose setup method:

**Option A: Cloudflare-managed DNS**

1. Domain already on Cloudflare
2. Click **Activate domain**
3. DNS records added automatically

**Option B: External DNS**

1. Add CNAME record:
   ```
   Type: CNAME
   Name: @
   Value: chrislyons-dev.pages.dev
   ```
2. For apex domain, use CNAME flattening or ALIAS record

### SSL/TLS

SSL certificates are automatically provisioned:

- Universal SSL (default)
- Auto-renewal every 90 days
- Full (strict) encryption mode recommended

## Environment Variables

### Add Variables

1. **Settings** → **Environment variables**
2. Click **Add variable**
3. Set per environment:
   - **Production**: `main` branch
   - **Preview**: All other branches

**Example:**

```
PUBLIC_SITE_URL
  Production: https://chrislyons.dev
  Preview: https://preview.chrislyons.dev
```

### Access in Code

```typescript
const siteUrl = import.meta.env.PUBLIC_SITE_URL;
```

## Build Configuration

### Custom Build Command

Override default build in **Settings** → **Builds & deployments**:

```bash
# Install dependencies and build
npm ci && npm run build

# Run tests before build
npm ci && npm test && npm run build
```

### Build Watch Paths

Trigger builds only on specific file changes:

1. **Settings** → **Builds & deployments**
2. **Build watch paths**
3. Add patterns:
   ```
   src/**
   public/**
   astro.config.mjs
   package.json
   ```

## Performance

### Edge Caching

Cloudflare automatically caches:

- **Static assets**: 1 year
- **HTML**: Configurable
- **Images**: Auto-optimized

### Headers Configuration

Set in `wrangler.toml`:

```toml
[[headers]]
for = "/*"
  [headers.values]
  Cache-Control = "public, max-age=3600"
```

### Compression

Auto-enabled:

- Brotli compression
- Gzip fallback
- Smart compression

## Analytics

### Enable Web Analytics

1. **Analytics** → **Web Analytics**
2. Enable for your domain
3. View metrics:
   - Page views
   - Unique visitors
   - Geographic distribution
   - Performance metrics

### Custom Events

Add to your site:

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "your-token"}'
></script>
```

## Functions (Optional)

### Add Edge Functions

Create `functions/` directory:

```typescript
// functions/api/hello.ts
export const onRequest: PagesFunction = async (context) => {
  return new Response('Hello from the edge!');
};
```

Available at: `/api/hello`

## Rollback

### Revert to Previous Deployment

1. **Deployments** tab
2. Find last good deployment
3. Click **⋯** → **Rollback to this deployment**
4. Confirm rollback

### Via Git

```bash
git revert <commit-hash>
git push origin main
```

## Monitoring

### Deployment Status

View in real-time:

- **Deployments** tab
- Build logs
- Deployment timeline

### Error Logs

1. **Functions** → **Logs** (if using functions)
2. Real-time error tracking
3. Filter by severity

## Troubleshooting

### Build Failures

**Check build logs:**

1. Go to failed deployment
2. View **Build log**
3. Look for errors

**Common issues:**

**Node version mismatch:**

```bash
# In build settings
Environment variable: NODE_VERSION=20
```

**Missing dependencies:**

```bash
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "fix: add lock file"
```

### Deployment Not Updating

1. **Clear build cache**:
   - Settings → Builds & deployments
   - Clear cache and retry

2. **Force rebuild**:
   ```bash
   git commit --allow-empty -m "chore: trigger rebuild"
   git push
   ```

### Custom Domain Issues

**CNAME not resolving:**

- Wait for DNS propagation (up to 48 hours)
- Verify DNS records: `dig chrislyons.dev`
- Check Cloudflare DNS settings

**SSL errors:**

- Ensure SSL/TLS mode is Full (strict)
- Wait for certificate provisioning
- Check **SSL/TLS** → **Edge Certificates**

## CI/CD Integration

### GitHub Actions + Cloudflare

Full workflow in `.github/workflows/cloudflare.yml`:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: chrislyons-dev
    directory: dist
    branch: ${{ github.ref_name }}
```

## Cost

### Free Tier

Includes:

- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- 20,000 functions requests/day (if using functions)

### Pro Tier ($20/month)

Adds:

- 5,000 builds/month
- Advanced DDoS protection
- Faster builds
- Priority support

## Comparison with Other Platforms

| Feature        | Cloudflare | Vercel     | Netlify       |
| -------------- | ---------- | ---------- | ------------- |
| Bandwidth      | Unlimited  | 100GB      | 100GB         |
| Build minutes  | 500/mo     | 6,000/mo   | 300/mo        |
| Edge locations | 300+       | 100+       | 100+          |
| Functions      | Yes (free) | Yes (paid) | Yes (125k/mo) |
| Analytics      | Free       | Paid       | Paid          |

## Next Steps

- [Deployment Overview](overview.md)
- [Vercel Deployment](vercel.md)
- [GitHub Pages Setup](github-pages.md)
- [Performance Guide](../features/performance.md)
