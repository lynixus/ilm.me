'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Question,
  ExpertProfile,
  Post,
  Report,
  ModerationAuditItem,
  UserRole,
  UserProfile,
  NotificationItem,
  DirectMessageThread,
} from '@/types';
import {
  INITIAL_QUESTIONS,
  INITIAL_EXPERTS,
  INITIAL_POSTS,
  INITIAL_REPORTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USER,
  INITIAL_NOTIFICATIONS,
  INITIAL_THREADS,
} from '@/lib/store';
import { Locale, TranslationSchema, translations } from '@/lib/i18n';
import { checkDistressContent } from '@/lib/distressDetection';

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationSchema;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  isAuthReady: boolean;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  threads: DirectMessageThread[];
  sendMessageInThread: (threadId: string, text: string) => void;
  sendExpertReply: (threadId: string, text: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  questions: Question[];
  experts: ExpertProfile[];
  posts: Post[];
  reports: Report[];
  auditLogs: ModerationAuditItem[];
  followedExpertIds: string[];
  addQuestion: (data: {
    kind: 'feed' | 'direct';
    targetExpertId?: string;
    targetExpertName?: string;
    title: string;
    body: string;
    lang: 'fr' | 'ar';
    topic: string;
    publishAnswerConsent: boolean;
  }) => { id: string; isDistress: boolean };
  addAnswer: (questionId: string, body: string, sources?: string[]) => void;
  voteHelpful: (questionId: string, answerId?: string) => void;
  likePost: (postId: string) => void;
  toggleFollowExpert: (expertId: string) => void;
  approveQuestion: (questionId: string) => void;
  rejectQuestion: (questionId: string, reason: string) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'hide') => void;
}

const STORAGE_KEYS = {
  USER: 'ilm_user_session',
  THREADS: 'ilm_threads_v1',
  QUESTIONS: 'ilm_questions_v1',
  FOLLOWED: 'ilm_followed_experts_v1',
  LOCALE: 'ilm_locale_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [currentRole, setCurrentRole] = useState<UserRole>('normal_user');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [threads, setThreads] = useState<DirectMessageThread[]>(INITIAL_THREADS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [experts, setExperts] = useState<ExpertProfile[]>(INITIAL_EXPERTS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState<ModerationAuditItem[]>(INITIAL_AUDIT_LOGS);
  const [followedExpertIds, setFollowedExpertIds] = useState<string[]>(['exp-1', 'exp-2']);

  // Hydrate session and local data from localStorage on client mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedUserStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setCurrentRole(parsed.role || 'normal_user');
          }
        }
        const savedThreadsStr = localStorage.getItem(STORAGE_KEYS.THREADS);
        if (savedThreadsStr) {
          const parsed = JSON.parse(savedThreadsStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setThreads(parsed);
          }
        }
        const savedQuestionsStr = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
        if (savedQuestionsStr) {
          const parsed = JSON.parse(savedQuestionsStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed);
          }
        }
        const savedFollowedStr = localStorage.getItem(STORAGE_KEYS.FOLLOWED);
        if (savedFollowedStr) {
          const parsed = JSON.parse(savedFollowedStr);
          if (Array.isArray(parsed)) {
            setFollowedExpertIds(parsed);
          }
        }
        const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE);
        if (savedLocale === 'fr' || savedLocale === 'ar') {
          setLocaleState(savedLocale);
        }
      }
    } catch (e) {
      console.error('Error hydrating localStorage in AppContext', e);
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  // Sync role and user persistence when currentUser changes (post-hydration)
  useEffect(() => {
    if (!isAuthReady) return;
    try {
      if (currentUser) {
        setCurrentRole(currentUser.role);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        setCurrentRole('normal_user');
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('Error updating user session in localStorage', e);
    }
  }, [currentUser, isAuthReady]);

  // Sync questions to localStorage whenever updated
  useEffect(() => {
    if (!isAuthReady) return;
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {}
  }, [questions, isAuthReady]);

  // Sync threads to localStorage whenever updated
  useEffect(() => {
    if (!isAuthReady) return;
    try {
      localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
    } catch (e) {}
  }, [threads, isAuthReady]);

  // Sync followedExpertIds to localStorage
  useEffect(() => {
    if (!isAuthReady) return;
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOWED, JSON.stringify(followedExpertIds));
    } catch (e) {}
  }, [followedExpertIds, isAuthReady]);

  // Set document direction and lang attribute dynamically
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale);
      }
    } catch (e) {}
  };

  const t = translations[locale];

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sendMessageInThread = (threadId: string, text: string) => {
    if (!text.trim()) return;
    const isExpert = currentRole === 'expert';
    const sender = isExpert ? ('expert' as const) : ('user' as const);

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    let targetQuestionId: string | undefined;

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          targetQuestionId = th.questionId;
          return {
            ...th,
            messages: [...th.messages, newMsg],
            lastMessage: text.trim(),
            lastMessageAt: new Date().toISOString(),
          };
        }
        return th;
      })
    );

    // If expert replies in the thread, answer the question
    if (isExpert && targetQuestionId) {
      addAnswer(targetQuestionId, text.trim());
    }
  };

  const sendExpertReply = (threadId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'expert' as const,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    let targetQuestionId: string | undefined;

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          targetQuestionId = th.questionId;
          return {
            ...th,
            messages: [...th.messages, newMsg],
            lastMessage: text.trim(),
            lastMessageAt: new Date().toISOString(),
          };
        }
        return th;
      })
    );

    if (targetQuestionId) {
      addAnswer(targetQuestionId, text.trim());
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    let simulatedUser: UserProfile;
    const lower = email.toLowerCase().trim();

    if (lower === 'expert@ilm.me' || lower.includes('benmansour') || lower.includes('expert')) {
      simulatedUser = {
        id: 'exp-1',
        name: 'Dr. Abdelhamid Benmansour',
        email: 'expert@ilm.me',
        alias: 'dr-benmansour-fiqh',
        role: 'expert',
        locale,
        createdAt: '2026-01-15T08:00:00Z',
        notificationsEnabled: true,
        emailDigestEnabled: true,
      };
    } else if (lower === 'admin@ilm.me' || lower.includes('admin') || lower.includes('mod')) {
      simulatedUser = {
        id: 'adm-1',
        name: 'Modérateur Principal ilm.me',
        email: 'admin@ilm.me',
        alias: 'mod-supervisor-dz',
        role: 'admin',
        locale,
        createdAt: '2026-01-01T00:00:00Z',
        notificationsEnabled: true,
        emailDigestEnabled: true,
      };
    } else {
      simulatedUser = {
        id: 'usr-1',
        name: lower === 'user@ilm.me' ? 'Karim Brahimi' : email.split('@')[0],
        email,
        alias: 'alias-a83f-4882',
        role: 'normal_user',
        locale,
        createdAt: '2026-09-12T10:00:00Z',
        notificationsEnabled: true,
        emailDigestEnabled: false,
      };
    }

    setCurrentUser(simulatedUser);
    setCurrentRole(simulatedUser.role);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const googleUser: UserProfile = {
      id: 'usr-google-88',
      name: 'Utilisateur Google',
      email: 'user.google@gmail.com',
      alias: 'alias-goog-4412',
      role: 'normal_user',
      locale,
      createdAt: new Date().toISOString(),
      notificationsEnabled: true,
      emailDigestEnabled: false,
    };
    setCurrentUser(googleUser);
    setCurrentRole('normal_user');
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      alias: `alias-${Math.random().toString(36).substring(2, 6)}`,
      role: 'normal_user',
      locale,
      createdAt: new Date().toISOString(),
      notificationsEnabled: true,
      emailDigestEnabled: false,
    };
    setCurrentUser(newUser);
    setCurrentRole('normal_user');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('normal_user');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const addQuestion = (data: {
    kind: 'feed' | 'direct';
    targetExpertId?: string;
    targetExpertName?: string;
    title: string;
    body: string;
    lang: 'fr' | 'ar';
    topic: string;
    publishAnswerConsent: boolean;
  }) => {
    const isDistress = checkDistressContent(data.title + ' ' + data.body);
    const newId = `q-${Date.now()}`;
    const randomAlias = currentUser ? currentUser.alias : `alias-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;

    const targetExp =
      (data.targetExpertId && experts.find((e) => e.id === data.targetExpertId)) || experts[0];

    const newQuestion: Question = {
      id: newId,
      authorAliasId: randomAlias,
      kind: 'direct',
      targetExpertId: targetExp?.id,
      targetExpertName: targetExp ? (locale === 'ar' ? targetExp.displayNameAr : targetExp.displayName) : undefined,
      title: data.title,
      body: data.body,
      lang: data.lang,
      topic: data.topic,
      // Toujours sent_to_expert: N'apparaît JAMAIS sur le fil public tant que le mufti n'a pas répondu !
      status: isDistress ? 'pending_moderation' : 'sent_to_expert',
      publishAnswerConsent: data.publishAnswerConsent,
      helpfulCount: 0,
      reportsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answers: [],
    };

    setQuestions((prev) => [newQuestion, ...prev]);

    // Toujours créer un fil de discussion privé dans la messagerie
    if (targetExp) {
      const newThread: DirectMessageThread = {
        id: `thread-${Date.now()}`,
        questionId: newId,
        authorAlias: randomAlias,
        expertId: targetExp.id,
        expertName: locale === 'ar' ? targetExp.displayNameAr : targetExp.displayName,
        expertTitle: locale === 'ar' ? targetExp.titleAr : targetExp.title,
        title: data.title,
        lastMessage: data.body,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: data.body,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setThreads((prev) => [newThread, ...prev]);
    }

    if (isDistress) {
      const distressReport: Report = {
        id: `rep-distress-${Date.now()}`,
        reporterAliasId: randomAlias,
        targetType: 'question',
        targetId: newId,
        reason: 'distress',
        note: 'Détection automatique d\'indices de détresse psychologique ou de danger.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        previewText: data.title,
      };
      setReports((prev) => [distressReport, ...prev]);
    }

    return { id: newId, isDistress };
  };

  const addAnswer = (questionId: string, body: string, sources: string[] = []) => {
    const activeExpert = experts[0];
    const newAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      expertId: activeExpert.id,
      expertName: locale === 'ar' ? activeExpert.displayNameAr : activeExpert.displayName,
      expertTitle: locale === 'ar' ? activeExpert.titleAr : activeExpert.title,
      body,
      sources,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: 'answered',
              updatedAt: new Date().toISOString(),
              answers: [...q.answers, newAnswer],
            }
          : q
      )
    );

    // Notify user
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'usr-1',
      title: 'Nouvelle réponse à votre question',
      message: `${activeExpert.displayName} a répondu à votre question.`,
      type: 'answer',
      targetUrl: `/#${questionId}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const voteHelpful = (questionId: string, answerId?: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        if (!answerId) {
          return { ...q, helpfulCount: q.helpfulCount + 1 };
        }
        return {
          ...q,
          answers: q.answers.map((ans) =>
            ans.id === answerId
              ? { ...ans, helpfulCount: ans.helpfulCount + 1 }
              : ans
          ),
        };
      })
    );
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p))
    );
  };

  const toggleFollowExpert = (expertId: string) => {
    const isCurrentlyFollowing = followedExpertIds.includes(expertId);

    setFollowedExpertIds((prev) =>
      isCurrentlyFollowing ? prev.filter((id) => id !== expertId) : [...prev, expertId]
    );

    setExperts((expertsList) =>
      expertsList.map((e) =>
        e.id === expertId
          ? {
              ...e,
              followersCount: isCurrentlyFollowing
                ? Math.max(0, e.followersCount - 1)
                : e.followersCount + 1,
            }
          : e
      )
    );
  };

  const approveQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status: 'approved' } : q))
    );
    const log: ModerationAuditItem = {
      id: `aud-${Date.now()}`,
      moderatorId: 'mod-1',
      moderatorName: 'Modérateur Actif',
      targetType: 'Question',
      targetId: questionId,
      action: 'approved',
      reason: 'Validation de la conformité au règlement',
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const rejectQuestion = (questionId: string, reason: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, status: 'rejected', moderationReason: reason }
          : q
      )
    );
    const log: ModerationAuditItem = {
      id: `aud-${Date.now()}`,
      moderatorId: 'mod-1',
      moderatorName: 'Modérateur Actif',
      targetType: 'Question',
      targetId: questionId,
      action: 'rejected',
      reason,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'hide') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' }
          : r
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        currentRole,
        setCurrentRole,
        currentUser,
        isAuthReady,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        threads,
        sendMessageInThread,
        sendExpertReply,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        questions,
        experts,
        posts,
        reports,
        auditLogs,
        followedExpertIds,
        addQuestion,
        addAnswer,
        voteHelpful,
        likePost,
        toggleFollowExpert,
        approveQuestion,
        rejectQuestion,
        resolveReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
