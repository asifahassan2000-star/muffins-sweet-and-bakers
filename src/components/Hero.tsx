import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';
import { AppView } from '../App';

export interface HeroProps {
  onNavigate: (view: AppView) => void;
  onOpenOrderNow?: () => void;
  onOpenSidebar?: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
}

export default function Hero({
  onNavigate,
  onOpenOrderNow,
  onOpenSidebar,
  onOpenCart,
  cartCount = 0,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge-tag', {
        opacity: 0,
        y: 12,
        duration: 0.6,
      })
      .from('.hero-headline-item', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.12,
      }, '-=0.3')
      .from('.hero-description', {
        opacity: 0,
        y: 16,
        duration: 0.6,
      }, '-=0.4')
      .from('.hero-actions-wrap', {
        opacity: 0,
        y: 16,
        duration: 0.6,
      }, '-=0.4')
      .from(visualRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 1,
      }, '-=0.7');
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-[#FAF7F2] text-[#21100B] overflow-hidden pt-6 pb-20 md:pb-28"
      aria-label="Muffins Sweets & Bakers Hero"
    >
      {/* Subtle Warm Ambient Glow */}
      <div 
        className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#E8B896]/15 rounded-full blur-[120px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#D25027]/8 rounded-full blur-[140px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left cursor-pointer group focus:outline-none"
          aria-label="Muffins Sweets & Bakers Home"
        >
          <MuffinnsLogo size={52} showWordmark={true} />
        </button>

        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#5C4A3E]">
            <button onClick={() => onNavigate('story')} className="hover:text-[#D25027] transition-colors cursor-pointer">
              Our Story
            </button>
            <button onClick={() => onNavigate('menu')} className="hover:text-[#D25027] transition-colors cursor-pointer">
              Full Menu
            </button>
            <button onClick={() => onNavigate('find-us')} className="hover:text-[#D25027] transition-colors cursor-pointer">
              7 Branches
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#D25027] transition-colors cursor-pointer">
              Contact
            </button>
            <button onClick={() => onNavigate('tracker')} className="hover:text-[#D25027] transition-colors cursor-pointer">
              Track Order
            </button>
          </nav>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#21100B]/10 hover:border-[#D25027]/40 text-[#21100B] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            aria-label={`Shopping Bag (${cartCount})`}
          >
            <ShoppingBag className="w-4 h-4 text-[#D25027]" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D25027] text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            <div className="hero-badge-tag inline-block">
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#D25027] block">
                Since 1988 · Bahawalpur, Punjab
              </span>
            </div>

            <h1 
              ref={titleRef}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.015em] text-[#21100B]"
            >
              <span className="hero-headline-item block">Generational Mastery,</span>
              <span className="hero-headline-item block font-semibold text-[#D25027] italic">
                Baked Fresh Daily.
              </span>
            </h1>

            <p className="hero-description text-[#5C4A3E] text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              From pure desi ghee royal patashay and signature golden muffins to artisan sourdough and bespoke celebration cakes — crafted with stone deck ovens fired every single dawn.
            </p>

            {/* Action Buttons */}
            <div className="hero-actions-wrap flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => (onOpenOrderNow ? onOpenOrderNow() : onNavigate('menu'))}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#D25027] hover:bg-[#B8401C] text-white font-medium text-sm transition-all shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span>Explore Bakery Menu</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('story')}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white hover:bg-[#F4EFE6] border border-[#21100B]/12 text-[#21100B] font-medium text-sm transition-colors cursor-pointer"
              >
                Our 1988 Heritage
              </button>
            </div>

            {/* Reassuring Brand Indicators without fake icons */}
            <div className="pt-6 border-t border-[#21100B]/8 flex flex-wrap gap-x-8 gap-y-3 text-xs text-[#6E5D52]">
              <div>
                <span className="font-semibold text-[#21100B] block text-sm">7 Branches</span>
                <span>Across Bahawalpur City</span>
              </div>
              <div className="w-px h-8 bg-[#21100B]/10 hidden sm:block" />
              <div>
                <span className="font-semibold text-[#21100B] block text-sm">100% Desi Ghee</span>
                <span>Authentic Traditional Mithai</span>
              </div>
              <div className="w-px h-8 bg-[#21100B]/10 hidden sm:block" />
              <div>
                <span className="font-semibold text-[#21100B] block text-sm">Daily Fresh Batches</span>
                <span>Early Morning 6:00 AM Ovens</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div ref={visualRef} className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Featured Card */}
              <div className="artisan-card overflow-hidden rounded-2xl bg-white p-3 sm:p-4 shadow-md">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F4EFE6]">
                  <img
                    src="/assets/images/muffinns_patashay_sweets_1784645566064.jpg"
                    alt="Muffins Sweets Royal Patashay"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#21100B]/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[11px] font-medium">
                    Signature Mithai
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#21100B] font-semibold">
                      Royal Patashay &amp; Pure Desi Ghee Sweets
                    </h3>
                    <p className="text-xs text-[#6E5D52] mt-0.5">
                      Handcrafted with generational recipe passed down through decades
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('menu')}
                    className="shrink-0 px-4 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#D25027] hover:text-white border border-[#21100B]/10 text-xs font-semibold text-[#21100B] transition-colors cursor-pointer"
                  >
                    View Item
                  </button>
                </div>
              </div>

              {/* Floating Second Card Accent */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 bg-white p-3.5 rounded-xl shadow-lg border border-[#21100B]/8 max-w-xs">
                <img
                  src="/assets/images/special_artisan_bread_1786872969815.jpg"
                  alt="Artisan Sourdough Loaf"
                  className="w-14 h-14 rounded-lg object-cover bg-[#F4EFE6] shrink-0"
                />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#21100B] leading-tight">
                    Artisan Crust Breads
                  </h4>
                  <p className="text-[11px] text-[#6E5D52] mt-0.5">
                    Slow-fermented &amp; stone deck baked
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
