import React from 'react';
import { Check, Sparkles, Palette, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface ThemeStudioPageProps {
  currentTheme: string;
  onSelectTheme: (theme: any) => void;
  onNavigateHome: () => void;
}

interface ThemeOption {
  id: string;
  name: string;
  edition: string;
  tagline: string;
  description: string;
  isFlagship?: boolean;
  colors: {
    bg: string;
    card: string;
    text: string;
    accent: string;
    secondary: string;
    amber: string;
  };
}

const THEMES: ThemeOption[] = [
  {
    id: 'luxury_main',
    name: 'Muffinns Luxury Atelier 👑',
    edition: 'World-Class Main Theme',
    tagline: 'Pure White canvas with Dark Chocolate, Deep Espresso, Burnt Orange accents & Warm Amber glow.',
    description: 'Designed in the visual language of high-end French patisseries. Architectural whitespace, deep chocolate typography, burnt orange callouts, and bespoke 3D confectionery showcase.',
    isFlagship: true,
    colors: {
      bg: '#FFFFFF',
      card: '#FCFAF8',
      text: '#32140D',
      accent: '#E94F16',
      secondary: '#21100B',
      amber: '#F4B34D'
    }
  },
  {
    id: 'muffin_galaxy',
    name: 'Muffin Galaxy 🪐',
    edition: 'Cosmic Night Edition',
    tagline: 'Deep space purple cosmic canvas with muffin-orange glow and golden stardust crumble accents.',
    description: 'An immersive celestial voyage into dark cosmic violet, illuminated with warm stardust orange glazes, nebula gradients, and floating asteroid particles.',
    isFlagship: false,
    colors: {
      bg: '#1A1423',
      card: '#2A1B3D',
      text: '#FFF8F0',
      accent: '#F4A261',
      secondary: '#E76F51',
      amber: '#E9C46A'
    }
  }
];

export default function ThemeStudioPage({
  currentTheme,
  onSelectTheme,
  onNavigateHome
}: ThemeStudioPageProps) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate py-12 sm:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Editorial Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium text-brand-caramel">
            <span>Visual Atmosphere</span>
            <span aria-hidden="true" className="text-brand-honey">·</span>
            <span>Theme Studio</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-brand-chocolate font-normal tracking-tight">
            Curate Your Aesthetic Experience.
          </h1>

          <p className="text-sm sm:text-base text-brand-chocolate/75 leading-relaxed font-sans">
            Choose between our world-class <strong>Luxury Atelier</strong> (Pure White, Dark Chocolate, Burnt Orange & Warm Amber) or immerse yourself in our starry <strong>Muffin Galaxy</strong>.
          </p>
        </div>

        {/* Theme Swatch Grid - Strictly the 2 selected themes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {THEMES.map((th) => {
            const isSelected = currentTheme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => onSelectTheme(th.id)}
                className={`p-6 sm:p-8 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-6 ${
                  isSelected
                    ? 'border-[#E94F16] shadow-xl bg-brand-sugar ring-2 ring-[#E94F16]/20'
                    : 'border-brand-caramel/15 bg-brand-sugar/80 hover:bg-brand-sugar hover:border-brand-caramel/40'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-[#E94F16] text-white text-[11px] uppercase tracking-wider font-bold rounded-full shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Edition</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-4 h-4 rounded-full border border-black/15 shrink-0" 
                      style={{ backgroundColor: th.colors.accent }} 
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-brand-honey font-bold block">
                        {th.edition}
                      </span>
                      <h3 className="font-serif text-2xl text-brand-chocolate font-bold">
                        {th.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-chocolate/80 leading-relaxed font-sans">
                    {th.tagline}
                  </p>

                  <p className="text-xs text-brand-chocolate/65 leading-relaxed pt-1">
                    {th.description}
                  </p>
                </div>

                {/* Color Palette Palette Visualization Bar */}
                <div className="space-y-3 pt-4 border-t border-brand-caramel/15">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-brand-chocolate/60 block">
                    Palette Swatches:
                  </span>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="text-center space-y-1">
                      <div className="h-8 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: th.colors.bg }} />
                      <span className="text-[9px] font-mono text-brand-chocolate/70">Canvas</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-8 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: th.colors.card }} />
                      <span className="text-[9px] font-mono text-brand-chocolate/70">Card</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-8 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: th.colors.text }} />
                      <span className="text-[9px] font-mono text-brand-chocolate/70">Type</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-8 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: th.colors.accent }} />
                      <span className="text-[9px] font-mono text-brand-chocolate/70">Accent</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-8 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: th.colors.secondary }} />
                      <span className="text-[9px] font-mono text-brand-chocolate/70">Dark</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-8 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: th.colors.amber }} />
                      <span className="text-[9px] font-mono text-brand-chocolate/70">Amber</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTheme(th.id);
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-chocolate text-brand-cream'
                      : 'bg-brand-caramel/15 hover:bg-brand-caramel hover:text-white text-brand-chocolate'
                  }`}
                >
                  {isSelected ? 'Currently Applied' : 'Activate Theme'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center pt-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-chocolate text-brand-cream text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors cursor-pointer shadow-md"
          >
            <span>Return to Bakery Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
