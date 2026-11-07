import {
  useCallback,
  useEffect,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './split-screen-slider.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ReelSlide = {
  /** headline and label colour for the slide */
  accent: string;
  /** one entry per line above the headline */
  kicker: string[];
  /** one word per line; lines never wrap, the headline is sized to fit the longest one */
  title: string[];
  status: string;
  cta?: { label: string; view?: 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' };
  /** one or two photos; the second drops out under 700px */
  images: string[];
};

export type ChromeLink = {
  label: string;
  view?: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker';
};

export type SplitScreenSliderProps = {
  slides?: ReelSlide[];
  nav?: ChromeLink[];
  wordmark?: [string, string, string];
  smoothScroll?: boolean;
  className?: string;
  onNavigate?: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker') => void;
};

/* ------------------------------------------------------------------ */
/*  Heartfelt, Authentic Bakery Slides for Muffins (Patashay)         */
/* ------------------------------------------------------------------ */
export const BAKERY_SLIDES: ReelSlide[] = [
  {
    accent: '#F4A261', // Warm Muffin Amber
    kicker: ['BAKED BEFORE DAWN', 'FARM-CHURNED BUTTER', 'PURE WILDFLOWER HONEY'],
    title: ['WARM', 'OVEN', 'DROPS'],
    status: 'Fresh Batches Every Morning · 8:00 AM',
    cta: { label: 'Explore Our Honey Muffins', view: 'menu' },
    images: ['/assets/images/hero_editorial_muffin_1794039141433.jpg'],
  },
  {
    accent: '#E9C46A', // Golden Desi Ghee Shimmer
    kicker: ['OUR MOTHER RECIPE', '100% PURE DESI GHEE', 'SAFFRON & CARDAMOM'],
    title: ['ROYAL', 'PATASHAY', 'SWEET'],
    status: 'A Bahawalpur Tradition Since 1988',
    cta: { label: 'Taste Traditional Sweets', view: 'menu' },
    images: [
      '/assets/images/muffinns_patashay_sweets_1784645566064.jpg',
      'https://i.ibb.co/JRb5s3kf/Whats-App-Image-2026-08-31-at-4-52-44-PM.jpg',
    ],
  },
  {
    accent: '#7FE9FB', // Cool Sweet Velvet Cream
    kicker: ['HEART OF CELEBRATIONS', 'SOAKED IN THREE MILKS', 'CLOUD VELVET CREAM'],
    title: ['MELTING', 'SWEET', 'MOMENTS'],
    status: "The City's Most Cherished Birthday Cake",
    cta: { label: 'Order Celebration Cake', view: 'menu' },
    images: [
      'https://i.ibb.co/jk7rk9Hk/three-milk-cake.webp',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    accent: '#E76F51', // Golden Toasted Crust
    kicker: ['HONEST FLOUR & TIME', 'SLOW FERMENTED CRUST', 'NO CHEMICAL SHORTCUTS'],
    title: ['HONEST', 'DAILY', 'BREADS'],
    status: 'Baking While The City Sleeps',
    cta: { label: 'Explore Morning Breads', view: 'menu' },
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop&q=80',
      'https://ik.imagekit.io/wvchctn6t/WhatsApp%20Image%202026-09-09%20at%204.26.41%20PM.jpg',
    ],
  },
  {
    accent: '#FFD166', // Caramel Fudge
    kicker: ['WARM AFTERNOON HIGH TEA', 'DUTCH COCOA & WALNUT', 'CRISP FLAKY PASTRIES'],
    title: ['SHARED', 'FAMILY', 'TABLES'],
    status: 'Served Daily at All 7 Bahawalpur Branches',
    cta: { label: 'Discover Afternoon Snacks', view: 'menu' },
    images: ['/assets/images/muffinns_chocolate_slice.jpg'],
  },
];

export const BAKERY_NAV: ChromeLink[] = [
  { label: 'Our Story', view: 'story' },
  { label: 'Complete Menu', view: 'menu' },
  { label: '7 Branches (GPS)', view: 'find-us' },
];

export const BAKERY_WORDMARK: [string, string, string] = ['Pure', 'Baking', 'Heritage'];

const CONFIG = {
  SCROLL_PER_SLIDE: 1, // viewport heights of scroll per transition
  SCRUB: 0.6, // scrub lag in seconds
  PARALLAX_MEDIA: 10, // photo drift
  PARALLAX_COPY: 4.5, // text drifts less than photo
  SPLIT_SHIFT: 9, // shear between the two text halves
  TEXT_SPAN: 0.8, // share of a transition the text takes
};

const TITLE_CAP = 0.72;

type PartRefs = {
  mask: HTMLElement | null;
  inner: HTMLDivElement | null;
  photo: HTMLDivElement | null;
  text: HTMLDivElement | null;
  textLeft: HTMLDivElement | null;
  textRight: HTMLDivElement | null;
};

function useListRefs<T extends Record<string, Element | null>>(empty: () => T) {
  const list = useRef<T[]>([]);
  const set = useCallback(
    <K extends keyof T>(index: number, key: K) =>
      (el: T[K]) => {
        list.current[index] ??= empty();
        list.current[index][key] = el;
      },
    [empty],
  );
  return [list, set] as const;
}

const emptyParts = (): PartRefs => ({
  mask: null,
  inner: null,
  photo: null,
  text: null,
  textLeft: null,
  textRight: null,
});

function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled]);
}

const MICRO = 'text-[length:var(--mfa-micro)] font-mono font-bold tracking-[0.14em] uppercase';

export default function SplitScreenSlider({
  slides = BAKERY_SLIDES,
  nav = BAKERY_NAV,
  wordmark = BAKERY_WORDMARK,
  smoothScroll = false, // Keep smooth scroll lightweight and non-conflicting
  className = '',
  onNavigate,
}: SplitScreenSliderProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [leftRefs, setLeftRef] = useListRefs(emptyParts);
  const [rightRefs, setRightRef] = useListRefs(emptyParts);

  useSmoothScroll(smoothScroll);

  useGSAP(
    () => {
      if (slides.length < 2) return;
      const parts = slides.map((_, i) => ({
        left: leftRefs.current[i],
        right: rightRefs.current[i],
      }));
      type Parts = (typeof parts)[number];

      const inBothColumns = (slide: Parts, part: keyof PartRefs) => [
        slide.left[part],
        slide.right[part],
      ];

      function buildChange(current: Parts, next: Parts) {
        const change = gsap.timeline({ defaults: { ease: 'none' } });

        const move = (elements: (Element | null)[], start: number, end: number, length: number) =>
          change.fromTo(
            elements,
            { yPercent: start },
            { yPercent: end, duration: length, immediateRender: start !== 0 },
            (1 - length) / 2,
          );

        // Wipe masks in opposite directions
        move([next.left.mask], 100, 0, 1);
        move([next.left.inner], -100, 0, 1);
        move([next.right.mask], -100, 0, 1);
        move([next.right.inner], 100, 0, 1);

        // Photo parallax drift
        move(inBothColumns(next, 'photo'), CONFIG.PARALLAX_MEDIA, 0, 1);
        move(inBothColumns(current, 'photo'), 0, -CONFIG.PARALLAX_MEDIA, 1);

        // Text block drift
        const span = CONFIG.TEXT_SPAN;
        move(inBothColumns(next, 'text'), CONFIG.PARALLAX_COPY, 0, span);
        move(inBothColumns(current, 'text'), 0, -CONFIG.PARALLAX_COPY, span);

        // Headline halves shear along the central vertical seam
        move(inBothColumns(next, 'textLeft'), CONFIG.SPLIT_SHIFT, 0, span);
        move(inBothColumns(next, 'textRight'), -CONFIG.SPLIT_SHIFT, 0, span);
        move(inBothColumns(current, 'textLeft'), 0, -CONFIG.SPLIT_SHIFT, span);
        move(inBothColumns(current, 'textRight'), 0, CONFIG.SPLIT_SHIFT, span);

        return change;
      }

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const reelTimeline = gsap.timeline({ paused: true });
        for (let i = 0; i < parts.length - 1; i++) {
          reelTimeline.add(buildChange(parts[i], parts[i + 1]));
        }

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * CONFIG.SCROLL_PER_SLIDE * (slides.length - 1),
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          animation: reelTimeline,
          scrub: CONFIG.SCRUB,
        });
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad, { once: true });
      return () => {
        window.removeEventListener('load', onLoad);
      };
    },
    { scope: rootRef, dependencies: [slides] },
  );

  const fit = {
    '--mfa-longest-line': Math.max(...slides.flatMap((s) => s.title.map((l) => l.length))),
    '--mfa-title-lines': Math.max(...slides.map((s) => s.title.length)),
    '--mfa-cap': TITLE_CAP,
  } as CSSProperties;

  return (
    <section
      ref={rootRef}
      aria-label="Bakery Heritage Showreel"
      style={fit}
      className={`split-screen-slider relative isolate block overflow-x-clip bg-[#120D1A] text-[#FFF8F0] font-sans ${className}`}
    >
      {/* Pinned viewport stage */}
      <div
        ref={pinRef}
        className="relative h-svh w-full overflow-clip motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col motion-reduce:overflow-visible"
      >
        <Column side="left">
          {slides.map((slide, i) => (
            <Slide
              key={i}
              slide={slide}
              first={i === 0}
              set={(key) => setLeftRef(i, key)}
              onNavigate={onNavigate}
            />
          ))}
        </Column>

        <Column side="right">
          {slides.map((slide, i) => (
            <Slide
              key={i}
              slide={slide}
              first={i === 0}
              set={(key) => setRightRef(i, key)}
              onNavigate={onNavigate}
            />
          ))}
        </Column>

        {/* Top Chrome Navigation */}
        <nav
          aria-label="Showreel Quick Jump"
          className={`${CHROME} top-[var(--mfa-edge)] motion-reduce:sticky motion-reduce:top-0 motion-reduce:order-first motion-reduce:bg-[#120D1A] motion-reduce:py-[var(--mfa-edge)]`}
        >
          {nav.map((link, i) => (
            <button
              key={link.label}
              onClick={() => link.view && onNavigate && onNavigate(link.view)}
              className={`${chromeItem(i, nav.length)} opacity-85 transition-opacity duration-200 hover:opacity-100 hover:text-brand-honey focus-visible:opacity-100 cursor-pointer`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Bottom Chrome Wordmark */}
        <p aria-hidden="true" className={`${CHROME} bottom-[var(--mfa-edge)] motion-reduce:hidden`}>
          {wordmark.map((word, i) => (
            <span key={i} className={chromeItem(i, wordmark.length)}>
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

const CHROME = `absolute left-0 z-[3] m-0 flex w-full items-center justify-between px-[var(--mfa-gutter)] text-[#FFF8F0]/85 ${MICRO}`;
const chromeItem = (i: number, n: number) =>
  `flex-1 text-inherit no-underline ${i === n - 1 ? 'text-right' : i === 1 ? 'text-center' : ''}`;

function Column({ side, children }: { side: 'left' | 'right'; children: ReactNode }) {
  const left = side === 'left';
  return (
    <div
      inert={!left}
      className={`absolute top-0 h-full w-1/2 overflow-hidden ${
        left
          ? 'left-0 motion-reduce:static motion-reduce:h-auto motion-reduce:w-full motion-reduce:overflow-visible'
          : 'left-1/2 motion-reduce:hidden'
      }`}
    >
      <div
        className={`absolute top-0 h-full w-[200%] @container motion-reduce:static motion-reduce:h-auto motion-reduce:w-full ${
          left ? 'left-0' : '-left-full'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Slide({
  slide,
  first,
  set,
  onNavigate,
}: {
  slide: ReelSlide;
  first: boolean;
  set: <K extends keyof PartRefs>(key: K) => (el: PartRefs[K]) => void;
  onNavigate?: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker') => void;
}) {
  return (
    <article
      ref={set('mask')}
      style={{ '--mfa-accent': slide.accent } as CSSProperties}
      className="absolute inset-0 m-0 overflow-hidden motion-reduce:relative motion-reduce:inset-auto motion-reduce:h-svh"
    >
      <div ref={set('inner')} className="absolute inset-0">
        {/* Parallax Photo Strip */}
        <div className="absolute inset-0 overflow-hidden bg-[#120D1A]">
          <div
            ref={set('photo')}
            className="absolute inset-x-0 -inset-y-[var(--mfa-overscan)] flex"
          >
            {slide.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                fetchPriority={first && i === 0 ? 'high' : 'low'}
                decoding="async"
                className="h-full w-0 flex-1 object-cover select-none [-webkit-user-drag:none] first:flex-[1.32_1_0%] max-[700px]:not-first:hidden"
              />
            ))}
          </div>
        </div>

        {/* Ambient bakery vignette */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_90%_at_50%_50%,rgba(18,13,26,0.15)_25%,rgba(18,13,26,0.85)_100%),rgba(18,13,26,var(--mfa-veil))]" />

        {/* Centered Split Typography Layer */}
        <div ref={set('text')} className="absolute inset-0">
          <CopyLayer
            ref={set('textLeft')}
            slide={slide}
            className="[clip-path:inset(0_calc(50%_-_0.5px)_0_0)] motion-reduce:[clip-path:none]"
            onNavigate={onNavigate}
          />
          <CopyLayer
            ref={set('textRight')}
            slide={slide}
            inert
            aria-hidden="true"
            className="[clip-path:inset(0_0_0_50%)] motion-reduce:hidden"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </article>
  );
}

function CopyLayer({
  slide,
  className,
  onNavigate,
  ...rest
}: {
  slide: ReelSlide;
  className: string;
  onNavigate?: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker') => void;
} & ComponentProps<'div'>) {
  return (
    <div
      {...rest}
      className={`absolute inset-0 flex flex-col items-center justify-center px-[var(--mfa-gutter)] py-[calc(var(--mfa-edge)*2.6)] text-center text-[color:var(--mfa-accent)] ${className}`}
    >
      {/* Kicker Lines */}
      <p className={`m-0 flex flex-col leading-[1.45] text-brand-honey/90 ${MICRO}`}>
        {slide.kicker.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      {/* Massive Typographic Headline */}
      <h2 className="my-[clamp(10px,2.2vh,28px)] font-serif font-black uppercase leading-[var(--mfa-title-leading)] tracking-[-0.035em] text-[length:min(var(--mfa-title-look),calc((100cqw_-_2_*_var(--mfa-gutter))_/_(var(--mfa-longest-line)_*_var(--mfa-cap))),calc(62svh_/_(var(--mfa-title-lines)_*_var(--mfa-title-leading))))] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        {slide.title.map((word) => (
          <span key={word} className="block whitespace-nowrap">
            {word}
          </span>
        ))}
      </h2>

      {/* Status / Heritage note */}
      <p className={`m-0 flex flex-col leading-[1.45] text-[#FFF8F0]/75 ${MICRO}`}>
        {slide.status}
      </p>

      {/* Call to action button */}
      {slide.cta && (
        <button
          onClick={() => slide.cta?.view && onNavigate && onNavigate(slide.cta.view)}
          className={`mt-[clamp(14px,3.4vh,40px)] border-b-2 border-current pb-1 text-inherit no-underline opacity-90 transition-all duration-300 hover:opacity-100 hover:scale-105 cursor-pointer focus-visible:opacity-100 ${MICRO}`}
        >
          {slide.cta.label} →
        </button>
      )}
    </div>
  );
}
