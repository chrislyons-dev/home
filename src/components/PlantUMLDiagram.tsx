import { useEffect, useState } from 'react';
import { encode } from 'plantuml-encoder';

interface PlantUMLDiagramProps {
  code: string;
  alt?: string;
  sizes?: string;
}

export default function PlantUMLDiagram({
  code,
  alt = 'PlantUML Diagram',
  sizes = '(max-width: 768px) 95vw, 768px',
}: PlantUMLDiagramProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Encode PlantUML code to URL-safe format
    const encoded = encode(code);
    setImageUrl(`https://www.plantuml.com/plantuml/svg/${encoded}`);
  }, [code]);

  return (
    <div className="plantuml-container my-6 overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className="mx-auto h-auto max-w-full"
          loading="lazy"
          decoding="async"
          sizes={sizes}
        />
      )}
    </div>
  );
}
