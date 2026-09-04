import React, { useState, useRef } from 'react';
import { 
  Globe, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  CloudRain, 
  Compass,
  Umbrella
} from 'lucide-react';
import { REGIONS } from '../../data/oceanData';
import { COASTAL_BEACHES, calculateBeachRainForecast } from '../../data/beachData';
import { calculateHydrostaticPressure } from '../../utils/pressureCalculator';

export default function WorldMapView({ 
  activeRegion, 
  onSelectRegion, 
  onCustomCoords, 
  onBackTo3D 
}) {
  const [pinnedLocation, setPinnedLocation] = useState(null);
  const [mapLayer, setMapLayer] = useState('currents'); // 'currents', 'sst', 'storms', 'buoys', 'beaches'
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverCoords, setHoverCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBeach, setSelectedBeach] = useState(null);

  const containerRef = useRef(null);

  // Global Ocean Coordinates presets & buoy clusters across the world
  const globalFleet = [
    { id: 'F-01', name: 'Bay of Bengal Deep Mooring BD08', lat: 15.3, lon: 87.9, region: 'bay_of_bengal', type: 'mooredBuoy' },
    { id: 'F-02', name: 'Arabian Sea PIRATA Node AD02', lat: 18.4, lon: 66.8, region: 'arabian_sea', type: 'mooredBuoy' },
    { id: 'F-03', name: 'South China Sea Basin Buoy 01', lat: 14.5, lon: 114.2, region: 'south_china_sea', type: 'mooredBuoy' },
    { id: 'F-04', name: 'Gulf of Mexico NDBC 42001', lat: 25.0, lon: -90.0, region: 'gulf_of_mexico', type: 'mooredBuoy' },
    { id: 'F-05', name: 'North Atlantic Deep Buoy 41040', lat: 38.0, lon: -42.0, region: 'north_atlantic', type: 'mooredBuoy' },
    { id: 'F-06', name: 'Equatorial Pacific TAO TRITON', lat: 0.0, lon: -140.0, region: 'equatorial_pacific', type: 'mooredBuoy' },
    { id: 'F-07', name: 'Southern Ocean Antarctic Array', lat: -55.0, lon: 90.0, region: 'bay_of_bengal', type: 'argoFloat' },
    { id: 'F-08', name: 'Japan Trench Subduction Float', lat: 35.5, lon: 142.0, region: 'south_china_sea', type: 'argoFloat' },
    { id: 'F-09', name: 'Canary Current SVP Drifter', lat: 28.0, lon: -18.0, region: 'north_atlantic', type: 'driftingBuoy' }
  ];

  // Active Cyclones across the World
  const globalCyclones = [
    { name: 'Cyclone REMAL', cat: 'Cat 3', lat: 16.5, lon: 88.2, region: 'bay_of_bengal', wind: '135 km/h' },
    { name: 'Typhoon YAGI', cat: 'Cat 4', lat: 15.8, lon: 115.4, region: 'south_china_sea', wind: '160 km/h' },
    { name: 'Hurricane BERYL', cat: 'Cat 3', lat: 24.5, lon: -89.2, region: 'gulf_of_mexico', wind: '145 km/h' },
    { name: 'Cyclone TEJ', cat: 'Cat 2', lat: 14.2, lon: 60.5, region: 'arabian_sea', wind: '110 km/h' }
  ];

  // Ocean Current Streamlines
  const oceanCurrents = [
    { name: 'Gulf Stream', path: 'M 250 200 Q 350 140 500 120', color: '#f87171' },
    { name: 'North Atlantic Drift', path: 'M 500 120 Q 600 90 700 80', color: '#f87171' },
    { name: 'Kuroshio Current', path: 'M 750 240 Q 820 180 900 160', color: '#f87171' },
    { name: 'Equatorial Countercurrent', path: 'M 100 245 L 900 245', color: '#fb923c' },
    { name: 'California Current', path: 'M 160 140 Q 180 200 210 240', color: '#38bdf8' },
    { name: 'Humboldt / Peru Current', path: 'M 250 420 Q 240 320 260 260', color: '#38bdf8' },
    { name: 'Benguela Current', path: 'M 480 400 Q 460 300 480 240', color: '#38bdf8' },
    { name: 'Agulhas Current', path: 'M 590 280 Q 570 360 520 420', color: '#f87171' },
    { name: 'Indian Monsoon Drift', path: 'M 670 230 Q 730 220 800 240', color: '#fb923c' },
    { name: 'Antarctic Circumpolar Current', path: 'M 50 460 L 950 460', color: '#38bdf8' }
  ];

  // Transform lat/lon into SVG canvas coordinates (Mercator / Equirectangular projection)
  const geoToSvg = (lat, lon) => {
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const svgToGeo = (svgX, svgY) => {
    const lon = (svgX / 1000) * 360 - 180;
    const lat = 90 - (svgY / 500) * 180;
    return {
      lat: parseFloat(lat.toFixed(3)),
      lon: parseFloat(lon.toFixed(3))
    };
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Transform taking into account zoom and pan
      const svgX = (clickX - pan.x) / zoom;
      const svgY = (clickY - pan.y) / zoom;

      if (svgX >= 0 && svgX <= 1000 && svgY >= 0 && svgY <= 500) {
        const geo = svgToGeo(svgX, svgY);
        // Estimate bathymetry: deeper in open oceans (~3800m), shallow near equator/coasts
        const depthEst = Math.max(30, Math.round(3500 + Math.sin(geo.lat * 0.1) * 1800 - Math.cos(geo.lon * 0.05) * 800));
        const pressureEst = calculateHydrostaticPressure(depthEst, geo.lat);
        setHoverCoords({ ...geo, depth: depthEst, pressure: pressureEst });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMapClick = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const svgX = (clickX - pan.x) / zoom;
      const svgY = (clickY - pan.y) / zoom;

      if (svgX >= 0 && svgX <= 1000 && svgY >= 0 && svgY <= 500) {
        const geo = svgToGeo(svgX, svgY);
        const depthEst = Math.max(50, Math.round(3200 + Math.sin(geo.lat * 0.1) * 1600));
        const pressureInfo = calculateHydrostaticPressure(depthEst, geo.lat);
        setPinnedLocation({ ...geo, depth: depthEst, pressure: pressureInfo });
      }
    }
  };

  const handleZoom = (delta) => {
    setZoom((prev) => Math.min(4, Math.max(1, parseFloat((prev + delta).toFixed(1)))));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const query = q.toLowerCase();
    const matchedBeaches = COASTAL_BEACHES.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.state.toLowerCase().includes(query) ||
        b.country.toLowerCase().includes(query)
    );
    const matchedRegions = Object.values(REGIONS).filter((r) =>
      r.name.toLowerCase().includes(query)
    );

    setSearchResults([
      ...matchedRegions.map((r) => ({ type: 'region', data: r, name: r.name, lat: r.lat, lon: r.lon })),
      ...matchedBeaches.map((b) => ({ type: 'beach', data: b, name: b.name, lat: b.lat, lon: b.lon }))
    ]);
  };

  const handleSelectSearchResult = (res) => {
    const pos = geoToSvg(res.lat, res.lon);
    setPan({
      x: 500 - pos.x * 2,
      y: 250 - pos.y * 2
    });
    setZoom(2.2);
    setSearchQuery(res.name);
    setSearchResults([]);

    if (res.type === 'beach') {
      setSelectedBeach(calculateBeachRainForecast(res.data));
      setPinnedLocation({ lat: res.lat, lon: res.lon, name: res.name, depth: 35 });
    } else {
      onSelectRegion(res.data);
    }
  };

  const handleTargetPinned = () => {
    if (pinnedLocation) {
      onCustomCoords({
        id: 'custom_pin',
        name: pinnedLocation.name || `Point (${pinnedLocation.lat}°, ${pinnedLocation.lon}°)`,
        coords: `${Math.abs(pinnedLocation.lat).toFixed(3)}° ${pinnedLocation.lat >= 0 ? 'N' : 'S'}, ${Math.abs(pinnedLocation.lon).toFixed(3)}° ${pinnedLocation.lon >= 0 ? 'E' : 'W'}`,
        lat: pinnedLocation.lat,
        lon: pinnedLocation.lon,
        cameraPosition: [0, 3.4, 4.8],
        cameraLookAt: [0, -0.35, 0.1],
        earthRotation: [Math.PI * 0.58, 0, (pinnedLocation.lon / 180) * Math.PI],
        sst: 28.2,
        salinity: 34.8,
        currentSpeed: 0.9,
        waveHeight: 1.8,
        stormProbability: 45,
        rainRate: 18.0,
        activeStorm: {
          name: 'Regional Maritime System',
          category: 'Active Sea State',
          windSpeed: '45 km/h',
          pressure: '1008 hPa',
          surge: '0.8m',
          movement: 'Eastward',
          rainfallForecast: 'Standard coastal sea state with localized convective showers'
        },
        buoys: [
          {
            id: 'PINNED-BUOY',
            type: 'mooredBuoy',
            name: `Ocean Observation Station (${pinnedLocation.lat}°, ${pinnedLocation.lon}°)`,
            lat: pinnedLocation.lat,
            lon: pinnedLocation.lon,
            x: 0,
            z: 0,
            sst: 28.2,
            salinity: 34.8,
            currentSpeed: 0.9,
            waveHeight: 1.8,
            battery: '100%',
            qcStatus: 'Target Locked',
            mooringDepth: pinnedLocation.depth || 3200,
            lastTransmission: 'Live Target',
            depthProfile: [
              { depth: 0, temp: 28.2, salinity: 34.8 },
              { depth: 50, temp: 26.8, salinity: 35.1 },
              { depth: 100, temp: 21.4, salinity: 35.5 },
              { depth: 500, temp: 9.8, salinity: 35.0 }
            ]
          }
        ]
      });
      onBackTo3D();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#030712] overflow-hidden select-none animate-in fade-in duration-200">
      {/* Top Map Control Bar */}
      <div className="h-16 px-6 border-b border-sky-500/20 bg-[#061026]/90 backdrop-blur-md flex items-center justify-between z-20 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackTo3D}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-cyan-300 border border-sky-500/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to 3D Twin</span>
          </button>
          <div className="h-5 w-px bg-sky-500/20" />
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white hidden sm:block">
              Global Ocean Digital Twin Map & Beach Radar
            </h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#09183d] border border-sky-500/30 text-xs text-sky-200">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              placeholder="Search beach or ocean basin..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-xs w-full placeholder-slate-400"
            />
          </div>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-[#071536] border border-sky-500/40 rounded-xl shadow-2xl p-2 z-30 max-h-60 overflow-y-auto">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left p-2 rounded-lg hover:bg-sky-500/20 text-xs flex items-center justify-between transition-colors text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    {res.type === 'beach' ? (
                      <Umbrella className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span className="font-bold text-white">{res.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {res.lat}°N, {res.lon}°E
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layer Switches */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#09183d] p-1 rounded-xl border border-sky-500/20">
          {[
            { id: 'currents', label: 'Currents' },
            { id: 'beaches', label: 'Beaches & Rain' },
            { id: 'sst', label: 'Thermal SST' },
            { id: 'storms', label: 'Active Cyclones' },
            { id: 'buoys', label: 'Sensor Fleet' }
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setMapLayer(layer.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapLayer === layer.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-sky-500/10'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1 bg-[#09183d] p-1 rounded-xl border border-sky-500/20">
          <button
            onClick={() => handleZoom(0.3)}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-sky-500/20 text-cyan-300"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.3)}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-sky-500/20 text-cyan-300"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Map"
            className="p-1.5 rounded-lg hover:bg-sky-500/20 text-cyan-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Surface */}
      <div 
        className="relative flex-1 bg-[#02091a] overflow-hidden flex items-center justify-center p-3"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* SVG Container */}
        <div 
          ref={containerRef}
          onClick={handleMapClick}
          className="relative w-full h-full max-w-[1450px] max-h-[750px] rounded-3xl glass-panel border border-sky-500/30 overflow-hidden shadow-2xl bg-[#030d24] cursor-crosshair"
        >
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-full transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '500px 250px'
            }}
          >
            <defs>
              <pattern id="worldGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.8" />
              </pattern>
              <radialGradient id="cycloneGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="beachRainGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ocean Floor Grid */}
            <rect width="1000" height="500" fill="url(#worldGrid)" />

            {/* Ocean Basins Bathymetric Tinting (Deep Abyssal Zones) */}
            <circle cx="200" cy="300" r="120" fill="rgba(2, 28, 68, 0.4)" />
            <circle cx="450" cy="200" r="90" fill="rgba(2, 28, 68, 0.4)" />
            <circle cx="700" cy="300" r="140" fill="rgba(2, 28, 68, 0.4)" />
            <circle cx="900" cy="300" r="130" fill="rgba(2, 28, 68, 0.4)" />

            {/* Equator & Latitudinal Grid Lines */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1" strokeDasharray="5 5" />
            <text x="15" y="245" fill="rgba(0, 240, 255, 0.6)" fontSize="9" fontFamily="monospace">Equator 0°</text>

            <line x1="0" y1="185" x2="1000" y2="185" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
            <text x="15" y="180" fill="rgba(255, 255, 255, 0.4)" fontSize="8" fontFamily="monospace">Tropic of Cancer 23.5° N</text>

            <line x1="0" y1="315" x2="1000" y2="315" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
            <text x="15" y="310" fill="rgba(255, 255, 255, 0.4)" fontSize="8" fontFamily="monospace">Tropic of Capricorn 23.5° S</text>

            {/* Prime Meridian & Longitude 0° */}
            <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" strokeDasharray="4 4" />
            <text x="505" y="15" fill="rgba(255, 255, 255, 0.4)" fontSize="8" fontFamily="monospace">0° Meridian</text>

            {/* Continental Shelf & Coastline Polygons */}
            {/* North America */}
            <path 
              d="M 100 80 L 160 55 L 240 60 L 290 85 L 300 130 L 255 190 L 220 230 L 180 200 L 160 170 L 120 160 L 90 120 Z" 
              fill="#132a1c" 
              stroke="#2e5c38" 
              strokeWidth="1.2" 
            />
            {/* South America */}
            <path 
              d="M 270 250 L 335 270 L 365 330 L 340 420 L 295 460 L 270 410 L 255 330 L 245 280 Z" 
              fill="#132a1c" 
              stroke="#2e5c38" 
              strokeWidth="1.2" 
            />
            {/* Europe */}
            <path 
              d="M 460 70 L 530 65 L 560 90 L 580 130 L 530 160 L 480 155 L 450 120 Z" 
              fill="#1a3522" 
              stroke="#3b7348" 
              strokeWidth="1.2" 
            />
            {/* Africa */}
            <path 
              d="M 460 170 L 570 170 L 610 240 L 590 320 L 550 390 L 480 360 L 435 250 L 440 190 Z" 
              fill="#2b2716" 
              stroke="#544c2c" 
              strokeWidth="1.2" 
            />
            {/* Asia (mainland) */}
            <path 
              d="M 580 60 L 820 45 L 910 120 L 910 190 L 860 240 L 810 270 L 760 270 L 680 230 L 630 170 L 590 120 Z" 
              fill="#1b3623" 
              stroke="#3b7348" 
              strokeWidth="1.2" 
            />
            {/* Indian Subcontinent (Enhanced detailed peninsula) */}
            <path 
              d="M 680 170 L 740 170 L 755 210 L 735 260 L 710 285 L 685 240 Z" 
              fill="#3a522f" 
              stroke="#5e874d" 
              strokeWidth="1.5" 
            />
            {/* Japan */}
            <path d="M 880 140 Q 900 165 890 190" fill="none" stroke="#5e874d" strokeWidth="2.5" />
            {/* Southeast Asia & Indonesia Archipelago */}
            <path d="M 770 270 L 810 320 L 860 320" fill="none" stroke="#5e874d" strokeWidth="2" strokeDasharray="5 3" />
            {/* Australia */}
            <path 
              d="M 780 320 L 880 310 L 910 370 L 860 420 L 790 410 L 760 360 Z" 
              fill="#382c1a" 
              stroke="#5e492b" 
              strokeWidth="1.2" 
            />
            {/* Antarctica */}
            <path d="M 30 480 L 970 480 L 970 500 L 30 500 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1" />

            {/* Ocean Current Flow Lines Layer */}
            {(mapLayer === 'currents' || mapLayer === 'sst') && (
              <g opacity="0.8">
                {oceanCurrents.map((cur, i) => (
                  <g key={i}>
                    <path
                      d={cur.path}
                      fill="none"
                      stroke={cur.color}
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                    <text
                      x={cur.path.split(' ')[1]}
                      y={parseFloat(cur.path.split(' ')[2]) - 6}
                      fill={cur.color}
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {cur.name}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* Major Ocean Basin Cards */}
            {Object.values(REGIONS).map((reg) => {
              const pos = geoToSvg(reg.lat, reg.lon);
              const isActive = activeRegion.id === reg.id;
              return (
                <g 
                  key={reg.id} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onSelectRegion(reg); 
                    onBackTo3D(); 
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={pos.x - 42}
                    y={pos.y - 25}
                    width="84"
                    height="50"
                    rx="10"
                    fill={isActive ? 'rgba(0, 240, 255, 0.3)' : 'rgba(14, 165, 233, 0.15)'}
                    stroke={isActive ? '#00f0ff' : '#0284c7'}
                    strokeWidth={isActive ? '2' : '1'}
                    className="hover:fill-cyan-500/35 transition-all"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 6}
                    fill={isActive ? '#00f0ff' : '#ffffff'}
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {reg.name}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 8}
                    fill="#38bdf8"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    SST: {reg.sst}°C • {reg.waveHeight}m
                  </text>
                </g>
              );
            })}

            {/* Coastal Beaches & Near-Sea Rain Forecast Layer */}
            {(mapLayer === 'beaches' || mapLayer === 'currents') &&
              COASTAL_BEACHES.map((bch) => {
                const pos = geoToSvg(bch.lat, bch.lon);
                const forecast = calculateBeachRainForecast(bch);
                const isSelected = selectedBeach?.beachId === bch.id;

                return (
                  <g
                    key={bch.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBeach(forecast);
                      setPinnedLocation({ lat: bch.lat, lon: bch.lon, name: bch.name, depth: 30 });
                    }}
                    className="cursor-pointer group"
                  >
                    {forecast.rainProbability > 60 && (
                      <circle cx={pos.x} cy={pos.y} r="12" fill="url(#beachRainGlow)" className="animate-ping" />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 6 : 4}
                      fill={forecast.safetyFlag.includes('Red') ? '#ef4444' : forecast.safetyFlag.includes('Yellow') ? '#f59e0b' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                    <text
                      x={pos.x + 6}
                      y={pos.y + 3}
                      fill="#f1f5f9"
                      fontSize="7"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {bch.name.split(' ')[0]} ({forecast.rainProbability}% 🌧)
                    </text>
                  </g>
                );
              })}

            {/* Active Cyclones Layer */}
            {(mapLayer === 'storms' || mapLayer === 'currents') &&
              globalCyclones.map((cyclone, idx) => {
                const pos = geoToSvg(cyclone.lat, cyclone.lon);
                return (
                  <g key={idx} className="cursor-pointer animate-pulse">
                    <circle cx={pos.x} cy={pos.y} r="28" fill="url(#cycloneGlow)" />
                    <circle cx={pos.x} cy={pos.y} r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pos.x + 12} y={pos.y - 4} fill="#fca5a5" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                      {cyclone.name} ({cyclone.cat})
                    </text>
                    <text x={pos.x + 12} y={pos.y + 7} fill="#fdba74" fontSize="7" fontFamily="monospace">
                      {cyclone.wind}
                    </text>
                  </g>
                );
              })}

            {/* Global Buoy Fleet Markers Layer */}
            {(mapLayer === 'buoys' || mapLayer === 'currents') &&
              globalFleet.map((buoy) => {
                const pos = geoToSvg(buoy.lat, buoy.lon);
                return (
                  <g key={buoy.id} className="cursor-pointer">
                    <circle cx={pos.x} cy={pos.y} r="4" fill="#facc15" stroke="#000000" strokeWidth="1" />
                  </g>
                );
              })}

            {/* User Dropped Pin Marker */}
            {pinnedLocation && (() => {
              const pos = geoToSvg(pinnedLocation.lat, pinnedLocation.lon);
              return (
                <g className="animate-bounce">
                  <circle cx={pos.x} cy={pos.y} r="9" fill="#00f0ff" stroke="#ffffff" strokeWidth="2" />
                  <line x1={pos.x} y1={pos.y - 24} x2={pos.x} y2={pos.y} stroke="#00f0ff" strokeWidth="2.5" />
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Real-time Cursor Coordinate & Bathymetric Pressure Inspector HUD (Bottom Left) */}
        {hoverCoords && (
          <div className="absolute bottom-6 left-6 glass-panel p-3 rounded-2xl border border-sky-500/30 text-xs font-mono shadow-cockpit z-30 pointer-events-none">
            <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspector: {hoverCoords.lat}° {hoverCoords.lat >= 0 ? 'N' : 'S'}, {hoverCoords.lon}° {hoverCoords.lon >= 0 ? 'E' : 'W'}</span>
            </div>
            <div className="text-slate-300 flex items-center gap-3">
              <span>Bathymetry: <b className="text-white">{hoverCoords.depth}m</b></span>
              <span>Pressure: <b className="text-amber-300">{hoverCoords.pressure?.dbar} dbar</b> ({hoverCoords.pressure?.atm} atm)</span>
            </div>
          </div>
        )}

        {/* Pinned Location & Beach Weather Forecast Card (Bottom Right) */}
        {pinnedLocation && (
          <div className="absolute bottom-6 right-6 glass-panel p-4 rounded-2xl border border-cyan-400/50 shadow-glow-cyan z-30 max-w-sm bg-[#05112e]/95">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{pinnedLocation.name || 'Custom Target Coordinates'}</span>
              </div>
              <button 
                onClick={() => { setPinnedLocation(null); setSelectedBeach(null); }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-sm font-mono font-bold text-white mb-2">
              {pinnedLocation.lat}° {pinnedLocation.lat >= 0 ? 'N' : 'S'}, {pinnedLocation.lon}° {pinnedLocation.lon >= 0 ? 'E' : 'W'}
            </div>

            {/* If a beach was clicked, show beach rain forecast */}
            {selectedBeach ? (
              <div className="mb-3 p-2.5 rounded-xl bg-[#091d4a] border border-sky-500/20">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>Rain: {selectedBeach.rainProbability}% ({selectedBeach.total24hPrecipMm} mm)</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">Swell: {selectedBeach.surfWaveHeight}m</span>
                </div>
                <div className="text-[11px] text-slate-300 italic">
                  {selectedBeach.advisoryText}
                </div>
              </div>
            ) : (
              <div className="mb-3 text-[11px] text-slate-300 font-mono">
                Seafloor Bathymetry: ~{pinnedLocation.depth || 3200}m • Hydrostatic Pressure: ~{pinnedLocation.pressure?.dbar || 3250} dbar
              </div>
            )}

            <button
              onClick={handleTargetPinned}
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-xs font-bold text-white shadow-glow-cyan flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Load 3D Ocean Digital Twin Here</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
