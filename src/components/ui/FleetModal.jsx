import React, { useState } from 'react';
import { X, Radio, Filter, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { BUOY_MARKERS } from '../../data/oceanData';

export default function FleetModal({ isOpen, onClose, onSelectBuoy }) {
  const [filterType, setFilterType] = useState('all');

  if (!isOpen) return null;

  const filteredBuoys = BUOY_MARKERS.filter(b => filterType === 'all' || b.type === filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="glass-panel rounded-3xl p-6 border border-sky-400/40 shadow-glow-blue max-w-2xl w-full relative animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-sky-500/10 text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 shadow-glow-cyan">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">In-Situ Sensor Fleet Directory</h2>
            <p className="text-xs text-sky-300/70 font-mono">
              RAMA / OMNI Moored Network • SVP Drifters • INCOIS Argo Floats
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-sky-500/15 overflow-x-auto">
          {[
            { id: 'all', label: 'All Assets (49)' },
            { id: 'mooredBuoy', label: 'Moored Buoys (8)' },
            { id: 'driftingBuoy', label: 'Drifting Buoys (12)' },
            { id: 'argoFloat', label: 'Argo Floats (24)' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ' + (
                filterType === f.id
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'bg-[#0a1838] text-slate-300 hover:text-white border border-sky-500/20'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Buoy Fleet Cards List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
          {filteredBuoys.map((buoy) => (
            <div
              key={buoy.id}
              onClick={() => {
                onSelectBuoy(buoy);
                onClose();
              }}
              className="bg-[#081533]/80 hover:bg-[#0e214d] border border-sky-500/20 hover:border-cyan-400 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {buoy.name}
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-cyan-300">
                      {buoy.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                    <span>Lat: {buoy.lat}° N, Lon: {buoy.lon}° E</span>
                    <span>•</span>
                    <span>SST: {buoy.sst}°C</span>
                    <span>•</span>
                    <span>Salinity: {buoy.salinity} PSU</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {buoy.qcStatus}
                </span>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
