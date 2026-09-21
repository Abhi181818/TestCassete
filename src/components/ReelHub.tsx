import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playReelClick } from '../utils/audio.ts';

interface ReelHubProps {
  id: string;
  side: 'left' | 'right';
  label: string;
  sublabel: string;
  isSpinning: boolean;
  isOtherSpinning: boolean;
  disabled: boolean;
  tapeSpoolRadius: number; // in pixels (e.g. 74 for left, 46 for right)
  rotationAngle: number;
  onClick: () => void;
}

export const ReelHub: React.FC<ReelHubProps> = ({
  id,
  side,
  label,
  sublabel,
  isSpinning,
  isOtherSpinning,
  disabled,
  tapeSpoolRadius,
  rotationAngle,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
      playReelClick(side === 'left' ? 1.05 : 1.15);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      id={`reel-container-${side}`}
      className="relative flex flex-col items-center select-none"
    >
      {/* Interactive reel button */}
      <button
        id={id}
        type="button"
        role="button"
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        aria-label={`${label} - ${sublabel}. Click or press Enter to spin reel and navigate.`}
        aria-pressed={isSpinning}
        aria-busy={isSpinning}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group relative flex items-center justify-center rounded-full p-0 transition-transform duration-300 outline-none
          ${disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
          focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-900
        `}
      >
        {/* Glow halo on hover or spin */}
        <div
          className={`absolute -inset-3 rounded-full transition-opacity duration-300 pointer-events-none blur-md ${
            isSpinning
              ? 'opacity-80 bg-amber-500/25 scale-110'
              : isHovered && !disabled
              ? 'opacity-60 bg-amber-400/20 scale-105'
              : 'opacity-0'
          }`}
        />

        {/* The Tape Spool & Reel SVG Engine */}
        <div
          className={`relative transition-transform duration-300 ${
            isHovered && !disabled && !isSpinning ? 'scale-[1.035]' : 'scale-100'
          }`}
        >
          <svg
            width="170"
            height="170"
            viewBox="0 0 170 170"
            className="overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
          >
            <defs>
              {/* Radial gradient for wound magnetic tape roll */}
              <radialGradient id={`tapeGrad-${side}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e1814" />
                <stop offset="55%" stopColor="#2c221a" />
                <stop offset="85%" stopColor="#1f1812" />
                <stop offset="97%" stopColor="#352920" />
                <stop offset="100%" stopColor="#120e0a" />
              </radialGradient>

              {/* Reel Hub White Plastic Gradient with depth bevel */}
              <radialGradient id={`hubGrad-${side}`} cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#f3f1ec" />
                <stop offset="80%" stopColor="#ded9cf" />
                <stop offset="100%" stopColor="#bebaaE" />
              </radialGradient>

              {/* Axle Inner Shadow */}
              <radialGradient id={`axleHoleGrad-${side}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#080706" />
                <stop offset="70%" stopColor="#12100d" />
                <stop offset="100%" stopColor="#231f1a" />
              </radialGradient>

              {/* Tooth 3D gradient */}
              <linearGradient id={`toothGrad-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8f7f4" />
                <stop offset="100%" stopColor="#cfcbc2" />
              </linearGradient>

              {/* Subtle metallic sheen filter */}
              <linearGradient id={`sheen-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
              </linearGradient>
            </defs>

            {/* 1. Outer Wound Magnetic Tape Spool Pack */}
            <circle
              cx="85"
              cy="85"
              r={tapeSpoolRadius}
              fill={`url(#tapeGrad-${side})`}
              stroke="#15110d"
              strokeWidth="2"
            />

            {/* Concentric ribbon winding lines on the tape pack */}
            <circle cx="85" cy="85" r={tapeSpoolRadius * 0.94} fill="none" stroke="#3d3025" strokeWidth="0.75" opacity="0.6" strokeDasharray="3 2" />
            <circle cx="85" cy="85" r={tapeSpoolRadius * 0.86} fill="none" stroke="#251d16" strokeWidth="0.75" opacity="0.7" />
            <circle cx="85" cy="85" r={tapeSpoolRadius * 0.76} fill="none" stroke="#4a3b2e" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 3" />
            <circle cx="85" cy="85" r={tapeSpoolRadius * 0.68} fill="none" stroke="#251d16" strokeWidth="0.5" opacity="0.7" />

            {/* 2. Rotating Reel Hub (Spins smoothly when clicked) */}
            <motion.g
              animate={{ rotate: rotationAngle }}
              transition={{
                duration: isSpinning ? 1.6 : 0.3,
                ease: isSpinning ? [0.25, 0.1, 0.25, 1] : 'easeOut',
              }}
              style={{ transformOrigin: '85px 85px' }}
            >
              {/* Outer Hub Rim Bevel */}
              <circle
                cx="85"
                cy="85"
                r="44"
                fill={`url(#hubGrad-${side})`}
                stroke="#8d877c"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
              />

              {/* Hub Outer Lip Stepped Rings */}
              <circle cx="85" cy="85" r="41" fill="none" stroke="#a39d91" strokeWidth="0.75" />
              <circle cx="85" cy="85" r="38" fill="none" stroke="#d5d0c5" strokeWidth="1" />
              <circle cx="85" cy="85" r="30" fill="none" stroke="#999387" strokeWidth="1.2" />

              {/* Tape leader clamp pin slot (classic red/orange plastic wedge) */}
              <g transform="rotate(28 85 85)">
                <rect x="119" y="82.5" width="8" height="5" rx="1.5" fill="#d93829" stroke="#8a1d12" strokeWidth="0.75" />
                <line x1="123" y1="81" x2="123" y2="89" stroke="#ffe0dc" strokeWidth="0.75" />
              </g>

              {/* Hub Mold Pin Indents / Radial ribs */}
              <circle cx="85" cy="53" r="2.2" fill="#9e988c" opacity="0.7" />
              <circle cx="113" cy="101" r="2.2" fill="#9e988c" opacity="0.7" />
              <circle cx="57" cy="101" r="2.2" fill="#9e988c" opacity="0.7" />

              {/* Center Axle Aperture / Drive Hole (Deep Dark Recess) */}
              <circle
                cx="85"
                cy="85"
                r="24"
                fill={`url(#axleHoleGrad-${side})`}
                stroke="#2b2620"
                strokeWidth="2"
              />
              <circle cx="85" cy="85" r="22.5" fill="none" stroke="#000000" strokeWidth="1" opacity="0.8" />

              {/* The 6 Authentic Gear Teeth (Sprockets) projecting into the axle hole */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 85 85)`}>
                  {/* Sprocket Tooth */}
                  <path
                    d="M 81.5 61 L 88.5 61 L 87.5 69.5 L 82.5 69.5 Z"
                    fill={`url(#toothGrad-${side})`}
                    stroke="#7a7469"
                    strokeWidth="0.75"
                  />
                  {/* Highlight bevel on tooth tip */}
                  <line x1="82" y1="69" x2="88" y2="69" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
                  {/* Shadow side */}
                  <line x1="81.5" y1="61" x2="82.5" y2="69" stroke="#5a544a" strokeWidth="0.5" />
                </g>
              ))}

              {/* Transparent plastic shine overlay across the rotating hub */}
              <ellipse cx="78" cy="74" rx="28" ry="18" fill={`url(#sheen-${side})`} opacity="0.3" transform="rotate(-30 78 74)" />
            </motion.g>

            {/* Static Drive Spindle Shaft Pin Hole (Cassette deck spindle goes through here) */}
            <circle cx="85" cy="85" r="8" fill="#050505" stroke="#1c1916" strokeWidth="1" />
          </svg>
        </div>
      </button>

      {/* Reel Status Label Pill */}
      <div className="mt-3 flex flex-col items-center text-center">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 ${
            isSpinning
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : isHovered && !disabled
              ? 'bg-neutral-800 border-amber-500/50 text-neutral-100 shadow-sm'
              : 'bg-neutral-900/80 border-neutral-700/60 text-neutral-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              isSpinning
                ? 'bg-amber-400 animate-ping'
                : isHovered && !disabled
                ? 'bg-amber-400'
                : 'bg-neutral-500'
            }`}
          />
          <span className="font-mono text-xs font-bold tracking-wider uppercase">
            {label}
          </span>
        </div>
        <span className="mt-1 font-mono text-[11px] text-neutral-400 tracking-tight">
          {isSpinning ? 'ENGAGING MOTOR...' : sublabel}
        </span>
      </div>
    </div>
  );
};
