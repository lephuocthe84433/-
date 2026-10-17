/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameEngine } from '../game/engine.ts';

interface TouchControlsProps {
  engine: GameEngine | null;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ engine }) => {
  if (!engine) return null;

  const handleTouchStart = (key: string) => {
    if (!engine) return;
    engine.handleKeyDown(key);
  };

  const handleTouchEnd = (key: string) => {
    if (!engine) return;
    engine.handleKeyUp(key);
  };

  return (
    <div className="fixed inset-x-0 bottom-3 px-4 flex items-end justify-between pointer-events-none z-30 select-none md:hidden">
      {/* Left / Right D-Pad */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          type="button"
          aria-label="Di chuyển trái"
          onPointerDown={() => handleTouchStart('ArrowLeft')}
          onPointerUp={() => handleTouchEnd('ArrowLeft')}
          onPointerLeave={() => handleTouchEnd('ArrowLeft')}
          className="w-14 h-14 bg-neutral-900/80 active:bg-neutral-700/90 border-2 border-neutral-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold active:scale-95 transition-transform touch-none shadow-lg"
        >
          ◀
        </button>
        <button
          type="button"
          aria-label="Di chuyển phải"
          onPointerDown={() => handleTouchStart('ArrowRight')}
          onPointerUp={() => handleTouchEnd('ArrowRight')}
          onPointerLeave={() => handleTouchEnd('ArrowRight')}
          className="w-14 h-14 bg-neutral-900/80 active:bg-neutral-700/90 border-2 border-neutral-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold active:scale-95 transition-transform touch-none shadow-lg"
        >
          ▶
        </button>
      </div>

      {/* Action Buttons: Jump, Slash, Shuriken, Dash */}
      <div className="flex items-end gap-2 pointer-events-auto">
        {/* Dash (Kawarimi) */}
        <button
          type="button"
          aria-label="Thế thân lướt"
          onPointerDown={() => handleTouchStart('ShiftLeft')}
          onPointerUp={() => handleTouchEnd('ShiftLeft')}
          onPointerLeave={() => handleTouchEnd('ShiftLeft')}
          className="w-12 h-12 bg-amber-900/80 active:bg-amber-700/90 border-2 border-amber-600 rounded-full flex flex-col items-center justify-center text-amber-200 text-[10px] font-pixel active:scale-95 transition-transform touch-none shadow-lg mb-2"
        >
          <span>💨</span>
          <span>LƯỚT</span>
        </button>

        {/* Shuriken */}
        <button
          type="button"
          aria-label="Phóng phi tiêu"
          onPointerDown={() => handleTouchStart('KeyK')}
          onPointerUp={() => handleTouchEnd('KeyK')}
          onPointerLeave={() => handleTouchEnd('KeyK')}
          className="w-12 h-12 bg-sky-900/80 active:bg-sky-700/90 border-2 border-sky-600 rounded-full flex flex-col items-center justify-center text-sky-200 text-[9px] font-pixel active:scale-95 transition-transform touch-none shadow-lg mb-4"
        >
          <span>⭐</span>
          <span>TIÊU</span>
        </button>

        {/* Katana Slash */}
        <button
          type="button"
          aria-label="Chém kiếm katana"
          onPointerDown={() => handleTouchStart('KeyJ')}
          onPointerUp={() => handleTouchEnd('KeyJ')}
          onPointerLeave={() => handleTouchEnd('KeyJ')}
          className="w-14 h-14 bg-red-900/80 active:bg-red-700/90 border-2 border-red-600 rounded-full flex flex-col items-center justify-center text-red-200 text-[10px] font-pixel active:scale-95 transition-transform touch-none shadow-lg"
        >
          <span>🗡️</span>
          <span>CHÉM</span>
        </button>

        {/* Jump */}
        <button
          type="button"
          aria-label="Nhảy nhẫn giả"
          onPointerDown={() => handleTouchStart('Space')}
          onPointerUp={() => handleTouchEnd('Space')}
          onPointerLeave={() => handleTouchEnd('Space')}
          className="w-16 h-16 bg-emerald-900/85 active:bg-emerald-700/90 border-2 border-emerald-500 rounded-full flex flex-col items-center justify-center text-emerald-200 text-xs font-pixel active:scale-95 transition-transform touch-none shadow-xl ml-1"
        >
          <span>▲</span>
          <span>NHẢY</span>
        </button>
      </div>
    </div>
  );
};
