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

      {/* ================= 3. OUR STORY SECTION ================= */}
      <section id="our-story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 scroll-mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#FCFAF8] border border-brand-caramel/25 p-8 sm:p-14 lg:p-20 rounded-3xl overflow-hidden shadow-xl"
        >
          {/* Subtle Ambient Light Image in Background */}
          <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
            <img
              src="/assets/images/hero_editorial_muffin_1794039141433.jpg"
              alt=""
              className="w-full h-full object-cover opacity-[0.07] scale-105 filter blur-[0.5px]"
              loading="lazy"
            />
            {/* Subtle radial warmth & vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FCFAF8]/90 via-[#FCFAF8]/70 to-[#FCFAF8]/95" />
            <div className="absolute inset-0 bg-radial from-brand-caramel/10 via-transparent to-transparent opacity-80" />
          </div>

          {/* Watermark Heritage Architectural Graphic Design */}
          <div 
            className="pointer-events-none absolute -bottom-16 -right-12 select-none overflow-hidden opacity-[0.04] text-[#21100B]" 
            aria-hidden="true"
          >
            <span className="font-serif text-[22vw] font-black leading-none tracking-tighter uppercase block">
              1988
            </span>
          </div>

          <div 
            className="pointer-events-none absolute -top-20 -left-16 select-none overflow-hidden opacity-[0.035] text-brand-caramel" 
            aria-hidden="true"
          >
            <span className="font-serif text-[18vw] font-black leading-none tracking-tighter uppercase block">
              MUFFINS
            </span>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto space-y-10 sm:space-y-12">
            
            {/* Header Kicker Badge & Title with Scroll Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-sugar border border-brand-caramel/30 text-brand-caramel text-xs font-mono uppercase tracking-[0.25em] font-bold shadow-xs">
                <span className="size-2 rounded-full bg-brand-caramel animate-pulse" />
                <span>Bakehouse Heritage</span>
                <span aria-hidden="true" className="text-brand-honey">·</span>
                <span>Our Story</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#21100B] font-black tracking-[-0.03em] leading-[1.1]">
                A World of Taste Under One Roof.
              </h2>
            </motion.div>

            {/* Main Narrative Paragraphs — matching the exact selected text font, size, and styling */}
            <div className="space-y-8 text-[#21100B] font-serif font-normal">
              
              {/* Paragraph 1 */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-[1.85rem] leading-[1.4] tracking-[-0.02em] text-[#21100B]/90 font-serif"
              >
                At <strong className="font-bold text-[#E94F16] font-serif">Muffins Sweets & Bakers</strong>, we believe that food is more than just something to enjoy — it is part of the moments we remember, the celebrations we share, and the little pleasures that make everyday life special. Rooted in the heart of Bahawalpur, Muffins brings together a world of taste under one roof, offering an experience that goes far beyond the ordinary bakery.
              </motion.p>

              {/* Paragraph 2 & 3 in a refined 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="space-y-3"
                >
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-caramel font-bold flex items-center gap-2">
                    <span className="w-6 h-[1.5px] bg-brand-caramel" />
                    Variety & Flavour
                  </span>
                  <p className="text-base sm:text-lg md:text-xl leading-[1.45] tracking-[-0.01em] text-[#32140D]/85 font-serif">
                    From the richness of beautifully crafted cakes and brownies to the familiar comfort of traditional sweets, from freshly prepared savoury favourites to satisfying meals and everyday treats, there is something for every mood, every craving, and every occasion.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="space-y-3"
                >
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-caramel font-bold flex items-center gap-2">
                    <span className="w-6 h-[1.5px] bg-brand-caramel" />
                    Bringing People Together
                  </span>
                  <p className="text-base sm:text-lg md:text-xl leading-[1.45] tracking-[-0.01em] text-[#32140D]/85 font-serif">
                    Our identity is built around variety, flavour, and the joy of bringing people together — whether it is a family celebration, a gathering with friends, a special moment worth remembering, or simply a visit for something delicious. We bring together familiar favourites and exciting choices in one welcoming destination, where every visit offers something to discover.
                  </p>
                </motion.div>
              </div>

              {/* Highlighted Core Manifesto Quote */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="relative mt-8 p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-brand-caramel/[0.08] via-brand-sugar to-brand-caramel/[0.04] border-l-4 border-brand-caramel border-y border-r border-brand-caramel/20 shadow-xs"
              >
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] leading-[1.3] font-serif font-black tracking-[-0.03em] text-[#21100B]">
                  <strong>Muffins Sweets & Bakers is not just about what you take home; it is about the experiences, connections, and memories that come with every visit.</strong>
                </p>
                <p className="mt-4 text-base sm:text-lg md:text-xl text-brand-caramel font-serif italic tracking-wide">
                  A place for every taste, every occasion, and every little moment worth making special.
                </p>
              </motion.div>

            </div>

            {/* Actions & Exploration Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => onNavigate('menu')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-chocolate text-brand-cream hover:bg-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs shadow-xs cursor-pointer group"
              >
                <span>Explore The Bakery Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('story')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-transparent text-brand-chocolate hover:text-brand-caramel border border-brand-chocolate/20 hover:border-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs cursor-pointer group"
              >
                <span>View Full Heritage Archive</span>
              </button>
            </motion.div>

          </div>
        </motion.div>
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
