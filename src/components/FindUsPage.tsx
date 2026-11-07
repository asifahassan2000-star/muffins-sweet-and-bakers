import React, { useState } from 'react';
import { BRANCHES, Branch } from '../data/branches';
import { MapPin, Phone, Clock, ExternalLink, Search, Check, Star } from 'lucide-react';

export default function FindUsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>(BRANCHES[0].id);

  const filteredBranches = BRANCHES.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBranchData = BRANCHES.find(b => b.id === selectedBranch) || BRANCHES[0];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate py-12 sm:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Editorial Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium text-brand-caramel">
            <span>Branch Locator</span>
            <span aria-hidden="true" className="text-brand-honey">·</span>
            <span>7 Locations in Bahawalpur</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-brand-chocolate font-normal tracking-tight">
            Find Your Nearest Bakehouse.
          </h1>

          <p className="text-sm sm:text-base text-brand-chocolate/75 leading-relaxed font-sans">
            From our central bakehouse on Circular Road to campus express counters at Islamia University, experience fresh oven warmth anywhere across Bahawalpur.
          </p>
        </div>

        {/* Search & Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Branch List (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by road or branch name..."
                className="w-full pl-9 pr-4 py-2.5 bg-brand-sugar border border-brand-caramel/20 rounded-xs text-xs sm:text-sm text-brand-chocolate focus:bg-white focus:outline-none focus:border-brand-chocolate transition-colors"
              />
              <Search className="w-4 h-4 text-brand-chocolate/40 absolute left-3 top-3.5" />
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredBranches.map((branch) => {
                const isSelected = branch.id === selectedBranch;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`w-full text-left p-4 rounded-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-sugar border-brand-caramel shadow-xs ring-1 ring-brand-caramel/20'
                        : 'bg-brand-sugar/60 border-brand-caramel/10 hover:border-brand-caramel/30 hover:bg-brand-sugar'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-base font-semibold text-brand-chocolate">
                        {branch.name.replace('Muffinns Sweets & Bakers (', '').replace(')', '').replace('Muffins Patashay (', '')}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider font-mono text-brand-caramel shrink-0">
                        {branch.type}
                      </span>
                    </div>

                    <p className="text-xs text-brand-chocolate/70 line-clamp-1 mt-1">
                      {branch.address}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-brand-chocolate/60">
                      <span className="flex items-center gap-1 font-mono">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{branch.rating}</span>
                        <span className="text-brand-chocolate/40">({branch.reviewsCount})</span>
                      </span>
                      <span>·</span>
                      <span className="font-mono">{branch.contact}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Branch Focus Card (Right Column) */}
          <div className="lg:col-span-7 bg-brand-sugar border border-brand-caramel/15 p-6 sm:p-10 rounded-xs space-y-6">
            <div className="border-b border-brand-caramel/10 pb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-brand-caramel">
                <span>{activeBranchData.type}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-700">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{activeBranchData.rating} Rated on Google ({activeBranchData.reviewsCount} reviews)</span>
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-chocolate font-normal">
                {activeBranchData.name}
              </h2>
              {activeBranchData.highlight && (
                <p className="text-xs italic text-brand-caramel">
                  Featured: {activeBranchData.highlight}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="font-semibold block text-brand-chocolate text-xs uppercase tracking-wider">
                  Full Street Address
                </span>
                <p className="text-brand-chocolate/80 leading-relaxed">
                  {activeBranchData.address}
                </p>
                {activeBranchData.plusCode && (
                  <span className="text-[11px] text-brand-chocolate/50 font-mono block">
                    Plus Code: {activeBranchData.plusCode}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-semibold block text-brand-chocolate text-xs uppercase tracking-wider">
                  Operating Hours
                </span>
                <p className="text-brand-chocolate/80 font-mono">
                  {activeBranchData.openingHours || '08:00 AM – 12:00 AM Daily'}
                </p>
                <span className="text-[11px] text-brand-chocolate/50 block">
                  Fresh bakery batches delivered twice daily
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-semibold block text-brand-chocolate text-xs uppercase tracking-wider">
                  Direct Telephone
                </span>
                <a
                  href={`tel:${activeBranchData.contact.replace(/\s+/g, '')}`}
                  className="font-mono text-base font-bold text-brand-caramel hover:underline block"
                >
                  {activeBranchData.contact}
                </a>
              </div>

              <div className="space-y-1">
                <span className="font-semibold block text-brand-chocolate text-xs uppercase tracking-wider">
                  Available Services
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {activeBranchData.deliveryOptions.map(opt => (
                    <span key={opt} className="text-[11px] bg-brand-cream border border-brand-caramel/15 px-2 py-0.5 rounded-xs font-medium text-brand-chocolate/80">
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Maps Actions */}
            <div className="pt-4 border-t border-brand-caramel/10 flex flex-wrap items-center gap-4">
              <a
                href={activeBranchData.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-chocolate text-brand-cream hover:bg-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs shadow-xs"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={`tel:${activeBranchData.contact.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3 border border-brand-caramel/25 text-brand-chocolate hover:bg-brand-cream transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Branch</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
