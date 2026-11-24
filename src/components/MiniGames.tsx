import React, { useMemo, useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Check,
  X,
  Volume2,
} from 'lucide-react';
import {
  GradeInfo,
  MatchPair,
  MathCompareChallenge,
  MathMissingChallenge,
  MiniGameId,
  QuizQuestion,
  TrueFalseChallenge,
  WordBuilderChallenge,
} from '../data/curriculum';
import {
  CartoonMouseMood,
  ConfettiBurst,
  KawaiiBowIcon,
  KawaiiCartoonMouse,
  KawaiiStarIcon,
} from './KawaiiIllustrations';
import {
  MouseEmotion,
  pickRandomMousePhrase,
  playKawaiiSound,
  speakMouseVoice,
  stopMouseVoice,
} from '../utils/sound';
import { SavedGameSession } from '../utils/storage';

interface MiniGameProps {
  grade: GradeInfo;
  gameId: MiniGameId;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  initialSession?: SavedGameSession;
  onSaveSession: (gameKey: string, session: SavedGameSession | null) => void;
  onSingleCorrect: () => void;
  onCompleteGame: (gameKey: string, score: number, total: number) => void;
  onBackToSubject: () => void;
}

const GAME_META: Record<MiniGameId, { title: string; badgeBg: string; barColor: string; cardBorder: string }> = {
  'pt-quiz': { title: 'Quiz de Português', badgeBg: '#FF9EC2', barColor: '#E84D8A', cardBorder: '#E84D8A' },
  'pt-builder': { title: 'Complete a Palavra', badgeBg: '#C4A1FF', barColor: '#8548E8', cardBorder: '#8548E8' },
  'pt-truefalse': { title: 'Certo ou Errado', badgeBg: '#8AEBC0', barColor: '#19A86A', cardBorder: '#19A86A' },
  'pt-match': { title: 'Ligue as Palavras', badgeBg: '#FFE066', barColor: '#E59F00', cardBorder: '#E59F00' },
  'mat-quiz': { title: 'Quiz de Matemática', badgeBg: '#FFE066', barColor: '#E59F00', cardBorder: '#E59F00' },
  'mat-match': { title: 'Ligue as Contas', badgeBg: '#8AD4FF', barColor: '#1F90E0', cardBorder: '#1F90E0' },
  'mat-missing': { title: 'Complete a Conta', badgeBg: '#FF9EC2', barColor: '#E84D8A', cardBorder: '#E84D8A' },
  'mat-compare': { title: 'Maior ou Menor', badgeBg: '#C4A1FF', barColor: '#8548E8', cardBorder: '#8548E8' },
};

const OPTION_BADGE_COLORS = [
  'bg-[#FF9EC2] border-[#E84D8A] text-[#6B0E34]',
  'bg-[#8AD4FF] border-[#1F90E0] text-[#0D4A7A]',
  'bg-[#FFE066] border-[#E59F00] text-[#5C3D00]',
  'bg-[#8AEBC0] border-[#19A86A] text-[#0B5536]',
];

function makeSession(partial: Partial<SavedGameSession>): SavedGameSession {
  return {
    step: 0,
    score: 0,
    hadWrong: false,
    status: 'idle',
    selectedOption: null,
    assembledTiles: [],
    matchRound: 0,
    matchedIds: [],
    mistakes: 0,
    updatedAt: Date.now(),
    ...partial,
  };
}

/* ---------- 1. QUIZ ENGINE (Quiz de Português & Quiz de Matemática) ---------- */
const QuizGame: React.FC<{
  questions: QuizQuestion[];
  barColor: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  initialSession?: SavedGameSession;
  onSaveSession: (session: SavedGameSession) => void;
  onReact: (emotion: MouseEmotion, customText?: string) => void;
  onComplete: (score: number, total: number) => void;
  onSingleCorrect: () => void;
}> = ({
  questions,
  barColor,
  soundEnabled,
  voiceEnabled,
  initialSession,
  onSaveSession,
  onReact,
  onComplete,
  onSingleCorrect,
}) => {
  const safeInitStep =
    initialSession && initialSession.step < questions.length ? initialSession.step : 0;

  const [index, setIndex] = useState(safeInitStep);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    typeof initialSession?.selectedOption === 'number' ? initialSession.selectedOption : null
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(
    initialSession?.status ?? 'idle'
  );
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(initialSession?.score ?? 0);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(initialSession?.hadWrong ?? false);
  const [confetti, setConfetti] = useState(false);

  const current = questions[index];
  const progressPct = ((index + (status === 'correct' ? 1 : 0)) / questions.length) * 100;

  const handleOptionClick = (optIdx: number) => {
    if (status === 'correct') return;
    setSelectedIdx(optIdx);

    if (optIdx === current.correctIndex) {
      const nextScore = !hadWrongAttempt ? score + 1 : score;
      setStatus('correct');
      setScore(nextScore);
      playKawaiiSound('correct', soundEnabled);
      onReact('celebrate');
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1100);
      onSaveSession(
        makeSession({
          step: index,
          score: nextScore,
          hadWrong: hadWrongAttempt,
          status: 'correct',
          selectedOption: optIdx,
        })
      );
      onSingleCorrect();
    } else {
      setStatus('wrong');
      setHadWrongAttempt(true);
      playKawaiiSound('wrong', soundEnabled);
      onReact('oops');
      onSaveSession(
        makeSession({
          step: index,
          score,
          hadWrong: true,
          status: 'wrong',
          selectedOption: optIdx,
        })
      );
    }
  };

  const handleNext = () => {
    playKawaiiSound('click', soundEnabled);
    if (index + 1 < questions.length) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setSelectedIdx(null);
      setStatus('idle');
      setShowHint(false);
      setHadWrongAttempt(false);
      onSaveSession(
        makeSession({
          step: nextIndex,
          score,
          hadWrong: false,
          status: 'idle',
          selectedOption: null,
        })
      );
    } else {
      onComplete(score, questions.length);
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiBurst active={confetti} />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-[#5C475E]">
          <span>Progresso da Fase ✨</span>
          <span className="tabular-nums bg-white px-3 py-0.5 rounded-full border border-[#F2D6E0]">
            Pergunta {index + 1} de {questions.length}
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-white overflow-hidden border-2 border-[#F2D6E0] shadow-2xs">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPct)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#FFD4E5] via-[#FFF0F6] to-[#FFE7B3] rounded-3xl border-3 border-[#E84D8A] p-6 sm:p-8 shadow-md space-y-5">
        {current.readingPassage && (
          <div className="bg-[#FFF6CC] border-2 border-[#F2D15B] rounded-2xl p-4 sm:p-5 text-base sm:text-lg leading-relaxed text-[#3D2C3E] font-semibold">
            {current.readingPassage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {current.visualEmoji && (
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#FFF4BD] border-2 border-[#F2D15B] flex items-center justify-center text-3xl select-none shadow-2xs">
                {current.visualEmoji}
              </div>
            )}
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#3D2C3E] leading-snug">
              {current.prompt}
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              speakMouseVoice(
                `${current.readingPassage ? current.readingPassage + '. ' : ''}${current.prompt}`,
                'greet',
                voiceEnabled
              )
            }
            className="kawaii-btn self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#C2E7FF] hover:bg-[#A6DAFC] border-2 border-[#86CBFA] text-[#16588E] text-xs font-extrabold cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir</span>
          </button>
        </div>

        {current.visualCount && (
          <div className="flex flex-wrap items-center justify-center gap-3 bg-[#FFFDF9] border-2 border-dashed border-[#F49EB6] rounded-2xl p-4">
            {Array.from({ length: current.visualCount.count }).map((_, i) => (
              <span key={i} className="text-3xl sm:text-4xl animate-pop-in select-none">
                {current.visualCount?.emoji}
              </span>
            ))}
          </div>
        )}

        {current.visualFraction && (
          <div className="bg-[#FFFDF9] border-2 border-[#C7A9F7] rounded-2xl p-5 flex flex-col items-center gap-2">
            <div className="flex w-full max-w-md h-12 rounded-2xl overflow-hidden border-2 border-[#3D2C3E]">
              {Array.from({ length: current.visualFraction.denominator }).map((_, idx) => {
                const filled = idx < (current.visualFraction?.numerator ?? 0);
                return (
                  <div
                    key={idx}
                    className={`flex-1 border-r last:border-r-0 border-[#3D2C3E] transition-colors ${
                      filled ? 'bg-[#FF8FB1]' : 'bg-white'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-xs font-bold text-[#6E5670]">
              Observe os quadradinhos coloridos de rosa!
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {current.options.map((option, optIdx) => {
            const isSelected = selectedIdx === optIdx;
            const isCorrectOption = optIdx === current.correctIndex;
            let btnStyle =
              'bg-[#FFF4F8] border-[#F49EB6] text-[#3D2C3E] hover:bg-[#FFD6E6] hover:border-[#E84D8A]';

            if (status === 'correct' && isCorrectOption) {
              btnStyle = 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C] ring-3 ring-[#8FE3BC]';
            } else if (status === 'wrong' && isSelected) {
              btnStyle = 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B] animate-wobble';
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleOptionClick(optIdx)}
                className={`kawaii-btn min-h-[56px] px-5 py-3.5 rounded-full border-2 font-bold text-base sm:text-lg text-left flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD6E0] ${btnStyle}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center text-sm font-extrabold ${
                      OPTION_BADGE_COLORS[optIdx % OPTION_BADGE_COLORS.length]
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </span>
                {status === 'correct' && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-[#115E3C] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="min-h-[44px] flex items-center">
            {status === 'correct' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D4F8E8] border-2 border-[#7ED9B2] text-[#146B48] font-extrabold text-base">
                <span>Muito bem! ✨🎀</span>
              </div>
            )}
            {status === 'wrong' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF0F4] border-2 border-[#F7B4C6] text-[#9C2D54] font-bold text-base">
                <span>Quase lá, tente de novo! 🌸</span>
              </div>
            )}
            {status === 'idle' && (
              <button
                type="button"
                onClick={() => {
                  playKawaiiSound('click', soundEnabled);
                  const nextShow = !showHint;
                  setShowHint(nextShow);
                  if (nextShow) onReact('thinking', `Dica: ${current.hint}`);
                }}
                className="kawaii-btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF4BD] hover:bg-[#FCEB9C] border-2 border-[#F0D15A] text-[#6E5104] text-sm font-extrabold cursor-pointer transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Esconder Dica' : 'Preciso de uma Dica'}</span>
              </button>
            )}
          </div>

          {status === 'correct' && (
            <button
              type="button"
              onClick={handleNext}
              className="kawaii-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-base shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{index + 1 < questions.length ? 'Próxima Pergunta' : 'Ver Resultado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showHint && status !== 'correct' && (
          <div className="animate-pop-in rounded-2xl bg-[#FFFBE6] border-2 border-[#F5DF7D] px-4 py-3 text-sm font-semibold text-[#6E5104]">
            💡 Dica mágica: {current.hint}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 2. COMPLETE A PALAVRA (Português) ---------- */
const WordBuilderGame: React.FC<{
  challenges: WordBuilderChallenge[];
  barColor: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  initialSession?: SavedGameSession;
  onSaveSession: (session: SavedGameSession) => void;
  onReact: (emotion: MouseEmotion, customText?: string) => void;
  onComplete: (score: number, total: number) => void;
  onSingleCorrect: () => void;
}> = ({
  challenges,
  barColor,
  soundEnabled,
  voiceEnabled,
  initialSession,
  onSaveSession,
  onReact,
  onComplete,
  onSingleCorrect,
}) => {
  const safeInitStep =
    initialSession && initialSession.step < challenges.length ? initialSession.step : 0;

  const [index, setIndex] = useState(safeInitStep);
  const [selectedMissing, setSelectedMissing] = useState<string | null>(
    typeof initialSession?.selectedOption === 'string' ? initialSession.selectedOption : null
  );
  const [assembledTiles, setAssembledTiles] = useState<number[]>(
    initialSession?.assembledTiles ?? []
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(
    initialSession?.status ?? 'idle'
  );
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(initialSession?.score ?? 0);
  const [hadWrong, setHadWrong] = useState(initialSession?.hadWrong ?? false);
  const [confetti, setConfetti] = useState(false);

  const current = challenges[index];
  const progressPct = ((index + (status === 'correct' ? 1 : 0)) / challenges.length) * 100;

  const handleMissingPick = (tile: string) => {
    if (status === 'correct') return;
    setSelectedMissing(tile);
    if (tile === current.answer) {
      const nextScore = !hadWrong ? score + 1 : score;
      setStatus('correct');
      setScore(nextScore);
      playKawaiiSound('correct', soundEnabled);
      onReact('celebrate');
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1100);
      onSaveSession(
        makeSession({
          step: index,
          score: nextScore,
          hadWrong,
          status: 'correct',
          selectedOption: tile,
        })
      );
      onSingleCorrect();
    } else {
      setStatus('wrong');
      setHadWrong(true);
      playKawaiiSound('wrong', soundEnabled);
      onReact('oops');
      onSaveSession(
        makeSession({
          step: index,
          score,
          hadWrong: true,
          status: 'wrong',
          selectedOption: tile,
        })
      );
    }
  };

  const handleSyllablePick = (tileIdx: number) => {
    if (status === 'correct') return;
    if (assembledTiles.includes(tileIdx)) return;

    const next = [...assembledTiles, tileIdx];
    setAssembledTiles(next);
    playKawaiiSound('click', soundEnabled);

    const targetLen = current.targetSyllables?.length ?? 0;
    if (next.length === targetLen) {
      const formed = next.map((i) => current.tiles[i]).join('');
      if (formed === current.answer) {
        const nextScore = !hadWrong ? score + 1 : score;
        setStatus('correct');
        setScore(nextScore);
        playKawaiiSound('correct', soundEnabled);
        onReact('celebrate');
        setConfetti(true);
        setTimeout(() => setConfetti(false), 1100);
        onSaveSession(
          makeSession({
            step: index,
            score: nextScore,
            hadWrong,
            status: 'correct',
            assembledTiles: next,
          })
        );
        onSingleCorrect();
      } else {
        setStatus('wrong');
        setHadWrong(true);
        playKawaiiSound('wrong', soundEnabled);
        onReact('oops');
        onSaveSession(
          makeSession({
            step: index,
            score,
            hadWrong: true,
            status: 'wrong',
            assembledTiles: next,
          })
        );
      }
    } else {
      setStatus('idle');
      onSaveSession(
        makeSession({
          step: index,
          score,
          hadWrong,
          status: 'idle',
          assembledTiles: next,
        })
      );
    }
  };

  const resetSyllables = () => {
    playKawaiiSound('click', soundEnabled);
    setAssembledTiles([]);
    setStatus('idle');
    onSaveSession(
      makeSession({
        step: index,
        score,
        hadWrong,
        status: 'idle',
        assembledTiles: [],
      })
    );
  };

  const handleNext = () => {
    playKawaiiSound('click', soundEnabled);
    if (index + 1 < challenges.length) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setSelectedMissing(null);
      setAssembledTiles([]);
      setStatus('idle');
      setShowHint(false);
      setHadWrong(false);
      onSaveSession(
        makeSession({
          step: nextIndex,
          score,
          hadWrong: false,
          status: 'idle',
        })
      );
    } else {
      onComplete(score, challenges.length);
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiBurst active={confetti} />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-[#5C475E]">
          <span>Progresso da Fase ✨</span>
          <span className="tabular-nums bg-white px-3 py-0.5 rounded-full border border-[#DFCEFA]">
            Desafio {index + 1} de {challenges.length}
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-white overflow-hidden border-2 border-[#DFCEFA] shadow-2xs">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPct)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#DEC9FF] via-[#EFE5FF] to-[#FFE0EE] rounded-3xl border-3 border-[#8548E8] p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#E5D4FF] border-2 border-[#C7A9F7] flex items-center justify-center text-4xl select-none">
              {current.clueEmoji}
            </div>
            <div>
              <p className="text-sm font-bold text-[#6E5670]">{current.instruction}</p>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#3D2C3E]">
                {current.mode === 'missing'
                  ? 'Clique na fichinha que completa certinho!'
                  : 'Clique nas sílabas na ordem certa!'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => speakMouseVoice(current.instruction, 'greet', voiceEnabled)}
            className="kawaii-btn self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#C2E7FF] hover:bg-[#A6DAFC] border-2 border-[#86CBFA] text-[#16588E] text-xs font-extrabold cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir</span>
          </button>
        </div>

        <div className="bg-[#FFFDF9] border-2 border-dashed border-[#C7A9F7] rounded-3xl p-6 flex flex-wrap items-center justify-center gap-2 min-h-[104px]">
          {current.mode === 'missing' ? (
            <div className="font-display text-2xl sm:text-4xl font-bold tracking-wide text-[#3D2C3E] flex flex-wrap items-center justify-center gap-1.5">
              {current.prefix && <span>{current.prefix}</span>}
              <span
                className={`inline-flex items-center justify-center min-w-[64px] px-4 py-1.5 rounded-2xl border-2 transition-colors ${
                  status === 'correct'
                    ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C]'
                    : status === 'wrong'
                    ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B]'
                    : 'bg-[#FFF4BD] border-[#E8C547] text-[#3D2C3E]'
                }`}
              >
                {selectedMissing ?? '?'}
              </span>
              {current.suffix && <span>{current.suffix}</span>}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: current.targetSyllables?.length ?? 0 }).map((_, slotIdx) => {
                const pickedTileIndex = assembledTiles[slotIdx];
                const label = pickedTileIndex !== undefined ? current.tiles[pickedTileIndex] : '?';
                return (
                  <div
                    key={slotIdx}
                    className={`min-w-[74px] h-14 px-4 rounded-2xl border-2 font-display text-xl sm:text-2xl font-bold flex items-center justify-center transition-all ${
                      pickedTileIndex === undefined
                        ? 'bg-white border-dashed border-[#C7A9F7] text-[#9A85B5]'
                        : status === 'correct'
                        ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C]'
                        : status === 'wrong'
                        ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B]'
                        : 'bg-[#FFF4BD] border-[#F0D66D] text-[#3D2C3E]'
                    }`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {current.tiles.map((tile, tIdx) => {
            const isUsed = current.mode === 'syllables' && assembledTiles.includes(tIdx);
            const isPickedMissing = current.mode === 'missing' && selectedMissing === tile;

            return (
              <button
                key={tIdx}
                type="button"
                disabled={isUsed || status === 'correct'}
                onClick={() =>
                  current.mode === 'missing' ? handleMissingPick(tile) : handleSyllablePick(tIdx)
                }
                className={`kawaii-btn min-w-[76px] min-h-[54px] px-5 py-3 rounded-full border-2 font-display text-lg sm:text-xl font-bold cursor-pointer ${
                  isUsed
                    ? 'bg-[#F3EEF8] border-[#E0D4F2] text-[#B3A4C7] opacity-55 cursor-not-allowed'
                    : isPickedMissing && status === 'correct'
                    ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C]'
                    : isPickedMissing && status === 'wrong'
                    ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B] animate-wobble'
                    : 'bg-[#FFF0F6] hover:bg-[#FFD6E0] border-[#F4B8CC] text-[#3D2C3E]'
                }`}
              >
                {tile}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            {status === 'correct' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D4F8E8] border-2 border-[#7ED9B2] text-[#146B48] font-extrabold text-base">
                <span>Muito bem! ✨🎀</span>
              </div>
            )}
            {status === 'wrong' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF0F4] border-2 border-[#F7B4C6] text-[#9C2D54] font-bold text-base">
                <span>Quase lá, tente de novo! 🌸</span>
              </div>
            )}
            {current.mode === 'syllables' && assembledTiles.length > 0 && status !== 'correct' && (
              <button
                type="button"
                onClick={resetSyllables}
                className="kawaii-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F5EDF0] hover:bg-[#EADCE2] text-[#3D2C3E] text-sm font-bold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Limpar Sílabas</span>
              </button>
            )}
            {status !== 'correct' && (
              <button
                type="button"
                onClick={() => {
                  playKawaiiSound('click', soundEnabled);
                  const nextShow = !showHint;
                  setShowHint(nextShow);
                  if (nextShow) onReact('thinking', `Dica: ${current.hint}`);
                }}
                className="kawaii-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF4BD] hover:bg-[#FCEB9C] border-2 border-[#F0D15A] text-[#6E5104] text-sm font-extrabold cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Esconder Dica' : 'Dica'}</span>
              </button>
            )}
          </div>

          {status === 'correct' && (
            <button
              type="button"
              onClick={handleNext}
              className="kawaii-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-base shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{index + 1 < challenges.length ? 'Próximo Desafio' : 'Ver Resultado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showHint && status !== 'correct' && (
          <div className="animate-pop-in rounded-2xl bg-[#FFFBE6] border-2 border-[#F5DF7D] px-4 py-3 text-sm font-semibold text-[#6E5104]">
            💡 Dica mágica: {current.hint}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 3. CERTO OU ERRADO (Português) ---------- */
const TrueFalseGame: React.FC<{
  challenges: TrueFalseChallenge[];
  barColor: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  initialSession?: SavedGameSession;
  onSaveSession: (session: SavedGameSession) => void;
  onReact: (emotion: MouseEmotion, customText?: string) => void;
  onComplete: (score: number, total: number) => void;
  onSingleCorrect: () => void;
}> = ({
  challenges,
  barColor,
  soundEnabled,
  voiceEnabled,
  initialSession,
  onSaveSession,
  onReact,
  onComplete,
  onSingleCorrect,
}) => {
  const safeInitStep =
    initialSession && initialSession.step < challenges.length ? initialSession.step : 0;

  const [index, setIndex] = useState(safeInitStep);
  const [picked, setPicked] = useState<boolean | null>(
    typeof initialSession?.selectedOption === 'boolean' ? initialSession.selectedOption : null
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(
    initialSession?.status ?? 'idle'
  );
  const [score, setScore] = useState(initialSession?.score ?? 0);
  const [hadWrong, setHadWrong] = useState(initialSession?.hadWrong ?? false);
  const [confetti, setConfetti] = useState(false);

  const current = challenges[index];
  const progressPct = ((index + (status === 'correct' ? 1 : 0)) / challenges.length) * 100;

  const handlePick = (choice: boolean) => {
    if (status === 'correct') return;
    setPicked(choice);
    if (choice === current.isTrue) {
      const nextScore = !hadWrong ? score + 1 : score;
      setStatus('correct');
      setScore(nextScore);
      playKawaiiSound('correct', soundEnabled);
      onReact('celebrate');
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1100);
      onSaveSession(
        makeSession({
          step: index,
          score: nextScore,
          hadWrong,
          status: 'correct',
          selectedOption: choice,
        })
      );
      onSingleCorrect();
    } else {
      setStatus('wrong');
      setHadWrong(true);
      playKawaiiSound('wrong', soundEnabled);
      onReact('oops');
      onSaveSession(
        makeSession({
          step: index,
          score,
          hadWrong: true,
          status: 'wrong',
          selectedOption: choice,
        })
      );
    }
  };

  const handleNext = () => {
    playKawaiiSound('click', soundEnabled);
    if (index + 1 < challenges.length) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setPicked(null);
      setStatus('idle');
      setHadWrong(false);
      onSaveSession(
        makeSession({
          step: nextIndex,
          score,
          hadWrong: false,
          status: 'idle',
          selectedOption: null,
        })
      );
    } else {
      onComplete(score, challenges.length);
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiBurst active={confetti} />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-[#5C475E]">
          <span>Progresso da Fase ✨</span>
          <span className="tabular-nums bg-white px-3 py-0.5 rounded-full border border-[#9CE3C5]">
            Desafio {index + 1} de {challenges.length}
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-white overflow-hidden border-2 border-[#9CE3C5] shadow-2xs">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPct)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#B8F7DA] via-[#E3FCF0] to-[#FFF2B2] rounded-3xl border-3 border-[#19A86A] p-6 sm:p-8 shadow-md space-y-6 text-center">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-[#D4F8E8] border-2 border-[#7ED9B2] flex items-center justify-center text-4xl select-none">
          {current.emoji}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-extrabold text-[#146B48]">Leia a frase e diga se está certo ou errado:</p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3D2C3E] max-w-xl mx-auto leading-snug">
            {current.statement}
          </h3>
          <button
            type="button"
            onClick={() => speakMouseVoice(current.statement, 'greet', voiceEnabled)}
            className="kawaii-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C2E7FF] hover:bg-[#A6DAFC] border-2 border-[#86CBFA] text-[#16588E] text-xs font-extrabold cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir Frase</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => handlePick(true)}
            className={`kawaii-btn min-h-[60px] px-6 py-4 rounded-full border-2 font-display text-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              status === 'correct' && picked === true
                ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C] ring-4 ring-[#8FE3BC]/60'
                : status === 'wrong' && picked === true
                ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B] animate-wobble'
                : 'bg-[#EEFCF5] hover:bg-[#D4F8E8] border-[#7ED9B2] text-[#146B48]'
            }`}
          >
            <Check className="w-6 h-6" />
            <span>Certo</span>
          </button>

          <button
            type="button"
            onClick={() => handlePick(false)}
            className={`kawaii-btn min-h-[60px] px-6 py-4 rounded-full border-2 font-display text-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              status === 'correct' && picked === false
                ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C] ring-4 ring-[#8FE3BC]/60'
                : status === 'wrong' && picked === false
                ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B] animate-wobble'
                : 'bg-[#FFF0F4] hover:bg-[#FFD6E0] border-[#F59DB6] text-[#9C2D54]'
            }`}
          >
            <X className="w-6 h-6" />
            <span>Errado</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-left">
          <div className="min-h-[44px] flex items-center">
            {status === 'correct' && (
              <div className="animate-pop-in rounded-2xl bg-[#D4F8E8] border-2 border-[#7ED9B2] px-4 py-2.5 text-[#146B48] font-bold text-sm sm:text-base">
                <span className="font-extrabold">Muito bem! ✨🎀</span> — {current.explanation}
              </div>
            )}
            {status === 'wrong' && (
              <div className="animate-pop-in rounded-2xl bg-[#FFF0F4] border-2 border-[#F7B4C6] px-4 py-2.5 text-[#9C2D54] font-bold text-sm sm:text-base">
                Quase lá, tente de novo! 🌸
              </div>
            )}
          </div>

          {status === 'correct' && (
            <button
              type="button"
              onClick={handleNext}
              className="kawaii-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-base shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{index + 1 < challenges.length ? 'Próximo Desafio' : 'Ver Resultado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- 4. LIGUE AS PALAVRAS / LIGUE AS CONTAS (2 rodadas de 5 = 10 pares) ---------- */
const MatchingGame: React.FC<{
  rounds: MatchPair[][];
  barColor: string;
  soundEnabled: boolean;
  subtitle: string;
  initialSession?: SavedGameSession;
  onSaveSession: (session: SavedGameSession) => void;
  onReact: (emotion: MouseEmotion, customText?: string) => void;
  onComplete: (score: number, total: number) => void;
  onSingleCorrect: () => void;
}> = ({
  rounds,
  barColor,
  soundEnabled,
  subtitle,
  initialSession,
  onSaveSession,
  onReact,
  onComplete,
  onSingleCorrect,
}) => {
  const safeInitRound =
    initialSession && initialSession.matchRound < rounds.length ? initialSession.matchRound : 0;

  const [roundIdx, setRoundIdx] = useState(safeInitRound);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>(initialSession?.matchedIds ?? []);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [mistakes, setMistakes] = useState(initialSession?.mistakes ?? 0);
  const [confetti, setConfetti] = useState(false);

  const pairs = rounds[roundIdx];

  const shuffledRight = useMemo(() => {
    if (pairs.length === 5) {
      return [pairs[2], pairs[4], pairs[0], pairs[3], pairs[1]];
    }
    if (pairs.length === 4) {
      return [pairs[2], pairs[0], pairs[3], pairs[1]];
    }
    return [...pairs].reverse();
  }, [pairs]);

  const totalPairs = rounds.reduce((acc, r) => acc + r.length, 0);
  const completedCount =
    rounds.slice(0, roundIdx).reduce((acc, r) => acc + r.length, 0) + matchedIds.length;
  const progressPct = (completedCount / totalPairs) * 100;

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    playKawaiiSound('click', soundEnabled);
    setSelectedLeft(id);
    setFeedback('idle');
  };

  const handleRightClick = (rightPairId: string) => {
    if (!selectedLeft || matchedIds.includes(rightPairId)) return;

    if (selectedLeft === rightPairId) {
      const nextMatched = [...matchedIds, rightPairId];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setFeedback('correct');
      playKawaiiSound('correct', soundEnabled);
      onReact('celebrate');
      setConfetti(true);
      setTimeout(() => setConfetti(false), 950);
      onSaveSession(
        makeSession({
          matchRound: roundIdx,
          matchedIds: nextMatched,
          mistakes,
        })
      );
      onSingleCorrect();
    } else {
      const nextMistakes = mistakes + 1;
      setFeedback('wrong');
      setMistakes(nextMistakes);
      playKawaiiSound('wrong', soundEnabled);
      onReact('oops');
      onSaveSession(
        makeSession({
          matchRound: roundIdx,
          matchedIds,
          mistakes: nextMistakes,
        })
      );
    }
  };

  const isRoundFinished = matchedIds.length === pairs.length;

  const handleNextRound = () => {
    playKawaiiSound('click', soundEnabled);
    if (roundIdx + 1 < rounds.length) {
      const nextRound = roundIdx + 1;
      setRoundIdx(nextRound);
      setMatchedIds([]);
      setSelectedLeft(null);
      setFeedback('idle');
      onSaveSession(
        makeSession({
          matchRound: nextRound,
          matchedIds: [],
          mistakes,
        })
      );
    } else {
      const earned = Math.max(totalPairs - Math.floor(mistakes / 2), Math.ceil(totalPairs / 2));
      onComplete(earned, totalPairs);
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiBurst active={confetti} />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-[#5C475E]">
          <span>Progresso da Fase ✨</span>
          <span className="tabular-nums bg-white px-3 py-0.5 rounded-full border border-[#93D1FA]">
            {completedCount} de {totalPairs} pares ligados
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-white overflow-hidden border-2 border-[#93D1FA] shadow-2xs">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPct)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#BDE4FF] via-[#E5F4FF] to-[#FFE1EE] rounded-3xl border-3 border-[#1F90E0] p-6 sm:p-8 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#3D2C3E]">
            {subtitle}
          </h3>
          <p className="text-sm font-semibold text-[#6E5670]">
            1º clique em um cartão da esquerda, depois clique no par correspondente da direita.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-start">
          <div className="space-y-3">
            {pairs.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedLeft === pair.id;
              return (
                <button
                  key={pair.id}
                  type="button"
                  disabled={isMatched}
                  onClick={() => handleLeftClick(pair.id)}
                  className={`kawaii-btn w-full min-h-[54px] px-5 py-3 rounded-full border-2 font-display text-lg font-bold flex items-center justify-between cursor-pointer ${
                    isMatched
                      ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C] opacity-80 cursor-default'
                      : isSelected
                      ? 'bg-[#FFF4BD] border-[#EAB308] text-[#3D2C3E] ring-4 ring-[#FFF4BD]/70 scale-[1.02]'
                      : 'bg-[#EEF8FF] hover:bg-[#C2E7FF] border-[#86CBFA] text-[#16588E]'
                  }`}
                >
                  <span>{pair.left}</span>
                  <span>{isMatched ? '✅' : isSelected ? '👉' : '✨'}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {shuffledRight.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);
              return (
                <button
                  key={pair.id}
                  type="button"
                  disabled={isMatched || !selectedLeft}
                  onClick={() => handleRightClick(pair.id)}
                  className={`kawaii-btn w-full min-h-[54px] px-5 py-3 rounded-full border-2 font-display text-lg font-bold flex items-center justify-between ${
                    isMatched
                      ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C] opacity-80 cursor-default'
                      : selectedLeft
                      ? 'bg-[#FFF0F6] hover:bg-[#FFD6E0] border-[#F49EB6] text-[#3D2C3E] cursor-pointer'
                      : 'bg-[#FAF6F8] border-[#EADCE2] text-[#8E7A8E] cursor-not-allowed'
                  }`}
                >
                  <span>{pair.right}</span>
                  <span>{isMatched ? '🎀' : '🍬'}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="min-h-[44px] flex items-center">
            {feedback === 'correct' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D4F8E8] border-2 border-[#7ED9B2] text-[#146B48] font-extrabold text-base">
                <span>Muito bem! ✨🎀</span>
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF0F4] border-2 border-[#F7B4C6] text-[#9C2D54] font-bold text-base">
                <span>Quase lá, tente de novo! 🌸</span>
              </div>
            )}
          </div>

          {isRoundFinished && (
            <button
              type="button"
              onClick={handleNextRound}
              className="kawaii-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-base shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{roundIdx + 1 < rounds.length ? 'Próxima Rodada (5 pares)' : 'Ver Resultado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- 5. COMPLETE A CONTA (Matemática) ---------- */
const MathMissingGame: React.FC<{
  challenges: MathMissingChallenge[];
  barColor: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  initialSession?: SavedGameSession;
  onSaveSession: (session: SavedGameSession) => void;
  onReact: (emotion: MouseEmotion, customText?: string) => void;
  onComplete: (score: number, total: number) => void;
  onSingleCorrect: () => void;
}> = ({
  challenges,
  barColor,
  soundEnabled,
  voiceEnabled,
  initialSession,
  onSaveSession,
  onReact,
  onComplete,
  onSingleCorrect,
}) => {
  const safeInitStep =
    initialSession && initialSession.step < challenges.length ? initialSession.step : 0;

  const [index, setIndex] = useState(safeInitStep);
  const [picked, setPicked] = useState<string | null>(
    typeof initialSession?.selectedOption === 'string' ? initialSession.selectedOption : null
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(
    initialSession?.status ?? 'idle'
  );
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(initialSession?.score ?? 0);
  const [hadWrong, setHadWrong] = useState(initialSession?.hadWrong ?? false);
  const [confetti, setConfetti] = useState(false);

  const current = challenges[index];
  const progressPct = ((index + (status === 'correct' ? 1 : 0)) / challenges.length) * 100;

  const handleOption = (opt: string) => {
    if (status === 'correct') return;
    setPicked(opt);
    if (opt === current.answer) {
      const nextScore = !hadWrong ? score + 1 : score;
      setStatus('correct');
      setScore(nextScore);
      playKawaiiSound('correct', soundEnabled);
      onReact('celebrate');
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1100);
      onSaveSession(
        makeSession({
          step: index,
          score: nextScore,
          hadWrong,
          status: 'correct',
          selectedOption: opt,
        })
      );
      onSingleCorrect();
    } else {
      setStatus('wrong');
      setHadWrong(true);
      playKawaiiSound('wrong', soundEnabled);
      onReact('oops');
      onSaveSession(
        makeSession({
          step: index,
          score,
          hadWrong: true,
          status: 'wrong',
          selectedOption: opt,
        })
      );
    }
  };

  const handleNext = () => {
    playKawaiiSound('click', soundEnabled);
    if (index + 1 < challenges.length) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setPicked(null);
      setStatus('idle');
      setShowHint(false);
      setHadWrong(false);
      onSaveSession(
        makeSession({
          step: nextIndex,
          score,
          hadWrong: false,
          status: 'idle',
          selectedOption: null,
        })
      );
    } else {
      onComplete(score, challenges.length);
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiBurst active={confetti} />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-[#5C475E]">
          <span>Progresso da Fase ✨</span>
          <span className="tabular-nums bg-white px-3 py-0.5 rounded-full border border-[#F59DB6]">
            Desafio {index + 1} de {challenges.length}
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-white overflow-hidden border-2 border-[#F59DB6] shadow-2xs">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPct)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#FFD1E2] via-[#FFEAF2] to-[#FFF0B8] rounded-3xl border-3 border-[#E84D8A] p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#FFD6E0] border-2 border-[#F59DB6] flex items-center justify-center text-4xl select-none">
              {current.emoji}
            </div>
            <div>
              <p className="text-sm font-bold text-[#6E5670]">{current.instruction}</p>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#3D2C3E]">
                Qual número completa a conta certinha?
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              speakMouseVoice(`${current.instruction} Qual número completa a conta?`, 'greet', voiceEnabled)
            }
            className="kawaii-btn self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#C2E7FF] hover:bg-[#A6DAFC] border-2 border-[#86CBFA] text-[#16588E] text-xs font-extrabold cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir</span>
          </button>
        </div>

        <div className="bg-[#FFFDF9] border-2 border-dashed border-[#F49EB6] rounded-3xl p-6 flex flex-wrap items-center justify-center gap-3">
          {current.parts.map((part, i) => {
            if (part === '?') {
              return (
                <span
                  key={i}
                  className={`min-w-[68px] h-14 px-4 rounded-2xl border-2 font-display text-2xl sm:text-3xl font-bold inline-flex items-center justify-center ${
                    status === 'correct'
                      ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C]'
                      : status === 'wrong'
                      ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B]'
                      : 'bg-[#FFF4BD] border-[#E8C547] text-[#3D2C3E]'
                  }`}
                >
                  {picked ?? '?'}
                </span>
              );
            }
            return (
              <span key={i} className="font-display text-2xl sm:text-4xl font-bold text-[#3D2C3E] tabular-nums">
                {part}
              </span>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleOption(opt)}
              className={`kawaii-btn min-h-[54px] px-4 py-3 rounded-full border-2 font-display text-xl font-bold cursor-pointer tabular-nums ${
                status === 'correct' && opt === current.answer
                  ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C]'
                  : status === 'wrong' && opt === picked
                  ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B] animate-wobble'
                  : 'bg-[#FFF0F6] hover:bg-[#FFD6E0] border-[#F4B8CC] text-[#3D2C3E]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            {status === 'correct' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D4F8E8] border-2 border-[#7ED9B2] text-[#146B48] font-extrabold text-base">
                <span>Muito bem! ✨🎀</span>
              </div>
            )}
            {status === 'wrong' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF0F4] border-2 border-[#F7B4C6] text-[#9C2D54] font-bold text-base">
                <span>Quase lá, tente de novo! 🌸</span>
              </div>
            )}
            {status !== 'correct' && (
              <button
                type="button"
                onClick={() => {
                  playKawaiiSound('click', soundEnabled);
                  const nextShow = !showHint;
                  setShowHint(nextShow);
                  if (nextShow) onReact('thinking', `Dica: ${current.hint}`);
                }}
                className="kawaii-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF4BD] hover:bg-[#FCEB9C] border-2 border-[#F0D15A] text-[#6E5104] text-sm font-extrabold cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Esconder Dica' : 'Dica'}</span>
              </button>
            )}
          </div>

          {status === 'correct' && (
            <button
              type="button"
              onClick={handleNext}
              className="kawaii-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-base shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{index + 1 < challenges.length ? 'Próximo Desafio' : 'Ver Resultado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showHint && status !== 'correct' && (
          <div className="animate-pop-in rounded-2xl bg-[#FFFBE6] border-2 border-[#F5DF7D] px-4 py-3 text-sm font-semibold text-[#6E5104]">
            💡 Dica mágica: {current.hint}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 6. MAIOR OU MENOR (Matemática) ---------- */
const MathCompareGame: React.FC<{
  challenges: MathCompareChallenge[];
  barColor: string;
  soundEnabled: boolean;
  initialSession?: SavedGameSession;
  onSaveSession: (session: SavedGameSession) => void;
  onReact: (emotion: MouseEmotion, customText?: string) => void;
  onComplete: (score: number, total: number) => void;
  onSingleCorrect: () => void;
}> = ({
  challenges,
  barColor,
  soundEnabled,
  initialSession,
  onSaveSession,
  onReact,
  onComplete,
  onSingleCorrect,
}) => {
  const safeInitStep =
    initialSession && initialSession.step < challenges.length ? initialSession.step : 0;

  const initPicked =
    initialSession?.selectedOption === '>' ||
    initialSession?.selectedOption === '<' ||
    initialSession?.selectedOption === '='
      ? initialSession.selectedOption
      : null;

  const [index, setIndex] = useState(safeInitStep);
  const [picked, setPicked] = useState<'>' | '<' | '=' | null>(initPicked);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(
    initialSession?.status ?? 'idle'
  );
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(initialSession?.score ?? 0);
  const [hadWrong, setHadWrong] = useState(initialSession?.hadWrong ?? false);
  const [confetti, setConfetti] = useState(false);

  const current = challenges[index];
  const progressPct = ((index + (status === 'correct' ? 1 : 0)) / challenges.length) * 100;

  const symbols: Array<{ sym: '>' | '<' | '='; label: string }> = [
    { sym: '>', label: 'Maior (>)' },
    { sym: '=', label: 'Igual (=)' },
    { sym: '<', label: 'Menor (<)' },
  ];

  const handlePick = (sym: '>' | '<' | '=') => {
    if (status === 'correct') return;
    setPicked(sym);
    if (sym === current.correctSymbol) {
      const nextScore = !hadWrong ? score + 1 : score;
      setStatus('correct');
      setScore(nextScore);
      playKawaiiSound('correct', soundEnabled);
      onReact('celebrate');
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1100);
      onSaveSession(
        makeSession({
          step: index,
          score: nextScore,
          hadWrong,
          status: 'correct',
          selectedOption: sym,
        })
      );
      onSingleCorrect();
    } else {
      setStatus('wrong');
      setHadWrong(true);
      playKawaiiSound('wrong', soundEnabled);
      onReact('oops');
      onSaveSession(
        makeSession({
          step: index,
          score,
          hadWrong: true,
          status: 'wrong',
          selectedOption: sym,
        })
      );
    }
  };

  const handleNext = () => {
    playKawaiiSound('click', soundEnabled);
    if (index + 1 < challenges.length) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setPicked(null);
      setStatus('idle');
      setShowHint(false);
      setHadWrong(false);
      onSaveSession(
        makeSession({
          step: nextIndex,
          score,
          hadWrong: false,
          status: 'idle',
          selectedOption: null,
        })
      );
    } else {
      onComplete(score, challenges.length);
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiBurst active={confetti} />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-[#5C475E]">
          <span>Progresso da Fase ✨</span>
          <span className="tabular-nums bg-white px-3 py-0.5 rounded-full border border-[#D5BBFA]">
            Desafio {index + 1} de {challenges.length}
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-white overflow-hidden border-2 border-[#D5BBFA] shadow-2xs">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPct)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#DEC9FF] via-[#F2EBFF] to-[#CCE9FF] rounded-3xl border-3 border-[#8548E8] p-6 sm:p-8 shadow-md space-y-6 text-center">
        <div className="space-y-1">
          <span className="text-3xl select-none">{current.emoji}</span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3D2C3E]">
            Compare os dois lados! O da esquerda é maior, igual ou menor?
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
          <div className="min-w-[130px] px-6 py-4 rounded-3xl bg-[#C2E7FF] border-2 border-[#86CBFA] font-display text-2xl sm:text-3xl font-bold text-[#16588E] tabular-nums">
            {current.leftLabel}
          </div>

          <div
            className={`w-16 h-16 rounded-2xl border-2 font-display text-3xl font-bold flex items-center justify-center ${
              status === 'correct'
                ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C]'
                : status === 'wrong'
                ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B]'
                : 'bg-[#FFF4BD] border-[#E8C547] text-[#3D2C3E]'
            }`}
          >
            {picked ?? '?'}
          </div>

          <div className="min-w-[130px] px-6 py-4 rounded-3xl bg-[#FFD6E0] border-2 border-[#F59DB6] font-display text-2xl sm:text-3xl font-bold text-[#9C2D54] tabular-nums">
            {current.rightLabel}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
          {symbols.map(({ sym, label }) => (
            <button
              key={sym}
              type="button"
              onClick={() => handlePick(sym)}
              className={`kawaii-btn min-h-[56px] px-5 py-3 rounded-full border-2 font-display text-lg font-bold cursor-pointer ${
                status === 'correct' && sym === current.correctSymbol
                  ? 'bg-[#D4F8E8] border-[#42B883] text-[#115E3C]'
                  : status === 'wrong' && sym === picked
                  ? 'bg-[#FFE5EC] border-[#E57393] text-[#9E2A4B] animate-wobble'
                  : 'bg-[#F6F0FF] hover:bg-[#E5D4FF] border-[#C7A9F7] text-[#532B94]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-left">
          <div className="flex flex-wrap items-center gap-3">
            {status === 'correct' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D4F8E8] border-2 border-[#7ED9B2] text-[#146B48] font-extrabold text-base">
                <span>Muito bem! ✨🎀</span>
              </div>
            )}
            {status === 'wrong' && (
              <div className="animate-pop-in inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF0F4] border-2 border-[#F7B4C6] text-[#9C2D54] font-bold text-base">
                <span>Quase lá, tente de novo! 🌸</span>
              </div>
            )}
            {status !== 'correct' && (
              <button
                type="button"
                onClick={() => {
                  playKawaiiSound('click', soundEnabled);
                  const nextShow = !showHint;
                  setShowHint(nextShow);
                  if (nextShow) onReact('thinking', `Dica: ${current.hint}`);
                }}
                className="kawaii-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF4BD] hover:bg-[#FCEB9C] border-2 border-[#F0D15A] text-[#6E5104] text-sm font-extrabold cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Esconder Dica' : 'Dica'}</span>
              </button>
            )}
          </div>

          {status === 'correct' && (
            <button
              type="button"
              onClick={handleNext}
              className="kawaii-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-base shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{index + 1 < challenges.length ? 'Próximo Desafio' : 'Ver Resultado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showHint && status !== 'correct' && (
          <div className="animate-pop-in rounded-2xl bg-[#FFFBE6] border-2 border-[#F5DF7D] px-4 py-3 text-sm font-semibold text-[#6E5104] text-left">
            💡 Dica mágica: {current.hint}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- MAIN MINI-GAME WRAPPER & INTERACTIVE MOUSE COMPANION ---------- */
export const MiniGameStage: React.FC<MiniGameProps> = ({
  grade,
  gameId,
  soundEnabled,
  voiceEnabled,
  initialSession,
  onSaveSession,
  onSingleCorrect,
  onCompleteGame,
  onBackToSubject,
}) => {
  const [summary, setSummary] = useState<{ score: number; total: number } | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [mouseMood, setMouseMood] = useState<CartoonMouseMood>('idle');
  const [mouseSpeech, setMouseSpeech] = useState(
    'Ihii! Oi, amiguinho! Clique nas respostas ou toque em mim para conversar!'
  );
  const [streak, setStreak] = useState(0);

  const meta = GAME_META[gameId];
  const gameStorageKey = `${grade.id}-${gameId}`;

  const triggerMouseReaction = (emotion: MouseEmotion, customText?: string) => {
    let nextStreak = streak;
    if (emotion === 'celebrate') {
      nextStreak = streak + 1;
      setStreak(nextStreak);
    } else if (emotion === 'oops') {
      nextStreak = 0;
      setStreak(0);
    }

    const moodMap: Record<MouseEmotion, CartoonMouseMood> = {
      greet: 'happy',
      celebrate: 'celebrate',
      oops: 'oops',
      thinking: 'thinking',
      party: 'party',
    };

    const phrase = customText ?? pickRandomMousePhrase(emotion, nextStreak);
    setMouseMood(moodMap[emotion]);
    setMouseSpeech(phrase);
    speakMouseVoice(phrase, emotion, voiceEnabled);
  };

  const handleComplete = (score: number, total: number) => {
    playKawaiiSound('win', soundEnabled);
    onSaveSession(gameStorageKey, null);
    onCompleteGame(gameStorageKey, score, total);
    setSummary({ score, total });
    triggerMouseReaction('party');
  };

  const handleRestart = () => {
    playKawaiiSound('click', soundEnabled);
    stopMouseVoice();
    onSaveSession(gameStorageKey, null);
    setSummary(null);
    setStreak(0);
    setMouseMood('happy');
    setMouseSpeech('Obaaa! Vamos começar de novo com muita diversão!');
    setRunKey((k) => k + 1);
  };

  const handleSaveSession = (session: SavedGameSession) => {
    onSaveSession(gameStorageKey, session);
  };

  const sessionForRun = runKey === 0 ? initialSession : undefined;

  return (
    <section className="max-w-3xl mx-auto space-y-5 animate-pop-in">
      <div
        className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#FFE0EE] via-[#FFF6CC] to-[#D4EEFF] rounded-3xl border-3 px-5 py-4 shadow-md"
        style={{ borderColor: meta.cardBorder }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#3D2C3E]/15"
            style={{ backgroundColor: meta.badgeBg }}
          >
            <KawaiiBowIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-extrabold text-[#6E5670]">
                {grade.title} · {gameId.startsWith('pt') ? 'Português' : 'Matemática'}
              </p>
              <span className="text-[11px] font-extrabold text-[#146B48] bg-[#D4F8E8] border border-[#7ED9B2] px-2 py-0.5 rounded-full">
                💾 Progresso salvo
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3D2C3E]">
              {meta.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!summary && (
            <button
              type="button"
              onClick={handleRestart}
              title="Recomeçar este mini-jogo do início"
              className="kawaii-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFF4BD] hover:bg-[#FCEB9C] border-2 border-[#F0D15A] text-[#6E5104] font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recomeçar</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              playKawaiiSound('click', soundEnabled);
              stopMouseVoice();
              onBackToSubject();
            }}
            className="kawaii-btn px-4 py-2 rounded-full bg-[#FFD6E0] hover:bg-[#FFC2D1] border-2 border-[#F59DB6] text-[#9C2D54] font-extrabold text-xs sm:text-sm cursor-pointer whitespace-nowrap"
          >
            Voltar às Matérias
          </button>
        </div>
      </div>

      {/* Interactive Cartoon Mouse Buddy with Live Emotional Reactions */}
      <div
        className={`rounded-3xl border-3 px-4 py-3 flex flex-col sm:flex-row items-center gap-4 shadow-md transition-colors ${
          mouseMood === 'celebrate' || mouseMood === 'party'
            ? 'bg-gradient-to-r from-[#FFE066] via-[#8AEBC0] to-[#FFA6C9] border-[#19A86A]'
            : mouseMood === 'oops'
            ? 'bg-gradient-to-r from-[#FFB5D0] to-[#FFD6E6] border-[#E84D8A]'
            : mouseMood === 'thinking'
            ? 'bg-gradient-to-r from-[#D7BFFF] to-[#FFE89E] border-[#8548E8]'
            : 'bg-gradient-to-r from-[#B8E2FF] via-[#FFE6F0] to-[#FFF0A6] border-[#1F90E0]'
        }`}
      >
        <button
          type="button"
          onClick={() => triggerMouseReaction('greet')}
          title="Toque no amiguinho para conversar!"
          className="kawaii-btn shrink-0 rounded-full bg-white p-1.5 border-2 border-[#3D2C3E]/15 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD6E0]"
        >
          <KawaiiCartoonMouse mood={mouseMood} className="w-20 h-20" />
        </button>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#8A1143] bg-white px-2.5 py-0.5 rounded-full border border-[#E84D8A]">
              🐱 Gatinha Mágica
            </span>
            {streak >= 2 && (
              <span className="text-xs font-extrabold text-[#6B4800] bg-[#FFE066] px-2.5 py-0.5 rounded-full border border-[#E59F00] animate-pop-in">
                🔥 {streak} seguidos!
              </span>
            )}
          </div>
          <p className="font-display text-base sm:text-lg font-semibold text-[#3D2C3E] leading-snug">
            “{mouseSpeech}”
          </p>
        </div>

        <button
          type="button"
          onClick={() => triggerMouseReaction('greet')}
          className="kawaii-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFE066] hover:bg-[#FFD43B] border-2 border-[#E59F00] text-[#5C3D00] text-xs font-extrabold cursor-pointer shrink-0"
        >
          <Volume2 className="w-4 h-4" />
          <span>Falar!</span>
        </button>
      </div>

      {summary ? (
        <div className="bg-gradient-to-b from-[#FFE066] via-[#FFC2DC] to-[#AEE0FF] rounded-3xl border-3 border-[#E59F00] p-8 text-center space-y-6 shadow-md animate-pop-in">
          <ConfettiBurst active={true} />
          <div className="flex justify-center items-center gap-3">
            <KawaiiStarIcon className="w-12 h-12 animate-float-slow" />
            <KawaiiCartoonMouse mood="party" className="w-28 h-28" />
            <KawaiiStarIcon className="w-12 h-12 animate-float-slow" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-3xl font-bold text-[#3D2C3E]">
              Parabéns, Super Estudante! ✨🎀
            </h3>
            <p className="text-base sm:text-lg font-semibold text-[#5C475E]">
              Você completou <strong>{meta.title}</strong> do {grade.title} e ganhou{' '}
              <span className="text-[#C93B6B] font-extrabold">+2 estrelas e +50 pontos bônus!</span>
            </p>
            <p className="text-sm font-bold text-[#6E5670] tabular-nums">
              Pontuação da rodada: {summary.score} de {summary.total} acertos de primeira · Progresso salvo!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="kawaii-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playKawaiiSound('click', soundEnabled);
                stopMouseVoice();
                onBackToSubject();
              }}
              className="kawaii-btn px-6 py-3 rounded-full bg-[#C2E7FF] hover:bg-[#A6DAFC] border-2 border-[#86CBFA] text-[#16588E] font-extrabold cursor-pointer"
            >
              Escolher Outro Jogo
            </button>
          </div>
        </div>
      ) : (
        <div key={`${gameStorageKey}-${runKey}`}>
          {gameId === 'pt-quiz' && (
            <QuizGame
              questions={grade.ptQuiz}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
          {gameId === 'pt-builder' && (
            <WordBuilderGame
              challenges={grade.ptBuilder}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
          {gameId === 'pt-truefalse' && (
            <TrueFalseGame
              challenges={grade.ptTrueFalse}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
          {gameId === 'pt-match' && (
            <MatchingGame
              rounds={grade.ptMatchRounds}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              subtitle="Ligue cada palavra ao seu par correto!"
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
          {gameId === 'mat-quiz' && (
            <QuizGame
              questions={grade.matQuiz}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
          {gameId === 'mat-match' && (
            <MatchingGame
              rounds={grade.matMatchRounds}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              subtitle="Ligue cada continha ao resultado certo!"
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
          {gameId === 'mat-missing' && (
            <MathMissingGame
              challenges={grade.matMissing}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
          {gameId === 'mat-compare' && (
            <MathCompareGame
              challenges={grade.matCompare}
              barColor={meta.barColor}
              soundEnabled={soundEnabled}
              initialSession={sessionForRun}
              onSaveSession={handleSaveSession}
              onReact={triggerMouseReaction}
              onSingleCorrect={onSingleCorrect}
              onComplete={handleComplete}
            />
          )}
        </div>
      )}
    </section>
  );
};
