import React from 'react';
import { PARAMETERS } from '../../data/oceanData';
import { generateParameterThumbnail } from '../canvas/proceduralTextures';
import { Plus, Minus } from 'lucide-react';

export default function BottomParameterStrip({ selectedParam, setSelectedParam }) {
  return (
    <footer className="h-28 px-5 pb-3 pt-1 flex items-center justify-between gap-3 z-30 select-none">
      {/* 1. 6-Parameter Quick Preview Cards */}
      <div className="flex items-center gap-2.5 flex-1 overflow-x-auto py-1">
        {Object.values(PARAMETERS).map((param) => {
          const isSelected = selectedParam === param.id;
          const thumbUrl = generateParameterThumbnail(param.id);

          return (
            <button
              key={param.id}
              onClick={() => setSelectedParam(param.id)}
              className={`relative flex-1 min-w-[145px] max-w-[195px] h-20 rounded-2xl p-2.5 text-left transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel glow-border-cyan border-cyan-400/80 scale-[1.02]'
                  : 'glass-panel-subtle hover:border-sky-500/40 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Background Thumbnail Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 rounded-2xl pointer-events-none"
                style={{ backgroundImage: `url(${thumbUrl})` }}
              />

              {/* Title & Unit */}
              <div className="relative z-10 flex items-center justify-between">
                <span className={`text-[11px] font-bold truncate leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {param.name}
                </span>
                <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-cyan-500/30 text-cyan-200' : 'text-slate-400'}`}>
                  {param.unit}
                </span>
              </div>

              {/* Gradient Preview Line */}
              <div className="relative z-10 w-full">
                <div
                  className="h-1.5 w-full rounded-full border border-white/20 shadow-inner"
                  style={{ background: param.gradientCss }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Interactive Global / Regional Mini-Map */}
      <div className="relative w-64 h-20 rounded-2xl glass-panel border border-sky-500/30 overflow-hidden flex items-center justify-center shadow-cockpit group">
        {/* Realistic Satellite Texture for Indian Ocean */}
        <div className="absolute inset-0 bg-[#07193b]">
          <svg viewBox="0 0 200 80" className="w-full h-full opacity-75">
            {/* Indian Subcontinent */}
            <path d="M 40 10 L 80 8 L 95 25 L 75 65 L 60 70 L 45 45 Z" fill="#2d422a" stroke="#4ade80" strokeWidth="0.8" />
            {/* Myanmar / Indochina */}
            <path d="M 115 15 L 140 12 L 148 40 L 140 70 L 125 55 L 120 30 Z" fill="#2d422a" stroke="#4ade80" strokeWidth="0.8" />
            {/* Sri Lanka */}
            <circle cx="68" cy="72" r="3" fill="#365332" />
            {/* Andaman Islands */}
            <path d="M 118 42 L 120 58" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Active Viewport Bounding Box (Bay of Bengal) */}
        <div className="absolute left-[36%] top-[16%] w-[32%] h-[68%] border-2 border-cyan-400 rounded bg-cyan-500/20 shadow-glow-cyan flex items-center justify-center animate-pulse">
          <span className="text-[8px] font-mono text-cyan-200 font-bold tracking-tighter">Active</span>
        </div>

        {/* Mini-map Controls */}
        <div className="absolute top-1 right-1 flex flex-col gap-1 z-10">
          <button className="p-1 rounded bg-[#061026]/90 text-sky-300 hover:text-white border border-sky-500/20 text-[10px]">
            <Plus className="w-3 h-3" />
          </button>
          <button className="p-1 rounded bg-[#061026]/90 text-sky-300 hover:text-white border border-sky-500/20 text-[10px]">
            <Minus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
