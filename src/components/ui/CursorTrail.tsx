'use client';

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < points.current.length; i++) {
        const p = points.current[i];
        p.age += 1;

        if (p.age > 50) {
          points.current.splice(i, 1);
          i--;
          continue;
        }

        const life = 1 - p.age / 50;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${life})`; // Blue-400
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 mix-blend-screen"
    />
  );
}
