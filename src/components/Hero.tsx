import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ChevronDown, ShoppingBag, Menu } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';

gsap.registerPlugin(SplitText, CustomEase, useGSAP);

/* ------------------------------------------------------------------ */
/*  Bakery Imagery Configuration                                      */
/* ------------------------------------------------------------------ */
export const HERO_IMAGE = '/assets/images/hero_editorial_muffin_1794039141433.jpg';

// 7 warm, artisan bakery photos for the preloader fan.
// The LAST one lands in the centre and unveils to full screen (seamless hand-off).
export const DEFAULT_BAKERY_IMAGES = [
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80', // Artisanal sourdough
  '/assets/images/muffinns_patashay_sweets_1784645566064.jpg', // Royal Patashay sweets
  'https://i.ibb.co/jk7rk9Hk/three-milk-cake.webp', // Three Milk Tres Leches
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80', // Savory tea pastry
  '/assets/images/muffinns_chocolate_slice.jpg', // Belgian chocolate fudge slice
  'https://i.ibb.co/JRb5s3kf/Whats-App-Image-2026-08-31-at-4-52-44-PM.jpg', // Moti Chour laddu
  HERO_IMAGE, // Signature Golden Honey Muffin
];

export const DEFAULT_HERO_LINKS: { label: string; view: 'story' | 'menu' | 'find-us' | 'contact' | 'theme-studio' }[] = [
  { label: 'Our Story', view: 'story' },
  { label: 'Complete Menu', view: 'menu' },
  { label: '7 Branches', view: 'find-us' },
  { label: 'Contact', view: 'contact' },
  { label: 'Theme Studio', view: 'theme-studio' },
];

const COLORS = {
  cream: '#1A1423',
  ink: '#FFF8F0',
  ember: '#F4A261',
  muted: '#E9C46A',
  paper: '#FFF8F0',
};

const HERO_GRADIENT =
  'linear-gradient(to top, rgba(18,13,26,0.85) 0%, rgba(18,13,26,0.3) 45%, rgba(18,13,26,0.15) 70%, rgba(18,13,26,0.65) 100%)';
const IMAGE_FILTER = 'sepia(0.18) saturate(1.12) contrast(1.04)';

/* Custom premium eases */
const EASE = {
  open: 'phrOpen', // quick, crisp reveal
  fan: 'phrFan', // deliberate spread, soft stop
  settle: 'phrSettle', // long, soft landing (text)
  unveil: 'phrUnveil', // slow start, decisive open (clip-path)
  tally: 'phrTally', // counter
};

let easesRegistered = false;
const registerEases = () => {
  if (easesRegistered) return;
  CustomEase.create(EASE.open, 'M0,0 C0.2,0.8 0.3,1 1,1');
  CustomEase.create(EASE.fan, 'M0,0 C0.7,0 0.16,1 1,1');
  CustomEase.create(EASE.settle, 'M0,0 C0.14,1 0.34,1 1,1');
  CustomEase.create(EASE.unveil, 'M0,0 C0.62,0 0.08,1 1,1');
  CustomEase.create(EASE.tally, 'M0,0 C0.32,0 0.18,1 1,1');
  easesRegistered = true;
};

const clip = (v: number, h: number) => `inset(${v}% ${h}% ${v}% ${h}%)`;
const HIDDEN = clip(50, 50);
const SPLIT_VARS = { type: 'lines' } as const;

function getLayout(rings: number, ratio: number, fanRatio: number, fanGap: number, centerHeight: number) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const scales = Array.from({ length: rings }, (_, i) => fanRatio ** (i + 1));
  const halfColumn = 0.5 + scales.reduce((a, s) => a + s * (1 + fanGap), 0);
  let height = Math.min(vh * centerHeight, (vw * 0.62) / ratio);
  height = Math.min(height, (vh * 0.48) / halfColumn);
  const width = height * ratio;

  const offsets: number[] = [];
  let edge = height / 2;
  scales.forEach((s) => {
    const gap = fanGap * s * height;
    offsets.push(edge + gap + (s * height) / 2);
    edge += gap + s * height;
  });
  return {
    width,
    height,
    scales,
    offsets,
    h: ((1 - width / vw) / 2) * 100, // centre frame left/right inset %
    v: ((1 - height / vh) / 2) * 100, // centre frame top/bottom inset %
  };
}

const decodeWithin = (img: HTMLImageElement, ms: number) =>
  Promise.race([img.decode().catch(() => undefined), new Promise<void>((r) => setTimeout(r, ms))]);

function useListRefs<T extends Element>() {
  const list = useRef<(T | null)[]>([]);
  const set = useCallback(
    (index: number) => (el: T | null) => {
      list.current[index] = el;
    },
    [],
  );
  return [list, set] as const;
}

export interface HeroProps {
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker') => void;
  onOpenOrderNow?: () => void;
  onOpenSidebar?: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  theme?: string;
}

export default function Hero({ onNavigate, onOpenOrderNow, onOpenSidebar, onOpenCart, cartCount = 0, theme }: HeroProps) {
  const isGalaxy = theme === 'muffin_galaxy';
  const heroBg = isGalaxy ? '#1A1423' : '#FFFFFF';
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const rootRef = useRef<HTMLDivElement>(null);
  const [frameRefs, setFrameRef] = useListRefs<HTMLDivElement>();
  const [imgRefs, setImgRef] = useListRefs<HTMLImageElement>();
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLButtonElement>(null);
  const [navRefs, setNavRef] = useListRefs<HTMLElement>();
  const panelRef = useRef<HTMLDivElement>(null);
  const [menuRefs, setMenuRef] = useListRefs<HTMLButtonElement>();

  const images = DEFAULT_BAKERY_IMAGES;
  const heroImage = HERO_IMAGE;
  const title = 'Warm bakes, made to linger.';
  const subtitle =
    'Handcrafting morning breads, golden honey muffins, and royal desi ghee sweets across Bahawalpur since 1988.';
  const brand = 'Muffinns';
  const links = DEFAULT_HERO_LINKS;
  const cta = { label: 'Order Online' };
  const loadingLabel = 'Ovens Heating · Bahawalpur';
  const ratio = 3 / 2;
  const fanRatio = 0.68;
  const fanGap = 0.12;
  const centerHeight = 0.24;

  const center = images.length - 1;

  useGSAP(
    () => {
      const frames = frameRefs.current.filter(Boolean) as HTMLElement[];
      const imgs = imgRefs.current.filter(Boolean) as HTMLImageElement[];
      const navItems = navRefs.current.filter(Boolean) as HTMLElement[];
      const content = heroContentRef.current;
      const heading = titleRef.current;
      const counterEl = counterRef.current;
      const counterWrap = counterWrapRef.current;
      const overlay = overlayRef.current;
      if (!frames[center] || !content || !heading || !counterEl || !counterWrap || !overlay) return;
      registerEases();

      const last = frames[center];
      const lastImg = imgs[center];
      const others = frames.slice(0, center);

      // Lock scrolling during intro
      const html = document.documentElement;
      const prevOverflow = html.style.overflow;
      html.style.overflow = 'hidden';

      // Keep ALL hero text, badge, buttons, and nav completely hidden and unclickable during preloader
      gsap.set(content, { autoAlpha: 0, pointerEvents: 'none' });
      gsap.set(
        [badgeRef.current, actionsRef.current, scrollPromptRef.current].filter(Boolean),
        { autoAlpha: 0, y: 20 },
      );
      gsap.set(navItems, { y: -16, autoAlpha: 0, willChange: 'transform, opacity' });

      let splits: SplitText[] = [];
      let revealed = false;
      let cancelled = false;
      let tl: gsap.core.Timeline | undefined;

      const split = () => {
        splits.forEach((s) => s.revert());
        splits = [heading, subRef.current]
          .filter(Boolean)
          .map((t) => SplitText.create(t as HTMLElement, SPLIT_VARS));
        gsap.set(
          splits.flatMap((s) => s.lines),
          { 
            overflow: 'hidden', 
            paddingBottom: '0.12em', 
            yPercent: 125, 
            xPercent: 40,
            opacity: 0,
            willChange: 'transform, opacity' 
          },
        );
      };

      const run = async () => {
        await Promise.all([document.fonts.ready, decodeWithin(lastImg, 1800)]);
        if (cancelled) return;

        const rings = Math.ceil(others.length / 2);
        const { width: W, height: HT, scales, offsets, h: H, v: V } = getLayout(
          rings,
          ratio,
          fanRatio,
          fanGap,
          centerHeight,
        );

        // Initial stacked state
        gsap.set(last, { clipPath: HIDDEN });
        gsap.set(others, {
          width: W,
          height: HT,
          xPercent: -50,
          yPercent: -50,
          y: 0,
          scale: 1,
          clipPath: HIDDEN,
        });
        const REVEAL_ZOOM = 1.15;

        tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            html.style.overflow = prevOverflow;
            setDone(true);
          },
        });

        /* 1. Reveal: crisp clip-path opening from center (fast speed: 0.4s) */
        const REVEAL = 0.4;
        const REVEAL_STEP = 0.08;
        frames.forEach((frame, i) => {
          const isCenter = i === center;
          const p = { v: 50, h: 50 };
          tl!.to(
            p,
            {
              v: isCenter ? V : 0,
              h: isCenter ? H : 0,
              duration: REVEAL,
              ease: EASE.open,
              onUpdate: () => {
                frame.style.clipPath = clip(p.v, p.h);
              },
            },
            i * REVEAL_STEP,
          );
          tl!.fromTo(
            imgs[i],
            { scale: isCenter ? REVEAL_ZOOM + 0.12 : 1.12 },
            { scale: isCenter ? REVEAL_ZOOM : 1, duration: REVEAL + 0.25, ease: EASE.open },
            i * REVEAL_STEP,
          );
        });
        const revealEnd = (frames.length - 1) * REVEAL_STEP + REVEAL;

        /* 2. Fan-out: vertical symmetrical column spread (crisp 0.85s) */
        const FAN = 0.85;
        const fanStart = revealEnd - 0.08;
        const spread = [...others].reverse();
        spread.forEach((frame, k) => {
          const ring = Math.floor(k / 2);
          const dir = k % 2 === 0 ? -1 : 1;
          tl!.to(
            frame,
            { y: dir * offsets[ring], scale: scales[ring], duration: FAN, ease: EASE.fan },
            fanStart + k * 0.035,
          );
        });
        const loadEnd = fanStart + (spread.length - 1) * 0.035 + FAN;
        tl.addLabel('loaded', loadEnd);

        /* Counter 0 -> 100 fast tally */
        const count = { v: 0 };
        tl.to(
          count,
          {
            v: 100,
            duration: loadEnd,
            ease: EASE.tally,
            onUpdate: () => {
              counterEl.textContent = String(Math.round(count.v));
            },
          },
          0,
        );

        /* 3. Complete: counter exits, centre frame unveils to full-screen */
        tl.to(counterWrap, { yPercent: -120, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, 'loaded-=0.08');
        const OPEN = 1.15;
        const inset = { v: V, h: H };
        tl.to(
          inset,
          {
            v: 0,
            h: 0,
            duration: OPEN,
            ease: EASE.unveil,
            onUpdate: () => {
              last.style.clipPath = clip(inset.v, inset.h);
            },
          },
          'loaded+=0.04',
        );
        tl.to(lastImg, { scale: 1, duration: OPEN + 0.35, ease: EASE.unveil }, '<');
        tl.to(
          spread,
          {
            y: 0,
            scale: (k: number) => scales[Math.floor(k / 2)] * 0.7,
            duration: OPEN * 0.85,
            ease: EASE.unveil,
            stagger: { each: 0.03, from: 'end' },
          },
          '<',
        );
        tl.to(overlay, { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, '<0.2');

        /* 4. Center frame has now COMPLETELY unveiled to full-screen.
              Only AFTER it has cleanly opened does the text reveal begin! */
        const openEndTime = 0.04 + OPEN;
        tl.addLabel('openComplete', `loaded+=${openEndTime}`);

        split();
        const [h, s] = splits;

        // Make content container active and visible INSIDE the timeline when open completes
        tl.set(content, { autoAlpha: 1, pointerEvents: 'auto' }, 'openComplete+=0.04');

        // Artisanal Bakehouse badge drops in
        if (badgeRef.current) {
          tl.fromTo(
            badgeRef.current,
            { y: -16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, ease: EASE.settle },
            'openComplete+=0.08',
          );
        }

        // Title lines come with animation down to up and right to left
        if (h && h.lines.length) {
          tl.to(
            h.lines, 
            { 
              yPercent: 0, 
              xPercent: 0, 
              opacity: 1, 
              duration: 1.25, 
              ease: 'power3.out', 
              stagger: 0.12 
            }, 
            'openComplete+=0.14'
          );
        }

        // Subtitle lines come with animation down to up and right to left
        if (s && s.lines.length) {
          tl.to(
            s.lines, 
            { 
              yPercent: 0, 
              xPercent: 0, 
              opacity: 1, 
              duration: 1.1, 
              ease: 'power3.out', 
              stagger: 0.08 
            }, 
            'openComplete+=0.34'
          );
        }

        // Action buttons glide up
        if (actionsRef.current) {
          tl.fromTo(
            actionsRef.current,
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.75, ease: EASE.settle },
            'openComplete+=0.48',
          );
        }

        // Bottom discover prompt glides in
        if (scrollPromptRef.current) {
          tl.fromTo(
            scrollPromptRef.current,
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power2.out' },
            'openComplete+=0.62',
          );
        }

        // Top navbar items glide down
        tl.to(
          navItems,
          { y: 0, autoAlpha: 1, duration: 0.75, ease: EASE.settle, stagger: 0.04, clearProps: 'willChange' },
          'openComplete+=0.25',
        );

        tl.call(
          () => {
            revealed = true;
            gsap.set(
              splits.flatMap((x) => x.lines),
              { clearProps: 'willChange' },
            );
          },
          [],
          'openComplete+=1.4',
        );

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          tl.progress(1);
        } else {
          tl.play();
        }
      };

      run();

      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (!revealed || window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        split();
      };
      window.addEventListener('resize', onResize);

      return () => {
        cancelled = true;
        html.style.overflow = prevOverflow;
        window.removeEventListener('resize', onResize);
        tl?.kill();
        splits.forEach((s) => s.revert());
      };
    },
    { scope: rootRef },
  );

  /* Mobile menu interaction */
  useEffect(() => {
    const el = panelRef.current;
    const items = menuRefs.current.filter(Boolean) as HTMLElement[];
    if (!el) return;
    registerEases();
    if (open) {
      document.documentElement.style.overflow = 'hidden';
      gsap.set(el, { autoAlpha: 1 });
      const tl = gsap.timeline();
      tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65, ease: EASE.unveil });
      tl.fromTo(items, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: EASE.settle, stagger: 0.04 }, 0.2);
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      const mq = window.matchMedia('(min-width: 768px)');
      const onMq = () => mq.matches && setOpen(false);
      window.addEventListener('keydown', onKey);
      mq.addEventListener('change', onMq);
      return () => {
        tl.kill();
        document.documentElement.style.overflow = '';
        window.removeEventListener('keydown', onKey);
        mq.removeEventListener('change', onMq);
      };
    }
    const tl = gsap.timeline({ onComplete: () => gsap.set(el, { autoAlpha: 0 }) });
    tl.to(items, { y: -10, autoAlpha: 0, duration: 0.25, ease: 'power2.in', stagger: 0.02 });
    tl.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'power3.inOut' }, 0.08);
    return () => {
      tl.kill();
    };
  }, [open, menuRefs]);

  const hidden = { visibility: 'hidden' } as const;

  const scrollToNext = () => {
    const el = document.getElementById('editorial-statement') || document.querySelector('section[aria-label="Bakery Heritage Showreel"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('menu');
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden text-brand-chocolate select-none antialiased font-sans"
      style={{ background: heroBg }}
    >
      {/* ---------- Top Editorial Navbar ---------- */}
      <header
        className={`fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 md:px-8 md:py-4.5 text-brand-chocolate transition-all duration-300 ${
          scrolled
            ? 'bg-brand-cream/92 backdrop-blur-md border-b border-brand-caramel/15 shadow-lg'
            : 'bg-gradient-to-b from-brand-cream/80 via-brand-cream/30 to-transparent'
        }`}
      >
        <button
          ref={setNavRef(0)}
          style={hidden}
          onClick={() => onNavigate('home')}
          className="relative z-10 flex items-center gap-2.5 text-[17px] font-bold tracking-tight text-left cursor-pointer focus:outline-none"
        >
          <MuffinnsLogo size={32} animated={false} />
          <span className="font-serif text-xl sm:text-2xl font-black text-brand-chocolate tracking-tight">
            {brand}
          </span>
          <span className="font-serif text-xs font-bold text-brand-caramel" dir="rtl">
            پتاشے
          </span>
        </button>

        <nav
          ref={setNavRef(1)}
          style={hidden}
          aria-label="Primary"
          className="hidden items-center gap-7 text-[12px] font-mono uppercase tracking-[0.16em] text-brand-chocolate/85 lg:flex"
        >
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => onNavigate(l.view)}
              className="transition-colors duration-200 hover:text-brand-caramel cursor-pointer font-bold py-1"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-2.5">
          {/* Shopping Bag / Order Button */}
          <button
            ref={setNavRef(2)}
            style={hidden}
            onClick={() => (onOpenCart ? onOpenCart() : onOpenOrderNow ? onOpenOrderNow() : onNavigate('menu'))}
            className="rounded-xs bg-brand-caramel px-3 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-[12px] font-mono uppercase font-bold tracking-[0.12em] text-brand-cream transition-all duration-300 hover:bg-brand-honey shadow-sm cursor-pointer flex items-center gap-1.5 focus:outline-none"
            aria-label={`Shopping Bag (${cartCount} items)`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="ml-0.5 rounded-full bg-brand-chocolate px-1.5 py-0.2 text-[10px] text-brand-cream font-bold tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Minimal Menu Trigger for Slide-out Navigation */}
          <button
            ref={setNavRef(3)}
            style={hidden}
            type="button"
            aria-expanded={open}
            aria-label="Open complete bakery menu"
            onClick={() => (onOpenSidebar ? onOpenSidebar() : setOpen((v) => !v))}
            className="flex h-8 sm:h-9 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 rounded-xs border border-brand-caramel/30 text-brand-chocolate hover:bg-brand-caramel/10 transition-colors cursor-pointer focus:outline-none"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase">Menu</span>
          </button>
        </div>

        {/* Mobile menu sheet panel */}
        <div
          ref={panelRef}
          style={{ visibility: 'hidden', clipPath: 'inset(0% 0% 100% 0%)' }}
          className="fixed inset-0 z-0 flex flex-col justify-end bg-brand-cream/98 px-6 pb-12 backdrop-blur-xl md:hidden"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
            {links.map((l, i) => (
              <button
                key={l.label}
                ref={setMenuRef(i)}
                onClick={() => {
                  setOpen(false);
                  onNavigate(l.view);
                }}
                className="block text-left border-b border-brand-caramel/15 py-4 font-serif text-2xl font-bold tracking-tight text-brand-chocolate hover:text-brand-caramel"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ---------- Preloader (Fans into vertical column, then center unveils to full screen) ---------- */}
      {!done && (
        <div
          className="fixed inset-0 z-50 select-none overflow-hidden"
          style={{ background: heroBg }}
          aria-hidden="true"
        >
          {images.map((src, i) => {
            const isCenter = i === center;
            return (
              <div
                key={`${src}-${i}`}
                ref={setFrameRef(i)}
                className={`absolute overflow-hidden will-change-[transform,clip-path] rounded-xs ${
                  isCenter ? 'inset-0' : 'left-1/2 top-1/2'
                }`}
                style={{ clipPath: HIDDEN, zIndex: i + 1 }}
              >
                <img
                  ref={setImgRef(i)}
                  src={src}
                  alt=""
                  draggable={false}
                  decoding="async"
                  loading="eager"
                  fetchPriority={isCenter ? 'high' : 'auto'}
                  className="h-full w-full object-cover will-change-transform"
                  style={{ filter: IMAGE_FILTER }}
                />
                <div className="pointer-events-none absolute inset-0 bg-brand-caramel/15 mix-blend-multiply" />
                {isCenter && (
                  <div
                    ref={overlayRef}
                    className="pointer-events-none absolute inset-0 opacity-0 will-change-[opacity]"
                    style={{ background: HERO_GRADIENT }}
                  />
                )}
              </div>
            );
          })}

          {/* Bottom Live Counter */}
          <div className="absolute bottom-6 left-6 overflow-hidden md:bottom-10 md:left-10 z-50">
            <div ref={counterWrapRef} className="flex items-end gap-3 will-change-[transform,opacity]">
              <span
                ref={counterRef}
                className="font-mono text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.85] tracking-tighter tabular-nums text-brand-caramel"
              >
                0
              </span>
              <span
                className="mb-1 text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-brand-honey"
              >
                {loadingLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Full-Screen Pinned Hero ---------- */}
      <section className="relative h-svh w-full overflow-hidden text-brand-chocolate" aria-label={title}>
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Artisanal golden honey muffin on ceramic pedestal"
            draggable={false}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover"
            style={{ filter: IMAGE_FILTER }}
          />
          <div className="pointer-events-none absolute inset-0 bg-brand-caramel/15 mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0" style={{ background: HERO_GRADIENT }} />
        </div>

        {/* Hero Typography: Hidden during preloader & unveil, rises cleanly after unveil */}
        <div
          ref={heroContentRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center opacity-0 pointer-events-none invisible"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 space-y-4 sm:space-y-6 text-center">
            {/* Elegant unboxed editorial brand crest in dark brown/black */}
            <div 
              ref={badgeRef}
              className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-[#21100B] font-bold flex items-center justify-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#21100B]" />
              <span>Atelier 1988 · Artisanal Bakehouse & Heritage Patisserie</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#21100B]" />
            </div>

            {/* Deep Dark Brown and Black Heading — Bold, Minimal, High Contrast */}
            <h1
              ref={titleRef}
              className="hero-headline-dark font-serif font-black text-[clamp(2.8rem,7.5vw,7.8rem)] leading-[0.92] tracking-tight uppercase text-[#21100B]"
              style={{
                color: '#21100B',
              }}
            >
              {title}
            </h1>

            {/* Minimal Dark Divider Line — No Green */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 py-1" aria-hidden="true">
              <span className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent via-[#21100B]/30 to-transparent" />
              <span className="font-handwriting text-lg sm:text-2xl text-[#21100B] font-bold tracking-wide">
                ✦ slow-baked heritage recipes & fresh morning ovens ✦
              </span>
              <span className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent via-[#21100B]/30 to-transparent" />
            </div>

            {/* Clean unboxed subtitle in dark brown / black extending across the screen */}
            {subtitle && (
              <p
                ref={subRef}
                className="hero-subtitle-clean mx-auto mt-2 sm:mt-4 max-w-4xl font-sans text-base sm:text-xl md:text-2xl font-normal text-[#21100B] leading-relaxed tracking-wide"
                style={{ color: '#21100B' }}
              >
                {subtitle}
              </p>
            )}

            <div 
              ref={actionsRef}
              className="pt-4 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={() => (onOpenOrderNow ? onOpenOrderNow() : onNavigate('menu'))}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#21100B] text-white hover:bg-black transition-all duration-300 font-mono text-xs uppercase tracking-widest font-bold rounded-full shadow-lg cursor-pointer group"
              >
                <span>Explore The Menu</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('story')}
                className="text-xs font-mono uppercase tracking-widest font-bold text-[#21100B] hover:text-black transition-colors cursor-pointer underline decoration-[#21100B]/40 underline-offset-8 px-2 py-3"
              >
                Our 1988 Heritage Story →
              </button>
            </div>
          </div>


          {/* Bottom Discover Scroll Trigger */}
          <button
            ref={scrollPromptRef}
            onClick={scrollToNext}
            className="absolute bottom-6 sm:bottom-8 flex flex-col items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-brand-chocolate/70 hover:text-brand-caramel transition-colors cursor-pointer group"
            aria-label="Scroll to discover bakery philosophy and showreel"
          >
            <span>Discover The Craft</span>
            <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1 animate-bounce" />
          </button>
        </div>
      </section>

    </div>
  );
}
