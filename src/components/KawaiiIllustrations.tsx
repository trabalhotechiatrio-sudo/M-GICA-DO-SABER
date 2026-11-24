'use client';

import React from 'react';

export const KawaiiBowIcon: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-8 h-8',
  color = '#FF8FB1',
}) => (
  <svg viewBox="0 0 64 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M32 24C24 12 10 8 6 16C3 22 7 34 15 36C21 37 28 31 32 24Z"
      fill={color}
      stroke="#3D2C3E"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M32 24C40 12 54 8 58 16C61 22 57 34 49 36C43 37 36 31 32 24Z"
      fill={color}
      stroke="#3D2C3E"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M24 31L17 43L25 40L29 33" fill={color} stroke="#3D2C3E" strokeWidth="2.8" strokeLinejoin="round" />
    <path d="M40 31L47 43L39 40L35 33" fill={color} stroke="#3D2C3E" strokeWidth="2.8" strokeLinejoin="round" />
    <circle cx="32" cy="24" r="6.5" fill="#FFF4BD" stroke="#3D2C3E" strokeWidth="3" />
    <circle cx="15" cy="20" r="2.2" fill="#FFFDF9" opacity="0.85" />
    <circle cx="49" cy="20" r="2.2" fill="#FFFDF9" opacity="0.85" />
  </svg>
);

export const KawaiiStarIcon: React.FC<{ className?: string; filled?: boolean }> = ({
  className = 'w-6 h-6',
  filled = true,
}) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M24 4L29.7 15.8L42.7 17.6L33.2 26.8L35.5 39.8L24 33.6L12.5 39.8L14.8 26.8L5.3 17.6L18.3 15.8L24 4Z"
      fill={filled ? '#FFE066' : '#F3ECEE'}
      stroke="#3D2C3E"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    {filled && (
      <>
        <circle cx="20.5" cy="23.5" r="1.4" fill="#3D2C3E" />
        <circle cx="27.5" cy="23.5" r="1.4" fill="#3D2C3E" />
        <path d="M22.2 26.5C23.2 27.6 24.8 27.6 25.8 26.5" stroke="#3D2C3E" strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const KawaiiMascotKitty: React.FC<{
  className?: string;
  bowColor?: string;
  accentColor?: string;
}> = ({ className = 'w-24 h-24', bowColor = '#FF8FB1', accentColor = '#FFD6E0' }) => (
  <svg viewBox="0 0 120 110" fill="none" className={className} aria-hidden="true">
    {/* Soft halo */}
    <circle cx="60" cy="58" r="46" fill={accentColor} opacity="0.55" />
    {/* Ears */}
    <path
      d="M28 45L22 18C21.5 15.5 24.5 13.5 26.8 15L47 29"
      fill="#FFFDF9"
      stroke="#3D2C3E"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M92 45L98 18C98.5 15.5 95.5 13.5 93.2 15L73 29"
      fill="#FFFDF9"
      stroke="#3D2C3E"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Head */}
    <ellipse cx="60" cy="60" rx="38" ry="30" fill="#FFFDF9" stroke="#3D2C3E" strokeWidth="3.5" />
    {/* Whiskers */}
    <path d="M16 55H27M14 63H26M17 71H28" stroke="#3D2C3E" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M104 55H93M106 63H94M103 71H92" stroke="#3D2C3E" strokeWidth="2.8" strokeLinecap="round" />
    {/* Rosy Cheeks */}
    <ellipse cx="37" cy="66" rx="5.5" ry="3.5" fill="#FFB3C6" />
    <ellipse cx="83" cy="66" rx="5.5" ry="3.5" fill="#FFB3C6" />
    {/* Eyes & Nose */}
    <circle cx="44" cy="58" r="3.6" fill="#3D2C3E" />
    <circle cx="76" cy="58" r="3.6" fill="#3D2C3E" />
    <circle cx="43" cy="56.8" r="1.1" fill="#FFFDF9" />
    <circle cx="75" cy="56.8" r="1.1" fill="#FFFDF9" />
    <ellipse cx="60" cy="63.5" rx="4" ry="2.8" fill="#FFE066" stroke="#3D2C3E" strokeWidth="2.2" />
    {/* Bow on right ear */}
    <g transform="translate(68, 12) rotate(14)">
      <path
        d="M16 12C11 4 2 2 0 7C-2 11 1 18 6 19C10 19.5 14 16 16 12Z"
        fill={bowColor}
        stroke="#3D2C3E"
        strokeWidth="2.8"
      />
      <path
        d="M16 12C21 4 30 2 32 7C34 11 31 18 26 19C22 19.5 18 16 16 12Z"
        fill={bowColor}
        stroke="#3D2C3E"
        strokeWidth="2.8"
      />
      <circle cx="16" cy="12" r="4.5" fill="#FFF4BD" stroke="#3D2C3E" strokeWidth="2.6" />
    </g>
  </svg>
);

export const KawaiiRewardArtwork: React.FC<{
  type: 'bow' | 'cupcake' | 'crown' | 'rainbow' | 'medal' | 'cloud';
  className?: string;
}> = ({ type, className = 'w-14 h-14' }) => {
  if (type === 'bow') {
    return <KawaiiBowIcon className={className} color="#FF8FB1" />;
  }
  if (type === 'cloud') {
    return (
      <svg viewBox="0 0 64 48" fill="none" className={className} aria-hidden="true">
        <path
          d="M16 38H48C53.5 38 58 33.5 58 28C58 23 54.3 18.8 49.4 18.1C47.7 11.2 41.5 6 34 6C26.1 6 19.6 11.8 18.3 19.3C12.5 19.8 8 24.6 8 30.5C8 34.6 11.6 38 16 38Z"
          fill="#FFFFFF"
          stroke="#3D2C3E"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="27" cy="24" r="2" fill="#3D2C3E" />
        <circle cx="39" cy="24" r="2" fill="#3D2C3E" />
        <ellipse cx="23" cy="27.5" rx="3" ry="1.8" fill="#FFD6E0" />
        <ellipse cx="43" cy="27.5" rx="3" ry="1.8" fill="#FFD6E0" />
        <path d="M31 27C32.2 28.5 33.8 28.5 35 27" stroke="#3D2C3E" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'cupcake') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <path d="M18 35L22 54H42L46 35H18Z" fill="#FFF4BD" stroke="#3D2C3E" strokeWidth="3" strokeLinejoin="round" />
        <path
          d="M14 33C14 25 22 21 32 21C42 21 50 25 50 33C50 36 47 37 44 37C41 37 39 35 36 37C33 39 31 39 28 37C25 35 23 37 20 37C17 37 14 36 14 33Z"
          fill="#FFD6E0"
          stroke="#3D2C3E"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="14" r="5" fill="#FF6B8B" stroke="#3D2C3E" strokeWidth="2.8" />
        <circle cx="27" cy="44" r="1.8" fill="#3D2C3E" />
        <circle cx="37" cy="44" r="1.8" fill="#3D2C3E" />
        <path d="M30 47.5C31.2 48.8 32.8 48.8 34 47.5" stroke="#3D2C3E" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'crown') {
    return (
      <svg viewBox="0 0 64 56" fill="none" className={className} aria-hidden="true">
        <path
          d="M10 42L14 18L26 28L32 12L38 28L50 18L54 42H10Z"
          fill="#FFE066"
          stroke="#3D2C3E"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x="10" y="42" width="44" height="7" rx="3.5" fill="#D4F8E8" stroke="#3D2C3E" strokeWidth="3" />
        <circle cx="32" cy="10" r="3.5" fill="#FF8FB1" stroke="#3D2C3E" strokeWidth="2.4" />
        <circle cx="14" cy="16" r="3" fill="#C2E7FF" stroke="#3D2C3E" strokeWidth="2.4" />
        <circle cx="50" cy="16" r="3" fill="#E5D4FF" stroke="#3D2C3E" strokeWidth="2.4" />
      </svg>
    );
  }
  if (type === 'rainbow') {
    return (
      <svg viewBox="0 0 64 52" fill="none" className={className} aria-hidden="true">
        <path d="M10 38C10 23.6 20 12 32 12C44 12 54 23.6 54 38" stroke="#FF8FB1" strokeWidth="6" strokeLinecap="round" />
        <path d="M16 38C16 27 23.2 18 32 18C40.8 18 48 27 48 38" stroke="#FFE066" strokeWidth="6" strokeLinecap="round" />
        <path d="M22 38C22 30.3 26.5 24 32 24C37.5 24 42 30.3 42 38" stroke="#A0E7C5" strokeWidth="6" strokeLinecap="round" />
        <circle cx="14" cy="40" r="7" fill="#FFFDF9" stroke="#3D2C3E" strokeWidth="2.6" />
        <circle cx="50" cy="40" r="7" fill="#FFFDF9" stroke="#3D2C3E" strokeWidth="2.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M22 10L28 28H36L42 10H22Z" fill="#C2E7FF" stroke="#3D2C3E" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="32" cy="40" r="16" fill="#FFE066" stroke="#3D2C3E" strokeWidth="3" />
      <path
        d="M32 30L34.7 35.6L40.8 36.5L36.4 40.8L37.4 46.9L32 44L26.6 46.9L27.6 40.8L23.2 36.5L29.3 35.6L32 30Z"
        fill="#FFFDF9"
        stroke="#3D2C3E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ConfettiBurst: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  const particles = [
    { left: '14%', color: '#FF8FB1', delay: '0ms', symbol: '🎀' },
    { left: '28%', color: '#FFE066', delay: '60ms', symbol: '⭐' },
    { left: '42%', color: '#A0E7C5', delay: '30ms', symbol: '🌸' },
    { left: '56%', color: '#93D1FA', delay: '90ms', symbol: '✨' },
    { left: '70%', color: '#C7A9F7', delay: '40ms', symbol: '🍬' },
    { left: '84%', color: '#FF8FB1', delay: '110ms', symbol: '⭐' },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center overflow-hidden h-44" aria-hidden="true">
      <div className="relative w-full max-w-2xl h-full">
        {particles.map((p, idx) => (
          <span
            key={idx}
            style={{ left: p.left, animationDelay: p.delay }}
            className="absolute top-0 text-2xl animate-confetti select-none"
          >
            {p.symbol}
          </span>
        ))}
      </div>
    </div>
  );
};

export const KawaiiMagicWandIcon: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9',
}) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path
      d="M14 50L36 28"
      stroke="#3D2C3E"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M14 50L36 28"
      stroke="#FF8FB1"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M40 8L44.2 17.2L54 18.6L46.8 25.5L48.6 35.4L40 30.7L31.4 35.4L33.2 25.5L26 18.6L35.8 17.2L40 8Z"
      fill="#FFE066"
      stroke="#3D2C3E"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="18" r="3" fill="#C2E7FF" stroke="#3D2C3E" strokeWidth="2" />
    <circle cx="53" cy="38" r="2.6" fill="#D4F8E8" stroke="#3D2C3E" strokeWidth="2" />
    <circle cx="26" cy="48" r="2.2" fill="#E5D4FF" stroke="#3D2C3E" strokeWidth="1.8" />
  </svg>
);

export const MASCOT_LOGO_SRC = '/assets/aistudio/Gatinho_kawaii_a_ler_com_ternura_670f95ac.png';

export type CartoonMouseMood = 'idle' | 'happy' | 'celebrate' | 'oops' | 'thinking' | 'party';

export const KawaiiCartoonMouse: React.FC<{
  mood?: CartoonMouseMood;
  className?: string;
}> = ({ mood = 'idle', className = 'w-28 h-28' }) => {
  const isCelebrate = mood === 'celebrate' || mood === 'party';
  const isOops = mood === 'oops';
  const isThinking = mood === 'thinking';

  const ringClass = isCelebrate
    ? 'border-[#34B37D] ring-4 ring-[#FFF4BD] bg-[#D4F8E8]'
    : isOops
    ? 'border-[#F4729B] ring-4 ring-[#FFD6E0] bg-[#FFE5EC]'
    : isThinking
    ? 'border-[#9E77ED] ring-4 ring-[#E5D4FF] bg-[#F4EEFF]'
    : 'border-[#86CBFA] ring-4 ring-[#C2E7FF]/60 bg-[#FFFDF9]';

  const animClass = isCelebrate
    ? 'animate-bounce'
    : isOops
    ? 'animate-wobble'
    : '';

  const emotionBadge =
    mood === 'party'
      ? '🥳'
      : mood === 'celebrate'
      ? '🤩'
      : isOops
      ? '😅'
      : isThinking
      ? '💡'
      : mood === 'happy'
      ? '😊'
      : '✨';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className} ${animClass}`}>
      {mood === 'party' && (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-xl sm:text-2xl drop-shadow-xs select-none"
        >
          👑
        </span>
      )}

      <div className={`w-full h-full rounded-full overflow-hidden border-3 shadow-sm transition-all ${ringClass}`}>
        <img
          src={MASCOT_LOGO_SRC}
          alt="Mascote Gatinha Mágica"
          className={`w-full h-full object-cover object-center transition-transform duration-300 ${
            isCelebrate ? 'scale-110' : isOops ? 'scale-95 rotate-[-4deg]' : 'scale-105'
          }`}
        />
      </div>

      {/* Emotional reaction floating badge */}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 -right-1 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-[#3D2C3E]/15 shadow-xs flex items-center justify-center text-sm sm:text-base select-none"
      >
        {emotionBadge}
      </span>

      {isCelebrate && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -left-1 z-10 text-sm sm:text-base select-none"
        >
          ⭐
        </span>
      )}
      {isOops && (
        <span
          aria-hidden="true"
          className="absolute top-0 -right-1 z-10 text-sm select-none"
        >
          💧
        </span>
      )}
    </div>
  );
};

