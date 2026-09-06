import React from 'react';
import { 
  ChevronRight, 
  Brain, 
  ChevronDown,
  Zap,
  Newspaper,
  FileText,
  Printer,
  Gauge,
  Thermometer,
  Wind,
  Globe
} from 'lucide-react';
import { 
  IN_SITU_SUMMARY, 
  VALIDATION_TIME_SERIES, 
  VALIDATION_METRICS, 
  AI_ANOMALY,
  ENSO_METRICS
} from '../../data/oceanData';
import { calculateHydrostaticPressure } from '../../utils/pressureCalculator';

export default function RightAnalyticsPanel({ 
  onOpenAnomalyModal, 
  onOpenFleetModal, 
  activeRegion, 
  onOpenStormNews,
  onOpenAnalyticReport,
  onOpenDepthPressure,
  depth = 50,
  ensoState = { phase: 'elnino', intensity: 0.75 },
  onFocusPacific
}) {
  const chartW = 240;
  const chartH = 85;
  const minTemp = 27.0;
  const maxTemp = 30.5;

  const pointsModel = VALIDATION_TIME_SERIES.map((pt, i) => {
    const x = (i / (VALIDATION_TIME_SERIES.length - 1)) * (chartW - 20) + 10;
    const y = chartH - ((pt.model - minTemp) / (maxTemp - minTemp)) * (chartH - 20) - 10;
    return { x, y, ...pt };
  });

  const pointsObs = VALIDATION_TIME_SERIES.map((pt, i) => {
    const x = (i / (VALIDATION_TIME_SERIES.length - 1)) * (chartW - 20) + 10;
    const y = chartH - ((pt.observed - minTemp) / (maxTemp - minTemp)) * (chartH - 20) - 10;
    return { x, y, ...pt };
  });

  const pathModel = pointsModel.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const pathObs = pointsObs.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  const stormProb = activeRegion?.stormProbability ?? 75;
  const rainRate = activeRegion?.rainRate ?? 38.5;
  const waveHeight = activeRegion?.waveHeight ?? 1.65;

  return (
    <aside className="w-80 h-full flex flex-col gap-3 p-3 select-none overflow-y-auto z-20">
      {/* 0. Position-Specific Storm & Rain Intelligence Card */}
      <div className="glass-panel rounded-2xl p-3.5 border border-red-500/40 bg-gradient-to-b from-[#1c081e]/80 to-[#07132e]/90 shadow-glow-red">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
            <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Position Storm Risk</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
            {activeRegion?.activeStorm?.category || 'Severe Squall'}
          </span>
        </div>

        <div className="mb-2.5 px-1">
          <div className="text-xs font-bold text-white truncate">{activeRegion?.name || 'Bay of Bengal'}</div>
          <div className="text-[10px] font-mono text-cyan-300/80">{activeRegion?.coords || '15.297° N, 87.860° E'}</div>
        </div>

        {/* 3 Metric Gauges for this exact coordinate */}
        <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
          <div className="bg-[#120716] p-2 rounded-xl border border-red-500/20">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Storm Risk</div>
            <div className="text-sm font-bold font-mono text-red-400 mt-0.5">{stormProb}%</div>
          </div>
          <div className="bg-[#120716] p-2 rounded-xl border border-red-500/20">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Rain Rate</div>
            <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">{rainRate} <span className="text-[8px]">mm/h</span></div>
          </div>
          <div className="bg-[#120716] p-2 rounded-xl border border-red-500/20">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Wave Swell</div>
            <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">{waveHeight} <span className="text-[8px]">m</span></div>
          </div>
        </div>

        <button
          onClick={onOpenStormNews}
          className="w-full py-2 px-3 rounded-xl bg-red-500/25 hover:bg-red-500/35 text-xs font-bold text-red-200 border border-red-500/40 flex items-center justify-between transition-all shadow-glow-red"
        >
          <span className="flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5 text-red-400" />
            <span>Live Marine Storm News</span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 0.5. Official Analytical Report & Print Action Card */}
      <div className="glass-panel rounded-2xl p-3.5 border border-cyan-400/40 bg-gradient-to-b from-[#09224d]/80 to-[#041026]/90 shadow-glow-cyan">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analytical Report</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">
            Printable / PDF
          </span>
        </div>

        <p className="text-[11px] text-slate-300 mb-2.5 px-1 leading-tight">
          Generate formal oceanographic telemetry dossier with depth pressure matrix & beach forecasts.
        </p>

        <button
          onClick={onOpenAnalyticReport}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-xs font-bold text-white shadow-glow-cyan flex items-center justify-between transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Analytic Report</span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 0.55. ENSO STATUS Card matching user layout */}


      {/* 0.6. Subsurface Hydrostatic Pressure Card */}
      {(() => {
        const pressure = calculateHydrostaticPressure(depth, activeRegion?.lat || 15.0, activeRegion?.sst || 28.0);
        return (
          <div className="glass-panel rounded-2xl p-3 border border-sky-500/20 bg-[#05112c]/70">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-200">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Depth Pressure ({depth}m)</span>
              </div>
              <button
                onClick={onOpenDepthPressure}
                className="text-[10px] text-cyan-400 hover:underline font-mono"
              >
                Calculator ↗
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center font-mono">
              <div className="bg-[#030a1c] p-1.5 rounded-lg border border-sky-500/10">
                <div className="text-[8px] text-slate-400">Dbar</div>
                <div className="text-xs font-bold text-cyan-300">{pressure.dbar}</div>
              </div>
              <div className="bg-[#030a1c] p-1.5 rounded-lg border border-sky-500/10">
                <div className="text-[8px] text-slate-400">Atm</div>
                <div className="text-xs font-bold text-sky-300">{pressure.atm}</div>
              </div>
              <div className="bg-[#030a1c] p-1.5 rounded-lg border border-sky-500/10">
                <div className="text-[8px] text-slate-400">MPa</div>
                <div className="text-xs font-bold text-amber-300">{pressure.mpa}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 1. In-Situ Observations Summary Card */}
      <div className="glass-panel rounded-2xl p-3.5 border border-sky-500/20">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
            In-situ Observations
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            49 Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {Object.entries(IN_SITU_SUMMARY).map(([key, item]) => (
            <div
              key={key}
              className="bg-[#0a1838]/70 border border-sky-500/15 p-2.5 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.bg} shadow-sm`} />
                <span className="text-xs text-slate-300">{item.label}</span>
              </div>
              <span className="text-sm font-bold font-mono text-white">{item.count}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenFleetModal}
          className="w-full py-1.5 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-cyan-300 flex items-center justify-between transition-colors border border-sky-500/20"
        >
          <span>View Fleet Telemetry</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Model vs Observations Validation Card */}
      <div className="glass-panel rounded-2xl p-3.5 border border-sky-500/20">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
            Model vs Observations
          </span>
          <div className="flex items-center gap-1 text-[11px] text-sky-300 bg-[#0a1838] px-2 py-0.5 rounded-lg border border-sky-500/20 cursor-pointer">
            <span>SST</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-3 text-[10px] text-slate-300 mb-1 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Model</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Observed</span>
          </div>
        </div>

        {/* Validation Curve Chart */}
        <div className="bg-[#050c1e]/90 p-2 rounded-xl border border-sky-500/15 mb-2.5">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-24 overflow-visible">
            <line x1="0" y1="20" x2={chartW} y2="20" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2={chartW} y2="50" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="75" x2={chartW} y2="75" stroke="#1e293b" strokeDasharray="3 3" />

            <path d={pathModel} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
            {pointsModel.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            ))}

            <path d={pathObs} fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            {pointsObs.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
            ))}
          </svg>

          <div className="flex justify-between text-[9px] font-mono text-slate-400 px-1 mt-1">
            {VALIDATION_TIME_SERIES.map((pt) => (
              <span key={pt.time}>{pt.time}</span>
            ))}
          </div>
        </div>

        {/* Statistical Metrics */}
        <div className="grid grid-cols-3 gap-1.5 text-center mb-2.5">
          <div className="bg-[#0a1838]/80 p-1.5 rounded-lg border border-sky-500/10">
            <div className="text-[9px] text-slate-400 uppercase">RMSE</div>
            <div className="text-xs font-mono font-bold text-cyan-300">{VALIDATION_METRICS.rmse}</div>
          </div>
          <div className="bg-[#0a1838]/80 p-1.5 rounded-lg border border-sky-500/10">
            <div className="text-[9px] text-slate-400 uppercase">Bias</div>
            <div className="text-xs font-mono font-bold text-amber-300">{VALIDATION_METRICS.bias}</div>
          </div>
          <div className="bg-[#0a1838]/80 p-1.5 rounded-lg border border-sky-500/10">
            <div className="text-[9px] text-slate-400 uppercase">Correlation</div>
            <div className="text-xs font-mono font-bold text-emerald-300">{VALIDATION_METRICS.correlation}</div>
          </div>
        </div>

        <button 
          onClick={onOpenFleetModal}
          className="w-full text-center text-[11px] text-sky-400 hover:text-cyan-300 flex items-center justify-center gap-1 transition-colors"
        >
          <span>View Detailed Comparison</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. AI Anomaly Detection Card */}
      <div className="glass-panel rounded-2xl p-3.5 glow-border-red bg-gradient-to-b from-red-950/40 to-[#08122b]/90 border border-red-500/40">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shadow-glow-red animate-pulse">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
              <span>{AI_ANOMALY.title}</span>
              <span className="text-[9px] bg-red-500/30 text-red-300 px-1.5 py-0.2 rounded uppercase">Critical</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Confidence {AI_ANOMALY.confidence}</div>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed mb-3 font-normal">
          {AI_ANOMALY.headline}
        </p>

        <button
          onClick={onOpenAnomalyModal}
          className="w-full py-1.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 flex items-center justify-center gap-1.5 transition-all border border-red-500/40 shadow-glow-red"
        >
          <span>View Diagnostics & Impact</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
