/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Play, Star } from 'lucide-react';
import { LEVELS } from '../game/levels.ts';

interface LevelSelectModalProps {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none select-none">
      <div className="w-full max-w-lg bg-neutral-950 border-2 border-amber-600/70 p-6 rounded shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rotate-45 inline-block" />
            <h2 className="font-pixel text-base text-amber-400">CHỌN ẢI HUẤN LUYỆN</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng chọn màn"
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level List */}
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {LEVELS.map((lvl) => {
            const isUnlocked = lvl.id <= unlockedLevel;
            const stars = levelStars[lvl.id] || 0;

            return (
              <div
                key={lvl.id}
                className={`p-3.5 rounded border transition-all flex items-center justify-between ${
                  isUnlocked
                    ? 'bg-neutral-900/90 border-neutral-700 hover:border-amber-500/80'
                    : 'bg-neutral-950/60 border-neutral-800 opacity-60'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs text-red-500 font-bold">ẢI {lvl.id}</span>
                    <span className="font-pixel text-xs text-neutral-200 font-bold">{lvl.name}</span>
                  </div>
                  <span className="font-retro text-base text-neutral-400 mt-0.5 line-clamp-1">
                    {lvl.subtitle}
                  </span>

                  {/* Stars earned */}
                  {isUnlocked && (
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => onSelectLevel(lvl.id)}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-pixel text-[11px] rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Vào Ải</span>
                  </button>
                ) : (
                  <span className="font-pixel text-[10px] text-neutral-600 bg-neutral-900 px-3 py-1 rounded border border-neutral-800">
                    Khóa
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
