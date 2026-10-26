'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { QuestionCard } from '@/components/QuestionCard';
import { PostCard } from '@/components/PostCard';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle,
  MapPin,
  Clock,
  BookOpen,
  GraduationCap,
  MessageSquare,
  UserPlus,
  UserCheck,
  Award,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface ExpertProfileClientProps {
  expertId: string;
}

export default function ExpertProfileClient({ expertId }: ExpertProfileClientProps) {
  const { t, locale, experts, questions, posts, followedExpertIds, toggleFollowExpert } = useApp();
  const [activeTab, setActiveTab] = useState<'answers' | 'posts' | 'about'>('answers');

  const expert = experts.find((e) => e.id === expertId);

  if (!expert) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F9F8] text-[#16231E]">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto p-8 text-center my-auto space-y-4">
          <h1 className="text-2xl font-bold text-[#16231E]">Expert introuvable</h1>
          <p className="text-sm text-[#55655F]">
            Le profil de l&apos;expert que vous recherchez n&apos;existe pas ou a été retiré.
          </p>
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] transition"
          >
            <span>Retour à l&apos;annuaire des experts</span>
          </Link>
        </main>
      </div>
    );
  }

  const isFollowing = followedExpertIds.includes(expert.id);
  const displayName = locale === 'ar' ? expert.displayNameAr : expert.displayName;
  const title = locale === 'ar' ? expert.titleAr : expert.title;

  // Filter public answers given by this expert (only answered and publishable)
  const expertAnswers = questions.filter(
    (q) =>
      q.answers.some((a) => a.expertId === expert.id) &&
      q.publishAnswerConsent === true &&
      q.status === 'answered'
  );

  // Filter posts by this expert
  const expertPosts = posts.filter((p) => p.expertId === expert.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F8] text-[#16231E]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#55655F] hover:text-[#16231E] transition-colors"
          >
            {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>Retour à l&apos;annuaire des experts</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <section className="bg-white border border-[#DCE5E0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_1px_2px_rgba(16,60,49,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-5">
              {/* Avatar circle */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#1F7A5E] text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-[0_2px_8px_rgba(16,60,49,0.12)] shrink-0">
                {displayName.charAt(0)}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16231E] tracking-tight">
                    {displayName}
                  </h1>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FBF1D8] text-[#7A5810] border border-[#E6CF93]"
                    title="Diplômes vérifiés par le comité académique"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#7A5810]" />
                    <span>Diplômes vérifiés</span>
                  </span>
                </div>

                <p className="text-sm sm:text-base font-medium text-[#19634D]">
                  {title}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#7A8A84] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{expert.city} ({expert.wilaya})</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Délai moyen de réponse : &lt; 24h</span>
                  </span>
                </div>

                {/* Specialties chips */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
                  {expert.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons - EXACT SAME DIMENSIONS, HEIGHT, PADDING AND WEIGHT */}
            <div className="flex flex-col sm:flex-col items-stretch sm:items-end justify-center gap-2.5 shrink-0 w-full sm:w-56">
              {expert.acceptsDirect ? (
                <Link
                  href={`/poser-une-question?expertId=${expert.id}`}
                  className="w-full sm:w-56 h-11 inline-flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Poser une question</span>
                </Link>
              ) : (
                <div className="w-full sm:w-56 h-11 inline-flex items-center justify-center text-xs font-semibold text-[#8A5A00] bg-[#FFF3D6] border border-[#EBD08E] rounded-xl text-center px-3">
                  <span>Quota temporairement atteint</span>
                </div>
              )}

              <button
                onClick={() => toggleFollowExpert(expert.id)}
                className={`w-full sm:w-56 h-11 inline-flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-semibold transition-colors cursor-pointer border ${
                  isFollowing
                    ? 'bg-[#D6EDE3] text-[#103C31] border-[#80C3A9] hover:bg-[#AEDAC8]'
                    : 'bg-[#EEF7F3] text-[#154F3F] border-[#AEDAC8] hover:bg-[#D6EDE3]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 text-[#154F3F]" />
                    <span>Abonné</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-[#154F3F]" />
                    <span>Suivre l&apos;expert</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Stats Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#DCE5E0] text-center">
            <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#DCE5E0]">
              <div className="text-xl sm:text-2xl font-extrabold text-[#16231E]">
                {expert.questionsAnsweredCount}
              </div>
              <div className="text-[11px] text-[#7A8A84] mt-0.5">
                {t.experts.answersGiven}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#DCE5E0]">
              <div className="text-xl sm:text-2xl font-extrabold text-[#16231E]">
                {expert.followersCount}
              </div>
              <div className="text-[11px] text-[#7A8A84] mt-0.5">
                {t.experts.followers}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#DCE5E0]">
              <div className="text-xl sm:text-2xl font-extrabold text-[#16231E]">
                {expert.postsCount}
              </div>
              <div className="text-[11px] text-[#7A8A84] mt-0.5">
                {t.experts.postsCount}
              </div>
            </div>
          </div>
        </section>

        {/* Qualifications and Degrees Card */}
        <section className="bg-white border border-[#DCE5E0] rounded-2xl p-6 space-y-4 shadow-[0_1px_2px_rgba(16,60,49,0.06)]">
          <div className="flex items-center gap-2 text-[#16231E] border-b border-[#DCE5E0] pb-3">
            <GraduationCap className="w-5 h-5 text-[#1F7A5E]" />
            <h2 className="text-base font-bold tracking-tight">
              Diplômes, Ijazates & Qualifications vérifiés
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expert.credentials.map((cred) => (
              <div
                key={cred.id}
                className="p-4 rounded-xl border border-[#DCE5E0] bg-[#F7F9F8] space-y-1"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1F7A5E]" />
                  <span className="text-sm font-bold text-[#16231E]">
                    {locale === 'ar' ? cred.titleAr : cred.title}
                  </span>
                </div>
                <div className="text-xs text-[#55655F] ps-6">
                  {cred.institution} • Promotion {cred.year}
                </div>
                <div className="text-[11px] text-[#19634D] font-medium ps-6 flex items-center gap-1 pt-1">
                  <CheckCircle className="w-3 h-3 text-[#1F7A5E]" />
                  <span>Dossier original vérifié auprès des registres académiques</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Tabs Navigation */}
        <div className="border-b border-[#DCE5E0] flex items-center gap-3 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('answers')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'answers'
                ? 'border-[#1F7A5E] text-[#1F7A5E]'
                : 'border-transparent text-[#7A8A84] hover:text-[#16231E]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Avis jurisprudentiels ({expertAnswers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'posts'
                ? 'border-[#1F7A5E] text-[#1F7A5E]'
                : 'border-transparent text-[#7A8A84] hover:text-[#16231E]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Billets de réflexion ({expertPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'about'
                ? 'border-[#1F7A5E] text-[#1F7A5E]'
                : 'border-transparent text-[#7A8A84] hover:text-[#16231E]'
            }`}
          >
            <span>Biographie & Démarche</span>
          </button>
        </div>

        {/* Tab 1: Answers */}
        {activeTab === 'answers' && (
          <div className="space-y-5">
            {expertAnswers.length === 0 ? (
              <div className="bg-white border border-[#DCE5E0] rounded-2xl p-8 text-center text-sm text-[#7A8A84]">
                Aucune réponse publique archivée pour cet expert pour le moment.
              </div>
            ) : (
              expertAnswers.map((q) => <QuestionCard key={q.id} question={q} />)
            )}
          </div>
        )}

        {/* Tab 2: Posts */}
        {activeTab === 'posts' && (
          <div className="space-y-5">
            {expertPosts.length === 0 ? (
              <div className="bg-white border border-[#DCE5E0] rounded-2xl p-8 text-center text-sm text-[#7A8A84]">
                Aucun billet rédigé par cet expert pour le moment.
              </div>
            ) : (
              expertPosts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </div>
        )}

        {/* Tab 3: About & Bio */}
        {activeTab === 'about' && (
          <div className="bg-white border border-[#DCE5E0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_1px_2px_rgba(16,60,49,0.06)]">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#16231E]">
                Présentation détaillée
              </h3>
              <p className="text-base text-[#55655F] leading-relaxed whitespace-pre-line">
                {expert.bioFr}
              </p>
            </div>

            <div className="pt-4 border-t border-[#DCE5E0] space-y-3" dir="rtl">
              <h3 className="text-lg font-bold text-[#16231E]">
                نبذة تفصيلية باللغة العربية
              </h3>
              <p className="text-base text-[#55655F] leading-relaxed font-serif-ar whitespace-pre-line">
                {expert.bioAr}
              </p>
            </div>

            <div className="pt-4 border-t border-[#DCE5E0] bg-[#F7F9F8] p-4 rounded-xl text-xs text-[#55655F] space-y-1">
              <div className="font-semibold text-[#16231E]">
                Rappel sur la déontologie des réponses :
              </div>
              <p>
                Les avis formulés sont à vocation éducative et éthique, fondés
                sur les sources jurisprudentielles reconnues. L&apos;expert répond
                en respectant la stricte confidentialité des demandeurs anonymes.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
