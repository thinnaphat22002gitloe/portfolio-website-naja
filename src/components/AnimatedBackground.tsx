import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Neural Network Nodes
    const numNodes = Math.min(80, Math.floor((width * height) / 15000));
    const nodes = Array.from({ length: numNodes }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.5 + 0.5,
    }));

    // Mouse Interaction
    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const getColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        background: isDark ? '#0b1020' : '#ffffff',
        orbs: isDark
          ? [
              { x: width * 0.2, y: height * 0.3, radius: 600, color: 'rgba(138, 136, 255, 0.4)', vx: 0.15, vy: 0.12 },
              { x: width * 0.8, y: height * 0.7, radius: 700, color: 'rgba(0, 212, 255, 0.3)', vx: -0.12, vy: -0.18 },
              { x: width * 0.5, y: height * 0.5, radius: 800, color: 'rgba(255, 140, 180, 1)', vx: 0.08, vy: -0.08 },
              { x: width * 0.1, y: height * 0.8, radius: 500, color: 'rgba(138, 136, 255, 0.25)', vx: -0.1, vy: 0.15 },
            ]
          : [
              { x: width * 0.2, y: height * 0.3, radius: 600, color: 'rgba(255, 100, 0, 0.4)', vx: 0.15, vy: 0.12 },
              { x: width * 0.8, y: height * 0.7, radius: 700, color: 'rgba(120, 0, 255, 0.3)', vx: -0.12, vy: -0.18 },
              { x: width * 0.5, y: height * 0.5, radius: 800, color: 'rgba(255, 255, 255, 1)', vx: 0.08, vy: -0.08 },
              { x: width * 0.1, y: height * 0.8, radius: 500, color: 'rgba(255, 60, 0, 0.25)', vx: -0.1, vy: 0.15 },
            ],
        nodeColor: isDark ? 'rgba(138, 136, 255, 0.6)' : 'rgba(255, 100, 0, 0.6)',
        strokeColor: isDark ? 'rgba(0, 212, 255, 0.15)' : 'rgba(120, 0, 255, 0.15)',
        orbFadeEnd: isDark ? 'rgba(11, 16, 32, 0)' : 'rgba(255,255,255,0)',
      };
    };

    // Aurora Orbs - Initialize with current colors
    let { orbs, background, nodeColor, strokeColor, orbFadeEnd } = getColors();

    // Watch for dark mode changes
    const observer = new MutationObserver(() => {
      const colors = getColors();
      background = colors.background;
      nodeColor = colors.nodeColor;
      strokeColor = colors.strokeColor;
      orbFadeEnd = colors.orbFadeEnd;
      // Update orb colors
      orbs = orbs.map((orb, index) => ({
        ...orb,
        color: colors.orbs[index].color,
      }));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const render = () => {
      // Clear canvas
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      // Draw Aurora Orbs
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Wrap around
        if (orb.x - orb.radius > width) orb.x = -orb.radius;
        if (orb.x + orb.radius < 0) orb.x = width + orb.radius;
        if (orb.y - orb.radius > height) orb.y = -orb.radius;
        if (orb.y + orb.radius < 0) orb.y = height + orb.radius;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.5, orb.color.replace(/[\d\.]+\)$/, '0.1)'));
        gradient.addColorStop(1, orbFadeEnd);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and Draw Nodes
      ctx.fillStyle = nodeColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          node.x -= dx * 0.01;
          node.y -= dy * 0.01;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const cdx = node.x - other.x;
          const cdy = node.y - other.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cDist < 120) {
            ctx.globalAlpha = 1 - cDist / 120;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
