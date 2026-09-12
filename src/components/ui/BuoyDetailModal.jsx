import React, { useState } from 'react';
import { X, Radio, Clock, MapPin, Navigation, Activity, Droplets, Thermometer, Sparkles, Wind, Cpu } from 'lucide-react';

export default function BuoyDetailModal({ buoy, onClose }) {
  const [activeVariable, setActiveVariable] = useState('temp');

  if (!buoy) return null;

  const chartW = 340;
  const chartH = 140;
  const profile = buoy.depthProfile || [];

  const variableConfigs = {
    temp: {
      id: 'temp',
      name: 'Temperature',
      unit: '°C',
      min: 0,
      max: 32,
      color: '#00f0ff',
      icon: Thermometer,
      tickStep: 8,
      accessor: (p) => p.temp ?? 0
    },
    salinity: {
      id: 'salinity',
      name: 'Salinity',
      unit: 'PSU',
      min: 30,
      max: 37,
      color: '#10b981',
      icon: Droplets,
      tickStep: 1.75,
      accessor: (p) => p.salinity ?? 34
    },
    oxygen: {
      id: 'oxygen',
      name: 'Dissolved Oxygen',
      unit: 'mg/L',
      min: 0,
      max: 8.5,
      color: '#c084fc',
      icon: Sparkles,
      tickStep: 2,
      accessor: (p) => p.oxygen ?? (p.depth > 100 && p.depth < 500 ? 1.8 : 6.2)
    },
    chlorophyll: {
      id: 'chlorophyll',
      name: 'Chlorophyll-a',
      unit: 'mg/m³',
      min: 0,
      max: 3.5,
      color: '#84cc16',
      icon: Activity,
      tickStep: 0.8,
      accessor: (p) => p.chlorophyll ?? (p.depth <= 60 ? 1.6 : 0.05)
    },
    velocity: {
      id: 'velocity',
      name: 'Current Velocity',
      unit: 'm/s',
      min: 0,
      max: 2.0,
      color: '#f59e0b',
      icon: Wind,
      tickStep: 0.5,
      accessor: (p) => p.velocity ?? Math.max(0.05, 0.9 * Math.exp(-p.depth / 200))
    }
  };

  const currentVarConfig = variableConfigs[activeVariable] || variableConfigs.temp;
  const maxD = profile.length > 0 ? Math.max(...profile.map((p) => p.depth), 1000) : 2000;

  const points = profile.map((pt) => {
    const val = currentVarConfig.accessor(pt);
    const minVal = currentVarConfig.min;
    const maxVal = currentVarConfig.max;
    const clampedVal = Math.min(Math.max(val, minVal), maxVal);

    const x = ((clampedVal - minVal) / (maxVal - minVal)) * (chartW - 60) + 40;
    const y = (pt.depth / maxD) * (chartH - 30) + 15;
    return { x, y, val, depth: pt.depth, timestamp: pt.timestamp || buoy.lastTransmission };
  });

  const path = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  const typeBadges = {
    gliderProfile: { label: 'Autonomous Slocum Glider', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    bgcArgo: { label: 'BGC-Argo Profiling Float', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    adcpMooring: { label: 'Acoustic Doppler (ADCP) Mooring', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    argoFloat: { label: 'Core Argo Float Array', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
    mooredBuoy: { label: 'RAMA / OMNI Moored Network', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
  };

  const badgeInfo = typeBadges[buoy.type] || typeBadges.mooredBuoy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="glass-panel rounded-3xl p-6 border border-sky-400/40 shadow-glow-blue max-w-xl w-full relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-sky-500/10 text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#081533] rounded-[14px] flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="min-w-0 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white truncate">{buoy.name}</h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${badgeInfo.bg}`}>
                {badgeInfo.label}
              </span>
            </div>
            <div className="text-xs text-sky-300/70 font-mono flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {buoy.lat}° N, {buoy.lon}° E
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                {buoy.lastTransmission}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{buoy.qcStatus}</span>
            </div>
          </div>
        </div>

        {/* Real-Time Telemetry Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400 font-medium">SST Surface</div>
            <div className="text-sm font-mono font-bold text-cyan-300">{buoy.sst ?? '--'} °C</div>
          </div>
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400 font-medium">Salinity</div>
            <div className="text-sm font-mono font-bold text-emerald-300">{buoy.salinity ?? '--'} PSU</div>
          </div>
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400 font-medium">Current</div>
            <div className="text-sm font-mono font-bold text-amber-300">{buoy.currentSpeed ?? '--'} m/s</div>
          </div>
          <div className="bg-[#06122c] p-2.5 rounded-xl border border-sky-500/20 text-center">
            <div className="text-[10px] text-slate-400 font-medium">Wave Hs</div>
            <div className="text-sm font-mono font-bold text-purple-300">{buoy.waveHeight ?? '--'} m</div>
          </div>
        </div>

        {/* Multi-Variable Profile Selector Tabs */}
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
          {Object.values(variableConfigs).map((cfg) => {
            const Icon = cfg.icon;
            const isSelected = activeVariable === cfg.id;
            return (
              <button
                key={cfg.id}
                onClick={() => setActiveVariable(cfg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-glow-cyan'
                    : 'bg-[#081533] text-slate-300 hover:text-white border border-sky-500/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cfg.name}</span>
                <span className="text-[10px] font-mono opacity-80">({cfg.unit})</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Depth-vs-Variable Profile Curve (0m to maxD) */}
        <div className="bg-[#050c1e] p-4 rounded-2xl border border-sky-500/20 mb-3">
          <div className="flex items-center justify-between text-xs font-bold text-sky-200 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: currentVarConfig.color }} />
              <span>Vertical Depth Profile: {currentVarConfig.name}</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              0m to {maxD}m depth • {points.length} Observation Levels
            </span>
          </div>

          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-44 overflow-visible">
            {/* Depth grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
              const y = ratio * (chartH - 30) + 15;
              const dLabel = `${Math.round(ratio * maxD)}m`;
              return (
                <g key={ratio}>
                  <line x1="38" y1={y} x2={chartW - 10} y2={y} stroke="#1e293b" strokeDasharray="2 3" />
                  <text x="5" y={y + 3} fill="#64748b" fontSize="9" fontFamily="monospace">
                    {dLabel}
                  </text>
                </g>
              );
            })}

            {/* Profile curve */}
            <path
              d={path}
              fill="none"
              stroke={currentVarConfig.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Observation point beads with tooltip values */}
            {points.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#031533"
                  stroke={currentVarConfig.color}
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-150"
                />
                <text
                  x={Math.min(p.x + 6, chartW - 45)}
                  y={p.y - 5}
                  fill="#e2e8f0"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {p.val} {currentVarConfig.unit}
                </text>
              </g>
            ))}
          </svg>

          {/* Scale Axis Bottom Legend */}
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-2 px-10 border-t border-sky-500/15 pt-1">
            <span>Min: {currentVarConfig.min} {currentVarConfig.unit}</span>
            <span>Range: {currentVarConfig.min} - {currentVarConfig.max} {currentVarConfig.unit}</span>
            <span>Max: {currentVarConfig.max} {currentVarConfig.unit}</span>
          </div>
        </div>

        {/* Instrument Metadata Details */}
        <div className="bg-[#081533]/80 p-3 rounded-xl border border-sky-500/20 text-xs space-y-1.5 mb-3">
          {buoy.sensors && (
            <div className="flex items-start gap-2 text-slate-300">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Payload Sensors: </span>
                <span className="text-slate-300 font-mono text-[11px]">{buoy.sensors}</span>
              </div>
            </div>
          )}
          {buoy.gliderTrajectory && (
            <div className="flex items-center gap-2 text-slate-300">
              <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Glider Flight: </span>
                <span className="text-amber-300 font-mono text-[11px]">{buoy.gliderTrajectory}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-sky-500/10">
            <span>Mooring / Profiling Depth: <strong className="text-white">{buoy.mooringDepth}m</strong></span>
            <span>Battery: <strong className="text-emerald-400">{buoy.battery}</strong></span>
            <span>QC Standard: <strong className="text-cyan-300">WMO-IOC GTS</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
