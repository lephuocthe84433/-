/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Home } from 'lucide-react';
import { RunStats } from '../game/types.ts';

interface GameOverModalProps {
  stats: RunStats;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRetry,
  onHome,
}) => {
  // Helpful ninja tips based on level
  const tips = [
    'Tận dụng cú Nhảy Đôi (Nhấn Space khi đang trên không) để vượt qua những hố gai rộng!',
    'Khi bám vào vách tường thẳng đứng, ninja sẽ trượt chậm. Nhấn Space để đạp tường bật nhảy ngược lại!',
    'Dùng thuật Thế Thân [Shift / Lướt] để lướt nhanh bất tử qua bẫy cưa và ngọn lửa!',
    'Kiếm katana [J] có thể chém phản ngược lại phi tiêu của ninja địch!',
  ];
  const tip = tips[(stats.levelId - 1) % tips.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-none select-none">
      <div className="w-full max-w-md bg-neutral-950 border-2 border-red-700 p-6 rounded shadow-[0_0_30px_rgba(220,38,38,0.3)] flex flex-col items-center text-center">
        {/* Banner */}
        <div className="text-red-500 font-pixel text-xs tracking-widest uppercase mb-1">
          THỬ THÁCH THẤT BẠI
        </div>
        <h2 className="font-pixel text-2xl text-red-500 mb-3 drop-shadow">
          NINJA BỊ ĐÁNH BẠI
        </h2>

        {/* Progress stats */}
        <div className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded mb-4 text-left font-pixel text-xs">
          <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-300">
            <span className="text-neutral-400">Ải Thử Thách:</span>
            <span>{stats.levelName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-300">
            <span className="text-neutral-400">Thời Gian Trụ Được:</span>
            <span className="font-mono">{stats.timeTaken}s</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-300">
            <span className="text-neutral-400">Bí Kíp Đã Lấy:</span>
            <span className="font-mono text-amber-400">{stats.scrollsCollected} / {stats.totalScrolls}</span>
          </div>
          <div className="flex justify-between py-1 text-neutral-300">
            <span className="text-neutral-400">Điểm Đạt Được:</span>
            <span className="font-mono text-yellow-400">{stats.score.toLocaleString()}</span>
          </div>
        </div>

        {/* Ninja Sensei Tip */}
        <div className="w-full bg-amber-950/40 border border-amber-700/50 p-3 rounded mb-6 text-left">
          <div className="font-pixel text-[10px] text-amber-400 mb-1 flex items-center gap-1.5">
            <span>💡</span>
            <span>LỜI KHUYÊN SƯ PHỤ:</span>
          </div>
          <p className="font-retro text-base text-amber-200/90 leading-tight">
            {tip}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            data-start="true"
            onClick={onRetry}
            className="w-full py-3 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-pixel text-xs font-bold rounded border border-red-500 flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử Lại Ngay [R]</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-pixel text-xs rounded border border-neutral-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về Màn Hình Chính</span>
          </button>
        </div>
      </div>
    </div>
  );
};
