import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ReelHub } from './ReelHub.tsx';
import { useRouter } from '../utils/router.tsx';
import { playTapeSpool, playReelClick } from '../utils/audio.ts';
import type { ReelSide } from '../types.ts';
import { Box, Eye, Move3d } from 'lucide-react';

export type View3DMode = 'isometric' | 'interactive' | 'flat';

interface CassetteTapeProps {
  onReelTrigger?: (side: ReelSide) => void;
  defaultMode?: View3DMode;
}

export const CassetteTape: React.FC<CassetteTapeProps> = ({
  onReelTrigger,
  defaultMode = 'interactive',
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<View3DMode>(defaultMode);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeReel, setActiveReel] = useState<ReelSide | null>(null);
  const [rotations, setRotations] = useState<{ left: number; right: number }>({
    left: 0,
    right: 0,
  });

  // 3D Tilt Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid 3D movement
  const springConfig = { damping: 22, stiffness: 140, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Dynamic 3D rotation transforms based on view mode and mouse position
  const rotateX = useTransform(smoothMouseY, (val) => {
    if (viewMode === 'flat') return 0;
    if (viewMode === 'isometric') return 18;
    // Interactive: default base tilt of 10deg + mouse range +/- 14deg
    return 10 + val * -18;
  });

  const rotateY = useTransform(smoothMouseX, (val) => {
    if (viewMode === 'flat') return 0;
    if (viewMode === 'isometric') return -16;
    // Interactive: default base angle of -6deg + mouse range +/- 20deg
    return -6 + val * 22;
  });

  const rotateZ = useTransform(smoothMouseX, (val) => {
    if (viewMode === 'flat') return 0;
    if (viewMode === 'isometric') return 1.5;
    return val * 3;
  });

  // Dynamic shadow offset that moves opposite to the light source/tilt
  const shadowX = useTransform(smoothMouseX, (val) => {
    if (viewMode === 'isometric') return 24;
    return 12 + val * -30;
  });

  const shadowY = useTransform(smoothMouseY, (val) => {
    if (viewMode === 'isometric') return 38;
    return 30 + val * 35;
  });

  // Dynamic specular light reflection coordinate across the cassette window
  const glareX = useTransform(smoothMouseX, (val) => `${50 + val * 45}%`);
  const glareY = useTransform(smoothMouseY, (val) => `${50 + val * 45}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'interactive' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize coordinates between -1 and 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (viewMode === 'interactive') {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleReelClick = (side: ReelSide) => {
    if (isNavigating) return;

    setIsNavigating(true);
    setActiveReel(side);
    playReelClick(side === 'left' ? 1.0 : 1.2);

    // Accelerating mechanical spin: 3 to 4 full revolutions
    const spinDegrees = side === 'left' ? -1080 : 1080;
    const counterSpinDegrees = side === 'left' ? -240 : 240;

    setRotations((prev) => ({
      left: prev.left + (side === 'left' ? spinDegrees : counterSpinDegrees),
      right: prev.right + (side === 'right' ? spinDegrees : counterSpinDegrees),
    }));

    playTapeSpool(1.6, side === 'left' ? 'reverse' : 'forward');

    if (onReelTrigger) {
      onReelTrigger(side);
    }

    setTimeout(() => {
      if (side === 'left') {
        router.push('/left');
      } else {
        router.push('/right');
      }
    }, 1600);
  };

  return (
    <div className="relative w-full max-w-[680px] px-2 sm:px-4 mx-auto select-none flex flex-col items-center">
      {/* 3D Perspective Mode Selector Bar */}
      <div className="mb-6 flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-md backdrop-blur-sm z-30">
        <span className="px-2.5 font-mono text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:inline-block">
          3D VIEW:
        </span>
        <button
          type="button"
          onClick={() => {
            playReelClick(1.1);
            setViewMode('interactive');
            mouseX.set(0);
            mouseY.set(0);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
            viewMode === 'interactive'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
          }`}
          aria-label="Interactive 3D view with mouse tracking"
        >
          <Move3d className="w-3.5 h-3.5" />
          <span>Interactive 3D</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playReelClick(1.15);
            setViewMode('isometric');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
            viewMode === 'isometric'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
          }`}
          aria-label="Fixed 3D Isometric View"
        >
          <Box className="w-3.5 h-3.5" />
          <span>Isometric 3D</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playReelClick(1.05);
            setViewMode('flat');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
            viewMode === 'flat'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
          }`}
          aria-label="Direct studio flat view"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Studio 2D</span>
        </button>
      </div>

      {/* 3D PERSPECTIVE STAGE CONTAINER */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[1.58/1] perspective-1200 preserve-3d py-4 cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        {/* PHYSICAL 3D EXTENDED AMBIENT & CONTACT SHADOW */}
        <motion.div
          style={{
            x: shadowX,
            y: shadowY,
            scale: isNavigating ? 1.05 : 0.98,
          }}
          className="absolute inset-x-8 -bottom-8 h-20 rounded-[3rem] bg-black/80 blur-2xl pointer-events-none -z-20 transition-all duration-300"
        />
        <motion.div
          style={{
            x: shadowX,
            y: shadowY,
          }}
          className="absolute inset-x-12 -bottom-4 h-12 rounded-[2rem] bg-amber-950/20 blur-xl pointer-events-none -z-10"
        />

        {/* 3D ROTATING CASSETTE OBJECT */}
        <motion.div
          id="cassette-3d-chassis"
          style={{
            rotateX,
            rotateY,
            rotateZ,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            scale: isNavigating ? (activeReel === 'left' ? 1.05 : 1.05) : 1,
            z: isNavigating ? 35 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full rounded-[24px] preserve-3d"
        >
          {/* ========================================================= */}
          {/* 1. PHYSICAL 3D EXTRUDED SIDE WALLS (CASSETTE THICKNESS)    */}
          {/* ========================================================= */}

          {/* Left Thickness Edge (Visible when tilted right) */}
          <div
            className="absolute top-0 bottom-0 -left-[14px] w-[14px] rounded-l-md bg-gradient-to-r from-[#12100e] via-[#1c1916] to-[#0a0807] border-l border-y border-neutral-700/60 pointer-events-none shadow-inner"
            style={{
              transform: 'rotateY(-90deg) translateZ(7px)',
              transformOrigin: 'right center',
            }}
          >
            {/* Side grip molded ribbed texture */}
            <div className="absolute inset-y-8 left-1 right-1 flex flex-col justify-around opacity-40">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-1 bg-neutral-900 border-b border-neutral-600 rounded-xs" />
              ))}
            </div>
          </div>

          {/* Right Thickness Edge (Visible when tilted left) */}
          <div
            className="absolute top-0 bottom-0 -right-[14px] w-[14px] rounded-r-md bg-gradient-to-l from-[#12100e] via-[#1c1916] to-[#0a0807] border-r border-y border-neutral-700/60 pointer-events-none shadow-inner"
            style={{
              transform: 'rotateY(90deg) translateZ(7px)',
              transformOrigin: 'left center',
            }}
          >
            {/* Side grip molded ribbed texture */}
            <div className="absolute inset-y-8 left-1 right-1 flex flex-col justify-around opacity-40">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-1 bg-neutral-900 border-b border-neutral-600 rounded-xs" />
              ))}
            </div>
          </div>

          {/* Top Thickness Edge (Visible when tilted down) */}
          <div
            className="absolute -top-[14px] left-0 right-0 h-[14px] rounded-t-md bg-gradient-to-b from-[#24201c] via-[#181512] to-[#0d0b09] border-t border-x border-neutral-600/70 pointer-events-none flex items-center justify-between px-12"
            style={{
              transform: 'rotateX(90deg) translateZ(7px)',
              transformOrigin: 'center bottom',
            }}
          >
            {/* Top write protect notch apertures */}
            <div className="w-8 h-2 bg-neutral-950 rounded-xs border border-neutral-800" />
            <div className="h-0.5 w-1/3 bg-neutral-700/60" />
            <div className="w-8 h-2 bg-neutral-950 rounded-xs border border-neutral-800" />
          </div>

          {/* Bottom Thickness Edge (Visible when tilted up) */}
          <div
            className="absolute -bottom-[14px] left-0 right-0 h-[14px] rounded-b-md bg-gradient-to-t from-[#0d0b09] via-[#161310] to-[#24201c] border-b border-x border-neutral-800 pointer-events-none"
            style={{
              transform: 'rotateX(-90deg) translateZ(7px)',
              transformOrigin: 'center top',
            }}
          />

          {/* ========================================================= */}
          {/* 2. REAR SHELL BACKPLATE LAYER (translateZ(-8px))           */}
          {/* ========================================================= */}
          <div
            className="absolute inset-0 rounded-[22px] sm:rounded-[26px] bg-gradient-to-br from-neutral-950 via-[#14110e] to-neutral-950 border border-neutral-800 pointer-events-none shadow-2xl"
            style={{ transform: 'translateZ(-8px)' }}
          />

          {/* ========================================================= */}
          {/* 3. FRONT CASING MASTER CHASSIS (translateZ(8px))           */}
          {/* ========================================================= */}
          <div
            id="cassette-front-face"
            className="relative w-full h-full rounded-[22px] sm:rounded-[26px] bg-gradient-to-b from-[#26211c] via-[#1a1714] to-[#120f0d] border-2 border-neutral-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_6px_rgba(0,0,0,0.9)] p-3 sm:p-5 flex flex-col justify-between overflow-hidden cassette-plastic-texture preserve-3d"
            style={{ transform: 'translateZ(8px)' }}
          >
            {/* Top Write-Protect Notches */}
            <div className="absolute -top-1 left-8 w-10 h-3.5 bg-neutral-950 rounded-b-md border-b border-x border-neutral-800 shadow-inner" />
            <div className="absolute -top-1 right-8 w-10 h-3.5 bg-neutral-950 rounded-b-md border-b border-x border-neutral-800 shadow-inner" />

            {/* 5 Real Physical 3D Screws with depth extrusion (translateZ(14px)) */}
            <div
              className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center rotate-12 z-30"
              style={{ transform: 'translateZ(14px)' }}
            >
              <div className="w-2.5 h-0.5 bg-neutral-900 shadow-inner" />
              <div className="absolute w-0.5 h-2.5 bg-neutral-900 shadow-inner" />
            </div>

            <div
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center -rotate-45 z-30"
              style={{ transform: 'translateZ(14px)' }}
            >
              <div className="w-2.5 h-0.5 bg-neutral-900 shadow-inner" />
              <div className="absolute w-0.5 h-2.5 bg-neutral-900 shadow-inner" />
            </div>

            <div
              className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center rotate-35 z-30"
              style={{ transform: 'translateZ(14px)' }}
            >
              <div className="w-2.5 h-0.5 bg-neutral-900 shadow-inner" />
              <div className="absolute w-0.5 h-2.5 bg-neutral-900 shadow-inner" />
            </div>

            <div
              className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center -rotate-15 z-30"
              style={{ transform: 'translateZ(14px)' }}
            >
              <div className="w-2.5 h-0.5 bg-neutral-900 shadow-inner" />
              <div className="absolute w-0.5 h-2.5 bg-neutral-900 shadow-inner" />
            </div>

            {/* Bottom-Center Screw */}
            <div
              className="absolute bottom-16 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center rotate-75 z-30"
              style={{ transform: 'translateZ(14px)' }}
            >
              <div className="w-2.5 h-0.5 bg-neutral-900 shadow-inner" />
              <div className="absolute w-0.5 h-2.5 bg-neutral-900 shadow-inner" />
            </div>

            {/* Recessed Perimeter Chamfer Line */}
            <div className="absolute inset-1 sm:inset-1.5 rounded-[20px] sm:rounded-[22px] border border-neutral-800/90 pointer-events-none" />

            {/* VINTAGE MIXTAPE PAPER LABEL INSERT (translateZ(10px)) */}
            <div
              id="cassette-label-insert"
              className="relative w-full h-[68%] rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#faf8f0] via-[#f1eee2] to-[#e4e0ce] text-neutral-900 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_3px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col justify-between p-2.5 sm:p-4 border border-[#cfc7b4] preserve-3d"
              style={{ transform: 'translateZ(10px)' }}
            >
              {/* Retro racing stripes (Red & Orange) */}
              <div className="absolute top-0 left-0 right-0 flex flex-col">
                <div className="h-1.5 sm:h-2 bg-red-600 shadow-xs" />
                <div className="h-1 bg-amber-500" />
                <div className="h-0.5 bg-neutral-900" />
              </div>

              {/* Technical Header */}
              <div className="relative z-10 flex items-center justify-between pt-1 sm:pt-1.5 px-0.5 border-b border-neutral-300 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-neutral-950 text-neutral-100 font-mono text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded tracking-tighter shadow-sm">
                    C-90
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] font-bold tracking-wider text-neutral-700 uppercase">
                    Type II • Chrome
                  </span>
                </div>

                <div className="text-center hidden xs:block">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-neutral-500 uppercase font-semibold">
                    High Bias • 70µs EQ
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-neutral-800 tracking-wider">
                    [DOLBY NR]
                  </span>
                  <span className="bg-red-600 text-white font-mono text-[10px] sm:text-xs font-black px-1 rounded shadow-xs">
                    STEREO
                  </span>
                </div>
              </div>

              {/* Mixtape Title Stamp */}
              <div className="relative z-10 my-0.5 flex flex-col items-center justify-center text-center">
                <h2 className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-wider text-neutral-900 uppercase">
                  INTERACTIVE PATHFINDER • VOL. 1
                </h2>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-neutral-600">
                  <span className="font-bold text-red-600">SIDE A:</span> Left Reel
                  <span className="text-neutral-400">|</span>
                  <span className="font-bold text-amber-700">SIDE B:</span> Right Reel
                </div>
              </div>

              {/* SMOKED ACRYLIC VIEWING WINDOW (Deep Recessed 3D Cavity) */}
              <div
                id="cassette-window-bay"
                className="relative w-full h-[58%] sm:h-[62%] rounded-lg sm:rounded-xl bg-gradient-to-b from-[#0a0908] via-[#161311] to-[#0a0908] border-2 border-neutral-800 shadow-[inset_0_6px_16px_rgba(0,0,0,0.98),0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-between px-3 sm:px-8 overflow-hidden preserve-3d"
                style={{ transform: 'translateZ(-4px)' }}
              >
                {/* Horizontal Magnetic Tape Ribbon */}
                <div className="absolute top-[48%] left-0 right-0 h-4 bg-gradient-to-b from-[#251d16] via-[#16120c] to-[#0b0906] border-y border-[#3d2e20]/70 pointer-events-none z-0" />

                {/* Central Ruler Measurement Ticks (100 - 50 - 0) */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between py-1.5 pointer-events-none z-10 opacity-75">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 font-bold tracking-tighter">100</span>
                    <div className="w-3 h-0.5 bg-neutral-500" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 font-bold tracking-tighter">50</span>
                    <div className="w-4 h-0.5 bg-amber-400/90" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 font-bold tracking-tighter">0</span>
                    <div className="w-3 h-0.5 bg-neutral-500" />
                  </div>
                </div>

                {/* DYNAMIC 3D SPECULAR GLARE REFLECTION (Moves with 3D mouse tilt) */}
                <motion.div
                  style={{
                    background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)`,
                  }}
                  className="absolute inset-0 pointer-events-none z-20"
                />

                {/* LEFT REEL (Side A - Navigates to /left) */}
                <div
                  className="relative z-30 scale-90 sm:scale-100"
                  style={{ transform: 'translateZ(6px)' }}
                >
                  <ReelHub
                    id="reel-button-left"
                    side="left"
                    label="SIDE A • /left"
                    sublabel="The Analog Archive"
                    isSpinning={isNavigating && activeReel === 'left'}
                    isOtherSpinning={isNavigating && activeReel === 'right'}
                    disabled={isNavigating}
                    tapeSpoolRadius={72}
                    rotationAngle={rotations.left}
                    onClick={() => handleReelClick('left')}
                  />
                </div>

                {/* RIGHT REEL (Side B - Navigates to /right) */}
                <div
                  className="relative z-30 scale-90 sm:scale-100"
                  style={{ transform: 'translateZ(6px)' }}
                >
                  <ReelHub
                    id="reel-button-right"
                    side="right"
                    label="SIDE B • /right"
                    sublabel="The Synth Horizon"
                    isSpinning={isNavigating && activeReel === 'right'}
                    isOtherSpinning={isNavigating && activeReel === 'left'}
                    disabled={isNavigating}
                    tapeSpoolRadius={50}
                    rotationAngle={rotations.right}
                    onClick={() => handleReelClick('right')}
                  />
                </div>
              </div>

              {/* Label Footer */}
              <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-neutral-600 pt-1">
                <span>NR [ON] / 120µs [OFF]</span>
                <span className="tracking-widest uppercase font-semibold text-neutral-500">
                  JAPAN RECORDING CORP • MASTER TAPE
                </span>
                <span className="font-bold text-neutral-800">NO. 840921</span>
              </div>
            </div>

            {/* BOTTOM TRAPEZOIDAL HEAD-ACCESS HOUSING (translateZ(6px)) */}
            <div
              id="cassette-head-aperture"
              className="relative w-[82%] mx-auto h-[24%] bg-gradient-to-b from-neutral-950 via-[#13110f] to-neutral-950 rounded-t-lg border-t border-x border-neutral-700/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_-3px_8px_rgba(0,0,0,0.8)] flex items-center justify-between px-4 sm:px-8 mt-1.5"
              style={{ transform: 'translateZ(6px)' }}
            >
              {/* Left Guide Roller Pin Hole */}
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 shadow-sm" />
                </div>
              </div>

              {/* Left Capstan Shaft Hole */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner" />

              {/* Central Magnetic Read/Write Tape Head Opening */}
              <div className="relative w-16 sm:w-20 h-5 sm:h-6 rounded bg-neutral-950 border border-neutral-800 shadow-inner flex items-center justify-center overflow-hidden">
                <div className="w-full h-2 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 rounded-sm opacity-80" />
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[#231b14] border-y border-[#3d2e20]/80" />
              </div>

              {/* Right Capstan Shaft Hole */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner" />

              {/* Right Guide Roller Pin Hole */}
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3D Interaction Tip underneath */}
      <div className="mt-4 text-center">
        <span className="font-mono text-[11px] text-neutral-500">
          Tip: Move cursor across the cassette to experience real-time 3D parallax & light sheen
        </span>
      </div>
    </div>
  );
};
