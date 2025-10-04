# Deploying to GitHub Pages

Deploy the MkDocs documentation site to GitHub Pages.

## Overview

GitHub Pages hosts the polished MkDocs documentation site, while the main repository contains contributor markdown files.

## Architecture

```
Repository
├── docs/              # MkDocs source (consumer docs)
├── mkdocs.yml         # MkDocs config
├── CONTRIBUTING.md    # Contributor docs (repo)
├── README.md          # Contributor docs (repo)
└── .github/
    └── workflows/
        └── docs.yml   # Deploy workflow
```

## Prerequisites

- GitHub repository
- MkDocs installed (via CI)
- GitHub Pages enabled

## Setup

### 1. Enable GitHub Pages

1. Go to Settings → Pages
2. Source: GitHub Actions
3. Save

### 2. Create Workflow

The workflow is in `.github/workflows/docs.yml`:

```yaml
name: Deploy MkDocs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'mkdocs.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.x'

      - name: Install MkDocs
        run: |
          pip install mkdocs-material
          pip install mkdocstrings
          pip install pymdown-extensions

      - name: Build site
        run: mkdocs build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site/

      - name: Deploy to Pages
        uses: actions/deploy-pages@v4
```

### 3. Commit and Push

```bash
git add .github/workflows/docs.yml
git commit -m "docs: add GitHub Pages deployment"
git push origin main
```

The site will deploy automatically.

## MkDocs Configuration

Key settings in `mkdocs.yml`:

```yaml
site_name: Chris Lyons - Developer, Architect, Builder
site_url: https://chrisalexlyons.github.io/home

theme:
  name: material
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: indigo
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: indigo

  features:
    - navigation.instant
    - navigation.tracking
    - search.suggest
    - content.code.copy

plugins:
  - search
  - autorefs

markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
  - admonition
  - toc:
      permalink: true
```

## Local Development

### Preview Site Locally

```bash
# Install MkDocs
pip install mkdocs-material

# Serve locally
mkdocs serve
```

Visit `http://localhost:8000`

### Build Locally

```bash
mkdocs build
```

Output in `site/` directory.

## Custom Domain

### Configure Domain

1. Add `CNAME` file to `docs/`:

```bash
echo "docs.yourdomain.com" > docs/CNAME
```

2. Configure DNS:

```
Type: CNAME
Name: docs
Value: yourusername.github.io
```

3. Update `mkdocs.yml`:

```yaml
site_url: https://docs.yourdomain.com
```

4. Enable in GitHub Settings → Pages

## Documentation Structure

### Consumer Docs (MkDocs)

Polished documentation for users:

```
docs/
├── index.md
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── configuration.md
├── features/
│   ├── overview.md
│   ├── tech-stack.md
│   ├── performance.md
│   └── accessibility.md
├── architecture/
│   ├── overview.md
│   ├── system-design.md
│   └── dependencies.md
└── deployment/
    ├── overview.md
    ├── vercel.md
    └── github-pages.md
```

### Contributor Docs (Repository)

Technical docs for contributors:

```
├── README.md           # Project overview
├── CONTRIBUTING.md     # Contribution guidelines
├── DEVELOPMENT.md      # Development setup
├── DEPLOYMENT.md       # Deployment procedures
└── ARCHITECTURE.md     # Technical architecture
```

## Deployment Triggers

Site rebuilds on:

1. **Push to main** (if docs changed)
2. **Manual trigger** (workflow_dispatch)

```bash
# Trigger manual deployment
gh workflow run docs.yml
```

## Monitoring

### Build Status

Check in:
- GitHub Actions tab
- Commit status checks

### View Logs

```bash
# Via GitHub CLI
gh run list --workflow=docs.yml
gh run view <run-id>
```

## Troubleshooting

### Build Fails

**Missing dependencies:**
```yaml
- name: Install dependencies
  run: |
    pip install mkdocs-material
    pip install pymdown-extensions
```

**Invalid markdown:**
- Check MkDocs logs
- Validate frontmatter
- Fix broken links

### Site Not Updating

1. Check Actions tab for failures
2. Clear browser cache
3. Wait for CDN propagation (~5 mins)

### 404 Errors

**Cause:** GitHub Pages not enabled

**Fix:**
1. Settings → Pages
2. Source: GitHub Actions
3. Wait for deployment

## Features

### Search

Built-in search via MkDocs Material:

```yaml
plugins:
  - search
```

### Code Highlighting

Syntax highlighting with Pygments:

```yaml
markdown_extensions:
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.superfences
```

### Mermaid Diagrams

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
```

### Dark Mode

Automatic dark mode toggle:

```yaml
theme:
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
```

## Cost

**Free** for public repositories.

GitHub Pages includes:
- 1 GB storage
- 100 GB bandwidth/month
- Custom domains
- HTTPS

## Next Steps

- [Vercel Deployment](vercel.md)
- [Deployment Overview](overview.md)
- [Getting Started](../getting-started/installation.md)

## GitHub Username Note

The documentation URL uses `chrislyons-dev.github.io/home/` based on your GitHub organization/username.
