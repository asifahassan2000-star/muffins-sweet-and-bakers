import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';

interface HeaderProps {
  activeView: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin';
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin') => void;
  onOpenSidebar: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export default function Header({
  activeView,
  onNavigate,
  onOpenSidebar,
  onOpenCart,
  cartCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-brand-cream/90 backdrop-blur-md border-b border-brand-caramel/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-18 sm:h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Bakery Brand Logo & Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group focus:outline-none shrink-0"
          aria-label="Muffinns Sweets & Bakers Home"
        >
          <MuffinnsLogo size={36} className="transition-transform duration-500 group-hover:scale-105 shrink-0" animated={false} />
          <div>
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-serif font-black text-xl sm:text-2xl text-brand-chocolate tracking-tight">
                Muffinns
              </span>
              <span className="font-sans text-xs font-bold text-brand-caramel tracking-wide" dir="rtl" title="Patashay">
                پتاشے
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.22em] font-medium text-brand-honey block mt-0.5">
              Sweets & Bakers
            </span>
          </div>
        </button>

        {/* Zone 2: Very Limited, Clean Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.16em] text-brand-chocolate/80 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'home'
                ? 'text-brand-chocolate font-bold border-b border-brand-chocolate'
                : 'hover:text-brand-chocolate text-brand-chocolate/70'
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => onNavigate('story')}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'story'
                ? 'text-brand-chocolate font-bold border-b border-brand-chocolate'
                : 'hover:text-brand-chocolate text-brand-chocolate/70'
            }`}
          >
            Our Story
          </button>

          <button
            onClick={() => onNavigate('menu')}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'menu'
                ? 'text-brand-chocolate font-bold border-b border-brand-chocolate'
                : 'hover:text-brand-chocolate text-brand-chocolate/70'
            }`}
          >
            Menu
          </button>

          <button
            onClick={() => onNavigate('find-us')}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'find-us'
                ? 'text-brand-chocolate font-bold border-b border-brand-chocolate'
                : 'hover:text-brand-chocolate text-brand-chocolate/70'
            }`}
          >
            Find Us
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'contact'
                ? 'text-brand-chocolate font-bold border-b border-brand-chocolate'
                : 'hover:text-brand-chocolate text-brand-chocolate/70'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Minimal Menu Button & Bag Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Shopping Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-brand-chocolate hover:text-brand-caramel hover:bg-brand-sugar transition-colors rounded-xs cursor-pointer flex items-center gap-1.5 focus:outline-none"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="font-mono text-[11px] font-bold text-brand-caramel tabular-nums">
                ({cartCount})
              </span>
            )}
          </button>

          {/* Minimal Menu Trigger for Full Slide-out Drawer */}
          <button
            onClick={onOpenSidebar}
            className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest font-semibold text-brand-chocolate hover:text-brand-cream hover:bg-brand-chocolate transition-colors duration-200 border border-brand-caramel/20 rounded-xs cursor-pointer focus:outline-none"
            aria-label="Open complete navigation menu"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>

      </div>
    </header>
  );
}
