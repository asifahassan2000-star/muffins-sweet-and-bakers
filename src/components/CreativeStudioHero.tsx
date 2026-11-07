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
}: {
  lines: string[];
  register: (el: HTMLElement | null) => void;
}) {
  return lines.map((line) => (
    <span key={line} className="block overflow-hidden">
      <span
        ref={register}
        className="block will-change-transform [backface-visibility:hidden]"
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
  const introSectionRef = useRef<HTMLElement>(null);
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

      // Scroll timeline: Image grows cleanly to width on scroll
      gsap
        .timeline({
          scrollTrigger: {
            trigger: row,
            start: () => `top ${(row.offsetTop / stage.offsetHeight) * 100}%`,
            end: `top ${SCROLL.endAt}`,
            scrub: SCROLL.scrub,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'none' },
        })
        .to(
          visual,
          {
            width: () => {
              const cs = getComputedStyle(header);
              return header.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            },
            height: SCROLL.endHeight,
            duration: 1,
          },
          0,
        )
        .to(copyRefs.current, { opacity: 0, duration: SCROLL.fadeLength }, SCROLL.fadeAt);

      // Sticky header transitions on scroll
      const nav = navRef.current;
      const strip = stripRef.current;
      const barLogo = barLogoRef.current;
      const compact = window.matchMedia('(max-width: 767px)').matches;

      if (nav && strip && barLogo) {
        const from = (i: number) => {
          const hero = heroLinks.current[i];
          const slot = barLinks.current[i];
          if (!hero || !slot) return { x: 0, y: 0, scaleX: 1, scaleY: 1 };
          const heroY = hero.offsetTop + hero.offsetHeight / 2 + window.innerHeight * HEADER.startAt;
          return {
            x: nav.offsetLeft + hero.offsetLeft + hero.offsetWidth / 2 - (slot.offsetLeft + slot.offsetWidth / 2),
            y: heroY - (slot.offsetTop + slot.offsetHeight / 2),
            scaleX: hero.offsetWidth / slot.offsetWidth,
            scaleY: hero.offsetHeight / slot.offsetHeight,
          };
        };

        let shown = false;
        const headerTl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: compact ? row : nav,
            start: `top ${HEADER.startAt * 100}%`,
            end: 'top top',
            scrub: HEADER.scrub,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const show = self.progress > 0;
              if (show === shown || compact) return;
              shown = show;
              gsap.set(heroLinks.current, { autoAlpha: show ? 0 : 1 });
              gsap.set(barLinks.current, { autoAlpha: show ? 1 : 0 });
            },
          },
        });

        if (!compact) {
          barLinks.current.forEach((link, i) =>
            headerTl.fromTo(
              link,
              {
                x: () => from(i).x,
                y: () => from(i).y,
                scaleX: () => from(i).scaleX,
                scaleY: () => from(i).scaleY,
              },
              { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1 },
              0,
            ),
          );
        }

        headerTl
          .fromTo(strip, { yPercent: -100, y: 0 }, { yPercent: 0, duration: 1 - HEADER.stripAt }, HEADER.stripAt)
          .fromTo(barLogo, { yPercent: -110, y: 0 }, { yPercent: 0, duration: 1 - HEADER.logoAt }, HEADER.logoAt);
      }

      // Intro text reveal
      const split = SplitText.create(introTextRefs.current, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'will-change-transform [backface-visibility:hidden]',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: SCROLL.revealDuration,
            stagger: SCROLL.revealStagger,
            ease: SCROLL.revealEase,
            scrollTrigger: { trigger: introSection, start: SCROLL.revealStart, once: true },
          }),
      });

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(introLayer, { autoAlpha: 0 });
        gsap.set([...lines, ...copy], { clearProps: 'all' });
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
        split.revert();
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
      className="relative z-10 w-full bg-[#fdfbf9] text-[#21100B] my-16 sm:my-28 [--slot:var(--slot-desktop)] max-md:[--slot:var(--slot-phone)] border-t border-[#32140D]/10"
      style={
        {
          fontFamily: FONT,
          '--slot-desktop': `${SCROLL.slotTop}vh`,
          '--slot-phone': `${SCROLL.slotTopPhone}vh`,
        } as React.CSSProperties
      }
    >
      {/* Sticky header */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 text-[1.7vw] leading-none font-medium tracking-[-0.03em] max-md:text-[16px] text-[#21100B]">
        <div
          ref={stripRef}
          className="absolute inset-0 bg-[#fdfbf9]/95 backdrop-blur-md border-b border-[#32140D]/10 will-change-transform"
          style={{ transform: 'translateY(-100%)' }}
        />
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-[4vw] py-[1.8vh] max-md:py-[2.4vh] md:px-[2.4vw]">
          <nav className="hidden gap-[3.2vw] md:flex">{links.slice(0, half).map(barLink)}</nav>
          <span className="block overflow-hidden">
            <button
              type="button"
              ref={barLogoRef}
              onClick={() => onNavigate && onNavigate('home')}
              className="pointer-events-auto block text-[2.6vw] font-black tracking-[-0.03em] will-change-transform max-md:text-[28px] text-[#21100B] cursor-pointer"
              style={{ ...LOGO_STYLE, transform: 'translateY(-110%)' }}
            >
              {brand}
            </button>
          </span>
          <nav className="hidden justify-end gap-[3.2vw] md:flex">
            {links.slice(half).map((link, i) => barLink(link, half + i))}
          </nav>
          <button
            type="button"
            ref={collect}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="pointer-events-auto col-start-3 flex h-[28px] w-[28px] flex-col items-end justify-center gap-[6px] justify-self-end md:hidden text-[#21100B]"
          >
            <span className="block h-[1.5px] w-[24px] bg-current" />
            <span className="block h-[1.5px] w-[16px] bg-current" />
          </button>
        </div>
      </div>

      {/* Phone menu sheet */}
      <div
        ref={menuRef}
        className="invisible fixed inset-0 z-50 flex flex-col bg-[#21100B] px-[4vw] pt-[2.4vh] pb-[6vh] text-[#faf6f2] will-change-[clip-path] md:hidden"
        aria-hidden={!menuOpen}
      >
        <div ref={collectMenuItem} className="grid grid-cols-[1fr_auto_1fr] items-center">
          <span
            className="col-start-2 text-[28px] leading-none font-black tracking-[-0.03em] text-[#faf6f2]"
            style={LOGO_STYLE}
          >
            {brand}
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="relative col-start-3 h-[28px] w-[28px] justify-self-end text-white cursor-pointer"
          >
            <span className="absolute top-1/2 left-1/2 h-[1.5px] w-[24px] -translate-1/2 rotate-45 bg-current" />
            <span className="absolute top-1/2 left-1/2 h-[1.5px] w-[24px] -translate-1/2 -rotate-45 bg-current" />
          </button>
        </div>
        <nav className="mt-auto flex flex-col gap-[2.2vh] text-[11vw] leading-none font-medium tracking-[-0.03em]">
          {links.map((link, i) => (
            <button
              key={link.label}
              type="button"
              ref={collectMenuItem}
              onClick={() => {
                setMenuOpen(false);
                handleLinkClick(link);
              }}
              className="flex items-start gap-[2vw] text-left text-[#faf6f2] hover:text-amber-200 cursor-pointer"
            >
              <span
                className="mt-[0.25em] text-[0.32em] font-light tabular-nums text-stone-400"
                style={{ fontFamily: FONT_INDEX }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {link.label}
            </button>
          ))}
        </nav>
        <p ref={collectMenuItem} className="mt-[5vh] text-[12px] leading-[1.4] text-stone-400">
          {location.lead} {location.place}
          <br />
          {tagline[0]} · {tagline[1]}
        </p>
      </div>

      {/* Main Hero Viewport Section */}
      <section
        className="relative overflow-hidden"
        style={{
          height: `calc(var(--slot) + ${SCROLL.endHeight} + ${SCROLL.gap})`,
        }}
      >
        <div ref={stageRef} className="relative h-svh">
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

          {/* Top bar */}
          <header
            ref={headerRef}
            className="grid grid-cols-[1fr_auto_1fr] items-start px-[4vw] pt-[2.4vh] text-[1.15vw] leading-[1.2] font-normal max-md:items-center max-md:gap-[3vw] max-md:text-[10px] max-md:leading-[1.3] md:px-[2.4vw] md:pt-[3.2vh] text-[#21100B]"
          >
            <p ref={collect} className="will-change-[transform,opacity]">
              {location.lead}{' '}
              <span className="underline underline-offset-[0.2em] decoration-1 font-semibold">
                {location.place}
              </span>
              <span className="max-md:hidden text-[#32140D]/75">
                <br />
                {location.line2}
              </span>
            </p>
            <button
              type="button"
              ref={headerLogoRef}
              onClick={() => onNavigate && onNavigate('home')}
              className="relative z-30 text-[2.9vw] leading-none font-black tracking-[-0.03em] max-md:text-[28px] text-[#21100B] cursor-pointer"
              style={LOGO_STYLE}
            >
              {brand}
            </button>
            <p ref={collect} className="text-right will-change-[transform,opacity] max-md:hidden text-[#32140D]/75">
              {tagline[0]}
              <br />
              {tagline[1]}
            </p>
          </header>

          {/* Headline — Deep Dark Brown & Black, Bold Minimal Presence */}
          <h1 className="relative z-20 mt-[6vh] text-center text-[12.5vw] leading-[0.86] md:mt-[10vh] md:text-[9.6vw] font-black tracking-[-0.075em] uppercase text-[#21100B]">
            <MaskedLines lines={title} register={collectTitle} />
          </h1>

          {/* Tagline on phones */}
          <p
            ref={collect}
            className="mt-[3.5vh] text-center text-[12px] leading-[1.35] will-change-[transform,opacity] md:hidden text-[#32140D]/80"
          >
            {tagline[0]}
            <br />
            {tagline[1]}
          </p>

          {/* Nav */}
          <nav
            ref={navRef}
            className="absolute inset-x-0 top-[62vh] flex items-baseline justify-between px-[3vw] text-[2.4vw] leading-none font-medium tracking-[-0.03em] max-md:hidden text-[#21100B]"
          >
            {links.map((link, i) => (
              <button
                key={link.label}
                type="button"
                ref={collectHeroLink}
                data-flip-id={`link-${i}`}
                onClick={() => handleLinkClick(link)}
                className="group flex items-start gap-[0.9vw] will-change-[transform,opacity] hover:text-black transition-colors cursor-pointer text-left"
              >
                <span
                  className="mt-[0.25em] text-[0.36em] font-light tabular-nums text-[#32140D]/60"
                  style={{ fontFamily: FONT_INDEX }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <RollingLabel text={link.label} />
              </button>
            ))}
          </nav>

          {/* Bottom row: copy | visual | copy */}
          <div
            ref={rowRef}
            className="absolute inset-x-0 grid grid-cols-[1fr_38.4vw_1fr] items-start max-md:grid-cols-[1fr_84vw_1fr]"
            style={{ top: 'var(--slot)' }}
          >
            <p
              ref={(el) => {
                if (el) copyRefs.current[0] = el;
              }}
              className="mx-auto text-center text-[1.35vw] leading-relaxed font-light tracking-[-0.03em] will-change-[opacity] max-md:hidden text-[#32140D]"
            >
              <MaskedLines lines={leftCopy} register={collectCopy} />
            </p>

            {/* Visual: expands on scroll */}
            <div className="z-30 col-start-2 justify-self-center max-md:w-[84vw]">
              <img
                ref={imageRef}
                src={image}
                alt="Artisanal Bakery Creation"
                className="h-[45vh] w-[38.4vw] max-w-none rounded-2xl bg-[#e6e6e3] object-cover shadow-2xl will-change-[transform,width,height] border border-[#32140D]/10"
              />
            </div>

            <p
              ref={(el) => {
                if (el) copyRefs.current[1] = el;
              }}
              className="mx-auto text-center text-[1.35vw] leading-relaxed font-light tracking-[-0.03em] will-change-[opacity] max-md:hidden text-[#32140D]"
            >
              <MaskedLines lines={rightCopy} register={collectCopy} />
            </p>
          </div>
        </div>
      </section>

      {/* Intro statement section */}
      <section
        ref={introSectionRef}
        className="grid gap-[4vw] px-[4vw] md:grid-cols-2 md:px-[2.4vw] pt-12 sm:pt-20"
        style={{ paddingBottom: SCROLL.gap }}
      >
        <div>
          <p className="flex items-center gap-[0.6vw] text-[1.15vw] text-[#32140D]/70 max-md:gap-[2vw] max-md:text-[12px] font-mono uppercase tracking-wider">
            <span className="size-[0.7vw] rounded-full bg-[#21100B] max-md:size-[7px]" />
            <span ref={collectIntroText} className="block font-bold">
              {intro.label}
            </span>
          </p>
          <h2
            ref={collectIntroText}
            className="mt-[1.5vh] text-[2.2vw] font-serif font-black tracking-[-0.03em] max-md:text-[22px] text-[#21100B]"
          >
            {intro.heading}
          </h2>
        </div>
        <p
          ref={collectIntroText}
          className="text-[2.4vw] leading-[1.25] font-normal tracking-[-0.03em] max-md:text-[20px] text-[#21100B]/90 font-serif"
        >
          {intro.lead}
        </p>
      </section>
    </div>
  );
}
