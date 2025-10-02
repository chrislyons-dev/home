import { useState } from 'react';

interface Tech {
  name: string;
  category: 'frontend' | 'backend' | 'tools';
  level: number; // 1-5
}

const technologies: Tech[] = [
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

export default function TechStack() {
  const [filter, setFilter] = useState<'all' | 'frontend' | 'backend' | 'tools'>('all');

  const filteredTech = filter === 'all'
    ? technologies
    : technologies.filter(tech => tech.category === filter);

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'frontend', 'backend', 'tools'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === category
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTech.map((tech) => (
          <div
            key={tech.name}
            className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-400 transition-all hover:shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{tech.name}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                {tech.category}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded ${
                    i < tech.level
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
