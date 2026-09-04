import React from 'react';
import { X, Radio, Clock, MapPin } from 'lucide-react';

export default function BuoyDetailModal({ buoy, onClose }) {
  if (!buoy) return null;

  const chartW = 280;
  const chartH = 120;
  const profile = buoy.depthProfile || [];

  const minT = 0;
  const maxT = 32;
  const maxD = 2000;

  const points = profile.map((pt) => {
    const x = ((pt.temp - minT) / (maxT - minT)) * (chartW - 40) + 30;
    const y = (pt.depth / maxD) * (chartH - 25) + 15;
    return { x, y, ...pt };
  });

  const path = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="glass-panel rounded-3xl p-6 border border-sky-400/40 shadow-glow-blue max-w-lg w-full relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-sky-500/10 text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="w-full h-full bg-[#081533] rounded-[14px] flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{buoy.name}</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {buoy.qcStatus}
              </span>
            </div>
            <div className="text-xs text-sky-300/70 font-mono flex items-center gap-2 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{buoy.lat}° N, {buoy.lon}° E</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{buoy.lastTransmission}</span>
            </div>
          </div>
        </div>

        {/* Real-Time Surface Telemetry Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400">SST</div>
            <div className="text-sm font-mono font-bold text-cyan-300">{buoy.sst} °C</div>
          </div>
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400">Salinity</div>
            <div className="text-sm font-mono font-bold text-emerald-300">{buoy.salinity} PSU</div>
          </div>
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400">Current</div>
            <div className="text-sm font-mono font-bold text-amber-300">{buoy.currentSpeed} m/s</div>
          </div>
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400">Wave Hs</div>
            <div className="text-sm font-mono font-bold text-purple-300">{buoy.waveHeight} m</div>
          </div>
        </div>

        {/* CTD Depth Profile Curve (Temperature vs Depth 0 - 2000m) */}
        <div className="bg-[#050c1e] p-3.5 rounded-2xl border border-sky-500/20 mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-sky-200 mb-2">
            <span>CTD Vertical Temperature Profile</span>
            <span className="text-[10px] font-mono text-cyan-400">0m to 2000m depth</span>
          </div>

          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-36 overflow-visible">
            <line x1="30" y1="15" x2={chartW} y2="15" stroke="#1e293b" strokeDasharray="2 2" />
            <line x1="30" y1="60" x2={chartW} y2="60" stroke="#1e293b" strokeDasharray="2 2" />
            <line x1="30" y1="110" x2={chartW} y2="110" stroke="#1e293b" strokeDasharray="2 2" />

            <text x="5" y="20" fill="#64748b" fontSize="9" fontFamily="monospace">0m</text>
            <text x="5" y="65" fill="#64748b" fontSize="9" fontFamily="monospace">500m</text>
            <text x="5" y="115" fill="#64748b" fontSize="9" fontFamily="monospace">2000m</text>

            <path d={path} fill="none" stroke="#00f0ff" strokeWidth="2.5" />
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                <text x={p.x + 5} y={p.y - 4} fill="#38bdf8" fontSize="8" fontFamily="monospace">
                  {p.temp}°C
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Mooring Depth: {buoy.mooringDepth}m</span>
          <span>Battery: {buoy.battery}</span>
        </div>
      </div>
    </div>
  );
}
