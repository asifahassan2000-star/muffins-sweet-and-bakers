import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Phone, MapPin, Clock, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin';
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin') => void;
  onOpenCart?: () => void;
  cartCount?: number;
}

export default function NavigationSidebar({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  onOpenCart,
  cartCount = 0
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

  const navItems: { label: string; view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin'; num: string; desc: string }[] = [
    { label: 'Home', view: 'home', num: '01', desc: 'Editorial overview & featured bakes' },
    { label: 'Our Story', view: 'story', num: '02', desc: 'Heritage, artisan craft & recipes' },
    { label: 'Complete Menu', view: 'menu', num: '03', desc: 'Full catalogue of cakes, mithai & muffins' },
    { label: 'Contact & Inquiries', view: 'contact', num: '04', desc: 'Custom orders, catering & feedback' },
    { label: 'Find Us / Branches', view: 'find-us', num: '05', desc: '7 locations across Bahawalpur' },
    { label: 'Theme Studio', view: 'theme-studio', num: '06', desc: 'Luxury Atelier & Galaxy Muffins editions' },
    { label: 'Track Your Order', view: 'tracker', num: '07', desc: 'Live kitchen & delivery status' },
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
            <div className="px-6 sm:px-8 py-6 space-y-2 flex-1">
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-caramel/70 mb-4">
                Directory
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
                      className={`w-full group text-left px-3 py-3 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
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
                          <span className="font-serif text-lg sm:text-xl font-normal block leading-tight">
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

              {/* Order Now Callout */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    onNavigate('menu');
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 bg-brand-caramel hover:bg-brand-chocolate text-brand-cream transition-colors font-sans text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs rounded-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Now · Fresh Delivery</span>
                </button>
              </div>

              {/* Admin Portal subtle link */}
              <div className="pt-3">
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
