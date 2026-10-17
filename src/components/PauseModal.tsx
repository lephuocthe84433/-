/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/audio.ts';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none select-none">
      <div className="w-full max-w-sm bg-neutral-950 border-2 border-amber-600/70 p-6 rounded shadow-2xl flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="font-pixel text-xl text-amber-400 mb-1">TẠM DỪNG</h2>
        <div className="font-pixel text-[10px] text-neutral-400 mb-6">
          NINJA ĐANG ĐIỀU KHÍ DƯỠNG SỨC
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onResume}
            className="w-full py-3 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-pixel text-xs rounded border border-red-500 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Tiếp Tục [P / Esc]</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-pixel text-xs rounded border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Màn [R]</span>
          </button>

          <button
            onClick={toggleSound}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-pixel text-xs rounded border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh'} [M]</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 font-pixel text-xs rounded border border-neutral-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về Màn Hình Chính</span>
          </button>
        </div>
      </div>
    </div>
  );
};
