import React from 'react';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { MenuItem } from '../types';
import MuffinnsLogo from './MuffinnsLogo';
import { AppView } from '../App';

interface HomeEditorialSectionsProps {
  onNavigate: (view: AppView) => void;
  onAddToCart: (item: MenuItem) => void;
  addedItemId?: string | null;
}

const FEATURED_ITEMS: MenuItem[] = [
  {
    id: 'feat_honey_muffin',
    name: 'Signature Golden Honey Muffin',
    category: 'Muffins & Desserts',
    description: 'Folded with raw golden honey, toasted pecans, and slow-churned sweet cream butter.',
    basePrice: 380,
    image: '/assets/images/hero_editorial_muffin_1794039141433.jpg',
    badge: 'Bakery Signature'
  },
  {
    id: 'feat_three_milk',
    name: 'Three Milk Tres Leches Cake',
    category: 'Cakes (Cream & Special)',
    description: 'Airy sponge steeped in three rich dairy milks, crowned with unsweetened velvet cream.',
    basePrice: 950,
    image: '/assets/images/mango_three_milk_poster_1785058414347.jpg',
    badge: 'Customer Favorite'
  },
  {
    id: 'feat_patashay_mithai',
    name: 'Traditional Royal Patashay',
    category: 'Traditional & Pateesa',
    description: 'Generational heritage confection simmered in pure desi ghee with saffron essence.',
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

const BRANCH_LIST = [
  {
    name: 'Main Flagship Branch',
    area: 'Satellite Town, Commercial Area',
    phone: '0302 6567774',
    hours: '08:00 AM – 12:00 AM'
  },
  {
    name: 'Model Town Branch',
    area: 'Model Town ' + 'A' + ', Main Boulevard',
    phone: '0332 6567774',
    hours: '08:30 AM – 12:00 AM'
  },
  {
    name: 'Circular Road Branch',
    area: 'Farid Gate, Circular Road',
    phone: '0331 6567780',
    hours: '08:00 AM – 11:30 PM'
  },
  {
    name: 'Chowk Saraiki Branch',
    area: 'Near BVH Hospital, Main Chowk',
    phone: '0300 8684784',
    hours: '08:00 AM – 12:00 AM'
  }
];

export default function HomeEditorialSections({
  onNavigate,
  onAddToCart,
  addedItemId
}: HomeEditorialSectionsProps) {
  return (
    <div className="w-full bg-[#FAF7F2] text-[#21100B] space-y-24 sm:space-y-32 pb-20">
      
      {/* ================= 1. FEATURED SIGNATURE CREATIONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#21100B]/8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D25027] block mb-1">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#21100B]">
              Signature Bakehouse Creations
            </h2>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#D25027] hover:text-[#21100B] transition-colors cursor-pointer group"
          >
            <span>Explore Complete Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {FEATURED_ITEMS.map((item) => {
            const isAdded = addedItemId === item.id;
            return (
              <div
                key={item.id}
                className="artisan-card group flex flex-col justify-between p-4"
              >
                <div className="space-y-3.5">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F4EFE6]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-[#21100B]/85 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-[#8C7A6B] block">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#21100B] leading-snug mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#5C4A3E] mt-1.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#21100B]/6 flex items-center justify-between gap-2">
                  <span className="font-sans text-base font-bold text-[#21100B]">
                    Rs. {item.basePrice.toLocaleString()}
                  </span>

                  <button
                    onClick={() => onAddToCart(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#D25027] hover:bg-[#B8401C] text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
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
      </section>

      {/* ================= 2. HERITAGE & BAKING MASTERY STORY BRIDGE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#21100B]/8 rounded-2xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D25027] block">
                Heritage Since 1988
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#21100B] font-normal leading-tight">
                Authentic Desi Ghee Mithai &amp; Artisanal Oven Baking.
              </h2>
              <p className="text-sm sm:text-base text-[#5C4A3E] leading-relaxed">
                Founded in the historic city of Bahawalpur, Muffins Sweets &amp; Bakers began with a simple commitment: uncompromised ingredients, generational craft, and recipes simmered slow in 100% pure desi ghee.
              </p>
              <p className="text-sm sm:text-base text-[#5C4A3E] leading-relaxed">
                Today, our seven branches serve thousands of families daily — from early morning breakfast croissants and signature golden muffins to royal celebratory wedding sweets.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('story')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#21100B] hover:bg-[#D25027] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#F4EFE6] shadow-sm">
                <img
                  src="/assets/images/muffinns_baklava_1784732108022.jpg"
                  alt="Muffins Sweets Artisanal Craft"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. SEVEN BRANCH LOCATIONS OVERVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#21100B]/8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D25027] block mb-1">
              Visit In Person
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#21100B]">
              7 Convenient Bahawalpur Locations
            </h2>
          </div>

          <button
            onClick={() => onNavigate('find-us')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#D25027] hover:text-[#21100B] transition-colors cursor-pointer group"
          >
            <span>View All Addresses &amp; Maps</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {BRANCH_LIST.map((branch, idx) => (
            <div
              key={idx}
              className="artisan-card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D25027] block">
                  Branch 0{idx + 1}
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#21100B]">
                  {branch.name}
                </h3>
                <p className="text-xs text-[#5C4A3E] leading-relaxed">
                  {branch.area}
                </p>
              </div>

              <div className="pt-3 border-t border-[#21100B]/6 text-xs text-[#6E5D52] space-y-1">
                <p className="font-medium text-[#21100B]">Tel: {branch.phone}</p>
                <p className="text-[11px] text-[#8C7A6B]">{branch.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. REFINED EDITORIAL FOOTER ================= */}
      <footer className="border-t border-[#21100B]/8 pt-16 pb-12 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Col 1: Wordmark & Philosophy */}
            <div className="md:col-span-5 space-y-4">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-3 text-left cursor-pointer focus:outline-none"
              >
                <MuffinnsLogo size={48} showWordmark={true} />
              </button>

              <p className="text-xs sm:text-sm text-[#5C4A3E] leading-relaxed max-w-sm pt-1">
                Authentic Bahawalpur artisanal bakery and confectioners crafting pure desi ghee sweets, fresh morning bakes, and celebration cakes since 1988.
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#D25027] block">
                Quick Navigation
              </span>
              <ul className="space-y-2 text-xs text-[#5C4A3E]">
                <li>
                  <button onClick={() => onNavigate('home')} className="hover:text-[#D25027] transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('story')} className="hover:text-[#D25027] transition-colors cursor-pointer">
                    Our Story &amp; Heritage
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('menu')} className="hover:text-[#D25027] transition-colors cursor-pointer">
                    Complete Product Menu (120+ Items)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('find-us')} className="hover:text-[#D25027] transition-colors cursor-pointer">
                    7 Bahawalpur Branch Locations
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-[#D25027] transition-colors cursor-pointer">
                    Special Orders &amp; Inquiries
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tracker')} className="hover:text-[#D25027] transition-colors cursor-pointer">
                    Live Order Tracker
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct Contact Details */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#D25027] block">
                Bakehouse Hotlines
              </span>
              <div className="space-y-1.5 text-xs text-[#5C4A3E]">
                <p><strong>Head Office:</strong> 0302 6567774</p>
                <p><strong>Order Desk:</strong> 0332 6567774</p>
                <p><strong>Corporate Inquiries:</strong> 0331 6567780</p>
              </div>
              <p className="text-[11px] text-[#8C7A6B] pt-2">
                Daily Baking Hours: 08:00 AM – 12:00 AM
              </p>
            </div>

          </div>

          {/* Legal / Copyright */}
          <div className="border-t border-[#21100B]/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A6B]">
            <p>© {new Date().getFullYear()} Muffins Sweets &amp; Bakers. All rights reserved.</p>
            <p>Bahawalpur, Punjab, Pakistan</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
