import { useState } from 'react';
import { technologies, techCategories, type Tech, type TechCategory } from '../data/technologies';

interface TechStackProps {
  techs?: Tech[];
}

export default function TechStack({ techs = technologies }: TechStackProps) {
  const [filter, setFilter] = useState<TechCategory>('all');

  const filteredTech = filter === 'all' ? techs : techs.filter((tech) => tech.category === filter);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap gap-2">
        {techCategories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              filter === category
                ? 'scale-105 bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredTech.map((tech) => (
          <div
            key={tech.name}
            className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-600 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">{tech.name}</span>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                {tech.category}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded ${
                    i < tech.level ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-200 dark:bg-gray-800'
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
