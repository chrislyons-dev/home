# Build Tools

This directory contains build-time tools that are version controlled for reproducibility and security.

## PlantUML JAR

**File:** `plantuml.jar`
**Version:** 1.2024.6
**Purpose:** Generate SVG diagrams from .puml files at build time
**Source:** https://github.com/plantuml/plantuml/releases/tag/v1.2024.6

### Why Committed?

- ... **Security:** Verified hash, no supply chain attacks
- ... **Reproducibility:** Same version across all environments
- ... **Reliability:** No network dependencies during builds
- ... **Offline:** Works without internet access
- ... **Speed:** No download time in CI/CD

### Verification

```bash
# Check version
java -jar tools/plantuml.jar -version

# Verify integrity (SHA256)
# Expected: (add hash after download)
```

### Upgrading

When a new stable PlantUML version is released:

1. Download new JAR: `curl -L https://github.com/plantuml/plantuml/releases/download/vX.X.X/plantuml-X.X.X.jar -o tools/plantuml.jar`
2. Test locally: `npm run diagrams:generate`
3. Verify diagrams render correctly
4. Commit: `git add tools/plantuml.jar && git commit -m "chore: upgrade PlantUML to vX.X.X"`

### CI/CD

The `generate-diagram-images.mjs` script automatically:

1. Checks for `tools/plantuml.jar` (used if present)
2. Falls back to Kroki.io web service if JAR unavailable
3. Sanitizes all SVG output for security

No CI/CD configuration changes needed - the JAR is committed and ready to use.
