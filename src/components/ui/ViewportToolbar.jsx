import React from 'react';
import { 
  Home, 
  Globe, 
  Crosshair, 
  Ruler, 
  Layers, 
  MapPin, 
  ChevronDown,
  Box,
  Boxes,
  Maximize2,
  Compass
} from 'lucide-react';
import { PARAMETERS, VIEW_MODES } from '../../data/oceanData';

export default function ViewportToolbar({
  selectedParam,
  viewMode,
  setViewMode,
  onResetCamera,
  onToggleGlobe,
  regionName = 'Bay of Bengal',
  regionCoords = '15.297° N, 87.860° E'
}) {
  const currentParam = PARAMETERS[selectedParam] || PARAMETERS.sst;

  const modeIcons = {
    surface: Layers,
    depth_slice: Box,
    volume: Boxes,
    isosurface: Maximize2,
    vector_field: Compass
  };

  return (
    <>
      {/* 1. Top-Left Location Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-sky-500/30 shadow-cockpit cursor-pointer hover:border-cyan-400 transition-all">
          <div className="p-1 rounded-lg bg-sky-500/20 text-cyan-300">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              {regionName}
              <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-[10px] font-mono text-sky-300/80">
              {regionCoords}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Left Floating Tool Stack */}
      <div className="absolute top-20 left-4 z-20 flex flex-col gap-1.5">
        <div className="glass-panel p-1.5 rounded-2xl flex flex-col gap-1 border border-sky-500/20 shadow-cockpit">
          <button
            onClick={onResetCamera}
            title="Reset Camera View (Home)"
            className="p-2.5 rounded-xl text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleGlobe}
            title="Toggle Earth Globe View"
            className="p-2.5 rounded-xl text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            title="Focus Active Anomaly"
            className="p-2.5 rounded-xl text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            title="Bathymetry & Distance Measurement"
            className="p-2.5 rounded-xl text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
          >
            <Ruler className="w-4 h-4" />
          </button>
          <button
            title="Layer Visibility & Grid Overlays"
            className="p-2.5 rounded-xl text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Top-Right Dynamic Colorbar Legend */}
      <div className="absolute top-4 right-4 z-20">
        <div className="glass-panel px-4 py-2.5 rounded-2xl border border-sky-500/30 shadow-cockpit min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1.5">
            <span>{currentParam.name}</span>
            <span className="font-mono text-cyan-300 text-[11px]">({currentParam.unit})</span>
          </div>

          {/* Continuous gradient strip */}
          <div
            className="h-2.5 w-full rounded-md shadow-inner border border-white/20 mb-1"
            style={{ background: currentParam.gradientCss }}
          />

          {/* Scale tick numbers */}
          <div className="flex justify-between text-[10px] font-mono text-sky-200/90 font-medium">
            {currentParam.ticks.map((val) => (
              <span key={val}>{val}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Center-Bottom 3D View Mode Selector Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1 border border-sky-500/30 shadow-cockpit">
          {VIEW_MODES.map((mode) => {
            const Icon = modeIcons[mode.id] || Layers;
            const isActive = viewMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-glow-cyan border border-cyan-300/40'
                    : 'text-slate-300 hover:text-white hover:bg-sky-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
