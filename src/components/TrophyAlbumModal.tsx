import React from 'react';
import { X, Lock, Trash2 } from 'lucide-react';
import { KAWAII_REWARDS } from '../data/curriculum';
import { KawaiiRewardArtwork, KawaiiStarIcon } from './KawaiiIllustrations';

interface TrophyAlbumModalProps {
  open: boolean;
  stars: number;
  points: number;
  completedGames: string[];
  onClose: () => void;
  onResetProgress: () => void;
}

export const TrophyAlbumModal: React.FC<TrophyAlbumModalProps> = ({
  open,
  stars,
  points,
  completedGames,
  onClose,
  onResetProgress,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D2C3E]/40 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="album-title"
    >
      <div className="bg-gradient-to-b from-[#FFF5FA] via-[#FFFDF9] to-[#F3FAFF] w-full max-w-2xl rounded-3xl border-4 border-[#F7B4C6] shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 animate-pop-in">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id="album-title" className="font-display text-2xl sm:text-3xl font-bold text-[#3D2C3E]">
              Álbum Mágico de Lacinhos e Troféus ✨
            </h2>
            <p className="text-sm font-semibold text-[#6E5670]">
              Suas estrelas, pontos, desafios em andamento e fases concluídas ficam salvos automaticamente!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar álbum"
            className="w-10 h-10 rounded-full bg-[#FFD6E0] hover:bg-[#FFC2D1] border-2 border-[#F4A2B8] text-[#9C2D54] flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#FFF4BD] border-2 border-[#F2D15B] p-4 flex items-center gap-3 shadow-xs">
            <KawaiiStarIcon className="w-9 h-9 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-[#7D5C06]">Estrelinhas</p>
              <p className="font-display text-2xl font-bold text-[#3D2C3E] tabular-nums">{stars}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#FFD6E0] border-2 border-[#F59DB6] p-4 flex items-center gap-3 shadow-xs">
            <span className="text-2xl select-none" aria-hidden="true">✨</span>
            <div>
              <p className="text-xs font-extrabold text-[#9C2D54]">Pontos Totais</p>
              <p className="font-display text-2xl font-bold text-[#3D2C3E] tabular-nums">{points}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#D4F8E8] border-2 border-[#7ED9B2] p-4 flex items-center gap-3 shadow-xs">
            <span className="text-2xl select-none" aria-hidden="true">🎀</span>
            <div>
              <p className="text-xs font-extrabold text-[#146B48]">Fases Concluídas</p>
              <p className="font-display text-2xl font-bold text-[#3D2C3E] tabular-nums">
                {completedGames.length} / 40
              </p>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {KAWAII_REWARDS.map((reward) => {
            const unlocked = stars >= reward.requiredStars;
            return (
              <div
                key={reward.id}
                className={`rounded-3xl border-2 p-4 flex items-center gap-4 transition-all ${
                  unlocked
                    ? 'bg-white border-[#F2C6D4] shadow-xs'
                    : 'bg-[#F8F3F5] border-[#E8DCE0] opacity-75'
                }`}
              >
                <div
                  className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border border-[#3D2C3E]/10 relative"
                  style={{ backgroundColor: unlocked ? reward.color : '#EDE6E9' }}
                >
                  <KawaiiRewardArtwork type={reward.iconType} className="w-11 h-11" />
                  {!unlocked && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#D8C9CE] flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-[#6E5670]" />
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-[#3D2C3E] truncate">
                      {reward.name}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-[#6E5670] leading-snug">
                    {reward.description}
                  </p>
                  <p className="text-xs font-extrabold pt-0.5 tabular-nums text-[#C93B6B]">
                    {unlocked
                      ? 'Conquistado! ✨'
                      : `Faltam ${Math.max(0, reward.requiredStars - stars)} estrelinhas`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0E4E8]">
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A718B] hover:text-[#C93B6B] cursor-pointer py-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reiniciar Progresso Salvo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="kawaii-btn px-6 py-2.5 rounded-full bg-[#D94E7A] hover:bg-[#C33E68] text-white font-extrabold text-sm cursor-pointer"
          >
            Continuar Brincando
          </button>
        </div>
      </div>
    </div>
  );
};
