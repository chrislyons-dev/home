# Dependencies

Understanding the project's dependency structure and management.

## Dependency Overview

### Production Dependencies

Core dependencies shipped to production:

| Package | Version | Purpose |
|---------|---------|---------|
| astro | ^5.14.1 | Static site framework |
| react | ^19.2.0 | UI library |
| react-dom | ^19.2.0 | React DOM renderer |
| tailwindcss | ^4.1.14 | Utility-first CSS |
| @astrojs/react | ^4.4.0 | Astro React integration |
| @astrojs/sitemap | ^3.6.0 | Sitemap generation |
| @tailwindcss/vite | ^4.1.14 | Tailwind Vite plugin |

### Development Dependencies

Tools used during development:

| Package | Version | Purpose |
|---------|---------|---------|
| vitest | ^3.2.4 | Unit testing |
| typescript | Latest | Type checking |
| husky | ^9.1.7 | Git hooks |
| @commitlint/cli | ^20.1.0 | Commit linting |
| dependency-cruiser | ^17.0.1 | Dependency analysis |

## Dependency Graph

### Visual Dependency Map

```mermaid
graph TD
    App[Application]

    App --> Astro[Astro 5.x]
    App --> React[React 19.x]
    App --> TW[Tailwind 4.x]

    Astro --> AstroReact[@astrojs/react]
    Astro --> AstroSitemap[@astrojs/sitemap]
    Astro --> Vite[Vite]

    React --> ReactDOM[react-dom]

    TW --> TWVite[@tailwindcss/vite]
    TWVite --> Vite

    Vite --> Rollup[Rollup]
```

### Dependency Layers

```
┌─────────────────────────────────────┐
│ Application Code                    │
├─────────────────────────────────────┤
│ Framework Layer (Astro, React)      │
├─────────────────────────────────────┤
│ Build Tools (Vite, TypeScript)      │
├─────────────────────────────────────┤
│ Node.js Runtime                     │
└─────────────────────────────────────┘
```

## Dependency Rules

### Enforced Rules

Via dependency-cruiser configuration:

```javascript
{
  "forbidden": [
    {
      "name": "no-circular",
      "severity": "error",
      "comment": "No circular dependencies allowed",
      "from": {},
      "to": { "circular": true }
    },
    {
      "name": "no-orphans",
      "severity": "warn",
      "from": {
        "orphan": true,
        "pathNot": "\\.(d|test|spec)\\.ts$"
      }
    }
  ]
}
```

### Best Practices

1. **Minimize production dependencies**
   - Only include what's shipped to users
   - Move dev tools to devDependencies

2. **Version pinning**
   - Use `^` for minor updates
   - Test before major version bumps

3. **Regular updates**
   - Dependabot auto-updates
   - Weekly security checks

4. **Audit regularly**
   - Run `npm audit` before releases
   - Fix high/critical vulnerabilities immediately

## Dependency Analysis

### Check Dependencies

```bash
# Validate dependency structure
npm run deps:check

# Generate visual graph
npm run deps:graph
```

### View Dependencies

```bash
# List all dependencies
npm list

# List production only
npm list --prod

# Check for outdated
npm outdated
```

## Security Management

### Automated Security

**Dependabot Configuration:**

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### Manual Security Checks

```bash
# Audit for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# See detailed report
npm audit --json
```

## Bundle Analysis

### Bundle Size

Track bundle sizes over time:

```bash
# Build and analyze
npm run build

# View bundle visualization
npm run analyze
```

### Current Bundle Sizes

| Bundle | Size (gzipped) |
|--------|----------------|
| Main CSS | ~15kb |
| Main JS | ~5kb |
| React chunk | ~40kb |
| **Total** | **~60kb** |

## Dependency Updates

### Update Strategy

1. **Patch updates**: Auto-merge via Dependabot
2. **Minor updates**: Review changes, test, merge
3. **Major updates**: Careful review, full testing

### Update Commands

```bash
# Update all to latest patch
npm update

# Update specific package
npm update astro

# Update to latest (including major)
npm install astro@latest
```

## Common Dependency Tasks

### Add New Dependency

```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name
```

### Remove Dependency

```bash
npm uninstall package-name
```

### Verify Installations

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Verify integrity
npm ci
```

## Dependency Tree

### Full Tree Structure

```
home@1.0.0
├── astro@5.14.1
│   ├── @astrojs/compiler@2.x
│   ├── vite@6.x
│   └── zod@3.x
├── react@19.2.0
├── react-dom@19.2.0
│   └── react@19.2.0 (deduped)
├── tailwindcss@4.1.14
│   └── @tailwindcss/oxide@4.x
└── (... dev dependencies)
```

## Troubleshooting

### Dependency Conflicts

```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Version Mismatches

```bash
# Check for duplicates
npm dedupe

# Verify versions
npm list package-name
```

### Build Issues

```bash
# Ensure lock file matches
npm ci

# Update lock file
npm install --package-lock-only
```

## Next Steps

- [Architecture Overview](overview.md)
- [System Design](system-design.md)
- [Deployment Guide](../deployment/overview.md)
