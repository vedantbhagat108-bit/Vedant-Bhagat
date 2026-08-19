import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Film,
  Video,
  Maximize2,
  Minimize2,
  ChevronDown,
} from 'lucide-react';
import { resolveActiveHeroVideo } from '../utils/videoStorage';
import { playClickSound } from '../utils/audio';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroVideoPortalProps {
  onVortexTrigger?: () => void;
  className?: string;
}

export const HeroVideoPortal: React.FC<HeroVideoPortalProps> = ({ onVortexTrigger, className = '' }) => {
  const { data } = usePortfolio();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isManualVortexing, setIsManualVortexing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const portalContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasPlaceholderRef = useRef<HTMLCanvasElement | null>(null);

  const loadVideo = () => {
    resolveActiveHeroVideo(data.personalInfo?.heroVideoUrl).then((resolvedUrl) => {
      setVideoSrc(resolvedUrl);
    });
  };

  // Load existing saved video on mount & sync when changed from Customize Settings
  useEffect(() => {
    loadVideo();

    const handleVideoUpdate = () => {
      loadVideo();
    };

    window.addEventListener('portfolio-video-updated', handleVideoUpdate);
    return () => {
      window.removeEventListener('portfolio-video-updated', handleVideoUpdate);
    };
  }, [data.personalInfo?.heroVideoUrl]);

  // Track fullscreen state change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Track scroll position to compute funnel into the top vortex
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight || 800;
      // Reaches 1 as soon as scrolled past introductory view
      const progress = Math.min(Math.max(scrollY / (windowHeight * 0.7), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Fullscreen Toggle
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound(800);

    if (!document.fullscreenElement) {
      if (portalContainerRef.current?.requestFullscreen) {
        portalContainerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Main Click Handler: Click anywhere on video to immediately start / stop playback
  const handlePortalTap = () => {
    playClickSound(650);

    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handlePortalTap();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound(700);
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Trigger manual vortex animation preview
  const handleVortexTrigger = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound(950);
    setIsManualVortexing(true);
    if (onVortexTrigger) onVortexTrigger();
    setTimeout(() => {
      setIsManualVortexing(false);
    }, 2800);
  };

  // Canvas animated placeholder if no video is uploaded yet (seamlessly transparent)
  useEffect(() => {
    if (videoSrc) return;
    const canvas = canvasPlaceholderRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width = 1280;
      const h = canvas.height = 720;

      // Transparent clear so it is one with the SpaceCanvas backdrop
      ctx.clearRect(0, 0, w, h);

      // Rotating holographic grid rings
      ctx.save();
      ctx.translate(w / 2, h / 2);
      for (let i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 50 * i + Math.sin(t + i) * 6, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.22)' : 'rgba(168, 85, 247, 0.26)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([10, 8]);
        ctx.stroke();
      }

      // Orbital holographic nodes
      for (let j = 0; j < 10; j++) {
        const angle = t * 0.7 + (j * Math.PI * 2) / 10;
        const radius = 175 + Math.sin(t * 2 + j) * 22;
        const nx = Math.cos(angle) * radius;
        const ny = Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
      }

      // Central Avatar Hologram Icon
      ctx.beginPath();
      ctx.arc(0, 0, 76, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(147, 51, 234, 0.16)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#a855f7';
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [videoSrc]);

  // Combined Vortex Factor: either from scrolling down or clicking "Enter Vortex"
  const vortexFactor = isManualVortexing ? 0.96 : scrollProgress;

  // 3D Vortex Transform Calculations:
  // Funnels into the cosmic black hole singularity at the top center
  const translateY = isFullscreen ? 0 : -vortexFactor * 680;
  const scale = isFullscreen ? 1 : Math.max(0.02, 1 - vortexFactor * 0.96);
  const rotateDeg = isFullscreen ? 0 : vortexFactor * 720;
  const rotateXDeg = isFullscreen ? 0 : vortexFactor * 80;
  const opacity = isFullscreen ? 1 : Math.max(0, 1 - vortexFactor * 1.05);
  const blurAmount = isFullscreen ? 0 : vortexFactor * 14;

  return (
    <div className={`relative w-full flex flex-col items-center justify-center ${className}`}>
      {/* Main Video & Funnel Container — Fitted to screen below navbar, ONE with background without box container */}
      <div
        ref={portalContainerRef}
        onClick={handlePortalTap}
        className={`relative w-full cursor-pointer select-none transition-all duration-150 ease-out perspective-1000 ${
          isFullscreen
            ? 'fixed inset-0 z-50 w-screen h-screen bg-black'
            : 'h-[calc(100dvh-5rem)] max-h-[880px] min-h-[380px] sm:min-h-[480px] flex items-center justify-center'
        }`}
        style={{
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotateDeg}deg) rotateX(${rotateXDeg}deg)`,
          opacity: opacity,
          filter: `blur(${blurAmount}px)`,
          transformOrigin: 'top center',
          pointerEvents: vortexFactor > 0.85 && !isFullscreen ? 'none' : 'auto',
        }}
      >
        {/* Gravitational Lens Singularity Flare when vortexing */}
        {vortexFactor > 0.15 && !isFullscreen && (
          <div
            className="absolute inset-0 z-30 pointer-events-none mix-blend-screen transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at 50% 10%, rgba(255,255,255,${vortexFactor * 0.95}), rgba(192,132,252,${vortexFactor * 0.75}) 40%, rgba(3,7,18,0) 75%)`,
            }}
          />
        )}

        {/* Video Element or Animated Hologram Canvas with Soft Vignette Radial Mask (One with background, NO box container) */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-300"
          style={{
            // Radial feathered mask to dissolve video boundaries directly into space & stars
            WebkitMaskImage: isFullscreen
              ? 'none'
              : 'radial-gradient(ellipse 80% 75% at 50% 50%, black 50%, rgba(0,0,0,0.85) 75%, transparent 100%)',
            maskImage: isFullscreen
              ? 'none'
              : 'radial-gradient(ellipse 80% 75% at 50% 50%, black 50%, rgba(0,0,0,0.85) 75%, transparent 100%)',
          }}
        >
          {videoSrc ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Mobile Ambient Glow Reflection (creates a theater glow behind the resized video on phones) */}
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

              {/* Main Crisp Video (Resized for mobile browsers without horizontal or vertical cutoffs) */}
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                // @ts-ignore
                webkit-playsinline="true"
                x5-playsinline="true"
                onError={() => {
                  console.warn('Video failed to load on this device, falling back to cosmic portal canvas.');
                  setVideoSrc(null);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="relative z-10 w-full h-auto max-h-[76dvh] max-w-[94vw] object-contain rounded-2xl md:rounded-none md:max-h-none md:max-w-none md:h-full md:object-cover pointer-events-none drop-shadow-[0_0_60px_rgba(56,189,248,0.25)]"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <canvas
                ref={canvasPlaceholderRef}
                className="w-full h-full object-contain md:object-cover pointer-events-none"
              />

              {/* Hologram Cosmic Portal Info Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight flex items-center gap-2.5 drop-shadow-md">
                  <Video className="w-7 h-7 text-cyan-400" />
                  <span>Introductory Video Portal</span>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-lg leading-relaxed drop-shadow">
                  Click anywhere to play / pause. Customize, upload, or replace your video anytime in the <span className="text-cyan-300 font-semibold">Customize Settings</span> panel.
                </p>
                <div className="mt-4 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs sm:text-sm font-mono text-cyan-300 flex items-center gap-2 backdrop-blur-md shadow-lg shadow-cyan-950/40">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Click to Toggle Play / Stop • Seamless Cosmic Background</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Left Minimal Video Controls (Play/Pause & Mute) — Responsive Buttons */}
        {videoSrc && (
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-8 flex items-center gap-2 sm:gap-2.5 z-20 pointer-events-auto">
            <button
              onClick={togglePlay}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 hover:scale-105 backdrop-blur-md shadow-lg ${
                isPlaying
                  ? 'bg-slate-950/80 border-cyan-500/50 text-cyan-400 shadow-cyan-500/20'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 stroke-[2.2]" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 ml-0.5" />}
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
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
            </button>
          </div>
        )}

        {/* Bottom Right Vertical Controls Stack: 1. Full Screen, 2. Enter Vortex */}
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-8 flex flex-col items-end gap-2 sm:gap-2.5 z-20 pointer-events-auto">
          {/* 1. Full Screen Toggle (Icon only) */}
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

          {/* 2. Enter Vortex & Explore Button (Icon only) */}
          {!isFullscreen && (
            <button
              onClick={handleVortexTrigger}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/60 text-white flex items-center justify-center shadow-xl shadow-purple-950/70 backdrop-blur-md transition-all duration-200 hover:scale-105"
              title="Enter Cosmic Vortex & Explore"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Exploration Indicator Beneath Video */}
      {vortexFactor < 0.85 && !isFullscreen && (
        <div className="mt-2 mb-6 flex flex-col items-center justify-center gap-1.5 text-center text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scroll down to funnel into cosmic vortex</span>
          </div>
          <ChevronDown className="w-4 h-4 text-cyan-400/70 animate-bounce" />
        </div>
      )}
    </div>
  );
};

