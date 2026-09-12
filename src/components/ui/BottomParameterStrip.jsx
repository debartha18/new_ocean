import React from 'react';
import { useTranslation } from 'react-i18next';
import { PARAMETERS, calculateParameterAtDepth } from '../../data/oceanData';

export default function BottomParameterStrip({ 
  selectedParam, 
  setSelectedParam, 
  activeRegion,
  depth = 50,
  onNavigateToMap 
}) {
  const { t } = useTranslation();

  const parameterConfigs = [
    {
      id: 'sst',
      title: `${t('parameters.sst', 'Sea Surface Temperature')} (°C)`,
      min: '0',
      max: '32',
      gradient: 'linear-gradient(to right, #001f3f, #0074D9, #00d2be, #2ECC40, #FFDC00, #FF851B, #FF4136)'
    },
    {
      id: 'salinity',
      title: `${t('parameters.salinity', 'Salinity')} (PSU)`,
      min: '30',
      max: '40',
      gradient: 'linear-gradient(to right, #051e3e, #0f4c81, #1b98e0, #56cbf9, #00ffc8)'
    },
    {
      id: 'currents',
      title: `${t('parameters.currents', 'Ocean Currents')} (m/s)`,
      min: '0',
      max: '2.0',
      isArrows: true
    },
    {
      id: 'wave',
      title: `${t('parameters.wave', 'Wave Height')} (m)`,
      min: '0',
      max: '6',
      gradient: 'linear-gradient(to right, #1e1b4b, #4338ca, #8b5cf6, #ec4899, #f43f5e)'
    },
    {
      id: 'chlorophyll',
      title: `${t('parameters.chlorophyll', 'Chlorophyll-a')} (mg/m³)`,
      min: '0.01',
      max: '10',
      gradient: 'linear-gradient(to right, #022c22, #065f46, #059669, #10b981, #a3e635, #fef08a)'
    },
    {
      id: 'oxygen',
      title: `${t('parameters.oxygen', 'Dissolved Oxygen')} (mg/L)`,
      min: '0',
      max: '10',
      gradient: 'linear-gradient(to right, #4a044e, #701a75, #0284c7, #06b6d4, #67e8f9)'
    }
  ];

  return (
    <footer className="h-20 px-4 py-1.5 flex items-center justify-between gap-2.5 z-30 select-none bg-[#03081a]/95 border-t border-sky-500/20 backdrop-blur-md">
      {/* 1. 6-Parameter Quick Preview Cards matching reference screenshot */}
      <div className="flex items-center gap-2 flex-1 overflow-x-auto py-0.5">
        {parameterConfigs.map((param) => {
          const isSelected = selectedParam === param.id;

          return (
            <button
              key={param.id}
              onClick={() => setSelectedParam(param.id)}
              className={`relative flex-1 min-w-[140px] max-w-[200px] h-[64px] rounded-xl p-2 text-left transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#081d48]/95 border border-cyan-400 shadow-glow-cyan scale-[1.01]'
                  : 'bg-[#05112e]/70 hover:bg-[#08183d]/90 border border-sky-500/25 hover:border-sky-500/50'
              }`}
            >
              {/* Header Title & Live Value */}
              <div className="relative z-10 flex items-center justify-between gap-1">
                <span className={`text-[10px] font-bold truncate leading-tight ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {param.title}
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-sky-950/70 px-1 py-0.2 rounded border border-cyan-500/25 shrink-0">
                  {calculateParameterAtDepth(param.id, depth, activeRegion)}
                </span>
              </div>

              {/* Visualization / Gradient Bar */}
              <div className="relative z-10 w-full my-0.5">
                {param.isArrows ? (
                  <div className="flex items-center justify-center gap-2 py-0.5 text-cyan-400 text-xs font-mono font-bold tracking-wider">
                    <span>—→</span>
                    <span>-››</span>
                    <span>-›››</span>
                    <span className="text-cyan-300">»»»</span>
                  </div>
                ) : (
                  <div
                    className="h-2 w-full rounded-full border border-white/15 shadow-inner"
                    style={{ background: param.gradient }}
                  />
                )}
              </div>

              {/* Min - Max Scale Labels */}
              <div className="relative z-10 flex items-center justify-between text-[8.5px] font-mono text-slate-400">
                <span>{param.min}</span>
                <span>{param.max}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Interactive Global Mini-Map matching reference screenshot */}
      <div 
        onClick={onNavigateToMap}
        title="Click to switch to World Satellite Map"
        className="relative w-40 h-[64px] rounded-xl border border-sky-500/30 overflow-hidden flex flex-col items-center justify-between p-1 shadow-cockpit bg-[#040e24] cursor-pointer hover:border-cyan-400 transition-all group"
      >
        <div className="w-full flex items-center justify-between text-[8.5px] font-mono text-slate-300 px-1">
          <span className="font-bold group-hover:text-cyan-300 transition-colors">Mini Map</span>
          <span className="text-cyan-400 group-hover:underline">Global</span>
        </div>

        {/* Satellite Map thumbnail */}
        <div className="relative w-full flex-1 rounded-md overflow-hidden border border-sky-500/20 bg-[#020714]">
          <img 
            src="/world_map_satellite.jpg" 
            alt="Mini Map" 
            className="w-full h-full object-cover opacity-80 pointer-events-none group-hover:scale-105 transition-transform duration-300"
          />
          {/* Active Viewport Bounding Box */}
          <div className="absolute left-[24%] top-[18%] w-[52%] h-[64%] border border-cyan-400 border-dashed rounded bg-cyan-400/20 pointer-events-none animate-pulse" />
        </div>
      </div>
    </footer>
  );
}
