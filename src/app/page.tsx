'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { QuestionCard } from '@/components/QuestionCard';
import { useApp } from '@/context/AppContext';
import { INITIAL_TOPICS } from '@/lib/store';
import {
  Search,
  MessageSquarePlus,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { t, locale, questions, experts } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Ne publier sur le flux public QUE les questions répondues par un mufti/expert ET autorisées à la publication
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => q.status === 'answered' && q.answers.length > 0 && q.publishAnswerConsent === true)
      .filter((q) => {
        if (selectedTopic !== 'all' && q.topic !== selectedTopic) {
          return false;
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = q.title.toLowerCase().includes(query);
          const matchBody = q.body.toLowerCase().includes(query);
          const matchTopic = q.topic.toLowerCase().includes(query);
          return matchTitle || matchBody || matchTopic;
        }
        return true;
      });
  }, [questions, selectedTopic, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#16231E]">
      {/* Top Navigation */}
      <Navbar />

      {/* Subdued Editorial Hero */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#16231E] leading-tight">
          {locale === 'ar' ? (
            <span className="font-serif-ar leading-normal">
              {t.brand.tagline}
            </span>
          ) : (
            <span>{t.brand.tagline}</span>
          )}
        </h1>

        <p className="text-base sm:text-lg text-[#55655F] max-w-xl mx-auto leading-relaxed">
          {t.brand.subTagline}
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/poser-une-question"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold bg-[#1F7A5E] hover:bg-[#19634D] text-white shadow-[0_1px_2px_rgba(16,60,49,0.06)] cursor-pointer transition-colors"
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span>{t.nav.askButton}</span>
          </Link>

          <Link
            href="/experts"
            className="px-5 py-3 rounded-xl text-sm font-semibold border border-[#DCE5E0] bg-[#F7F9F8] hover:bg-[#EEF7F3] text-[#16231E] transition-colors"
          >
            <span>{t.nav.experts}</span>
          </Link>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search and Category Filters */}
            <div className="space-y-3">
              {/* Clean search bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[#7A8A84]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.feed.searchPlaceholder}
                  className="w-full ps-11 pe-4 py-3 rounded-2xl border border-[#DCE5E0] bg-white text-sm text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden shadow-xs"
                />
              </div>

              {/* Topic chips horizontal scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedTopic('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors shrink-0 cursor-pointer ${
                    selectedTopic === 'all'
                      ? 'bg-[#1F7A5E] text-white shadow-xs'
                      : 'bg-white text-[#55655F] border border-[#DCE5E0] hover:bg-[#F7F9F8]'
                  }`}
                >
                  {t.feed.filterAll}
                </button>
                {INITIAL_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.labelFr)}
                    className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 cursor-pointer ${
                      selectedTopic === topic.labelFr
                        ? 'bg-[#1F7A5E] text-white shadow-xs'
                        : 'bg-white text-[#55655F] border border-[#DCE5E0] hover:bg-[#F7F9F8]'
                    }`}
                  >
                    {locale === 'ar' ? topic.labelAr : topic.labelFr}
                  </button>
                ))}
              </div>

              {/* Feed Meta Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A8A84] px-1 pt-1 border-t border-[#DCE5E0]">
                <span className="font-semibold text-[#16231E]">
                  {filteredQuestions.length}{' '}
                  {filteredQuestions.length === 1
                    ? locale === 'ar' ? 'فتوى منشورة' : 'avis jurisprudentiel publié'
                    : locale === 'ar' ? 'فتاوى منشورة' : 'avis jurisprudentiels publiés'}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#19634D] bg-[#EEF7F3] px-2.5 py-0.5 rounded-full border border-[#AEDAC8]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1F7A5E]" />
                  <span>
                    {locale === 'ar'
                      ? 'أسئلة خاصة تمت إجابتها ونُشرت بعد موافقة السائل'
                      : 'Consultations privées répondues & publiées avec accord'}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Feed */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white border border-[#DCE5E0] rounded-2xl p-12 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-[#7A8A84] mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-[#16231E]">
                  {t.feed.emptyTitle}
                </h3>
                <p className="text-sm text-[#55655F] max-w-sm mx-auto">
                  {t.feed.emptyDesc}
                </p>
                <div className="pt-2">
                  <Link
                    href="/poser-une-question"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F7A5E] hover:bg-[#19634D] text-white shadow-xs"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>{t.nav.askButton}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Top Verified Experts Widget */}
            <div className="bg-white border border-[#DCE5E0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_1px_2px_rgba(16,60,49,0.06)]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#16231E] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#1F7A5E]" />
                  <span>{t.experts.title}</span>
                </h3>
                <Link
                  href="/experts"
                  className="text-xs text-[#19634D] hover:underline font-semibold"
                >
                  Voir tout
                </Link>
              </div>

              <div className="space-y-3">
                {experts.slice(0, 3).map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#F7F9F8] border border-[#DCE5E0] hover:border-[#80C3A9] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Link
                        href={`/experts/${exp.id}`}
                        className="w-10 h-10 rounded-xl bg-[#1F7A5E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs hover:bg-[#19634D]"
                      >
                        {exp.displayName.charAt(0)}
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/experts/${exp.id}`}
                          className="text-xs font-bold text-[#16231E] hover:text-[#19634D] block truncate"
                        >
                          {locale === 'ar' ? exp.displayNameAr : exp.displayName}
                        </Link>
                        <p className="text-[11px] text-[#7A8A84] truncate">
                          {exp.city} • {exp.specialties[0]}
                        </p>
                      </div>
                    </div>

                    {exp.acceptsDirect && (
                      <Link
                        href={`/poser-une-question?expertId=${exp.id}`}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-[#DCE5E0] hover:bg-[#EEF7F3] text-[#154F3F] shrink-0 transition-colors"
                      >
                        Demander
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Charter Guarantees */}
            <div className="bg-[#EEF7F3]/70 border border-[#AEDAC8] rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#103C31] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1F7A5E]" />
                <span>Principes fondamentaux</span>
              </h3>
              <ul className="text-xs text-[#103C31]/90 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A5E] mt-1.5 shrink-0" />
                  <span>
                    <strong>Anonymat absolu :</strong> les experts ne connaissent jamais l&apos;identité du demandeur.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A5E] mt-1.5 shrink-0" />
                  <span>
                    <strong>Experts diplômés & certifiés :</strong> vérification des diplômes d&apos;État et ijazates.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A5E] mt-1.5 shrink-0" />
                  <span>
                    <strong>Aucune IA théologique :</strong> seuls des savants et enseignants humains répondent.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
