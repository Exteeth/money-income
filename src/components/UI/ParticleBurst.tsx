import React, { useEffect, useRef } from 'react';

// Declare global type for the window helper
declare global {
  interface Window {
    triggerGoldBurst: (x: number, y: number) => void;
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  decay: number;
  rotation: number;
  vRotation: number;
}

export const ParticleBurst: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gold gradient list
    const goldColors = [
      '#C9A55C', // Accent Gold
      '#E8D5A3', // Light Gold
      '#B89045', // Deep Gold
      '#F5E6BE', // Platinum Gold
      '#D4AF37'  // Classic Gold
    ];

    const spawnParticles = (startX: number, startY: number) => {
      // Check prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Don't run particle explosions for reduced motion
      }

      const count = 35; // Number of particles
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Fast initial speed, slows down due to friction
        const speed = 4 + Math.random() * 8;
        
        newParticles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // Slight upward bias
          radius: 3 + Math.random() * 5, // size of coin particle
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
          opacity: 1,
          decay: 0.015 + Math.random() * 0.02, // Opacity fade speed
          rotation: Math.random() * Math.PI * 2,
          vRotation: (Math.random() - 0.5) * 0.2
        });
      }

      particlesRef.current = [...particlesRef.current, ...newParticles];

      // Start animation loop if not already running
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(updateParticles);
      }
    };

    // Bind trigger to window object
    window.triggerGoldBurst = spawnParticles;

    const updateParticles = () => {
      const activeParticles = particlesRef.current;
      if (activeParticles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const remaining: Particle[] = [];

      for (const p of activeParticles) {
        // Apply physics
        p.vx *= 0.96; // Horizontal friction
        p.vy += 0.22; // Gravity
        p.vy *= 0.96; // Vertical friction
        
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;
        p.opacity -= p.decay;

        if (p.opacity > 0) {
          remaining.push(p);

          // Draw custom gold particle (simulated coin)
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;

          // Outer circle
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Gold border shine
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();

          // Center design (small dot to make it look like a coin)
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fill();

          ctx.restore();
        }
      }

      particlesRef.current = remaining;
      requestRef.current = requestAnimationFrame(updateParticles);
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default ParticleBurst;
