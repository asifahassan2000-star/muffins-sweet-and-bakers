import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';

interface StoryPageProps {
  onNavigateToMenu: () => void;
}

export default function StoryPage({ onNavigateToMenu }: StoryPageProps) {
  return (
    <div className="relative min-h-screen bg-brand-cream/80 text-brand-chocolate py-12 sm:py-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
      
      {/* Background design and light image overlay */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
        <img
          src="/assets/images/hero_editorial_muffin_1794039141433.jpg"
          alt=""
          className="w-full h-full object-cover opacity-[0.04] scale-105 filter blur-[0.5px]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-radial from-brand-caramel/5 via-brand-cream/60 to-brand-cream/70" />
      </div>

      {/* Heritage watermark graphic */}
      <div 
        className="pointer-events-none absolute -top-12 -right-10 select-none overflow-hidden opacity-[0.035] text-[#21100B]" 
        aria-hidden="true"
      >
        <span className="font-serif text-[24vw] font-black leading-none uppercase block">
          1988
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-16 sm:space-y-24">
        
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl space-y-5"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-sugar border border-brand-caramel/25 text-brand-caramel text-xs font-mono uppercase tracking-[0.25em] font-bold shadow-xs">
            <span className="size-2 rounded-full bg-brand-caramel animate-pulse" />
            <span>Our Heritage</span>
            <span aria-hidden="true" className="text-brand-honey">·</span>
            <span>Bahawalpur, Punjab</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-brand-chocolate font-black tracking-tight leading-[1.1] text-balance">
            Where Generational Mithai Craft Meets Modern Artisanal Baking.
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#21100B]/90 leading-[1.35] tracking-[-0.02em] pt-4">
            At <strong className="font-bold text-[#E94F16] font-serif">Muffins Sweets & Bakers</strong>, we believe that food is more than just something to enjoy — it is part of the moments we remember, the celebrations we share, and the little pleasures that make everyday life special. Rooted in the heart of Bahawalpur, Muffins brings together a world of taste under one roof, offering an experience that goes far beyond the ordinary bakery.
          </p>
        </motion.div>

        {/* Featured Editorial Photo Grid with Scroll Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-center bg-[#FCFAF8]/80 backdrop-blur-xs p-6 sm:p-10 rounded-2xl border border-brand-caramel/20 shadow-sm"
        >
          <div className="md:col-span-6 aspect-[4/3] overflow-hidden rounded-xl border border-brand-caramel/20 bg-brand-sugar shadow-md">
            <img
              src="/assets/images/hero_editorial_muffin_1794039141433.jpg"
              alt="Handcrafted artisanal golden muffin"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="md:col-span-6 space-y-6">
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#32140D]/90 leading-[1.4] tracking-[-0.01em]">
              From the richness of beautifully crafted cakes and brownies to the familiar comfort of traditional sweets, from freshly prepared savoury favourites to satisfying meals and everyday treats, there is something for every mood, every craving, and every occasion.
            </p>
            <p className="font-serif text-base sm:text-lg md:text-xl text-[#32140D]/85 leading-[1.4] tracking-[-0.01em]">
              Our identity is built around variety, flavour, and the joy of bringing people together — whether it is a family celebration, a gathering with friends, a special moment worth remembering, or simply a visit for something delicious. We bring together familiar favourites and exciting choices in one welcoming destination, where every visit offers something to discover.
            </p>
            <div className="pt-2 text-xs uppercase tracking-widest font-semibold text-brand-caramel flex items-center gap-2">
              <span className="w-8 h-[1.5px] bg-brand-caramel" />
              <span>7 Locations Serving Bahawalpur Daily</span>
            </div>
          </div>
        </motion.div>

        {/* Highlighted Core Story Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-caramel/[0.08] via-brand-sugar to-brand-caramel/[0.04] border-l-4 border-brand-caramel border-y border-r border-brand-caramel/25 shadow-md"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.25] font-serif font-black tracking-[-0.03em] text-[#21100B]">
            Muffins Sweets & Bakers is not just about what you take home; it is about the experiences, connections, and memories that come with every visit.
          </h2>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-brand-caramel font-serif italic tracking-wide">
            A place for every taste, every occasion, and every little moment worth making special.
          </p>
        </motion.div>

        {/* 3 Pillars of Craftsmanship with Scroll Reveal */}
        <div className="border-t border-b border-brand-caramel/20 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <span className="font-mono text-xs text-brand-caramel font-bold tracking-widest">01 / INGREDIENTS</span>
              <h3 className="font-serif text-2xl text-brand-chocolate font-bold">
                Farm Dairy & Pure Desi Ghee
              </h3>
              <p className="text-sm text-brand-chocolate/75 leading-relaxed font-sans">
                We source fresh cream, whole milk, and real butter daily. No artificial oils, no synthetic preservatives, and zero compromises on genuine taste.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <span className="font-mono text-xs text-brand-caramel font-bold tracking-widest">02 / TIME</span>
              <h3 className="font-serif text-2xl text-brand-chocolate font-bold">
                Uncompromising Slow Baking
              </h3>
              <p className="text-sm text-brand-chocolate/75 leading-relaxed font-sans">
                Our doughs ferment naturally, and our traditional halwas simmer gently over copper kettles for hours until caramelized to deep, aromatic perfection.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3"
            >
              <span className="font-mono text-xs text-brand-caramel font-bold tracking-widest">03 / COMMUNITY</span>
              <h3 className="font-serif text-2xl text-brand-chocolate font-bold">
                Bahawalpur’s Celebrations
              </h3>
              <p className="text-sm text-brand-chocolate/75 leading-relaxed font-sans">
                From Eid gift mithai boxes and wedding customized cakes to university study snacks and tea gatherings, we have been part of your sweetest moments.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto space-y-6 pt-4"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-chocolate font-bold">
            Taste the Craftsmanship Today
          </h2>
          <p className="text-base text-brand-chocolate/75 leading-relaxed font-sans">
            Order fresh bakes delivered straight to your door or visit our flagship branches across Bahawalpur.
          </p>
          <button
            onClick={onNavigateToMenu}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-chocolate text-brand-cream hover:bg-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs cursor-pointer shadow-md"
          >
            <span>Explore The Complete Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
