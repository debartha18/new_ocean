import * as THREE from 'three';

// Ultra-high fidelity procedural satellite Earth texture for India, Bay of Bengal, and Indian Ocean
export function generateEarthTopographyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Space & Ocean Deep Velvet Navy
  ctx.fillStyle = '#020714';
  ctx.fillRect(0, 0, 2048, 2048);

  // Deep Ocean Abyss base gradient
  const oceanGrad = ctx.createRadialGradient(1024, 1024, 200, 1024, 1024, 1000);
  oceanGrad.addColorStop(0, '#0a234f');
  oceanGrad.addColorStop(0.6, '#061633');
  oceanGrad.addColorStop(1, '#020714');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 2048);

  // Continental Shelf Shallows Glow (Cyan halo around coastlines)
  ctx.shadowColor = 'rgba(0, 220, 255, 0.45)';
  ctx.shadowBlur = 40;

  // 1. Indian Subcontinent & Sri Lanka Landmass
  ctx.fillStyle = '#2b3b27'; // Lush satellite terrain base
  ctx.strokeStyle = '#527a4d';
  ctx.lineWidth = 6;

  ctx.beginPath();
  ctx.moveTo(350, 220);   // Northwest / Thar Desert
  ctx.bezierCurveTo(450, 180, 750, 160, 950, 180); // Himalayas base
  ctx.bezierCurveTo(1050, 200, 1150, 320, 1080, 480); // Bangladesh / Sundarbans
  ctx.bezierCurveTo(980, 680, 900, 950, 760, 1280); // Coromandel Coast / Tamil Nadu
  ctx.bezierCurveTo(720, 1380, 660, 1420, 640, 1440); // Kanyakumari tip
  ctx.bezierCurveTo(580, 1250, 480, 850, 420, 520); // Western Ghats / Konkan
  ctx.bezierCurveTo(340, 420, 280, 320, 350, 220); // Gujarat / Rann of Kutch
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Deccan Plateau & Topographic Shading
  const deccanGrad = ctx.createRadialGradient(680, 850, 80, 680, 850, 450);
  deccanGrad.addColorStop(0, '#695232'); // Arid plateau interior
  deccanGrad.addColorStop(0.5, '#425832');
  deccanGrad.addColorStop(0.85, '#243a21'); // Western Ghats rainforest green
  deccanGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = deccanGrad;
  ctx.fill();

  // Snow-capped Himalayas & Tibetan Plateau
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(500, 180);
  ctx.bezierCurveTo(750, 140, 1000, 150, 1150, 220);
  ctx.bezierCurveTo(1100, 260, 800, 220, 500, 230);
  ctx.closePath();
  ctx.fill();

  // Sri Lanka
  ctx.fillStyle = '#264228';
  ctx.beginPath();
  ctx.ellipse(710, 1520, 60, 95, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Myanmar / Indochina / Thailand / Malay Peninsula (East Bay)
  ctx.fillStyle = '#223824';
  ctx.beginPath();
  ctx.moveTo(1180, 280);
  ctx.bezierCurveTo(1350, 260, 1600, 240, 1750, 300);
  ctx.bezierCurveTo(1850, 550, 1780, 980, 1720, 1450); // Thailand / Malaysia
  ctx.bezierCurveTo(1620, 1300, 1540, 980, 1450, 720); // Andaman Sea coast
  ctx.bezierCurveTo(1380, 580, 1260, 480, 1180, 280); // Myanmar Irrawaddy delta
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Andaman & Nicobar Island Chain
  ctx.fillStyle = '#4ade80';
  const andamanIslands = [
    [1360, 920], [1370, 980], [1380, 1050], [1390, 1130], [1405, 1220], [1420, 1320]
  ];
  andamanIslands.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 22, 0.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Coastal River Sediment Plumes (Ganges-Brahmaputra Delta)
  const plumeGrad = ctx.createRadialGradient(1040, 460, 10, 1040, 520, 220);
  plumeGrad.addColorStop(0, 'rgba(100, 160, 180, 0.6)');
  plumeGrad.addColorStop(0.5, 'rgba(0, 200, 255, 0.2)');
  plumeGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = plumeGrad;
  ctx.beginPath();
  ctx.ellipse(1040, 510, 180, 90, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural 3D Rocky Bathymetry Seabed Terrain Texture
export function generateBathymetryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep oceanic crust basalt
  ctx.fillStyle = '#06132b';
  ctx.fillRect(0, 0, 1024, 1024);

  // Rocky submarine mountain peaks & ridges
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const rad = 30 + Math.random() * 140;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, 'rgba(56, 140, 220, 0.45)');
    grad.addColorStop(0.4, 'rgba(20, 60, 120, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ninety East Submarine Mountain Ridge
  ctx.strokeStyle = 'rgba(80, 180, 255, 0.55)';
  ctx.lineWidth = 48;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(680, 80);
  ctx.bezierCurveTo(720, 380, 660, 680, 710, 950);
  ctx.stroke();

  // Sunda / Java Deep Oceanic Trench
  ctx.strokeStyle = 'rgba(1, 4, 12, 0.95)';
  ctx.lineWidth = 32;
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(820, 220);
  ctx.bezierCurveTo(860, 520, 840, 780, 890, 980);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 6 Mini Parameter Previews for Bottom Cards
export function generateParameterThumbnail(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 90;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#05122c';
  ctx.fillRect(0, 0, 160, 90);

  if (type === 'sst') {
    const grad = ctx.createRadialGradient(90, 45, 10, 80, 45, 75);
    grad.addColorStop(0, '#ff2a10');
    grad.addColorStop(0.35, '#ff9900');
    grad.addColorStop(0.65, '#22c55e');
    grad.addColorStop(0.85, '#06b6d4');
    grad.addColorStop(1, '#0c2856');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 90);
  } else if (type === 'salinity') {
    const grad = ctx.createLinearGradient(0, 0, 160, 90);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.4, '#0284c7');
    grad.addColorStop(0.8, '#06b6d4');
    grad.addColorStop(1, '#10b981');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 90);
  } else if (type === 'currents') {
    ctx.fillStyle = '#061a38';
    ctx.fillRect(0, 0, 160, 90);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(80, 45, 12 + i * 8, -Math.PI * 0.4, Math.PI * 0.9);
      ctx.stroke();
    }
  } else if (type === 'wave') {
    const grad = ctx.createLinearGradient(0, 90, 160, 0);
    grad.addColorStop(0, '#312e81');
    grad.addColorStop(0.5, '#8b5cf6');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 90);
  } else if (type === 'chlorophyll') {
    const grad = ctx.createRadialGradient(50, 30, 5, 80, 45, 80);
    grad.addColorStop(0, '#a3e635');
    grad.addColorStop(0.4, '#10b981');
    grad.addColorStop(0.8, '#064e3b');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 90);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 160, 90);
    grad.addColorStop(0, '#701a75');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#67e8f9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 90);
  }

  return canvas.toDataURL();
}
