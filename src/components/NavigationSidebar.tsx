import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Phone, MapPin, Clock, ShieldCheck, Palette, ShoppingBag, Sparkles } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin';
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin') => void;
  onOpenCart?: () => void;
  cartCount?: number;
  currentTheme?: 'luxury_main' | 'muffin_galaxy' | string;
  onToggleTheme?: () => void;
}

export default function NavigationSidebar({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  onOpenCart,
  cartCount = 0,
  currentTheme = 'luxury_main',
  onToggleTheme,
}: NavigationSidebarProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Main menu destinations (no separate theme studio page)
  const navItems: {
    label: string;
    view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'tracker' | 'admin';
    num: string;
    desc: string;
  }[] = [
    { label: 'Home', view: 'home', num: '01', desc: 'Editorial overview & featured bakes' },
    { label: 'Complete Menu', view: 'menu', num: '02', desc: 'Full catalogue of cakes, mithai & muffins' },
    { label: 'Our Story', view: 'story', num: '03', desc: 'Heritage, artisan craft & recipes since 1988' },
    { label: 'Find Us / Branches', view: 'find-us', num: '04', desc: '7 locations across Bahawalpur' },
    { label: 'Contact & Inquiries', view: 'contact', num: '05', desc: 'Custom celebration cakes & catering' },
    { label: 'Track Your Order', view: 'tracker', num: '06', desc: 'Live kitchen & doorstep delivery status' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-brand-chocolate/40 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md h-full bg-brand-cream border-l border-brand-caramel/15 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between border-b border-brand-caramel/10">
              <div className="flex items-center gap-3">
                <MuffinnsLogo size={32} animated={false} />
                <div>
                  <span className="font-serif font-black text-xl text-brand-chocolate tracking-tight block leading-tight">
                    Muffinns
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-honey block">
                    Sweets & Bakers
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-brand-chocolate/60 hover:text-brand-chocolate hover:bg-brand-caramel/10 transition-colors rounded-xs cursor-pointer flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold"
                aria-label="Close navigation menu"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Destinations */}
            <div className="px-6 sm:px-8 py-6 space-y-3 flex-1">
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-caramel/70 mb-2">
                Main Menu
              </p>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        onNavigate(item.view);
                        onClose();
                      }}
                      className={`w-full group text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-brand-chocolate text-brand-cream'
                          : 'text-brand-chocolate hover:bg-brand-sugar'
                      }`}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className={`text-xs font-mono tabular-nums ${isActive ? 'text-brand-gold' : 'text-brand-caramel/60'}`}>
                          {item.num}
                        </span>
                        <div>
                          <span className="font-serif text-lg font-bold block leading-tight">
                            {item.label}
                          </span>
                          <span className={`text-[11px] block mt-0.5 ${isActive ? 'text-brand-cream/70' : 'text-brand-chocolate/60'}`}>
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${isActive ? 'text-brand-gold' : 'text-brand-chocolate/30'}`} />
                    </button>
                  );
                })}
              </div>

              {/* ========================================================================= */}
              {/* ONE BUTTON INSIDE MENU FOR CHANGING THEME (NO SEPARATE PAGE NEEDED)       */}
              {/* ========================================================================= */}
              <div className="pt-4 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleTheme) onToggleTheme();
                  }}
                  className="w-full p-3.5 rounded-xl border border-brand-caramel/25 bg-gradient-to-r from-brand-caramel/10 via-brand-caramel/5 to-transparent hover:border-brand-caramel/50 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                  aria-label="Toggle bakery theme between Luxury Atelier and Muffin Galaxy"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-caramel text-brand-cream flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-honey block">
                        Bakery Atmosphere
                      </span>
                      <span className="font-serif text-sm font-bold text-brand-chocolate block leading-tight">
                        {currentTheme === 'muffin_galaxy' ? 'Muffin Galaxy 🪐' : 'Luxury Atelier 👑'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-brand-caramel bg-brand-caramel/15 px-3 py-1 rounded-full group-hover:bg-brand-caramel group-hover:text-brand-cream transition-colors">
                    Change Theme
                  </span>
                </button>
              </div>

              {/* Shopping Bag Quick Access inside drawer */}
              {onOpenCart && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                    className="w-full py-3 px-4 bg-brand-cream hover:bg-brand-sugar border border-brand-caramel/20 text-brand-chocolate transition-colors font-sans text-xs uppercase tracking-wider font-bold flex items-center justify-between cursor-pointer rounded-xl shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-brand-caramel" />
                      <span>View Shopping Bag</span>
                    </span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-brand-caramel text-brand-cream font-bold">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                  </button>
                </div>
              )}

              {/* Order Now Callout */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onNavigate('menu');
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 bg-brand-caramel hover:bg-brand-chocolate text-brand-cream transition-colors font-sans text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs rounded-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Order Now · Fresh Delivery</span>
                </button>
              </div>

              {/* Admin Portal subtle link */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onNavigate('admin');
                    onClose();
                  }}
                  className="text-[11px] text-brand-chocolate/50 hover:text-brand-chocolate flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Staff / Back-Office Management</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer Information */}
            <div className="p-6 sm:p-8 border-t border-brand-caramel/10 bg-brand-sugar text-xs text-brand-chocolate/75 space-y-3">
              <div className="flex items-center gap-2 text-brand-chocolate">
                <Phone className="w-3.5 h-3.5 text-brand-caramel shrink-0" />
                <a href="tel:03026567774" className="font-mono font-medium hover:text-brand-caramel transition-colors">
                  0302 6567774
                </a>
                <span className="text-brand-caramel/30">|</span>
                <a href="tel:03326567774" className="font-mono font-medium hover:text-brand-caramel transition-colors">
                  0332 6567774
                </a>
              </div>

              <div className="flex items-start gap-2 text-brand-chocolate/70">
                <MapPin className="w-3.5 h-3.5 text-brand-caramel shrink-0 mt-0.5" />
                <span>Circular Road & Model Town, Bahawalpur, Punjab</span>
              </div>

              <div className="flex items-center gap-2 text-brand-chocolate/60 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-brand-caramel shrink-0" />
                <span>Open Daily: 08:00 AM – 12:00 AM</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
