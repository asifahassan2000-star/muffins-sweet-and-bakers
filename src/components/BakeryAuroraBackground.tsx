import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export interface BakeryAuroraBackgroundProps {
  className?: string;
  onReady?: () => void;
}

// Config adjusted to warm bakery oven light & golden honey palette for Muffinns
const CONFIG = {
  horizon: 0.42,
  intensity: 1.35,
  spreadMax: 0.92,
  coreGlow: 1.25,
  flowSpeed: 0.5,
  waveAmount: 0.22,
  breath: 0.06,
  colorfulness: 0.95,
  // Warm artisan bakery tones:
  colWhite: '#FFF9F2',   // warm ivory highlight
  colOrange: '#FF5E2B',  // vibrant terracotta / warm oven glow
  colRed: '#8E280E',     // rich roasted caramel / deep cocoa
  colCyan: '#F7B267',    // golden wildflower honey
  colMagenta: '#E76F51', // warm baked terracotta
  colGold: '#FFD166',    // glistening molten glaze
  parallax: 1.6,
  mouseGlow: 0.35,
  mouseGlowSize: 0.2,
  mouseBend: 0.47,
};

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform vec2  uMouseUV;
  uniform float uReveal;
  uniform float uHorizon;
  uniform float uIntensity;
  uniform float uSpreadMax;
  uniform float uCoreGlow;
  uniform float uFlowSpeed;
  uniform float uWaveAmount;
  uniform float uBreath;
  uniform float uColorfulness;
  uniform vec3  uColWhite;
  uniform vec3  uColOrange;
  uniform vec3  uColRed;
  uniform vec3  uColCyan;
  uniform vec3  uColMagenta;
  uniform vec3  uColGold;
  uniform float uParallax;
  uniform float uMouseGlow;
  uniform float uMouseGlowSize;
  uniform float uMouseBend;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.3, 9.1);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / uRes.y;

    // Subtle parallax from cursor
    uv += uMouse * vec2(-0.03, -0.02) * uParallax;

    float x = uv.x;
    float d = uv.y - uHorizon;

    // Flowing organic noise fields
    float n1 = fbm(vec2(x * 3.0 - uTime * 0.06, uv.y * 2.0 + uTime * 0.045));
    float n2 = fbm(vec2(x * 7.0 + uTime * 0.05, uv.y * 5.0 - uTime * 0.06));

    // Intensity grows left -> right
    float grow = smoothstep(0.06, 0.72, x + (n1 - 0.5) * 0.12);
    grow = pow(grow, 1.7);

    // Vertical spread widens toward the right
    float spread = mix(0.014, uSpreadMax, pow(smoothstep(0.18, 1.05, x), 2.1));

    // Wavy displacement so the plume undulates gently
    float dd = d + (n1 - 0.5) * uWaveAmount * smoothstep(0.25, 0.9, x);

    // Mouse interaction: the warm light stream bends toward cursor
    vec2 mq = (uv - uMouseUV) * vec2(aspect, 1.0) / max(uMouseGlowSize, 0.01);
    float mGauss = exp(-dot(mq, mq));
    dd -= mGauss * (uMouseUV.y - uHorizon) * uMouseBend;

    float band = exp(-abs(dd) / spread);

    // Soft radiant core
    float coreGlow = exp(-abs(d) / 0.028) * grow * uCoreGlow;

    // Wide soft halo around the core
    float halo = exp(-abs(dd) / (spread * 2.6)) * 0.35;
    float light = (band + halo) * grow + coreGlow;

    // Flowing oven light stream
    float flow = fbm(vec2(x * 4.5 + n1, abs(dd) * 3.5 - uTime * uFlowSpeed));
    light *= 0.72 + 0.55 * flow;

    // Subtle breathing pulse
    light *= 1.0 - uBreath + uBreath * sin(uTime * 0.5 + x * 2.0);

    // Cursor halo adds local luminance
    light += mGauss * uMouseGlow * (0.7 + 0.3 * sin(uTime * 0.8));
    light *= uIntensity;

    // Color distribution
    float colorAmt = smoothstep(0.25, 0.85, x) * uColorfulness;
    float up = smoothstep(0.0, 0.45, dd);
    float dn = smoothstep(0.0, -0.4, dd);

    vec3 col = uColWhite;

    // Golden honey rim right where light leaves horizon
    col = mix(col, uColGold, smoothstep(0.06, 0.16, abs(dd)) *
                             smoothstep(0.35, 0.0, abs(dd)) * colorAmt * 0.8);

    // Upper plume: vibrant terracotta deepening to rich roasted caramel
    col = mix(col, uColOrange, clamp(up * (1.2 + n2 * 0.6) * colorAmt, 0.0, 1.0));
    col = mix(col, uColRed, clamp((up * 2.4 - 0.9) * colorAmt, 0.0, 1.0));

    // Warm baked terracotta ribbons woven through the plume
    col = mix(col, uColMagenta,
              clamp((n2 - 0.55) * 2.2, 0.0, 1.0) * (up + dn) * colorAmt * 0.65);

    // Far-right trailing edge cools into soft golden amber
    col = mix(col, uColCyan, smoothstep(0.72, 1.0, x + (n2 - 0.5) * 0.08) * 0.85);

    // Soft reflection below horizon
    col = mix(col, mix(uColWhite, uColCyan, 0.35), dn * 0.45);

    vec3 color = col * light;

    // Warm roasted ember pool on bottom-right
    vec2 ep = (uv - vec2(0.86, 0.0)) * vec2(1.2 * aspect * 0.6, 2.0);
    float ember = exp(-dot(ep, ep)) * smoothstep(0.0, -0.12, d);
    color += uColRed * ember * (0.55 + 0.1 * sin(uTime * 0.7));

    // Warm honey hint bottom-left
    vec2 lp = (uv - vec2(0.02, 0.0)) * vec2(2.2, 2.6);
    color += mix(uColRed, uColMagenta, 0.5)
             * exp(-dot(lp, lp)) * smoothstep(0.0, -0.12, d) * 0.22;

    // Dim warm sheen below horizon
    float sheen = smoothstep(0.0, -0.5, d) * 0.05 * grow;
    color += vec3(0.72, 0.60, 0.48) * sheen;

    // Golden flour-dust particles in the dark upper-left
    vec2 sp = uv * vec2(aspect, 1.0) * 90.0;
    vec2 cell = floor(sp);
    vec2 fp = fract(sp) - 0.5;
    float star = step(0.997, hash(cell)) * smoothstep(0.16, 0.0, length(fp));
    float twinkle = 0.5 + 0.5 * sin(uTime * 1.5 + hash(cell + 7.0) * 50.0);
    float darkness = 1.0 - clamp(light * 3.0, 0.0, 1.0);
    color += vec3(0.98, 0.90, 0.80) * star * twinkle * darkness
             * smoothstep(0.75, 0.35, x) * smoothstep(0.35, 0.6, uv.y) * 0.5;

    // Vignette
    float vig = smoothstep(0.0, 0.35, uv.y) * 0.15 + 0.85;
    vig *= 1.0 - 0.45 * pow(1.0 - uv.y, 3.0);
    vig *= 1.0 - 0.35 * pow(uv.y, 4.0);
    vig *= 1.0 - 0.30 * pow(clamp(1.0 - x * 1.4, 0.0, 1.0), 2.0);
    vig *= 1.0 - 0.5 * pow(x, 5.0) * pow(uv.y, 5.0);
    color *= vig;

    // Filmic soft roll-off
    color = 1.0 - exp(-color * 1.5);

    gl_FragColor = vec4(color * uReveal, 1.0);
  }
`;

export default function BakeryAuroraBackground({ className = '', onReady }: BakeryAuroraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let mesh: THREE.Mesh | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const uniforms = {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseUV: { value: new THREE.Vector2(0.63, 0.37) },
        uReveal: { value: 1 },
        uHorizon: { value: CONFIG.horizon },
        uIntensity: { value: CONFIG.intensity },
        uSpreadMax: { value: CONFIG.spreadMax },
        uCoreGlow: { value: CONFIG.coreGlow },
        uFlowSpeed: { value: CONFIG.flowSpeed },
        uWaveAmount: { value: CONFIG.waveAmount },
        uBreath: { value: CONFIG.breath },
        uColorfulness: { value: CONFIG.colorfulness },
        uColWhite: { value: new THREE.Color(CONFIG.colWhite) },
        uColOrange: { value: new THREE.Color(CONFIG.colOrange) },
        uColRed: { value: new THREE.Color(CONFIG.colRed) },
        uColCyan: { value: new THREE.Color(CONFIG.colCyan) },
        uColMagenta: { value: new THREE.Color(CONFIG.colMagenta) },
        uColGold: { value: new THREE.Color(CONFIG.colGold) },
        uParallax: { value: CONFIG.parallax },
        uMouseGlow: { value: CONFIG.mouseGlow },
        uMouseGlowSize: { value: CONFIG.mouseGlowSize },
        uMouseBend: { value: CONFIG.mouseBend },
      };

      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      const resize = () => {
        if (!container || !renderer || !material) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());

        const portrait = h > w;
        uniforms.uHorizon.value = portrait ? 0.5 : CONFIG.horizon;
        uniforms.uIntensity.value = CONFIG.intensity * (portrait ? 1.25 : 1);
        uniforms.uSpreadMax.value = CONFIG.spreadMax * (portrait ? 1.25 : 1);
      };

      resize();
      window.addEventListener('resize', resize);

      // Render initial frame immediately
      renderer.render(scene, camera);

      // Mouse targets and smooth lerping
      const mouseTarget = new THREE.Vector2(0, 0);
      const mouseUVTarget = new THREE.Vector2(0.63, 0.37);
      const clock = new THREE.Clock();

      const handleMouseMove = (e: MouseEvent) => {
        if (!container) return;
        const r = container.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        mouseTarget.set(px - 0.5, -(py - 0.5));
        mouseUVTarget.set(px, 1.0 - py);
      };

      const handleMouseLeave = () => {
        mouseTarget.set(0, 0);
        mouseUVTarget.set(0.63, CONFIG.horizon);
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      // Render loop
      const tick = () => {
        if (!renderer || !scene || !camera) return;
        uniforms.uTime.value = clock.getElapsedTime();
        uniforms.uMouse.value.lerp(mouseTarget, 0.04);
        uniforms.uMouseUV.value.lerp(mouseUVTarget, 0.06);
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(tick);
      };

      animationFrameId = requestAnimationFrame(tick);
      onReady?.();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        if (mesh && material) {
          mesh.geometry.dispose();
          material.dispose();
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('BakeryAuroraBackground WebGL init:', err);
    }
  }, [onReady]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Three.js shader canvas paints the whole light scene */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* SVG fractal noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(90deg, rgba(3, 3, 3, 0.75), transparent 42%),
            linear-gradient(270deg, rgba(3, 3, 3, 0.4), transparent 16%),
            linear-gradient(180deg, rgba(3, 3, 3, 0.55), transparent 26%),
            radial-gradient(120% 120% at 50% 50%, transparent 62%, rgba(3, 3, 3, 0.5))
          `,
        }}
      />
    </div>
  );
}
