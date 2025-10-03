export interface Tech {
  name: string;
  category: 'frontend' | 'backend' | 'tools';
  level: number; // 1-5
}

export const technologies: Tech[] = [
  { name: 'TypeScript', category: 'frontend', level: 5 },
  { name: 'React', category: 'frontend', level: 5 },
  { name: 'Astro', category: 'frontend', level: 4 },
  { name: 'Node.js', category: 'backend', level: 5 },
  { name: 'Python', category: 'backend', level: 4 },
  { name: 'PostgreSQL', category: 'backend', level: 4 },
  { name: 'Docker', category: 'tools', level: 5 },
  { name: 'Git', category: 'tools', level: 5 },
  { name: 'AWS', category: 'tools', level: 4 },
];

export type TechCategory = Tech['category'] | 'all';

export const techCategories: TechCategory[] = ['all', 'frontend', 'backend', 'tools'];
