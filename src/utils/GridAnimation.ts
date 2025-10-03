export interface GridDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface GridAnimationConfig {
  gridSize?: number;
  dotColor?: string;
  dotOpacity?: number;
  dotRadius?: number;
  connectionDistance?: number;
  connectionOpacity?: number;
  velocityRange?: number;
}

export class GridAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dots: GridDot[] = [];
  private animationId: number | null = null;
  private config: Required<GridAnimationConfig>;

  constructor(canvas: HTMLCanvasElement, config: GridAnimationConfig = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    this.ctx = ctx;
    this.config = {
      gridSize: config.gridSize ?? 50,
      dotColor: config.dotColor ?? 'rgba(59, 130, 246, 0.3)',
      dotOpacity: config.dotOpacity ?? 0.3,
      dotRadius: config.dotRadius ?? 2,
      connectionDistance: config.connectionDistance ?? 1.5,
      connectionOpacity: config.connectionOpacity ?? 0.1,
      velocityRange: config.velocityRange ?? 0.5,
    };

    this.initializeCanvas();
    this.createDots();
  }

  private initializeCanvas(): void {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private createDots(): void {
    const { gridSize, velocityRange } = this.config;
    const cols = Math.ceil(this.canvas.offsetWidth / gridSize);
    const rows = Math.ceil(this.canvas.offsetHeight / gridSize);

    this.dots = [];
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        this.dots.push({
          x: i * gridSize,
          y: j * gridSize,
          vx: (Math.random() - 0.5) * velocityRange,
          vy: (Math.random() - 0.5) * velocityRange,
        });
      }
    }
  }

  private updateDot(dot: GridDot): void {
    // Update position
    dot.x += dot.vx;
    dot.y += dot.vy;

    // Bounce off edges
    if (dot.x <= 0 || dot.x >= this.canvas.offsetWidth) dot.vx *= -1;
    if (dot.y <= 0 || dot.y >= this.canvas.offsetHeight) dot.vy *= -1;
  }

  private drawDot(dot: GridDot): void {
    const { dotColor, dotRadius } = this.config;
    this.ctx.fillStyle = dotColor;
    this.ctx.beginPath();
    this.ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawConnections(): void {
    const { gridSize, connectionDistance, connectionOpacity } = this.config;
    const maxDistance = gridSize * connectionDistance;

    this.dots.forEach((dot, i) => {
      this.dots.slice(i + 1).forEach((otherDot) => {
        const dx = dot.x - otherDot.x;
        const dy = dot.y - otherDot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = connectionOpacity * (1 - distance / maxDistance);
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(dot.x, dot.y);
          this.ctx.lineTo(otherDot.x, otherDot.y);
          this.ctx.stroke();
        }
      });
    });
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

    // Update and draw dots
    this.dots.forEach((dot) => {
      this.updateDot(dot);
      this.drawDot(dot);
    });

    // Draw connections
    this.drawConnections();

    this.animationId = requestAnimationFrame(this.animate);
  };

  public start(): void {
    if (this.animationId === null) {
      this.animate();
    }
  }

  public stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public resize(): void {
    this.stop();
    this.initializeCanvas();
    this.createDots();
    this.start();
  }

  public updateConfig(config: Partial<GridAnimationConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
