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
      <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800 px-4 py-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <span className="ml-4 text-sm text-gray-400">{currentSnippet.language}</span>
        </div>

        {/* Code content */}
        <div
          className={`p-6 font-mono text-sm transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <pre className="text-gray-100">
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 border-t border-gray-700 bg-gray-800 px-4 py-3">
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
                index === currentIndex ? 'bg-electric-500 w-6' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Show ${snippet.language} snippet`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
