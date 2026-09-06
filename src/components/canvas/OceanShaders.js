import * as THREE from 'three';

// Ocean surface vertex & fragment shader with vibrant multi-parameter heatmaps & streamline flow
export const OceanSurfaceShader = {
  uniforms: {
    uTime: { value: 0 },
    uParamType: { value: 0 }, // 0: SST, 1: Salinity, 2: Currents, 3: Wave, 4: Chlorophyll, 5: Oxygen
    uDepth: { value: 50.0 },  // 0 to 6000m
    uMode: { value: 1 },       // 0: Surface, 1: Depth Slice, 2: Volume, 3: Isosurface, 4: Vector Field
    uWaveSwell: { value: 1.0 }, // Multiplier for physical wave heights
    uSunDirection: { value: new THREE.Vector3(0.5, 1.0, 0.5).normalize() },
    uEnsoPhase: { value: 1 }, // 0: Normal, 1: El Niño, 2: La Niña
    uEnsoIntensity: { value: 0.75 }, // 0.0 to 1.0
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWaveHeight;
    varying float vFoam;
    uniform float uTime;
    uniform float uWaveSwell;

    void main() {
      vUv = uv;
      
      // Dynamic physical 3D wave displacement harmonics
      float k1 = 18.0;
      float w1 = uTime * 2.2;
      float wave1 = sin(uv.x * k1 + uv.y * 12.0 + w1) * 0.042 * uWaveSwell;
      
      float k2 = 36.0;
      float w2 = uTime * 3.2;
      float wave2 = sin(uv.x * 24.0 - uv.y * k2 - w2) * 0.024 * uWaveSwell;
      
      // Peaked wave crests (sharp crests, flatter troughs)
      float wave3 = pow((sin(uv.x * 32.0 + uv.y * 26.0 + uTime * 2.8) * 0.5 + 0.5), 2.2) * 0.038 * uWaveSwell;
      
      float totalWave = wave1 + wave2 + wave3;
      vWaveHeight = totalWave;
      
      // Foam factor on crest peaks
      vFoam = smoothstep(0.035 * uWaveSwell, 0.075 * uWaveSwell, totalWave);

      vec3 displaced = position;
      displaced.z += totalWave;

      vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
      vWorldPosition = worldPos.xyz;
      
      vec3 norm = normal;
      norm.x += cos(uv.x * 28.0 + uTime * 2.2) * 0.08 * uWaveSwell;
      norm.y += sin(uv.y * 28.0 + uTime * 2.2) * 0.08 * uWaveSwell;
      vNormal = normalize(normalMatrix * norm);

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform int uParamType;
    uniform float uDepth;
    uniform int uMode;
    uniform float uWaveSwell;
    uniform int uEnsoPhase;
    uniform float uEnsoIntensity;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWaveHeight;
    varying float vFoam;

    // High saturation rainbow colormap matching target reference image
    vec3 colormapSST(float t) {
      // 20°C (deep blue) -> 23°C (cyan) -> 26°C (green) -> 29°C (yellow/orange) -> 32°C (intense fiery red)
      vec3 c0 = vec3(0.01, 0.15, 0.45); // Deep Blue
      vec3 c1 = vec3(0.0, 0.65, 0.95);  // Electric Cyan
      vec3 c2 = vec3(0.1, 0.88, 0.35);  // Vibrant Green
      vec3 c3 = vec3(1.0, 0.92, 0.05);  // Bright Yellow
      vec3 c4 = vec3(1.0, 0.42, 0.0);   // Warm Orange
      vec3 c5 = vec3(0.95, 0.08, 0.05); // Fiery Thermal Red

      if (t < 0.20) return mix(c0, c1, t / 0.20);
      if (t < 0.45) return mix(c1, c2, (t - 0.20) / 0.25);
      if (t < 0.65) return mix(c2, c3, (t - 0.45) / 0.20);
      if (t < 0.82) return mix(c3, c4, (t - 0.65) / 0.17);
      return mix(c4, c5, (t - 0.82) / 0.18);
    }

    vec3 colormapSalinity(float t) {
      vec3 c0 = vec3(0.02, 0.10, 0.28);
      vec3 c1 = vec3(0.05, 0.35, 0.70);
      vec3 c2 = vec3(0.12, 0.72, 0.95);
      vec3 c3 = vec3(0.0, 1.0, 0.80);
      if (t < 0.33) return mix(c0, c1, t / 0.33);
      if (t < 0.66) return mix(c1, c2, (t - 0.33) / 0.33);
      return mix(c2, c3, (t - 0.66) / 0.34);
    }

    vec3 colormapCurrents(float t) {
      vec3 c0 = vec3(0.04, 0.08, 0.20);
      vec3 c1 = vec3(0.02, 0.40, 0.75);
      vec3 c2 = vec3(0.0, 0.95, 1.0);
      vec3 c3 = vec3(1.0, 1.0, 1.0);
      if (t < 0.4) return mix(c0, c1, t / 0.4);
      if (t < 0.75) return mix(c1, c2, (t - 0.4) / 0.35);
      return mix(c2, c3, (t - 0.75) / 0.25);
    }

    vec3 colormapWave(float t) {
      vec3 c0 = vec3(0.15, 0.12, 0.45);
      vec3 c1 = vec3(0.35, 0.25, 0.85);
      vec3 c2 = vec3(0.70, 0.30, 0.90);
      vec3 c3 = vec3(0.95, 0.25, 0.45);
      if (t < 0.35) return mix(c0, c1, t / 0.35);
      if (t < 0.70) return mix(c1, c2, (t - 0.35) / 0.35);
      return mix(c2, c3, (t - 0.70) / 0.30);
    }

    vec3 colormapChlorophyll(float t) {
      vec3 c0 = vec3(0.01, 0.16, 0.12);
      vec3 c1 = vec3(0.04, 0.45, 0.32);
      vec3 c2 = vec3(0.12, 0.82, 0.48);
      vec3 c3 = vec3(0.75, 0.95, 0.22);
      if (t < 0.33) return mix(c0, c1, t / 0.33);
      if (t < 0.66) return mix(c1, c2, (t - 0.33) / 0.33);
      return mix(c2, c3, (t - 0.66) / 0.34);
    }

    vec3 colormapOxygen(float t) {
      vec3 c0 = vec3(0.35, 0.05, 0.40);
      vec3 c1 = vec3(0.05, 0.55, 0.85);
      vec3 c2 = vec3(0.30, 0.92, 0.98);
      if (t < 0.5) return mix(c0, c1, t / 0.5);
      return mix(c1, c2, (t - 0.5) / 0.5);
    }

    void main() {
      vec2 p = vUv * 2.0 - 1.0;

      // Primary Warm Core Eddy located in Central-East Bay of Bengal
      float distToWarmCore = length(p - vec2(0.28, -0.05));
      float warmCore = exp(-distToWarmCore * 2.2);

      // Secondary coastal eddy & upwelling pattern
      float distToWestCoast = length(p - vec2(-0.55, 0.1));
      float coastalCooling = smoothstep(-0.85, -0.2, p.x) * 0.28;

      // Gangetic delta thermal variation
      float northPlume = smoothstep(0.2, 0.8, p.y) * exp(-abs(p.x - 0.1) * 2.5) * 0.2;

      float val = 0.5;
      if (uParamType == 0) {
        val = 0.32 + warmCore * 0.68 + northPlume - coastalCooling;
        val = clamp(val - (uDepth / 6000.0) * 0.65, 0.0, 1.0);

        // Dynamic El Niño / La Niña thermal anomaly modulation
        if (uEnsoPhase == 1) {
          // El Niño: Massive warm pool surge spreading eastward towards the eastern boundary (p.x > 0.0)
          float elNinoTongue = smoothstep(-0.6, 0.7, p.x) * exp(-p.y * p.y * 3.5);
          val = clamp(val + 0.16 * uEnsoIntensity + elNinoTongue * 0.44 * uEnsoIntensity, 0.0, 1.0);
        } else if (uEnsoPhase == 2) {
          // La Niña: Cold tongue upwelling strongly emerging in the eastern/central basin
          float laNinaTongue = smoothstep(-0.3, 0.8, p.x) * exp(-p.y * p.y * 3.5);
          val = clamp(val - 0.32 * uEnsoIntensity * laNinaTongue, 0.02, 1.0);
        }
      } else if (uParamType == 1) {
        val = clamp(0.90 - northPlume * 2.5 + (1.0 - distToWarmCore) * 0.2, 0.0, 1.0);
      } else if (uParamType == 2) {
        float gyreRot = sin(distToWarmCore * 14.0 - uTime * 2.5) * 0.3 + 0.6;
        val = clamp(gyreRot + warmCore * 0.3, 0.0, 1.0);
      } else if (uParamType == 3) {
        val = clamp(0.75 - p.y * 0.45 + sin(p.x * 10.0 + uTime) * 0.12, 0.0, 1.0);
      } else if (uParamType == 4) {
        val = clamp(northPlume * 3.0 + (1.0 - smoothstep(-0.9, -0.3, p.x)) * 0.5 + 0.15, 0.0, 1.0);
      } else {
        val = clamp(0.92 - (uDepth / 400.0) * 0.6, 0.08, 0.95);
      }

      val = clamp(val, 0.0, 1.0);

      vec3 color;
      if (uParamType == 0) color = colormapSST(val);
      else if (uParamType == 1) color = colormapSalinity(val);
      else if (uParamType == 2) color = colormapCurrents(val);
      else if (uParamType == 3) color = colormapWave(val);
      else if (uParamType == 4) color = colormapChlorophyll(val);
      else color = colormapOxygen(val);

      // Fine current streamline lines directly drawn onto ocean surface
      float streamAngle = atan(p.y + 0.05, p.x - 0.28);
      float streamRadius = length(p - vec2(0.28, -0.05));
      float streamlinePattern = sin(streamRadius * 48.0 + streamAngle * 8.0 - uTime * 3.0);
      float whiteStreamline = smoothstep(0.85, 0.98, streamlinePattern) * (0.35 + warmCore * 0.45);

      // Add equatorial ENSO streamline flow pulses
      if (uEnsoPhase == 1) {
        // El Niño: Eastward surge (-> -> ->)
        float ensoSurge = smoothstep(0.80, 0.99, sin(p.x * 24.0 - uTime * 4.5 * uEnsoIntensity)) * exp(-p.y * p.y * 4.5) * uEnsoIntensity;
        whiteStreamline = max(whiteStreamline, ensoSurge * 0.85);
      } else if (uEnsoPhase == 2) {
        // La Niña: Accelerated westward trade wind flow (<- <- <-)
        float laNinaSurge = smoothstep(0.80, 0.99, sin(-p.x * 28.0 - uTime * 5.0 * uEnsoIntensity)) * exp(-p.y * p.y * 4.5) * uEnsoIntensity;
        whiteStreamline = max(whiteStreamline, laNinaSurge * 0.85);
      }

      // Specular ocean sun sheen
      vec3 lightDir = normalize(vec3(0.3, 0.9, 0.5));
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 halfVector = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfVector), 0.0), 36.0) * 0.55;

      // Blend streamline vector flow
      vec3 surfaceCol = mix(color, vec3(1.0, 1.0, 1.0), whiteStreamline * 0.65);
      
      // Dynamic white wave foam / whitecaps on rolling wave peaks
      vec3 foamColor = vec3(0.92, 0.98, 1.0);
      vec3 finalColor = mix(surfaceCol, foamColor, vFoam * 0.85) + vec3(spec);

      // Smooth edge blending with surrounding terrain
      float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
      float alpha = smoothstep(0.0, 0.06, edgeDist) * 0.96 + 0.04;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

// Volumetric depth cutaway cross-section shader (0 - 6000m) with vibrant layered thermocline waves
export const DepthWallShader = {
  uniforms: {
    uTime: { value: 0 },
    uParamType: { value: 0 },
    uMaxDepth: { value: 6000.0 },
    uEnsoPhase: { value: 1 },
    uEnsoIntensity: { value: 0.75 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying float vDepthRatio;

    void main() {
      vUv = uv;
      vDepthRatio = 1.0 - uv.y; // 0.0 (surface) to 1.0 (6000m seabed)
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vDepthRatio;
    uniform int uParamType;
    uniform float uTime;
    uniform int uEnsoPhase;
    uniform float uEnsoIntensity;

    void main() {
      // Wavy stratification layer deformation matching reference image
      float waveLayer = sin(vUv.x * 12.0 + uTime * 0.6) * 0.018 + cos(vUv.x * 24.0) * 0.008;

      // Realistic ENSO Thermocline Slope Tilt
      float ensoTilt = 0.0;
      if (uEnsoPhase == 1) {
        // El Niño: Thermocline deepens in the eastern Pacific (right side vUv.x > 0.3), warm pool sloshes east
        ensoTilt = (vUv.x - 0.25) * 0.12 * uEnsoIntensity;
      } else if (uEnsoPhase == 2) {
        // La Niña: Thermocline tilts steeply upward toward eastern surface, strong cold upwelling
        ensoTilt = -(vUv.x - 0.5) * 0.16 * uEnsoIntensity;
      }

      float d = clamp(vDepthRatio - ensoTilt + waveLayer, 0.0, 1.0);

      // Vibrant stratification palette:
      // Epipelagic 0-100m: Fiery warm yellow/orange/red
      // Upper Thermocline 100-500m: Lime Green
      // Mesopelagic 500-1000m: Electric Cyan
      // Bathypelagic 1000-2000m: Royal Blue
      // Abyssal 2000-4000m: Deep Indigo / Violet
      // Hadal 4000-6000m: Dark Trench Black
      vec3 colSurface = vec3(0.98, 0.35, 0.05);   // 0m
      vec3 colTherm1 = vec3(0.95, 0.85, 0.05);    // 100m
      vec3 colTherm2 = vec3(0.15, 0.92, 0.35);    // 500m
      vec3 colCyan = vec3(0.0, 0.85, 0.98);       // 1000m
      vec3 colBlue = vec3(0.04, 0.32, 0.85);      // 2000m
      vec3 colViolet = vec3(0.18, 0.05, 0.55);    // 4000m
      vec3 colAbyss = vec3(0.02, 0.04, 0.12);     // 6000m

      vec3 depthColor;
      if (d < 0.06) {
        depthColor = mix(colSurface, colTherm1, d / 0.06);
      } else if (d < 0.18) {
        depthColor = mix(colTherm1, colTherm2, (d - 0.06) / 0.12);
      } else if (d < 0.34) {
        depthColor = mix(colTherm2, colCyan, (d - 0.18) / 0.16);
      } else if (d < 0.55) {
        depthColor = mix(colCyan, colBlue, (d - 0.34) / 0.21);
      } else if (d < 0.80) {
        depthColor = mix(colBlue, colViolet, (d - 0.55) / 0.25);
      } else {
        depthColor = mix(colViolet, colAbyss, (d - 0.80) / 0.20);
      }

      // Horizontal depth grid line rings (0m, 100m, 500m, 1000m, 2000m, 4000m, 6000m)
      float line0 = smoothstep(0.012, 0.0, abs(vDepthRatio - 0.005));
      float line100 = smoothstep(0.008, 0.0, abs(vDepthRatio - 0.06));
      float line500 = smoothstep(0.008, 0.0, abs(vDepthRatio - 0.18));
      float line1000 = smoothstep(0.008, 0.0, abs(vDepthRatio - 0.34));
      float line2000 = smoothstep(0.008, 0.0, abs(vDepthRatio - 0.55));
      float line4000 = smoothstep(0.008, 0.0, abs(vDepthRatio - 0.80));
      float line6000 = smoothstep(0.008, 0.0, abs(vDepthRatio - 0.99));

      float gridLines = line0 + line100 + line500 + line1000 + line2000 + line4000 + line6000;

      // Vertical structural cutaway grid columns
      float verticalGrid = smoothstep(0.008, 0.0, abs(fract(vUv.x * 5.0) - 0.5)) * 0.25;

      vec3 finalCol = depthColor + vec3(gridLines * 0.65) + vec3(verticalGrid);

      gl_FragColor = vec4(finalCol, 0.94);
    }
  `
};
