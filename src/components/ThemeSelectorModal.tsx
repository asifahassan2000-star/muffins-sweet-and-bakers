import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, X, Sparkles, Wand2 } from 'lucide-react';

export interface ThemeOption {
  id: 'luxury_main' | 'muffin_galaxy';
  name: string;
  badge: string;
  desc: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  dots: string[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'luxury_main',
    name: 'Muffinns Luxury Atelier 👑',
    badge: 'Main Signature Luxury Theme',
    desc: 'Pure White canvas with Dark Chocolate (#32140D), Deep Espresso (#21100B), Burnt Orange (#E94F16) accents, Tangerine & Warm Amber glow.',
    bgColor: '#FFFFFF',
    accentColor: '#E94F16',
    textColor: '#32140D',
    dots: ['bg-[#32140D]', 'bg-[#21100B]', 'bg-[#E94F16]', 'bg-[#FF792B]', 'bg-[#F4B34D]']
  },
  {
    id: 'muffin_galaxy',
    name: 'Muffin Galaxy 🪐',
    badge: 'Cosmic Nebula & Stardust',
    desc: 'Deep cosmic purple canvas, stardust orange accents, floating asteroid particles and starry luminescence.',
    bgColor: '#1A1423',
    accentColor: '#F4A261',
    textColor: '#FFFFFF',
    dots: ['bg-[#2A1B3D]', 'bg-[#F4A261]', 'bg-[#E76F51]', 'bg-[#E9C46A]']
  }
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onSelectTheme: (themeId: any) => void;
}

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}: ThemeSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#32140D]/20 rounded-3xl shadow-2xl overflow-hidden text-[#32140D] my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#21100B] via-[#32140D] to-[#E94F16] p-5 sm:p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Palette className="w-6 h-6 text-[#F4B34D]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md text-white border border-white/20">
                  Visual Identity
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight mt-0.5">
                  Select Visual Theme
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between text-xs text-[#32140D]/70">
              <p>Curated to 2 bespoke editions: Main World-Class Luxury & Galaxy Muffins.</p>
              <span className="font-bold text-[#E94F16]">2 Signature Editions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEME_OPTIONS.map((th) => {
                const isSelected = currentTheme === th.id;
                return (
                  <motion.button
                    key={`theme-card-${th.id}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectTheme(th.id);
                      onClose();
                    }}
                    className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#E94F16] bg-[#FBF8F5] ring-2 ring-[#E94F16]/20 shadow-lg'
                        : 'border-[#32140D]/10 bg-white hover:border-[#32140D]/30 hover:bg-[#FBF8F5]/60'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#E94F16] text-white rounded-full text-[9px] font-black uppercase flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Active</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: th.accentColor }}
                        />
                        <h4 className="font-serif font-black text-base text-[#21100B] group-hover:text-[#E94F16] transition-colors">
                          {th.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-[#FF792B] uppercase tracking-wider block">
                        {th.badge}
                      </span>
                      <p className="text-xs text-[#32140D]/75 leading-relaxed font-sans">
                        {th.desc}
                      </p>
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#32140D]/10">
                      <div className="flex items-center gap-1.5">
                        {th.dots.map((dotClass, dIdx) => (
                          <span
                            key={`swatch-dot-${th.id}-${dIdx}`}
                            className={`w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs ${dotClass}`}
                          />
                        ))}
                      </div>

                      <span className="text-xs font-bold text-[#E94F16] group-hover:underline">
                        Apply &rarr;
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t border-[#32140D]/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#21100B] text-white text-xs font-bold hover:bg-[#32140D] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
