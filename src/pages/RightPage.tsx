import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from '../utils/router.tsx';
import { playReelClick, playTapeSpool } from '../utils/audio.ts';
import { ArrowLeft, Play, Pause, Activity, Zap, Disc, Sliders } from 'lucide-react';

export const RightPage: React.FC = () => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePreset, setActivePreset] = useState(0);

  const presets = [
    { name: 'Neon Arpeggiator (128 BPM)', type: 'Dual Sawtooth Filter', cutoff: '4.2 kHz', resonance: '68%' },
    { name: 'FM Bassline Matrix (Overdrive)', type: 'Frequency Modulation', cutoff: '2.1 kHz', resonance: '82%' },
    { name: 'Vapor Waveform Dreamscape', type: 'Sub-Oscillator + Chorus', cutoff: '8.4 kHz', resonance: '45%' },
  ];

  const handleReturn = () => {
    playReelClick(1.2);
    playTapeSpool(0.8, 'forward');
    setTimeout(() => {
      router.push('/');
    }, 200);
  };

  return (
    <div
      id="right-page"
      className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-8 noise-overlay selection:bg-cyan-500/30"
    >
      {/* Background ambient cyan/violet glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_20%,rgba(6,182,212,0.12),transparent)] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <button
          id="right-page-return-btn"
          type="button"
          onClick={handleReturn}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:border-cyan-500/50 hover:bg-neutral-800 transition-all font-mono text-xs sm:text-sm text-neutral-200 shadow-md focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-x-1" />
          <span>EJECT & RETURN TO CASSETTE</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SIDE B REEL ENGAGED</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Synthwave Terminal & Oscilloscope */}
          <div className="lg:col-span-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  SIDE B • SYNTHESIS MATRIX
                </span>
                <span className="font-mono text-[11px] text-neutral-500">
                  DIGITAL-DIRECT
                </span>
              </div>

              <div className="relative aspect-square rounded-xl bg-gradient-to-br from-[#0c1824] via-[#09111a] to-neutral-950 border border-cyan-950/80 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                    44.1 kHz • 24-BIT
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs text-cyan-400/80 uppercase tracking-widest">
                    Side Beta
                  </span>
                  <h3 className="text-xl font-bold font-mono text-neutral-100 tracking-wide mt-1">
                    The Synth Horizon
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    High-energy algorithmic sequences, punchy envelopes, and resonant harmonics.
                  </p>
                </div>

                {/* Animated Digital Frequency Visualizer */}
                <div className="flex items-end gap-1.5 h-16 pt-2 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800">
                  {[25, 60, 40, 85, 95, 70, 50, 80, 100, 65, 45, 90, 75, 55, 35].map((val, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        height: isPlaying ? [`${val * 0.25}%`, `${val}%`, `${val * 0.4}%`] : '15%',
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.9 + (idx % 5) * 0.15,
                        ease: 'easeInOut',
                      }}
                      className="flex-1 bg-gradient-to-t from-cyan-600 via-cyan-400 to-indigo-400 rounded-t-sm shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tactile Mini Deck Controls */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playReelClick(1.3);
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold flex items-center justify-center transition-all shadow-md active:scale-95"
                  aria-label={isPlaying ? 'Pause Side B' : 'Play Side B'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="flex flex-col font-mono text-xs">
                  <span className="font-bold text-neutral-200">
                    {isPlaying ? 'CLOCK SYNCED' : 'PAUSED'}
                  </span>
                  <span className="text-neutral-500 text-[10px]">OSCILLATOR ACTIVE</span>
                </div>
              </div>

              <div className="font-mono text-xs text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                04:38 / 14:20
              </div>
            </div>
          </div>

          {/* Right Column: Synth Modules & Presets */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>SYNTHESIS HORIZON ENGINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tracking-tight">
                Digital Precision & Electric Pulses
              </h2>
              <p className="mt-2 text-neutral-400 text-sm leading-relaxed">
                You arrived here by engaging the <strong>Right Reel</strong>. In tape mechanics, the right reel acts as the take-up spool, pulling the tape forward with dynamic motor tension and relentless forward tempo.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              {presets.map((preset, index) => (
                <div
                  key={index}
                  onClick={() => {
                    playReelClick(1.2 + index * 0.1);
                    setActivePreset(index);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activePreset === index
                      ? 'bg-cyan-950/20 border-cyan-500/50 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 w-6">
                      0{index + 4}.
                    </span>
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-neutral-200">
                        {preset.name}
                      </h4>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {preset.type} • Cutoff: {preset.cutoff}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                    <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{preset.resonance}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Spec Callout */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/60 text-xs font-mono text-neutral-400 flex items-start gap-3">
              <Disc className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-200">Take-Up Motor Note:</strong> Reel acceleration dynamically tensioned for zero tape slack. To flip back to the warm analog archive, return to the cassette deck and choose the left reel.
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto pt-4 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-500">
        <span>DESTINATION: /right</span>
        <span>TAKE-UP MOTOR: SYNCHRONIZED</span>
      </footer>
    </div>
  );
};
