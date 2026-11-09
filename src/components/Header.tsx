import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import MuffinnsLogo from './MuffinnsLogo';
import { AppView } from '../App';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
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
  const navItems: { label: string; view: AppView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Our Story', view: 'story' },
    { label: 'Menu', view: 'menu' },
    { label: '7 Branches', view: 'find-us' },
    { label: 'Contact', view: 'contact' },
    { label: 'Track Order', view: 'tracker' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#21100B]/8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo & Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left cursor-pointer group focus:outline-none"
          aria-label="Muffins Sweets & Bakers Home"
        >
          <MuffinnsLogo size={46} showWordmark={true} />
        </button>

        {/* Primary Clean Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#21100B]/80">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`transition-colors py-1 cursor-pointer font-sans relative ${
                activeView === item.view
                  ? 'text-[#D25027] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D25027]'
                  : 'hover:text-[#21100B] text-[#5C4A3E]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons: Cart and Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#21100B]/10 hover:border-[#D25027]/40 text-[#21100B] transition-all cursor-pointer shadow-xs hover:shadow-sm"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[#D25027]" />
            <span className="text-xs font-semibold">Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D25027] text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Complete Menu Drawer Trigger */}
          <button
            onClick={onOpenSidebar}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#21100B] hover:bg-[#D25027] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-xs"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>

      </div>
    </header>
  );
}
