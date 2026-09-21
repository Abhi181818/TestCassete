import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ReelHub } from './ReelHub.tsx';
import { useRouter } from '../utils/router.tsx';
import { playTapeSpool, playReelClick } from '../utils/audio.ts';
import type { ReelSide } from '../types.ts';

interface CassetteTapeProps {
  onReelTrigger?: (side: ReelSide) => void;
}

export const CassetteTape: React.FC<CassetteTapeProps> = ({ onReelTrigger }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeReel, setActiveReel] = useState<ReelSide | null>(null);
  const [rotations, setRotations] = useState<{ left: number; right: number }>({
    left: 0,
    right: 0,
  });

  const handleReelClick = (side: ReelSide) => {
    // Prevent multiple clicks while transition animation is running
    if (isNavigating) return;

    setIsNavigating(true);
    setActiveReel(side);
    playReelClick(side === 'left' ? 1.0 : 1.2);

    // Accelerating mechanical spin: 3 to 4 full revolutions (1080 - 1440 deg)
    const spinDegrees = side === 'left' ? -1080 : 1080;
    // Opposite reel also has a subtle tension spin
    const counterSpinDegrees = side === 'left' ? -240 : 240;

    setRotations((prev) => ({
      left: prev.left + (side === 'left' ? spinDegrees : counterSpinDegrees),
      right: prev.right + (side === 'right' ? spinDegrees : counterSpinDegrees),
    }));

    // Trigger audio tape spool motor whir
    playTapeSpool(1.6, side === 'left' ? 'reverse' : 'forward');

    if (onReelTrigger) {
      onReelTrigger(side);
    }

    // Wait for the full mechanical animation to complete before navigating
    setTimeout(() => {
      if (side === 'left') {
        router.push('/left');
      } else {
        router.push('/right');
      }
    }, 1600);
  };

  return (
    <div className="relative w-full max-w-[640px] px-2 sm:px-4 mx-auto select-none">
      {/* Dynamic ambient backdrop glow beneath the cassette */}
      <div
        className={`absolute -inset-4 sm:-inset-6 rounded-[2.5rem] transition-opacity duration-700 pointer-events-none blur-2xl ${
          isNavigating
            ? activeReel === 'left'
              ? 'opacity-70 bg-amber-600/30'
              : 'opacity-70 bg-cyan-600/30'
            : 'opacity-25 bg-amber-500/10'
        }`}
      />

      {/* Cassette Physical Shell Container */}
      <motion.div
        id="cassette-physical-body"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isNavigating ? 1.02 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[1.58/1] w-full rounded-[22px] sm:rounded-[26px] bg-neutral-900 border border-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06),inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-3px_6px_rgba(0,0,0,0.8)] p-3 sm:p-5 flex flex-col justify-between overflow-hidden cassette-plastic-texture"
      >
        {/* Cassette Top Write-Protect Notches (Left & Right top cutouts) */}
        <div className="absolute -top-1 left-8 w-10 h-3 bg-neutral-950 rounded-b-md border-b border-x border-neutral-800 shadow-inner" />
        <div className="absolute -top-1 right-8 w-10 h-3 bg-neutral-950 rounded-b-md border-b border-x border-neutral-800 shadow-inner" />

        {/* 5 Physical Metal Screws (Authentic Phillips head screws) */}
        {/* Top-Left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center rotate-12">
          <div className="w-2 h-0.5 bg-neutral-900 shadow-inner" />
          <div className="absolute w-0.5 h-2 bg-neutral-900 shadow-inner" />
        </div>
        {/* Top-Right */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center -rotate-45">
          <div className="w-2 h-0.5 bg-neutral-900 shadow-inner" />
          <div className="absolute w-0.5 h-2 bg-neutral-900 shadow-inner" />
        </div>
        {/* Bottom-Left */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center rotate-35">
          <div className="w-2 h-0.5 bg-neutral-900 shadow-inner" />
          <div className="absolute w-0.5 h-2 bg-neutral-900 shadow-inner" />
        </div>
        {/* Bottom-Right */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center -rotate-15">
          <div className="w-2 h-0.5 bg-neutral-900 shadow-inner" />
          <div className="absolute w-0.5 h-2 bg-neutral-900 shadow-inner" />
        </div>
        {/* Bottom-Center Screw (Just above head trapezoid) */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-neutral-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center rotate-75 z-20">
          <div className="w-2 h-0.5 bg-neutral-900 shadow-inner" />
          <div className="absolute w-0.5 h-2 bg-neutral-900 shadow-inner" />
        </div>

        {/* Outer Beveled Chamfer Line (Realistic molded perimeter channel) */}
        <div className="absolute inset-1 sm:inset-1.5 rounded-[20px] sm:rounded-[22px] border border-neutral-800/80 pointer-events-none" />

        {/* VINTAGE MIXTAPE PAPER LABEL INSERT */}
        <div
          id="cassette-label-insert"
          className="relative w-full h-[68%] rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#f7f5ed] via-[#f0ede1] to-[#e8e4d3] text-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col justify-between p-2.5 sm:p-4 border border-[#cfc8b6]"
        >
          {/* Authentic retro header stripes (Red & Orange racing bands) */}
          <div className="absolute top-0 left-0 right-0 flex flex-col">
            <div className="h-1.5 sm:h-2 bg-red-600" />
            <div className="h-1 bg-amber-500" />
            <div className="h-0.5 bg-neutral-800" />
          </div>

          {/* Cassette Technical Header Info */}
          <div className="relative z-10 flex items-center justify-between pt-1 sm:pt-1.5 px-0.5 border-b border-neutral-300 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-neutral-900 text-neutral-100 font-mono text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded tracking-tighter shadow-sm">
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

          {/* Mixtape Handwritten/Stamp Title & Subtitle */}
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

          {/* SMOKED ACRYLIC VIEWING WINDOW (Contains the two spinning reels & tape ribbon) */}
          <div
            id="cassette-window-bay"
            className="relative w-full h-[58%] sm:h-[62%] rounded-lg sm:rounded-xl bg-gradient-to-b from-[#11100f] via-[#1a1715] to-[#11100f] border-2 border-neutral-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95),0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-between px-3 sm:px-8 overflow-hidden"
          >
            {/* Dark magnetic ribbon tape spanning horizontally between reels */}
            <div className="absolute top-[48%] left-0 right-0 h-4 bg-gradient-to-b from-[#231b14] via-[#17120d] to-[#0c0a07] border-y border-[#3d2e20]/60 pointer-events-none z-0" />

            {/* Central Window Frame Ticks & Scale Markings (100 - 50 - 0) */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between py-1.5 pointer-events-none z-10 opacity-70">
              <div className="flex flex-col items-center">
                <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 font-bold tracking-tighter">100</span>
                <div className="w-3 h-0.5 bg-neutral-500" />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 font-bold tracking-tighter">50</span>
                <div className="w-4 h-0.5 bg-amber-400/80" />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 font-bold tracking-tighter">0</span>
                <div className="w-3 h-0.5 bg-neutral-500" />
              </div>
            </div>

            {/* Subtle window glass light reflection streak */}
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-45 pointer-events-none z-20" />

            {/* LEFT REEL (Side A - Navigates to /left) */}
            <div className="relative z-30 scale-90 sm:scale-100">
              <ReelHub
                id="reel-button-left"
                side="left"
                label="SIDE A • /left"
                sublabel="The Analog Archive"
                isSpinning={isNavigating && activeReel === 'left'}
                isOtherSpinning={isNavigating && activeReel === 'right'}
                disabled={isNavigating}
                tapeSpoolRadius={72} // Left has a generous spool of wound tape
                rotationAngle={rotations.left}
                onClick={() => handleReelClick('left')}
              />
            </div>

            {/* RIGHT REEL (Side B - Navigates to /right) */}
            <div className="relative z-30 scale-90 sm:scale-100">
              <ReelHub
                id="reel-button-right"
                side="right"
                label="SIDE B • /right"
                sublabel="The Synth Horizon"
                isSpinning={isNavigating && activeReel === 'right'}
                isOtherSpinning={isNavigating && activeReel === 'left'}
                disabled={isNavigating}
                tapeSpoolRadius={50} // Right has a smaller spool of wound tape
                rotationAngle={rotations.right}
                onClick={() => handleReelClick('right')}
              />
            </div>
          </div>

          {/* Label Footer with Dolby & Serial Info */}
          <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-neutral-600 pt-1">
            <span>NR [ON] / 120µs [OFF]</span>
            <span className="tracking-widest uppercase font-semibold text-neutral-500">
              JAPAN RECORDING CORP • MASTER TAPE
            </span>
            <span className="font-bold text-neutral-800">NO. 840921</span>
          </div>
        </div>

        {/* BOTTOM TRAPEZOIDAL HEAD-ACCESS HOUSING (The classic tape deck head entry) */}
        <div
          id="cassette-head-aperture"
          className="relative w-[82%] mx-auto h-[24%] bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 rounded-t-lg border-t border-x border-neutral-700/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_-2px_6px_rgba(0,0,0,0.6)] flex items-center justify-between px-4 sm:px-8 mt-1.5"
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
            {/* Magnetic tape ribbon visible in aperture */}
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
      </motion.div>
    </div>
  );
};
