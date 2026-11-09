import React from 'react';

interface MuffinnsLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export default function MuffinnsLogo({ 
  className = '', 
  size = 48,
  showWordmark = false
}: MuffinnsLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div 
        className="relative overflow-hidden rounded-xl shadow-sm border border-[#21100B]/10 bg-[#FAF7F2] shrink-0 transition-transform duration-300 hover:scale-[1.02]"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src="/assets/images/muffins_official_logo.jpg"
          alt="Muffins Sweets & Bakers Logo"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-2 leading-none">
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#21100B] tracking-tight">
              Muffins
            </span>
            <span className="font-serif text-sm font-semibold text-[#D25027]" dir="rtl">
              پتاشے
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8C7A6B] mt-1">
            Sweets &amp; Bakers · Est. 1988
          </span>
        </div>
      )}
    </div>
  );
}
