import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isAudioEnabled, toggleAudio } from '../utils/audio.ts';

export const AudioToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(isAudioEnabled);

  const handleToggle = () => {
    const next = toggleAudio();
    setEnabled(next);
  };

  return (
    <button
      id="audio-toggle-btn"
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? 'Mute mechanical tape sound effects' : 'Unmute mechanical tape sound effects'}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-all text-xs font-mono focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
    >
      {enabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>AUDIO FX: <strong className="text-amber-400 font-bold">ON</strong></span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
          <span>AUDIO FX: <span className="text-neutral-500">MUTED</span></span>
        </>
      )}
    </button>
  );
};
