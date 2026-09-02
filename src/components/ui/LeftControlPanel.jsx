import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Activity, 
  Flower2, 
  Sparkles, 
  Play, 
  Pause, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PARAMETERS, DEPTH_LEVELS } from '../../data/oceanData';

export default function LeftControlPanel({
  selectedParam,
  setSelectedParam,
  depth,
  setDepth,
  timeHour,
  setTimeHour,
  isPlaying,
  setIsPlaying,
  simSpeed,
  setSimSpeed
}) {
  const paramIcons = {
    sst: Thermometer,
    salinity: Droplets,
    currents: Wind,
    wave: Activity,
    chlorophyll: Flower2,
    oxygen: Sparkles
  };

  const formatTime = (h) => {
    const hh = String(Math.floor(h)).padStart(2, '0');
    const mm = String(Math.floor((h % 1) * 60)).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return (
    <aside className="w-72 h-full flex flex-col gap-3 p-3 select-none overflow-y-auto z-20">
      {/* 1. Parameters Selection Card */}
      <div className="glass-panel rounded-2xl p-3.5 border border-sky-500/20">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
            Parameters
          </span>
          <span className="text-[10px] text-sky-400/80 font-mono">6 Variables</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {Object.values(PARAMETERS).map((param) => {
            const Icon = paramIcons[param.id] || Activity;
            const isSelected = selectedParam === param.id;

            return (
              <button
                key={param.id}
                onClick={() => setSelectedParam(param.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-600/90 to-blue-700/90 text-white shadow-glow-cyan border border-cyan-400/50'
                    : 'bg-[#0a1838]/60 text-slate-300 hover:bg-[#112450]/80 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-400/20 text-cyan-300' : 'bg-sky-500/10 text-sky-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold leading-tight">{param.name}</div>
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'text-cyan-200 bg-sky-900/50' : 'text-slate-400'}`}>
                  {param.unit}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Stepped Depth (m) Vertical Slider Card */}
      <div className="glass-panel rounded-2xl p-3.5 border border-sky-500/20">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
            Depth (m)
          </span>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">
            {depth} m
          </span>
        </div>

        {/* Stepped vertical depth track */}
        <div className="relative flex flex-col gap-1.5 pl-3 py-1">
          {/* Vertical line connector */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-sky-900/80 -z-0" />
          
          {DEPTH_LEVELS.map((lvl) => {
            const isCurrent = depth === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setDepth(lvl)}
                className="relative z-10 flex items-center gap-3 text-left py-0.5 group transition-colors"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-cyan-400 border-white shadow-glow-cyan scale-125'
                      : 'bg-[#081530] border-sky-600 group-hover:border-cyan-400 group-hover:scale-110'
                  }`}
                >
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-[#030712]" />}
                </div>
                <span
                  className={`text-xs font-mono transition-colors ${
                    isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Time Scrubber & Playback Card */}
      <div className="glass-panel rounded-2xl p-3.5 border border-sky-500/20">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
            Time
          </span>
          <span className="text-xs font-mono text-cyan-300 font-semibold">
            {formatTime(timeHour)} UTC
          </span>
        </div>

        {/* Date Selector Badge */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-3 bg-[#0a1838]/80 border border-sky-500/20 rounded-xl text-xs text-sky-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>15 Aug 2026</span>
          </div>
          <button className="text-[11px] text-cyan-400 hover:underline">Change</button>
        </div>

        {/* Scrubber Range Slider */}
        <div className="px-1 mb-2">
          <input
            type="range"
            min="0"
            max="23"
            step="0.25"
            value={timeHour}
            onChange={(e) => setTimeHour(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-sky-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Playback Controls & Speed */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 transition-all flex items-center justify-center shadow-glow-cyan"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
          </button>

          <div className="flex items-center gap-1 bg-[#091636] p-1 rounded-xl border border-sky-500/20 text-[11px] font-mono">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                  simSpeed === spd
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-sky-300 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
