/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Map, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/audio.ts';

interface TitleScreenProps {
  onStart: () => void;
  onOpenLevelSelect: () => void;
  onOpenHowToPlay: () => void;
  highScore: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenLevelSelect,
  onOpenHowToPlay,
  highScore,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-950 select-none overflow-hidden">
      {/* Background Japanese Aesthetic Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {/* Giant Red Sun / Moon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-red-600/30 to-amber-600/10 blur-xl" />
        {/* Pagoda Silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-neutral-950/80 to-transparent" />
      </div>

      {/* Top Bar */}
      <div className="w-full flex items-center justify-between max-w-4xl relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-sm rotate-45 inline-block shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
          <span className="font-pixel text-xs sm:text-sm font-bold text-amber-400 tracking-wider">
            LÀNG GIÓ · HIROSAKI ACADEMY
          </span>
        </div>
        <div className="flex items-center gap-4">
          {highScore > 0 && (
            <div className="font-pixel text-xs sm:text-sm text-amber-300 bg-neutral-900/90 border border-amber-600/40 px-3 py-1 rounded">
              KỶ LỤC: <span className="tabular-nums font-mono font-bold text-amber-400">{highScore.toLocaleString()}</span>
            </div>
          )}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 rounded cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Center Hero Title Lockup */}
      <div className="flex flex-col items-center text-center my-auto max-w-2xl relative z-10">
        {/* Japanese Calligraphy Kicker */}
        <div className="font-pixel text-xs sm:text-sm font-bold text-red-500 tracking-[0.3em] mb-2 uppercase flex items-center gap-2">
          <span className="text-amber-500">⚔</span>
          <span>SHINOBI TRIALS · NHẬP MÔN NHẪN GIẢ</span>
          <span className="text-amber-500">⚔</span>
        </div>

        {/* Big Pixel Art Title Lockup */}
        <div className="relative mb-3">
          <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-amber-300 drop-shadow-[0_4px_16px_rgba(239,68,68,0.5)] tracking-wider">
            NINJA SCHOOL
          </h1>
          <div className="text-[11px] font-pixel text-red-400/80 tracking-widest mt-1">
            BẢN HÙNG CA NHẪN GIẢ VIỆT
          </div>
        </div>

        <div className="inline-block px-4 py-1.5 bg-neutral-900/90 border border-amber-600/50 rounded font-pixel text-xs sm:text-sm text-amber-300 mb-8 shadow-md">
          ⚔ THỬ THÁCH VƯỢT CẠM BẪY & ĐẤU TRÙM ⚔
        </div>

        {/* Primary Start CTA Button with data-start="true" */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            data-start="true"
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:from-red-600 hover:to-red-400 active:scale-95 text-white font-pixel text-sm sm:text-base font-bold rounded shadow-[0_0_25px_rgba(220,38,38,0.6)] border-2 border-red-400 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>BẮT ĐẦU LUYỆN TẬP</span>
          </button>
        </div>

        {/* Secondary Menu Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onOpenLevelSelect}
            className="px-5 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 font-pixel text-xs sm:text-sm font-semibold border border-neutral-700 hover:border-amber-500/60 rounded flex items-center gap-2 transition-colors cursor-pointer shadow"
          >
            <Map className="w-4 h-4 text-amber-400" />
            <span>Chọn Màn</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="px-5 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 font-pixel text-xs sm:text-sm font-semibold border border-neutral-700 hover:border-cyan-500/60 rounded flex items-center gap-2 transition-colors cursor-pointer shadow"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Bí Kíp Nhẫn Thuật</span>
          </button>
        </div>
      </div>

      {/* Non-interactive borderless control hint at bottom */}
      <div className="text-center text-[10px] sm:text-xs font-pixel text-neutral-400 tracking-wider relative z-10 bg-neutral-950/70 py-1.5 px-4 rounded-full border border-neutral-800/80">
        WASD/Mũi tên Di chuyển · Space Nhảy Đôi · J Chém Kiếm · K Phi Tiêu · Shift Lướt Thế Thân
      </div>
    </div>
  );
};
