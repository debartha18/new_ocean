import React from 'react';
import { Waves, Calendar, Moon, Bell, Compass, Globe2, FileText, Gauge } from 'lucide-react';
import { getFormattedCurrentDate } from '../../utils/dateUtils';

export default function Header({
  activeTab,
  setActiveTab,
  currentTime,
  selectedDate = getFormattedCurrentDate(),
  onOpenDatePicker,
  activeRegion,
  onOpenLocationModal,
  onOpenStormNews,
  onOpenAlerts,
  onOpenAnalyticReport,
  onOpenDepthPressure
}) {
  const tabs = ['Dashboard', '3D View', 'El Niño Simulation', 'Map View', 'Analytics', 'Alerts', 'Data Explorer', 'About'];

  return (
    <header className="h-16 px-5 border-b border-sky-500/20 bg-[#060f26]/90 backdrop-blur-md flex items-center justify-between z-30 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-400 to-blue-600 p-0.5 shadow-glow-cyan flex items-center justify-center">
          <div className="w-full h-full bg-[#060f26] rounded-[10px] flex items-center justify-center">
            <Waves className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
              OCEAN VISION 3D
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              v2.4 Live
            </span>
          </div>
          <p className="text-[11px] font-medium text-sky-300/60 tracking-tight">
            Ocean Digital Twin Platform
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-[#0a1638]/70 p-1 rounded-xl border border-sky-500/15">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'Alerts' && onOpenAlerts) onOpenAlerts();
                else if (tab === 'Analytics' && onOpenAnalyticReport) onOpenAnalyticReport();
                else setActiveTab(tab);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-sky-500/10'
              }`}
            >
              {tab === 'Alerts' && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping mr-0.5" />
              )}
              {tab === 'Map View' && (
                <Globe2 className="w-3.5 h-3.5" />
              )}
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Live Date, Location & Controls */}
      <div className="flex items-center gap-2.5">
        {/* Active Location & Coordinates Selector Badge */}
        <button
          onClick={onOpenLocationModal}
          title="Change Location or Enter Custom Lat/Lon Coordinates"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1b42]/80 hover:bg-[#12285a] border border-sky-500/30 hover:border-cyan-400 text-xs text-sky-200 transition-all"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <div className="text-left leading-none">
            <div className="font-bold text-white text-[11px] truncate max-w-[110px]">
              {activeRegion?.name || 'Bay of Bengal'}
            </div>
            <div className="text-[9px] font-mono text-cyan-300 mt-0.5 hidden xl:block">
              {activeRegion?.coords || '15.297° N, 87.860° E'}
            </div>
          </div>
        </button>

        {/* Live Date Engine Box */}
        <button
          onClick={onOpenDatePicker}
          title="Click to Open Observation Date & Temporal Engine"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1b42]/80 hover:bg-[#12285a] border border-sky-500/30 hover:border-cyan-400 text-xs text-sky-200 font-mono transition-all group"
        >
          <Calendar className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">{selectedDate}</span>
          <span className="text-sky-500">•</span>
          <span className="text-cyan-300 font-bold">{currentTime || '12:00'} UTC</span>
        </button>

        {/* Depth Pressure Quick Trigger */}
        <button
          onClick={onOpenDepthPressure}
          title="Hydrostatic Pressure Profiler across Depths"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b1b42]/80 hover:bg-[#12285a] border border-sky-500/30 hover:border-cyan-400 text-xs text-sky-200 transition-all cursor-pointer"
        >
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-[11px]">Pressure Calc</span>
        </button>

        {/* Analytic Report Quick Trigger */}
        <button
          onClick={onOpenAnalyticReport}
          title="Print & View Official Oceanographic Analytical Report"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600/80 to-cyan-500/80 hover:from-sky-500 hover:to-cyan-400 border border-cyan-400/40 text-xs text-white shadow-glow-cyan transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span className="font-bold hidden sm:inline text-[11px]">Analytic Report</span>
        </button>

        {/* Storm Radar & News Bulletin Button */}
        <button
          onClick={onOpenStormNews}
          title="Live Marine Weather News, Rain & Storm Probability"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-xs text-red-300 shadow-glow-red transition-all cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="font-bold hidden sm:inline text-[11px]">Storm Radar</span>
          <span className="px-1.5 py-0.5 rounded bg-red-500/30 text-[9px] font-mono font-bold text-white">
            {activeRegion?.stormProbability ?? 30}%
          </span>
        </button>

        {/* El Niño Simulation Action Badge Button matching reference image */}
        <button
          onClick={() => setActiveTab('El Niño Simulation')}
          title="Open Dedicated Equatorial Pacific ENSO / El Niño Digital Twin"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'El Niño Simulation'
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border-orange-400 shadow-glow-orange'
              : 'bg-red-950/60 hover:bg-red-900/80 text-orange-200 border-red-500/40 shadow-glow-red'
          }`}
        >
          <span className="text-sm">🔥</span>
          <span className="font-bold text-[11px]">El Niño Simulation</span>
        </button>

        {/* Night / Theme toggle */}
        <button 
          title="Toggle Day/Night Mode"
          className="p-2 rounded-xl bg-[#0b1b42]/80 border border-sky-500/20 text-sky-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
