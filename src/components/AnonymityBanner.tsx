'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export function AnonymityBanner() {
  const { t } = useApp();

  return (
    <div className="w-full bg-[var(--e50)] border-y border-[var(--e200)] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--e600)] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-[var(--e900)] flex items-center gap-2">
              <span>{t.anonymityBadge.title}</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/70 text-[var(--e800)] border border-[var(--e300)] font-medium">
                <Lock className="w-3 h-3" /> Chiffrement zéro-fuite
              </span>
            </h4>
            <p className="text-xs text-[var(--e800)] opacity-90 mt-0.5">
              {t.anonymityBadge.desc}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-xs text-[var(--e800)] font-medium">
          <span className="flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5 text-[var(--e600)]" />
            Identité masquée aux experts
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[var(--e600)]" />
            Aucun traçage d&apos;IP
          </span>
        </div>
      </div>
    </div>
  );
}
