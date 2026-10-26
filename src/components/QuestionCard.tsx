'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Question } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  ThumbsUp,
  Flag,
  Share2,
  CheckCircle,
  Clock,
  BookOpen,
  Send,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { locale, currentRole, voteHelpful, addAnswer } = useApp();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [replySources, setReplySources] = useState('');
  const [reported, setReported] = useState(false);
  const [votedHelpful, setVotedHelpful] = useState(false);

  const isRtlLang = question.lang === 'ar';
  const hasAnswers = question.answers.length > 0;
  const isExpertUser = currentRole === 'expert';

  const handleHelpfulClick = () => {
    if (!votedHelpful) {
      voteHelpful(question.id, question.answers[0]?.id);
      setVotedHelpful(true);
    }
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  const handleSendAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;

    const sources = replySources
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addAnswer(question.id, replyBody.trim(), sources);
    setReplyBody('');
    setReplySources('');
    setShowReplyForm(false);
  };

  return (
    <article className="bg-white border border-[#DCE5E0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_rgba(16,60,49,0.06)] hover:shadow-[0_2px_8px_rgba(16,60,49,0.08)] hover:border-[#80C3A9] transition-all space-y-4">
      {/* Category and Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Topic Chip (Charte: badge k-brand) */}
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
            {question.topic}
          </span>

          {/* Type tag (direct vs feed) */}
          {question.kind === 'direct' ? (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FFF3D6] text-[#8A5A00] border border-[#EBD08E]">
              Question directe {question.targetExpertName ? `à ${question.targetExpertName}` : ''}
            </span>
          ) : null}

          {hasAnswers ? (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F4E8] text-[#276B2A] border border-[#BFDDBF] inline-flex items-center gap-1">
              <Check className="w-3 h-3" />
              Répondue
            </span>
          ) : (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FFF3D6] text-[#8A5A00] border border-[#EBD08E]">
              Sans réponse
            </span>
          )}
        </div>

        {/* Date and discreet anonymous author */}
        <div className="flex items-center gap-1.5 text-xs text-[#7A8A84]">
          <span className="font-mono">{question.authorAliasId || 'Anonyme'}</span>
          <span>•</span>
          <time dateTime={question.createdAt}>
            {new Date(question.createdAt).toLocaleDateString(
              locale === 'ar' ? 'ar-DZ' : 'fr-FR',
              { day: 'numeric', month: 'short' }
            )}
          </time>
        </div>
      </div>

      {/* Question Subject & Body */}
      <div dir={isRtlLang ? 'rtl' : 'ltr'} className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#16231E] leading-snug">
          {question.title}
        </h2>
        <p className="text-sm sm:text-base text-[#55655F] leading-relaxed whitespace-pre-line">
          {question.body}
        </p>
      </div>

      {/* Verified Expert Answer Presentation */}
      {hasAnswers ? (
        <div className="pt-2">
          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className="mt-3 rounded-2xl bg-[#F7F9F8] border border-[#DCE5E0] p-5 sm:p-6 space-y-4"
            >
              {/* Expert Profile Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#DCE5E0] pb-3.5">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/experts/${answer.expertId}`}
                    className="w-11 h-11 rounded-2xl bg-[#1F7A5E] text-white flex items-center justify-center font-bold text-base shadow-[0_1px_2px_rgba(16,60,49,0.06)] hover:bg-[#19634D] transition-colors shrink-0"
                  >
                    {answer.expertName.charAt(0)}
                  </Link>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/experts/${answer.expertId}`}
                        className="text-sm sm:text-base font-bold text-[#16231E] hover:text-[#19634D] transition-colors"
                      >
                        {answer.expertName}
                      </Link>
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FBF1D8] text-[#7A5810] border border-[#E6CF93]"
                        title="Diplômes vérifiés auprès des registres académiques"
                      >
                        <CheckCircle className="w-3 h-3 text-[#7A5810]" />
                        <span>Diplômes vérifiés</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#55655F] font-medium mt-0.5">
                      {answer.expertTitle}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-[#7A8A84] shrink-0 hidden sm:block">
                  Avis vérifié •{' '}
                  {new Date(answer.createdAt).toLocaleDateString(
                    locale === 'ar' ? 'ar-DZ' : 'fr-FR',
                    { day: 'numeric', month: 'short' }
                  )}
                </div>
              </div>

              {/* Verified Editorial Answer Body in Serif */}
              <div
                dir={question.lang === 'ar' ? 'rtl' : 'ltr'}
                className={`text-[17px] sm:text-[18px] text-[#16231E] leading-[1.8] whitespace-pre-line ${
                  question.lang === 'ar' ? 'font-serif-ar' : 'font-serif-fr'
                }`}
              >
                {answer.body}
              </div>

              {/* Jurisprudential Sources */}
              {answer.sources && answer.sources.length > 0 && (
                <div className="pt-3 border-t border-[#DCE5E0] flex items-start gap-2 text-xs text-[#55655F]">
                  <BookOpen className="w-3.5 h-3.5 text-[#1F7A5E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#16231E]">Sources : </span>
                    <span className="italic">{answer.sources.join(' • ')}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#C3D0CA] bg-[#F7F9F8] px-4 py-3 flex items-center justify-between text-xs text-[#55655F]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8A5A00]" />
            <span>En attente de réponse par un expert qualifié...</span>
          </div>
          <span className="text-[11px] text-[#7A8A84]">Statut : Approuvée</span>
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#DCE5E0] text-xs">
        <div className="flex items-center gap-2">
          {/* Vote Helpful button */}
          <button
            onClick={handleHelpfulClick}
            disabled={votedHelpful}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer border ${
              votedHelpful
                ? 'bg-[#EEF7F3] text-[#154F3F] border-[#AEDAC8]'
                : 'bg-[#F7F9F8] text-[#55655F] border-[#DCE5E0] hover:bg-[#EEF7F3] hover:text-[#154F3F] hover:border-[#AEDAC8]'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${votedHelpful ? 'fill-[#154F3F]' : ''}`} />
            <span>{question.helpfulCount + (votedHelpful ? 1 : 0)} utiles</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.origin + '/#q-' + question.id);
                alert('Lien de la question copié !');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-[#55655F] hover:text-[#16231E] hover:bg-[#F7F9F8] transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Partager</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Expert Quick Reply CTA if role is expert */}
          {isExpertUser && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F7A5E] hover:bg-[#19634D] text-white rounded-xl font-semibold transition cursor-pointer shadow-[0_1px_2px_rgba(16,60,49,0.06)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{showReplyForm ? 'Fermer' : 'Répondre en tant qu\'expert'}</span>
            </button>
          )}

          {/* Report flag */}
          <button
            onClick={handleReport}
            className="p-1.5 text-[#7A8A84] hover:text-[#C0392B] rounded-lg transition cursor-pointer"
            title="Signaler un abus ou une erreur théologique"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {reported && (
        <div className="text-xs p-3 rounded-xl bg-[#FCEBE9] text-[#C0392B] border border-[#F2C4BF]">
          Signalement transmis à l&apos;équipe de modération d&apos;ilm.me. Merci.
        </div>
      )}

      {/* Expandable Expert Reply Form */}
      {showReplyForm && (
        <form
          onSubmit={handleSendAnswer}
          className="mt-4 p-5 rounded-2xl bg-[#EEF7F3] border border-[#AEDAC8] space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#154F3F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1F7A5E]" />
              Rédiger un avis juridique certifié
            </h4>
            <span className="text-xs text-[#19634D] font-mono">Mode Expert</span>
          </div>

          <textarea
            required
            rows={5}
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Rédigez votre réponse argumentée avec clarté, bienveillance et rigueur méthodologique..."
            className="w-full text-sm rounded-xl p-3 bg-white border border-[#C3D0CA] text-[#16231E] placeholder-[#7A8A84] focus:outline-none focus:ring-2 focus:ring-[#1F7A5E]"
          />

          <div>
            <label className="block text-xs font-semibold text-[#154F3F] mb-1">
              Références et sources jurisprudentielles (une par ligne) :
            </label>
            <textarea
              rows={2}
              value={replySources}
              onChange={(e) => setReplySources(e.target.value)}
              placeholder="ex: Mukhtasar Khalil, Chapitre de la prière&#10;ex: Al-Risala d'Ibn Abi Zayd"
              className="w-full text-xs rounded-xl p-2.5 bg-white border border-[#C3D0CA] text-[#16231E] placeholder-[#7A8A84] focus:outline-none focus:ring-2 focus:ring-[#1F7A5E]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#55655F] hover:bg-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1F7A5E] hover:bg-[#19634D] text-white rounded-xl text-xs font-semibold shadow-[0_1px_2px_rgba(16,60,49,0.06)]"
            >
              Publier l&apos;avis
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
