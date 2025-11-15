# Configuration Files

This directory contains configuration files for various development tools and services.

## Contents

### Build & Development Tools

- **[.dependency-cruiser.json](.dependency-cruiser.json)** - Dependency validation rules
- **[puppeteer-config.json](puppeteer-config.json)** - Puppeteer browser automation settings

### Quality & Testing

- **[.commitlintrc.json](.commitlintrc.json)** - Commit message linting rules (Conventional Commits)
- **[.lighthouserc.json](.lighthouserc.json)** - Lighthouse CI performance testing configuration

## Usage

These configs are referenced by:

- **CI/CD Workflows**: `.github/workflows/ci.yml`
- **NPM Scripts**: `package.json`
- **Git Hooks**: `.husky/commit-msg`, `.husky/pre-commit`

## Framework Configs (Still in Root)

Some configs remain in the project root because the tools require it:

- `astro.config.mjs` - Astro framework
- `tsconfig.json` - TypeScript compiler
- `vitest.config.ts` - Vitest test runner
- `mkdocs.yml` - MkDocs documentation
- `vercel.json` - Vercel deployment
- `wrangler.toml` - Cloudflare Workers

## Editing Configs

After modifying configs in this directory, verify with:

```bash
# Test dependency rules
npm run deps:check

# Test Lighthouse config
npm run lighthouse

# Test commit message validation
echo "test: example" | npx commitlint --config config/.commitlintrc.json
```
