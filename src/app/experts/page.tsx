'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ExpertCard } from '@/components/ExpertCard';
import { useApp } from '@/context/AppContext';
import { Users, Search } from 'lucide-react';

export default function ExpertsPage() {
  const { t, experts } = useApp();
  const [expertSearch, setExpertSearch] = useState('');

  const filteredExperts = experts.filter((exp) => {
    if (!expertSearch.trim()) return true;
    const q = expertSearch.toLowerCase();
    const nameFr = exp.displayName.toLowerCase();
    const nameAr = exp.displayNameAr.toLowerCase();
    const city = exp.city.toLowerCase();
    const spec = exp.specialties.join(' ').toLowerCase();
    return nameFr.includes(q) || nameAr.includes(q) || city.includes(q) || spec.includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFDFB] text-[var(--fg)]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E4] pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] flex items-center gap-2.5">
              <Users className="w-7 h-7 text-[var(--e600)]" />
              <span>{t.experts.title}</span>
            </h1>
            <p className="text-sm sm:text-base text-[var(--fg2)]">
              {t.experts.subtitle}
            </p>
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[var(--ink3)]" />
            <input
              type="search"
              value={expertSearch}
              onChange={(e) => setExpertSearch(e.target.value)}
              placeholder="Rechercher par nom, ville, spécialité..."
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-xs focus:ring-2 focus:ring-[var(--e600)] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </main>
    </div>
  );
}
