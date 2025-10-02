import { useEffect, useRef } from 'react';

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Grid configuration
    const gridSize = 50;
    const dots: { x: number; y: number; vx: number; vy: number }[] = [];
    const cols = Math.ceil(canvas.offsetWidth / gridSize);
    const rows = Math.ceil(canvas.offsetHeight / gridSize);

    // Create dots
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        dots.push({
          x: i * gridSize,
          y: j * gridSize,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    }

    // Animation
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw dots
      dots.forEach((dot) => {
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x <= 0 || dot.x >= canvas.offsetWidth) dot.vx *= -1;
        if (dot.y <= 0 || dot.y >= canvas.offsetHeight) dot.vy *= -1;

        // Draw dot
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Blue with opacity
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      dots.forEach((dot, i) => {
        dots.slice(i + 1).forEach((otherDot) => {
          const dx = dot.x - otherDot.x;
          const dy = dot.y - otherDot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < gridSize * 1.5) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / (gridSize * 1.5))})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40 dark:opacity-20"
      style={{ pointerEvents: 'none' }}
    />
  );
}
