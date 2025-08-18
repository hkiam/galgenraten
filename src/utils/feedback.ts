let audioCtx: AudioContext | null = null;

declare global {
  interface Window { webkitAudioContext?: typeof AudioContext }
}

function getAudioContext(): AudioContext | null {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    return audioCtx;
  } catch {
    return null;
  }
}

export function vibrate(pattern: number | number[] = 120): void {
  try {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // ignore
  }
}

export async function playBeep({
  frequency = 220,
  duration = 0.15,
  type = 'square',
  volume = 0.05,
}: { frequency?: number; duration?: number; type?: OscillatorType; volume?: number } = {}): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') await ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);
    const now = ctx.currentTime;
    // simple attack/decay envelope
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.0001, now + Math.max(0.02, duration));
    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    // ignore audio failures
  }
}

export function wrongFeedback(): void {
  vibrate([80, 40, 80]);
  void playBeep({ frequency: 180, duration: 0.18, type: 'sawtooth', volume: 0.06 });
}
