import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CassetteTape } from '../components/CassetteTape.tsx';
import { AudioToggle } from '../components/AudioToggle.tsx';
import type { ReelSide } from '../types.ts';
import { Sparkles, ArrowLeft, ArrowRight, Disc3 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeSide, setActiveSide] = useState<ReelSide | null>(null);

  return (
    <div
      id="landing-page"
      className="relative min-h-screen w-full flex flex-col justify-between items-center py-6 px-4 overflow-hidden bg-neutral-950 noise-overlay"
    >
      {/* Background analog grid & radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(35,28,20,0.45),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header Bar / Tape Deck Status */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b border-neutral-800/80 pb-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-widest text-neutral-300 uppercase">
              STUDIO DECK • GX-88
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              4.76 cm/s • DOLBY B/C NR ACTIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AudioToggle />
        </div>
      </header>

      {/* Main Stage: Centered Cassette Physical Object */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center my-auto py-4">
        {/* Title and prompt */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-[11px] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SELECT DRIVE MECHANISM TO NAVIGATE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-100 font-mono uppercase">
            Two Sides • One Tape
          </h1>
          <p className="mt-2 text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
            Interact with either drive reel below. Each reel independently powers a distinct sonic journey.
          </p>
        </motion.div>

        {/* The Physical Cassette Tape */}
        <div className="w-full flex justify-center">
          <CassetteTape onReelTrigger={(side) => setActiveSide(side)} />
        </div>

        {/* Interactive Cue Helpers underneath */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-xs font-mono text-neutral-400"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Click Left Reel for <strong className="text-neutral-200">Side A (/left)</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
            <span>Click Right Reel for <strong className="text-neutral-200">Side B (/right)</strong></span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </motion.div>
      </main>

      {/* Footer System Specs */}
      <footer className="relative z-10 w-full max-w-4xl pt-3 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-2">
        <div className="flex items-center gap-2">
          <Disc3 className="w-3.5 h-3.5 text-neutral-600" />
          <span>REAL-TIME MOTOR ENGAGE SYSTEM</span>
        </div>
        <div className="flex items-center gap-4">
          <span>KEYBOARD: [TAB] + [ENTER]</span>
          <span>CHROME BIAS 70µs</span>
        </div>
      </footer>
    </div>
  );
};
