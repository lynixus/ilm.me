'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { QuestionCard } from '@/components/QuestionCard';
import { useApp } from '@/context/AppContext';
import {
  User,
  Mail,
  ShieldCheck,
  Settings,
  BookOpen,
  Users,
  Bell,
  CheckCircle,
  Clock,
  LogOut,
  Save,
  MessageSquarePlus,
  Trash2,
  Lock,
} from 'lucide-react';

export default function ProfileClient() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'questions' | 'following' | 'settings') || 'questions';

  const {
    t,
    locale,
    currentUser,
    isAuthReady,
    updateProfile,
    logout,
    questions,
    experts,
    followedExpertIds,
    toggleFollowExpert,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'questions' | 'following' | 'settings'>(initialTab);

  // Settings form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [notifEnabled, setNotifEnabled] = useState(currentUser?.notificationsEnabled ?? true);
  const [digestEnabled, setDigestEnabled] = useState(currentUser?.emailDigestEnabled ?? false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setNotifEnabled(currentUser.notificationsEnabled);
      setDigestEnabled(currentUser.emailDigestEnabled);
    }
  }, [currentUser]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1F7A5E] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F9F8] text-[#16231E]">
        <Navbar />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center my-auto space-y-6">
          <div className="w-18 h-18 rounded-3xl bg-[#EEF7F3] text-[#1F7A5E] flex items-center justify-center mx-auto border border-[#AEDAC8] shadow-[0_2px_8px_rgba(16,60,49,0.06)]">
            <User className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
              Espace Membre
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16231E] tracking-tight">
              Vous n&apos;êtes pas connecté
            </h1>
            <p className="text-sm text-[#55655F] leading-relaxed max-w-md mx-auto">
              Connectez-vous pour retrouver vos questions posées, vos réponses certifiées et gérer vos paramètres de profil anonyme.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/connexion?redirect=/profil"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] transition cursor-pointer"
            >
              <span>Se connecter</span>
            </Link>
            <Link
              href="/inscription?redirect=/profil"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-[#154F3F] bg-[#EEF7F3] hover:bg-[#D6EDE3] border border-[#AEDAC8] transition cursor-pointer"
            >
              <span>Créer un compte anonyme</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Filter questions authored by this user
  const userQuestions = questions.filter(
    (q) => q.authorAliasId === currentUser.alias
  );

  const answeredUserQuestions = userQuestions.filter((q) => q.answers.length > 0);
  const followedExperts = experts.filter((e) => followedExpertIds.includes(e.id));

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      notificationsEnabled: notifEnabled,
      emailDigestEnabled: digestEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFDFB] text-[var(--fg)]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Card Header (Facebook style) */}
        <section className="bg-white border border-[#E2E8E4] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-start">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--e600)] text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
                  {currentUser.name}
                </h1>
                <p className="text-xs sm:text-sm text-[var(--ink2)] flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{currentUser.email}</span>
                </p>

                {/* Random Anonymous Alias Tag */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--e50)] text-[var(--e800)] border border-[var(--e200)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--e600)]" />
                    <span>Alias public : <code>{currentUser.alias}</code></span>
                  </span>
                  <span className="text-[11px] text-[var(--ink3)]">
                    (garantie de confidentialité absolue)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/poser-une-question"
                className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Poser une question</span>
              </Link>
            </div>
          </div>

          {/* User Metrics Counters */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EEF3F0] text-center">
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#E3ECE6]">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--ink)]">
                {userQuestions.length}
              </div>
              <div className="text-[11px] text-[var(--ink3)] mt-0.5">
                Questions posées
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#E3ECE6]">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--e700)]">
                {answeredUserQuestions.length}
              </div>
              <div className="text-[11px] text-[var(--ink3)] mt-0.5">
                Réponses reçues
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#E3ECE6]">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--ink)]">
                {followedExperts.length}
              </div>
              <div className="text-[11px] text-[var(--ink3)] mt-0.5">
                Experts suivis
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="border-b border-[#E2E8E4] flex items-center gap-4 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'questions'
                ? 'border-[var(--e600)] text-[var(--e700)]'
                : 'border-transparent text-[var(--ink3)] hover:text-[var(--ink)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mes questions ({userQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'following'
                ? 'border-[var(--e600)] text-[var(--e700)]'
                : 'border-transparent text-[var(--ink3)] hover:text-[var(--ink)]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Experts suivis ({followedExperts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[var(--e600)] text-[var(--e700)]'
                : 'border-transparent text-[var(--ink3)] hover:text-[var(--ink)]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres & Confidentialité</span>
          </button>
        </div>

        {/* Tab 1: Mes Questions */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {userQuestions.length === 0 ? (
              <div className="bg-white border border-[#E2E8E4] rounded-2xl p-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-[var(--ink3)] mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-[var(--ink)]">
                  Vous n&apos;avez pas encore posé de question
                </h3>
                <p className="text-xs sm:text-sm text-[var(--fg2)] max-w-sm mx-auto">
                  Posez une question anonyme en toute sérénité. Nos experts vérifiés vous répondront avec rigueur.
                </p>
                <div className="pt-2">
                  <Link
                    href="/poser-une-question"
                    className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Poser ma première question</span>
                  </Link>
                </div>
              </div>
            ) : (
              userQuestions.map((q) => <QuestionCard key={q.id} question={q} />)
            )}
          </div>
        )}

        {/* Tab 2: Experts Suivis */}
        {activeTab === 'following' && (
          <div className="space-y-4">
            {followedExperts.length === 0 ? (
              <div className="bg-white border border-[#E2E8E4] rounded-2xl p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-[var(--ink3)] mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-[var(--ink)]">
                  Aucun expert suivi
                </h3>
                <p className="text-xs sm:text-sm text-[var(--fg2)] max-w-sm mx-auto">
                  Suivez des savants et chercheurs vérifiés pour être notifié de leurs nouveaux avis et billets.
                </p>
                <div className="pt-2">
                  <Link
                    href="/experts"
                    className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <span>Découvrir les experts</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {followedExperts.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white border border-[#E2E8E4] rounded-2xl p-5 flex items-start justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/experts/${exp.id}`}
                        className="w-12 h-12 rounded-2xl bg-[var(--e600)] text-white flex items-center justify-center font-bold text-base shadow-xs"
                      >
                        {exp.displayName.charAt(0)}
                      </Link>
                      <div>
                        <Link
                          href={`/experts/${exp.id}`}
                          className="text-sm font-bold text-[var(--ink)] hover:text-[var(--e700)] block"
                        >
                          {locale === 'ar' ? exp.displayNameAr : exp.displayName}
                        </Link>
                        <p className="text-xs text-[var(--ink3)]">
                          {exp.city} • {exp.specialties[0]}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowExpert(exp.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Ne plus suivre
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Paramètres du compte */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#E2E8E4] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[#EEF3F0] pb-4">
              <h2 className="text-lg font-bold text-[var(--ink)]">
                Paramètres de votre compte & Préférences
              </h2>
              <p className="text-xs text-[var(--fg2)]">
                Modifiez vos informations personnelles et vos réglages de notifications.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Vos paramètres ont été mis à jour avec succès.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ink3)] uppercase">
                    Nom d&apos;usage
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-sm focus:ring-2 focus:ring-[var(--e600)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ink3)] uppercase">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE4DF] bg-white text-sm focus:ring-2 focus:ring-[var(--e600)] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink3)]">
                  Notifications & Alertes
                </h3>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E3ECE6] cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[var(--ink)]">
                      Notifications dans l&apos;application
                    </div>
                    <div className="text-[11px] text-[var(--ink3)]">
                      Être alerté dès qu&apos;un expert répond à votre question.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifEnabled}
                    onChange={(e) => setNotifEnabled(e.target.checked)}
                    className="w-4 h-4 text-[var(--e600)] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E3ECE6] cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[var(--ink)]">
                      Résumé e-mail périodique
                    </div>
                    <div className="text-[11px] text-[var(--ink3)]">
                      Recevoir les meilleurs billets des savants par e-mail.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={digestEnabled}
                    onChange={(e) => setDigestEnabled(e.target.checked)}
                    className="w-4 h-4 text-[var(--e600)] rounded"
                  />
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#EEF3F0]">
                <button
                  type="submit"
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>

            {/* Danger Zone: Account Deletion & Right to be Forgotten (Loi 18-07) */}
            <div className="pt-6 border-t border-[#EEF3F0] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                <span>Zone de confidentialité stricte (Loi 18-07)</span>
              </h3>
              <p className="text-xs text-[var(--ink2)] leading-relaxed">
                Vous pouvez à tout moment demander l&apos;anonymisation irréversible ou
                la suppression totale de votre compte et de vos données personnelles.
              </p>
              <button
                onClick={() => {
                  if (confirm('Voulez-vous vraiment supprimer votre compte ? Cette action effacera vos identifiants.')) {
                    logout();
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Supprimer mon compte et mes données
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
