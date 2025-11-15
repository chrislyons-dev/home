import { describe, it, expect } from 'vitest';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

// Mock projects data loader
async function getProjectFiles() {
  const projectsDir = join(process.cwd(), 'src/content/projects');
  const files = await readdir(projectsDir);
  return files.filter((f) => f.endsWith('.md'));
}

async function parseProjectFile(filename: string) {
  const projectsDir = join(process.cwd(), 'src/content/projects');
  const content = await readFile(join(projectsDir, filename), 'utf-8');
  const { data } = matter(content);
  return { data, id: filename.replace('.md', '') };
}

describe('Projects Collection', () => {
  it('should have at least one project', async () => {
    const files = await getProjectFiles();
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have featured projects', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));
    const featuredProjects = projects.filter((p) => p.data.featured);
    expect(featuredProjects.length).toBeGreaterThan(0);
  });

  it('should have valid tech stack for all projects', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));

    projects.forEach((project) => {
      expect(project.data.tech).toBeDefined();
      expect(Array.isArray(project.data.tech)).toBe(true);
      expect(project.data.tech.length).toBeGreaterThan(0);

      // Each tech should be a non-empty string
      project.data.tech.forEach((tech: string) => {
        expect(typeof tech).toBe('string');
        expect(tech.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have unique titles', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));
    const titles = projects.map((p) => p.data.title);
    const uniqueTitles = new Set(titles);

    expect(titles.length).toBe(uniqueTitles.size);
  });

  it('should have unique order values for featured projects', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));
    const featuredProjects = projects.filter((p) => p.data.featured);
    const orders = featuredProjects.map((p) => p.data.order);
    const uniqueOrders = new Set(orders);

    expect(orders.length).toBe(uniqueOrders.size);
  });

  it('should have non-empty descriptions', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));

    projects.forEach((project) => {
      expect(project.data.description).toBeDefined();
      expect(typeof project.data.description).toBe('string');
      expect(project.data.description.length).toBeGreaterThan(0);
    });
  });

  it('should sort projects by order correctly', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));
    const sortedProjects = projects.sort((a, b) => a.data.order - b.data.order);

    for (let i = 1; i < sortedProjects.length; i++) {
      expect(sortedProjects[i].data.order).toBeGreaterThanOrEqual(sortedProjects[i - 1].data.order);
    }
  });

  it('should have valid project data structure', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));

    projects.forEach((project) => {
      expect(project).toHaveProperty('data');
      expect(project.data).toHaveProperty('title');
      expect(project.data).toHaveProperty('description');
      expect(project.data).toHaveProperty('tech');
      expect(project.data).toHaveProperty('featured');
      expect(project.data).toHaveProperty('order');
    });
  });

  it('should have AI and modernization projects', async () => {
    const files = await getProjectFiles();
    const projects = await Promise.all(files.map(parseProjectFile));
    const aiProject = projects.find(
      (p) =>
        p.data.title.toLowerCase().includes('ai') || p.data.description.toLowerCase().includes('ai')
    );
    const modernizationProject = projects.find(
      (p) =>
        p.data.title.toLowerCase().includes('modernization') ||
        p.data.description.toLowerCase().includes('mainframe')
    );

    expect(aiProject).toBeDefined();
    expect(modernizationProject).toBeDefined();
  });
});
