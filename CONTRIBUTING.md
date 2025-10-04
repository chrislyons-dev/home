# Contributing Guide

Thanks for your interest in contributing to this project! This guide will help you get started.

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git
- Code editor (VS Code recommended)

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/home.git
cd home
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Running the Dev Server

```bash
npm run dev
```

Visit `http://localhost:4321`

### Making Changes

1. Make your changes in the `src/` directory
2. Test your changes locally
3. Ensure all tests pass
4. Commit your changes

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Building

```bash
npm run build
```

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Ensure type safety (no `any` types)
- Add JSDoc comments for complex functions

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
// Use functional components with TypeScript
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
// TypeScript in frontmatter
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<h1>{title}</h1>
```

### Styling

Use Tailwind CSS utilities:

```astro
<div class="bg-gray-900 text-white p-4 rounded-lg">
  <h2 class="text-2xl font-bold mb-2">Title</h2>
  <p class="text-gray-300">Content</p>
</div>
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(components): add dark mode toggle
fix(layout): correct responsive spacing
docs(readme): update installation steps
test(utils): add theme utility tests
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line max 72 characters
- Reference issues/PRs when applicable

```bash
feat(nav): add mobile menu

- Implement hamburger menu
- Add responsive breakpoints
- Update navigation styles

Closes #123
```

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

### Component Tests

```typescript
import { render } from '@testing-library/react';

describe('ThemeToggle', () => {
  it('toggles theme on click', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');
    // Test interaction
  });
});
```

## Pull Request Process

### 1. Before Submitting

- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code follows style guidelines
- [ ] Commits follow conventional commits
- [ ] Documentation updated (if needed)

### 2. Create Pull Request

1. Push to your fork
2. Create PR on GitHub
3. Fill out PR template
4. Link related issues

### 3. PR Template

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

## Screenshots
If applicable

## Checklist
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Documentation updated
```

### 4. Review Process

- Automated checks must pass
- At least one approval required
- Address review comments
- Squash commits if requested

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── layouts/        # Astro layouts
│   ├── pages/          # File-based routes
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── public/             # Static assets
├── docs/               # MkDocs documentation
├── tests/              # Test files
└── scripts/            # Build scripts
```

## Code Review Guidelines

### As a Reviewer

- Be constructive and specific
- Suggest improvements, don't demand
- Approve when satisfied
- Check for:
  - Code quality
  - Test coverage
  - Documentation
  - Performance implications

### As a Contributor

- Respond to feedback promptly
- Ask questions if unclear
- Make requested changes
- Update PR description if scope changes

## Development Tools

### Pre-commit Hooks

Husky runs these checks before each commit:

- Lint commit message
- Run type check
- Run tests

### Recommended VS Code Extensions

- Astro
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

### Editor Config

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  }
}
```

## Common Tasks

### Adding a New Page

1. Create file in `src/pages/`
2. Use Layout component
3. Add to navigation (if needed)

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="New Page">
  <h1>Content</h1>
</Layout>
```

### Adding a Component

1. Create file in `src/components/`
2. Export component
3. Add TypeScript types

```tsx
interface Props {
  message: string;
}

export default function NewComponent({ message }: Props) {
  return <div>{message}</div>;
}
```

### Updating Styles

1. Edit `src/styles/global.css`
2. Or use Tailwind utilities
3. Test responsive behavior

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules .astro dist
npm install
npm run build
```

### Test Failures

```bash
# Run tests in UI mode for debugging
npm run test:ui
```

### Type Errors

```bash
# Check TypeScript errors
npx tsc --noEmit
```

## Getting Help

- 📖 [Documentation](https://chrislyons-dev.github.io/home/)
- 🐛 [Report a bug](https://github.com/chrislyons-dev/home/issues/new)
- 💬 [Discussions](https://github.com/chrislyons-dev/home/discussions)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Follow project guidelines

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
