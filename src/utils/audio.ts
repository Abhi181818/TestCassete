/**
 * Web Audio API synthesizer for realistic mechanical cassette sounds.
 * Generates tactile clicks, tape friction whirring, and deck engage latches
 * without needing external audio asset downloads.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioEnabled(): boolean {
  return soundEnabled;
}

export function toggleAudio(): boolean {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    playReelClick();
  }
  return soundEnabled;
}

/**
 * Play a subtle mechanical click when hovering or clicking a reel
 */
export function playReelClick(pitch = 1.0) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Mechanical transient pulse
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320 * pitch, now);
  osc.frequency.exponentialRampToValueAtTime(60 * pitch, now + 0.04);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1400 * pitch, now);
  filter.Q.setValueAtTime(3, now);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);

  // Micro tape head latch click
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.18, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now + 0.005);
}

/**
 * Play an authentic accelerating cassette motor whir and tape ribbon spooling sound
 */
export function playTapeSpool(duration = 1.6, direction: 'forward' | 'reverse' = 'forward') {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Motor DC hum with flutter
  const motorOsc = ctx.createOscillator();
  const motorGain = ctx.createGain();
  const motorFilter = ctx.createBiquadFilter();

  // Low hum that ramps up in pitch as spool accelerates
  motorOsc.type = 'sawtooth';
  const startFreq = direction === 'forward' ? 140 : 180;
  const peakFreq = direction === 'forward' ? 380 : 440;
  
  motorOsc.frequency.setValueAtTime(startFreq, now);
  motorOsc.frequency.linearRampToValueAtTime(peakFreq, now + duration * 0.5);
  motorOsc.frequency.exponentialRampToValueAtTime(120, now + duration);

  motorFilter.type = 'lowpass';
  motorFilter.frequency.setValueAtTime(600, now);
  motorFilter.frequency.linearRampToValueAtTime(1200, now + duration * 0.5);

  motorGain.gain.setValueAtTime(0.001, now);
  motorGain.gain.linearRampToValueAtTime(0.15, now + 0.15);
  motorGain.gain.setValueAtTime(0.15, now + duration * 0.7);
  motorGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  motorOsc.connect(motorFilter);
  motorFilter.connect(motorGain);
  motorGain.connect(ctx.destination);

  motorOsc.start(now);
  motorOsc.stop(now + duration);

  // 2. Tape friction whir (bandpassed filtered noise with flutter)
  const bufferSize = ctx.sampleRate * duration;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // White noise with periodic flutter modulation
    const flutter = Math.sin((i / ctx.sampleRate) * 24 * Math.PI) * 0.2 + 0.8;
    output[i] = (Math.random() * 2 - 1) * flutter;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const tapeFilter = ctx.createBiquadFilter();
  tapeFilter.type = 'bandpass';
  tapeFilter.frequency.setValueAtTime(1800, now);
  tapeFilter.frequency.linearRampToValueAtTime(3200, now + duration * 0.5);
  tapeFilter.Q.setValueAtTime(2.5, now);

  const tapeGain = ctx.createGain();
  tapeGain.gain.setValueAtTime(0.001, now);
  tapeGain.gain.linearRampToValueAtTime(0.12, now + 0.2);
  tapeGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  whiteNoise.connect(tapeFilter);
  tapeFilter.connect(tapeGain);
  tapeGain.connect(ctx.destination);

  whiteNoise.start(now);
  whiteNoise.stop(now + duration);

  // 3. End-of-spool mechanical latch click
  setTimeout(() => {
    playReelClick(1.2);
  }, (duration - 0.15) * 1000);
}
