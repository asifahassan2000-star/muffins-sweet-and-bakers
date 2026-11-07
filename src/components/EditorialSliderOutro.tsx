import React from 'react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface EditorialSliderOutroProps {
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker') => void;
}

export default function EditorialSliderOutro({ onNavigate }: EditorialSliderOutroProps) {
  return (
    <section 
      id="curated-menu-intro"
      className="relative w-full bg-brand-cream text-brand-chocolate py-24 sm:py-32 md:py-40 px-6 lg:px-12 border-t border-b border-brand-caramel/15 scroll-mt-20 overflow-hidden"
      aria-label="Curated Bakehouse Menu Introduction"
    >
      <div className="relative max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
        
        {/* Kicker Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-caramel/10 border border-brand-caramel/25 text-brand-caramel text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand-honey" />
          <span>Curated Bakehouse Signatures</span>
          <span>·</span>
          <span>Daily Fresh Batches</span>
        </div>

        {/* Large Editorial Title */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-brand-chocolate tracking-tight leading-[1.12]">
          From morning ovens to your family table.
        </h2>

        {/* Descriptive Text */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-brand-chocolate/80 leading-relaxed font-sans font-normal">
          Every item in our collection is prepared using time-honored traditions. Explore our most popular artisanal bakehouse items below, crafted daily across all 7 Bahawalpur branches.
        </p>

        {/* Clean Action Links */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-caramel text-brand-cream hover:bg-brand-honey transition-all duration-300 font-mono text-xs uppercase tracking-widest font-bold rounded-xs shadow-md cursor-pointer group"
          >
            <span>Browse All 8 Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onNavigate('find-us')}
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-brand-caramel/30 text-brand-chocolate hover:bg-brand-caramel/10 transition-colors font-mono text-xs uppercase tracking-widest font-bold rounded-xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-caramel" />
            <span>Find 7 Bahawalpur Branches</span>
          </button>
        </div>

      </div>
    </section>
  );
}
