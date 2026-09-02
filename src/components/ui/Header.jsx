import React from 'react';
import { Waves, Calendar, Moon, Menu, Bell, Compass, Activity, Globe2 } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, currentTime, onOpenAlerts }) {
  const tabs = ['Dashboard', '3D View', 'Map View', 'Analytics', 'Alerts', 'Data Explorer', 'About'];

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
                else setActiveTab(tab);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-sky-500/10'
              }`}
            >
              {tab === 'Alerts' && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping mr-0.5" />
              )}
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Live Date, Time & Controls */}
      <div className="flex items-center gap-3">
        {/* UTC Time box */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1b42]/80 border border-sky-500/20 text-xs text-sky-200 font-mono">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>15 Aug 2026</span>
          <span className="text-sky-500">•</span>
          <span className="text-cyan-300 font-bold">{currentTime || '12:00'} UTC</span>
        </div>

        {/* Night / Theme toggle */}
        <button 
          title="Toggle Day/Night Mode"
          className="p-2 rounded-lg bg-[#0b1b42]/80 border border-sky-500/20 text-sky-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Menu toggle */}
        <button 
          title="Platform Menu"
          className="p-2 rounded-lg bg-[#0b1b42]/80 border border-sky-500/20 text-sky-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
