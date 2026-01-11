import { useState, useEffect } from 'react';
import { codeSnippets, type CodeSnippet } from '../data/codeSnippets';

interface CodeBlockProps {
  snippets?: CodeSnippet[];
  rotationInterval?: number;
}

export default function CodeBlock({
  snippets = codeSnippets,
  rotationInterval = 4000,
}: CodeBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (snippets.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % snippets.length);
        setIsAnimating(false);
      }, 300);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [snippets.length, rotationInterval]);

  const currentSnippet = snippets[currentIndex];

  if (!currentSnippet) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className="overflow-hidden rounded-lg border shadow-2xl"
        style={{
          borderColor: 'var(--theme-code-border)',
          background: 'var(--theme-code-bg)',
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-2 border-b px-4 py-3"
          style={{
            borderColor: 'var(--theme-code-border)',
            background: 'var(--theme-code-bg)',
          }}
        >
          <div className="flex gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: 'var(--theme-terminal-dot-red)' }}
            ></div>
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: 'var(--theme-terminal-dot-yellow)' }}
            ></div>
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: 'var(--theme-terminal-dot-green)' }}
            ></div>
          </div>
          <span className="ml-4 text-sm" style={{ color: 'var(--theme-code-text)' }}>
            {currentSnippet.language}
          </span>
        </div>

        {/* Code content */}
        <div
          className={`p-6 font-mono text-sm transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <pre style={{ color: 'var(--theme-code-text)' }}>
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        {/* Indicator dots */}
        <div
          className="flex justify-center gap-2 border-t px-4 py-3"
          style={{
            borderColor: 'var(--theme-code-border)',
            background: 'var(--theme-code-bg)',
          }}
        >
          {snippets.map((snippet, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsAnimating(false);
                }, 300);
              }}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-[var(--theme-accent-strong)]'
                  : 'bg-[var(--theme-border-emphasis)] hover:bg-[var(--theme-text-muted)]'
              }`}
              aria-label={`Show ${snippet.language} snippet`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
