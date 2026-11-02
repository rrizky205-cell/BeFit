/**
 * BE FIT GYM CRM - Pure Web Audio API Sound Synthesizer
 * Zero external MP3 files; generates crystal chimes and warning buzzers natively.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Positive High-Performance Chime (Check-in ACCESS GRANTED)
 * High-pitched melodic triad arpeggio with smooth decay.
 */
export function playChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.25 }, // C5
      { freq: 659.25, time: 0.08, dur: 0.30 }, // E5
      { freq: 783.99, time: 0.16, dur: 0.35 }, // G5
      { freq: 1046.50, time: 0.24, dur: 0.50 } // C6 (Peak harmonic)
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      gain.gain.setValueAtTime(0.001, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.22, now + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });
  } catch (err) {
    console.warn('Web Audio chime could not play:', err);
  }
}

/**
 * Error / Warning Buzzer (Check-in ACCESS DENIED)
 * Low double-pulse sawtooth buzzer signaling expired or frozen status.
 */
export function playBuzzer() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pulses = [0.0, 0.16];

    pulses.forEach(pulseOffset => {
      const startTime = now + pulseOffset;
      const duration = 0.12;

      // Low fundamental
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, startTime);
      osc1.frequency.linearRampToValueAtTime(110, startTime + duration);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(148, startTime); // dissonant beating
      osc2.frequency.linearRampToValueAtTime(118, startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    });
  } catch (err) {
    console.warn('Web Audio buzzer could not play:', err);
  }
}

/**
 * UI Action Click / Tap feedback
 */
export function playClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (err) {
    // Ignore audio error on unsupported platforms
  }
}

/**
 * UI Success tone for conversions & bookings
 */
export function playSuccess() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch (err) {
    // Ignore
  }
}
