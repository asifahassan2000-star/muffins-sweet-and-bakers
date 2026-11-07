import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';

interface StoryPageProps {
  onNavigateToMenu: () => void;
}

export default function StoryPage({ onNavigateToMenu }: StoryPageProps) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate py-12 sm:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
        
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-medium text-brand-caramel">
            <span>Our Heritage</span>
            <span aria-hidden="true" className="text-brand-honey">·</span>
            <span>Bahawalpur, Punjab</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-brand-chocolate font-normal tracking-tight leading-[1.1] text-balance">
            Where Generational Mithai Craft Meets Modern Artisanal Baking.
          </h1>

          <p className="text-base sm:text-lg text-brand-chocolate/75 leading-relaxed font-sans pt-2">
            Muffinns – Sweets & Bakers began with a singular promise: to honor the storied confectionery heritage of Bahawalpur while bringing world-class European baking techniques to our historic city.
          </p>
        </div>

        {/* Featured Editorial Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-7 aspect-[4/3] overflow-hidden rounded-xs border border-brand-caramel/15 bg-brand-sugar">
            <img
              src="/assets/images/hero_editorial_muffin_1794039141433.jpg"
              alt="Handcrafted artisanal golden muffin"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="md:col-span-5 space-y-6">
            <span className="font-serif italic text-2xl text-brand-chocolate block">
              "Every morning before dawn, our ovens are fired with pure butter, local honey, and unhurried patience."
            </span>
            <p className="text-sm text-brand-chocolate/75 leading-relaxed">
              From our famous slow-simmered Multani Sohan Halwa and delicate Patashay to three-milk tres leches cakes and signature honey crumble muffins, our culinary kitchen refuses shortcuts.
            </p>
            <div className="pt-2 text-xs uppercase tracking-widest font-semibold text-brand-caramel">
              7 Locations Serving Bahawalpur Daily
            </div>
          </div>
        </div>

        {/* 3 Pillars of Craftsmanship */}
        <div className="border-t border-b border-brand-caramel/15 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            
            <div className="space-y-3">
              <span className="font-mono text-xs text-brand-caramel/70">01 / INGREDIENTS</span>
              <h3 className="font-serif text-2xl text-brand-chocolate font-normal">
                Farm Dairy & Pure Desi Ghee
              </h3>
              <p className="text-xs sm:text-sm text-brand-chocolate/70 leading-relaxed">
                We source fresh cream, whole milk, and real butter daily. No artificial oils, no synthetic preservatives, and zero compromises on genuine taste.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs text-brand-caramel/70">02 / TIME</span>
              <h3 className="font-serif text-2xl text-brand-chocolate font-normal">
                Uncompromising Slow Baking
              </h3>
              <p className="text-xs sm:text-sm text-brand-chocolate/70 leading-relaxed">
                Our doughs ferment naturally, and our traditional halwas simmer gently over copper kettles for hours until caramelized to deep, aromatic perfection.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs text-brand-caramel/70">03 / COMMUNITY</span>
              <h3 className="font-serif text-2xl text-brand-chocolate font-normal">
                Bahawalpur’s Celebrations
              </h3>
              <p className="text-xs sm:text-sm text-brand-chocolate/70 leading-relaxed">
                From Eid gift mithai boxes and wedding customized cakes to university study snacks and tea gatherings, we have been part of your sweetest moments.
              </p>
            </div>

          </div>
        </div>

        {/* Call to action */}
        <div className="text-center max-w-xl mx-auto space-y-6 pt-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-chocolate font-normal">
            Taste the Craftsmanship Today
          </h2>
          <p className="text-sm text-brand-chocolate/70 leading-relaxed">
            Order fresh bakes delivered straight to your door or visit our flagship branches in Trust Colony and Aziz Bhatti Road.
          </p>
          <button
            onClick={onNavigateToMenu}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-chocolate text-brand-cream hover:bg-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs cursor-pointer shadow-xs"
          >
            <span>Explore The Complete Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
