import React, { useState, useEffect } from 'react';
import Header from './components/ui/Header';
import LeftControlPanel from './components/ui/LeftControlPanel';
import ViewportToolbar from './components/ui/ViewportToolbar';
import RightAnalyticsPanel from './components/ui/RightAnalyticsPanel';
import BottomParameterStrip from './components/ui/BottomParameterStrip';
import BuoyDetailModal from './components/ui/BuoyDetailModal';
import AnomalyModal from './components/ui/AnomalyModal';
import FleetModal from './components/ui/FleetModal';
import LocationModal from './components/ui/LocationModal';
import DatePickerModal from './components/ui/DatePickerModal';
import StormNewsModal from './components/ui/StormNewsModal';
import WorldMapView from './components/ui/WorldMapView';
import OceanCanvas from './components/canvas/OceanCanvas';
import AnalyticReportModal from './components/ui/AnalyticReportModal';
import DepthPressureModal from './components/ui/DepthPressureModal';
import { REGIONS, createLocationData } from './data/oceanData';

export default function App() {
  const [activeTab, setActiveTab] = useState('3D View');
  const [selectedParam, setSelectedParam] = useState('sst');
  const [depth, setDepth] = useState(50);
  const [viewMode, setViewMode] = useState('depth_slice');
  const [timeHour, setTimeHour] = useState(12.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [selectedBuoy, setSelectedBuoy] = useState(null);

  // Dynamic Location & Meteorological Threat State
  const [activeRegion, setActiveRegion] = useState(REGIONS.bay_of_bengal);
  const [selectedDate, setSelectedDate] = useState('15 Aug 2026');
  const [isStormLayerActive, setIsStormLayerActive] = useState(true);

  // Modals
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [isStormNewsModalOpen, setIsStormNewsModalOpen] = useState(false);
  const [isAnalyticReportOpen, setIsAnalyticReportOpen] = useState(false);
  const [isDepthPressureOpen, setIsDepthPressureOpen] = useState(false);

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

  const handleCustomCoords = (arg1, arg2) => {
    if (typeof arg1 === 'object' && arg1 !== null) {
      setActiveRegion(arg1);
    } else {
      const lat = typeof arg1 === 'number' ? arg1 : parseFloat(arg1);
      const lon = typeof arg2 === 'number' ? arg2 : parseFloat(arg2);
      if (!isNaN(lat) && !isNaN(lon)) {
        const newRegion = createLocationData(lat, lon, null, selectedDate);
        setActiveRegion(newRegion);
      }
    }
  };

  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    if (activeRegion) {
      const updated = createLocationData(activeRegion.lat, activeRegion.lon, activeRegion.name, dateStr);
      setActiveRegion(updated);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#030712] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* 1. Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTime={formatCurrentTime(timeHour)}
        selectedDate={selectedDate}
        onOpenDatePicker={() => setIsDatePickerModalOpen(true)}
        activeRegion={activeRegion}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenStormNews={() => setIsStormNewsModalOpen(true)}
        onOpenAlerts={() => setIsAnomalyModalOpen(true)}
        onOpenAnalyticReport={() => setIsAnalyticReportOpen(true)}
        onOpenDepthPressure={() => setIsDepthPressureOpen(true)}
      />

      {/* 2. Main Central Workstation or Full World Map View */}
      {activeTab === 'Map View' ? (
        <div className="relative flex-1 overflow-hidden">
          <WorldMapView
            activeRegion={activeRegion}
            onSelectRegion={(reg) => {
              setActiveRegion(reg);
              setActiveTab('3D View');
            }}
            onCustomCoords={(coordsObj) => {
              handleCustomCoords(coordsObj);
              setActiveTab('3D View');
            }}
            onBackTo3D={() => setActiveTab('3D View')}
          />
        </div>
      ) : (
        <div className="relative flex-1 flex overflow-hidden">
          {/* Left Parameter, Location, Depth & Time Control Cockpit */}
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
            activeRegion={activeRegion}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onCustomCoords={handleCustomCoords}
            selectedDate={selectedDate}
            onOpenDatePicker={() => setIsDatePickerModalOpen(true)}
            onOpenStormNews={() => setIsStormNewsModalOpen(true)}
            isStormLayerActive={isStormLayerActive}
            setIsStormLayerActive={setIsStormLayerActive}
            onOpenDepthPressure={() => setIsDepthPressureOpen(true)}
          />

          {/* Center 3D Ocean Digital Twin Viewport */}
          <main className="relative flex-1 h-full overflow-hidden bg-[#030712] rounded-3xl my-1 border border-sky-500/20 shadow-inner">
            <OceanCanvas
              selectedParam={selectedParam}
              depth={depth}
              viewMode={viewMode}
              activeRegion={activeRegion}
              isStormLayerActive={isStormLayerActive}
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
              onToggleGlobe={() => setActiveTab('Map View')}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onOpenWorldMap={() => setActiveTab('Map View')}
              isStormLayerActive={isStormLayerActive}
              setIsStormLayerActive={setIsStormLayerActive}
              regionName={activeRegion?.name}
              regionCoords={activeRegion?.coords}
            />
          </main>

          {/* Right In-Situ & Model Validation, Storm & AI Anomaly Analytics */}
          <RightAnalyticsPanel
            onOpenAnomalyModal={() => setIsAnomalyModalOpen(true)}
            onOpenFleetModal={() => setIsFleetModalOpen(true)}
            activeRegion={activeRegion}
            onOpenStormNews={() => setIsStormNewsModalOpen(true)}
            onOpenAnalyticReport={() => setIsAnalyticReportOpen(true)}
            onOpenDepthPressure={() => setIsDepthPressureOpen(true)}
            depth={depth}
          />
        </div>
      )}

      {/* 3. Bottom 6-Parameter Strip */}
      <BottomParameterStrip
        selectedParam={selectedParam}
        setSelectedParam={setSelectedParam}
      />

      {/* 4. Interactive Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        activeRegion={activeRegion}
        onSelectRegion={(reg) => setActiveRegion(reg)}
        onCustomCoords={handleCustomCoords}
      />

      <DatePickerModal
        isOpen={isDatePickerModalOpen}
        onClose={() => setIsDatePickerModalOpen(false)}
        currentDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      <StormNewsModal
        isOpen={isStormNewsModalOpen}
        onClose={() => setIsStormNewsModalOpen(false)}
        activeRegion={activeRegion}
        isStormLayerActive={isStormLayerActive}
        setIsStormLayerActive={setIsStormLayerActive}
      />

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

      <AnalyticReportModal
        isOpen={isAnalyticReportOpen}
        onClose={() => setIsAnalyticReportOpen(false)}
        activeRegion={activeRegion}
        selectedDate={selectedDate}
        currentTime={formatCurrentTime(timeHour)}
      />

      <DepthPressureModal
        isOpen={isDepthPressureOpen}
        onClose={() => setIsDepthPressureOpen(false)}
        currentLat={activeRegion?.lat || 15.297}
        currentLon={activeRegion?.lon || 87.860}
        initialDepth={depth}
        onApplyDepth={(newDepth) => setDepth(newDepth)}
      />
    </div>
  );
}
