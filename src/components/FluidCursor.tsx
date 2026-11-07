import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Fluid cursor: a GPU stable-fluids solver (Navier–Stokes in fragment
// shaders) on a fixed canvas over the whole page. Moving the pointer injects
// white ink that swirls and fades; `mix-blend-mode: difference` makes the ink
// invert whatever it crosses — dark over the page, light over the type.
// Pointer-only: skipped on touch devices and under prefers-reduced-motion.

const CONFIG = {
  simResolution: 256, // velocity / pressure grid width (height follows the aspect)
  dyeResolution: 1024, // ink grid width
  curlStrength: 30, // vorticity confinement — how much the ink swirls
  pressureIterations: 40, // Jacobi steps per frame (stability vs cost)
  velocityDissipation: 0.95, // per-frame fade of the velocity field
  dyeDissipation: 0.95, // per-frame fade of the ink
  splatRadius: 0.3, // ink blob size (÷100 in the shader)
  forceStrength: 8.5, // pointer speed → injected velocity
  pressureDecay: 0.75, // pressure carried over between frames
  threshold: 1.0, // ink magnitude that reads as opaque
  edgeSoftness: 0.0, // 0 = hard edge; >0 feathers the threshold
  inkColor: new THREE.Color(1, 1, 1),
};

const VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;
const HEAD = /* glsl */ `precision highp float; precision mediump sampler2D; varying vec2 vUv;`;

const FRAG = {
  splat: /* glsl */ `${HEAD}
    uniform sampler2D uTarget; uniform float aspectRatio; uniform float radius; uniform vec3 color; uniform vec2 point;
    void main(){ vec2 p = vUv - point; p.x *= aspectRatio;
      gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0); }`,
  advection: /* glsl */ `${HEAD}
    uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
    void main(){ vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = vec4(dissipation * texture2D(uSource, coord).rgb, 1.0); }`,
  divergence: /* glsl */ `${HEAD}
    uniform sampler2D uVelocity; uniform vec2 texelSize;
    vec2 vel(vec2 uv, vec2 axis){ vec2 c = clamp(uv, 0.0, 1.0); vec2 v = texture2D(uVelocity, c).xy; return c == uv ? v : v * (1.0 - 2.0 * axis); }
    void main(){ float L = vel(vUv - vec2(texelSize.x, 0.0), vec2(1.0, 0.0)).x; float R = vel(vUv + vec2(texelSize.x, 0.0), vec2(1.0, 0.0)).x;
      float B = vel(vUv - vec2(0.0, texelSize.y), vec2(0.0, 1.0)).y; float T = vel(vUv + vec2(0.0, texelSize.y), vec2(0.0, 1.0)).y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0); }`,
  curl: /* glsl */ `${HEAD}
    uniform sampler2D uVelocity; uniform vec2 texelSize;
    void main(){ float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y; float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
      float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x; float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
      gl_FragColor = vec4(R - L - T + B, 0.0, 0.0, 1.0); }`,
  vorticity: /* glsl */ `${HEAD}
    uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform vec2 texelSize; uniform float curlStrength; uniform float dt;
    void main(){ float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x; float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
      float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x; float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 f = normalize(vec2(abs(T) - abs(B), abs(R) - abs(L)) + 0.0001) * curlStrength * C;
      gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + f * dt, 0.0, 1.0); }`,
  pressure: /* glsl */ `${HEAD}
    uniform sampler2D uPressure; uniform sampler2D uDivergence; uniform vec2 texelSize;
    void main(){ float L = texture2D(uPressure, clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0)).x; float R = texture2D(uPressure, clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
      float B = texture2D(uPressure, clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0)).x; float T = texture2D(uPressure, clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0)).x;
      gl_FragColor = vec4((L + R + B + T - texture2D(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0); }`,
  gradientSubtract: /* glsl */ `${HEAD}
    uniform sampler2D uPressure; uniform sampler2D uVelocity; uniform vec2 texelSize;
    void main(){ float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x; float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x; float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
      gl_FragColor = vec4(texture2D(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0); }`,
  clear: /* glsl */ `${HEAD}
    uniform sampler2D uTexture; uniform float value;
    void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`,
  display: /* glsl */ `precision highp float; varying vec2 vUv;
    uniform sampler2D uTexture; uniform float threshold; uniform float edgeSoftness; uniform vec3 inkColor;
    void main(){ float d = clamp(length(texture2D(uTexture, vUv).rgb), 0.0, 1.0);
      float a = edgeSoftness > 0.0 ? smoothstep(threshold - edgeSoftness * 0.5, threshold + edgeSoftness * 0.5, d) : step(threshold, d);
      gl_FragColor = vec4(inkColor, a); }`,
};

type Double = { read: THREE.WebGLRenderTarget; write: THREE.WebGLRenderTarget; swap(): void };

const target = (w: number, h: number) =>
  new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthBuffer: false });
const double = (w: number, h: number): Double => ({
  read: target(w, h),
  write: target(w, h),
  swap() {
    [this.read, this.write] = [this.write, this.read];
  },
});

// Everything the solver owns; `dispose` walks it back off the GPU.
function createFluid(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  const dpr = renderer.getPixelRatio();
  let width = window.innerWidth * dpr;
  let height = window.innerHeight * dpr;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  scene.add(quad);

  const mat = (key: keyof typeof FRAG, uniforms: Record<string, THREE.IUniform>) =>
    new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG[key],
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
  const u = (value: unknown): THREE.IUniform => ({ value });
  const materials = {
    splat: mat('splat', {
      uTarget: u(null),
      aspectRatio: u(1),
      radius: u(CONFIG.splatRadius / 100),
      color: u(new THREE.Vector3()),
      point: u(new THREE.Vector2()),
    }),
    advection: mat('advection', {
      uVelocity: u(null),
      uSource: u(null),
      texelSize: u(new THREE.Vector2()),
      dt: u(0),
      dissipation: u(1),
    }),
    divergence: mat('divergence', { uVelocity: u(null), texelSize: u(new THREE.Vector2()) }),
    curl: mat('curl', { uVelocity: u(null), texelSize: u(new THREE.Vector2()) }),
    vorticity: mat('vorticity', {
      uVelocity: u(null),
      uCurl: u(null),
      texelSize: u(new THREE.Vector2()),
      curlStrength: u(CONFIG.curlStrength),
      dt: u(0),
    }),
    pressure: mat('pressure', {
      uPressure: u(null),
      uDivergence: u(null),
      texelSize: u(new THREE.Vector2()),
    }),
    gradientSubtract: mat('gradientSubtract', {
      uPressure: u(null),
      uVelocity: u(null),
      texelSize: u(new THREE.Vector2()),
    }),
    clear: mat('clear', { uTexture: u(null), value: u(CONFIG.pressureDecay) }),
    display: mat('display', {
      uTexture: u(null),
      threshold: u(CONFIG.threshold),
      edgeSoftness: u(CONFIG.edgeSoftness),
      inkColor: u(CONFIG.inkColor),
    }),
  };
  materials.display.transparent = true;

  // Render targets, rebuilt on resize so the grids keep the viewport's aspect.
  let velocity: Double;
  let pressure: Double;
  let dye: Double;
  let divergence: THREE.WebGLRenderTarget;
  let curl: THREE.WebGLRenderTarget;
  let simTexel = new THREE.Vector2();
  let dyeTexel = new THREE.Vector2();

  const disposeTargets = () => {
    velocity?.read?.dispose();
    velocity?.write?.dispose();
    pressure?.read?.dispose();
    pressure?.write?.dispose();
    dye?.read?.dispose();
    dye?.write?.dispose();
    divergence?.dispose();
    curl?.dispose();
  };

  const setupTargets = () => {
    disposeTargets();
    const aspect = width / height;
    const sim = { w: CONFIG.simResolution, h: Math.round(CONFIG.simResolution / aspect) };
    const dyeS = { w: CONFIG.dyeResolution, h: Math.round(CONFIG.dyeResolution / aspect) };
    velocity = double(sim.w, sim.h);
    pressure = double(sim.w, sim.h);
    dye = double(dyeS.w, dyeS.h);
    divergence = target(sim.w, sim.h);
    curl = target(sim.w, sim.h);
    simTexel = new THREE.Vector2(1 / sim.w, 1 / sim.h);
    dyeTexel = new THREE.Vector2(1 / dyeS.w, 1 / dyeS.h);
  };
  setupTargets();

  const pass = (material: THREE.ShaderMaterial, to: THREE.WebGLRenderTarget | null) => {
    quad.material = material;
    renderer.setRenderTarget(to);
    renderer.render(scene, camera);
  };

  const splat = (x: number, y: number, vx: number, vy: number) => {
    const s = materials.splat.uniforms;
    s.aspectRatio.value = width / height;
    s.point.value.set(x / width, 1 - y / height);
    s.uTarget.value = velocity.read.texture;
    s.color.value.set(vx, -vy, 0);
    pass(materials.splat, velocity.write);
    velocity.swap();
    s.uTarget.value = dye.read.texture;
    s.color.value.set(3, 3, 3);
    pass(materials.splat, dye.write);
    dye.swap();
  };

  const simulate = (dt: number) => {
    const m = materials;
    m.curl.uniforms.uVelocity.value = velocity.read.texture;
    m.curl.uniforms.texelSize.value = simTexel;
    pass(m.curl, curl);

    m.vorticity.uniforms.uVelocity.value = velocity.read.texture;
    m.vorticity.uniforms.uCurl.value = curl.texture;
    m.vorticity.uniforms.texelSize.value = simTexel;
    m.vorticity.uniforms.dt.value = dt;
    pass(m.vorticity, velocity.write);
    velocity.swap();

    m.divergence.uniforms.uVelocity.value = velocity.read.texture;
    m.divergence.uniforms.texelSize.value = simTexel;
    pass(m.divergence, divergence);

    m.clear.uniforms.uTexture.value = pressure.read.texture;
    pass(m.clear, pressure.write);
    pressure.swap();

    m.pressure.uniforms.uDivergence.value = divergence.texture;
    m.pressure.uniforms.texelSize.value = simTexel;
    for (let i = 0; i < CONFIG.pressureIterations; i++) {
      m.pressure.uniforms.uPressure.value = pressure.read.texture;
      pass(m.pressure, pressure.write);
      pressure.swap();
    }

    m.gradientSubtract.uniforms.uPressure.value = pressure.read.texture;
    m.gradientSubtract.uniforms.uVelocity.value = velocity.read.texture;
    m.gradientSubtract.uniforms.texelSize.value = simTexel;
    pass(m.gradientSubtract, velocity.write);
    velocity.swap();

    m.advection.uniforms.uVelocity.value = velocity.read.texture;
    m.advection.uniforms.uSource.value = velocity.read.texture;
    m.advection.uniforms.texelSize.value = simTexel;
    m.advection.uniforms.dt.value = dt;
    m.advection.uniforms.dissipation.value = CONFIG.velocityDissipation;
    pass(m.advection, velocity.write);
    velocity.swap();

    m.advection.uniforms.uVelocity.value = velocity.read.texture;
    m.advection.uniforms.uSource.value = dye.read.texture;
    m.advection.uniforms.texelSize.value = dyeTexel;
    m.advection.uniforms.dissipation.value = CONFIG.dyeDissipation;
    pass(m.advection, dye.write);
    dye.swap();
  };

  const render = () => {
    materials.display.uniforms.uTexture.value = dye.read.texture;
    pass(materials.display, null);
  };

  // Pointer in device pixels; the splat uses the frame-to-frame delta as force.
  const mouse = { x: 0, y: 0, vx: 0, vy: 0, moved: false, seen: false };
  const onMove = (e: MouseEvent) => {
    const x = e.clientX * dpr;
    const y = e.clientY * dpr;
    if (mouse.seen) {
      mouse.vx = (x - mouse.x) * CONFIG.forceStrength;
      mouse.vy = (y - mouse.y) * CONFIG.forceStrength;
      mouse.moved = true;
    }
    mouse.x = x;
    mouse.y = y;
    mouse.seen = true;
  };
  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    width = window.innerWidth * dpr;
    height = window.innerHeight * dpr;
    setupTargets();
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('resize', onResize);

  let last = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.016);
    last = now;
    if (mouse.moved) {
      splat(mouse.x, mouse.y, mouse.vx, mouse.vy);
      mouse.moved = false;
    }
    simulate(dt);
    render();
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('resize', onResize);
    disposeTargets();
    for (const m of Object.values(materials)) m.dispose();
    quad.geometry.dispose();
    renderer.dispose();
  };
}

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return;
    return createFluid(canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full mix-blend-difference"
    />
  );
}
