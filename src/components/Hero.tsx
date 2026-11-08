import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ShoppingBag, Menu, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';
import BakeryAuroraBackground from './BakeryAuroraBackground';

export interface HeroProps {
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker') => void;
  onOpenOrderNow?: () => void;
  onOpenSidebar?: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  theme?: string;
}

export const DEFAULT_HERO_LINKS: { label: string; view: 'story' | 'menu' | 'find-us' | 'contact' | 'tracker' }[] = [
  { label: 'Complete Menu', view: 'menu' },
  { label: 'Our Story', view: 'story' },
  { label: '7 Branches', view: 'find-us' },
  { label: 'Contact', view: 'contact' },
  { label: 'Track Order', view: 'tracker' },
];

export default function Hero({
  onNavigate,
  onOpenOrderNow,
  onOpenSidebar,
  onOpenCart,
  cartCount = 0,
}: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Entrance animation matching component-024
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(
      ['.hero-nav__logo', '.hero-nav__menu'],
      {
        y: -16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.05,
        clearProps: 'transform,opacity',
      },
      0.2,
    )
      .from('.hero__badge', { y: 18, opacity: 0, duration: 0.7 }, 0.4)
      .from('.hero__line', { y: 44, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.5)
      .from('.hero__cta', { y: 20, opacity: 0, duration: 0.7 }, 0.85)
      .from(['.hero__desc', '.hero__trust'], { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.95);

    return () => {
      tl.kill();
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.95,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen min-h-svh w-full overflow-hidden bg-[#050505] text-[#F2F2F2] flex flex-col justify-between isolate select-none"
      aria-label="Muffinns Sweets & Bakers Hero"
    >
      {/* ========================================================================= */}
      {/* BACKDROP SCENE COPIED FROM COMPONENT-024 (WITH WARM BAKERY ADJUSTED COLORS) */}
      {/* ========================================================================= */}
      <BakeryAuroraBackground />

      {/* ========================================================================= */}
      {/* NAVBAR (COMPONENT-024 STRUCTURE WITH MUFFINNS CONTENT)                    */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex items-center justify-between gap-6 sm:gap-10 px-5 sm:px-8 lg:px-14 pt-4 sm:pt-6">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="hero-nav__logo flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          aria-label="Muffinns Sweets & Bakers Home"
        >
          <MuffinnsLogo size={34} animated={false} />
          <div>
            <span className="font-serif font-black text-xl sm:text-2xl text-white tracking-tight block leading-none group-hover:text-[#FF5E2B] transition-colors">
              Muffinns
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-[#FF9E7A] block mt-1">
              Sweets & Bakers
            </span>
          </div>
        </button>

        {/* Minimal Menu Trigger (All navigation, theme switching & bag inside drawer) */}
        <button
          type="button"
          onClick={() => (onOpenSidebar ? onOpenSidebar() : setMobileMenuOpen(true))}
          className="hero-nav__menu inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-xs uppercase font-bold tracking-widest text-[#F2F2F2] bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 focus:outline-none"
          aria-label="Open bakery menu"
        >
          <Menu className="w-4 h-4 text-[#FF5E2B]" />
          <span>Menu</span>
          {cartCount > 0 && (
            <span className="ml-1 rounded-full bg-[#FF5E2B] px-1.5 py-0.2 text-[10px] text-white font-bold tabular-nums">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-[#0A0706]/98 backdrop-blur-2xl z-50 p-6 flex flex-col justify-between border-t border-white/10 animate-in fade-in duration-200">
          <nav className="space-y-4 pt-4">
            {DEFAULT_HERO_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.view);
                }}
                className="block w-full text-left font-serif text-2xl font-bold text-white hover:text-[#FF5E2B] border-b border-white/10 pb-3 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-mono">
            <span>Muffinns Sweets & Bakers</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-1.5 bg-white/10 rounded-full text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERO CONTENT (COMPONENT-024 LAYOUT STRUCTURE)                             */}
      {/* ========================================================================= */}
      <div
        ref={contentRef}
        className="relative z-20 px-5 sm:px-8 lg:px-14 pt-8 sm:pt-14 md:pt-16 max-w-4xl"
      >
        {/* Pill Badge */}
        <div className="hero__badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.09] backdrop-blur-md font-mono text-[11px] sm:text-[11.5px] tracking-[0.03em] text-[#DCDCDC] shadow-sm">
          <Sparkles className="w-3 h-3 text-[#FF5E2B] animate-pulse" />
          <span>EST. 1988 · WHERE TRADITION MEETS FLAVOR</span>
        </div>

        {/* Hero Title Lines */}
        <h1 className="hero__title mt-5 sm:mt-6 font-serif font-light text-[clamp(36px,5.8vw,72px)] leading-[1.08] tracking-[-0.025em] text-[#F6F4FF]">
          <span className="hero__line block">Fresh &amp; Sweet,</span>
          <span className="hero__line block">Baked For You</span>
          <span className="hero__line block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF5E2B] to-[#F7B267] font-normal">
            Every Single Morning.
          </span>
        </h1>

        {/* Primary CTA Button */}
        <div className="hero__cta mt-7 sm:mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => (onOpenOrderNow ? onOpenOrderNow() : onNavigate('menu'))}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-mono text-xs uppercase font-bold tracking-[0.08em] text-[#141414] bg-gradient-to-b from-[#FFFFFF] to-[#D4D4D4] border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_28px_rgba(0,0,0,0.5)] hover:brightness-105 active:scale-95 transition-all cursor-pointer group"
          >
            <span>Explore Fresh Bakes</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onNavigate('story')}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-[0.08em] text-[#E0E0E0] hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            Our 1988 Story →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM STRIP (COMPONENT-024 FOOTER STRUCTURE)                             */}
      {/* ========================================================================= */}
      <div className="hero__footer relative z-20 mt-auto px-5 sm:px-8 lg:px-14 pb-8 sm:pb-10 pt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left Side: Artisanal Description */}
        <p className="hero__desc max-w-md text-[13.5px] sm:text-[14.5px] font-normal leading-[1.6] text-[#CFCFCF] drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)]">
          “Crafted to Crave, Baked to Delight.” Generational mother recipes, stone deck ovens fired at dawn, and royal desi ghee sweets across Bahawalpur.
        </p>

        {/* Right Side: Trust strip with overlapping patron avatars */}
        <div className="hero__trust flex items-center gap-3">
          <div className="flex -space-x-2">
            <span
              className="w-[26px] h-[26px] rounded-full border-2 border-[#0A0A0A] shadow-sm"
              style={{
                background:
                  'radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.55), transparent 45%), #FF5E2B',
              }}
            />
            <span
              className="w-[26px] h-[26px] rounded-full border-2 border-[#0A0A0A] shadow-sm"
              style={{
                background:
                  'radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.55), transparent 45%), #F7B267',
              }}
            />
            <span
              className="w-[26px] h-[26px] rounded-full border-2 border-[#0A0A0A] shadow-sm"
              style={{
                background:
                  'radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.55), transparent 45%), #8E280E',
              }}
            />
            <span
              className="w-[26px] h-[26px] rounded-full border-2 border-[#0A0A0A] shadow-sm"
              style={{
                background:
                  'radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.55), transparent 45%), #FFD166',
              }}
            />
          </div>
          <span className="font-mono text-[11px] sm:text-[11.5px] tracking-[0.02em] text-[#D6D6D6]">
            Trusted by 40k+ patrons across Bahawalpur.
          </span>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 hidden lg:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-white/40 hover:text-[#FF5E2B] transition-colors cursor-pointer"
        aria-label="Scroll to discover bakery collections"
      >
        <span>Scroll to Explore</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#FF5E2B]" />
      </button>
    </section>
  );
}
