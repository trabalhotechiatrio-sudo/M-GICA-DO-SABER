// Playful Web Audio API music, sound effects & interactive cartoon-mouse voice reactions

let audioCtx: AudioContext | null = null;
let musicIntervalId: number | null = null;
let musicStep = 0;
let musicDesiredOn = true;
let musicUnlockListenerAttached = false;

function getAudioContext(createIfMissing = true): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx && createIfMissing) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/* ---------- 1. Sound Effects ---------- */
export function playKawaiiSound(
  type: 'click' | 'correct' | 'wrong' | 'win',
  enabled: boolean
): void {
  if (!enabled) return;
  const ctx = getAudioContext(true);
  if (!ctx) return;

  const now = ctx.currentTime;

  const playTone = (
    freq: number,
    startOffset: number,
    duration: number,
    gainPeak = 0.08,
    wave: OscillatorType = 'sine'
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now + startOffset);
    gain.gain.setValueAtTime(0.001, now + startOffset);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + startOffset + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + startOffset);
    osc.stop(now + startOffset + duration + 0.02);
  };

  if (type === 'click') {
    playTone(740, 0, 0.06, 0.05, 'triangle');
  } else if (type === 'correct') {
    playTone(587.33, 0, 0.11, 0.085, 'sine'); // D5
    playTone(739.99, 0.08, 0.11, 0.085, 'sine'); // F#5
    playTone(880, 0.16, 0.14, 0.09, 'sine'); // A5
    playTone(1174.66, 0.24, 0.22, 0.085, 'sine'); // D6 sparkle
  } else if (type === 'wrong') {
    // Funny gentle cartoon "boing-oops" downward glide
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.24);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  } else if (type === 'win') {
    playTone(523.25, 0, 0.12, 0.085, 'sine');
    playTone(659.25, 0.09, 0.12, 0.085, 'sine');
    playTone(783.99, 0.18, 0.12, 0.085, 'sine');
    playTone(1046.5, 0.27, 0.16, 0.095, 'sine');
    playTone(1318.51, 0.38, 0.34, 0.09, 'sine');
  }
}

/* ---------- 2. Fun, Bouncy & Non-Repetitive 64-Step Marimba Arrangement ---------- */
// 4 varied musical phrases (A - B - C - D) with breathing rests (0) so it stays fresh & joyful
const FUN_MELODY: number[] = [
  // Section A: Bouncy cheerful motif (C -> G -> Am -> F feel)
  523.25, 0, 659.25, 783.99, 0, 659.25, 880.0, 0,
  783.99, 659.25, 587.33, 0, 659.25, 0, 523.25, 0,

  // Section B: Playful skip & answer
  698.46, 0, 880.0, 783.99, 698.46, 0, 659.25, 0,
  587.33, 659.25, 698.46, 0, 783.99, 0, 0, 0,

  // Section C: Lighter glockenspiel bridge with space
  1046.5, 0, 880.0, 0, 783.99, 659.25, 698.46, 0,
  880.0, 0, 783.99, 0, 587.33, 0, 0, 0,

  // Section D: Happy syncopated turnaround
  523.25, 587.33, 659.25, 0, 783.99, 0, 1046.5, 0,
  880.0, 783.99, 659.25, 587.33, 523.25, 0, 0, 0,
];

// Soft pizzicato walking bass (gentle low warmth)
const FUN_BASS: number[] = [
  196.0, 0, 0, 0, 261.63, 0, 0, 0, 220.0, 0, 0, 0, 174.61, 0, 0, 0,
  174.61, 0, 0, 0, 261.63, 0, 0, 0, 196.0, 0, 0, 0, 196.0, 0, 246.94, 0,
  261.63, 0, 0, 0, 220.0, 0, 0, 0, 174.61, 0, 0, 0, 196.0, 0, 0, 0,
  261.63, 0, 196.0, 0, 220.0, 0, 174.61, 0, 196.0, 0, 0, 0, 261.63, 0, 0, 0,
];

// Gentle rhythmic woodblock / shaker ticks on offbeats
const FUN_PERC: number[] = [
  0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0,
];

function scheduleMusicStep(): void {
  if (!musicDesiredOn) return;
  const ctx = getAudioContext(false);
  if (!ctx || ctx.state !== 'running') return;

  const now = ctx.currentTime;
  const idx = musicStep % FUN_MELODY.length;
  musicStep += 1;

  const melodyFreq = FUN_MELODY[idx];
  const bassFreq = FUN_BASS[idx];
  const hasPerc = FUN_PERC[idx] === 1;

  if (melodyFreq > 0) {
    // Warm marimba-like sound (triangle fundamental + soft sine octave)
    const osc = ctx.createOscillator();
    const bell = ctx.createOscillator();
    const gain = ctx.createGain();
    const bellGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(melodyFreq, now);

    bell.type = 'sine';
    bell.frequency.setValueAtTime(melodyFreq * 2, now);

    gain.gain.setValueAtTime(0.0005, now);
    gain.gain.linearRampToValueAtTime(0.028, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.28);

    bellGain.gain.setValueAtTime(0.0002, now);
    bellGain.gain.linearRampToValueAtTime(0.007, now + 0.008);
    bellGain.gain.exponentialRampToValueAtTime(0.0002, now + 0.14);

    osc.connect(gain);
    bell.connect(bellGain);
    gain.connect(ctx.destination);
    bellGain.connect(ctx.destination);

    osc.start(now);
    bell.start(now);
    osc.stop(now + 0.3);
    bell.stop(now + 0.16);
  }

  if (bassFreq > 0) {
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(bassFreq, now);

    bassGain.gain.setValueAtTime(0.0005, now);
    bassGain.gain.linearRampToValueAtTime(0.022, now + 0.015);
    bassGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.34);

    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(now);
    bassOsc.stop(now + 0.36);
  }

  if (hasPerc) {
    const tick = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tick.type = 'sine';
    tick.frequency.setValueAtTime(1450, now);
    tick.frequency.exponentialRampToValueAtTime(920, now + 0.03);

    tickGain.gain.setValueAtTime(0.0005, now);
    tickGain.gain.linearRampToValueAtTime(0.008, now + 0.005);
    tickGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.045);

    tick.connect(tickGain);
    tickGain.connect(ctx.destination);
    tick.start(now);
    tick.stop(now + 0.055);
  }
}

function startMusicLoop(): void {
  if (typeof window === 'undefined') return;
  if (musicIntervalId !== null) return;
  const ctx = getAudioContext(true);
  if (!ctx) return;

  musicIntervalId = window.setInterval(() => {
    scheduleMusicStep();
  }, 225);
}

export function stopKawaiiMusic(): void {
  musicDesiredOn = false;
  if (typeof window !== 'undefined' && musicIntervalId !== null) {
    window.clearInterval(musicIntervalId);
    musicIntervalId = null;
  }
}

export function syncKawaiiMusic(enabled: boolean): void {
  musicDesiredOn = enabled;
  if (typeof window === 'undefined') return;

  if (!enabled) {
    stopKawaiiMusic();
    return;
  }

  const ctx = getAudioContext(true);
  if (ctx && ctx.state === 'running') {
    startMusicLoop();
  } else if (!musicUnlockListenerAttached) {
    musicUnlockListenerAttached = true;
    const unlock = () => {
      musicUnlockListenerAttached = false;
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      if (musicDesiredOn) {
        const c = getAudioContext(true);
        if (c) {
          c.resume()
            .then(() => {
              if (musicDesiredOn) startMusicLoop();
            })
            .catch(() => {});
        }
      }
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }
}

/* ---------- 3. Interactive Childlike Cartoon Voice & Emotional Reactions ---------- */
export type MouseEmotion = 'greet' | 'celebrate' | 'oops' | 'thinking' | 'party';

export const MOUSE_REACTION_PHRASES: Record<MouseEmotion, string[]> = {
  greet: [
    'Ihii! Oi, amiguinho! Vamos brincar e aprender juntos?',
    'Obaaa! Eu sou a Gatinha Mágica! Toque nas respostas para ganhar estrelas!',
    'Ebaaa! Que legal ter você aqui comigo! Bora jogar?',
    'Haha! Estou super animado para ver você brilhar!',
  ],
  celebrate: [
    'Ihii! Obaaa! Você acertou tudinho, amiguinho!',
    'Uauuu! Que demais! Mais uma estrelinha mágica para você!',
    'Ebaaa! Isso mesmo! Você é super inteligente, haha!',
    'Vivaaa! Que resposta incrível! Manda ver!',
  ],
  oops: [
    'Opsie! Quase, quase, amiguinho! Tenta mais uma vez!',
    'Ai ai ai, foi por pouquinho! Não desiste não, eu torço por você!',
    'Ih, escorregou! Respira fundo e escolhe outra opção!',
    'Calminha, amiguinho! Olha a dica fofinha se precisar!',
  ],
  thinking: [
    'Hmm, deixa eu pensar com você! Olha só essa dica mágica!',
    'Opa! Tive uma ideia bem legal para te ajudar!',
  ],
  party: [
    'Ebaaa! Ihii! Parabéns, super campeão! Você completou tudo!',
    'Uhuuu! Festa da gatinha! Você brilhou muito nessa fase!',
  ],
};

export function pickRandomMousePhrase(emotion: MouseEmotion, streak = 0): string {
  if (emotion === 'celebrate' && streak >= 3) {
    return `Uauuu! ${streak} acertos seguidos! Ihii, você é imbatível!`;
  }
  const pool = MOUSE_REACTION_PHRASES[emotion];
  return pool[Math.floor(Math.random() * pool.length)];
}

function playMouseVocalChirp(emotion: MouseEmotion): void {
  const ctx = getAudioContext(true);
  if (!ctx) return;
  const now = ctx.currentTime;

  const chirp = (f1: number, f2: number, start: number, dur: number, vol = 0.055) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f1, now + start);
    osc.frequency.exponentialRampToValueAtTime(f2, now + start + dur);
    gain.gain.setValueAtTime(0.001, now + start);
    gain.gain.linearRampToValueAtTime(vol, now + start + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.02);
  };

  if (emotion === 'celebrate' || emotion === 'party') {
    // Bubbly childlike "i-hi-hi!" rising giggle
    chirp(780, 1080, 0, 0.075);
    chirp(920, 1280, 0.085, 0.085);
    chirp(1080, 1520, 0.18, 0.11);
  } else if (emotion === 'oops') {
    // Cute playful cartoon "u-oh!" wobble
    chirp(760, 520, 0, 0.11, 0.05);
    chirp(580, 440, 0.12, 0.12, 0.045);
  } else if (emotion === 'thinking') {
    // Curious "hmm?"
    chirp(580, 900, 0, 0.12, 0.045);
  } else {
    // Cheerful "oi-oi!"
    chirp(740, 1040, 0, 0.075);
    chirp(880, 1260, 0.085, 0.095);
  }
}

export function stopMouseVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export function speakMouseVoice(
  text: string,
  emotion: MouseEmotion,
  enabled: boolean
): void {
  if (!enabled || typeof window === 'undefined') return;

  // Always play cute bubbly cartoon giggle/chirp
  playMouseVocalChirp(emotion);

  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}✨🎀⭐🌸💡🎉🏆]/gu, '').trim();
    if (!cleanText) return;

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'pt-BR';

    const voices = window.speechSynthesis.getVoices();
    const ptVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('pt'));
    const preferredVoice =
      ptVoices.find((v) => /google|luciana|maria|francisca|fernanda|heloisa|child|female/i.test(v.name)) ||
      ptVoices.find((v) => v.lang.toLowerCase() === 'pt-br') ||
      ptVoices[0];
    if (preferredVoice) utter.voice = preferredVoice;

    // Extra cute, lively and childlike high-pitched voice profile
    utter.pitch =
      emotion === 'celebrate' || emotion === 'party'
        ? 2.0
        : emotion === 'oops'
        ? 1.82
        : 1.95;
    utter.rate =
      emotion === 'celebrate' || emotion === 'party'
        ? 1.18
        : emotion === 'oops'
        ? 1.05
        : 1.14;
    utter.volume = 0.94;

    window.speechSynthesis.speak(utter);
  } catch {
    // Fallback already handled by Web Audio chirp
  }
}
