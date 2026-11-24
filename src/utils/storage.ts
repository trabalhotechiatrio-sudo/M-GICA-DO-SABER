import { GradeId, MiniGameId } from '../data/curriculum';

export const PROGRESS_STORAGE_KEY = 'magica_do_saber_progress_v2';
export const LEGACY_PROGRESS_KEY = 'mundo_doce_saber_progress_v1';

export interface SavedGameSession {
  step: number;
  score: number;
  hadWrong: boolean;
  status: 'idle' | 'correct' | 'wrong';
  selectedOption: string | number | boolean | null;
  assembledTiles: number[];
  matchRound: number;
  matchedIds: string[];
  mistakes: number;
  updatedAt: number;
}

export interface AudioPrefs {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  voiceEnabled: boolean;
}

export interface StudentProgress {
  stars: number;
  points: number;
  completedGames: string[];
  bestScores: Record<string, number>;
  lastGradeId: GradeId | null;
  activeGameId: MiniGameId | null;
  gameSessions: Record<string, SavedGameSession>;
  audioPrefs: AudioPrefs;
}

export const DEFAULT_PROGRESS: StudentProgress = {
  stars: 0,
  points: 0,
  completedGames: [],
  bestScores: {},
  lastGradeId: null,
  activeGameId: null,
  gameSessions: {},
  audioPrefs: {
    musicEnabled: true,
    sfxEnabled: true,
    voiceEnabled: true,
  },
};

const VALID_GAME_IDS: MiniGameId[] = [
  'pt-quiz',
  'pt-builder',
  'pt-truefalse',
  'pt-match',
  'mat-quiz',
  'mat-match',
  'mat-missing',
  'mat-compare',
];

function sanitizeGameSession(raw: unknown): SavedGameSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Partial<SavedGameSession>;
  const step = typeof s.step === 'number' && s.step >= 0 ? Math.floor(s.step) : 0;
  const score = typeof s.score === 'number' && s.score >= 0 ? Math.floor(s.score) : 0;
  const hadWrong = Boolean(s.hadWrong);
  const status =
    s.status === 'correct' || s.status === 'wrong' || s.status === 'idle' ? s.status : 'idle';
  const selectedOption =
    typeof s.selectedOption === 'string' ||
    typeof s.selectedOption === 'number' ||
    typeof s.selectedOption === 'boolean'
      ? s.selectedOption
      : null;
  const assembledTiles = Array.isArray(s.assembledTiles)
    ? s.assembledTiles.filter((n): n is number => typeof n === 'number')
    : [];
  const matchRound = typeof s.matchRound === 'number' && s.matchRound >= 0 ? Math.floor(s.matchRound) : 0;
  const matchedIds = Array.isArray(s.matchedIds)
    ? s.matchedIds.filter((id): id is string => typeof id === 'string')
    : [];
  const mistakes = typeof s.mistakes === 'number' && s.mistakes >= 0 ? Math.floor(s.mistakes) : 0;
  const updatedAt = typeof s.updatedAt === 'number' ? s.updatedAt : Date.now();

  return {
    step,
    score,
    hadWrong,
    status,
    selectedOption,
    assembledTiles,
    matchRound,
    matchedIds,
    mistakes,
    updatedAt,
  };
}

export function loadStudentProgress(): StudentProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const raw =
      window.localStorage.getItem(PROGRESS_STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;

    const stars = typeof parsed.stars === 'number' && parsed.stars >= 0 ? parsed.stars : 0;
    const points =
      typeof parsed.points === 'number' && parsed.points >= 0 ? parsed.points : stars * 10;
    const completedGames = Array.isArray(parsed.completedGames)
      ? parsed.completedGames.filter((item): item is string => typeof item === 'string')
      : [];
    const bestScores: Record<string, number> =
      parsed.bestScores && typeof parsed.bestScores === 'object' ? parsed.bestScores : {};

    const lastGradeId: GradeId | null =
      parsed.lastGradeId === 1 ||
      parsed.lastGradeId === 2 ||
      parsed.lastGradeId === 3 ||
      parsed.lastGradeId === 4 ||
      parsed.lastGradeId === 5
        ? parsed.lastGradeId
        : null;

    const activeGameId: MiniGameId | null =
      typeof parsed.activeGameId === 'string' &&
      VALID_GAME_IDS.includes(parsed.activeGameId as MiniGameId)
        ? (parsed.activeGameId as MiniGameId)
        : null;

    const gameSessions: Record<string, SavedGameSession> = {};
    if (parsed.gameSessions && typeof parsed.gameSessions === 'object') {
      for (const [k, v] of Object.entries(parsed.gameSessions)) {
        const clean = sanitizeGameSession(v);
        if (clean) gameSessions[k] = clean;
      }
    }

    const audioPrefs: AudioPrefs = {
      musicEnabled:
        parsed.audioPrefs && typeof parsed.audioPrefs.musicEnabled === 'boolean'
          ? parsed.audioPrefs.musicEnabled
          : true,
      sfxEnabled:
        parsed.audioPrefs && typeof parsed.audioPrefs.sfxEnabled === 'boolean'
          ? parsed.audioPrefs.sfxEnabled
          : true,
      voiceEnabled:
        parsed.audioPrefs && typeof parsed.audioPrefs.voiceEnabled === 'boolean'
          ? parsed.audioPrefs.voiceEnabled
          : true,
    };

    return {
      stars,
      points,
      completedGames,
      bestScores,
      lastGradeId,
      activeGameId: lastGradeId ? activeGameId : null,
      gameSessions,
      audioPrefs,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveStudentProgress(progress: StudentProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(progress);
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
  } catch {
    // Ignora falhas de armazenamento (ex: modo privado restrito)
  }
}

export function clearStudentProgress(preserveAudioPrefs?: AudioPrefs): StudentProgress {
  const fresh: StudentProgress = {
    stars: 0,
    points: 0,
    completedGames: [],
    bestScores: {},
    lastGradeId: null,
    activeGameId: null,
    gameSessions: {},
    audioPrefs: preserveAudioPrefs ?? { musicEnabled: true, sfxEnabled: true, voiceEnabled: true },
  };
  saveStudentProgress(fresh);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
    } catch {
      // ignore
    }
  }
  return fresh;
}
