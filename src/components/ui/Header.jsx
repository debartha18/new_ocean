import React from 'react';
import { useTranslation } from 'react-i18next';
import { Waves, Calendar, Moon, Bell, Compass, Globe2, FileText, Gauge, Database } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
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
  onOpenDepthPressure,
  onOpenNetcdfIngestion
}) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'Dashboard', label: t('navbar.dashboard', 'Dashboard') },
    { id: '3D View', label: t('navbar.threeDView', '3D View') },
    { id: 'El Niño Simulation', label: t('navbar.ensoSimulation', 'El Niño Simulation') },
    { id: 'Map View', label: t('navbar.mapView', 'Map View') },
    { id: 'Analytics', label: t('navbar.analytics', 'Analytics') },
    { id: 'Alerts', label: t('navbar.alerts', 'Alerts') },
    { id: 'Data Explorer', label: t('navbar.dataExplorer', 'Data Explorer') },
    { id: 'About', label: t('navbar.about', 'About') }
  ];

  return (
    <header className="h-16 px-4 sm:px-5 border-b border-sky-500/20 bg-[#060f26]/90 backdrop-blur-md flex items-center justify-between z-30 select-none">
      {/* Brand & Logo */}
      <div 
        onClick={() => setActiveTab('3D View')}
        className="flex items-center gap-3 cursor-pointer group shrink-0"
        title="OCEANOVA | Explore • Analyze • Preserve"
      >
        <div className="relative">
          <img
            src="/oceanova-logo.jpg"
            alt="OCEANOVA Logo"
            className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50 shadow-glow-cyan group-hover:scale-105 transition-all"
          />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#060f26]" title={t('navbar.satelliteActive', 'Satellite Telemetry Active')} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white group-hover:from-white group-hover:to-cyan-200 transition-all">
              OCEANOVA
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              v2.4 Live
            </span>
          </div>
          <p className="text-[10px] font-semibold text-sky-300/80 tracking-wider uppercase flex items-center gap-1.5">
            {t('brand.motto', 'Explore • Analyze • Preserve')}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden xl:flex items-center gap-1 bg-[#0a1638]/70 p-1 rounded-xl border border-sky-500/15">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'Alerts' && onOpenAlerts) onOpenAlerts();
                else if (tab.id === 'Analytics' && onOpenAnalyticReport) onOpenAnalyticReport();
                else setActiveTab(tab.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-sky-500/10'
              }`}
            >
              {tab.id === 'Alerts' && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping mr-0.5" />
              )}
              {tab.id === 'Map View' && (
                <Globe2 className="w-3.5 h-3.5" />
              )}
              {tab.label}
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
          <span className="font-bold text-[11px]">{t('navbar.pressureCalc', 'Pressure Calc')}</span>
        </button>

        {/* NetCDF CF-1.8 Data Ingestion Trigger */}
        <button
          onClick={onOpenNetcdfIngestion}
          title="Ingest NetCDF CF-1.8 / Delimited Oceanographic Datasets"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b1b42]/80 hover:bg-[#12285a] border border-cyan-500/30 hover:border-cyan-400 text-xs text-cyan-200 transition-all cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-[11px]">{t('navbar.netcdfIngest', 'Ingest NetCDF')}</span>
        </button>

        {/* Analytic Report Quick Trigger */}
        <button
          onClick={onOpenAnalyticReport}
          title="Print & View Official Oceanographic Analytical Report"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600/80 to-cyan-500/80 hover:from-sky-500 hover:to-cyan-400 border border-cyan-400/40 text-xs text-white shadow-glow-cyan transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span className="font-bold hidden sm:inline text-[11px]">Report</span>
        </button>

        {/* Storm Radar & News Bulletin Button */}
        <button
          onClick={onOpenStormNews}
          title="Live Marine Weather News, Rain & Storm Probability"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-xs text-red-300 shadow-glow-red transition-all cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="font-bold hidden sm:inline text-[11px]">Storm</span>
          <span className="px-1.5 py-0.5 rounded bg-red-500/30 text-[9px] font-mono font-bold text-white">
            {activeRegion?.stormProbability ?? 30}%
          </span>
        </button>

        {/* El Niño Simulation Action Badge Button */}
        <button
          onClick={() => setActiveTab('El Niño Simulation')}
          title="Open Dedicated Equatorial Pacific ENSO / El Niño Digital Twin"
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'El Niño Simulation'
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border-orange-400 shadow-glow-orange'
              : 'bg-red-950/60 hover:bg-red-900/80 text-orange-200 border-red-500/40 shadow-glow-red'
          }`}
        >
          <span className="text-sm">🔥</span>
          <span className="font-bold text-[11px]">{t('navbar.ensoSimulation', 'El Niño')}</span>
        </button>

        {/* Indian Languages Selector Dropdown */}
        <LanguageSelector />

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
