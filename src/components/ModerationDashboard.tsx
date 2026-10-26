'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  UserCheck,
  Award,
  PhoneCall,
  History,
  Lock,
} from 'lucide-react';

export function ModerationDashboard() {
  const {
    t,
    locale,
    questions,
    reports,
    experts,
    auditLogs,
    currentRole,
    setCurrentRole,
    approveQuestion,
    rejectQuestion,
    resolveReport,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'questions' | 'reports' | 'distress' | 'experts' | 'audit'
  >('questions');
  const [rejectReason, setRejectReason] = useState('spam');

  const pendingQuestions = questions.filter(
    (q) => q.status === 'pending_moderation'
  );
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const distressReports = reports.filter((r) => r.reason === 'distress');

  return (
    <div className="space-y-6">
      {/* Top Bar with Role Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-950">
              {t.admin.title}
            </h1>
            <p className="text-xs text-amber-800 mt-0.5">
              {t.admin.subtitle} • Rôle actif :{' '}
              <strong className="underline">{t.roles[currentRole]}</strong>
            </p>
          </div>
        </div>

        {currentRole !== 'moderator' && currentRole !== 'admin' && (
          <button
            onClick={() => setCurrentRole('moderator')}
            className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shrink-0"
          >
            Passer en mode Modérateur
          </button>
        )}
      </div>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-ilm p-4 border-l-4 border-l-[var(--e600)]">
          <div className="text-xs text-[var(--ink3)] font-medium">
            {t.admin.stats.pendingQuestions}
          </div>
          <div className="text-2xl font-bold text-[var(--ink)] mt-1">
            {pendingQuestions.length}
          </div>
        </div>

        <div className="card-ilm p-4 border-l-4 border-l-amber-500">
          <div className="text-xs text-[var(--ink3)] font-medium">
            {t.admin.stats.pendingReports}
          </div>
          <div className="text-2xl font-bold text-[var(--ink)] mt-1">
            {pendingReports.length}
          </div>
        </div>

        <div className="card-ilm p-4 border-l-4 border-l-[var(--care)]">
          <div className="text-xs text-[var(--ink3)] font-medium">
            {t.admin.stats.distressAlerts}
          </div>
          <div className="text-2xl font-bold text-[var(--care)] mt-1">
            {distressReports.length}
          </div>
        </div>

        <div className="card-ilm p-4 border-l-4 border-l-blue-600">
          <div className="text-xs text-[var(--ink3)] font-medium">
            {t.admin.stats.pendingExperts}
          </div>
          <div className="text-2xl font-bold text-[var(--ink)] mt-1">
            {experts.length}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[var(--pl)] flex items-center gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-[var(--e600)] text-white shadow-xs'
              : 'text-[var(--fg2)] hover:bg-[var(--ps)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.admin.tabs.questions}</span>
          {pendingQuestions.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white text-[var(--e600)] font-bold">
              {pendingQuestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-[var(--e600)] text-white shadow-xs'
              : 'text-[var(--fg2)] hover:bg-[var(--ps)]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{t.admin.tabs.reports}</span>
          {pendingReports.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white text-[var(--e600)] font-bold">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('distress')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'distress'
              ? 'bg-[var(--care)] text-white shadow-xs'
              : 'text-[var(--care)] bg-[var(--carebg)] hover:opacity-90'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t.admin.tabs.distress}</span>
          {distressReports.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white text-[var(--care)] font-bold">
              {distressReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('experts')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'experts'
              ? 'bg-[var(--e600)] text-white shadow-xs'
              : 'text-[var(--fg2)] hover:bg-[var(--ps)]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.admin.tabs.experts}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-[var(--e600)] text-white shadow-xs'
              : 'text-[var(--fg2)] hover:bg-[var(--ps)]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t.admin.tabs.audit}</span>
        </button>
      </div>

      {/* Tab 1: Questions to moderate */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {pendingQuestions.length === 0 ? (
            <div className="card-ilm p-8 text-center text-sm text-[var(--ink3)]">
              Aucune question en attente de modération pour le moment.
            </div>
          ) : (
            pendingQuestions.map((q) => (
              <div key={q.id} className="card-ilm p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--ink3)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-[var(--ps)] px-2 py-0.5 rounded border border-[var(--pl)] text-[var(--ink)]">
                      {q.authorAliasId}
                    </span>
                    <span>•</span>
                    <span className="text-[var(--e800)] font-semibold">{q.topic}</span>
                  </div>
                  <span>{new Date(q.createdAt).toLocaleString()}</span>
                </div>

                <div dir={q.lang === 'ar' ? 'rtl' : 'ltr'}>
                  <h3 className="font-bold text-base text-[var(--ink)]">
                    {q.title}
                  </h3>
                  <p className="text-sm text-[var(--fg2)] mt-1 whitespace-pre-line">
                    {q.body}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--pl)] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <label className="text-[var(--ink3)] font-medium">
                      Motif si rejet :
                    </label>
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="px-2 py-1 rounded-lg border border-[var(--pl)] bg-[var(--pg)] text-xs"
                    >
                      <option value="Spam ou contenu promotionnel">Spam / Pub</option>
                      <option value="Propos injurieux ou irrespectueux">Injures / Respect</option>
                      <option value="Hors charte de la plateforme">Hors charte</option>
                      <option value="Présence de données personnelles identifiantes">Données personnelles</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectQuestion(q.id, rejectReason)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t.admin.actions.reject}</span>
                    </button>
                    <button
                      onClick={() => approveQuestion(q.id)}
                      className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.admin.actions.approve}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {pendingReports.length === 0 ? (
            <div className="card-ilm p-8 text-center text-sm text-[var(--ink3)]">
              Aucun signalement en attente.
            </div>
          ) : (
            pendingReports.map((rep) => (
              <div key={rep.id} className="card-ilm p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                    Motif : {rep.reason}
                  </span>
                  <span className="text-[var(--ink3)]">
                    {new Date(rep.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-[var(--ink)]">
                  <strong>Remarque de l&apos;utilisateur :</strong> {rep.note}
                </p>

                {rep.previewText && (
                  <div className="bg-[var(--ps)] p-3 rounded-lg border border-[var(--pl)] text-xs text-[var(--ink2)] italic">
                    « {rep.previewText} »
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[var(--pl)]">
                  <button
                    onClick={() => resolveReport(rep.id, 'dismiss')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--ink3)] hover:bg-[var(--ps)]"
                  >
                    Classer sans suite
                  </button>
                  <button
                    onClick={() => resolveReport(rep.id, 'hide')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200"
                  >
                    Masquer le contenu
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Distress Emergency Protocol */}
      {activeTab === 'distress' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--care)] bg-[var(--carebg)] p-5 space-y-3">
            <div className="flex items-start gap-3">
              <PhoneCall className="w-6 h-6 text-[var(--care)] shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--care)] text-base">
                  Protocole Strict de Gestion des Situations de Détresse (§7.4)
                </h3>
                <p className="text-xs text-[var(--ink)] mt-1 leading-relaxed">
                  Conformément au cahier des charges, tout contenu contenant des
                  signaux de détresse aiguë, idées suicidaires ou violences est
                  immédiatement exclu du feed public. L&apos;utilisateur reçoit
                  les numéros d&apos;urgence locaux algériens.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 pt-2">
              <div className="bg-white/80 dark:bg-black/40 p-2.5 rounded-xl text-xs text-center border border-[var(--care)]/20">
                <div className="font-semibold">Protection Civile</div>
                <div className="text-base font-bold text-[var(--care)]">14 / 1021</div>
              </div>
              <div className="bg-white/80 dark:bg-black/40 p-2.5 rounded-xl text-xs text-center border border-[var(--care)]/20">
                <div className="font-semibold">Police Secours</div>
                <div className="text-base font-bold text-[var(--care)]">17 / 1548</div>
              </div>
              <div className="bg-white/80 dark:bg-black/40 p-2.5 rounded-xl text-xs text-center border border-[var(--care)]/20">
                <div className="font-semibold">Écoute Psychologique</div>
                <div className="text-base font-bold text-[var(--care)]">3033</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[var(--ink)]">
              Cas de détresse signalés ou détectés :
            </h4>
            {distressReports.map((d) => (
              <div
                key={d.id}
                className="card-ilm p-4 border-l-4 border-l-[var(--care)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-[var(--ink3)]">
                  <span className="font-mono text-[var(--care)] font-bold">
                    Signalement d&apos;urgence ID : {d.id}
                  </span>
                  <span>{new Date(d.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-[var(--ink)]">{d.note}</p>
                {d.previewText && (
                  <p className="text-xs bg-[var(--ps)] p-2.5 rounded border border-[var(--pl)] italic">
                    « {d.previewText} »
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-[var(--care)] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Ressources d&apos;urgence affichées à l&apos;auteur
                  </span>
                  <button
                    onClick={() => resolveReport(d.id, 'dismiss')}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--care)] text-white"
                  >
                    Marquer comme pris en charge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Experts Applications */}
      {activeTab === 'experts' && (
        <div className="space-y-4">
          {experts.map((exp) => (
            <div key={exp.id} className="card-ilm p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[var(--ink)]">
                    {exp.displayName} ({exp.displayNameAr})
                  </h3>
                  <p className="text-xs text-[var(--e700)] font-medium">
                    {exp.title} • {exp.city} ({exp.wilaya})
                  </p>
                </div>
                <span className="badge-ok text-xs font-semibold px-2.5 py-1 rounded-full">
                  Vérifié & Actif
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[var(--pl)] text-xs">
                <span className="font-semibold text-[var(--ink3)] uppercase">
                  Titres & Diplômes vérifiés :
                </span>
                {exp.credentials.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-[var(--ink)]">
                    <Award className="w-3.5 h-3.5 text-[var(--e600)]" />
                    <span>
                      <strong>{c.title}</strong> — {c.institution} ({c.year})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Immutable Audit Log */}
      {activeTab === 'audit' && (
        <div className="card-ilm overflow-hidden">
          <div className="p-4 border-b border-[var(--pl)] bg-[var(--ps)] text-xs text-[var(--ink3)] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--e600)]" />
            <span>
              Journal d&apos;audit chaîné immuable (garantie de transparence et traçabilité interne)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-[var(--ps)] border-b border-[var(--pl)] text-[var(--ink3)]">
                <tr>
                  <th className="p-3 text-start">{t.admin.audit.date}</th>
                  <th className="p-3 text-start">{t.admin.audit.moderator}</th>
                  <th className="p-3 text-start">{t.admin.audit.action}</th>
                  <th className="p-3 text-start">{t.admin.audit.target}</th>
                  <th className="p-3 text-start">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--pl)]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--ps)]/50">
                    <td className="p-3 text-[var(--ink3)]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-[var(--ink)]">
                      {log.moderatorName}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--e50)] text-[var(--e800)]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[var(--ink2)]">
                      {log.targetType} #{log.targetId}
                    </td>
                    <td className="p-3 text-[var(--ink2)]">
                      {log.reason || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
