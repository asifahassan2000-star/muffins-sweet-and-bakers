import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

/* ------------------------------------------------------------------ */
/*  Config & Fonts (Clean fallbacks for SF Pro & Fraunces)            */
/* ------------------------------------------------------------------ */

const FONT = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Outfit', 'Inter', system-ui, sans-serif";
const FONT_INDEX = "'DIN Next', 'Fira Code', monospace, sans-serif";
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

const HEADER = {
  startAt: 0.5,
  scrub: true as const,
  stripAt: 0.5,
  logoAt: 0.6,
};

const MENU = {
  duration: 0.9,
  ease: 'expo.inOut',
  itemsAt: 0.35,
  travel: 40,
  itemDuration: 1,
  stagger: 0.06,
  closeSpeed: 1.5,
};

const HOVER = {
  duration: 0.6,
  stagger: 0.025,
  ease: 'cubic-bezier(0.87, 0, 0.13, 1)',
};

const pageLenis = () => (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis;

/* ------------------------------------------------------------------ */
/*  Props & Types                                                     */
/* ------------------------------------------------------------------ */

export type StudioLink = { label: string; href?: string; onClick?: () => void };

export type StudioIntro = {
  label: string;
  heading: string;
  lead: string;
};

export interface CreativeStudioHeroProps {
  brand?: string;
  location?: { lead: string; place: string; line2: string };
  tagline?: [string, string];
  title?: string[];
  links?: StudioLink[];
  leftCopy?: string[];
  rightCopy?: string[];
  image?: string;
  intro?: StudioIntro;
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

const DEFAULT_INTRO: StudioIntro = {
  label: 'Bahawalpur Heritage',
  heading: 'The Patisserie Craft Since 1988',
  lead: 'We craft slow-baked pastries and pure royal sweets for patrons who appreciate true uncompromising taste. Every recipe relies on copper cauldron reduction, stone-cracked cardamom, farm-fresh milk, and French double cream without shortcuts.',
};

/* ------------------------------------------------------------------ */
/*  Masked lines                                                      */
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
/*  Rolling label for nav hovers                                      */
/* ------------------------------------------------------------------ */

function RollingLabel({ text }: { text: string }) {
  const chars = Array.from(text).map((c, i) => ({ c: c === ' ' ? '\u00A0' : c, i }));
  const char = (shift: string) =>
    chars.map(({ c, i }) => (
      <span
        key={i}
        className={`inline-block transition-transform will-change-transform ${shift}`}
        style={{
          transitionDuration: `${HOVER.duration}s`,
          transitionDelay: `${i * HOVER.stagger}s`,
          transitionTimingFunction: HOVER.ease,
        }}
      >
        {c}
      </span>
    ));

  return (
    <span className="relative block overflow-hidden pr-[0.08em] -mr-[0.08em] leading-[1.15]">
      <span className="block">{char('group-hover:-translate-y-full')}</span>
      <span aria-hidden="true" className="absolute inset-0 block">
        {char('translate-y-full group-hover:translate-y-0')}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CreativeStudioHero({
  brand = 'Muff Inns',
  location = { lead: 'Atelier In', place: 'Bahawalpur, Punjab', line2: 'Heritage Bakery & Mithai Since 1988' },
  tagline = ['Artisanal Sweet & Baker House', 'Slow-Baked Daily Indulgence'],
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
  image = '/assets/images/hero_editorial_muffin_1794039141433.jpg',
  intro = DEFAULT_INTRO,
  onNavigate,
}: CreativeStudioHeroProps) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItems = useRef<HTMLElement[]>([]);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  const collectMenuItem = (el: HTMLElement | null) => {
    if (el && !menuItems.current.includes(el)) menuItems.current.push(el);
  };

  const introLayerRef = useRef<HTMLDivElement>(null);
  const introLogoRef = useRef<HTMLSpanElement>(null);
  const plateRef = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const headerLogoRef = useRef<any>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLDivElement>(null);
  const imageOverlayRef = useRef<HTMLDivElement>(null);
  const introTextRefs = useRef<HTMLElement[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const copyRefs = useRef<HTMLParagraphElement[]>([]);

  const titleLines = useRef<HTMLElement[]>([]);
  const copyLines = useRef<HTMLElement[]>([]);
  const content = useRef<HTMLElement[]>([]);

  const collect = (el: HTMLElement | null) => {
    if (el && !content.current.includes(el)) content.current.push(el);
  };
  const collectTitle = (el: HTMLElement | null) => {
    if (el && !titleLines.current.includes(el)) titleLines.current.push(el);
  };

  const navRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const barLogoRef = useRef<any>(null);
  const heroLinks = useRef<HTMLElement[]>([]);
  const barLinks = useRef<HTMLElement[]>([]);

  const collectHeroLink = (el: HTMLElement | null) => {
    collect(el);
    if (el && !heroLinks.current.includes(el)) heroLinks.current.push(el);
  };
  const collectBarLink = (el: HTMLElement | null) => {
    if (el && !barLinks.current.includes(el)) barLinks.current.push(el);
  };
  const collectCopy = (el: HTMLElement | null) => {
    if (el && !copyLines.current.includes(el)) copyLines.current.push(el);
  };
  const collectIntroText = (el: HTMLElement | null) => {
    if (el && !introTextRefs.current.includes(el)) introTextRefs.current.push(el);
  };

  const lockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    lockedRef.current = true;
    document.documentElement.setAttribute('data-scroll-locked', '');
    pageLenis()?.stop();

    const block = (e: Event) => e.preventDefault();
    const keys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
    const key = (e: KeyboardEvent) => {
      if (keys.has(e.key)) e.preventDefault();
    };

    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    window.addEventListener('keydown', key);

    return () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      document.documentElement.removeAttribute('data-scroll-locked');
      pageLenis()?.start();
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
      window.removeEventListener('keydown', key);
    };
  }, []);

  useGSAP(
    () => {
      const sheet = menuRef.current;
      if (!sheet) return;
      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: MENU.ease } })
        .set(sheet, { autoAlpha: 1 })
        .fromTo(
          sheet,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: MENU.duration },
        )
        .fromTo(
          menuItems.current,
          { y: MENU.travel, opacity: 0 },
          { y: 0, opacity: 1, duration: MENU.itemDuration, stagger: MENU.stagger, ease: 'expo.out' },
          MENU.itemsAt,
        );
    },
    { scope: root },
  );

  const menuUnlock = useRef<(() => void) | null>(null);
  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (menuOpen) {
      menuUnlock.current = lockScroll();
      tl.timeScale(1).play();
    } else {
      menuUnlock.current?.();
      menuUnlock.current = null;
      tl.timeScale(MENU.closeSpeed).reverse();
    }
  }, [menuOpen, lockScroll]);

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
      const visual = imageRef.current;
      const introSection = introSectionRef.current;

      if (!stage || !header || !row || !introSection || !introLayer || !logo || !plate || !target || !visual) {
        return;
      }

      // Pinned stage for continuous smooth image zoom to proper proportion and connected intro text arrival
      const zoomTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=130%',
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
        defaults: { ease: 'power1.inOut' },
      });

      // Prepare connected next text section initial state
      gsap.set(introSection, { yPercent: 110, opacity: 0 });
      gsap.set(introTextRefs.current, { y: 25, opacity: 0 });

      zoomTl
        .to(
          header,
          {
            opacity: 0,
            y: -25,
            duration: 0.3,
          },
          0,
        )
        .to(
          lines,
          {
            opacity: 0,
            y: -40,
            duration: 0.35,
          },
          0,
        )
        .to(
          copyRefs.current,
          {
            opacity: 0,
            y: -30,
            duration: 0.35,
          },
          0,
        )
        // Zoom image smoothly to full screen
        .to(
          visual,
          {
            scale: () => (window.innerWidth < 768 ? 3.3 : 2.65),
            y: () => (window.innerWidth < 768 ? '-12vh' : '-15vh'),
            borderRadius: '0px',
            borderWidth: '0px',
            boxShadow: 'none',
            duration: 0.8,
            ease: 'power2.out',
          },
          0,
        )
        // Cinematic backdrop overlay for crystal clear typography on full screen image
        .to(
          imageOverlayRef.current,
          {
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
          },
          0.2,
        )
        // Direct connection: Next text section smoothly comes on screen over the full screen image
        .fromTo(
          introSection,
          {
            yPercent: 110,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
          },
          0.3,
        )
        .fromTo(
          introTextRefs.current,
          {
            y: 25,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.45,
        );

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(introLayer, { autoAlpha: 0 });
        gsap.set([...lines, ...copy], { clearProps: 'all' });
        gsap.set(introSection, { opacity: 1, yPercent: 0 });
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

      tl.addLabel('title', `rise+=${INTRO.riseDuration - INTRO.titleLead}`).fromTo(
        lines,
        { yPercent: 105, y: 0 },
        {
          yPercent: 0,
          duration: INTRO.titleDuration,
          stagger: INTRO.titleStagger,
          ease: INTRO.titleEase,
        },
        'title',
      );

      tl.set(logo, { autoAlpha: 0 }, `rise+=${INTRO.riseDuration}`).set(target, { opacity: 1 }, '<');

      tl.addLabel('page', `rise+=${INTRO.riseDuration - INTRO.pageLead}`)
        .to(introLayer, { autoAlpha: 0, duration: INTRO.pageFade, ease: 'none' }, 'page')
        .fromTo(
          content.current,
          { y: INTRO.contentTravel, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: INTRO.contentDuration,
            stagger: INTRO.contentStagger,
            ease: INTRO.contentEase,
          },
          'page',
        )
        .fromTo(
          visual,
          { y: INTRO.imageTravel, opacity: 0 },
          { y: 0, opacity: 1, duration: INTRO.contentDuration, ease: INTRO.contentEase },
          'page',
        )
        .fromTo(
          copy,
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            duration: INTRO.contentDuration,
            stagger: INTRO.copyStagger,
            ease: INTRO.contentEase,
          },
          `page+=${INTRO.copyDelay}`,
        );

      return () => {
        zoomTl.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  const half = Math.ceil(links.length / 2);
  const handleLinkClick = (link: StudioLink) => {
    if (link.onClick) {
      link.onClick();
    } else if (onNavigate) {
      onNavigate('menu');
    }
  };

  const barLink = (link: StudioLink, i: number) => (
    <button
      key={link.label}
      type="button"
      ref={collectBarLink}
      data-flip-id={`link-${i}`}
      onClick={() => handleLinkClick(link)}
      className="group pointer-events-auto flex items-start gap-[0.6vw] opacity-0 will-change-[transform,opacity] text-[#21100B] hover:text-black cursor-pointer text-left"
    >
      <span
        className="mt-[0.2em] text-[0.36em] font-light tabular-nums text-[#32140D]/70"
        style={{ fontFamily: FONT_INDEX }}
      >
        {String(i + 1).padStart(2, '0')}
      </span>
      <RollingLabel text={link.label} />
    </button>
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

            {/* Visual: expands gracefully on scroll with strict aspect ratio */}
            <div className="z-30 justify-self-center flex items-center justify-center overflow-visible">
              <img
                ref={imageRef}
                src={image}
                alt="Artisanal Bakery Creation"
                className="h-[42vh] w-[38.4vw] max-md:h-[30vh] max-md:w-[86vw] aspect-[16/10] md:aspect-[4/3] rounded-2xl bg-[#e6e6e3] object-cover object-center shadow-2xl will-change-transform border border-[#32140D]/12"
              />
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
            className="pointer-events-none absolute inset-0 z-35 bg-gradient-to-t from-black/85 via-black/45 to-black/15 opacity-0 will-change-[opacity]"
          />

          {/* Connected Next Text Section (comes directly as text on full screen image, without box or border) */}
          <div
            ref={introSectionRef}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-40 px-[4vw] md:px-[6vw] grid gap-[3vw] md:grid-cols-2 items-end pointer-events-auto will-change-[transform,opacity]"
          >
            <div>
              <p className="flex items-center gap-[0.6vw] text-[1.15vw] max-md:gap-[2vw] max-md:text-[13px] text-amber-300 font-mono uppercase tracking-wider font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                <span className="size-[0.7vw] rounded-full bg-amber-400 max-md:size-[7px] animate-pulse drop-shadow" />
                <span ref={collectIntroText}>
                  {intro.label}
                </span>
              </p>
              <h2
                ref={collectIntroText}
                className="mt-[1.5vh] text-[2.5vw] font-serif font-black tracking-[-0.03em] max-md:text-[24px] text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              >
                {intro.heading}
              </h2>
            </div>
            <p
              ref={collectIntroText}
              className="text-[2.2vw] leading-[1.3] font-normal tracking-[-0.03em] max-md:text-[18px] text-white/95 font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] max-w-2xl"
            >
              {intro.lead}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
