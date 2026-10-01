import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Precision Monogram Shield Icon */}
      <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/30 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Hex Path */}
          <path
            d="M100 20 L170 60 V120 C170 155 140 180 100 190 C60 180 30 155 30 120 V60 L100 20 Z"
            stroke="#10b981"
            strokeWidth="12"
            strokeLinejoin="round"
          />
          {/* Inner Interlocking V-S Graphic */}
          <path
            d="M50 75 L85 130 L115 50"
            stroke="#34d399"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M145 90 H105 L145 135 H95"
            stroke="#059669"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className="font-extrabold tracking-tight text-white text-lg">
          Veri<span className="text-emerald-400">Scrub</span>
        </span>
        <span className="text-[9px] tracking-[0.2em] font-mono uppercase text-slate-400 mt-1">
          Zero-Trust Media
        </span>
      </div>
    </div>
  );
}
