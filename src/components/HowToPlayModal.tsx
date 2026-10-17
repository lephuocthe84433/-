/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none select-none">
      <div className="w-full max-w-xl bg-neutral-950 border-2 border-amber-600/70 p-6 rounded shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4 sticky top-0 bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-base text-amber-400">📜 BÍ KÍP NHẪN THUẬT HIROSAKI</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng bí kíp"
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-neutral-300">
          {/* Controls table */}
          <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded">
            <div className="font-pixel text-xs text-red-400 mb-3">1. PHÍM ĐIỀU KHIỂN CƠ BẢN</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-amber-400 font-pixel text-[10px] block mb-0.5">A / D hoặc ⬅️ / ➡️</span>
                <span className="text-neutral-300">Chạy nước rút ninja</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-emerald-400 font-pixel text-[10px] block mb-0.5">SPACE / W hoặc ⬆️</span>
                <span className="text-neutral-300">Nhảy cao / Nhấn lại để Nhảy Đôi</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-rose-400 font-pixel text-[10px] block mb-0.5">J hoặc Z</span>
                <span className="text-neutral-300">Chém kiếm cận chiến & gạt phi tiêu</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-cyan-400 font-pixel text-[10px] block mb-0.5">K hoặc X</span>
                <span className="text-neutral-300">Phóng phi tiêu shuriken tầm xa</span>
              </div>
              <div className="bg-neutral-950 p-2 rounded border border-neutral-800 col-span-2">
                <span className="text-amber-400 font-pixel text-[10px] block mb-0.5">SHIFT hoặc L</span>
                <span className="text-neutral-300">Thuật Thế Thân (Kawarimi): Hoá thành khúc gỗ lướt bất tử xuyên bẫy (Tốn MP)</span>
              </div>
            </div>
          </div>

          {/* Jutsu mechanics */}
          <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded">
            <div className="font-pixel text-xs text-amber-400 mb-3">2. KỸ THUẬT VƯỢT ĐỊA HÌNH</div>
            <ul className="space-y-2 text-xs font-retro text-base text-neutral-300 list-disc pl-4">
              <li>
                <strong className="text-white">Đạp Tường (Wall Jump):</strong> Khi nhảy chạm vào vách tường thẳng đứng, ninja sẽ bám trượt chậm lại. Nhấn <span className="text-amber-300 font-bold">Space</span> ngay lúc đó để đạp tường bật sang hướng ngược lại.
              </li>
              <li>
                <strong className="text-white">Nệm Nhún Lò Xo:</strong> Đạp chân lên các bục lò xo màu đỏ để được hất bổng lên các tầng kiến trúc cao.
              </li>
              <li>
                <strong className="text-white">Ván Gỗ Sụp Lở:</strong> Những thanh gỗ màu nâu đậm sẽ rung lắc và rơi sau 0.6 giây khi bạn dẫm lên. Hãy nhảy nhanh không dừng lại!
              </li>
              <li>
                <strong className="text-white">Bẫy Lửa Phun:</strong> Đầu rồng đá sẽ phát ra tia lửa cảnh báo trong 0.7 giây trước khi phun trào cột lửa cực mạnh.
              </li>
              <li>
                <strong className="text-white">Phản Đòn Phi Tiêu:</strong> Vung kiếm Katana [J] đúng thời điểm phi tiêu của kẻ địch bay đến sẽ chém dội ngược phi tiêu lại chúng!
              </li>
            </ul>
          </div>

          {/* Collectibles */}
          <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded">
            <div className="font-pixel text-xs text-yellow-400 mb-2">3. VẬT PHẨM & MỤC TIÊU</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-retro text-base">
              <div className="flex items-center gap-2">
                <span className="text-lg">📜</span>
                <span><strong>Bí Kíp Thượng Thừa:</strong> 3 cuốn mỗi màn, thu thập đủ để đạt 3 sao hoàn hảo.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🍙</span>
                <span><strong>Cơm Nắm Onigiri:</strong> Hồi phục 40 điểm sinh lực (HP).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🪙</span>
                <span><strong>Tiền Xu Cổ:</strong> Tăng điểm số thành tích.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span><strong>Túi Phi Tiêu:</strong> Bổ sung 5 phi tiêu dự trữ.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-4 mt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-pixel text-xs rounded border border-neutral-600 cursor-pointer"
          >
            ĐÃ HIỂU
          </button>
        </div>
      </div>
    </div>
  );
};
