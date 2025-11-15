import { expect } from 'vitest';

// Add custom matchers if needed
expect.extend({
  toBeValidProjectData(received) {
    const { isNot } = this;
    const hasTitle = typeof received.title === 'string' && received.title.length > 0;
    const hasDescription =
      typeof received.description === 'string' && received.description.length > 0;
    const hasTech = Array.isArray(received.tech) && received.tech.length > 0;
    const hasFeatured = typeof received.featured === 'boolean';
    const hasOrder = typeof received.order === 'number';

    const pass = hasTitle && hasDescription && hasTech && hasFeatured && hasOrder;

    return {
      pass,
      message: () =>
        isNot
          ? `Expected project data to be invalid`
          : `Expected project data to be valid, but got: ${JSON.stringify(received)}`,
    };
  },
});
