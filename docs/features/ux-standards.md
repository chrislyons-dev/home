# UX Standards

Fast. Clear. Accessible. Works on anything with a screen.

This document defines user experience standards for design, responsiveness, theming, and usability.

---

## Core UX Principles

### 1. Clarity Over Cleverness

Users should understand **what to do next** without a tooltip or training.

**Examples:**

- ✅ Button says "View Projects" (clear action)
- ❌ Button says "Explore" (vague, could mean anything)

### 2. Consistency Beats Novelty

Reuse established patterns and components. New patterns require a good reason.

**Why:** Users learn once, apply everywhere. Inconsistent patterns force re-learning and create friction.

### 3. Fast by Default

Users should feel the app responds immediately, even on a budget phone and mediocre network.

**Targets:**

- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- No layout shifts during load

### 4. Accessible for Everyone

Keyboard users, screen readers, and users with low vision or motion sensitivity are first-class citizens.

**Requirements:**

- All interactive elements keyboard-accessible
- WCAG 2.1 AA contrast ratios
- Respect `prefers-reduced-motion`

See [Accessibility](accessibility.md) for full standards.

### 5. Mobile is Not Second-Class

Every feature must be usable on mobile-size screens.

**Test at minimum:**

- 375×667 (mobile)
- 768×1024 (tablet)
- 1280×720 (desktop)

### 6. Intentional, Not Templated

Every design choice should serve the content and user needs, not just fill a template.

---

## Avoid Generic UI Patterns

Don't build pages that feel like a template with words poured in.

### ❌ Oversized Hero with No Content

**Problem:**

- Takes full viewport height
- Contains only a vague slogan ("Build. Scale. Win.")
- Forces scroll to see any actual information

**✅ Do Instead:**

- Hero should be 50-70% viewport height max
- Include clear value proposition in 1-2 sentences
- Show what it is, not just aspirational vibes

**Example:**

```astro
<!-- ❌ Bad -->
<section class="flex h-screen items-center justify-center">
  <h1>Transform Your Workflow</h1>
</section>

<!-- ✅ Good -->
<section class="flex min-h-[60vh] items-center justify-center">
  <div>
    <h1>Portfolio Site Generator</h1>
    <p>Static site builder with Astro 5 and React 19. Ships zero JavaScript by default.</p>
  </div>
</section>
```

---

### ❌ Generic CTA Pair

**Problem:**

- "Get Started" + "Learn More"
- No context for what either button does
- Could swap them and nothing changes
- User can't predict the outcome

**✅ Do Instead:**

- Specific CTAs: "View Projects", "Read the Code", "See Architecture"
- One primary action per section
- Button text describes the outcome

**Example:**

```astro
<!-- ❌ Bad -->
<button>Get Started</button>
<button>Learn More</button>

<!-- ✅ Good -->
<a href="/projects" class="btn-primary">View Projects</a>
<a href="/architecture" class="btn-secondary">See System Design</a>
```

---

### ❌ Cookie-Cutter Feature Trio

**Problem:**

- Three identical cards after hero
- Generic icons (rocket, shield, lightning)
- Vague headlines: "Automate", "Scale", "Secure"
- One-line descriptions that fit any product

**✅ Do Instead:**

- Show real features with specific outcomes
- Use screenshots or actual UI elements
- Explain what each feature does concretely
- If you need three cards, make them meaningfully different

**Example:**

```astro
<!-- ❌ Bad -->
<div class="grid grid-cols-3">
  <div>
    <span>🚀</span>
    <h3>Automate</h3>
    <p>Streamline your workflow.</p>
  </div>
  <!-- ... more generic cards ... -->
</div>

<!-- ✅ Good -->
<div class="grid grid-cols-3 gap-4">
  <div>
    <h3>Island Architecture</h3>
    <p>Ships 45kb of JS (gzipped). Only interactive components load JavaScript.</p>
    <code>client:idle</code> directive for selective hydration.
  </div>
  <div>
    <h3>Content Collections</h3>
    <p>Type-safe markdown with Zod validation. Build fails if frontmatter is invalid.</p>
    <code>schema: z.object(&#123; title: z.string() &#125;)</code>
  </div>
  <div>
    <h3>Edge Deployment</h3>
    <p>Deploys to Cloudflare Pages in 90 seconds. Global CDN with 1-year asset caching.</p>
  </div>
</div>
```

---

### ❌ Endless Alternating Sections

**Problem:**

- Image left, text right
- Then image right, text left
- Repeat 6+ times with same rhythm
- No content density, just padding

**✅ Do Instead:**

- Vary section layouts based on content type
- Group related information
- Use grids for dense information
- Break rhythm intentionally when changing topics

---

### ❌ Stock Abstract Shapes as "Visual Identity"

**Problem:**

- Gradient blobs
- Floating geometric shapes
- Generic wave patterns
- No connection to actual content

**✅ Do Instead:**

- Show actual product screenshots
- Use code snippets or real data
- Diagrams that explain something specific
- Real examples over decorative graphics

---

## Information Density Tests

Before shipping a page, test:

### 1. Swap Test

Can you swap the company/product name and nothing breaks?

**If yes:** Add specifics that uniquely describe this product.

**Example:**

- ❌ "A modern solution for developers"
- ✅ "Static site generator with Astro 5, React 19, and TypeScript"

### 2. 10-Second Test

Can a visitor answer "What is this?" in 10 seconds?

**If no:** Clarify the value proposition and move it higher on the page.

### 3. Screenshot Test

Do visuals show the actual product/work, or just decoration?

**Good screenshots:**

- Code editor with actual implementation
- Terminal showing build output
- Lighthouse score results
- Dependency graph diagrams

**Bad screenshots:**

- Stock photos of laptops
- Generic abstract shapes
- Unsplash hero images

### 4. Constraint Test

Does the page mention what it's NOT for, or prerequisites?

**Example:**

- "Requires Node.js 20+"
- "Not suitable for server-rendered apps (use Next.js instead)"
- "Best for portfolios and blogs (< 100 pages)"

### 5. Proof Test

Does each claim have evidence (numbers, examples, links)?

**Examples:**

- ❌ "Fast performance"
- ✅ "Lighthouse Performance score: 98 (see [report](#))"

- ❌ "Easy to deploy"
- ✅ "Deploy in 90 seconds with `npm run build && git push`"

---

## Responsive Design Requirements

Use a **mobile-first** approach with these breakpoints:

| Breakpoint        | Size        | Usage                              |
| ----------------- | ----------- | ---------------------------------- |
| XS / Mobile       | < 640px     | Single-column layout, compact nav  |
| SM / Small tablet | 640–767px   | May add simple two-column grids    |
| MD / Tablet       | 768–1023px  | Two-column layouts, persistent nav |
| LG / Desktop      | 1024–1439px | Multi-column, sidebar layouts      |
| XL / Wide desktop | ≥ 1440px    | Wide grids, more whitespace        |

### Layout Rules

**Must not break at any width from 320px to 1920px:**

- No horizontal scroll
- No cutoff content
- No overflow issues

### Navigation

**Mobile (< 768px):**

- Compact nav (hamburger, bottom nav, or collapsible sidebar)
- Touch targets minimum 44x44px

**Desktop (≥ 768px):**

- Persistent nav is fine, but must degrade cleanly

### Content Flow

**Mobile:**

- Single-column primary content
- Sidebars stack below main content

**Tablet:**

- Simple two-column layouts allowed

**Desktop:**

- Multi-column / sidebar layouts allowed
- Must degrade gracefully at smaller widths

### Typography

Use responsive units (`rem`, `em`, `clamp`) rather than hard-coded pixel sizes.

**Example:**

```css
/* ❌ Bad - fixed size */
h1 {
  font-size: 48px;
}

/* ✅ Good - responsive */
h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}
```

### Implementation

**Prefer:**

- CSS Grid / Flexbox for layout
- Container queries when available
- Tailwind's responsive utilities (`sm:`, `md:`, `lg:`)

**Avoid:**

- Absolute positioning (except for overlays/menus/toasts)
- Fixed widths that break at other sizes

---

## Light & Dark Mode Requirements

Support **both light and dark themes** by default.

### Manual Toggle Required

Every app **must** provide a clear UI control (e.g., sun/moon toggle) to switch themes.

**Exception:** If a specific project constraint prohibits it, document the exception.

### System Preference Optional

You may respect `prefers-color-scheme` for the initial theme, but the user's manual choice wins.

### Persistence

Store the user's choice in `localStorage` and honor it on every page load.

**Example:**

```typescript
// ThemeManager
setTheme(theme: Theme) {
  document.documentElement.classList.remove('theme-light', 'theme-dark');
  document.documentElement.classList.add(`theme-${theme}`);
  localStorage.setItem('theme', theme);
}
```

### FOUC Prevention

Apply theme class before initial paint:

```astro
<script is:inline define:vars={{ themeInitScript }}>
  // Runs immediately, before page render
  const theme = localStorage.getItem('theme') || 'system';
  document.documentElement.classList.add(`theme-${theme}`);
</script>
```

### Implementation

**Use CSS variables (design tokens):**

```css
@theme {
  --color-bg: oklch(1 0 0);
  --color-text: oklch(0.2 0 0);
}

@variant dark {
  --color-bg: oklch(0.15 0 0);
  --color-text: oklch(0.9 0 0);
}
```

### Contrast Requirements

Both themes must meet **WCAG 2.1 AA** contrast ratios:

- Normal text: ≥ 4.5:1
- Large text: ≥ 3:1
- Interactive elements: ≥ 3:1

See [Accessibility](accessibility.md) for details.

---

## Usability & Interaction

### Obvious Actions

Primary actions (e.g., "Save", "Submit", "Next") should be visually distinct and consistent.

**Example:**

```astro
<button class="btn-primary">Save Changes</button>
<button class="btn-secondary">Cancel</button>
```

### Error Handling

**Inline, contextual errors near the fields:**

```astro
<label for="email">Email</label>
<input type="email" id="email" aria-invalid={hasError} aria-describedby="email-error" />
{
  hasError && (
    <span id="email-error" role="alert" class="text-red-600">
      Invalid email format
    </span>
  )
}
```

**Clear, human-readable messages:**

- ❌ "Error 500"
- ✅ "We couldn't save your changes because the file is read-only. Try saving to a different location."

**No stack traces or jargon in production.**

### Empty States

Each main view should have a deliberate empty state:

```astro
{
  projects.length === 0 ? (
    <div class="empty-state">
      <p>No projects yet.</p>
      <a href="/new" class="btn-primary">
        Create Your First Project
      </a>
    </div>
  ) : (
    <ProjectList projects={projects} />
  )
}
```

### Loading States

**Use skeletons or spinners where needed:**

```astro
{isLoading ? <div class="skeleton h-32 w-full" /> : <Content />}
```

**For long waits, show explanatory text or progress:**

```astro
{
  isGenerating && (
    <div>
      <Spinner />
      <p>Generating architecture diagrams... (this may take 30 seconds)</p>
    </div>
  )
}
```

---

## Best Practices

### Images

**Use modern formats with fallbacks:**

```astro
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Description" loading="lazy" />
</picture>
```

**Lazy load below-the-fold images:**

```astro
<img src="diagram.svg" alt="System architecture" loading="lazy" />
```

### Forms

**Proper labels and error handling:**

```astro
<label for="name">
  Name <span aria-label="required">*</span>
</label>
<input
  type="text"
  id="name"
  name="name"
  aria-required="true"
  aria-invalid={errors.name}
  aria-describedby="name-error"
/>
{
  errors.name && (
    <span id="name-error" role="alert">
      {errors.name}
    </span>
  )
}
```

### Icons

**All non-decorative icons must have labels:**

```astro
<!-- ✅ Via adjacent text -->
<button>
  <SearchIcon />
  <span>Search</span>
</button>

<!-- ✅ Via aria-label -->
<button aria-label="Search">
  <SearchIcon />
</button>

<!-- ✅ Decorative icon -->
<span aria-hidden="true">🎨</span>
```

---

## "Done" Checklist for UI Features

Before calling a UI feature done:

### Responsive

- [ ] Works and looks correct on **mobile, tablet, and desktop**
- [ ] No horizontal scroll at any width (320px to 1920px)
- [ ] Touch targets are minimum 44x44px on mobile

### Theming

- [ ] Light & dark mode both functional
- [ ] Manual theme toggle present (or exception documented)
- [ ] Theme persists in localStorage
- [ ] No FOUC (flash of unstyled content)

### Accessibility

- [ ] Keyboard navigation works
- [ ] Visible focus states on interactive elements
- [ ] Accessible naming (`aria-*`, labels, alt text) in place
- [ ] Contrast meets WCAG 2.1 AA

### Performance

- [ ] Lighthouse (mobile) meets targets:
  - Performance ≥ 95
  - Accessibility ≥ 95
  - Best Practices ≥ 95
  - SEO ≥ 95
- [ ] No obvious layout shifts or jank on load

### UX

- [ ] Error, empty, and loading states are intentional and understandable
- [ ] Primary actions are visually distinct
- [ ] Error messages are clear and actionable
- [ ] No real PII or secrets in screenshots, test data, or demo content

### Design Quality

- [ ] Passes information density tests (swap, 10-second, screenshot, constraint, proof)
- [ ] No generic UI patterns (oversized hero, vague CTAs, cookie-cutter cards)
- [ ] Real content, not placeholder vibes

---

**Mantra:** _If it only looks good on your laptop, it's not done._

The UI must be **responsive, fast, and accessible** or it doesn't ship.

## Next Steps

- [Accessibility Standards](accessibility.md)
- [Performance Guide](performance.md)
- [Tech Stack](tech-stack.md)
