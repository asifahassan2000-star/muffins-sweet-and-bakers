import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, MapPin, Phone, Clock, Star, Check } from 'lucide-react';
import { MenuItem } from '../types';
import MuffinnsLogo from './MuffinnsLogo';
import AmbientBakerySound from './AmbientBakerySound';

interface HomeEditorialSectionsProps {
  onNavigate: (view: 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin') => void;
  onAddToCart: (item: MenuItem) => void;
  addedItemId?: string | null;
}

const FEATURED_ITEMS: MenuItem[] = [
  {
    id: 'feat_honey_muffin',
    name: 'Signature Golden Honey Muffin',
    category: 'Muffins & Desserts',
    description: 'Folded with raw golden honey, toasted pecans, and slow-churned butter. Our bakehouse signature.',
    basePrice: 380,
    image: '/assets/images/hero_editorial_muffin_1794039141433.jpg',
    badge: 'Artisan Signature'
  },
  {
    id: 'feat_three_milk',
    name: 'Three Milk Tres Leches Cake',
    category: 'Cakes (Cream & Special)',
    description: 'Airy sponge steeped in three rich dairy milks, capped with unsweetened velvet cream.',
    basePrice: 950,
    image: 'https://i.ibb.co/jk7rk9Hk/three-milk-cake.webp',
    badge: 'Bahawalpur Favorite'
  },
  {
    id: 'feat_patashay_mithai',
    name: 'Traditional Royal Patashay',
    category: 'Traditional & Pateesa',
    description: 'Generational heritage confection simmered in pure desi ghee with saffron cardamom essence.',
    basePrice: 650,
    image: '/assets/images/muffinns_patashay_sweets_1784645566064.jpg',
    badge: 'Heritage Recipe'
  },
  {
    id: 'feat_chocolate_fudge',
    name: 'Belgian Chocolate Fudge Brownie',
    category: 'Pastries & Brownies',
    description: 'Dense Dutch dark cocoa brownie slice topped with satin ganache and roasted walnuts.',
    basePrice: 320,
    image: '/assets/images/muffinns_chocolate_slice.jpg',
    badge: 'Chef Selection'
  }
];

export default function HomeEditorialSections({
  onNavigate,
  onAddToCart,
  addedItemId
}: HomeEditorialSectionsProps) {
  return (
    <div className="w-full bg-brand-cream text-brand-chocolate space-y-28 sm:space-y-36 md:space-y-44 pt-12 pb-24">
      
      {/* ================= 1. SMALL FEATURED COLLECTION (3-4 PRODUCTS) ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10 sm:space-y-14 overflow-hidden">
        
        {/* Giant Text Behind Editorial Watermark */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 select-none overflow-hidden" 
          aria-hidden="true"
        >
          <span className="font-serif text-[15vw] font-black tracking-tight text-[#32140D]/[0.02] uppercase leading-none">
            COLLECTION
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.22em] font-medium text-brand-caramel block">
                Curated Selection
              </span>
              <span className="font-handwriting text-lg text-[#FF792B] font-bold">
                ~ "Handcrafted daily in small batches" ~
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-chocolate font-normal tracking-tight">
              Signature Bakehouse Creations
            </h2>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-chocolate hover:text-brand-caramel transition-colors cursor-pointer group"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-brand-caramel" />
          </button>
        </div>

        {/* 4-Item Grid with Uniform Geometry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {FEATURED_ITEMS.map((item) => {
            const isJustAdded = addedItemId === item.id;
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between bg-brand-sugar border border-brand-caramel/15 rounded-xs p-5 transition-all hover:border-brand-caramel/40 shadow-xs"
              >
                <div className="space-y-4">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xs bg-brand-cream border border-brand-caramel/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] uppercase tracking-wider font-semibold bg-brand-sugar/90 backdrop-blur-xs px-2 py-0.5 text-brand-chocolate border border-brand-caramel/15 rounded-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-brand-caramel/80 block">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg font-normal text-brand-chocolate leading-snug group-hover:text-brand-caramel transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-chocolate/70 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-4 mt-4 border-t border-brand-caramel/10 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-brand-chocolate tabular-nums">
                    Rs. {item.basePrice.toLocaleString()}
                  </span>

                  <button
                    onClick={() => onAddToCart(item)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isJustAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-brand-chocolate text-brand-cream hover:bg-brand-caramel'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet Subtext */}
        <div className="text-center pt-2">
          <p className="text-xs text-brand-chocolate/60">
            Cakes available in 1 lb, 2 lb and 4 lb sizes · Custom dietary options upon request
          </p>
        </div>
      </section>

      {/* ================= 3. BRAND STORY PREVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-brand-sugar border border-brand-caramel/15 p-8 sm:p-14 lg:p-16 rounded-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium text-brand-caramel">
              <span>Bakehouse Heritage</span>
              <span aria-hidden="true" className="text-brand-honey">·</span>
              <span>Our Story</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-brand-chocolate font-normal tracking-tight leading-tight">
              Honoring Bahawalpur's Sweets Since Generation Past.
            </h2>

            <p className="text-sm sm:text-base text-brand-chocolate/75 leading-relaxed font-sans">
              Founded with deep reverence for traditional Pakistani halwas and French pastry discipline, Muffinns has evolved into Bahawalpur’s premier bakery. We still peel every pistachio by hand and simmer our desi ghee sweets in heavy copper cauldrons.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('story')}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-brand-chocolate text-brand-cream hover:bg-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs shadow-xs cursor-pointer group"
              >
                <span>Read The Full Story</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-brand-caramel/15">
              <img
                src="/assets/images/muffinns_sohan_halwa_1784731966653.jpg"
                alt="Traditional heritage halwa and confectionery"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. LOCATION & CONTACT PREVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] font-medium text-brand-caramel block">
              Flagship Bakehouses
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-chocolate font-normal tracking-tight">
              Visit Us in Bahawalpur
            </h2>
          </div>

          <button
            onClick={() => onNavigate('find-us')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-chocolate hover:text-brand-caramel transition-colors cursor-pointer group"
          >
            <span>View All 7 Branches & Map</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-brand-caramel" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Branch 1 */}
          <div className="p-6 bg-brand-sugar border border-brand-caramel/15 rounded-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg font-semibold text-brand-chocolate">Trust Colony Branch</span>
              <span className="text-[10px] uppercase font-mono text-brand-caramel">Central</span>
            </div>
            <p className="text-xs text-brand-chocolate/75 leading-relaxed">
              Circular Road, Near Trust Colony Chowk, Bahawalpur
            </p>
            <div className="pt-2 border-t border-brand-caramel/10 text-xs text-brand-chocolate/70 space-y-1">
              <p className="font-mono font-medium">Tel: 0302 6567774</p>
              <p className="text-[11px] text-brand-chocolate/50">08:00 AM – 12:00 AM Daily</p>
            </div>
          </div>

          {/* Branch 2 */}
          <div className="p-6 bg-brand-sugar border border-brand-caramel/15 rounded-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg font-semibold text-brand-chocolate">Aziz Bhatti Road</span>
              <span className="text-[10px] uppercase font-mono text-brand-caramel">Model Town</span>
            </div>
            <p className="text-xs text-brand-chocolate/75 leading-relaxed">
              28 Aziz Bhatti Shaheed Rd, Model Town, Bahawalpur
            </p>
            <div className="pt-2 border-t border-brand-caramel/10 text-xs text-brand-chocolate/70 space-y-1">
              <p className="font-mono font-medium">Tel: 0302 6567774</p>
              <p className="text-[11px] text-brand-chocolate/50">08:00 AM – 11:30 PM Daily</p>
            </div>
          </div>

          {/* Branch 3 */}
          <div className="p-6 bg-brand-sugar border border-brand-caramel/15 rounded-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg font-semibold text-brand-chocolate">Rafi Qamar Road</span>
              <span className="text-[10px] uppercase font-mono text-brand-caramel">Satellite Town</span>
            </div>
            <p className="text-xs text-brand-chocolate/75 leading-relaxed">
              Rafi Qamar Road Chowk, Satellite Town, Bahawalpur
            </p>
            <div className="pt-2 border-t border-brand-caramel/10 text-xs text-brand-chocolate/70 space-y-1">
              <p className="font-mono font-medium">Tel: 0332 6567774</p>
              <p className="text-[11px] text-brand-chocolate/50">08:30 AM – 12:00 AM Daily</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 5. ELEGANT EDITORIAL FOOTER ================= */}
      <footer className="border-t border-brand-caramel/15 pt-14 pb-12 px-4 sm:px-6 lg:px-12 bg-brand-sugar">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Col 1: Wordmark & Philosophy */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <MuffinnsLogo size={36} animated={false} />
                <div>
                  <span className="font-serif font-black text-2xl text-brand-chocolate tracking-tight block leading-none">
                    Muffinns
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-brand-honey block mt-1">
                    Sweets & Bakers · Bahawalpur
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-brand-chocolate/70 leading-relaxed max-w-sm">
                Artisanal bakery and generational sweet shop crafting pure desi ghee mithai, handcrafted muffins, and bespoke celebration cakes.
              </p>

              {/* Ambient Audio Toggle */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs text-brand-chocolate/60 uppercase tracking-wider font-semibold">Kitchen Sound:</span>
                <AmbientBakerySound />
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-caramel block">
                Directory
              </span>
              <ul className="space-y-2 text-xs text-brand-chocolate/80">
                <li>
                  <button onClick={() => onNavigate('home')} className="hover:text-brand-caramel transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('story')} className="hover:text-brand-caramel transition-colors cursor-pointer">
                    Our Story & Heritage
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('menu')} className="hover:text-brand-caramel transition-colors cursor-pointer">
                    Complete 120+ Product Catalogue
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('find-us')} className="hover:text-brand-caramel transition-colors cursor-pointer">
                    7 Bahawalpur Branch Locations
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-brand-caramel transition-colors cursor-pointer">
                    Direct Contact & Special Orders
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tracker')} className="hover:text-brand-caramel transition-colors cursor-pointer">
                    Live Order Tracker
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct Contact Details */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-caramel block">
                Bakehouse Hotline
              </span>
              <div className="space-y-1.5 text-xs text-brand-chocolate/75 font-mono">
                <p>0302 6567774 (Primary)</p>
                <p>0332 6567774 (Orders)</p>
                <p>0331 6567780 (Inquiries)</p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onNavigate('theme-studio')}
                  className="text-xs uppercase tracking-widest font-semibold text-brand-caramel hover:underline cursor-pointer"
                >
                  Theme Studio & Aesthetics →
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Hairline & Legal */}
          <div className="border-t border-brand-caramel/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-chocolate/50 font-mono">
            <p>© {new Date().getFullYear()} Muffinns Sweets & Bakers. All rights reserved.</p>
            <p>Bahawalpur, Punjab, Pakistan</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
