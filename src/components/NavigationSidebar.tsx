import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ShoppingBag, Phone, MapPin, Clock } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';
import { AppView } from '../App';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCart?: () => void;
  cartCount?: number;
}

export default function NavigationSidebar({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  onOpenCart,
  cartCount = 0,
}: NavigationSidebarProps) {
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

  const navItems: {
    label: string;
    view: AppView;
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-[#21100B]/50 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md h-full bg-[#FAF7F2] border-l border-[#21100B]/10 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-6 flex items-center justify-between border-b border-[#21100B]/8 bg-white">
              <div className="flex items-center gap-3">
                <MuffinnsLogo size={40} showWordmark={true} />
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#21100B]/70 hover:text-[#21100B] hover:bg-[#FAF7F2] transition-colors rounded-lg cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Close navigation menu"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Destinations */}
            <div className="p-6 space-y-2 flex-1">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#D25027] block mb-3">
                Bakery Directory
              </span>

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
                      className={`w-full group text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#21100B] text-white shadow-sm'
                          : 'text-[#21100B] hover:bg-white border border-transparent hover:border-[#21100B]/6'
                      }`}
                    >
                      <div className="flex items-baseline gap-3.5">
                        <span className={`text-xs font-medium tabular-nums ${isActive ? 'text-[#D25027]' : 'text-[#8C7A6B]'}`}>
                          {item.num}
                        </span>
                        <div>
                          <span className="font-serif text-base sm:text-lg font-semibold block leading-tight">
                            {item.label}
                          </span>
                          <span className={`text-xs block mt-0.5 ${isActive ? 'text-white/70' : 'text-[#6E5D52]'}`}>
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? 'text-[#D25027]' : 'text-[#21100B]/30'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Shopping Bag Trigger in Drawer */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCart) onOpenCart();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#D25027] hover:bg-[#B8401C] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-xs font-semibold">Open Shopping Bag</span>
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                    {cartCount} items
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Contact Strip in Drawer */}
            <div className="p-6 bg-white border-t border-[#21100B]/8 space-y-2 text-xs text-[#5C4A3E]">
              <p className="font-semibold text-[#21100B]">Bakehouse Orders Hotline</p>
              <p>0302 6567774 · 0332 6567774</p>
              <p className="text-[11px] text-[#8C7A6B]">Bahawalpur, Punjab, Pakistan</p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
