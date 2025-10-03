import { useState, useEffect } from 'react';
import { codeSnippets, type CodeSnippet } from '../data/codeSnippets';

interface CodeBlockProps {
  snippets?: CodeSnippet[];
  rotationInterval?: number;
}

export default function CodeBlock({
  snippets = codeSnippets,
  rotationInterval = 4000
}: CodeBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-gray-400 ml-4">{currentSnippet.language}</span>
        </div>

        {/* Code content */}
        <div className={`p-6 font-mono text-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}>
          <pre className="text-gray-100">
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 px-4 py-3 bg-gray-800 border-t border-gray-700">
          {snippets.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsAnimating(false);
                }, 300);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-500 w-6'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Show ${snippets[index].language} snippet`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
