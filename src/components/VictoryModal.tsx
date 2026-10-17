/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Star } from 'lucide-react';
import { RunStats } from '../game/types.ts';

interface VictoryModalProps {
  stats: RunStats;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none select-none">
      <div className="w-full max-w-md bg-neutral-950 border-2 border-amber-500/80 p-6 rounded shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col items-center text-center">
        {/* Banner */}
        <div className="text-amber-500 font-pixel text-xs tracking-widest uppercase mb-1">
          KỲ THI HOÀN TẤT
        </div>
        <h2 className="font-pixel text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 mb-4">
          VƯỢT ẢI THÀNH CÔNG!
        </h2>

        {/* 3-Star Rating */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-lg border ${
                starIdx <= stats.stars
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-600'
              } transition-all`}
            >
              <Star className="w-6 h-6 fill-current" />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6 text-left">
          {/* Time */}
          <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
            <div className="text-[10px] font-pixel text-neutral-400 mb-1">THỜI GIAN</div>
            <div className="font-mono text-base font-bold text-neutral-200 tabular-nums">
              {stats.timeTaken}s
            </div>
          </div>

          {/* Scrolls */}
          <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
            <div className="text-[10px] font-pixel text-neutral-400 mb-1">BÍ KÍP THU THẬP</div>
            <div className="font-mono text-base font-bold text-amber-400 tabular-nums">
              {stats.scrollsCollected} / {stats.totalScrolls} 📜
            </div>
          </div>

          {/* Enemies Defeated */}
          <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
            <div className="text-[10px] font-pixel text-neutral-400 mb-1">QUÁI BỊ HẠ</div>
            <div className="font-mono text-base font-bold text-red-400 tabular-nums">
              {stats.enemiesDefeated} mục tiêu
            </div>
          </div>

          {/* Total Score */}
          <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
            <div className="text-[10px] font-pixel text-neutral-400 mb-1">TỔNG ĐIỂM SỐ</div>
            <div className="font-mono text-base font-bold text-yellow-300 tabular-nums">
              {stats.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {hasNextLevel ? (
            <button
              data-start="true"
              onClick={onNextLevel}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-pixel text-xs font-bold rounded border border-amber-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Màn Kế Tiếp</span>
            </button>
          ) : (
            <div className="py-2 px-4 bg-amber-500/20 border border-amber-400/50 rounded font-pixel text-xs text-amber-300 mb-1">
              🎉 CHÚC MỪNG! BẠN ĐÃ TỐT NGHIỆP TRỞ THÀNH THƯỢNG NHẪN JONIN!
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onReplay}
              className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-pixel text-[11px] rounded border border-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi Lại</span>
            </button>

            <button
              onClick={onHome}
              className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 font-pixel text-[11px] rounded border border-neutral-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Về Trang Chủ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
