# Accessibility

Building an inclusive web experience for everyone.

## WCAG Compliance

This site meets **WCAG 2.1 AA** standards across all pages.

### Conformance Levels

- ✅ Level A: All criteria met
- ✅ Level AA: All criteria met
- ⚠️ Level AAA: Partial (where applicable)

## Key Features

### 1. Semantic HTML

Proper HTML structure for assistive technologies:

```html
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <p>Content...</p>
  </article>
</main>

<footer>
  <!-- Footer content -->
</footer>
```

### 2. Keyboard Navigation

Full site navigation via keyboard:

- **Tab**: Move forward through interactive elements
- **Shift + Tab**: Move backward
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and menus

**Focus Indicators:**

```css
:focus-visible {
  outline: 2px solid oklch(0.7 0.2 250);
  outline-offset: 2px;
}
```

### 3. Screen Reader Support

**ARIA Labels:**

```astro
<button
  aria-label="Toggle dark mode"
  aria-pressed={isDark}
>
  <span aria-hidden="true">🌙</span>
</button>
```

**Live Regions:**

```astro
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {message}
</div>
```

**Skip Links:**

```astro
<a
  href="#main-content"
  class="skip-link"
>
  Skip to main content
</a>
```

### 4. Color and Contrast

**Contrast Ratios:**

- Normal text: 7:1 (AAA)
- Large text: 4.5:1 (AA)
- Interactive elements: 3:1 (AA)

**Color Independence:**

Information never conveyed by color alone:

```astro
<!-- Bad -->
<span style="color: red;">Error</span>

<!-- Good -->
<span class="error">
  <span aria-label="Error">⚠️</span>
  Error message
</span>
```

### 5. Motion and Animation

Respects reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6. Form Accessibility

Proper labels and error handling:

```astro
<label for="email">
  Email Address
  <span aria-label="required">*</span>
</label>
<input
  type="email"
  id="email"
  name="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
>
<span id="email-error" role="alert">
  {errorMessage}
</span>
```

## Testing

### Automated Testing

**axe-core Integration:**

```javascript
import { axe } from 'axe-core';

describe('Accessibility', () => {
  it('has no violations', async () => {
    const results = await axe(document.body);
    expect(results.violations).toHaveLength(0);
  });
});
```

### Manual Testing

**Screen Readers:**
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (macOS/iOS)
- ✅ TalkBack (Android)

**Keyboard Only:**
- ✅ All interactive elements reachable
- ✅ Logical tab order
- ✅ Visible focus indicators

### Browser Testing

Tested across:
- Chrome/Edge with ChromeVox
- Firefox with NVDA
- Safari with VoiceOver

## Common Patterns

### Interactive Buttons

```tsx
interface ButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export default function Button({
  onClick,
  ariaLabel,
  disabled
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      aria-disabled={disabled}
    >
      Click me
    </button>
  );
}
```

### Expandable Sections

```astro
<button
  aria-expanded={isOpen}
  aria-controls="section-content"
  onclick="toggleSection()"
>
  Toggle Section
</button>

<div
  id="section-content"
  hidden={!isOpen}
>
  Content here
</div>
```

### Modal Dialogs

```tsx
export default function Modal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      // Trap focus
      // Set focus to first element
    }
  }, [isOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      hidden={!isOpen}
    >
      <h2 id="modal-title">Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

## Best Practices

### Images

**Decorative images:**
```html
<img src="decoration.png" alt="" role="presentation">
```

**Informative images:**
```html
<img src="chart.png" alt="Sales increased 40% in Q4">
```

### Links

**Descriptive link text:**
```html
<!-- Bad -->
<a href="/docs">Click here</a>

<!-- Good -->
<a href="/docs">Read the documentation</a>
```

### Headings

**Logical hierarchy:**
```html
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

## Next Steps

- [Performance Guide](performance.md)
- [Features Overview](overview.md)
- [Tech Stack](tech-stack.md)
