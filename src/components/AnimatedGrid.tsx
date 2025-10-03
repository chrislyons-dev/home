import { useEffect, useRef } from 'react';
import { GridAnimation, type GridAnimationConfig } from '../utils/GridAnimation';

interface AnimatedGridProps {
  config?: GridAnimationConfig;
}

export default function AnimatedGrid({ config }: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<GridAnimation | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create and start animation
      const animation = new GridAnimation(canvas, config);
      animationRef.current = animation;
      animation.start();

      // Handle resize
      const handleResize = () => {
        animation.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        animation.stop();
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('Failed to initialize grid animation:', error);
    }
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40 dark:opacity-20"
      style={{ pointerEvents: 'none' }}
    />
  );
}
