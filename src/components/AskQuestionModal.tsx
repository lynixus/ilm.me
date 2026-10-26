'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { INITIAL_TOPICS } from '@/lib/store';
import { checkDistressContent } from '@/lib/distressDetection';
import {
  X,
  MessageSquare,
  Send,
  Lock,
  AlertTriangle,
  PhoneCall,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExpertId?: string;
}

export function AskQuestionModal({
  isOpen,
  onClose,
  defaultExpertId,
}: AskQuestionModalProps) {
  const { t, locale, experts, addQuestion } = useApp();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [kind, setKind] = useState<'feed' | 'direct'>(
    defaultExpertId ? 'direct' : 'feed'
  );
  const [targetExpertId, setTargetExpertId] = useState<string>(
    defaultExpertId || experts[0]?.id || ''
  );
  const [topic, setTopic] = useState<string>(INITIAL_TOPICS[0].labelFr);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [lang, setLang] = useState<'fr' | 'ar'>(locale);
  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [distressDetected, setDistressDetected] = useState(false);
  const [distressBypassed, setDistressBypassed] = useState(false);

  // Manage native <dialog> lifecycle
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle ESC or native close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  // Live distress detection
  useEffect(() => {
    const isDistress = checkDistressContent(title + ' ' + body);
    setDistressDetected(isDistress);
    if (!isDistress) {
      setDistressBypassed(false);
    }
  }, [title, body]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const selectedExpert = experts.find((e) => e.id === targetExpertId);

    addQuestion({
      kind,
      targetExpertId: kind === 'direct' ? targetExpertId : undefined,
      targetExpertName:
        kind === 'direct' && selectedExpert
          ? locale === 'ar'
            ? selectedExpert.displayNameAr
            : selectedExpert.displayName
          : undefined,
      title: title.trim(),
      body: body.trim(),
      lang,
      topic,
      publishAnswerConsent: consent,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setBody('');
      onClose();
    }, 1800);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="ask-dialog-title"
      className="m-auto w-full max-w-2xl rounded-2xl border border-[var(--pl)] bg-[var(--pg)] text-[var(--fg)] p-0 shadow-2xl backdrop:bg-black/50"
    >
      <div className="p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--pl)] pb-4">
          <div>
            <h3
              id="ask-dialog-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)] flex items-center gap-2"
            >
              <MessageSquare className="w-6 h-6 text-[var(--e600)]" />
              <span>{t.askModal.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[var(--fg2)] mt-1">
              {t.askModal.anonymityReminder}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--ink3)] hover:text-[var(--ink)] rounded-lg hover:bg-[var(--ps)] transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--okbg)] text-[var(--ok)] flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-[var(--ink)]">
              {t.common.success}
            </h4>
            <p className="text-sm text-[var(--fg2)] max-w-md">
              Votre question a été enregistrée en toute confidentialité. Elle a
              été transmise pour examen et recevra une réponse d&apos;expert
              dans les meilleurs délais.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Distress Urgent Resources Notice if triggered */}
            {distressDetected && !distressBypassed && (
              <div className="rounded-xl border border-[var(--care)] bg-[var(--carebg)] p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-[var(--care)] text-white shrink-0 mt-0.5">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[var(--care)]">
                      {t.askModal.distressDetectedTitle}
                    </h5>
                    <p className="text-xs text-[var(--ink)] mt-1 leading-relaxed">
                      {t.askModal.distressDetectedDesc}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-2 pt-2 border-t border-[var(--care)]/20">
                  {t.askModal.emergencyHelplines.map((line, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 dark:bg-black/30 rounded-lg p-2.5 text-center border border-[var(--care)]/20"
                    >
                      <div className="text-[11px] font-medium text-[var(--ink2)]">
                        {line.label}
                      </div>
                      <div className="text-base font-bold text-[var(--care)] mt-0.5" dir="ltr">
                        {line.phone}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setDistressBypassed(true)}
                    className="text-xs text-[var(--care)] hover:underline font-semibold"
                  >
                    {t.askModal.understandAndContinue}
                  </button>
                </div>
              </div>
            )}

            {/* Destination choice: Feed vs Direct */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink3)]">
                {t.askModal.typeChoiceLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setKind('feed')}
                  className={`p-3.5 rounded-xl border text-start transition-all ${
                    kind === 'feed'
                      ? 'border-[var(--e600)] bg-[var(--e50)] ring-2 ring-[var(--e600)]/20'
                      : 'border-[var(--pl)] hover:bg-[var(--ps)]'
                  }`}
                >
                  <div className="text-sm font-semibold text-[var(--ink)]">
                    {t.askModal.feedChoice}
                  </div>
                  <div className="text-xs text-[var(--fg2)] mt-1">
                    {t.askModal.feedChoiceDesc}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setKind('direct')}
                  className={`p-3.5 rounded-xl border text-start transition-all ${
                    kind === 'direct'
                      ? 'border-[var(--e600)] bg-[var(--e50)] ring-2 ring-[var(--e600)]/20'
                      : 'border-[var(--pl)] hover:bg-[var(--ps)]'
                  }`}
                >
                  <div className="text-sm font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[var(--e600)]" />
                    <span>{t.askModal.directChoice}</span>
                  </div>
                  <div className="text-xs text-[var(--fg2)] mt-1">
                    {t.askModal.directChoiceDesc}
                  </div>
                </button>
              </div>
            </div>

            {/* If direct, select expert */}
            {kind === 'direct' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink3)]">
                  {t.askModal.selectExpert}
                </label>
                <select
                  value={targetExpertId}
                  onChange={(e) => setTargetExpertId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pl)] bg-[var(--pg)] text-sm font-medium focus:ring-2 focus:ring-[var(--e600)] focus:outline-hidden"
                >
                  {experts
                    .filter((exp) => exp.acceptsDirect)
                    .map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {locale === 'ar' ? exp.displayNameAr : exp.displayName} —{' '}
                        {exp.city} ({exp.specialties.join(', ')})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Topic & Language selection in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink3)]">
                  {t.askModal.topicLabel}
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pl)] bg-[var(--pg)] text-sm font-medium focus:ring-2 focus:ring-[var(--e600)] focus:outline-hidden"
                >
                  {INITIAL_TOPICS.map((top) => (
                    <option key={top.id} value={top.labelFr}>
                      {locale === 'ar' ? top.labelAr : top.labelFr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink3)]">
                  {t.askModal.languageLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLang('fr')}
                    className={`py-2 px-3 text-xs rounded-xl font-semibold border ${
                      lang === 'fr'
                        ? 'border-[var(--e600)] bg-[var(--e50)] text-[var(--e800)]'
                        : 'border-[var(--pl)]'
                    }`}
                  >
                    Français (LTR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('ar')}
                    className={`py-2 px-3 text-xs rounded-xl font-semibold border ${
                      lang === 'ar'
                        ? 'border-[var(--e600)] bg-[var(--e50)] text-[var(--e800)]'
                        : 'border-[var(--pl)]'
                    }`}
                  >
                    العربية (RTL)
                  </button>
                </div>
              </div>
            </div>

            {/* Question Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink3)]">
                {t.askModal.titleLabel}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.askModal.titlePlaceholder}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--pl)] bg-[var(--pg)] text-sm focus:ring-2 focus:ring-[var(--e600)] focus:outline-hidden"
              />
            </div>

            {/* Question Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink3)]">
                {t.askModal.bodyLabel}
              </label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t.askModal.bodyPlaceholder}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                className="w-full px-4 py-3 rounded-xl border border-[var(--pl)] bg-[var(--pg)] text-sm focus:ring-2 focus:ring-[var(--e600)] focus:outline-hidden resize-y min-h-[100px]"
              />
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[var(--e600)] focus:ring-[var(--e600)]"
              />
              <span className="text-xs text-[var(--fg2)] leading-relaxed select-none">
                {t.askModal.publishConsent}
              </span>
            </label>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--pl)]">
              <div className="text-[11px] text-[var(--ink3)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--e600)]" />
                <span>Alias aléatoire généré automatiquement</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-[var(--fg2)] hover:bg-[var(--ps)]"
                >
                  {t.askModal.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.askModal.submit}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
