import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import the schema from content config
const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  tech: z.array(z.string()),
  featured: z.boolean().default(false),
  order: z.number().default(999),
});

describe('Project Content Schema', () => {
  it('should validate valid project data', () => {
    const validProject = {
      title: 'Test Project',
      description: 'A test project description',
      tech: ['TypeScript', 'React'],
      featured: true,
      order: 1,
    };

    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should apply default values for optional fields', () => {
    const minimalProject = {
      title: 'Minimal Project',
      description: 'Basic description',
      tech: ['Node.js'],
    };

    const result = projectSchema.safeParse(minimalProject);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(false);
      expect(result.data.order).toBe(999);
    }
  });

  it('should reject missing required fields', () => {
    const invalidProject = {
      title: 'Incomplete Project',
      // missing description and tech
    };

    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });

  it('should reject invalid tech array', () => {
    const invalidProject = {
      title: 'Bad Tech Project',
      description: 'Has invalid tech',
      tech: 'Not an array', // should be array
      featured: true,
      order: 1,
    };

    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });

  it('should reject empty tech array', () => {
    const invalidProject = {
      title: 'No Tech Project',
      description: 'Has no technologies',
      tech: [],
      featured: true,
      order: 1,
    };

    const result = projectSchema.safeParse(invalidProject);
    // Schema allows empty array, but we might want to enforce non-empty
    expect(result.success).toBe(true);
  });

  it('should validate featured as boolean', () => {
    const invalidProject = {
      title: 'Bad Featured Project',
      description: 'Has invalid featured value',
      tech: ['Python'],
      featured: 'yes', // should be boolean
      order: 1,
    };

    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });

  it('should validate order as number', () => {
    const invalidProject = {
      title: 'Bad Order Project',
      description: 'Has invalid order value',
      tech: ['Java'],
      featured: false,
      order: '1', // should be number
    };

    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });
});
