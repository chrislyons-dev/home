import { useEffect, useState } from 'react';
import { encode } from 'plantuml-encoder';

interface PlantUMLDiagramProps {
  code: string;
  alt?: string;
}

export default function PlantUMLDiagram({ code, alt = 'PlantUML Diagram' }: PlantUMLDiagramProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Encode PlantUML code to URL-safe format
    const encoded = encode(code);
    setImageUrl(`https://www.plantuml.com/plantuml/svg/${encoded}`);
  }, [code]);

  return (
    <div className="plantuml-container my-6 overflow-x-auto bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full h-auto mx-auto"
          loading="lazy"
        />
      )}
    </div>
  );
}
