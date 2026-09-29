/**
 * Web Audio API synthesizer for child-friendly sound effects & speech feedback.
 * 100% offline - requires no external assets.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
}

export function getMuted(): boolean {
  return isMuted;
}

/**
 * Play gentle cheerful button tap
 */
export function playClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(480, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

/**
 * Success chime / star collection
 */
export function playSuccessSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + index * 0.08;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.36);
  });
}

/**
 * Jump / Hop sound (for grasshopper or caterpillar hop)
 */
export function playJumpSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.23);
}

/**
 * Munching / Feeding sound (for eating leaves or nectar)
 */
export function playMunchSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  [0, 0.1].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, ctx.currentTime + delay);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + delay + 0.07);

    gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + delay + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.08);
  });
}

/**
 * Butterfly flap / flutter sound
 */
export function playFlapSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.16);
}

/**
 * Grasshopper chirping / stridulation sound (حك الأرجل)
 */
export function playChirpSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const count = 4;
  for (let i = 0; i < count; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = ctx.currentTime + i * 0.04;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(3200 + (i % 2) * 400, time);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.035);
  }
}

/**
 * Applause and cheer sound synthesized offline!
 */
export function playApplauseSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Synthesize rhythmic clapping & noise
  const duration = 2.2;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate pinkish clap noise with envelope
  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    // Envelope: rising then decaying
    const env = Math.sin((t / duration) * Math.PI) * Math.exp(-t * 0.8);
    // Bursts of hand claps
    const clapMod = Math.sin(t * 28) > 0.3 ? 1.5 : 0.4;
    data[i] = (Math.random() * 2 - 1) * env * clapMod * 0.18;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  filter.Q.value = 1.2;

  noiseNode.connect(filter);
  filter.connect(ctx.destination);
  noiseNode.start();

  // Accompany with victory brass arpeggio
  const victoryNotes = [392, 523.25, 659.25, 783.99, 1046.5];
  victoryNotes.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const st = ctx.currentTime + 0.1 + idx * 0.12;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, st);

    g.gain.setValueAtTime(0, st);
    g.gain.linearRampToValueAtTime(0.16, st + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, st + 0.5);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(st);
    osc.stop(st + 0.55);
  });
}

/**
 * Gentle wrong/try again sound
 */
export function playTryAgainSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(260, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.26);
}

/**
 * Arabic speech encouragement
 */
export function speakArabicEncouragement(phrase?: string) {
  if (isMuted) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const phrases = [
    'أحسنت يا بطل!',
    'ممتاز! إنجاز رائع!',
    'إجابة ذكية جداً!',
    'عمل مذهل، استمر في الاستكشاف!',
    'رائع، لقد اكتشفت سراً علمياً جديداً!'
  ];

  const textToSpeak = phrase || phrases[Math.floor(Math.random() * phrases.length)];

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;
    utterance.pitch = 1.1; // Cheerful slightly higher pitch for kids
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech failure gracefully
  }
}
