'use client';

import React from 'react';
import Link from 'next/link';
import { ExpertProfile } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle,
  MapPin,
  GraduationCap,
  MessageSquare,
  UserPlus,
  UserCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ExpertCardProps {
  expert: ExpertProfile;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  const { t, locale, followedExpertIds, toggleFollowExpert } = useApp();
  const isFollowing = followedExpertIds.includes(expert.id);

  const displayName = locale === 'ar' ? expert.displayNameAr : expert.displayName;
  const title = locale === 'ar' ? expert.titleAr : expert.title;
  const bio = locale === 'ar' ? expert.bioAr : expert.bioFr;

  return (
    <article className="bg-white border border-[#DCE5E0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-[0_1px_2px_rgba(16,60,49,0.06)] hover:shadow-[0_2px_8px_rgba(16,60,49,0.08)] hover:border-[#80C3A9] transition-all">
      {/* Header Profile */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <Link
            href={`/experts/${expert.id}`}
            className="w-13 h-13 rounded-2xl bg-[#1F7A5E] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs hover:bg-[#19634D] transition-colors"
          >
            {displayName.charAt(0)}
          </Link>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/experts/${expert.id}`}
                className="text-base font-bold text-[#16231E] hover:text-[#19634D] transition-colors"
              >
                {displayName}
              </Link>
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.2 rounded-full bg-[#FBF1D8] text-[#7A5810] border border-[#E6CF93]"
                title="Diplômes vérifiés par le comité académique"
              >
                <CheckCircle className="w-3 h-3 text-[#7A5810]" />
                <span>Vérifié</span>
              </span>
            </div>
            <p className="text-xs font-medium text-[#19634D] mt-0.5">
              {title}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#7A8A84] mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{expert.city} ({expert.wilaya})</span>
            </div>
          </div>
        </div>

        {/* Follow Button - h-9 matching the actions */}
        <button
          onClick={() => toggleFollowExpert(expert.id)}
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 h-9 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
            isFollowing
              ? 'bg-[#D6EDE3] text-[#103C31] border-[#80C3A9] hover:bg-[#AEDAC8]'
              : 'bg-[#EEF7F3] text-[#154F3F] border-[#AEDAC8] hover:bg-[#D6EDE3]'
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-[#154F3F]" />
              <span>Abonné</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5 text-[#154F3F]" />
              <span>Suivre</span>
            </>
          )}
        </button>
      </div>

      {/* Bio */}
      <p className="text-xs sm:text-sm text-[#55655F] leading-relaxed line-clamp-3">
        {bio}
      </p>

      {/* Credentials preview */}
      {expert.credentials.length > 0 && (
        <div className="bg-[#F7F9F8] rounded-xl p-3 border border-[#DCE5E0] space-y-1">
          <div className="text-[11px] font-bold text-[#7A8A84] uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#1F7A5E]" />
            <span>Diplômes académiques</span>
          </div>
          <div className="text-xs text-[#16231E] font-medium">
            {expert.credentials[0].title} — <span className="text-[#55655F]">{expert.credentials[0].institution}</span>
          </div>
        </div>
      )}

      {/* Specialties Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {expert.specialties.map((spec, idx) => (
          <span
            key={idx}
            className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Stats & Direct Question Action */}
      <div className="pt-3 border-t border-[#DCE5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-[#55655F]">
          <span>
            <strong className="text-[#16231E] font-bold">
              {expert.questionsAnsweredCount}
            </strong>{' '}
            réponses
          </span>
          <span>•</span>
          <span>
            <strong className="text-[#16231E] font-bold">
              {expert.followersCount}
            </strong>{' '}
            abonnés
          </span>
        </div>

        {/* Buttons Group with IDENTICAL h-9, rounded-xl, and text-xs */}
        <div className="flex items-center gap-2">
          <Link
            href={`/experts/${expert.id}`}
            className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold text-[#55655F] hover:text-[#16231E] bg-[#F7F9F8] hover:bg-[#EEF7F3] border border-[#DCE5E0] transition"
          >
            <span>Voir profil</span>
            {locale === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>

          {expert.acceptsDirect ? (
            <Link
              href={`/poser-une-question?expertId=${expert.id}`}
              className="h-9 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Poser une question</span>
            </Link>
          ) : (
            <span className="h-9 inline-flex items-center justify-center text-xs text-[#8A5A00] bg-[#FFF3D6] border border-[#EBD08E] px-3 rounded-xl font-medium">
              Quota atteint
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
