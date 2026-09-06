import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  CheckCircle2, 
  FileSpreadsheet, 
  FileCode, 
  Waves,
  ArrowRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { REGIONS } from '../../data/oceanData';
import { COASTAL_BEACHES, calculateBeachRainForecast } from '../../data/beachData';
import { calculateHydrostaticPressure } from '../../utils/pressureCalculator';

export default function DataExplorerView({ onSelectRegion, onNavigateTab }) {
  const [selectedBasin, setSelectedBasin] = useState('all');
  const [selectedParam, setSelectedParam] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortField, setSortField] = useState('stationId');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const formatCoords = (lat, lon) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
  };

  // Fixed Station Cards matching the reference map
  const fixedStations = [
    { id: 'ST-46001', name: 'Station 46001', basin: 'North Pacific', lat: 28.2, lon: -145.6, sst: 26.1, wave: 1.2, depth: 3600 },
    { id: 'ST-EQPAC', name: 'Equatorial Pacific (El Niño)', basin: 'Equatorial Pacific', lat: 0.0, lon: -140.0, sst: 29.8, wave: 1.7, depth: 4400 },
    { id: 'ST-55012', name: 'Station 55012', basin: 'South Pacific', lat: -32.4, lon: -123.7, sst: 18.7, wave: 2.1, depth: 4100 },
    { id: 'ST-62019', name: 'Station 62019', basin: 'North Atlantic Ocean', lat: 48.3, lon: -12.6, sst: 17.3, wave: 1.8, depth: 2100 },
    { id: 'ST-NATL', name: 'North Atlantic Ocean Station', basin: 'North Atlantic Ocean', lat: 35.0, lon: -40.0, sst: 22.4, wave: 2.2, depth: 4800 },
    { id: 'ST-BOB', name: 'Bay of Bengal Deep Station', basin: 'Bay of Bengal', lat: 15.3, lon: 87.9, sst: 28.9, wave: 1.6, depth: 2850 },
    { id: 'ST-ARAB', name: 'Arabian Sea Station', basin: 'Arabian Sea', lat: 18.4, lon: 66.8, sst: 29.1, wave: 2.3, depth: 3100 },
    { id: 'ST-71023', name: 'Station 71023', basin: 'South Indian Ocean', lat: -41.2, lon: 86.8, sst: 12.4, wave: 2.4, depth: 4500 },
    { id: 'ST-80045', name: 'Station 80045', basin: 'West Australian Basin', lat: -20.5, lon: 114.3, sst: 24.6, wave: 1.6, depth: 3900 }
  ];

  // Synthesize comprehensive oceanographic records from all stations & depth levels
  const rawDataset = useMemo(() => {
    const records = [];

    // 1. Regional In-Situ Buoys & CTD Profiles
    Object.values(REGIONS).forEach((reg) => {
      if (!reg.buoys) return;
      reg.buoys.forEach((buoy) => {
        if (!buoy.depthProfile) return;
        buoy.depthProfile.forEach((dp) => {
          const pressure = calculateHydrostaticPressure(dp.depth, buoy.lat, dp.temp, dp.salinity);

          // Temperature record
          records.push({
            id: `${buoy.id}-TEMP-${dp.depth}`,
            stationId: buoy.id,
            stationName: buoy.name,
            basin: reg.name,
            lat: buoy.lat,
            lon: buoy.lon,
            coords: formatCoords(buoy.lat, buoy.lon),
            platform: buoy.type === 'mooredBuoy' ? 'Moored Buoy (RAMA/OMNI)' : 'Argo Profiling Float',
            depth: dp.depth,
            parameter: 'Temperature',
            value: dp.temp,
            numericVal: dp.temp,
            unit: '°C',
            pressureDbar: pressure.dbar,
            qcStatus: buoy.qcStatus || 'QC Passed',
            timestamp: buoy.lastTransmission || '10 mins ago',
            regionData: reg
          });

          // Salinity record
          records.push({
            id: `${buoy.id}-SAL-${dp.depth}`,
            stationId: buoy.id,
            stationName: buoy.name,
            basin: reg.name,
            lat: buoy.lat,
            lon: buoy.lon,
            coords: formatCoords(buoy.lat, buoy.lon),
            platform: buoy.type === 'mooredBuoy' ? 'Moored Buoy (RAMA/OMNI)' : 'Argo Profiling Float',
            depth: dp.depth,
            parameter: 'Salinity',
            value: dp.salinity,
            numericVal: dp.salinity,
            unit: 'PSU',
            pressureDbar: pressure.dbar,
            qcStatus: buoy.qcStatus || 'QC Passed',
            timestamp: buoy.lastTransmission || '10 mins ago',
            regionData: reg
          });

          // Pressure record
          records.push({
            id: `${buoy.id}-PRES-${dp.depth}`,
            stationId: buoy.id,
            stationName: buoy.name,
            basin: reg.name,
            lat: buoy.lat,
            lon: buoy.lon,
            coords: formatCoords(buoy.lat, buoy.lon),
            platform: buoy.type === 'mooredBuoy' ? 'Moored Buoy (RAMA/OMNI)' : 'Argo Profiling Float',
            depth: dp.depth,
            parameter: 'Hydrostatic Pressure',
            value: pressure.dbar,
            numericVal: pressure.dbar,
            unit: 'dbar',
            pressureDbar: pressure.dbar,
            qcStatus: 'Synthesized UNESCO',
            timestamp: buoy.lastTransmission || '10 mins ago',
            regionData: reg
          });
        });
      });
    });

    // 2. Fixed Global Stations from Map View
    fixedStations.forEach((st) => {
      const p = calculateHydrostaticPressure(st.depth, st.lat, st.sst, 35.0);
      records.push({
        id: `${st.id}-SST`,
        stationId: st.id,
        stationName: st.name,
        basin: st.basin,
        lat: st.lat,
        lon: st.lon,
        coords: formatCoords(st.lat, st.lon),
        platform: 'Global Observing Station',
        depth: 0,
        parameter: 'Temperature',
        value: st.sst,
        numericVal: st.sst,
        unit: '°C',
        pressureDbar: 10.13,
        qcStatus: 'QC Passed',
        timestamp: 'Real-time Live',
        stationMeta: st
      });
      records.push({
        id: `${st.id}-WAVE`,
        stationId: st.id,
        stationName: st.name,
        basin: st.basin,
        lat: st.lat,
        lon: st.lon,
        coords: formatCoords(st.lat, st.lon),
        platform: 'Global Observing Station',
        depth: 0,
        parameter: 'Wave Height',
        value: st.wave,
        numericVal: st.wave,
        unit: 'm',
        pressureDbar: 10.13,
        qcStatus: 'QC Passed',
        timestamp: 'Real-time Live',
        stationMeta: st
      });
      records.push({
        id: `${st.id}-BATHY`,
        stationId: st.id,
        stationName: st.name,
        basin: st.basin,
        lat: st.lat,
        lon: st.lon,
        coords: formatCoords(st.lat, st.lon),
        platform: 'Global Observing Station',
        depth: st.depth,
        parameter: 'Hydrostatic Pressure',
        value: p.dbar,
        numericVal: p.dbar,
        unit: 'dbar',
        pressureDbar: p.dbar,
        qcStatus: 'Synthesized UNESCO',
        timestamp: 'Bathymetric Benchmark',
        stationMeta: st
      });
    });

    // 3. Coastal Beach Radars
    COASTAL_BEACHES.slice(0, 15).forEach((bch) => {
      const forecast = calculateBeachRainForecast(bch);
      records.push({
        id: `BCH-${bch.id}-WAVE`,
        stationId: bch.id.toUpperCase(),
        stationName: bch.name,
        basin: bch.state + ', ' + bch.country,
        lat: bch.lat,
        lon: bch.lon,
        coords: formatCoords(bch.lat, bch.lon),
        platform: 'Coastal Radar & Beach Telemetry',
        depth: 0,
        parameter: 'Wave Height',
        value: bch.normalWaveHeight,
        numericVal: bch.normalWaveHeight,
        unit: 'm',
        pressureDbar: 10.13,
        qcStatus: `Rain: ${forecast.rainProbability}% (${forecast.flagColor})`,
        timestamp: 'Updated 5m ago',
        beachData: bch
      });
    });

    return records;
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return rawDataset.filter((item) => {
      const matchBasin = selectedBasin === 'all' || item.basin.toLowerCase().includes(selectedBasin.toLowerCase());
      const matchParam = selectedParam === 'all' || item.parameter.toLowerCase() === selectedParam.toLowerCase();
      const matchPlatform = selectedPlatform === 'all' || item.platform.toLowerCase().includes(selectedPlatform.toLowerCase());
      const matchSearch =
        !searchTerm.trim() ||
        item.stationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.basin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.parameter.toLowerCase().includes(searchTerm.toLowerCase());

      return matchBasin && matchParam && matchPlatform && matchSearch;
    });
  }, [rawDataset, selectedBasin, selectedParam, selectedPlatform, searchTerm]);

  // Sorted dataset
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'value') {
        aVal = a.numericVal;
        bVal = b.numericVal;
      }

      if (typeof aVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [filteredData, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleResetFilters = () => {
    setSelectedBasin('all');
    setSelectedParam('all');
    setSelectedPlatform('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Station ID', 'Station Name', 'Basin', 'Coordinates', 'Platform', 'Depth (m)', 'Parameter', 'Measured Value', 'Unit', 'Pressure (dbar)', 'QC Status', 'Timestamp'];
    const rows = sortedData.map((d) => [
      `"${d.stationId}"`,
      `"${d.stationName}"`,
      `"${d.basin}"`,
      `"${d.coords}"`,
      `"${d.platform}"`,
      d.depth,
      `"${d.parameter}"`,
      d.value,
      `"${d.unit}"`,
      d.pressureDbar,
      `"${d.qcStatus}"`,
      `"${d.timestamp}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ocean_vision_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(sortedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ocean_vision_dataset_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#030712] text-slate-100 p-4 md:p-6 select-none animate-in fade-in duration-200 custom-scrollbar">
      {/* 1. Header & Data Query Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-sky-500/20">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white uppercase">
              Global Oceanographic Data Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Query, sort, inspect, and export multi-depth CTD profiles, global observing stations, and coastal radar time-series
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-cyan-300 border border-sky-500/30 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-cyan-300 border border-sky-500/30 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-[#071638]/70 p-3.5 rounded-2xl border border-sky-500/25 mb-4 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <label className="text-[10px] font-mono text-slate-400 block mb-1">Keyword Search</label>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#030c22] border border-sky-500/30 text-xs text-slate-200">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              placeholder="Search station, basin..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none outline-none w-full text-xs font-normal"
            />
          </div>
        </div>

        {/* Ocean Basin Filter */}
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-1">Ocean Basin</label>
          <select
            value={selectedBasin}
            onChange={(e) => { setSelectedBasin(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-1.5 rounded-xl bg-[#030c22] border border-sky-500/30 text-xs font-mono text-cyan-300 focus:outline-none"
          >
            <option value="all">All Basins (Global)</option>
            <option value="bay of bengal">Bay of Bengal</option>
            <option value="arabian sea">Arabian Sea</option>
            <option value="south china sea">South China Sea</option>
            <option value="gulf of mexico">Gulf of Mexico</option>
            <option value="north atlantic">North Atlantic</option>
            <option value="equatorial pacific">Equatorial Pacific</option>
            <option value="south pacific">South Pacific</option>
            <option value="south indian">South Indian Ocean</option>
          </select>
        </div>

        {/* Parameter Filter */}
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-1">Physical Parameter</label>
          <select
            value={selectedParam}
            onChange={(e) => { setSelectedParam(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-1.5 rounded-xl bg-[#030c22] border border-sky-500/30 text-xs font-mono text-amber-300 focus:outline-none"
          >
            <option value="all">All Parameters</option>
            <option value="temperature">Temperature (°C)</option>
            <option value="salinity">Practical Salinity (PSU)</option>
            <option value="wave height">Wave Height (m)</option>
            <option value="hydrostatic pressure">Hydrostatic Pressure (dbar)</option>
          </select>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-1">Observing Platform</label>
          <select
            value={selectedPlatform}
            onChange={(e) => { setSelectedPlatform(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-1.5 rounded-xl bg-[#030c22] border border-sky-500/30 text-xs font-mono text-emerald-300 focus:outline-none"
          >
            <option value="all">All Platform Classes</option>
            <option value="moored buoy">Moored Array (RAMA/OMNI)</option>
            <option value="argo">Argo Profiling Float</option>
            <option value="global observing">Global Fixed Stations</option>
            <option value="coastal radar">Coastal Beach Radars</option>
          </select>
        </div>

        {/* Reset Filters */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleResetFilters}
            className="w-full py-1.5 px-3 rounded-xl bg-[#030c22] hover:bg-[#08183d] border border-sky-500/30 text-xs text-cyan-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* 3. Summary Count & Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 px-1 mb-2 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span>Showing <b>{paginatedData.length}</b> of <b>{sortedData.length}</b> telemetry records</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-emerald-400 hidden sm:flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>QC Level-3 Validated</span>
          </span>
        </div>

        {/* Pagination UI */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px]">
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded bg-[#071638] border border-sky-500/20 disabled:opacity-40 hover:bg-sky-500/20 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded bg-[#071638] border border-sky-500/20 disabled:opacity-40 hover:bg-sky-500/20 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-0.5 rounded bg-[#071638] border border-sky-500/20 text-[10px] text-cyan-300 outline-none"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>

      {/* 4. Interactive Data Records Table */}
      <div className="overflow-x-auto rounded-2xl border border-sky-500/25 bg-[#05112e]/90 shadow-cockpit">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-[#081a42] border-b border-sky-500/30 text-[10px] text-slate-300 uppercase z-10 select-none">
            <tr>
              <th onClick={() => handleSort('stationId')} className="py-2.5 px-3 cursor-pointer hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Station ID</span>
                  {sortField === 'stationId' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </div>
              </th>
              <th onClick={() => handleSort('basin')} className="py-2.5 px-3 cursor-pointer hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Basin / Sector</span>
                  {sortField === 'basin' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </div>
              </th>
              <th className="py-2.5 px-3">Coordinates</th>
              <th onClick={() => handleSort('platform')} className="py-2.5 px-3 cursor-pointer hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Platform</span>
                  {sortField === 'platform' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </div>
              </th>
              <th onClick={() => handleSort('depth')} className="py-2.5 px-3 cursor-pointer hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Depth</span>
                  {sortField === 'depth' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </div>
              </th>
              <th onClick={() => handleSort('parameter')} className="py-2.5 px-3 cursor-pointer hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Parameter</span>
                  {sortField === 'parameter' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </div>
              </th>
              <th onClick={() => handleSort('value')} className="py-2.5 px-3 cursor-pointer hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Measured Value</span>
                  {sortField === 'value' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </div>
              </th>
              <th onClick={() => handleSort('pressureDbar')} className="py-2.5 px-3 cursor-pointer hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Pressure (dbar)</span>
                  {sortField === 'pressureDbar' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </div>
              </th>
              <th className="py-2.5 px-3">QC Status</th>
              <th className="py-2.5 px-3">Sync Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedRecord(row)}
                className="border-b border-white/5 hover:bg-sky-500/15 cursor-pointer transition-colors"
              >
                <td className="py-2 px-3 font-bold text-cyan-300">{row.stationId}</td>
                <td className="py-2 px-3 text-white truncate max-w-[150px]">{row.basin}</td>
                <td className="py-2 px-3 text-slate-300">{row.coords}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${
                    row.platform.includes('Moored')
                      ? 'bg-blue-500/20 text-sky-300 border border-blue-400/30'
                      : row.platform.includes('Argo')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : row.platform.includes('Beach')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                  }`}>
                    {row.platform}
                  </span>
                </td>
                <td className="py-2 px-3 font-bold text-white">{row.depth} m</td>
                <td className="py-2 px-3 text-amber-200">{row.parameter}</td>
                <td className="py-2 px-3 font-bold text-cyan-200">{row.value} {row.unit}</td>
                <td className="py-2 px-3 text-emerald-300">{row.pressureDbar}</td>
                <td className="py-2 px-3 text-[10px] text-emerald-400 truncate max-w-[140px]">{row.qcStatus}</td>
                <td className="py-2 px-3 text-[10px] text-slate-400">{row.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Record Floating Action Drawer */}
      {selectedRecord && (
        <div className="fixed bottom-6 right-6 p-4 rounded-2xl glass-panel border border-cyan-400/50 bg-[#061436]/95 shadow-glow-cyan z-30 max-w-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-cyan-300">{selectedRecord.stationName}</span>
            <button 
              onClick={() => setSelectedRecord(null)} 
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-0.5"
            >
              ✕
            </button>
          </div>
          <div className="text-[11px] text-slate-300 mb-2 font-mono leading-snug">
            {selectedRecord.parameter}: <b className="text-white">{selectedRecord.value} {selectedRecord.unit}</b> at depth {selectedRecord.depth}m ({selectedRecord.pressureDbar} dbar)
            <div className="text-[10px] text-slate-400 mt-1">Location: {selectedRecord.coords}</div>
          </div>
          <button
            onClick={() => {
              if (selectedRecord.regionData) {
                onSelectRegion?.(selectedRecord.regionData);
              } else {
                const reg = Object.values(REGIONS).find((r) => r.name.toLowerCase().includes(selectedRecord.basin.toLowerCase()));
                if (reg) onSelectRegion?.(reg);
              }
              onNavigateTab?.('3D View');
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-glow-cyan cursor-pointer transition-all"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Simulate Station in 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
