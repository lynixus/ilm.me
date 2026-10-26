'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  CheckCheck,
  BookOpen,
  MessageSquare,
  FileText,
  ShieldCheck,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function NotificationsClient() {
  const router = useRouter();
  const {
    t,
    locale,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const isRtl = locale === 'ar';
  const [filter, setFilter] = useState<'all' | 'unread' | 'answer' | 'direct_message'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'answer') return notif.type === 'answer';
    if (filter === 'direct_message') return notif.type === 'direct_message';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        );
      case 'direct_message':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      case 'post':
        return (
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'moderation':
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        );
    }
  };

  const formatTime = (isoString: string) => {
    if (!mounted) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (isRtl) {
        if (diffMins < 5) return 'الآن';
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        return `منذ ${diffDays} يوم`;
      } else {
        if (diffMins < 5) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours} h`;
        return `Il y a ${diffDays} j`;
      }
    } catch {
      return '';
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.targetUrl) {
      router.push(notif.targetUrl);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {isRtl ? 'مركز الإشعارات' : 'Notifications'}
                  </h1>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-600 text-white">
                      {unreadNotificationsCount} {isRtl ? 'جديد' : 'nouvelles'}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {isRtl
                    ? 'تابع إجابات الخبراء والرسائل الخاصة المباشرة وتحديثات أسئلتك'
                    : 'Suivez les réponses des experts, messages privés et mises à jour de vos questions'}
                </p>
              </div>
            </div>

            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition border border-emerald-200/80 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{isRtl ? 'تحديد الكل كمقروء' : 'Tout marquer comme lu'}</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'الكل' : 'Toutes'} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                filter === 'unread'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'غير مقروءة' : 'Non lues'} ({unreadNotificationsCount})
            </button>
            <button
              onClick={() => setFilter('answer')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                filter === 'answer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'إجابات الخبراء' : 'Réponses aux questions'}
            </button>
            <button
              onClick={() => setFilter('direct_message')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                filter === 'direct_message'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'رسائل مباشرة' : 'Messagerie directe'}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                {isRtl ? 'لا توجد إشعارات حالياً' : 'Aucune notification'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-5">
                {filter === 'unread'
                  ? isRtl
                    ? 'لقد اطلعت على جميع إشعاراتك، كل شيء محدث.'
                    : 'Vous avez lu toutes vos notifications. Tout est à jour !'
                  : isRtl
                  ? 'ستتلقى إشعاراً عندما يجيب خبير على سؤالك أو يرسل لك رسالة خاصة.'
                  : "Vous recevrez des alertes dès qu'un expert certifié répondra à vos questions ou vous enverra un message."}
              </p>
              <Link
                href="/poser-une-question"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Sparkles className="w-4 h-4" />
                {isRtl ? 'طرح سؤال الآن' : 'Poser une question'}
              </Link>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
                  !notif.read
                    ? 'bg-emerald-50/40 border-emerald-200/90 shadow-xs hover:bg-emerald-50/70 hover:border-emerald-300'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300'
                }`}
              >
                {/* Visual Icon */}
                {getNotificationIcon(notif.type)}

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4
                      className={`text-sm tracking-tight truncate ${
                        !notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-800'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {mounted && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatTime(notif.createdAt)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-emerald-700 group-hover:text-emerald-800 flex items-center gap-0.5">
                      {isRtl ? 'عرض التفاصيل' : 'Consulter'}
                      <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </span>

                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
