export const REGIONS = {
  bay_of_bengal: {
    id: 'bay_of_bengal',
    name: 'Bay of Bengal',
    coords: '15.297° N, 87.860° E',
    lat: 15.297,
    lon: 87.860,
    cameraPosition: [0.1, 3.4, 4.8],
    cameraLookAt: [0, -0.35, 0.1],
    earthRotation: [Math.PI * 0.58, 0, -Math.PI * 0.12],
    sst: 29.85,
    salinity: 33.42,
    currentSpeed: 0.85,
    waveHeight: 1.65,
    stormProbability: 84,
    rainRate: 38.5,
    activeStorm: {
      name: 'Severe Cyclonic Storm REMAL',
      category: 'Cat 3 Tropical Cyclone',
      windSpeed: '135 km/h (73 knots)',
      pressure: '968 hPa',
      surge: '2.8m above normal tide',
      movement: 'North-Northeast at 14 km/h',
      rainfallForecast: 'Heavy to very heavy rainfall (120-200mm/24h)'
    },
    buoys: [
      {
        id: 'RAMA-BD08',
        type: 'mooredBuoy',
        name: 'RAMA / OMNI Buoy BD08 (Central Bay)',
        lat: 15.297,
        lon: 87.860,
        x: 0.1,
        z: 0.05,
        sst: 29.85,
        salinity: 33.42,
        currentSpeed: 0.85,
        waveHeight: 1.65,
        battery: '98%',
        qcStatus: 'QC Passed',
        mooringDepth: 2850,
        lastTransmission: '10 mins ago',
        depthProfile: [
          { depth: 0, temp: 29.85, salinity: 33.42 },
          { depth: 10, temp: 29.70, salinity: 33.55 },
          { depth: 50, temp: 28.90, salinity: 34.20 },
          { depth: 100, temp: 24.10, salinity: 34.85 },
          { depth: 200, temp: 17.50, salinity: 35.10 },
          { depth: 500, temp: 10.20, salinity: 35.05 },
          { depth: 1000, temp: 6.80, salinity: 34.95 },
          { depth: 2000, temp: 3.20, salinity: 34.80 }
        ]
      },
      {
        id: 'OMNI-BD10',
        type: 'mooredBuoy',
        name: 'OMNI Buoy BD10 (North Bay)',
        lat: 18.250,
        lon: 89.650,
        x: 0.45,
        z: -0.65,
        sst: 28.40,
        salinity: 31.10,
        currentSpeed: 1.15,
        waveHeight: 1.40,
        battery: '94%',
        qcStatus: 'QC Passed',
        mooringDepth: 2200,
        lastTransmission: '25 mins ago',
        depthProfile: [
          { depth: 0, temp: 28.40, salinity: 31.10 },
          { depth: 10, temp: 28.30, salinity: 31.40 },
          { depth: 50, temp: 27.50, salinity: 33.80 },
          { depth: 100, temp: 23.20, salinity: 34.70 },
          { depth: 200, temp: 16.80, salinity: 35.00 },
          { depth: 500, temp: 9.80, salinity: 35.02 },
          { depth: 1000, temp: 6.40, salinity: 34.92 }
        ]
      },
      {
        id: 'RAMA-BD12',
        type: 'mooredBuoy',
        name: 'RAMA Moored Buoy BD12 (South-West)',
        lat: 11.500,
        lon: 86.200,
        x: -0.55,
        z: 0.70,
        sst: 30.20,
        salinity: 34.15,
        currentSpeed: 0.72,
        waveHeight: 1.85,
        battery: '99%',
        qcStatus: 'QC Passed',
        mooringDepth: 3400,
        lastTransmission: '5 mins ago',
        depthProfile: [
          { depth: 0, temp: 30.20, salinity: 34.15 },
          { depth: 50, temp: 29.30, salinity: 34.60 },
          { depth: 100, temp: 25.40, salinity: 35.00 },
          { depth: 500, temp: 11.00, salinity: 35.08 }
        ]
      },
      {
        id: 'ARGO-2902184',
        type: 'argoFloat',
        name: 'INCOIS Argo Profiling Float #2902184',
        lat: 14.100,
        lon: 91.800,
        x: 0.85,
        z: 0.35,
        sst: 29.50,
        salinity: 33.90,
        currentSpeed: 0.65,
        waveHeight: 1.50,
        battery: '88%',
        qcStatus: 'Profile Completed (Cycle 142)',
        mooringDepth: 2000,
        lastTransmission: '2 hours ago',
        depthProfile: [
          { depth: 0, temp: 29.50, salinity: 33.90 },
          { depth: 10, temp: 29.40, salinity: 33.95 },
          { depth: 50, temp: 28.70, salinity: 34.30 },
          { depth: 100, temp: 24.50, salinity: 34.90 },
          { depth: 200, temp: 18.00, salinity: 35.15 },
          { depth: 500, temp: 10.50, salinity: 35.05 },
          { depth: 1000, temp: 6.90, salinity: 34.96 },
          { depth: 2000, temp: 3.30, salinity: 34.82 }
        ]
      }
    ]
  },
  arabian_sea: {
    id: 'arabian_sea',
    name: 'Arabian Sea',
    coords: '18.420° N, 66.850° E',
    lat: 18.420,
    lon: 66.850,
    cameraPosition: [-0.6, 3.4, 4.8],
    cameraLookAt: [-0.2, -0.35, 0.1],
    earthRotation: [Math.PI * 0.58, 0, Math.PI * 0.15],
    sst: 28.90,
    salinity: 36.40,
    currentSpeed: 1.25,
    waveHeight: 2.45,
    stormProbability: 62,
    rainRate: 22.0,
    activeStorm: {
      name: 'Cyclonic Storm TEJ',
      category: 'Cat 2 Cyclonic Storm',
      windSpeed: '105 km/h (57 knots)',
      pressure: '984 hPa',
      surge: '1.8m above normal tide',
      movement: 'West-Northwest at 18 km/h',
      rainfallForecast: 'Moderate to heavy rain bands across Oman coast'
    },
    buoys: [
      {
        id: 'RAMA-AD02',
        type: 'mooredBuoy',
        name: 'RAMA Moored Buoy AD02 (North Arabian Sea)',
        lat: 18.420,
        lon: 66.850,
        x: -0.2,
        z: -0.1,
        sst: 28.90,
        salinity: 36.40,
        currentSpeed: 1.25,
        waveHeight: 2.45,
        battery: '96%',
        qcStatus: 'QC Passed',
        mooringDepth: 3100,
        lastTransmission: '14 mins ago',
        depthProfile: [
          { depth: 0, temp: 28.90, salinity: 36.40 },
          { depth: 10, temp: 28.80, salinity: 36.45 },
          { depth: 50, temp: 27.10, salinity: 36.80 },
          { depth: 100, temp: 22.80, salinity: 36.50 },
          { depth: 500, temp: 11.20, salinity: 35.60 }
        ]
      },
      {
        id: 'OMNI-AD04',
        type: 'mooredBuoy',
        name: 'OMNI Buoy AD04 (Central Arabian Sea)',
        lat: 15.000,
        lon: 69.000,
        x: 0.3,
        z: 0.4,
        sst: 29.30,
        salinity: 36.15,
        currentSpeed: 0.95,
        waveHeight: 2.10,
        battery: '92%',
        qcStatus: 'QC Passed',
        mooringDepth: 3600,
        lastTransmission: '30 mins ago',
        depthProfile: [
          { depth: 0, temp: 29.30, salinity: 36.15 },
          { depth: 50, temp: 28.20, salinity: 36.50 },
          { depth: 100, temp: 23.50, salinity: 36.20 }
        ]
      }
    ]
  },
  south_china_sea: {
    id: 'south_china_sea',
    name: 'South China Sea',
    coords: '14.500° N, 114.200° E',
    lat: 14.500,
    lon: 114.200,
    cameraPosition: [0.8, 3.4, 4.6],
    cameraLookAt: [0.3, -0.35, 0.1],
    earthRotation: [Math.PI * 0.58, 0, -Math.PI * 0.35],
    sst: 30.40,
    salinity: 34.10,
    currentSpeed: 1.10,
    waveHeight: 2.80,
    stormProbability: 76,
    rainRate: 42.0,
    activeStorm: {
      name: 'Super Typhoon YAGI',
      category: 'Cat 4 Super Typhoon',
      windSpeed: '210 km/h (113 knots)',
      pressure: '935 hPa',
      surge: '4.2m storm surge',
      movement: 'West-Northwest at 22 km/h',
      rainfallForecast: 'Torrential rainfall (>250mm/24h) along Hainan/Vietnam'
    },
    buoys: [
      {
        id: 'SCS-BUOY-01',
        type: 'mooredBuoy',
        name: 'South China Sea Deep Basin Station #01',
        lat: 14.500,
        lon: 114.200,
        x: 0.2,
        z: 0.1,
        sst: 30.40,
        salinity: 34.10,
        currentSpeed: 1.10,
        waveHeight: 2.80,
        battery: '95%',
        qcStatus: 'QC Passed',
        mooringDepth: 4200,
        lastTransmission: '8 mins ago',
        depthProfile: [
          { depth: 0, temp: 30.40, salinity: 34.10 },
          { depth: 50, temp: 29.80, salinity: 34.40 },
          { depth: 100, temp: 25.10, salinity: 34.80 }
        ]
      }
    ]
  },
  gulf_of_mexico: {
    id: 'gulf_of_mexico',
    name: 'Gulf of Mexico',
    coords: '25.000° N, 90.000° W',
    lat: 25.000,
    lon: -90.000,
    cameraPosition: [-0.4, 3.5, 4.7],
    cameraLookAt: [-0.1, -0.35, 0.1],
    earthRotation: [Math.PI * 0.58, 0, Math.PI * 0.85],
    sst: 31.10,
    salinity: 36.20,
    currentSpeed: 1.40,
    waveHeight: 1.95,
    stormProbability: 70,
    rainRate: 28.0,
    activeStorm: {
      name: 'Hurricane BERYL',
      category: 'Cat 3 Major Hurricane',
      windSpeed: '185 km/h (100 knots)',
      pressure: '952 hPa',
      surge: '3.1m storm surge',
      movement: 'Northwest at 20 km/h',
      rainfallForecast: 'Heavy squalls (150mm) across coastal Texas & Louisiana'
    },
    buoys: [
      {
        id: 'NOAA-42001',
        type: 'mooredBuoy',
        name: 'NOAA NDBC Moored Buoy 42001 (Central Gulf)',
        lat: 25.000,
        lon: -90.000,
        x: 0.1,
        z: -0.1,
        sst: 31.10,
        salinity: 36.20,
        currentSpeed: 1.40,
        waveHeight: 1.95,
        battery: '99%',
        qcStatus: 'QC Passed',
        mooringDepth: 3250,
        lastTransmission: '12 mins ago',
        depthProfile: [
          { depth: 0, temp: 31.10, salinity: 36.20 },
          { depth: 50, temp: 30.10, salinity: 36.50 },
          { depth: 100, temp: 26.20, salinity: 36.70 }
        ]
      }
    ]
  },
  north_atlantic: {
    id: 'north_atlantic',
    name: 'North Atlantic Ocean',
    coords: '38.000° N, 42.000° W',
    lat: 38.000,
    lon: -42.000,
    cameraPosition: [0.0, 3.5, 4.8],
    cameraLookAt: [0.0, -0.35, 0.1],
    earthRotation: [Math.PI * 0.52, 0, Math.PI * 0.65],
    sst: 22.40,
    salinity: 35.80,
    currentSpeed: 1.65,
    waveHeight: 3.40,
    stormProbability: 45,
    rainRate: 15.0,
    activeStorm: {
      name: 'Extratropical Cyclone HELENA',
      category: 'Deep Oceanic Low',
      windSpeed: '95 km/h (51 knots)',
      pressure: '978 hPa',
      surge: '2.2m wave swell',
      movement: 'East-Northeast at 35 km/h',
      rainfallForecast: 'Widespread frontal rain & high gale seas'
    },
    buoys: [
      {
        id: 'PIRATA-41040',
        type: 'mooredBuoy',
        name: 'PIRATA / NDBC Ocean Buoy 41040',
        lat: 38.000,
        lon: -42.000,
        x: 0.0,
        z: 0.0,
        sst: 22.40,
        salinity: 35.80,
        currentSpeed: 1.65,
        waveHeight: 3.40,
        battery: '97%',
        qcStatus: 'QC Passed',
        mooringDepth: 4800,
        lastTransmission: '20 mins ago',
        depthProfile: [
          { depth: 0, temp: 22.40, salinity: 35.80 },
          { depth: 100, temp: 18.20, salinity: 35.90 },
          { depth: 500, temp: 12.10, salinity: 35.50 }
        ]
      }
    ]
  },
  equatorial_pacific: {
    id: 'equatorial_pacific',
    name: 'Equatorial Pacific (El Niño Basin)',
    coords: '0.000° N, 140.000° W',
    lat: 0.000,
    lon: -140.000,
    cameraPosition: [0.0, 3.4, 4.8],
    cameraLookAt: [0.0, -0.35, 0.1],
    earthRotation: [Math.PI * 0.50, 0, -Math.PI * 0.85],
    sst: 29.10,
    salinity: 35.10,
    currentSpeed: 0.75,
    waveHeight: 1.70,
    stormProbability: 38,
    rainRate: 18.0,
    activeStorm: {
      name: 'Tropical Disturbance 94W',
      category: 'Invest Low Pressure Area',
      windSpeed: '55 km/h (30 knots)',
      pressure: '1004 hPa',
      surge: '1.1m swell',
      movement: 'West at 15 km/h',
      rainfallForecast: 'Intertropical Convergence Zone convective squalls'
    },
    buoys: [
      {
        id: 'TAO-TRITON-0N140W',
        type: 'mooredBuoy',
        name: 'TAO / TRITON Moored Array 0°N 140°W',
        lat: 0.000,
        lon: -140.000,
        x: 0.0,
        z: 0.0,
        sst: 29.10,
        salinity: 35.10,
        currentSpeed: 0.75,
        waveHeight: 1.70,
        battery: '99%',
        qcStatus: 'QC Passed',
        mooringDepth: 4400,
        lastTransmission: '16 mins ago',
        depthProfile: [
          { depth: 0, temp: 29.10, salinity: 35.10 },
          { depth: 50, temp: 28.50, salinity: 35.20 },
          { depth: 100, temp: 23.40, salinity: 35.30 }
        ]
      }
    ]
  }
};

export const PARAMETERS = {
  sst: {
    id: 'sst',
    name: 'Sea Surface Temperature',
    unit: '°C',
    min: 20,
    max: 32,
    ticks: [20, 23, 26, 29, 32],
    colorScale: ['#001f3f', '#0074D9', '#00d2be', '#2ECC40', '#FFDC00', '#FF851B', '#FF4136'],
    gradientCss: 'linear-gradient(to right, #001f3f, #0074D9, #00d2be, #2ECC40, #FFDC00, #FF851B, #FF4136)',
    icon: 'Thermometer',
    description: 'Upper ocean thermal state driving atmospheric convection & cyclone genesis.'
  },
  salinity: {
    id: 'salinity',
    name: 'Salinity',
    unit: 'PSU',
    min: 30,
    max: 37,
    ticks: [30, 31.8, 33.5, 35.2, 37],
    colorScale: ['#051e3e', '#0f4c81', '#1b98e0', '#56cbf9', '#00ffc8'],
    gradientCss: 'linear-gradient(to right, #051e3e, #0f4c81, #1b98e0, #56cbf9, #00ffc8)',
    icon: 'Droplets',
    description: 'Practical Salinity Units influenced by river discharge, precipitation & evaporation.'
  },
  currents: {
    id: 'currents',
    name: 'Ocean Currents',
    unit: 'm/s',
    min: 0.0,
    max: 2.2,
    ticks: [0.0, 0.5, 1.0, 1.5, 2.2],
    colorScale: ['#0a1128', '#034078', '#1282a2', '#00f0ff', '#ffffff'],
    gradientCss: 'linear-gradient(to right, #0a1128, #034078, #1282a2, #00f0ff, #ffffff)',
    icon: 'Wind',
    description: 'Geostrophic boundary currents and mesoscale cyclonic/anticyclonic eddy velocity.'
  },
  wave: {
    id: 'wave',
    name: 'Wave Height',
    unit: 'm',
    min: 0.5,
    max: 5.5,
    ticks: [0.5, 1.5, 2.5, 3.5, 5.5],
    colorScale: ['#1e1b4b', '#4338ca', '#8b5cf6', '#ec4899', '#f43f5e'],
    gradientCss: 'linear-gradient(to right, #1e1b4b, #4338ca, #8b5cf6, #ec4899, #f43f5e)',
    icon: 'Activity',
    description: 'Significant wave height (Hs) generated by seasonal wind swells and storm surges.'
  },
  chlorophyll: {
    id: 'chlorophyll',
    name: 'Chlorophyll-a',
    unit: 'mg/m³',
    min: 0.05,
    max: 4.5,
    ticks: [0.05, 0.5, 1.5, 3.0, 4.5],
    colorScale: ['#022c22', '#065f46', '#059669', '#10b981', '#a3e635', '#fef08a'],
    gradientCss: 'linear-gradient(to right, #022c22, #065f46, #059669, #10b981, #a3e635, #fef08a)',
    icon: 'Flower2',
    description: 'Phytoplankton biomass indicator and primary marine biological productivity.'
  },
  oxygen: {
    id: 'oxygen',
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    min: 1.5,
    max: 8.0,
    ticks: [1.5, 3.0, 4.5, 6.0, 8.0],
    colorScale: ['#4a044e', '#701a75', '#0284c7', '#06b6d4', '#67e8f9'],
    gradientCss: 'linear-gradient(to right, #4a044e, #701a75, #0284c7, #06b6d4, #67e8f9)',
    icon: 'Sparkles',
    description: 'Oxygen minimum zones (OMZ) at 100-500m depth critical for marine life ecosystems.'
  }
};

export const DEPTH_LEVELS = [0, 10, 50, 100, 200, 500, 1000, 2000, 4000, 6000];

export const VIEW_MODES = [
  { id: 'surface', label: 'Surface', icon: 'Layers' },
  { id: 'depth_slice', label: 'Depth Slice', icon: 'Box' },
  { id: 'volume', label: 'Volume', icon: 'Boxes' },
  { id: 'isosurface', label: 'Isosurface', icon: 'Maximize2' },
  { id: 'vector_field', label: 'Vector Field', icon: 'Compass' }
];

export const IN_SITU_SUMMARY = {
  driftingBuoy: { count: 12, label: 'Drifting Buoy', color: '#facc15', bg: 'bg-yellow-400' },
  mooredBuoy: { count: 8, label: 'Moored Buoy', color: '#4ade80', bg: 'bg-green-400' },
  argoFloat: { count: 24, label: 'Argo Float', color: '#38bdf8', bg: 'bg-sky-400' },
  tideGauge: { count: 5, label: 'Tide Gauge', color: '#c084fc', bg: 'bg-purple-400' }
};

export const BUOY_MARKERS = REGIONS.bay_of_bengal.buoys;

export const VALIDATION_TIME_SERIES = [
  { time: '10 Aug', model: 28.2, observed: 28.0 },
  { time: '11 Aug', model: 28.6, observed: 28.4 },
  { time: '12 Aug', model: 27.9, observed: 27.5 },
  { time: '13 Aug', model: 29.1, observed: 28.8 },
  { time: '14 Aug', model: 28.4, observed: 28.1 },
  { time: '15 Aug', model: 29.8, observed: 29.9 }
];

export const VALIDATION_METRICS = {
  parameter: 'Sea Surface Temperature',
  rmse: '0.78 °C',
  bias: '0.35 °C',
  correlation: '0.91',
  sampleCount: 1420
};

export const AI_ANOMALY = {
  title: 'Anomaly Detected',
  headline: 'Temperature is significantly higher than model prediction at 50m depth in this region.',
  confidence: '94.2%',
  detectedAt: '15 Aug 2026 11:30 UTC',
  location: 'Central Bay of Bengal (15.297° N, 87.860° E)',
  depthRange: '45m – 110m',
  deviation: '+2.45 °C above ROMS/HYCOM baseline',
  anomalyType: 'Subsurface Marine Heatwave & Barrier Layer Thickening',
  details: 'A pronounced subsurface thermal anomaly of +2.45°C detected by RAMA-BD08 and confirmed across Argo float #2902184. High Gangetic freshwater cap creates strong halocline stratification, trapping solar insolation in the barrier layer and accelerating localized cyclone intensification potential.'
};

export const MARINE_NEWS_BULLETINS = [
  {
    id: 'NW-01',
    time: '30 mins ago',
    source: 'IMD Marine Met Centre',
    severity: 'critical',
    title: 'Gale Wind & Storm Surge Warning: Cyclone / Squall Alert',
    content: 'Squally wind speed reaching 110-130 kmph gusting to 145 kmph very likely over active storm sector. Sea condition will be phenomenal. Marine vessels advised extreme caution.'
  },
  {
    id: 'NW-02',
    time: '2 hours ago',
    source: 'Joint Typhoon Warning Center (JTWC)',
    severity: 'warning',
    title: 'Tropical Cyclone Genesis Potential: Elevated Probability within 24 Hours',
    content: 'High Ocean Heat Content (OHC) exceeding 115 kJ/cm² and low vertical wind shear provide hyper-favorable environmental conditions for rapid intensification.'
  },
  {
    id: 'NW-03',
    time: '4 hours ago',
    source: 'INCOIS Ocean State Forecast',
    severity: 'info',
    title: 'High Wave & Coastal Swell Warning',
    content: 'High waves in the range of 3.5 to 5.2 meters forecasted along active coastal zones during high tide cycles.'
  },
  {
    id: 'NW-04',
    time: '6 hours ago',
    source: 'NOAA Global Ocean Observing System',
    severity: 'info',
    title: 'Global Moored Buoy & Argo Fleet Telemetry Synchronized',
    content: 'Deep-ocean moorings and profiling floats reporting continuous CTD casts down to 2000m depth with 99.4% QC data completeness.'
  }
];

export function createLocationData(lat, lon, customName = null, dateStr = '15 Aug 2026') {
  const absLat = Math.abs(lat);
  // Realistic SST based on latitude and seasonal cycle
  const baseSst = Math.max(1.5, Math.min(31.5, 30.5 - Math.pow(absLat / 65, 1.7) * 26));
  const salinity = 33.0 + Math.sin(absLat * 0.1) * 3.5;
  const currentSpeed = 0.5 + Math.abs(Math.sin(lat * 0.2 + lon * 0.1)) * 1.2;
  
  // Tropical and sub-tropical convergence zones have higher storm probability
  let stormProb = Math.round(15 + Math.max(0, 75 - Math.abs(absLat - 16) * 4.2) + Math.sin(lon * 0.1) * 10);
  stormProb = Math.max(5, Math.min(94, stormProb));
  
  const rainRate = (stormProb > 50 ? (20 + (stormProb - 50) * 0.6) : (stormProb * 0.35)).toFixed(1);
  const waveHeight = (1.2 + (stormProb / 100) * 2.8).toFixed(2);

  const formattedCoords = `${absLat.toFixed(3)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? 'E' : 'W'}`;
  const displayName = customName || `Station (${absLat.toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'})`;

  let stormName = 'Maritime Convective System';
  let stormCat = 'Low Pressure Disturbance';
  let windSpeed = `${Math.round(45 + stormProb * 1.2)} km/h`;
  let pressure = `${Math.round(1012 - stormProb * 0.6)} hPa`;
  let surge = `${(0.6 + stormProb * 0.035).toFixed(1)}m`;

  if (stormProb >= 75) {
    stormName = 'Severe Cyclone Vortex';
    stormCat = 'Cat 3-4 Tropical Cyclone';
  } else if (stormProb >= 50) {
    stormName = 'Tropical Storm / Squall Cell';
    stormCat = 'Cat 1 Tropical Storm';
  } else if (stormProb >= 30) {
    stormName = 'Active Squall Line & Swell';
    stormCat = 'Monsoon Depression';
  }

  return {
    id: `coord_${lat.toFixed(2)}_${lon.toFixed(2)}`,
    name: displayName,
    coords: formattedCoords,
    lat,
    lon,
    cameraPosition: [0, 3.4, 4.8],
    cameraLookAt: [0, -0.35, 0.1],
    earthRotation: [Math.PI * 0.58, 0, (lon / 180) * Math.PI],
    sst: parseFloat(baseSst.toFixed(2)),
    salinity: parseFloat(salinity.toFixed(2)),
    currentSpeed: parseFloat(currentSpeed.toFixed(2)),
    waveHeight: parseFloat(waveHeight),
    stormProbability: stormProb,
    rainRate: parseFloat(rainRate),
    date: dateStr,
    activeStorm: {
      name: stormName,
      category: stormCat,
      windSpeed,
      pressure,
      surge,
      movement: 'Northwest at 16 km/h',
      rainfallForecast: `Precipitation forecast: ${rainRate} mm/h with squalls and wave swells up to ${waveHeight}m`
    },
    buoys: [
      {
        id: `BUOY-${Math.abs(Math.round(lat))}${Math.abs(Math.round(lon))}`,
        type: 'mooredBuoy',
        name: `Deep Ocean Station (${formattedCoords})`,
        lat,
        lon,
        x: 0.1,
        z: 0.0,
        sst: parseFloat(baseSst.toFixed(2)),
        salinity: parseFloat(salinity.toFixed(2)),
        currentSpeed: parseFloat(currentSpeed.toFixed(2)),
        waveHeight: parseFloat(waveHeight),
        battery: '98%',
        qcStatus: 'Real-time Synchronized',
        mooringDepth: Math.round(2500 + Math.abs(Math.sin(lat)) * 2000),
        lastTransmission: '3 mins ago',
        depthProfile: [
          { depth: 0, temp: parseFloat(baseSst.toFixed(2)), salinity: parseFloat(salinity.toFixed(2)) },
          { depth: 50, temp: parseFloat((baseSst - 0.9).toFixed(2)), salinity: parseFloat((salinity + 0.3).toFixed(2)) },
          { depth: 100, temp: parseFloat((baseSst - 4.5).toFixed(2)), salinity: parseFloat((salinity + 0.6).toFixed(2)) },
          { depth: 500, temp: parseFloat((baseSst - 17.0).toFixed(2)), salinity: parseFloat((salinity + 0.4).toFixed(2)) }
        ]
      }
    ]
  };
}

