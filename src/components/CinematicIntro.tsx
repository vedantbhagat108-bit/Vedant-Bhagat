import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronDown,
  Video,
  Sparkles,
  Zap,
  Scan,
  Smartphone,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { resolveActiveHeroVideo } from '../utils/videoStorage';
import { playClickSound, playVortexSound, playEmergenceSound, startAmbientSpaceAudio } from '../utils/audio';
import { scrollToElementFast } from '../utils/scroll';

interface CinematicIntroProps {
  onOpenResume?: () => void;
  onOpenAdmin?: () => void;
  onScrollToHero?: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onScrollToHero,
}) => {
  const { data } = usePortfolio();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVortexing, setIsVortexing] = useState<boolean>(false);
  const [isEmerging, setIsEmerging] = useState<boolean>(false);
  const [isMobileFitMode, setIsMobileFitMode] = useState<boolean>(false); // Default to full screen edge-to-edge cover

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vortexTimeoutRef = useRef<number | null>(null);
  const emergenceTimeoutRef = useRef<number | null>(null);
  const hasScrolledDownRef = useRef<boolean>(false);

  // High-performance scroll-linked parallax transition
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.6, 0.15]);
  const introScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const introY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const loadVideo = () => {
    resolveActiveHeroVideo(data.personalInfo?.heroVideoUrl).then((resolvedUrl) => {
      setVideoSrc(resolvedUrl);
    });
  };

  // Load saved video and listen for updates from Customize settings
  useEffect(() => {
    loadVideo();

    const handleVideoUpdate = () => {
      loadVideo();
    };

    window.addEventListener('portfolio-video-updated', handleVideoUpdate);
    return () => {
      window.removeEventListener('portfolio-video-updated', handleVideoUpdate);
      if (vortexTimeoutRef.current) clearTimeout(vortexTimeoutRef.current);
      if (emergenceTimeoutRef.current) clearTimeout(emergenceTimeoutRef.current);
    };
  }, [data.personalInfo?.heroVideoUrl]);

  // Trigger cosmic vortex emergence when scrolling back up to Intro from below
  const triggerVortexEmergence = () => {
    if (isEmerging || isVortexing) return;
    setIsEmerging(true);
    setIsVortexing(false);
    setIsPlaying(true);
    playEmergenceSound(1.2);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    if (emergenceTimeoutRef.current) clearTimeout(emergenceTimeoutRef.current);
    emergenceTimeoutRef.current = window.setTimeout(() => {
      setIsEmerging(false);
    }, 1100);
  };

  // Scroll & gesture listeners: any small scroll on the video immediately activates the vortex warp into the portfolio
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY;
      // If at the video top and user scrolls down even a tiny fraction
      if (scrollY <= 60 && e.deltaY > 12 && !isVortexing) {
        triggerVortexWarp();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrollY = window.scrollY;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      if (scrollY <= 60 && deltaY > 25 && !isVortexing) {
        triggerVortexWarp();
      }
    };

    const handleScrollCheck = () => {
      const scrollY = window.scrollY;
      if (scrollY > 220) {
        hasScrolledDownRef.current = true;
      } else if (scrollY <= 100 && hasScrolledDownRef.current) {
        hasScrolledDownRef.current = false;
        triggerVortexEmergence();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScrollCheck, { passive: true });

    // Custom event if logo or navigation link requests scroll to intro
    const handleScrollToIntro = () => {
      hasScrolledDownRef.current = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      triggerVortexEmergence();
    };
    window.addEventListener('portfolio-scroll-to-intro', handleScrollToIntro);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScrollCheck);
      window.removeEventListener('portfolio-scroll-to-intro', handleScrollToIntro);
      if (emergenceTimeoutRef.current) clearTimeout(emergenceTimeoutRef.current);
    };
  }, [isEmerging, isVortexing]);

  // Track Fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle Fullscreen Toggle
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound(800);

    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Click anywhere on screen to toggle Play / Pause
  const handleScreenClick = () => {
    playClickSound(650);

    if (!videoRef.current) return;

    if (isVortexing || isEmerging) {
      setIsVortexing(false);
      setIsEmerging(false);
    }

    if (videoRef.current.paused || videoRef.current.ended) {
      if (videoRef.current.ended) {
        videoRef.current.currentTime = 0;
      }
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleScreenClick();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound(700);
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Trigger cosmic vortex animation when video ends or when warp vortex button is clicked, then warp scroll to Hero Section
  const triggerVortexWarp = () => {
    // Immediately stop/pause the video and audio if it is playing
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setIsEmerging(false);
    setIsVortexing(true);
    playVortexSound(1.4);

    if (vortexTimeoutRef.current) clearTimeout(vortexTimeoutRef.current);

    // Scroll to hero right as the vortex singularity closes
    vortexTimeoutRef.current = window.setTimeout(() => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      if (onScrollToHero) {
        onScrollToHero();
      } else {
        scrollToElementFast('portfolio-hero', 0, 450);
      }

      // Automatically turn ON default space ambient sound after arriving at the Hero section
      startAmbientSpaceAudio();

      // Reset vortex state promptly
      setIsVortexing(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }, 1150);
  };

  // Automatically trigger vortex when video reaches the end
  const handleVideoEnded = () => {
    triggerVortexWarp();
  };

  const handleScrollDown = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound(750);
    if (videoSrc && isPlaying) {
      triggerVortexWarp();
    } else {
      if (onScrollToHero) {
        onScrollToHero();
      } else {
        scrollToElementFast('portfolio-hero', 0, 400);
      }
      // Turn ON default sound when scrolling down to hero
      startAmbientSpaceAudio();
    }
  };

  // Holographic Canvas Animation (Fallback when no video is uploaded)
  useEffect(() => {
    if (videoSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.025;
      const w = (canvas.width = window.innerWidth || 1920);
      const h = (canvas.height = window.innerHeight || 1080);

      ctx.clearRect(0, 0, w, h);

      // Atmospheric red/orange/purple light flares in canvas
      const grad = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.5) * 50,
        h * 0.45 + Math.cos(t * 0.5) * 30,
        20,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.6
      );
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
      grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.08)');
      grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.05)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);

      // Cosmic concentric orbit rings
      for (let i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 70 * i + Math.sin(t + i) * 8, 0, Math.PI * 2);
        ctx.strokeStyle =
          i % 3 === 0
            ? 'rgba(244, 63, 94, 0.25)'
            : i % 2 === 0
            ? 'rgba(56, 189, 248, 0.22)'
            : 'rgba(168, 85, 247, 0.26)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([12, 10]);
        ctx.stroke();
      }

      // Orbital glow nodes
      for (let j = 0; j < 14; j++) {
        const angle = t * 0.6 + (j * Math.PI * 2) / 14;
        const radius = 220 + Math.sin(t * 1.5 + j) * 30;
        const nx = Math.cos(angle) * radius;
        const ny = Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = j % 2 === 0 ? '#38bdf8' : '#f43f5e';
        ctx.shadowBlur = 15;
        ctx.shadowColor = j % 2 === 0 ? '#38bdf8' : '#f43f5e';
        ctx.fill();
      }

      // Central Holographic Beacon
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(147, 51, 234, 0.12)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#a855f7';
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [videoSrc]);

  return (
    <section
      id="cinematic-intro"
      ref={containerRef}
      onClick={handleScreenClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full w-screen h-screen h-[100dvh] min-h-screen flex flex-col justify-between overflow-hidden select-none cursor-pointer z-20 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
      }`}
    >
      <motion.div
        style={{
          opacity: introOpacity,
          scale: introScale,
          y: introY,
        }}
        className="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none"
      >
        {/* 1. CINEMATIC VIDEO / HOLOGRAM LAYER WITH COSMIC VORTEX WARP CAPABILITY */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center"
          style={{
            // Feathered vignette mask: smooth fade at top and bottom edges into the dark space cosmos
            WebkitMaskImage: isFullscreen
              ? 'none'
              : 'radial-gradient(ellipse 95% 90% at 50% 50%, black 50%, rgba(0,0,0,0.9) 75%, transparent 100%)',
            maskImage: isFullscreen
              ? 'none'
              : 'radial-gradient(ellipse 95% 90% at 50% 50%, black 50%, rgba(0,0,0,0.9) 75%, transparent 100%)',
          }}
        >
          {/* Swirling Vortex Container for Video / Fallback */}
          <motion.div
            animate={
              isVortexing
                ? {
                    rotate: [0, 240, 720, 1080],
                    scale: [1, 1.05, 0.35, 0],
                    opacity: [1, 1, 0.8, 0],
                    filter: [
                      'blur(0px) brightness(1) contrast(1)',
                      'blur(3px) brightness(1.6) contrast(1.3)',
                      'blur(10px) brightness(2.8) contrast(2)',
                      'blur(24px) brightness(5) contrast(3)',
                    ],
                    borderRadius: ['0%', '15%', '40%', '50%'],
                  }
                : isEmerging
                ? {
                    rotate: [-1080, -720, -240, 0],
                    scale: [0, 0.35, 1.05, 1],
                    opacity: [0, 0.8, 1, 1],
                    filter: [
                      'blur(24px) brightness(5) contrast(3)',
                      'blur(10px) brightness(2.8) contrast(2)',
                      'blur(3px) brightness(1.5) contrast(1.2)',
                      'blur(0px) brightness(1) contrast(1)',
                    ],
                    borderRadius: ['50%', '40%', '15%', '0%'],
                  }
                : {
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px) brightness(1) contrast(1)',
                    borderRadius: '0%',
                  }
            }
            transition={{
              duration: 1.25,
              ease: isEmerging ? [0.16, 1, 0.3, 1] : [0.36, 0, 0.66, -0.04],
            }}
            style={{ transformOrigin: '50% 50%' }}
            className="w-full h-full relative flex items-center justify-center overflow-hidden"
          >
            {videoSrc ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Mobile Ambient Glow Reflection (creates a theater glow behind the video on phones) */}
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  // @ts-ignore
                  webkit-playsinline="true"
                  x5-playsinline="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 md:hidden pointer-events-none"
                />

                {/* Main Fullscreen Video */}
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  // @ts-ignore
                  webkit-playsinline="true"
                  x5-playsinline="true"
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out filter brightness-[1.02] contrast-[1.05]"
                />
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-lg shadow-cyan-950/50">
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                      <span>TRANSMISSION // CINEMATIC INTRO PORTAL</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                      VEDANT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-rose-400 to-purple-400">BHAGAT</span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed drop-shadow">
                      Full-screen cinematic intro experience. Tap anywhere to toggle playback. Upload or customize your intro video anytime in <span className="text-cyan-300 font-semibold">Customize Settings</span>.
                    </p>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* 2. DYNAMIC COSMIC VORTEX EVENT HORIZON OVERLAY (Active during vortex warp and reverse emergence) */}
        <AnimatePresence>
          {(isVortexing || isEmerging) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
            >
              {/* Outer Shockwave Ripples expanding outward */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: [0.2, 1.8, 3.5], opacity: [0.9, 0.6, 0] }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute w-96 h-96 rounded-full border-2 border-cyan-400/80 shadow-[0_0_80px_rgba(56,189,248,0.8)]"
              />
              <motion.div
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: [0.1, 1.4, 2.8], opacity: [1, 0.7, 0] }}
                transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                className="absolute w-80 h-80 rounded-full border border-rose-500/80 shadow-[0_0_90px_rgba(244,63,94,0.8)]"
              />

              {/* High-Speed Swirling Accretion Disk Ring 1 */}
              <motion.div
                animate={
                  isEmerging
                    ? { rotate: [-1440, 0], scale: [0.1, 1.4, 2.5], opacity: [0, 0.9, 0.7, 0] }
                    : { rotate: 1440, scale: [0.8, 1.2, 0.1], opacity: [0.9, 0.9, 0.5, 0] }
                }
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="absolute w-[500px] h-[500px] rounded-full border-[3px] border-dashed border-cyan-400/90 shadow-[0_0_60px_rgba(6,182,212,0.9)]"
                style={{
                  background:
                    'radial-gradient(circle, transparent 40%, rgba(6,182,212,0.2) 65%, rgba(168,85,247,0.3) 90%, transparent 100%)',
                }}
              />

              {/* High-Speed Swirling Accretion Disk Ring 2 */}
              <motion.div
                animate={
                  isEmerging
                    ? { rotate: [1800, 0], scale: [0.05, 1.3, 2.2], opacity: [0, 0.8, 0.5, 0] }
                    : { rotate: -1800, scale: [0.6, 1.4, 0.05], opacity: [0.8, 0.8, 0.4, 0] }
                }
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="absolute w-[420px] h-[420px] rounded-full border-2 border-dotted border-purple-400 shadow-[0_0_70px_rgba(168,85,247,0.9)]"
              />

              {/* Spiral Vortex Warp SVG Overlay */}
              <motion.svg
                viewBox="0 0 200 200"
                animate={
                  isEmerging
                    ? { rotate: [-1800, 0], scale: [0, 1.3, 2], opacity: [0, 0.85, 0.5, 0] }
                    : { rotate: 1800, scale: [0.5, 1.3, 0], opacity: [0.85, 0.85, 0.4, 0] }
                }
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="absolute w-80 h-80 sm:w-96 sm:h-96 text-cyan-400 drop-shadow-[0_0_30px_rgba(56,189,248,1)]"
              >
                <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" opacity="0.6" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="10 6" opacity="0.7" />
                <circle cx="100" cy="100" r="45" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <circle cx="100" cy="100" r="25" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.9" />
                {/* Spiral Arms */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <path
                    key={deg}
                    d={`M 100 100 Q ${100 + Math.cos(deg) * 60} ${100 + Math.sin(deg) * 60} ${100 + Math.cos(deg + 1.2) * 90} ${100 + Math.sin(deg + 1.2) * 90}`}
                    fill="none"
                    stroke="url(#vortex-grad)"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                ))}
                <defs>
                  <linearGradient id="vortex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* Central Singularity Black Hole Core */}
              <motion.div
                animate={
                  isEmerging
                    ? {
                        scale: [1.3, 0.6, 0],
                        opacity: [1, 0.8, 0],
                        boxShadow: [
                          '0 0 160px rgba(244,63,94,1)',
                          '0 0 80px rgba(56,189,248,1)',
                          '0 0 0px rgba(0,0,0,0)',
                        ],
                      }
                    : {
                        scale: [0.1, 1.2, 0],
                        opacity: [1, 1, 0],
                        boxShadow: [
                          '0 0 20px rgba(0,0,0,1)',
                          '0 0 80px rgba(56,189,248,1)',
                          '0 0 160px rgba(244,63,94,1)',
                        ],
                      }
                }
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-black border-4 border-cyan-300 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-rose-500 to-purple-600 animate-spin" />
              </motion.div>

              {/* Warp HUD Telemetry Prompt */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -20] }}
                transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
                className="absolute bottom-28 px-5 py-2 rounded-full bg-slate-950/90 border border-cyan-400 text-cyan-300 font-mono text-xs sm:text-sm font-bold tracking-widest shadow-[0_0_30px_rgba(56,189,248,0.5)] flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>
                  {isEmerging
                    ? 'COSMIC VORTEX EMERGENCE // RESUMING TRANSMISSION'
                    : 'GRAVITATIONAL VORTEX WARP // ENTERING PORTFOLIO'}
                </span>
                <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. ATMOSPHERIC CINEMATIC LIGHTING & COLOR GRADING OVERLAYS */}
        {/* Subtle warm red/orange side lighting */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 z-10"
          style={{
            background:
              'radial-gradient(circle at 10% 45%, rgba(244, 63, 94, 0.25) 0%, transparent 50%), radial-gradient(circle at 90% 55%, rgba(249, 115, 22, 0.2) 0%, transparent 50%)',
          }}
        />
        {/* Dark purple/deep-space vignette & bottom transition into Section 2 */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
        <div className="absolute inset-0 pointer-events-none z-10 bg-radial-vignette opacity-50" />
      </motion.div>

      {/* 3. BOTTOM CONTROLS & SCROLL INDICATOR */}
      <div className="relative z-30 pb-6 sm:pb-8 px-4 sm:px-8 lg:px-12 flex items-end justify-between w-full pointer-events-auto mt-auto">
        {/* Bottom-Center: "SCROLL TO EXPLORE" Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-5 sm:bottom-7 flex flex-col items-center gap-1.5 cursor-pointer group"
          onClick={handleScrollDown}
          title="Scroll down to explore Vedant's Portfolio"
        >
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-slate-300 group-hover:text-cyan-300 uppercase transition-colors drop-shadow-md">
            SCROLL TO EXPLORE
          </span>
          <motion.div
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-8 h-8 rounded-full bg-slate-950/70 border border-slate-700/80 group-hover:border-cyan-400/80 flex items-center justify-center text-cyan-400 backdrop-blur-md shadow-lg transition-all"
          >
            <ChevronDown className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
          </motion.div>
        </motion.div>

        {/* Bottom-Right: Video Controls (Play/Pause, Mute/Unmute, Fit Mode, Fullscreen) - Vertically Stacked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-end gap-2 sm:gap-2.5 ml-auto"
        >
          {videoSrc && (
            <>
              {/* Mobile Fit/Fill Mode Switcher (Visible on mobile screens) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound(600);
                  setIsMobileFitMode((prev) => !prev);
                }}
                className="md:hidden w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
                title={isMobileFitMode ? 'Fit Video to Screen' : 'Fill Whole Screen'}
              >
                {isMobileFitMode ? (
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Scan className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              <button
                onClick={togglePlay}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 hover:scale-105 backdrop-blur-md shadow-lg ${
                  isPlaying
                    ? 'bg-slate-950/80 border-cyan-500/50 text-cyan-400 shadow-cyan-500/20'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 stroke-[2.2]" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 hover:scale-105 backdrop-blur-md shadow-lg ${
                  !isMuted
                    ? 'bg-slate-950/80 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerVortexWarp();
                }}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 hover:scale-105 backdrop-blur-md shadow-lg ${
                  isVortexing
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-cyan-500/40 animate-pulse'
                    : 'bg-slate-950/80 border-purple-500/40 hover:border-purple-400 text-purple-400 hover:text-purple-300'
                }`}
                title="Trigger Vortex Warp to Portfolio"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </button>
            </>
          )}

          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
