import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

/* ------------------------------------------------------------------ */
/*  Config & Fonts (Exact font styling matching original first design)*/
/* ------------------------------------------------------------------ */

const FONT = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Outfit', 'Inter', system-ui, sans-serif";
const FONT_LOGO = "Fraunces, 'Playfair Display', 'Cormorant Garamond', Georgia, serif";
const LOGO_STYLE = { fontFamily: FONT_LOGO, fontVariationSettings: "'opsz' 144" };

/* ------------------------------------------------------------------ */
/*  Intro animation configuration                                     */
/* ------------------------------------------------------------------ */

const INTRO = {
  travel: '1.3em',
  meetDuration: 1.3,
  meetEase: 'expo.inOut',
  logoSize: 'max(7vw, 44px)',
  platePadY: '-0.05em',
  platePadX: '0.08em',
  hold: 0.25,
  riseDuration: 1.2,
  riseEase: 'expo.inOut',
  titleLead: 0.6,
  titleDuration: 1.5,
  titleStagger: 0.12,
  titleEase: 'expo.out',
  pageLead: 0.6,
  pageFade: 0.7,
  contentTravel: '1.2em',
  imageTravel: '25vh',
  contentDuration: 1.2,
  contentStagger: 0.05,
  copyDelay: 0.3,
  copyStagger: 0.08,
  contentEase: 'expo.out',
  unlockDelay: 0.5,
};

const SCROLL = {
  slotTop: 79,
  slotTopPhone: 44,
  endAt: '10%',
  endHeight: '90vh',
  gap: '16vh',
  fadeAt: 0.2,
  fadeLength: 0.15,
  scrub: true as const,
  revealStart: 'top 75%',
  revealDuration: 1.2,
  revealStagger: 0.08,
  revealEase: 'expo.out',
};

const HOVER = {
  duration: 0.6,
  stagger: 0.025,
  ease: 'cubic-bezier(0.87, 0, 0.13, 1)',
};

const pageLenis = () => (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis;

/* ------------------------------------------------------------------ */
/*  4-Step Story Definitions & Best High-Resolution Images            */
/* ------------------------------------------------------------------ */

export type StudioLink = { label: string; href?: string; onClick?: () => void };

export interface ScrollStoryStep {
  step: string;
  badge: string;
  heading: string;
  lead: string;
  subHighlight: string;
  image: string;
  alt: string;
  ctaText: string;
}

export const DEFAULT_STORY_STEPS: ScrollStoryStep[] = [
  {
    step: '01 / 04',
    badge: 'Morning Atelier',
    heading: 'The Patisserie Craft & Morning Breads',
    lead: 'We craft slow-baked pastries and warm golden muffins for patrons who appreciate true uncompromising taste. Fresh from copper deck ovens at 7:00 AM daily across Bahawalpur.',
    subHighlight: 'Fresh Oven Batches · 7:00 AM Daily',
    image: '/assets/images/hero_editorial_muffin_1794039141433.jpg',
    alt: 'Signature Golden Honey Muffin',
    ctaText: 'Explore Fresh Breads',
  },
  {
    step: '02 / 04',
    badge: 'Royal Tradition',
    heading: 'Royal Desi Ghee Patashay & Sohan Halwa',
    lead: 'Our signature generational mother recipe perfected since 1988. Slow-simmered in copper cauldrons with pure desi ghee, saffron threads, pistachio slivers, and fragrant green cardamom.',
    subHighlight: '100% Pure Desi Ghee · Bahawalpur Legacy',
    image: '/assets/images/muffinns_patashay_sweets_1784645566064.jpg',
    alt: 'Royal Desi Ghee Patashay Traditional Sweets',
    ctaText: 'Taste Heritage Mithai',
  },
  {
    step: '03 / 04',
    badge: 'Celebration Atelier',
    heading: 'Lotus Biscoff Crunch & Velvet Three Milk',
    lead: 'Soaked in three sweetened dairy milks and layered with velvety chantilly cream, Belgian chocolate ganache, and Lotus Biscoff crumble. The undisputed centerpiece of every family celebration.',
    subHighlight: 'Custom Celebration & Bento Cakes',
    image: '/assets/images/muffinns_lotus_biscof_cake.jpg',
    alt: 'Lotus Biscoff Celebration Cake',
    ctaText: 'Order Celebration Cake',
  },
  {
    step: '04 / 04',
    badge: 'Savory Patisserie',
    heading: 'Golden Flaky Chicken Patties & Crispy Samosas',
    lead: 'Layered with feather-light puff pastry, tender spiced chicken breast, and secret bakery seasonings. Served steaming warm for Bahawalpur’s cherished afternoon family high-tea tables.',
    subHighlight: 'Flaky Puff Pastry · High Tea Tradition',
    image: '/assets/images/muffinns_chicken_patty_1784645625734.jpg',
    alt: 'Flaky Golden Chicken Patty High Tea Snack',
    ctaText: 'Discover Savory High-Tea',
  },
];

export interface CreativeStudioHeroProps {
  brand?: string;
  location?: { lead: string; place: string; line2: string };
  tagline?: [string, string];
  title?: string[];
  links?: StudioLink[];
  leftCopy?: string[];
  rightCopy?: string[];
  steps?: ScrollStoryStep[];
  onNavigate?: (view: any) => void;
}

const DEFAULT_LINKS: StudioLink[] = [
  { label: 'Artisanal Breads' },
  { label: 'Signature Halwa' },
  { label: 'Custom Cakes' },
  { label: 'Traditional Mithai' },
  { label: 'Savory Patisserie' },
  { label: 'Direct Kitchen Order' },
];

/* ------------------------------------------------------------------ */
/*  Masked lines helper                                               */
/* ------------------------------------------------------------------ */

function MaskedLines({
  lines,
  register,
  className = '',
}: {
  lines: string[];
  register: (el: HTMLElement | null) => void;
  className?: string;
}) {
  return lines.map((line) => (
    <span key={line} className="block overflow-hidden">
      <span
        ref={register}
        className={`block will-change-transform [backface-visibility:hidden] ${className}`}
        style={{ transform: 'translateY(105%)' }}
      >
        {line}
      </span>
    </span>
  ));
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */

export default function CreativeStudioHero({
  brand = 'Muff Inns',
  title = ['Decadence In', 'Every Bite'],
  links = DEFAULT_LINKS,
  leftCopy = [
    'Handcrafted croissants, warm muffins',
    'and slow-simmered royal halwas',
    'baked with pure farm desi ghee.',
  ],
  rightCopy = [
    'Traditional recipes perfected since 1988',
    'for weddings, cherished gatherings',
    'and refined daily indulgence.',
  ],
  steps = DEFAULT_STORY_STEPS,
  onNavigate,
}: CreativeStudioHeroProps) {
  const root = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Animation element refs
  const introLayerRef = useRef<HTMLDivElement>(null);
  const introLogoRef = useRef<HTMLSpanElement>(null);
  const plateRef = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const headerLogoRef = useRef<any>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageOverlayRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);

  // 4 Scroll Images
  const img1Ref = useRef<HTMLImageElement>(null);
  const img2Ref = useRef<HTMLImageElement>(null);
  const img3Ref = useRef<HTMLImageElement>(null);
  const img4Ref = useRef<HTMLImageElement>(null);

  // 4 Step Text Section Refs
  const step1TextRef = useRef<HTMLDivElement>(null);
  const step2TextRef = useRef<HTMLDivElement>(null);
  const step3TextRef = useRef<HTMLDivElement>(null);
  const step4TextRef = useRef<HTMLDivElement>(null);

  const titleLines = useRef<HTMLElement[]>([]);
  const copyLines = useRef<HTMLElement[]>([]);
  const content = useRef<HTMLElement[]>([]);

  const collectTitle = (el: HTMLElement | null) => {
    if (el && !titleLines.current.includes(el)) titleLines.current.push(el);
  };
  const collectCopy = (el: HTMLElement | null) => {
    if (el && !copyLines.current.includes(el)) copyLines.current.push(el);
  };

  const copyRefs = useRef<HTMLParagraphElement[]>([]);

  // Smooth jump to specific step
  const scrollToStep = (stepIdx: number) => {
    if (!stageRef.current) return;
    const st = ScrollTrigger.getById('creative-scroll-stage');
    if (st) {
      const targets = [0.18, 0.45, 0.72, 0.94];
      const targetRatio = targets[stepIdx] || 0.18;
      const targetPos = st.start + (st.end - st.start) * targetRatio;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    } else {
      stageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Buttery Smooth 4-Step Pinned Scroll Animation                     */
  /* ------------------------------------------------------------------ */

  useGSAP(
    () => {
      const stage = stageRef.current;
      const header = headerRef.current;
      const introLayer = introLayerRef.current;
      const logo = introLogoRef.current;
      const plate = plateRef.current;
      const target = headerLogoRef.current;
      const lines = titleLines.current;
      const copy = copyLines.current;
      const row = rowRef.current;
      const imageFrame = imageFrameRef.current;
      const img1 = img1Ref.current;
      const img2 = img2Ref.current;
      const img3 = img3Ref.current;
      const img4 = img4Ref.current;
      const step1Text = step1TextRef.current;
      const step2Text = step2TextRef.current;
      const step3Text = step3TextRef.current;
      const step4Text = step4TextRef.current;
      const overlay = imageOverlayRef.current;
      const indicators = indicatorsRef.current;

      if (!stage || !header || !row || !introLayer || !logo || !plate || !target || !imageFrame) {
        return;
      }

      // Initial state of text sections and images
      if (step1Text) gsap.set(step1Text, { autoAlpha: 0, yPercent: 35 });
      if (step2Text) gsap.set(step2Text, { autoAlpha: 0, yPercent: 35 });
      if (step3Text) gsap.set(step3Text, { autoAlpha: 0, yPercent: 35 });
      if (step4Text) gsap.set(step4Text, { autoAlpha: 0, yPercent: 35 });
      if (indicators) gsap.set(indicators, { autoAlpha: 0, y: -12 });
      if (img2) gsap.set(img2, { autoAlpha: 0, scale: 1.05 });
      if (img3) gsap.set(img3, { autoAlpha: 0, scale: 1.05 });
      if (img4) gsap.set(img4, { autoAlpha: 0, scale: 1.05 });

      // Pinned stage for continuous smooth image zoom + 4-step image/text changes
      const zoomTl = gsap.timeline({
        id: 'creative-scroll-stage',
        scrollTrigger: {
          id: 'creative-scroll-stage',
          trigger: stage,
          start: 'top top',
          end: '+=360%',
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.32) {
              setActiveStep(0);
            } else if (p < 0.58) {
              setActiveStep(1);
            } else if (p < 0.84) {
              setActiveStep(2);
            } else {
              setActiveStep(3);
            }
          },
        },
        defaults: { ease: 'power1.inOut' },
      });

      // 1. Initial Hero Elements fade out
      zoomTl.to(
        header,
        {
          opacity: 0,
          y: -25,
          duration: 0.2,
        },
        0,
      );

      const validLines = lines.filter(Boolean);
      if (validLines.length > 0) {
        zoomTl.to(
          validLines,
          {
            opacity: 0,
            y: -35,
            duration: 0.22,
          },
          0,
        );
      }

      const validCopyRefs = copyRefs.current.filter(Boolean);
      if (validCopyRefs.length > 0) {
        zoomTl.to(
          validCopyRefs,
          {
            opacity: 0,
            y: -25,
            duration: 0.22,
          },
          0,
        );
      }

      // 2. Expand frame to full-bleed cinematic background
      zoomTl.to(
        imageFrame,
        {
          scale: () => (window.innerWidth < 768 ? 3.3 : 2.65),
          y: () => (window.innerWidth < 768 ? '-12vh' : '-15vh'),
          borderRadius: '0px',
          borderWidth: '0px',
          boxShadow: 'none',
          duration: 0.45,
          ease: 'power2.out',
        },
        0,
      );

      if (overlay) {
        zoomTl.to(
          overlay,
          {
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.12,
        );
      }

      if (indicators) {
        zoomTl.to(
          indicators,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.15,
        );
      }

      // -------------------------------------------------------------
      // SECTION 1: Morning Atelier (Honey Muffin & Artisan Breads)
      // -------------------------------------------------------------
      if (step1Text) {
        zoomTl.fromTo(
          step1Text,
          { yPercent: 35, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out' },
          0.16,
        );
      }

      // -------------------------------------------------------------
      // TRANSITION 1 -> 2: (Image 1 -> Image 2, Text 1 -> Text 2)
      // -------------------------------------------------------------
      if (step1Text) {
        zoomTl.to(
          step1Text,
          { yPercent: -25, autoAlpha: 0, duration: 0.18, ease: 'power2.in' },
          0.34,
        );
      }

      if (img1) {
        zoomTl.to(
          img1,
          { opacity: 0, scale: 1.04, duration: 0.22, ease: 'power1.inOut' },
          0.34,
        );
      }

      if (img2) {
        zoomTl.fromTo(
          img2,
          { autoAlpha: 0, scale: 1.06 },
          { autoAlpha: 1, scale: 1, duration: 0.24, ease: 'power1.inOut' },
          0.35,
        );
      }

      if (step2Text) {
        zoomTl.fromTo(
          step2Text,
          { yPercent: 30, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.24, ease: 'power2.out' },
          0.39,
        );
      }

      // -------------------------------------------------------------
      // TRANSITION 2 -> 3: (Image 2 -> Image 3, Text 2 -> Text 3)
      // -------------------------------------------------------------
      if (step2Text) {
        zoomTl.to(
          step2Text,
          { yPercent: -25, autoAlpha: 0, duration: 0.18, ease: 'power2.in' },
          0.60,
        );
      }

      if (img2) {
        zoomTl.to(
          img2,
          { opacity: 0, scale: 1.04, duration: 0.22, ease: 'power1.inOut' },
          0.60,
        );
      }

      if (img3) {
        zoomTl.fromTo(
          img3,
          { autoAlpha: 0, scale: 1.06 },
          { autoAlpha: 1, scale: 1, duration: 0.24, ease: 'power1.inOut' },
          0.61,
        );
      }

      if (step3Text) {
        zoomTl.fromTo(
          step3Text,
          { yPercent: 30, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.24, ease: 'power2.out' },
          0.65,
        );
      }

      // -------------------------------------------------------------
      // TRANSITION 3 -> 4: (Image 3 -> Image 4, Text 3 -> Text 4)
      // -------------------------------------------------------------
      if (step3Text) {
        zoomTl.to(
          step3Text,
          { yPercent: -25, autoAlpha: 0, duration: 0.18, ease: 'power2.in' },
          0.85,
        );
      }

      if (img3) {
        zoomTl.to(
          img3,
          { opacity: 0, scale: 1.04, duration: 0.22, ease: 'power1.inOut' },
          0.85,
        );
      }

      if (img4) {
        zoomTl.fromTo(
          img4,
          { autoAlpha: 0, scale: 1.06 },
          { autoAlpha: 1, scale: 1, duration: 0.24, ease: 'power1.inOut' },
          0.86,
        );
      }

      if (step4Text) {
        zoomTl.fromTo(
          step4Text,
          { yPercent: 30, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.24, ease: 'power2.out' },
          0.90,
        );
      }

      // Reduced-motion safety fallback
      const clearTargets = [...lines, ...copy].filter(Boolean);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(introLayer, { autoAlpha: 0 });
        if (clearTargets.length > 0) {
          gsap.set(clearTargets, { clearProps: 'all' });
        }
        if (step1Text) gsap.set(step1Text, { autoAlpha: 1, yPercent: 0 });
        return;
      }

      gsap.set(target, { opacity: 0 });

      const fit = Flip.fit(logo, target, {
        scale: true,
        duration: INTRO.riseDuration,
        ease: INTRO.riseEase,
      });

      const tl = gsap.timeline({ defaults: { ease: INTRO.meetEase, duration: INTRO.meetDuration } });

      tl.addLabel('meet')
        .fromTo(logo, { y: `-${INTRO.travel}`, opacity: 1 }, { y: 0 }, 'meet')
        .fromTo(plate, { scaleY: 0, transformOrigin: '50% 100%', opacity: 1 }, { scaleY: 1 }, 'meet');

      tl.addLabel('rise', `meet+=${INTRO.meetDuration + INTRO.hold}`)
        .add(fit as gsap.core.Tween, 'rise')
        .to(
          plate,
          {
            transformOrigin: '50% 50%',
            scaleX: stage.offsetWidth / plate.offsetWidth,
            scaleY: stage.offsetHeight / plate.offsetHeight,
            duration: INTRO.riseDuration,
            ease: INTRO.riseEase,
          },
          'rise',
        );

      if (validLines.length > 0) {
        tl.addLabel('title', `rise+=${INTRO.riseDuration - INTRO.titleLead}`).fromTo(
          validLines,
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            duration: INTRO.titleDuration,
            stagger: INTRO.titleStagger,
            ease: INTRO.titleEase,
          },
          'title',
        );
      }

      tl.set(logo, { autoAlpha: 0 }, `rise+=${INTRO.riseDuration}`).set(target, { opacity: 1 }, '<');

      const validCopy = copy.filter(Boolean);

      tl.addLabel('page', `rise+=${INTRO.riseDuration - INTRO.pageLead}`)
        .to(introLayer, { autoAlpha: 0, duration: INTRO.pageFade, ease: 'none' }, 'page');

      tl.fromTo(
        imageFrame,
        { y: INTRO.imageTravel, opacity: 0 },
        { y: 0, opacity: 1, duration: INTRO.contentDuration, ease: INTRO.contentEase },
        'page',
      );

      if (validCopy.length > 0) {
        tl.fromTo(
          validCopy,
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            duration: INTRO.contentDuration,
            stagger: INTRO.copyStagger,
            ease: INTRO.contentEase,
          },
          `page+=${INTRO.copyDelay}`,
        );
      }

      return () => {
        zoomTl.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative z-10 w-full bg-[#fdfbf9] text-[#21100B] rounded-3xl overflow-hidden shadow-xs border border-[#32140D]/10"
      style={
        {
          fontFamily: FONT,
          '--slot-desktop': `${SCROLL.slotTop}vh`,
          '--slot-phone': `${SCROLL.slotTopPhone}vh`,
        } as React.CSSProperties
      }
    >
      {/* Main Hero Viewport Section */}
      <section className="relative w-full overflow-hidden">
        <div ref={stageRef} className="relative h-svh w-full flex flex-col justify-between overflow-hidden">
          
          {/* Intro backdrop: dark page + white plate */}
          <div
            ref={introLayerRef}
            className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-[#21100B] will-change-[opacity]"
          >
            <span
              className="relative leading-none font-black tracking-[-0.03em]"
              style={{ ...LOGO_STYLE, fontSize: INTRO.logoSize }}
            >
              <span
                ref={plateRef}
                className="absolute bg-[#fdfbf9] opacity-0 will-change-transform"
                style={{
                  top: `calc(${INTRO.platePadY} * -1)`,
                  bottom: `calc(${INTRO.platePadY} * -1)`,
                  left: `calc(${INTRO.platePadX} * -1)`,
                  right: `calc(${INTRO.platePadX} * -1)`,
                }}
              />
              <span aria-hidden="true" className="invisible">
                {brand}
              </span>
            </span>
          </div>

          {/* Intro wordmark */}
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
            <span
              ref={introLogoRef}
              className="leading-none font-black tracking-[-0.03em] text-[#21100B] opacity-0 will-change-transform"
              style={{ ...LOGO_STYLE, fontSize: INTRO.logoSize }}
            >
              {brand}
            </span>
          </div>

          {/* Top brand header */}
          <header
            ref={headerRef}
            className="relative z-30 flex items-center justify-center px-[4vw] pt-[2.4vh] text-[1.15vw] leading-[1.2] font-normal md:px-[2.4vw] md:pt-[3.2vh] text-[#21100B]"
          >
            <button
              type="button"
              ref={headerLogoRef}
              onClick={() => onNavigate && onNavigate('home')}
              className="relative z-30 text-[2.9vw] leading-none font-black tracking-[-0.03em] max-md:text-[28px] text-[#21100B] cursor-pointer hover:opacity-85 transition-opacity"
              style={LOGO_STYLE}
            >
              {brand}
            </button>
          </header>

          {/* Headline — Orange-Brownish Mix */}
          <h1 className="relative z-20 mt-[2vh] md:mt-[3vh] text-center text-[10vw] leading-[0.88] md:text-[7.5vw] font-black tracking-[-0.06em] uppercase text-[#B84A1C]">
            <MaskedLines 
              lines={title} 
              register={collectTitle} 
              className="bg-gradient-to-r from-[#E94F16] via-[#B84A1C] to-[#451B0F] bg-clip-text text-transparent inline-block pb-1"
            />
          </h1>

          {/* Bottom row: copy | visual | copy */}
          <div
            ref={rowRef}
            className="relative z-30 w-full mb-[4vh] grid grid-cols-[1fr_38.4vw_1fr] items-center px-[4vw] max-md:grid-cols-1 max-md:gap-4"
          >
            <div
              ref={(el) => {
                if (el) copyRefs.current[0] = el;
              }}
              className="text-left md:text-center text-[1.2vw] max-md:text-xs leading-relaxed font-light tracking-[-0.02em] will-change-[opacity,transform] text-[#32140D] px-4"
            >
              <MaskedLines lines={leftCopy} register={collectCopy} />
            </div>

            {/* Visual Container: Holds the 4 layered bakery images that transition smoothly with scroll */}
            <div className="z-30 justify-self-center flex items-center justify-center overflow-visible">
              <div
                ref={imageFrameRef}
                className="relative h-[42vh] w-[38.4vw] max-md:h-[30vh] max-md:w-[86vw] aspect-[16/10] md:aspect-[4/3] rounded-2xl bg-[#e6e6e3] overflow-hidden shadow-2xl will-change-transform border border-[#32140D]/12"
              >
                {/* Image 1: Golden Honey Muffin (Morning Atelier) */}
                <img
                  ref={img1Ref}
                  src={steps[0].image}
                  alt={steps[0].alt}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center will-change-[opacity,transform]"
                />

                {/* Image 2: Royal Desi Ghee Patashay (Heritage Mithai) */}
                <img
                  ref={img2Ref}
                  src={steps[1].image}
                  alt={steps[1].alt}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center will-change-[opacity,transform]"
                />

                {/* Image 3: Lotus Biscoff Cake (Celebration Atelier) */}
                <img
                  ref={img3Ref}
                  src={steps[2].image}
                  alt={steps[2].alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center will-change-[opacity,transform]"
                />

                {/* Image 4: Golden Flaky Chicken Patty (Savory Patisserie) */}
                <img
                  ref={img4Ref}
                  src={steps[3].image}
                  alt={steps[3].alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center will-change-[opacity,transform]"
                />
              </div>
            </div>

            <div
              ref={(el) => {
                if (el) copyRefs.current[1] = el;
              }}
              className="text-right md:text-center text-[1.2vw] max-md:text-xs leading-relaxed font-light tracking-[-0.02em] will-change-[opacity,transform] text-[#32140D] px-4"
            >
              <MaskedLines lines={rightCopy} register={collectCopy} />
            </div>
          </div>

          {/* Fullscreen gradient overlay for crisp text readability on full screen image */}
          <div
            ref={imageOverlayRef}
            className="pointer-events-none absolute inset-0 z-35 bg-gradient-to-t from-black/92 via-black/55 to-black/25 opacity-0 will-change-[opacity]"
          />

          {/* Floating Interactive 4-Step Indicator Bar */}
          <div
            ref={indicatorsRef}
            className="absolute top-6 right-6 md:top-8 md:right-10 z-45 flex items-center gap-1.5 sm:gap-2 bg-stone-900/60 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/20 text-xs shadow-xl"
          >
            {steps.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToStep(idx)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                  activeStep === idx
                    ? 'bg-amber-400 text-stone-950 font-black shadow-md shadow-amber-400/40 scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{s.step.split(' ')[0]}</span>
                <span className="hidden sm:inline font-sans text-[10px] font-semibold uppercase tracking-normal">
                  {idx === 0 ? 'Muffins' : idx === 1 ? 'Mithai' : idx === 2 ? 'Cakes' : 'Savory'}
                </span>
              </button>
            ))}
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* STEP 1 TEXT SECTION: Morning Atelier (Original Font Design Style)  */}
          {/* ------------------------------------------------------------------ */}
          <div
            ref={step1TextRef}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-40 px-[4vw] md:px-[6vw] grid gap-[3vw] md:grid-cols-2 items-end pointer-events-auto will-change-[transform,opacity]"
          >
            <div>
              <p className="flex items-center gap-[0.6vw] text-[1.15vw] max-md:gap-[2vw] max-md:text-[13px] text-amber-300 font-mono uppercase tracking-wider font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                <span className="size-[0.7vw] rounded-full bg-amber-400 max-md:size-[7px] animate-pulse drop-shadow" />
                <span>{steps[0].badge} · {steps[0].step}</span>
              </p>
              <h2 className="mt-[1.5vh] text-[2.6vw] font-serif font-black tracking-[-0.03em] max-md:text-[24px] text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {steps[0].heading}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-[2.0vw] leading-[1.32] font-normal tracking-[-0.02em] max-md:text-[17px] text-white/95 font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] max-w-2xl">
                {steps[0].lead}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('menu')}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{steps[0].ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider">
                  {steps[0].subHighlight}
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* STEP 2 TEXT SECTION: Royal Tradition (Original Font Design Style)  */}
          {/* ------------------------------------------------------------------ */}
          <div
            ref={step2TextRef}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-40 px-[4vw] md:px-[6vw] grid gap-[3vw] md:grid-cols-2 items-end pointer-events-auto will-change-[transform,opacity]"
          >
            <div>
              <p className="flex items-center gap-[0.6vw] text-[1.15vw] max-md:gap-[2vw] max-md:text-[13px] text-amber-300 font-mono uppercase tracking-wider font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                <span className="size-[0.7vw] rounded-full bg-amber-400 max-md:size-[7px] animate-pulse drop-shadow" />
                <span>{steps[1].badge} · {steps[1].step}</span>
              </p>
              <h2 className="mt-[1.5vh] text-[2.6vw] font-serif font-black tracking-[-0.03em] max-md:text-[24px] text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {steps[1].heading}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-[2.0vw] leading-[1.32] font-normal tracking-[-0.02em] max-md:text-[17px] text-white/95 font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] max-w-2xl">
                {steps[1].lead}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('menu')}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{steps[1].ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider">
                  {steps[1].subHighlight}
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* STEP 3 TEXT SECTION: Celebration Atelier (Original Font Design Style)*/}
          {/* ------------------------------------------------------------------ */}
          <div
            ref={step3TextRef}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-40 px-[4vw] md:px-[6vw] grid gap-[3vw] md:grid-cols-2 items-end pointer-events-auto will-change-[transform,opacity]"
          >
            <div>
              <p className="flex items-center gap-[0.6vw] text-[1.15vw] max-md:gap-[2vw] max-md:text-[13px] text-amber-300 font-mono uppercase tracking-wider font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                <span className="size-[0.7vw] rounded-full bg-amber-400 max-md:size-[7px] animate-pulse drop-shadow" />
                <span>{steps[2].badge} · {steps[2].step}</span>
              </p>
              <h2 className="mt-[1.5vh] text-[2.6vw] font-serif font-black tracking-[-0.03em] max-md:text-[24px] text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {steps[2].heading}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-[2.0vw] leading-[1.32] font-normal tracking-[-0.02em] max-md:text-[17px] text-white/95 font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] max-w-2xl">
                {steps[2].lead}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('menu')}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{steps[2].ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider">
                  {steps[2].subHighlight}
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* STEP 4 TEXT SECTION: Savory Patisserie (New 4th Section Added!)    */}
          {/* ------------------------------------------------------------------ */}
          <div
            ref={step4TextRef}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-40 px-[4vw] md:px-[6vw] grid gap-[3vw] md:grid-cols-2 items-end pointer-events-auto will-change-[transform,opacity]"
          >
            <div>
              <p className="flex items-center gap-[0.6vw] text-[1.15vw] max-md:gap-[2vw] max-md:text-[13px] text-amber-300 font-mono uppercase tracking-wider font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                <span className="size-[0.7vw] rounded-full bg-amber-400 max-md:size-[7px] animate-pulse drop-shadow" />
                <span>{steps[3].badge} · {steps[3].step}</span>
              </p>
              <h2 className="mt-[1.5vh] text-[2.6vw] font-serif font-black tracking-[-0.03em] max-md:text-[24px] text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {steps[3].heading}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-[2.0vw] leading-[1.32] font-normal tracking-[-0.02em] max-md:text-[17px] text-white/95 font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] max-w-2xl">
                {steps[3].lead}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('menu')}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{steps[3].ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider">
                  {steps[3].subHighlight}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
