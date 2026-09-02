import React, { useState, useEffect } from 'react';
import Header from './components/ui/Header';
import LeftControlPanel from './components/ui/LeftControlPanel';
import ViewportToolbar from './components/ui/ViewportToolbar';
import RightAnalyticsPanel from './components/ui/RightAnalyticsPanel';
import BottomParameterStrip from './components/ui/BottomParameterStrip';
import BuoyDetailModal from './components/ui/BuoyDetailModal';
import AnomalyModal from './components/ui/AnomalyModal';
import FleetModal from './components/ui/FleetModal';
import OceanCanvas from './components/canvas/OceanCanvas';
import { BUOY_MARKERS } from './data/oceanData';

export default function App() {
  const [activeTab, setActiveTab] = useState('3D View');
  const [selectedParam, setSelectedParam] = useState('sst');
  const [depth, setDepth] = useState(50);
  const [viewMode, setViewMode] = useState('depth_slice');
  const [timeHour, setTimeHour] = useState(12.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [selectedBuoy, setSelectedBuoy] = useState(null);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);

  // Real-time animation timeline ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeHour((prev) => {
        const next = prev + 0.05 * simSpeed;
        return next >= 24 ? 0 : next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const formatCurrentTime = (h) => {
    const hh = String(Math.floor(h)).padStart(2, '0');
    const mm = String(Math.floor((h % 1) * 60)).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return (
    <div className="relative w-screen h-screen bg-[#030712] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* 1. Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTime={formatCurrentTime(timeHour)}
        onOpenAlerts={() => setIsAnomalyModalOpen(true)}
      />

      {/* 2. Main Central Workstation (Left Controls, Center 3D Scene, Right Analytics) */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Parameter & Depth & Time Control Cockpit */}
        <LeftControlPanel
          selectedParam={selectedParam}
          setSelectedParam={setSelectedParam}
          depth={depth}
          setDepth={setDepth}
          timeHour={timeHour}
          setTimeHour={setTimeHour}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          simSpeed={simSpeed}
          setSimSpeed={setSimSpeed}
        />

        {/* Center 3D Ocean Digital Twin Viewport */}
        <main className="relative flex-1 h-full overflow-hidden bg-[#030712] rounded-3xl my-1 border border-sky-500/20 shadow-inner">
          <OceanCanvas
            selectedParam={selectedParam}
            depth={depth}
            viewMode={viewMode}
            onSelectBuoy={(buoy) => setSelectedBuoy(buoy)}
            selectedBuoy={selectedBuoy}
            isPlaying={isPlaying}
            simSpeed={simSpeed}
          />

          {/* Floating Viewport HUD Overlays */}
          <ViewportToolbar
            selectedParam={selectedParam}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onResetCamera={() => {}}
            onToggleGlobe={() => setViewMode(viewMode === 'surface' ? 'depth_slice' : 'surface')}
          />
        </main>

        {/* Right In-Situ & Model Validation & AI Anomaly Analytics */}
        <RightAnalyticsPanel
          onOpenAnomalyModal={() => setIsAnomalyModalOpen(true)}
          onOpenFleetModal={() => setIsFleetModalOpen(true)}
        />
      </div>

      {/* 3. Bottom 6-Parameter Strip & Mini-Map */}
      <BottomParameterStrip
        selectedParam={selectedParam}
        setSelectedParam={setSelectedParam}
      />

      {/* 4. Interactive Modals */}
      <BuoyDetailModal
        buoy={selectedBuoy}
        onClose={() => setSelectedBuoy(null)}
      />

      <AnomalyModal
        isOpen={isAnomalyModalOpen}
        onClose={() => setIsAnomalyModalOpen(false)}
      />

      <FleetModal
        isOpen={isFleetModalOpen}
        onClose={() => setIsFleetModalOpen(false)}
        onSelectBuoy={(buoy) => setSelectedBuoy(buoy)}
      />
    </div>
  );
}
