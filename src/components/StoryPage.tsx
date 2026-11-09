import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight } from 'lucide-react';
import CreativeStudioHero from './CreativeStudioHero';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ */
/*  Story Page — full animated experience                              */
/*  Combines the CreativeStudioHero scroll animation at the top with   */
/*  editorial story sections below, each revealed on scroll.           */
/* ------------------------------------------------------------------ */

interface StoryPageProps {
  onNavigateToMenu: () => void;
  onNavigate?: (view: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Pillar Card — scroll-revealed craftsmanship section                */
/* ------------------------------------------------------------------ */
function PillarCard({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(
      ref.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      },
    );
  });

  return (
    <div ref={ref} className="space-y-4 opacity-0">
      <span className="font-mono text-xs text-[#D25027] font-bold tracking-[0.2em] uppercase">
        {index} / {label}
      </span>
      <h3 className="font-serif text-2xl lg:text-3xl text-[#21100B] font-bold leading-tight tracking-[-0.02em]">
        {title}
      </h3>
      <p className="text-sm lg:text-base text-[#21100B]/70 leading-relaxed font-sans">
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-revealed text block                                         */
/* ------------------------------------------------------------------ */
function RevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(
      ref.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          once: true,
        },
      },
    );
  });

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main StoryPage                                                     */
/* ------------------------------------------------------------------ */
export default function StoryPage({ onNavigateToMenu, onNavigate }: StoryPageProps) {
  const editorialRef = useRef<HTMLDivElement>(null);

  // Reveal editorial heading lines with SplitText
  useGSAP(() => {
    if (!editorialRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const headings = editorialRef.current.querySelectorAll('[data-reveal-lines]');
    headings.forEach((heading) => {
      SplitText.create(heading, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'will-change-transform [backface-visibility:hidden]',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 78%',
              once: true,
            },
          }),
      });
    });
  });

  return (
    <div className="relative w-full bg-[#FAF7F2]">

      {/* ============================================================ */}
      {/*  PART 1: Full CreativeStudioHero Scroll Animation             */}
      {/*  4-step pinned scroll with image transitions + intro          */}
      {/* ============================================================ */}
      <CreativeStudioHero
        brand="Muffinns"
        title={['Decadence In', 'Every Bite']}
        leftCopy={[
          'Handcrafted croissants, warm muffins',
          'and slow-simmered royal halwas',
          'baked with pure farm desi ghee.',
        ]}
        rightCopy={[
          'Traditional recipes perfected since 1988',
          'for weddings, cherished gatherings',
          'and refined daily indulgence.',
        ]}
        onNavigate={onNavigate}
      />

      {/* ============================================================ */}
      {/*  PART 2: Editorial Story Sections (below the scroll hero)     */}
      {/*  Each section scroll-reveals with GSAP                        */}
      {/* ============================================================ */}
      <div ref={editorialRef} className="relative z-10 bg-[#FAF7F2]">

        {/* Heritage Statement */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
          <RevealSection>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-[1.5px] bg-[#D25027]" />
              <span className="font-mono text-xs text-[#D25027] font-bold tracking-[0.2em] uppercase">
                Heritage Since 1988
              </span>
            </div>
          </RevealSection>

          <h2
            data-reveal-lines
            className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] text-[#21100B] font-bold leading-[1.15] tracking-[-0.03em] max-w-4xl"
          >
            Authentic Desi Ghee Mithai & Artisanal Oven Baking.
          </h2>

          <RevealSection className="mt-8 lg:mt-12 grid md:grid-cols-2 gap-8 lg:gap-16">
            <p className="text-lg lg:text-xl text-[#21100B]/80 leading-[1.55] font-serif tracking-[-0.01em]">
              Founded in the historic city of Bahawalpur, Muffins Sweets & Bakers began with a
              simple commitment: uncompromised ingredients, generational craft, and recipes simmered
              slow in 100% pure desi ghee.
            </p>
            <p className="text-lg lg:text-xl text-[#21100B]/80 leading-[1.55] font-serif tracking-[-0.01em]">
              Today, our seven branches serve thousands of families daily — from early morning
              breakfast croissants and signature golden muffins to royal celebratory wedding
              sweets.
            </p>
          </RevealSection>
        </section>

        {/* Full-width Editorial Image */}
        <RevealSection>
          <div className="relative w-full h-[50vh] lg:h-[65vh] overflow-hidden">
            <img
              src="/assets/images/hero_editorial_muffin_1794039141433.jpg"
              alt="Handcrafted artisanal golden muffin — Muffinns heritage bakery"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#21100B]/30 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12">
              <span className="text-xs font-mono text-white/80 uppercase tracking-[0.2em] drop-shadow-lg">
                7 Locations Serving Bahawalpur Daily
              </span>
            </div>
          </div>
        </RevealSection>

        {/* Quote Block */}
        <section className="max-w-5xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <RevealSection>
            <div className="relative pl-8 lg:pl-12 border-l-4 border-[#D25027]">
              <h2
                data-reveal-lines
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] leading-[1.25] font-serif font-bold tracking-[-0.03em] text-[#21100B]"
              >
                Muffins Sweets & Bakers is not just about what you take home; it is about the
                experiences, connections, and memories that come with every visit.
              </h2>
              <p className="mt-6 text-lg lg:text-xl text-[#D25027] font-serif italic tracking-wide">
                A place for every taste, every occasion, and every little moment worth making special.
              </p>
            </div>
          </RevealSection>
        </section>

        {/* 3 Pillars of Craftsmanship */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 pb-20 lg:pb-32">
          <div className="border-t border-b border-[#21100B]/10 py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              <PillarCard
                index="01"
                label="Ingredients"
                title="Farm Dairy & Pure Desi Ghee"
                description="We source fresh cream, whole milk, and real butter daily. No artificial oils, no synthetic preservatives, and zero compromises on genuine taste."
              />
              <PillarCard
                index="02"
                label="Time"
                title="Uncompromising Slow Baking"
                description="Our doughs ferment naturally, and our traditional halwas simmer gently over copper kettles for hours until caramelized to deep, aromatic perfection."
              />
              <PillarCard
                index="03"
                label="Community"
                title="Bahawalpur's Celebrations"
                description="From Eid gift mithai boxes and wedding customized cakes to university study snacks and tea gatherings, we have been part of your sweetest moments."
              />
            </div>
          </div>
        </section>

        {/* Second Editorial Photo Grid */}
        <RevealSection>
          <section className="max-w-6xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#e6e6e3]">
                <img
                  src="/assets/images/muffinns_patashay_sweets_1784645566064.jpg"
                  alt="Royal Desi Ghee Patashay — Traditional sweets"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#e6e6e3]">
                <img
                  src="/assets/images/muffinns_lotus_biscof_cake.jpg"
                  alt="Lotus Biscoff celebration cake"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </RevealSection>

        {/* Final CTA */}
        <section className="relative py-20 lg:py-28 bg-[#21100B] text-[#FAF7F2]">
          <RevealSection className="max-w-2xl mx-auto text-center px-6">
            <h2
              data-reveal-lines
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-[-0.03em]"
            >
              Taste the Craftsmanship Today
            </h2>
            <p className="mt-6 text-base lg:text-lg text-[#FAF7F2]/70 leading-relaxed font-sans">
              Order fresh bakes delivered straight to your door or visit our flagship branches
              across Bahawalpur.
            </p>
            <button
              onClick={onNavigateToMenu}
              className="group mt-8 inline-flex items-center gap-3 px-8 py-4 bg-[#D25027] hover:bg-[#E06338] text-white font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-[#D25027]/30 cursor-pointer"
            >
              <span>Explore The Complete Menu</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </RevealSection>
        </section>

      </div>
    </div>
  );
}
