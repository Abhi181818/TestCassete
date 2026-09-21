import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from '../utils/router.tsx';
import { playReelClick, playTapeSpool } from '../utils/audio.ts';
import { ArrowLeft, Play, Pause, RotateCcw, Radio, Sparkles, Volume2, Disc } from 'lucide-react';

export const LeftPage: React.FC = () => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTrack, setActiveTrack] = useState(0);

  const tracks = [
    { title: 'Analog Morning (Warm Tape Loop)', duration: '03:42', bias: 'Type II Chrome', freq: '30Hz - 18kHz' },
    { title: 'Ribbon Memories & Flutter', duration: '04:15', bias: 'Dolby B NR', freq: '20Hz - 19kHz' },
    { title: 'Acoustic Saturation in A-Minor', duration: '02:58', bias: 'High Output', freq: '40Hz - 17kHz' },
  ];

  const handleReturn = () => {
    playReelClick(0.9);
    playTapeSpool(0.8, 'reverse');
    setTimeout(() => {
      router.push('/');
    }, 200);
  };

  return (
    <div
      id="left-page"
      className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-8 noise-overlay selection:bg-amber-500/30"
    >
      {/* Background ambient warmth */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_20%,rgba(180,83,9,0.12),transparent)] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <button
          id="left-page-return-btn"
          type="button"
          onClick={handleReturn}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:border-amber-500/50 hover:bg-neutral-800 transition-all font-mono text-xs sm:text-sm text-neutral-200 shadow-md focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 transition-transform group-hover:-translate-x-1" />
          <span>EJECT & RETURN TO CASSETTE</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>SIDE A REEL ENGAGED</span>
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
          {/* Left Column: Side A Mixtape Sleeve Inset Card */}
          <div className="lg:col-span-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
                  SIDE A • TRACK INDEX
                </span>
                <span className="font-mono text-[11px] text-neutral-500">
                  C-90 STEREO
                </span>
              </div>

              <div className="relative aspect-square rounded-xl bg-gradient-to-br from-[#231b14] via-[#15120e] to-neutral-950 border border-neutral-800 p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border border-amber-500/10 pointer-events-none" />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full border border-amber-500/5 pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Disc className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
                    4.76 CM/S
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs text-amber-400/80 uppercase tracking-widest">
                    Side Alpha
                  </span>
                  <h3 className="text-xl font-bold font-mono text-neutral-100 tracking-wide mt-1">
                    The Analog Archive
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Warm saturation, physical tape flutter, and harmonic acoustic textures.
                  </p>
                </div>

                {/* Animated tape reel waveform simulator */}
                <div className="flex items-end gap-1 h-8 pt-2">
                  {[40, 65, 80, 50, 90, 70, 45, 85, 95, 60, 75, 40, 85, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isPlaying ? [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] : '20%',
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2 + (i % 4) * 0.2,
                        ease: 'easeInOut',
                      }}
                      className="flex-1 bg-amber-500/60 rounded-t-sm"
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
                    playReelClick(1.1);
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold flex items-center justify-center transition-all shadow-md active:scale-95"
                  aria-label={isPlaying ? 'Pause Side A' : 'Play Side A'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="flex flex-col font-mono text-xs">
                  <span className="font-bold text-neutral-200">
                    {isPlaying ? 'TAPE ROLLING' : 'PAUSED'}
                  </span>
                  <span className="text-neutral-500 text-[10px]">HEAD ENGAGED</span>
                </div>
              </div>

              <div className="font-mono text-xs text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                02:14 / 11:55
              </div>
            </div>
          </div>

          {/* Right Column: Track Listing & Liner Notes */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ANALOG ARCHIVE SESSIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tracking-tight">
                Physical Warmth & Mechanical Wonder
              </h2>
              <p className="mt-2 text-neutral-400 text-sm leading-relaxed">
                You navigated here by spinning the <strong>Left Reel</strong>. In physical magnetic recording, the left spool supplies tape as it travels across the magnetized iron oxide read-head, imparting natural harmonic compression and tactile character.
              </p>
            </div>

            {/* Track Items */}
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={index}
                  onClick={() => {
                    playReelClick(1.0 + index * 0.1);
                    setActiveTrack(index);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeTrack === index
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-500 w-6">
                      0{index + 1}.
                    </span>
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-neutral-200">
                        {track.title}
                      </h4>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {track.bias} • {track.freq}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>

            {/* Mixtape J-Card Liner Note */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/60 text-xs font-mono text-neutral-400 flex items-start gap-3">
              <Radio className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-200">Liner Note:</strong> Recorded directly onto chrome dioxide formulation with manual level calibration. Ready to explore the electronic opposite? Return to the cassette and spin the right reel.
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto pt-4 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-500">
        <span>DESTINATION: /left</span>
        <span>CASSETTE MOTOR: NOMINAL</span>
      </footer>
    </div>
  );
};
