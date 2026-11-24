import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Download,
  Gamepad2,
  Mic,
  MicOff,
  Music,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GRADES, GradeId, GradeInfo, KAWAII_REWARDS, MiniGameId } from './data/curriculum';
import {
  CartoonMouseMood,
  KawaiiBowIcon,
  KawaiiCartoonMouse,
  KawaiiStarIcon,
  MASCOT_LOGO_SRC,
} from './components/KawaiiIllustrations';
import { MiniGameStage } from './components/MiniGames';
import { TrophyAlbumModal } from './components/TrophyAlbumModal';
import {
  pickRandomMousePhrase,
  playKawaiiSound,
  speakMouseVoice,
  stopKawaiiMusic,
  stopMouseVoice,
  syncKawaiiMusic,
} from './utils/sound';
import {
  clearStudentProgress,
  loadStudentProgress,
  PROGRESS_STORAGE_KEY,
  SavedGameSession,
  saveStudentProgress,
  StudentProgress,
} from './utils/storage';

function getSessionProgressLabel(gameId: MiniGameId, session?: SavedGameSession): string | null {
  if (!session) return null;
  if (gameId === 'pt-match' || gameId === 'mat-match') {
    const count = session.matchRound * 5 + session.matchedIds.length;
    if (count <= 0 && session.mistakes === 0) return null;
    return `Em andamento: ${count}/10 pares ✨`;
  }
  const answered = session.step + (session.status === 'correct' ? 1 : 0);
  if (session.step === 0 && session.status === 'idle' && session.assembledTiles.length === 0) {
    return null;
  }
  return `Em andamento: ${Math.min(10, Math.max(1, answered || 1))}/10 ✨`;
}

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => loadStudentProgress());
  const [selectedGradeId, setSelectedGradeId] = useState<GradeId | null>(
    () => loadStudentProgress().lastGradeId
  );
  const [activeGameId, setActiveGameId] = useState<MiniGameId | null>(
    () => loadStudentProgress().activeGameId
  );
  const [albumOpen, setAlbumOpen] = useState(false);
  const [heroMouseMood, setHeroMouseMood] = useState<CartoonMouseMood>('happy');
  const [heroMouseSpeech, setHeroMouseSpeech] = useState(
    'Ihii! Oi, amiguinho! Toque em mim para ouvir minha voz!'
  );

  const musicEnabled = progress.audioPrefs.musicEnabled;
  const sfxEnabled = progress.audioPrefs.sfxEnabled;
  const voiceEnabled = progress.audioPrefs.voiceEnabled;

  useEffect(() => {
    saveStudentProgress(progress);
  }, [progress]);

  useEffect(() => {
    syncKawaiiMusic(musicEnabled);
  }, [musicEnabled]);

  useEffect(() => {
    return () => {
      stopKawaiiMusic();
      stopMouseVoice();
    };
  }, []);

  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === PROGRESS_STORAGE_KEY) {
        setProgress(loadStudentProgress());
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const selectedGrade: GradeInfo | null =
    selectedGradeId !== null ? GRADES.find((g) => g.id === selectedGradeId) ?? null : null;

  const unlockedRewardsCount = KAWAII_REWARDS.filter(
    (r) => progress.stars >= r.requiredStars
  ).length;

  const updateNavigationState = (nextGradeId: GradeId | null, nextGameId: MiniGameId | null) => {
    if (!nextGameId) {
      stopMouseVoice();
    }
    setSelectedGradeId(nextGradeId);
    setActiveGameId(nextGameId);
    setProgress((prev) => {
      const next: StudentProgress = {
        ...prev,
        lastGradeId: nextGradeId,
        activeGameId: nextGameId,
      };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleToggleMusic = () => {
    const nextMusic = !musicEnabled;
    playKawaiiSound('click', sfxEnabled);
    setProgress((prev) => {
      const next: StudentProgress = {
        ...prev,
        audioPrefs: {
          ...prev.audioPrefs,
          musicEnabled: nextMusic,
        },
      };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleToggleSfx = () => {
    const nextSfx = !sfxEnabled;
    if (nextSfx) {
      playKawaiiSound('click', true);
    }
    setProgress((prev) => {
      const next: StudentProgress = {
        ...prev,
        audioPrefs: {
          ...prev.audioPrefs,
          sfxEnabled: nextSfx,
        },
      };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    playKawaiiSound('click', sfxEnabled);
    if (!nextVoice) {
      stopMouseVoice();
    } else {
      speakMouseVoice('Ihii! Oi, amiguinho! Minha voz fofinha está ligada!', 'greet', true);
    }
    setProgress((prev) => {
      const next: StudentProgress = {
        ...prev,
        audioPrefs: {
          ...prev.audioPrefs,
          voiceEnabled: nextVoice,
        },
      };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleHeroMouseTap = () => {
    playKawaiiSound('click', sfxEnabled);
    const phrase = pickRandomMousePhrase('greet');
    setHeroMouseMood((prev) => (prev === 'happy' ? 'celebrate' : 'happy'));
    setHeroMouseSpeech(phrase);
    speakMouseVoice(phrase, 'greet', voiceEnabled);
  };

  const handleSelectGrade = (gradeId: GradeId) => {
    playKawaiiSound('click', sfxEnabled);
    updateNavigationState(gradeId, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartGame = (gameId: MiniGameId) => {
    playKawaiiSound('click', sfxEnabled);
    updateNavigationState(selectedGradeId, gameId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveGameSession = (gameKey: string, session: SavedGameSession | null) => {
    setProgress((prev) => {
      const nextSessions = { ...prev.gameSessions };
      if (session === null) {
        delete nextSessions[gameKey];
      } else {
        nextSessions[gameKey] = session;
      }
      const next: StudentProgress = {
        ...prev,
        gameSessions: nextSessions,
      };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleSingleCorrect = () => {
    setProgress((prev) => {
      const next: StudentProgress = {
        ...prev,
        stars: prev.stars + 1,
        points: prev.points + 10,
      };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleCompleteGame = (gameKey: string, score: number, _total: number) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedGames.includes(gameKey);
      const nextCompleted = alreadyDone ? prev.completedGames : [...prev.completedGames, gameKey];
      const prevBest = prev.bestScores[gameKey] ?? 0;
      const nextSessions = { ...prev.gameSessions };
      delete nextSessions[gameKey];

      const next: StudentProgress = {
        ...prev,
        stars: prev.stars + 2,
        points: prev.points + 50,
        completedGames: nextCompleted,
        bestScores: {
          ...prev.bestScores,
          [gameKey]: Math.max(prevBest, score),
        },
        gameSessions: nextSessions,
      };
      saveStudentProgress(next);
      return next;
    });
  };

  const handleResetProgress = () => {
    playKawaiiSound('click', sfxEnabled);
    const fresh = clearStudentProgress(progress.audioPrefs);
    setProgress(fresh);
    setSelectedGradeId(null);
    setActiveGameId(null);
  };

  return (
    <div className="min-h-screen flex flex-col kawaii-bg-pattern text-[#3D2C3E]">
      {/* Vivid Rainbow Top Accent Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#FF5C97] via-[#FFD43B] via-[#3AD696] to-[#3DA9FC]" />

      {/* Colorful Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#FFC4DC]/95 via-[#FFE89E]/95 to-[#B8E2FF]/95 backdrop-blur-xs border-b-3 border-[#F58BB2]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Brand Logo + Title */}
          <button
            type="button"
            onClick={() => {
              playKawaiiSound('click', sfxEnabled);
              updateNavigationState(null, null);
            }}
            className="flex items-center gap-2.5 font-display text-base sm:text-xl font-bold text-[#3D2C3E] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94E7A] rounded-xl px-1"
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#F49EB6] shadow-2xs shrink-0 inline-block bg-white">
              <img
                src={MASCOT_LOGO_SRC}
                alt="Logo Mágica do Saber"
                className="w-full h-full object-cover object-[50%_38%] scale-110"
              />
            </span>
            <span>Mágica do Saber</span>
          </button>

          {/* Zone 2: Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#5C475E]">
            <button
              type="button"
              onClick={() => {
                playKawaiiSound('click', sfxEnabled);
                updateNavigationState(null, null);
              }}
              className="hover:text-[#C93B6B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Séries
            </button>
            <button
              type="button"
              onClick={() => {
                playKawaiiSound('click', sfxEnabled);
                const targetGrade = selectedGradeId ?? 1;
                updateNavigationState(targetGrade, null);
              }}
              className="hover:text-[#C93B6B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Matérias
            </button>
            <button
              type="button"
              onClick={() => {
                playKawaiiSound('click', sfxEnabled);
                setAlbumOpen(true);
              }}
              className="hover:text-[#C93B6B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Meus Lacinhos
            </button>
          </nav>

          {/* Zone 3: Separate Music, SFX & Voice Controls + Star Counter */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleMusic}
              aria-label={musicEnabled ? 'Desligar música de fundo' : 'Ligar música de fundo'}
              title={musicEnabled ? 'Desligar música' : 'Ligar música'}
              className={`kawaii-btn inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border-2 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                musicEnabled
                  ? 'bg-[#E5D4FF] hover:bg-[#D7BFFF] border-[#C1A1FA] text-[#532B94]'
                  : 'bg-white hover:bg-[#F7F2F5] border-[#DFD2D9] text-[#7D687E]'
              }`}
            >
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">{musicEnabled ? 'Música On' : 'Música Off'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSfx}
              aria-label={sfxEnabled ? 'Desligar efeitos sonoros' : 'Ligar efeitos sonoros'}
              title={sfxEnabled ? 'Desligar efeitos sonoros' : 'Ligar efeitos sonoros'}
              className={`kawaii-btn inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border-2 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                sfxEnabled
                  ? 'bg-[#C2E7FF] hover:bg-[#A6DAFC] border-[#86CBFA] text-[#16588E]'
                  : 'bg-white hover:bg-[#F7F2F5] border-[#DFD2D9] text-[#7D687E]'
              }`}
            >
              {sfxEnabled ? (
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden md:inline">{sfxEnabled ? 'Efeitos On' : 'Efeitos Off'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleVoice}
              aria-label={voiceEnabled ? 'Desligar voz do amiguinho' : 'Ligar voz do amiguinho'}
              title={voiceEnabled ? 'Desligar voz do amiguinho' : 'Ligar voz do amiguinho'}
              className={`kawaii-btn inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border-2 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                voiceEnabled
                  ? 'bg-[#FFF4BD] hover:bg-[#FCEB9C] border-[#F0D15A] text-[#6E5104]'
                  : 'bg-white hover:bg-[#F7F2F5] border-[#DFD2D9] text-[#7D687E]'
              }`}
            >
              {voiceEnabled ? (
                <Mic className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <MicOff className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden md:inline">{voiceEnabled ? 'Voz On' : 'Voz Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playKawaiiSound('click', sfxEnabled);
                setAlbumOpen(true);
              }}
              className="kawaii-btn inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#FFD6E0] hover:bg-[#FFC2D1] border-2 border-[#F49EB6] text-[#8F2449] font-extrabold text-xs sm:text-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <KawaiiStarIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="tabular-nums">
                {progress.stars} ★ · {progress.points} pts
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* VIEW 1: TELA INICIAL / SELEÇÃO DE SÉRIES (1º AO 5º ANO) */}
        {!selectedGrade && (
          <div className="space-y-10 animate-pop-in">
            {/* Hero Welcome Section — Vivid Candy Rainbow */}
            <section className="relative rounded-3xl bg-gradient-to-br from-[#FF9EC6] via-[#FFE27A] via-[#90ECC3] to-[#8AD3FF] border-4 border-white p-6 sm:p-10 shadow-lg overflow-hidden">
              {/* Decorative colorful circles */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[#B996FF]/65" />
              <div className="pointer-events-none absolute -bottom-10 left-1/3 w-32 h-32 rounded-full bg-[#68E3B0]/65" />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-2 border-[#F7B4C6] text-xs sm:text-sm font-extrabold text-[#C93B6B] shadow-2xs">
                    <span>🌈 Ensino Fundamental 1 · 1º ao 5º Ano</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#3D2C3E] leading-tight">
                    Bem-vindo à <span className="text-[#C93B6B]">Mágica do Saber</span>! ✨
                  </h1>
                  <p className="text-base sm:text-lg font-bold text-[#4D3B4F] max-w-2xl leading-relaxed">
                    Escolha a sua série para brincar em jogos super coloridos de Português e Matemática,
                    ganhar estrelinhas e guardar todo o seu progresso automaticamente!
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        playKawaiiSound('click', sfxEnabled);
                        document
                          .getElementById('grade-cards-section')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="kawaii-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-base shadow-sm cursor-pointer"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      <span>Escolher Minha Série</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playKawaiiSound('click', sfxEnabled);
                        setAlbumOpen(true);
                      }}
                      className="kawaii-btn inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFF4BD] hover:bg-[#FCEB9C] border-2 border-[#F0D15A] text-[#6E5104] font-extrabold text-base cursor-pointer"
                    >
                      <Trophy className="w-5 h-5 text-[#C98A00]" />
                      <span>
                        Meus Lacinhos ({unlockedRewardsCount}/{KAWAII_REWARDS.length})
                      </span>
                    </button>
                  </div>
                </div>

                {/* Interactive Cartoon Mouse Mascot */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={handleHeroMouseTap}
                    title="Toque para ouvir o amiguinho!"
                    className="group animate-float-slow flex flex-col items-center cursor-pointer focus-visible:outline-none"
                  >
                    <div className="rounded-full bg-white/85 group-hover:bg-white p-3.5 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                      <KawaiiCartoonMouse mood={heroMouseMood} className="w-32 h-32 sm:w-40 sm:h-40" />
                    </div>
                    <span className="mt-2.5 max-w-[260px] text-center text-xs font-extrabold text-[#8F2449] bg-[#FFD6E0] group-hover:bg-[#FFC2D1] px-4 py-1.5 rounded-2xl border-2 border-[#F49EB6] shadow-2xs">
                      💬 “{heroMouseSpeech}”
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Grade Selection Grid (Strictly 1º ao 5º Ano) */}
            <section id="grade-cards-section" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D2C3E]">
                    🌟 Escolha a sua série
                  </h2>
                  <p className="text-sm font-bold text-[#6E5670]">
                    Atividades coloridas e divertidas do 1º ao 5º ano do Ensino Fundamental 1.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {GRADES.map((grade) => {
                  const gradeDoneCount = progress.completedGames.filter((k) =>
                    k.startsWith(`${grade.id}-`)
                  ).length;
                  const gradePct = (gradeDoneCount / 8) * 100;

                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => handleSelectGrade(grade.id)}
                      style={{
                        backgroundColor: grade.cardBg,
                        borderColor: grade.cardBorder,
                      }}
                      className="kawaii-card text-left rounded-3xl border-3 p-5 flex flex-col justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD6E0]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            style={{
                              backgroundColor: grade.accentBg,
                              color: grade.accentText,
                            }}
                            className="font-display text-xl font-bold px-3.5 py-1 rounded-full border-2 border-white shadow-2xs"
                          >
                            {grade.title}
                          </span>
                          <KawaiiBowIcon className="w-8 h-6" color="#FFFDF9" />
                        </div>

                        <h3 className="font-display text-lg font-bold text-[#3D2C3E] leading-snug">
                          {grade.subtitle}
                        </h3>

                        <p className="text-xs font-extrabold text-[#5C475E]">
                          🎨 8 mini-jogos divertidos
                        </p>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t-2 border-white/60">
                        <div className="h-2.5 w-full rounded-full bg-white/80 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(gradeDoneCount > 0 ? 12 : 0, gradePct)}%`,
                              backgroundColor: grade.accentText,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#3D2C3E] tabular-nums">
                            {gradeDoneCount}/8 fases
                          </span>
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white text-[#3D2C3E] text-xs font-extrabold shadow-2xs">
                            Entrar →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ESCOLHA DE MATÉRIAS POR SÉRIE */}
        {selectedGrade && !activeGameId && (
          <div className="space-y-8 animate-pop-in">
            {/* Back & Grade Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  playKawaiiSound('click', sfxEnabled);
                  updateNavigationState(null, null);
                }}
                className="kawaii-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#FFF0F4] border-2 border-[#F4C4D4] text-[#3D2C3E] font-extrabold text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar às Séries</span>
              </button>

              {/* Quick Grade Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-full border-2 border-[#F2D6E0] shadow-2xs">
                {GRADES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelectGrade(g.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                      g.id === selectedGrade.id
                        ? 'bg-[#D94E7A] text-white'
                        : 'text-[#5C475E] hover:bg-[#FFF0F4]'
                    }`}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Banner */}
            <div
              style={{
                backgroundColor: selectedGrade.cardBg,
                borderColor: selectedGrade.cardBorder,
              }}
              className="rounded-3xl border-3 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
            >
              <div className="space-y-2 text-center sm:text-left">
                <p
                  style={{ color: selectedGrade.accentText }}
                  className="text-sm font-extrabold inline-block bg-white/85 px-3 py-1 rounded-full"
                >
                  ✨ Ensino Fundamental 1 · Guia: {selectedGrade.mascotName}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3D2C3E]">
                  {selectedGrade.title} — {selectedGrade.subtitle}
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#4D3B4F]">
                  Escolha um dos 4 jogos de Português ou Matemática. Seu progresso dentro de cada jogo é salvo automaticamente!
                </p>
              </div>
              <div className="rounded-full bg-white/80 p-2 border-2 border-white shrink-0 shadow-2xs">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#F49EB6] bg-white">
                  <img
                    src={MASCOT_LOGO_SRC}
                    alt="Gatinha Mágica"
                    className="w-full h-full object-cover object-center scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Two Subject Sections: Português & Matemática */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PORTUGUÊS */}
              <section className="bg-gradient-to-b from-[#FFC4DC] to-[#FFE6F0] rounded-3xl border-3 border-[#E84D8A] p-6 sm:p-7 shadow-md flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF8FB8] border-2 border-white flex items-center justify-center shrink-0 shadow-2xs">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D2C3E]">
                        Português 🎀
                      </h2>
                      <p className="text-xs sm:text-sm font-bold text-[#5C3A5E]">
                        {selectedGrade.ptTopics.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-[#4D324F]">
                    Explore letras, sílabas, leitura e ortografia com desafios coloridos do{' '}
                    {selectedGrade.title}.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'pt-quiz' as MiniGameId,
                      emoji: '🎀',
                      title: '1. Quiz de Português',
                      desc: 'Múltipla escolha · 10 perguntas',
                      cardClass: 'bg-[#FFB5D0] hover:bg-[#FF9EC2] border-[#E84D8A]',
                      btnClass: 'bg-[#D93873]',
                    },
                    {
                      id: 'pt-builder' as MiniGameId,
                      emoji: '🧁',
                      title: '2. Complete a Palavra',
                      desc: 'Letras, sílabas ou frases · 10 desafios',
                      cardClass: 'bg-[#D7BFFF] hover:bg-[#C6A4FF] border-[#8548E8]',
                      btnClass: 'bg-[#6F38DC]',
                    },
                    {
                      id: 'pt-truefalse' as MiniGameId,
                      emoji: '🌸',
                      title: '3. Certo ou Errado',
                      desc: 'Descubra se a frase está certa · 10 desafios',
                      cardClass: 'bg-[#A6F2D0] hover:bg-[#8AEBC0] border-[#19A86A]',
                      btnClass: 'bg-[#158754]',
                    },
                    {
                      id: 'pt-match' as MiniGameId,
                      emoji: '✨',
                      title: '4. Ligue as Palavras',
                      desc: 'Encontre os pares certos · 10 desafios',
                      cardClass: 'bg-[#FFE785] hover:bg-[#FFDD59] border-[#E59F00]',
                      btnClass: 'bg-[#C47E00]',
                    },
                  ].map((item) => {
                    const key = `${selectedGrade.id}-${item.id}`;
                    const done = progress.completedGames.includes(key);
                    const best = progress.bestScores[key];
                    const inProgressLabel = getSessionProgressLabel(
                      item.id,
                      progress.gameSessions[key]
                    );

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleStartGame(item.id)}
                        className={`kawaii-btn w-full p-4 rounded-3xl border-2 flex items-center justify-between gap-4 text-left cursor-pointer ${item.cardClass}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl select-none shrink-0" aria-hidden="true">
                            {item.emoji}
                          </span>
                          <div className="min-w-0">
                            <p className="font-display text-lg font-bold text-[#3D2C3E] truncate">
                              {item.title}
                            </p>
                            <p className="text-xs font-bold text-[#6E5670]">
                              {item.desc}
                              {inProgressLabel && (
                                <span className="text-[#7C4DFF] font-extrabold">
                                  {' '}
                                  · {inProgressLabel}
                                </span>
                              )}
                              {!inProgressLabel && done && (
                                <span className="text-[#146B48] font-extrabold">
                                  {' '}
                                  · Concluído ✓{best !== undefined ? ` (Recorde ${best}/10)` : ''}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-white text-xs font-extrabold whitespace-nowrap shrink-0 ${item.btnClass}`}
                        >
                          {inProgressLabel ? 'Continuar' : done ? 'Rejogar' : 'Jogar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* MATEMÁTICA */}
              <section className="bg-gradient-to-b from-[#A8DEFF] to-[#DCF1FF] rounded-3xl border-3 border-[#1F90E0] p-6 sm:p-7 shadow-md flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#5BB9FF] border-2 border-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Calculator className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D2C3E]">
                        Matemática ⭐
                      </h2>
                      <p className="text-xs sm:text-sm font-bold text-[#2C4B6E]">
                        {selectedGrade.matTopics.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-[#2A3F59]">
                    Pratique cálculos, contagem, formas e raciocínio lógico no nível do{' '}
                    {selectedGrade.title}.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'mat-quiz' as MiniGameId,
                      emoji: '⭐',
                      title: '1. Quiz de Matemática',
                      desc: 'Múltipla escolha visual · 10 perguntas',
                      cardClass: 'bg-[#FFE785] hover:bg-[#FFDD59] border-[#E59F00]',
                      btnClass: 'bg-[#C47E00]',
                    },
                    {
                      id: 'mat-match' as MiniGameId,
                      emoji: '🍬',
                      title: '2. Ligue as Contas',
                      desc: 'Ligue a conta ao resultado · 10 desafios',
                      cardClass: 'bg-[#A6DCFF] hover:bg-[#8AD4FF] border-[#1F90E0]',
                      btnClass: 'bg-[#1273C4]',
                    },
                    {
                      id: 'mat-missing' as MiniGameId,
                      emoji: '🍓',
                      title: '3. Complete a Conta',
                      desc: 'Ache o número que falta · 10 desafios',
                      cardClass: 'bg-[#FFB5D0] hover:bg-[#FF9EC2] border-[#E84D8A]',
                      btnClass: 'bg-[#D93873]',
                    },
                    {
                      id: 'mat-compare' as MiniGameId,
                      emoji: '⚖️',
                      title: '4. Maior ou Menor',
                      desc: 'Compare os dois lados · 10 desafios',
                      cardClass: 'bg-[#D7BFFF] hover:bg-[#C6A4FF] border-[#8548E8]',
                      btnClass: 'bg-[#6F38DC]',
                    },
                  ].map((item) => {
                    const key = `${selectedGrade.id}-${item.id}`;
                    const done = progress.completedGames.includes(key);
                    const best = progress.bestScores[key];
                    const inProgressLabel = getSessionProgressLabel(
                      item.id,
                      progress.gameSessions[key]
                    );

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleStartGame(item.id)}
                        className={`kawaii-btn w-full p-4 rounded-3xl border-2 flex items-center justify-between gap-4 text-left cursor-pointer ${item.cardClass}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl select-none shrink-0" aria-hidden="true">
                            {item.emoji}
                          </span>
                          <div className="min-w-0">
                            <p className="font-display text-lg font-bold text-[#3D2C3E] truncate">
                              {item.title}
                            </p>
                            <p className="text-xs font-bold text-[#6E5670]">
                              {item.desc}
                              {inProgressLabel && (
                                <span className="text-[#7C4DFF] font-extrabold">
                                  {' '}
                                  · {inProgressLabel}
                                </span>
                              )}
                              {!inProgressLabel && done && (
                                <span className="text-[#146B48] font-extrabold">
                                  {' '}
                                  · Concluído ✓{best !== undefined ? ` (Recorde ${best}/10)` : ''}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-white text-xs font-extrabold whitespace-nowrap shrink-0 ${item.btnClass}`}
                        >
                          {inProgressLabel ? 'Continuar' : done ? 'Rejogar' : 'Jogar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* VIEW 3: MINI-JOGO ATIVO */}
        {selectedGrade && activeGameId && (
          <MiniGameStage
            grade={selectedGrade}
            gameId={activeGameId}
            soundEnabled={sfxEnabled}
            voiceEnabled={voiceEnabled}
            initialSession={progress.gameSessions[`${selectedGrade.id}-${activeGameId}`]}
            onSaveSession={handleSaveGameSession}
            onSingleCorrect={handleSingleCorrect}
            onCompleteGame={handleCompleteGame}
            onBackToSubject={() => updateNavigationState(selectedGrade.id, null)}
          />
        )}
      </main>

      {/* Colorful Rainbow Footer */}
      <footer className="border-t-3 border-[#F58BB2] bg-gradient-to-r from-[#FFC4DC] via-[#FFE89E] to-[#B8E2FF] py-6 px-4 sm:px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-extrabold text-[#3D2C3E]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D94E7A]" />
            <span>Mágica do Saber · Ensino Fundamental 1 (1º ao 5º Ano)</span>
          </div>

          <a
            href="/mundo-doce-do-saber.html"
            download="magica-do-saber.html"
            className="kawaii-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF0F6] hover:bg-[#FFD6E0] border-2 border-[#F4B8CC] text-[#3D2C3E] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#D94E7A]" />
            <span>Baixar Versão HTML Único (Tailwind CDN)</span>
          </a>
        </div>
      </footer>

      {/* Trophy & Ribbon Collection Modal */}
      <TrophyAlbumModal
        open={albumOpen}
        stars={progress.stars}
        points={progress.points}
        completedGames={progress.completedGames}
        onClose={() => setAlbumOpen(false)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
