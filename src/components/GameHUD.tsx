/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Pause, RotateCcw } from 'lucide-react';
import { sound } from '../game/audio.ts';

interface GameHUDProps {
  hp: number;
  maxHp: number;
  chakra: number;
  maxChakra: number;
  shurikens: number;
  maxShurikens: number;
  score: number;
  scrolls: number;
  totalScrolls: number;
  time: number;
  levelName: string;
  bossHp?: number;
  bossMaxHp?: number;
  onPause: () => void;
  onRestart: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  hp,
  maxHp,
  chakra,
  maxChakra,
  shurikens,
  score,
  scrolls,
  totalScrolls,
  time,
  levelName,
  bossHp,
  bossMaxHp,
  onPause,
  onRestart,
}) => {
  const [ghostHp, setGhostHp] = useState<number>(hp);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  // Delayed trailing damage ghost bar animation
  useEffect(() => {
    if (hp < ghostHp) {
      const timer = setTimeout(() => {
        setGhostHp(hp);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setGhostHp(hp);
    }
  }, [hp, ghostHp]);

  const toggleSound = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const ghostPercent = Math.max(0, Math.min(100, (ghostHp / maxHp) * 100));
  const chakraPercent = Math.max(0, Math.min(100, (chakra / maxChakra) * 100));

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 select-none">
      {/* Top HUD Row */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: Ninja Health, Chakra & Status */}
        <div className="flex flex-col gap-1.5 bg-neutral-950/85 border border-amber-900/40 p-2.5 rounded shadow-lg backdrop-blur-none max-w-xs sm:max-w-sm pointer-events-auto">
          {/* Level Badge */}
          <div className="flex items-center justify-between text-xs font-pixel text-amber-400">
            <span className="truncate">{levelName}</span>
            <span className="text-neutral-400 font-mono text-[11px] tabular-nums">
              ⏱ {Math.floor(time / 60)}:{Math.floor(time % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Health Bar (Sinh Lực HP) */}
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-red-400 w-7">HP</span>
            <div className="relative flex-1 h-3.5 bg-neutral-900 border border-neutral-700 rounded-sm overflow-hidden">
              {/* Trailing damage ghost bar */}
              <div
                className="absolute inset-y-0 left-0 bg-red-800/80 transition-all duration-300"
                style={{ width: `${ghostPercent}%` }}
              />
              {/* Active HP bar */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-100"
                style={{ width: `${hpPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-pixel text-white/90 drop-shadow">
                {hp}/{maxHp}
              </span>
            </div>
          </div>

          {/* Chakra Bar (Năng Lượng MP) */}
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-sky-400 w-7">MP</span>
            <div className="relative flex-1 h-2.5 bg-neutral-900 border border-neutral-700 rounded-sm overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-100"
                style={{ width: `${chakraPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-pixel text-white/80">
                {chakra}/{maxChakra}
              </span>
            </div>
          </div>

          {/* Shuriken ammo & Secret Scrolls row */}
          <div className="flex items-center justify-between pt-1 text-[10px] font-pixel">
            {/* Shurikens */}
            <div className="flex items-center gap-1.5 text-cyan-300">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
              </svg>
              <span className="tabular-nums font-bold">x{shurikens}</span>
            </div>

            {/* Scrolls (Mật Bí Kíp) */}
            <div className="flex items-center gap-1 text-amber-300">
              <span>Bí kíp:</span>
              <div className="flex gap-0.5">
                {[...Array(totalScrolls)].map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block w-3 h-3 text-center leading-3 ${
                      i < scrolls ? 'text-amber-400 scale-110 drop-shadow' : 'text-neutral-600'
                    }`}
                  >
                    📜
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Center: Boss Health Bar (if active) */}
        {bossHp !== undefined && bossMaxHp !== undefined && (
          <div className="flex flex-col items-center max-w-sm w-full mx-4 pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-950/90 border border-red-600/60 rounded shadow">
              <span className="font-pixel text-xs text-red-400 animate-pulse">⚔ THỦ LĨNH RYU ⚔</span>
              <span className="font-mono text-xs text-neutral-300 tabular-nums">
                {Math.max(0, bossHp)} / {bossMaxHp}
              </span>
            </div>
            <div className="w-full h-3 bg-neutral-900 border border-red-800 rounded mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 transition-all duration-150"
                style={{ width: `${Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* Top-Right: Score & Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Score Tile */}
          <div className="bg-neutral-950/85 border border-amber-900/40 px-3 py-2 rounded text-right">
            <div className="text-[9px] font-pixel text-neutral-400">ĐIỂM SỐ</div>
            <div className="text-sm sm:text-base font-pixel text-amber-400 tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleSound}
            tabIndex={-1}
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="w-9 h-9 flex items-center justify-center bg-neutral-900/90 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Restart Button */}
          <button
            onClick={(e) => {
              e.currentTarget.blur();
              onRestart();
            }}
            tabIndex={-1}
            aria-label="Chơi lại màn"
            className="w-9 h-9 flex items-center justify-center bg-neutral-900/90 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Pause Button */}
          <button
            onClick={(e) => {
              e.currentTarget.blur();
              onPause();
            }}
            tabIndex={-1}
            aria-label="Tạm dừng game"
            className="w-9 h-9 flex items-center justify-center bg-neutral-900/90 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded transition-colors"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Hint Banner for Desktop Keys */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-[10px] font-pixel text-neutral-400 bg-neutral-950/70 py-1 px-4 rounded-full mx-auto border border-neutral-800/80">
        <span>A/D hoặc ⬅️/➡️: Chạy</span>
        <span>Space / W: Nhảy đôi</span>
        <span>J / Z: Chém kiếm</span>
        <span>K / X: Phi tiêu</span>
        <span>Shift / L: Thế thân Lướt</span>
      </div>
    </div>
  );
};
