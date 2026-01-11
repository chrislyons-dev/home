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
        {techCategories.map((category) => {
          const isActive = filter === category;

          return (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                isActive ? 'scale-105 shadow-lg' : ''
              } ${isActive ? 'hover:bg-[var(--theme-btn-primary-hover-bg)]' : 'hover:bg-[var(--theme-bg-surface)]'}`}
              style={{
                background: isActive ? 'var(--theme-btn-primary-bg)' : 'var(--theme-bg-elevated)',
                color: isActive ? 'var(--theme-btn-primary-text)' : 'var(--theme-text-secondary)',
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTech.map((tech) => (
          <div
            key={tech.name}
            className="rounded-lg border p-4 transition-all hover:border-[var(--theme-accent-strong)] hover:shadow-lg"
            style={{
              borderColor: 'var(--theme-border-default)',
              background: 'var(--theme-bg-surface)',
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">{tech.name}</span>
              <span
                className="rounded px-2 py-1 text-xs"
                style={{
                  background: 'var(--theme-bg-elevated)',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                {tech.category}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded"
                  style={{
                    background:
                      i < tech.level ? 'var(--theme-accent-strong)' : 'var(--theme-bg-elevated)',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
