'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { INITIAL_TOPICS } from '@/lib/store';
import { checkDistressContent } from '@/lib/distressDetection';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Send,
  Lock,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  Globe,
  Sparkles,
  MessageCircle,
  EyeOff,
  User,
} from 'lucide-react';

export default function AskQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedExpertId = searchParams.get('expertId') || undefined;

  const { t, locale, experts, addQuestion, currentUser, isAuthReady, login } = useApp();

  const [targetExpertId, setTargetExpertId] = useState<string>(
    preselectedExpertId || experts[0]?.id || ''
  );
  const [topic, setTopic] = useState<string>(INITIAL_TOPICS[0].labelFr);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [lang, setLang] = useState<'fr' | 'ar'>(locale);
  // Système de publication : true = publier anonymement après réponse du mufti, false = 100% privé
  const [publishConsent, setPublishConsent] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [distressDetected, setDistressDetected] = useState(false);
  const [distressBypassed, setDistressBypassed] = useState(false);

  const selectedExpert = experts.find((e) => e.id === targetExpertId) || experts[0];

  // Live distress check
  const handleTextChange = (newTitle: string, newBody: string) => {
    setTitle(newTitle);
    setBody(newBody);
    const hasDistress = checkDistressContent(newTitle + ' ' + newBody);
    setDistressDetected(hasDistress);
    if (!hasDistress) setDistressBypassed(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    addQuestion({
      kind: 'direct',
      targetExpertId: selectedExpert.id,
      targetExpertName: locale === 'ar' ? selectedExpert.displayNameAr : selectedExpert.displayName,
      title: title.trim(),
      body: body.trim(),
      lang,
      topic,
      publishAnswerConsent: publishConsent,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      router.push('/messagerie');
    }, 1800);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#E8F4E8] text-[#276B2A] flex items-center justify-center mx-auto shadow-[0_2px_8px_rgba(16,60,49,0.08)]">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16231E]">
            Question transmise en privé avec succès
          </h2>
          <p className="text-sm sm:text-base text-[#55655F] max-w-lg mx-auto leading-relaxed">
            Votre question a été remise directement à <strong>{selectedExpert.displayName}</strong>.
            Elle n&apos;est pas visible sur le flux public. Redirection vers votre fil de messagerie sécurisée...
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/messagerie"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Accéder à ma messagerie</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthReady) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1F7A5E] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    const redirectUrl = `/poser-une-question${targetExpertId ? `?expertId=${targetExpertId}` : ''}`;
    return (
      <div className="max-w-xl mx-auto py-12 px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#55655F] hover:text-[#16231E] transition-colors"
          >
            {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{locale === 'ar' ? 'العودة إلى الصفحة الرئيسية' : "Retour à l'accueil"}</span>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE5E0] shadow-[0_8px_24px_rgba(16,60,49,0.06)] text-center space-y-6">
          <div className="w-18 h-18 rounded-3xl bg-[#EEF7F3] text-[#1F7A5E] flex items-center justify-center mx-auto border border-[#AEDAC8] shadow-[0_2px_8px_rgba(16,60,49,0.06)]">
            <Lock className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A5E]" />
              {locale === 'ar' ? 'استشارة خاصة وسرية' : 'Consultation privée & confidentielle'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16231E] tracking-tight">
              {locale === 'ar'
                ? 'يرجى تسجيل الدخول لطرح سؤالك'
                : 'Connexion requise pour poser une question'}
            </h1>
            <p className="text-sm text-[#55655F] leading-relaxed max-w-md mx-auto">
              {selectedExpert
                ? `Pour adresser votre question en toute discrétion à ${selectedExpert.displayName} et recevoir sa réponse dans votre messagerie privée, vous devez disposer d'un compte membre.`
                : "Pour échanger en toute discrétion avec nos savants certifiés et recevoir leur réponse dans votre messagerie privée, vous devez être connecté."}
            </p>
          </div>

          {/* Anonymity guarantee callout */}
          <div className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#DCE5E0] text-start space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16231E]">
              <EyeOff className="w-4 h-4 text-[#1F7A5E]" />
              <span>Votre identité reste 100% masquée au mufti</span>
            </div>
            <p className="text-xs text-[#55655F] leading-relaxed">
              Le savant ne voit <strong>jamais</strong> votre vrai nom ni votre e-mail. Seul un identifiant chiffré unique (ex: <code>alias-8f3a</code>) lui est transmis. Votre anonymat spirituel est total.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/connexion?redirect=${encodeURIComponent(redirectUrl)}`}
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Se connecter</span>
            </Link>
            <Link
              href={`/inscription?redirect=${encodeURIComponent(redirectUrl)}`}
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-[#154F3F] bg-[#EEF7F3] hover:bg-[#D6EDE3] border border-[#AEDAC8] transition cursor-pointer"
            >
              <span>Créer un compte</span>
            </Link>
          </div>

          {/* 1-Click quick test demo login */}
          <div className="pt-4 border-t border-[#DCE5E0]">
            <div className="text-[11px] font-semibold text-[#7A8A84] uppercase tracking-wider mb-2">
              Démo rapide (1 clic pour tester)
            </div>
            <button
              type="button"
              onClick={async () => {
                await login('user@ilm.me', 'demo123');
              }}
              className="w-full p-3 rounded-xl bg-[#F7F9F8] border border-[#DCE5E0] hover:border-[#1F7A5E] hover:bg-[#EEF7F3] transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF7F3] text-[#1F7A5E] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#1F7A5E] group-hover:text-white transition">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#16231E]">
                    Se connecter en tant que Karim Brahimi
                  </div>
                  <div className="text-[10px] text-[#7A8A84]">user@ilm.me (compte utilisateur test)</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#1F7A5E] group-hover:translate-x-0.5 transition-transform">
                Déverrouiller →
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#55655F] hover:text-[#16231E] transition-colors"
        >
          {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>Retour au flux</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-10 space-y-8 rounded-2xl border border-[#DCE5E0] shadow-[0_1px_2px_rgba(16,60,49,0.06)]">
        {/* Title & Introduction */}
        <div className="space-y-2 border-b border-[#DCE5E0] pb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A5E]" />
            Consultation privée & anonyme
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16231E] tracking-tight">
            Poser une question à un mufti certifié
          </h1>
          <p className="text-sm text-[#55655F] leading-relaxed">
            Votre question est transmise en privé dans votre messagerie. Seul le mufti peut la lire.
            Elle ne sera <strong>jamais publiée sur le flux public</strong> sans votre accord et sans que le mufti y ait répondu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Emergency distress banner if detected */}
          {distressDetected && !distressBypassed && (
            <div className="rounded-2xl border border-[#6B4FA0] bg-[#F0EBF8] p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-full bg-[#6B4FA0] text-white shrink-0 mt-0.5">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-[#6B4FA0]">
                    {t.askModal.distressDetectedTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#16231E] leading-relaxed">
                    {t.askModal.distressDetectedDesc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#6B4FA0]/20">
                {t.askModal.emergencyHelplines.map((line, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3 text-center border border-[#6B4FA0]/20 shadow-xs"
                  >
                    <div className="text-[11px] font-medium text-[#55655F]">
                      {line.label}
                    </div>
                    <div className="text-base font-bold text-[#6B4FA0] mt-0.5" dir="ltr">
                      {line.phone}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setDistressBypassed(true)}
                  className="text-xs text-[#6B4FA0] hover:underline font-semibold cursor-pointer"
                >
                  {t.askModal.understandAndContinue}
                </button>
              </div>
            </div>
          )}

          {/* 1. Destinataire : Choisir l'expert */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A8A84]">
              1. Destinataire de votre question (Mufti ou Enseignant)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experts
                .filter((e) => e.acceptsDirect)
                .map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setTargetExpertId(exp.id)}
                    className={`p-3.5 rounded-xl border text-start flex items-start gap-3 transition-colors cursor-pointer ${
                      targetExpertId === exp.id
                        ? 'border-[#1F7A5E] bg-[#EEF7F3] ring-2 ring-[#1F7A5E]/20 shadow-xs'
                        : 'border-[#DCE5E0] bg-white hover:border-[#80C3A9]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1F7A5E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {exp.displayName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#16231E] truncate">
                        {locale === 'ar' ? exp.displayNameAr : exp.displayName}
                      </div>
                      <div className="text-[11px] text-[#19634D] truncate">
                        {exp.city} • {exp.specialties[0]}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* 2. Topic & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A8A84]">
                2. Domaine jurisprudentiel
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE5E0] bg-white text-sm font-medium text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden"
              >
                {INITIAL_TOPICS.map((top) => (
                  <option key={top.id} value={top.labelFr}>
                    {locale === 'ar' ? top.labelAr : top.labelFr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A8A84]">
                3. Langue de rédaction
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLang('fr')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    lang === 'fr'
                      ? 'border-[#1F7A5E] bg-[#EEF7F3] text-[#154F3F]'
                      : 'border-[#DCE5E0] hover:bg-[#F7F9F8] text-[#55655F]'
                  }`}
                >
                  Français (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('ar')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    lang === 'ar'
                      ? 'border-[#1F7A5E] bg-[#EEF7F3] text-[#154F3F]'
                      : 'border-[#DCE5E0] hover:bg-[#F7F9F8] text-[#55655F]'
                  }`}
                  dir="rtl"
                >
                  العربية (RTL)
                </button>
              </div>
            </div>
          </div>

          {/* 3. Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A8A84]">
              4. Objet / Titre synthétique
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTextChange(e.target.value, body)}
              placeholder="ex: Raccourcissement de la prière lors d'un déplacement professionnel"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="w-full px-4 py-3 rounded-xl border border-[#DCE5E0] bg-white text-sm sm:text-base text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden"
            />
          </div>

          {/* 4. Body */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A8A84]">
              5. Exposé précis de votre question
            </label>
            <textarea
              required
              rows={6}
              value={body}
              onChange={(e) => handleTextChange(title, e.target.value)}
              placeholder="Décrivez votre situation avec calme et sincérité. N'incluez aucun nom propre, numéro ou détail géographique permettant de vous identifier..."
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="w-full px-4 py-3.5 rounded-xl border border-[#DCE5E0] bg-white text-sm sm:text-base text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden resize-y min-h-[140px] leading-relaxed"
            />
          </div>

          {/* 5. Choix de publication après réponse du mufti */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A8A84]">
              6. Système de publication après réponse
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Publier anonymement pour l'utilité publique une fois répondu */}
              <div
                onClick={() => setPublishConsent(true)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  publishConsent
                    ? 'border-[#1F7A5E] bg-[#EEF7F3] ring-2 ring-[#1F7A5E]/20'
                    : 'border-[#DCE5E0] bg-white hover:bg-[#F7F9F8]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <input
                    type="radio"
                    name="publishConsent"
                    checked={publishConsent}
                    onChange={() => setPublishConsent(true)}
                    className="text-[#1F7A5E] focus:ring-[#1F7A5E]"
                  />
                  <span className="text-xs font-bold text-[#16231E] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#1F7A5E]" />
                    Publication sur le flux après réponse
                  </span>
                </div>
                <p className="text-[11px] text-[#55655F] leading-relaxed">
                  L&apos;échange reste privé jusqu&apos;à la réponse. Une fois que le mufti aura répondu, la question et son avis seront publiés de façon <strong>100% anonymisée</strong> pour faire bénéficier la communauté.
                </p>
              </div>

              {/* Option 2: Strictly private */}
              <div
                onClick={() => setPublishConsent(false)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  !publishConsent
                    ? 'border-[#1F7A5E] bg-[#EEF7F3] ring-2 ring-[#1F7A5E]/20'
                    : 'border-[#DCE5E0] bg-white hover:bg-[#F7F9F8]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <input
                    type="radio"
                    name="publishConsent"
                    checked={!publishConsent}
                    onChange={() => setPublishConsent(false)}
                    className="text-[#1F7A5E] focus:ring-[#1F7A5E]"
                  />
                  <span className="text-xs font-bold text-[#16231E] flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-[#7A8A84]" />
                    Consultation 100% privée (Jamais publiée)
                  </span>
                </div>
                <p className="text-[11px] text-[#55655F] leading-relaxed">
                  L&apos;échange et la réponse resteront <strong>exclusivement dans votre messagerie privée</strong> avec le mufti. Rien ne sera jamais visible sur le fil public.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#DCE5E0]">
            <div className="text-xs text-[#7A8A84] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1F7A5E]" />
              <span>Garantie zéro-fuite : identité strictement masquée</span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] cursor-pointer w-full sm:w-auto transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer ma question au mufti</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
