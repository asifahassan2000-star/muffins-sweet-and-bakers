import React from 'react';
import { ArrowDown, Sparkles, Clock, Heart, Award } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';

interface EditorialTextBridgeProps {
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker') => void;
}

export default function EditorialTextBridge({ onNavigate }: EditorialTextBridgeProps) {
  return (
    <section
      id="editorial-statement"
      className="relative w-full bg-brand-cream text-brand-chocolate py-28 sm:py-36 md:py-44 px-6 lg:px-12 scroll-mt-16 overflow-hidden border-b border-brand-caramel/15"
      aria-label="Bakery Philosophy and Heritage Statement"
    >
      {/* Subtle background ambient grain / glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-brand-caramel/10 via-transparent to-transparent opacity-70" />

      <div className="relative max-w-5xl mx-auto space-y-12 sm:space-y-16 text-center">
        
        {/* Kicker Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-sugar/80 border border-brand-caramel/25 text-brand-caramel text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-honey animate-pulse" />
          <span>The Art of Slow Baking · Bahawalpur</span>
          <span className="text-brand-honey">·</span>
          <span>Since 1988</span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight text-brand-chocolate max-w-4xl mx-auto">
          We begin before dawn so the city awakens to the aroma of pure butter, golden honey, and warm ovens.
        </h2>

        {/* Heartfelt Story Narrative Paragraph */}
        <div className="max-w-3xl mx-auto space-y-6 text-base sm:text-lg md:text-xl text-brand-chocolate/85 leading-relaxed font-sans font-normal">
          <p>
            For nearly four decades, <strong className="font-semibold text-brand-chocolate">Muffins – Sweets and Bakers</strong> has honored 
            the unhurried discipline of classical bakery craft in the heart of Bahawalpur. We believe that real bakery happiness cannot be rushed with artificial mixes or industrial shortcuts.
          </p>
          <p className="text-sm sm:text-base text-brand-chocolate/75 leading-relaxed">
            Every morning bread is naturally proofed, every signature golden honey muffin is baked in gentle stone decks, 
            and our heritage <span className="font-serif font-bold text-brand-caramel">Patashay Sweets (پتاشے)</span> are simmered exclusively in 100% pure desi ghee with cardamom and saffron. From intimate family breakfasts to grand wedding celebrations, our ovens have been part of Bahawalpur&apos;s fondest memories.
          </p>
        </div>

        {/* 3 Editorial Highlight Pillars with Generous Spacing */}
        <div className="pt-6 sm:pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto text-left">
          
          <div className="p-6 sm:p-7 rounded-sm bg-brand-sugar/60 border border-brand-caramel/20 space-y-3 transition-transform duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xs bg-brand-caramel/15 border border-brand-caramel/30 flex items-center justify-center text-brand-caramel">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-brand-chocolate tracking-tight">
              100% Pure Desi Ghee
            </h3>
            <p className="text-xs sm:text-sm text-brand-chocolate/75 leading-relaxed font-sans">
              Our traditional sweets and Patashay carry zero compromises—crafted purely with generational family recipes.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-sm bg-brand-sugar/60 border border-brand-caramel/20 space-y-3 transition-transform duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xs bg-brand-caramel/15 border border-brand-caramel/30 flex items-center justify-center text-brand-caramel">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-brand-chocolate tracking-tight">
              8:00 AM Fresh Oven Pulls
            </h3>
            <p className="text-xs sm:text-sm text-brand-chocolate/75 leading-relaxed font-sans">
              Warm crusts, butter croissants, and fresh muffins drop every morning across all 7 Bahawalpur branches.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-sm bg-brand-sugar/60 border border-brand-caramel/20 space-y-3 transition-transform duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xs bg-brand-caramel/15 border border-brand-caramel/30 flex items-center justify-center text-brand-caramel">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-brand-chocolate tracking-tight">
              38 Years of Heritage
            </h3>
            <p className="text-xs sm:text-sm text-brand-chocolate/75 leading-relaxed font-sans">
              Proudly baking for three generations of Bahawalpur families with pure ingredients and generous hospitality.
            </p>
          </div>

        </div>

        {/* Transition prompt leading into the Pinned Split-Screen Reel */}
        <div className="pt-8 sm:pt-12 flex flex-col items-center gap-2">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-brand-honey font-bold">
            Scroll into our 5 Visual Chapters
          </span>
          <div className="flex items-center gap-1.5 text-xs text-brand-caramel font-medium">
            <span>Discover the craft frame by frame</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  );
}
