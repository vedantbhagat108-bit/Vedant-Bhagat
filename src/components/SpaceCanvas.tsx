import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface SpaceCanvasProps {
  theme: ThemeMode;
  warpSpeed?: boolean;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({ theme, warpSpeed = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollYRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);
  const scrollVelocityRef = useRef<number>(0);
  const scrollDirectionRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for interactive parallax
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      if (Math.abs(delta) > 0.5) {
        scrollDirectionRef.current = delta > 0 ? 1 : -1;
        // Increase scroll momentum for hyperdrive effect
        scrollVelocityRef.current = Math.min(30, scrollVelocityRef.current + Math.abs(delta) * 0.35);
      }
      lastScrollYRef.current = currentScrollY;
      scrollYRef.current = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Stars setup
    const starCount = 380;
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      baseAlpha: number;
      twinkleSpeed: number;
    }

    const getThemeColors = (t: ThemeMode) => {
      switch (t) {
        case 'cyberpunk':
          return ['#ff007f', '#00f0ff', '#ffe600', '#ffffff', '#a100ff'];
        case 'minimal-dark':
          return ['#ffffff', '#cbd5e1', '#94a3b8', '#64748b'];
        case 'solar-gold':
          return ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#d97706'];
        case 'deep-space':
        default:
          return ['#38bdf8', '#818cf8', '#c084fc', '#ffffff', '#60a5fa', '#e9d5ff'];
      }
    };

    const colors = getThemeColors(theme);
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      size: Math.random() * 1.8 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    // Shooting stars
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }

    const meteors: Meteor[] = Array.from({ length: 4 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height / 2),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 6,
      angle: Math.PI / 4,
      opacity: 0,
      active: false,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;

      // Decay scroll velocity towards zero smoothly
      scrollVelocityRef.current *= 0.92;
      if (scrollVelocityRef.current < 0.05) {
        scrollVelocityRef.current = 0;
      }

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const offsetX = (mouse.x - width / 2) * 0.05;
      const offsetY = (mouse.y - height / 2) * 0.05;

      const currentScrollVel = scrollVelocityRef.current;
      const isHyperdriveActive = warpSpeed || currentScrollVel > 2.5;

      // Clear canvas with deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isHyperdriveActive) {
        bgGrad.addColorStop(0, 'rgba(15, 7, 32, 0.35)');
        bgGrad.addColorStop(0.5, 'rgba(8, 6, 20, 0.35)');
        bgGrad.addColorStop(1, 'rgba(3, 5, 15, 0.35)');
      } else {
        bgGrad.addColorStop(0, 'rgba(12, 8, 28, 0.95)');
        bgGrad.addColorStop(0.4, 'rgba(8, 7, 22, 0.95)');
        bgGrad.addColorStop(1, 'rgba(4, 6, 16, 0.95)');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 1. RENDER TOP COSMIC BLACK HOLE / EVENT HORIZON ARC ---
      const arcCenterX = width / 2 + offsetX * 0.3;
      const arcCenterY = -15 + Math.sin(time * 0.8) * 3; // subtle breathing motion
      const rx = Math.min(260, width * 0.24); // responsive horizontal radius
      const ry = Math.min(105, height * 0.12); // responsive vertical radius

      ctx.save();

      // Soft continuous diffuse ambient backlight covering full canvas depth
      const topBacklightGrad = ctx.createRadialGradient(
        arcCenterX,
        0,
        10,
        arcCenterX,
        0,
        Math.max(width, height)
      );
      topBacklightGrad.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
      topBacklightGrad.addColorStop(0.2, 'rgba(126, 34, 206, 0.1)');
      topBacklightGrad.addColorStop(0.5, 'rgba(67, 24, 110, 0.04)');
      topBacklightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = topBacklightGrad;
      ctx.fillRect(0, 0, width, height);

      // Horizontal Photonic Arc Beam across top edge
      const topBeamGrad = ctx.createLinearGradient(0, 0, width, 0);
      topBeamGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      topBeamGrad.addColorStop(0.25, 'rgba(147, 51, 234, 0.25)');
      topBeamGrad.addColorStop(0.45, 'rgba(216, 180, 254, 0.85)');
      topBeamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      topBeamGrad.addColorStop(0.55, 'rgba(216, 180, 254, 0.85)');
      topBeamGrad.addColorStop(0.75, 'rgba(147, 51, 234, 0.25)');
      topBeamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.shadowBlur = 20 + Math.sin(time * 2) * 5;
      ctx.shadowColor = '#c084fc';
      ctx.fillStyle = topBeamGrad;
      ctx.fillRect(0, 0, width, 3);

      // U-Shaped Event Horizon Accretion Arch (Black Hole Lens Curve)
      ctx.beginPath();
      ctx.ellipse(arcCenterX, arcCenterY, rx, ry, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.85)';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#a855f7';
      ctx.stroke();

      // Inner Core Intense White/Neon Arc
      ctx.beginPath();
      ctx.ellipse(arcCenterX, arcCenterY, rx - 3, ry - 3, 0, 0, Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f3e8ff';
      ctx.stroke();

      // Outer Gravitational Ring Halo
      ctx.beginPath();
      ctx.ellipse(arcCenterX, arcCenterY, rx + 12, ry + 8, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 6;
      ctx.shadowBlur = 30;
      ctx.stroke();

      // Dark Singularity Inner Shadow inside event horizon U-arch
      ctx.beginPath();
      ctx.ellipse(arcCenterX, arcCenterY - 5, rx - 8, ry - 8, 0, 0, Math.PI);
      const singularityGrad = ctx.createRadialGradient(
        arcCenterX, arcCenterY, 0,
        arcCenterX, arcCenterY, rx
      );
      singularityGrad.addColorStop(0, 'rgba(3, 7, 18, 0.98)');
      singularityGrad.addColorStop(0.7, 'rgba(15, 10, 30, 0.8)');
      singularityGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = singularityGrad;
      ctx.fill();

      ctx.restore();

      // --- 2. RENDER AMBIENT COSMIC NEBULA GLOWS ---
      const scrollParallaxY = scrollYRef.current * 0.12;

      const bgGlows = [
        {
          x: width * 0.2 + offsetX * 2,
          y: height * 0.3 + offsetY * 2 - scrollParallaxY,
          radius: 380,
          color: theme === 'cyberpunk' ? 'rgba(255, 0, 128, 0.08)' : 'rgba(147, 51, 234, 0.12)',
        },
        {
          x: width * 0.8 - offsetX * 2,
          y: height * 0.7 - offsetY * 2 - scrollParallaxY * 0.5,
          radius: 420,
          color: theme === 'solar-gold' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(56, 189, 248, 0.08)',
        },
      ];

      bgGlows.forEach((glow) => {
        const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
        gradient.addColorStop(0, glow.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 3. RENDER 3D STARS WITH SCROLL HYPERDRIVE & BACK-AND-FORTH DYNAMICS ---
      const baseSpeed = warpSpeed ? 20 : 0.8;
      const scrollSpeedBoost = currentScrollVel * 0.75 * scrollDirectionRef.current;
      const effectiveSpeed = baseSpeed + scrollSpeedBoost;

      stars.forEach((star) => {
        star.z -= effectiveSpeed;

        // Wrap-around in z-space (forwards or backwards depending on scroll direction)
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        } else if (star.z > width) {
          star.z = 1;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 256 / star.z;
        const px = star.x * k + width / 2 + offsetX * (width / star.z);
        const py = star.y * k + height / 2 + offsetY * (height / star.z) - (scrollYRef.current * 0.05) % height;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.2, (1 - star.z / width) * star.size * (isHyperdriveActive ? 2.5 : 1.2));
          const alpha = (1 - star.z / width) * (star.baseAlpha + Math.sin(time * 5 + star.x) * 0.2);

          ctx.save();
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

          if (isHyperdriveActive) {
            // Draw warp streaks aligned with speed and scroll velocity
            const prevK = 256 / (star.z + effectiveSpeed * 1.5);
            const prevPx = star.x * prevK + width / 2 + offsetX * (width / (star.z + effectiveSpeed));
            const prevPy = star.y * prevK + height / 2 + offsetY * (height / (star.z + effectiveSpeed)) - (scrollYRef.current * 0.05) % height;

            ctx.strokeStyle = star.color;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            // Glow on closer stars
            if (star.z < width * 0.3) {
              ctx.shadowBlur = 8;
              ctx.shadowColor = star.color;
              ctx.fill();
            }
          }
          ctx.restore();
        }
      });

      // --- 4. RENDER SHOOTING METEORS ---
      meteors.forEach((m) => {
        if (!m.active && Math.random() < 0.008) {
          m.active = true;
          m.x = Math.random() * (width * 0.8);
          m.y = Math.random() * (height * 0.4);
          m.opacity = 1;
        }

        if (m.active) {
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.opacity -= 0.012;

          if (m.opacity <= 0 || m.x > width || m.y > height) {
            m.active = false;
          } else {
            ctx.save();
            ctx.globalAlpha = m.opacity;
            const grad = ctx.createLinearGradient(
              m.x,
              m.y,
              m.x - Math.cos(m.angle) * m.length,
              m.y - Math.sin(m.angle) * m.length
            );
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.3, theme === 'cyberpunk' ? 'rgba(255, 0, 128, 0.8)' : 'rgba(168, 85, 247, 0.8)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(
              m.x - Math.cos(m.angle) * m.length,
              m.y - Math.sin(m.angle) * m.length
            );
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [theme, warpSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
};

