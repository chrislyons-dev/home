# Contributing Guide

Thanks for your interest in contributing!

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git

## Getting Started

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/home.git
cd home
npm install

# Create a branch
git checkout -b feature/your-feature-name

# Start dev server
npm run dev
```

Visit `http://localhost:4321`

## Development Workflow

1. Make your changes in `src/`
2. Test locally with `npm run dev`
3. Run tests: `npm test`
4. Build: `npm run build`
5. Commit with conventional commits (see below)

## Code Standards

### TypeScript

- Use TypeScript for all code
- No `any` types
- Add JSDoc for complex functions

```typescript
/**
 * Formats a date string
 * @param date - The date to format
 * @param format - The desired format
 * @returns Formatted date string
 */
function formatDate(date: Date, format: string): string {
  // Implementation
}
```

### React Components

```tsx
interface Props {
  title: string;
  description?: string;
}

export default function Component({ title, description }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Astro Components

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<h1>{title}</h1>
```

### Styling

Use Tailwind utilities or predefined classes from `global.css`:

```astro
<div class="card-hover">
  <h2 class="section-title">Title</h2>
  <button class="btn-primary">Click Me</button>
</div>
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>(<scope>): <description>

# Examples:
feat(components): add dark mode toggle
fix(layout): correct responsive spacing
docs(readme): update installation steps
test(utils): add theme utility tests
```

### Commit Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code formatting
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

### Rules

- Use present tense ("add" not "added")
- Use imperative mood ("move cursor" not "moves cursor")
- First line max 72 characters
- Reference issues when applicable

```bash
feat(nav): add mobile menu

- Implement hamburger menu
- Add responsive breakpoints
- Update navigation styles

Closes #123
```

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:ui

# Coverage
npm run test:coverage
```

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Component title="Test" />);
    expect(getByText('Test')).toBeDefined();
  });
});
```

## Pull Request Process

### Before Submitting

- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code follows style guidelines
- [ ] Commits follow conventional commits
- [ ] Documentation updated (if needed)

### Creating a PR

1. Push to your fork
2. Create PR on GitHub
3. Fill out PR template
4. Link related issues

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How was this tested?

## Checklist

- [ ] Tests pass
- [ ] Build succeeds
- [ ] Documentation updated
```

### Review Process

- Automated checks must pass
- At least one approval required
- Address review comments promptly

## Project Structure

```
src/
├── components/     # React components
├── layouts/        # Astro layouts
├── pages/          # File-based routes
├── services/       # Business logic
├── styles/         # Global styles
└── utils/          # Utility functions
```

## Common Tasks

### Adding a New Page

Create file in `src/pages/`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="New Page">
  <h1>Content</h1>
</Layout>
```

Page available at `/your-filename`

### Adding a Component

Create file in `src/components/`:

```tsx
interface Props {
  message: string;
}

export default function NewComponent({ message }: Props) {
  return <div>{message}</div>;
}
```

Use in Astro page:

```astro
---
import NewComponent from '../components/NewComponent';
---

<NewComponent client:load message="Hello" />
```

## Development Tools

### Pre-commit Hooks

Husky runs automatically:

- Commit message validation
- Type checking
- Tests

### Recommended VS Code Extensions

- Astro
- Tailwind CSS IntelliSense
- GitLens

## Getting Help

- 📖 [Documentation](https://chrislyons-dev.github.io/home/)
- 🐛 [Report a bug](https://github.com/chrislyons-dev/home/issues/new)
- 💬 [Discussions](https://github.com/chrislyons-dev/home/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
