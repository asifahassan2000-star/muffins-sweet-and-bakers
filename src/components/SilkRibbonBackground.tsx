import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface SilkRibbonBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

const TRAIL_COUNT = 32;

// Parameters adapted from component-024 with warm bakery & honey color tones
const PARAMS = {
  paperColor: '#FFFDF9',
  shadowColor: '#F5E3D7',
  stripeAngle: -15, // deg
  stripeFreq: 11,
  stripeDepth: 0.75,
  shadowSoftness: 0.05,
  stripeDrift: 0.0,
  tubeRound: 0.1,
  lightAngle: 48,
  ambient: 0.99,
  diffuse: 1.0,
  specStrength: 0.42,
  glossSharp: 200,
  fresnel: 0.86,
  fresnelPow: 3.1,
  refraction: 1.72,
  blockFreq: 6.95,
  blockDepth: 0.45,
  blockSoftness: 1.0,
  blockStagger: 2.0,
  revealRadius: 0.12,
  idleContrast: 0.08,
  hoverContrast: 1.6,
  noiseScale: 0.24,
  warpStrength: 0.12,
  timeSpeed: 0.15,
  octaves: 5,
  lacunarity: 1.03,
  gain: 0.88,
  // Warm artisan bakery ink colors revealed by cursor
  ink1: '#E84118', // warm terracotta
  ink2: '#F4A261', // golden honey
  ink3: '#FFD166', // warm amber
  ink4: '#9E2A0A', // rich roasted cocoa
  colorMode: 'Gradient',
  inkBlend: 0.57,
  inkIntensity: 0.42,
  inkRadius: 0.26,
  inkSoftness: 1.04,
  tubeSpread: 2.86,
  tubeConfine: 1.71,
  torchGlow: 0.18,
  inkCycleSpeed: 1.03,
  inkDecay: 0.95,
  inkSaturation: 0.9,
  inkUnderRibbons: 0.33,
  fluidWarp: 0.06,
  fluidScale: 0.85,
  fluidSpeed: 0.75,
  inkStretch: 1.0,
  mouseSmoothing: 0.09,
  bendRadius: 0.08,
  bendStrength: 0.0,
  velocitySmear: 0.0,
  mousePush: 2.0,
  chromaticAberration: 0.012,
  aberrationAngle: 129,
  fringeOnInk: 0.0,
  grain: 0.025,
  grainSpeed: 1.0,
  vignette: 0.0,
  vignetteRadius: 0.2,
  contrast: 1.55,
  brightness: -0.32,
  saturation: 1.0,
  hueShift: -5,
  gamma: 1.95,
  blurEdges: 1.0,
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  #define TRAIL_COUNT ${TRAIL_COUNT}
  #define MAX_OCTAVES 5

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform vec2  uMouseVel;
  uniform vec4  uTrail[TRAIL_COUNT];
  uniform vec3  uTrailColor[TRAIL_COUNT];
  uniform vec3  uPaperColor, uShadowColor;
  uniform float uStripeAngle, uStripeFreq, uStripeDepth;
  uniform float uSpecStrength, uShadowSoftness, uStripeDrift;
  uniform float uTubeRound, uLightAngle, uAmbient, uDiffuse;
  uniform float uGlossSharp, uFresnel, uFresnelPow, uRefraction;
  uniform float uBlockFreq, uBlockDepth, uBlockSoftness, uBlockStagger;
  uniform float uRevealRadius, uIdleContrast, uHoverContrast;
  uniform float uNoiseScale, uWarpStrength, uTimeSpeed, uLacunarity, uGain;
  uniform int   uOctaves;
  uniform float uInkIntensity, uInkRadius, uInkSoftness, uInkSaturation, uInkUnderRibbons;
  uniform float uTubeSpread, uTubeConfine, uTorchGlow;
  uniform float uFluidWarp, uFluidScale, uFluidSpeed, uInkStretch;
  uniform float uBendRadius, uBendStrength, uVelocitySmear, uMousePush;
  uniform float uAberration, uAberrationAngle, uFringeOnInk;
  uniform float uGrain, uGrainSpeed, uVignette, uVignetteRadius;
  uniform float uContrast, uBrightness, uSaturation, uHueShift, uGamma;
  uniform float uBlurEdges, uInvert;

  varying vec2 vUv;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float snoise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 p) {
    float amp = 0.5, freq = 1.0, sum = 0.0, norm = 0.0;
    for (int i = 0; i < MAX_OCTAVES; i++) {
      if (i >= uOctaves) break;
      sum += snoise(p * freq) * amp;
      norm += amp;
      amp *= uGain;
      freq *= uLacunarity;
    }
    return sum / max(norm, 0.0001);
  }

  vec3 hueRotate(vec3 color, float angle) {
    float c = cos(angle), s = sin(angle);
    mat3 m = mat3(
      0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c + 0.330 * s, 0.114 - 0.114 * c - 0.497 * s,
      0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s, 0.114 - 0.114 * c + 0.292 * s,
      0.299 - 0.300 * c + 1.250 * s, 0.587 - 0.588 * c - 1.050 * s, 0.114 + 0.886 * c - 0.203 * s
    );
    return color * m;
  }

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 field(vec2 uv, float aspect, float act, out vec3 oInk, out float oMask, out float oH, out float oWide) {
    vec2 p = uv;
    p.x *= aspect;

    float angR = radians(uStripeAngle);
    vec2 acrossDir = vec2(cos(angR), sin(angR));
    float sPre = dot(p, acrossDir) * uStripeFreq + uTime * uStripeDrift * uStripeFreq;
    float fPre = fract(sPre);
    float xPre = (fPre - 0.5) * 2.0;
    float hPre = sqrt(max(1.0 - xPre * xPre, 0.0));
    vec2 pRef = p - acrossDir * xPre * (1.0 - hPre) * uRefraction / max(uStripeFreq, 1.0);

    vec2 wob = vec2(
      fbm(p * uFluidScale + uTime * uFluidSpeed),
      fbm(p * uFluidScale + 7.31 - uTime * uFluidSpeed * 0.8)
    );
    vec2 wp = pRef + wob * uFluidWarp;
    vec3 ink = vec3(0.0);
    float inkMask = 0.0;

    for (int i = 0; i < TRAIL_COUNT - 1; i++) {
      float sA = uTrail[i].z;
      float sB = uTrail[i + 1].z;
      if (max(sA, sB) < 0.002) continue;
      vec2 a = uTrail[i].xy;     a.x *= aspect;
      vec2 b = uTrail[i + 1].xy; b.x *= aspect;
      vec2 ab = b - a;
      float len2 = dot(ab, ab);

      vec2 sp = wp;
      if (len2 > 0.000001) {
        vec2 dir = ab * inversesqrt(len2);
        sp -= dir * dot(wob, vec2(1.0)) * uInkStretch * 0.05;
      }
      float h = len2 > 0.000001 ? clamp(dot(sp - a, ab) / len2, 0.0, 1.0) : 0.0;
      vec2 cp = a + ab * h;
      vec2 d = sp - cp;
      float str = mix(sA, sB, h);
      float r = uInkRadius * mix(uTrail[i].w, uTrail[i + 1].w, h);
      float fall = exp(-dot(d, d) / max(r * r * uInkSoftness * 0.5, 0.0001)) * str;

      float sHere = dot(p, acrossDir) * uStripeFreq;
      float sSpot = dot(cp, acrossDir) * uStripeFreq;
      float ds = sHere - sSpot;
      fall *= exp(-(ds * ds) / max(uTubeSpread * uTubeSpread, 0.0001));
      ink += mix(uTrailColor[i], uTrailColor[i + 1], h) * fall;
      inkMask += fall;
    }

    vec3 inkCol = inkMask > 0.001 ? ink / inkMask : vec3(1.0);
    float luma = dot(inkCol, vec3(0.299, 0.587, 0.114));
    inkCol = mix(vec3(luma), inkCol, uInkSaturation);

    oWide = clamp((1.0 - exp(-inkMask * uInkIntensity * 2.0)) * 2.0, 0.0, 1.0);
    inkMask *= pow(max(hPre, 0.0), uTubeConfine);
    inkMask = 1.0 - exp(-inkMask * uInkIntensity);
    oInk = inkCol;
    oMask = inkMask;
    oH = hPre;

    vec2 m = uMouse;
    m.x *= aspect;
    vec2 dm = p - m;
    float mFall = exp(-dot(dm, dm) / max(uBendRadius * uBendRadius, 0.0001));
    vec2 disp = normalize(dm + 0.0001) * mFall * uBendStrength * uMousePush * 0.2;
    disp += uMouseVel * mFall * uVelocitySmear * 0.15;
    p += disp;

    float ang = radians(uStripeAngle);
    float s = dot(p, vec2(cos(ang), sin(ang))) * uStripeFreq;
    s += fbm(p * uNoiseScale + uTime * uTimeSpeed) * uWarpStrength * uStripeFreq * 0.35;
    s += uTime * uStripeDrift * uStripeFreq;
    float f = fract(s);

    float soften = mix(1.0, 2.5, clamp(uBlurEdges, 0.0, 1.0));
    float ss = max(uShadowSoftness * soften, 0.001);
    float shadow = exp(-(f * f) / (ss * ss));

    float x = (f - 0.5) * 2.0;
    float h = pow(max(1.0 - x * x, 0.0), 0.5 * max(uTubeRound, 0.05));
    vec3 n = normalize(vec3(x, 0.0, max(h, 0.03)));
    float la = radians(uLightAngle);
    vec3 L = normalize(vec3(sin(la), 0.25, cos(la)));
    float dif = max(dot(n, L), 0.0);
    vec3 Hv = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, Hv), 0.0), uGlossSharp) * uSpecStrength;
    float fres = pow(clamp(1.0 - n.z, 0.0, 1.0), uFresnelPow) * uFresnel;

    float sid = floor(s);
    float along = dot(p, vec2(-sin(ang), cos(ang))) * uBlockFreq;
    along += rand(vec2(sid, 3.71)) * uBlockStagger * 4.0;
    float bid = floor(along);
    float bf = fract(along);
    float v0 = rand(vec2(sid, bid));
    float v1 = rand(vec2(sid, bid + 1.0));
    float bs = max(uBlockSoftness, 0.001);
    float bt = clamp((bf - (1.0 - bs)) / bs, 0.0, 1.0);
    float blockVal = mix(v0, v1, smoothstep(0.0, 1.0, bt));

    vec3 paper = uPaperColor;
    float lightAmt = mix(1.0, uAmbient + dif * uDiffuse, clamp(act, 0.0, 1.5));
    vec3 col = paper * max(lightAmt, 0.0);
    col = mix(col, uShadowColor * paper, clamp(uStripeDepth * shadow * act, 0.0, 1.0));
    col = mix(col, uShadowColor * paper, clamp(uBlockDepth * blockVal * act, 0.0, 1.0));
    col += (spec + fres) * act;
    return col;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    vec2 dm = uv - uMouse;
    dm.x *= aspect;
    float actFall = exp(-dot(dm, dm) / max(uRevealRadius * uRevealRadius, 0.0001));
    float act = mix(uIdleContrast, uHoverContrast, actFall);

    vec3 inkC; float inkM; float hC; float wideC;
    vec3 centerCol = field(uv, aspect, act, inkC, inkM, hC, wideC);

    float abAmt = act * mix(1.0 - wideC, 1.0, uFringeOnInk);
    float aAng = radians(uAberrationAngle) + radians(uStripeAngle);
    vec2 off = vec2(cos(aAng), sin(aAng)) * uAberration * abAmt;
    vec3 col;
    if (uAberration * abAmt > 0.00001) {
      vec3 dC; float dM; float dH; float dW;
      col.r = field(uv + off, aspect, act, dC, dM, dH, dW).r;
      col.g = centerCol.g;
      col.b = field(uv - off, aspect, act, dC, dM, dH, dW).b;
    } else {
      col = centerCol;
    }

    col = mix(col, col * inkC, inkM * uInkUnderRibbons);
    col += inkC * inkM * uTorchGlow * hC;
    col = mix(col, mix(col, inkC, inkM), 1.0 - uInkUnderRibbons);

    col = hueRotate(col, radians(uHueShift));
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, uSaturation);
    col = (col - 0.5) * uContrast + 0.5 + uBrightness;
    col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.05)));

    col += (rand(vUv * uResolution + fract(uTime * uGrainSpeed) * 100.0) - 0.5) * uGrain;

    vec2 vc = vUv - 0.5;
    vc.x *= aspect;
    float vig = smoothstep(uVignetteRadius, uVignetteRadius - 0.6, length(vc));
    col = mix(col * (1.0 - uVignette), col, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function SilkRibbonBackground({ className = '', style }: SilkRibbonBackgroundProps) {
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
    let quad: THREE.Mesh | null = null;
    let material: THREE.ShaderMaterial | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const trailData = new Float32Array(TRAIL_COUNT * 4);
      const trailColorData = new Float32Array(TRAIL_COUNT * 3);

      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uTrail: { value: trailData },
        uTrailColor: { value: trailColorData },
        uPaperColor: { value: new THREE.Color(PARAMS.paperColor) },
        uShadowColor: { value: new THREE.Color(PARAMS.shadowColor) },
        uStripeAngle: { value: PARAMS.stripeAngle },
        uStripeFreq: { value: PARAMS.stripeFreq },
        uStripeDepth: { value: PARAMS.stripeDepth },
        uShadowSoftness: { value: PARAMS.shadowSoftness },
        uSpecStrength: { value: PARAMS.specStrength },
        uTubeRound: { value: PARAMS.tubeRound },
        uLightAngle: { value: PARAMS.lightAngle },
        uAmbient: { value: PARAMS.ambient },
        uDiffuse: { value: PARAMS.diffuse },
        uGlossSharp: { value: PARAMS.glossSharp },
        uFresnel: { value: PARAMS.fresnel },
        uFresnelPow: { value: PARAMS.fresnelPow },
        uRefraction: { value: PARAMS.refraction },
        uStripeDrift: { value: PARAMS.stripeDrift },
        uBlockFreq: { value: PARAMS.blockFreq },
        uBlockDepth: { value: PARAMS.blockDepth },
        uBlockSoftness: { value: PARAMS.blockSoftness },
        uBlockStagger: { value: PARAMS.blockStagger },
        uRevealRadius: { value: PARAMS.revealRadius },
        uIdleContrast: { value: PARAMS.idleContrast },
        uHoverContrast: { value: PARAMS.hoverContrast },
        uNoiseScale: { value: PARAMS.noiseScale },
        uWarpStrength: { value: PARAMS.warpStrength },
        uTimeSpeed: { value: PARAMS.timeSpeed },
        uOctaves: { value: PARAMS.octaves },
        uLacunarity: { value: PARAMS.lacunarity },
        uGain: { value: PARAMS.gain },
        uInkIntensity: { value: PARAMS.inkIntensity },
        uInkRadius: { value: PARAMS.inkRadius },
        uInkSoftness: { value: PARAMS.inkSoftness },
        uInkSaturation: { value: PARAMS.inkSaturation },
        uInkUnderRibbons: { value: PARAMS.inkUnderRibbons },
        uTubeSpread: { value: PARAMS.tubeSpread },
        uTubeConfine: { value: PARAMS.tubeConfine },
        uTorchGlow: { value: PARAMS.torchGlow },
        uFluidWarp: { value: PARAMS.fluidWarp },
        uFluidScale: { value: PARAMS.fluidScale },
        uFluidSpeed: { value: PARAMS.fluidSpeed },
        uInkStretch: { value: PARAMS.inkStretch },
        uBendRadius: { value: PARAMS.bendRadius },
        uBendStrength: { value: PARAMS.bendStrength },
        uVelocitySmear: { value: PARAMS.velocitySmear },
        uMousePush: { value: PARAMS.mousePush },
        uAberration: { value: PARAMS.chromaticAberration },
        uAberrationAngle: { value: PARAMS.aberrationAngle },
        uFringeOnInk: { value: PARAMS.fringeOnInk },
        uGrain: { value: PARAMS.grain },
        uGrainSpeed: { value: PARAMS.grainSpeed },
        uVignette: { value: PARAMS.vignette },
        uVignetteRadius: { value: PARAMS.vignetteRadius },
        uContrast: { value: PARAMS.contrast },
        uBrightness: { value: PARAMS.brightness },
        uSaturation: { value: PARAMS.saturation },
        uHueShift: { value: PARAMS.hueShift },
        uGamma: { value: PARAMS.gamma },
        uBlurEdges: { value: PARAMS.blurEdges },
        uInvert: { value: 0 },
      };

      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(quad);

      const resize = () => {
        if (!container || !renderer || !material) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        uniforms.uResolution.value.set(w, h);
      };

      resize();
      window.addEventListener('resize', resize);

      // Mouse & Trail handling
      const mouseTarget = new THREE.Vector2(0.5, 0.5);
      const mouseSmooth = new THREE.Vector2(0.5, 0.5);
      const mousePrev = new THREE.Vector2(0.5, 0.5);

      const trail = Array.from({ length: TRAIL_COUNT }, () => ({
        x: 0.5,
        y: 0.5,
        s: 0,
        r: 1,
        color: new THREE.Color(PARAMS.ink1),
      }));

      let frame = 0;
      let inkPhase = 0;

      const stops = [PARAMS.ink1, PARAMS.ink2, PARAMS.ink3, PARAMS.ink4].map((c) => new THREE.Color(c));
      const sampleInk = (t: number) => {
        const x = ((t % 1) + 1) % 1;
        const seg = Math.floor(x * 4);
        const local = x * 4 - seg;
        return stops[seg].clone().lerp(stops[(seg + 1) % 4], local);
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (!container) return;
        const r = container.getBoundingClientRect();
        mouseTarget.set(
          (e.clientX - r.left) / r.width,
          1 - (e.clientY - r.top) / r.height
        );
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });

      const clock = new THREE.Clock();

      const tick = () => {
        if (!renderer || !scene || !camera) return;
        const dt = Math.min(clock.getDelta(), 0.1);
        uniforms.uTime.value = clock.getElapsedTime();

        mousePrev.copy(mouseSmooth);
        mouseSmooth.lerp(mouseTarget, PARAMS.mouseSmoothing);
        const vel = new THREE.Vector2().subVectors(mouseSmooth, mousePrev);
        uniforms.uMouse.value.copy(mouseSmooth);
        uniforms.uMouseVel.value.lerp(vel.clone().multiplyScalar(30), 0.2);

        const speed = vel.length();
        inkPhase += PARAMS.inkCycleSpeed * dt + speed * 0.15;

        for (const t of trail) t.s *= PARAMS.inkDecay;

        if (frame % 2 === 0 && speed > 0.0004) {
          trail.pop();
          const target = sampleInk(mouseSmooth.x * 0.75 + inkPhase * 0.2);
          const c = trail[0].color.clone().lerp(target, 1 - PARAMS.inkBlend);
          trail.unshift({
            x: mouseSmooth.x,
            y: mouseSmooth.y,
            s: Math.min(1, 0.4 + speed * 25),
            r: 0.9 + Math.min(0.5, speed * 12),
            color: c,
          });
        }

        for (let i = 0; i < TRAIL_COUNT; i++) {
          const t = trail[i];
          trailData[i * 4 + 0] = t.x;
          trailData[i * 4 + 1] = t.y;
          trailData[i * 4 + 2] = t.s;
          trailData[i * 4 + 3] = t.r;
          trailColorData[i * 3 + 0] = t.color.r;
          trailColorData[i * 3 + 1] = t.color.g;
          trailColorData[i * 3 + 2] = t.color.b;
        }

        frame++;
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(tick);
      };

      animationFrameId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', handlePointerMove);
        if (quad && material) {
          quad.geometry.dispose();
          material.dispose();
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('SilkRibbonBackground WebGL init:', err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 ${className}`}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-95" />
    </div>
  );
}
