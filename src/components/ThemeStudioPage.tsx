import React from 'react';
import { Check, Sparkles, Palette, ArrowRight } from 'lucide-react';

interface ThemeStudioPageProps {
  currentTheme: string;
  onSelectTheme: (theme: any) => void;
  onNavigateHome: () => void;
}

interface ThemeOption {
  id: string;
  name: string;
  tagline: string;
  isFlagship?: boolean;
  colors: {
    bg: string;
    card: string;
    text: string;
    accent: string;
    secondary: string;
  };
}

const THEMES: ThemeOption[] = [
  {
    id: 'muffin_galaxy',
    name: 'Muffin Galaxy 🪐',
    tagline: 'Deep space purple cosmic canvas with muffin-orange glow and golden stardust crumble accents.',
    isFlagship: true,
    colors: {
      bg: '#1A1423',
      card: '#2A1B3D',
      text: '#FFF8F0',
      accent: '#F4A261',
      secondary: '#E9C46A'
    }
  },
  {
    id: 'classic',
    name: 'Classic Honey',
    tagline: 'Warm cream, honey amber, and rich espresso. The signature Muffinns editorial identity.',
    isFlagship: true,
    colors: {
      bg: '#F7F0E5',
      card: '#FCFAF6',
      text: '#291812',
      accent: '#D99A38',
      secondary: '#60402F'
    }
  },
  {
    id: 'espresso',
    name: 'Midnight Espresso',
    tagline: 'Deep dark roasted cocoa canvas with warm caramel drizzle and milky foam highlights.',
    isFlagship: true,
    colors: {
      bg: '#14110F',
      card: '#1E1916',
      text: '#FAF0E6',
      accent: '#D99A38',
      secondary: '#E9B96B'
    }
  },
  {
    id: 'velvet',
    name: 'Royal Velvet',
    tagline: 'Deep plum, rich berry cocoa, and subtle rose-gold accents for celebratory evenings.',
    colors: {
      bg: '#FCF4F6',
      card: '#FFF9FA',
      text: '#400B1A',
      accent: '#801832',
      secondary: '#DCAE9E'
    }
  },
  {
    id: 'pistachio',
    name: 'Forest Sage & Pistachio',
    tagline: 'Herbal botanic sage, cream pistachio green, and dark forest mocha chocolate.',
    colors: {
      bg: '#F1F6F0',
      card: '#FAFCFA',
      text: '#12301A',
      accent: '#2D5F39',
      secondary: '#94C475'
    }
  },
  {
    id: 'cozy_brown',
    name: 'Roasted Hazelnut',
    tagline: 'Earthy toasted hazelnut, warm cinnamon, and creamy milk chocolate warmth.',
    colors: {
      bg: '#F4ECE1',
      card: '#FAF5EE',
      text: '#2E1A0F',
      accent: '#6B3E26',
      secondary: '#B87333'
    }
  },
  {
    id: 'sprinkle_noir',
    name: 'Sprinkle Noir',
    tagline: 'Ultra-dark luxury midnight blue canvas infused with 24k golden speckles.',
    colors: {
      bg: '#141423',
      card: '#1A1A2E',
      text: '#F5F5F7',
      accent: '#EAB543',
      secondary: '#C4C4C4'
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
            Customize the bakery storefront to match your ambient mood. Explore our flagship <strong>Classic Honey</strong> or immerse yourself in dark luxury with <strong>Midnight Espresso</strong>.
          </p>
        </div>

        {/* Theme Swatch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {THEMES.map((th) => {
            const isSelected = currentTheme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => onSelectTheme(th.id)}
                className={`p-6 sm:p-8 rounded-xs border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-chocolate shadow-md bg-brand-sugar ring-1 ring-brand-chocolate/20'
                    : 'border-brand-caramel/15 bg-brand-sugar/80 hover:bg-brand-sugar hover:border-brand-caramel/40'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-brand-chocolate text-brand-cream text-[11px] uppercase tracking-wider font-semibold rounded-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Theme</span>
                  </div>
                )}

                <div className="space-y-4">
                  {th.isFlagship && (
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-caramel">
                      Flagship Direction
                    </span>
                  )}

                  <h3 className="font-serif text-2xl text-brand-chocolate font-normal">
                    {th.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-chocolate/75 leading-relaxed">
                    {th.tagline}
                  </p>
                </div>

                {/* Color Swatch Bar */}
                <div className="pt-6 border-t border-brand-caramel/10 mt-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-brand-chocolate/50 block">
                    Palette Breakdown
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xs border border-black/10 shadow-inner"
                      style={{ backgroundColor: th.colors.bg }}
                      title={`Canvas: ${th.colors.bg}`}
                    />
                    <div
                      className="w-8 h-8 rounded-xs border border-black/10 shadow-inner"
                      style={{ backgroundColor: th.colors.card }}
                      title={`Surface: ${th.colors.card}`}
                    />
                    <div
                      className="w-8 h-8 rounded-xs border border-black/10 shadow-inner"
                      style={{ backgroundColor: th.colors.text }}
                      title={`Primary Text: ${th.colors.text}`}
                    />
                    <div
                      className="w-8 h-8 rounded-xs border border-black/10 shadow-inner"
                      style={{ backgroundColor: th.colors.accent }}
                      title={`Accent: ${th.colors.accent}`}
                    />
                    <div
                      className="w-8 h-8 rounded-xs border border-black/10 shadow-inner"
                      style={{ backgroundColor: th.colors.secondary }}
                      title={`Secondary: ${th.colors.secondary}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Home CTA */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-chocolate text-brand-cream hover:bg-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs shadow-xs cursor-pointer"
          >
            <span>Return to Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
