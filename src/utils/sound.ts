// Playful Web Audio API music, sound effects & interactive cartoon-mouse voice reactions

let audioCtx: AudioContext | null = null;
let musicIntervalId: number | null = null;
let musicStep = 0;
let musicDesiredOn = true;
let musicUnlockListenerAttached = false;

function getAudioContext(createIfMissing = true): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
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
  } catch {
    return null;
  }
}

/* ---------- 1. Sound Effects ---------- */
export function playKawaiiSound(
  type: 'click' | 'correct' | 'wrong' | 'win',
  enabled: boolean
): void {
  if (!enabled) return;
  try {
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
      playTone(587.33, 0, 0.11, 0.085, 'sine');
      playTone(739.99, 0.08, 0.11, 0.085, 'sine');
      playTone(880, 0.16, 0.14, 0.09, 'sine');
      playTone(1174.66, 0.24, 0.22, 0.085, 'sine');
    } else if (type === 'wrong') {
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
  } catch {
    // Never let Web Audio failures interrupt UI interactions
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

/* ---------- 3. Natural Female Voice & Friendly Emotional Reactions ---------- */
export type MouseEmotion = 'greet' | 'celebrate' | 'oops' | 'thinking' | 'party';

export const MOUSE_REACTION_PHRASES: Record<MouseEmotion, string[]> = {
  greet: [
    'Olá, amiguinho! Vamos brincar e aprender juntos?',
    'Oi! Eu sou a Gatinha Mágica! Toque nas respostas para ganhar estrelas!',
    'Que bom ter você aqui comigo! Vamos jogar?',
    'Estou super animada para ver você brilhar hoje!',
  ],
  celebrate: [
    'Muito bem! Você acertou tudinho, parabéns!',
    'Que demais! Mais uma estrelinha mágica para você!',
    'Isso mesmo! Você é super inteligente!',
    'Excelente! Que resposta incrível, continue assim!',
  ],
  oops: [
    'Quase lá! Tente mais uma vez, você consegue!',
    'Foi por pouquinho! Não desista, eu estou torcendo por você!',
    'Ops, essa não era a resposta. Respire fundo e escolha outra opção!',
    'Sem problemas! Dê uma olhadinha na dica se precisar!',
  ],
  thinking: [
    'Deixa eu pensar com você! Olha só essa dica legal!',
    'Tive uma ótima ideia para te ajudar nessa questão!',
  ],
  party: [
    'Parabéns, super campeão! Você completou todos os desafios!',
    'Que conquista maravilhosa! Você brilhou muito nessa fase!',
  ],
};

export function pickRandomMousePhrase(emotion: MouseEmotion, streak = 0): string {
  if (emotion === 'celebrate' && streak >= 3) {
    return `Uau! ${streak} acertos seguidos! Você está mandando muito bem!`;
  }
  const pool = MOUSE_REACTION_PHRASES[emotion];
  return pool[Math.floor(Math.random() * pool.length)];
}

let pendingSpeechTimer: number | null = null;

function selectNaturalFemalePtVoice(): {
  voice: SpeechSynthesisVoice | undefined;
  isKnownFemale: boolean;
} {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: undefined, isKnownFemale: false };
  }
  const voices = window.speechSynthesis.getVoices();
  const ptBrVoices = voices.filter((v) => /^pt([-_]|$)/i.test(v.lang) && /br/i.test(v.lang));
  const ptVoices =
    ptBrVoices.length > 0 ? ptBrVoices : voices.filter((v) => /^pt([-_]|$)/i.test(v.lang));

  const isMaleName = (name: string) =>
    /(antonio|antônio|daniel|ricardo|felipe|fabio|fábio|pedro|joao|joão|carlos|henrique|lucas|mateus|tiago|thiago|rafael|bruno|gabriel|rodrigo|duarte|cristiano|humberto|julio|júlio|nicolau|valerio|valério|donato|eddy|reed|rocko|grandpa|masc|\bmale|male[-_]|homem)/i.test(
      name
    );

  const femaleScore = (name: string): number => {
    const n = name.toLowerCase();
    if (/francisca|thalita|camila|vitoria|vitória|heloisa|heloísa|fernanda|leticia|letícia|luciana|giovana|yara|elza|brenda/.test(n)) {
      return /natural|online|neural/.test(n) ? 100 : 85;
    }
    if (/google português|google portugues/.test(n)) return 95;
    if (/maria|ana|raquel|joana|ines|inês|catarina|isabela|juliana|mariana|paula|sofia|flo|sandy|shelley|grandma/.test(n)) {
      return 80;
    }
    if (/female|mulher|feminina|pt-br-x-afs|pt-br-x-ptd|ptd|sfb/.test(n)) {
      return 75;
    }
    return 0;
  };

  const nonMale = ptVoices.filter((v) => !isMaleName(v.name));
  const candidates = nonMale.length > 0 ? nonMale : ptVoices;

  let bestVoice: SpeechSynthesisVoice | undefined;
  let bestScore = -1;
  for (const v of candidates) {
    const score = femaleScore(v.name) + (/natural|online|neural|google/i.test(v.name) ? 5 : 0);
    if (score > bestScore) {
      bestScore = score;
      bestVoice = v;
    }
  }

  if (bestVoice && femaleScore(bestVoice.name) > 0) {
    return { voice: bestVoice, isKnownFemale: true };
  }
  if (nonMale.length > 0) {
    return { voice: nonMale[0], isKnownFemale: false };
  }
  return { voice: ptVoices[0], isKnownFemale: false };
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
  } catch {
    // ignore
  }
}

export function stopMouseVoice(): void {
  if (typeof window !== 'undefined') {
    if (pendingSpeechTimer !== null) {
      window.clearTimeout(pendingSpeechTimer);
      pendingSpeechTimer = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }
}

export function speakMouseVoice(
  text: string,
  emotion: MouseEmotion,
  enabled: boolean
): void {
  if (!enabled || typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;

  try {
    if (pendingSpeechTimer !== null) {
      window.clearTimeout(pendingSpeechTimer);
      pendingSpeechTimer = null;
    }

    const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}✨🎀⭐🌸💡🎉🏆🔥💬]/gu, '').trim();
    if (!cleanText) return;

    const wasActive = window.speechSynthesis.speaking || window.speechSynthesis.pending;
    if (wasActive) {
      window.speechSynthesis.cancel();
    }

    const speakNow = () => {
      try {
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.lang = 'pt-BR';

        const { voice, isKnownFemale } = selectNaturalFemalePtVoice();
        if (voice) utter.voice = voice;

        // Normal, clear, natural woman's voice (avoid cartoonish high pitch)
        const basePitch = isKnownFemale ? 1.0 : 1.14;
        utter.pitch =
          emotion === 'celebrate' || emotion === 'party'
            ? Math.min(1.16, basePitch + 0.03)
            : emotion === 'oops'
            ? Math.max(0.96, basePitch - 0.02)
            : basePitch;
        utter.rate =
          emotion === 'celebrate' || emotion === 'party'
            ? 1.0
            : emotion === 'oops'
            ? 0.95
            : 0.98;
        utter.volume = 0.96;

        window.speechSynthesis.speak(utter);
      } catch {
        // ignore speech errors
      }
    };

    const startAfterVoices = () => {
      if (window.speechSynthesis.getVoices().length === 0) {
        let spoken = false;
        const onVoices = () => {
          if (spoken) return;
          spoken = true;
          window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
          speakNow();
        };
        window.speechSynthesis.addEventListener('voiceschanged', onVoices);
        window.setTimeout(onVoices, 140);
      } else {
        speakNow();
      }
    };

    if (wasActive) {
      pendingSpeechTimer = window.setTimeout(() => {
        pendingSpeechTimer = null;
        startAfterVoices();
      }, 50);
    } else {
      startAfterVoices();
    }
  } catch {
    // ignore speech errors
  }
}
