'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCheck,
  User,
  ArrowLeft,
  Search,
  ExternalLink,
  Sparkles,
  PlusCircle,
  Globe,
  EyeOff,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function MessagerieClient() {
  const {
    t,
    locale,
    currentUser,
    isAuthReady,
    threads,
    sendMessageInThread,
    sendExpertReply,
    experts,
    questions,
    currentRole,
  } = useApp();

  const isRtl = locale === 'ar';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter threads for the active user:
  // - If expert: threads assigned to this expert
  // - If normal user: threads corresponding to questions asked by the user's alias
  const visibleThreads = threads.filter((th) => {
    if (!currentUser) return false;
    if (currentRole === 'expert' || currentUser.role === 'expert') {
      return th.expertId === currentUser.id || th.expertId === 'exp-1';
    }
    if (th.authorAlias && th.authorAlias === currentUser.alias) return true;
    const relatedQ = questions.find((q) => q.id === th.questionId);
    if (relatedQ && relatedQ.authorAliasId === currentUser.alias) return true;
    return currentUser.email === 'user@ilm.me' || threads.length <= 1;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(visibleThreads[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleThreads.length > 0) {
      if (!activeThreadId || !visibleThreads.some((t) => t.id === activeThreadId)) {
        setActiveThreadId(visibleThreads[0].id);
      }
    }
  }, [visibleThreads, activeThreadId]);

  const activeThread = visibleThreads.find((t) => t.id === activeThreadId) || visibleThreads[0];
  const activeExpert = experts.find((e) => e.id === activeThread?.expertId);
  const associatedQuestion = questions.find((q) => q.id === activeThread?.questionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, activeThreadId]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1F7A5E] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] flex flex-col text-[#16231E]">
        <Navbar />

        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center my-auto space-y-6">
          <div className="w-18 h-18 rounded-3xl bg-[#EEF7F3] text-[#1F7A5E] flex items-center justify-center mx-auto border border-[#AEDAC8] shadow-[0_2px_8px_rgba(16,60,49,0.06)]">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
              Espace privé & confidentiel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16231E]">
              Messagerie réservée aux membres
            </h1>
            <p className="text-sm text-[#55655F] leading-relaxed max-w-md mx-auto">
              Pour échanger en toute discrétion avec nos savants certifiés et retrouver l&apos;historique de vos consultations, vous devez être connecté.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/connexion"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] transition"
            >
              <User className="w-4 h-4" />
              <span>Se connecter</span>
            </Link>
            <Link
              href="/inscription"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#154F3F] bg-[#EEF7F3] hover:bg-[#D6EDE3] border border-[#AEDAC8] transition"
            >
              <span>Créer un compte anonyme</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const threadId = activeThread.id;
    const textToSend = inputText;
    sendMessageInThread(threadId, textToSend);
    setInputText('');

    if (currentRole !== 'expert' && currentUser?.role !== 'expert') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replies = [
          "Wa 'alaykum as-salam wa rahmatullah. J'ai bien reçu votre message et je vous remercie pour ces précisions utiles.",
          "Barak Allahou fik pour votre confiance. Votre question est bien prise en compte et fait l'objet d'un examen attentif.",
          "Votre démarche sincère de recherche de savoir est louable. Je reviens vers vous très prochainement avec la réponse argumentée.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        sendExpertReply(threadId, randomReply);
      }, 2000);
    }
  };

  const filteredThreads = visibleThreads.filter((th) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      th.expertName.toLowerCase().includes(q) ||
      th.title.toLowerCase().includes(q) ||
      th.lastMessage.toLowerCase().includes(q)
    );
  });

  const formatMessageTime = (isoString: string) => {
    if (!mounted) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`min-h-screen bg-[#F7F9F8] flex flex-col text-[#16231E] ${isRtl ? 'font-arabic' : 'font-sans'}`}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
        {/* Main Messenger Container */}
        <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(16,60,49,0.06)] border border-[#DCE5E0] flex-1 flex overflow-hidden min-h-[640px] max-h-[calc(100vh-140px)]">
          {/* LEFT COLUMN: Threads List */}
          <div
            className={`w-full md:w-80 lg:w-96 border-[#DCE5E0] flex flex-col shrink-0 ${
              isRtl ? 'md:border-l' : 'md:border-r'
            } ${showMobileChat ? 'hidden md:flex' : 'flex'}`}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#DCE5E0] flex items-center justify-between gap-2">
              <div>
                <h1 className="text-lg font-bold text-[#16231E] tracking-tight flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#1F7A5E]" />
                  <span>{isRtl ? 'المراسلات الخاصة' : 'Messagerie directe'}</span>
                </h1>
                <p className="text-xs text-[#55655F] mt-0.5">
                  {isRtl ? 'استشاراتك المباشرة مع الخبراء' : 'Échanges confidentiels avec les savants'}
                </p>
              </div>

              <Link
                href="/poser-une-question"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F7A5E] hover:bg-[#19634D] text-white rounded-xl text-xs font-semibold shadow-xs transition"
                title={isRtl ? 'سؤال مباشر جديد' : 'Nouvelle question'}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{isRtl ? 'جديد' : 'Nouveau'}</span>
              </Link>
            </div>

            {/* Search filter */}
            <div className="p-3 border-b border-[#DCE5E0] bg-[#F7F9F8]/60">
              <div className="relative">
                <Search
                  className={`w-4 h-4 absolute top-2.5 text-[#7A8A84] ${
                    isRtl ? 'right-3' : 'left-3'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRtl ? 'بحث في المحادثات...' : 'Rechercher une discussion...'}
                  className={`w-full text-xs rounded-xl bg-white border border-[#DCE5E0] py-2 text-[#16231E] placeholder-[#7A8A84] focus:outline-[#1F7A5E] focus:border-[#1F7A5E] transition ${
                    isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                  }`}
                />
              </div>
            </div>

            {/* Thread list scrollable */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#DCE5E0]">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-[#7A8A84] mb-3">
                    {isRtl ? 'لا توجد محادثات تطابق بحثك' : 'Aucune discussion trouvée'}
                  </p>
                  <Link
                    href="/poser-une-question"
                    className="text-xs font-semibold text-[#1F7A5E] hover:underline"
                  >
                    {isRtl ? 'طرح سؤال خاص الآن' : 'Poser une question privée'}
                  </Link>
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isSelected = thread.id === activeThread?.id;
                  const thQuestion = questions.find((q) => q.id === thread.questionId);
                  const isAnswered = thQuestion?.status === 'answered' && thQuestion?.answers.length > 0;

                  return (
                    <button
                      key={thread.id}
                      onClick={() => {
                        setActiveThreadId(thread.id);
                        setShowMobileChat(true);
                      }}
                      className={`w-full p-4 text-left transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#EEF7F3] border-l-4 border-l-[#1F7A5E]'
                          : 'hover:bg-[#F7F9F8]'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-[#EEF7F3] text-[#154F3F] font-bold flex items-center justify-center shrink-0 border border-[#AEDAC8]">
                        {thread.expertName.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h3 className="text-xs sm:text-sm font-semibold text-[#16231E] truncate">
                            {thread.expertName}
                          </h3>
                          {mounted && (
                            <span className="text-[10px] text-[#7A8A84] shrink-0">
                              {formatMessageTime(thread.lastMessageAt)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#19634D] font-medium truncate mb-1">
                          {thread.title}
                        </p>

                        <p className="text-xs text-[#55655F] truncate">
                          {thread.lastMessage}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                          {isAnswered ? (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#E8F4E8] text-[#276B2A] font-medium border border-[#BFDDBF]">
                              Répondue
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#FFF3D6] text-[#8A5A00] font-medium border border-[#EBD08E]">
                              En attente
                            </span>
                          )}

                          {thQuestion?.publishAnswerConsent ? (
                            <span className="text-[10px] text-[#19634D] flex items-center gap-0.5">
                              <Globe className="w-3 h-3" />
                              <span>Publiable</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#7A8A84] flex items-center gap-0.5">
                              <EyeOff className="w-3 h-3" />
                              <span>100% privé</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {thread.unreadCount > 0 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1F7A5E] shrink-0 mt-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Privacy bottom callout */}
            <div className="p-3 bg-[#F7F9F8] border-t border-[#DCE5E0] text-[11px] text-[#55655F] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F7A5E] shrink-0" />
              <span>
                {isRtl
                  ? `أنت متصل باسمك المستعار: ${currentUser?.alias || 'alias-a83f'}`
                  : `Connecté sous l'alias : ${currentUser?.alias || 'alias-a83f'}`}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Active Chat Box */}
          <div
            className={`flex-1 flex flex-col min-w-0 bg-white ${
              !showMobileChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeThread ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3.5 sm:p-4 border-b border-[#DCE5E0] flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Back button on mobile */}
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-1.5 -ml-1 text-[#55655F] hover:text-[#16231E] rounded-lg cursor-pointer"
                    >
                      <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-[#EEF7F3] text-[#154F3F] font-bold flex items-center justify-center shrink-0 border border-[#AEDAC8]">
                      {activeThread.expertName.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-[#16231E] truncate">
                          {activeThread.expertName}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FBF1D8] text-[#7A5810] border border-[#E6CF93]">
                          <CheckCircle className="w-3 h-3 text-[#7A5810]" />
                          {isRtl ? 'خبير موثق' : 'Diplômes vérifiés'}
                        </span>
                      </div>
                      <p className="text-xs text-[#55655F] truncate">
                        {activeThread.expertTitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {activeExpert && (
                      <Link
                        href={`/experts/${activeExpert.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#16231E] bg-[#F7F9F8] hover:bg-[#EEF7F3] border border-[#DCE5E0] transition"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                          {isRtl ? 'الملف الشخصي' : 'Profil savant'}
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#7A8A84]" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Question Subject Line */}
                <div className="px-4 py-2 bg-[#F7F9F8] border-b border-[#DCE5E0] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#55655F] truncate">
                    <strong className="text-[#16231E] font-semibold">
                      {isRtl ? 'الموضوع: ' : 'Objet : '}
                    </strong>
                    {activeThread.title}
                  </span>
                  <span className="text-[11px] text-[#7A8A84] font-mono">
                    ID: {activeThread.questionId}
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F7F9F8]/40">
                  {activeThread.messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[11px] font-semibold text-[#55655F]">
                            {isUser
                              ? isRtl
                                ? 'أنت (هوية مستعارة)'
                                : 'Vous (Anonyme)'
                              : activeThread.expertName}
                          </span>
                          {mounted && (
                            <span className="text-[10px] text-[#7A8A84]">
                              {formatMessageTime(msg.createdAt)}
                            </span>
                          )}
                        </div>

                        <div
                          className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-[0_1px_2px_rgba(16,60,49,0.06)] ${
                            isUser
                              ? 'bg-[#1F7A5E] text-white rounded-br-xs'
                              : 'bg-white text-[#16231E] border border-[#DCE5E0] rounded-bl-xs font-serif-fr'
                          }`}
                        >
                          {msg.text}

                          {mounted && (
                            <div
                              className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                                isUser ? 'text-[#D6EDE3]' : 'text-[#7A8A84]'
                              }`}
                            >
                              <span>{formatMessageTime(msg.createdAt)}</span>
                              {isUser && <CheckCheck className="w-3.5 h-3.5" />}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-[#55655F] bg-white border border-[#DCE5E0] px-3.5 py-2 rounded-2xl w-fit">
                      <div className="w-2 h-2 rounded-full bg-[#1F7A5E] animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-[#1F7A5E] animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-[#1F7A5E] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-[#55655F] font-medium ml-1">
                        {isRtl
                          ? 'الخبير يقوم بالاطلاع والصياغة...'
                          : "Le mufti étudie votre question..."}
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 bg-white border-t border-[#DCE5E0] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      currentRole === 'expert'
                        ? 'Rédiger une réponse officielle en tant que mufti...'
                        : isRtl
                        ? 'اكتب رسالتك أو استفسارك للخبير...'
                        : 'Écrivez votre message ou une précision au mufti...'
                    }
                    className="flex-1 text-xs sm:text-sm rounded-xl bg-[#F7F9F8] border border-[#DCE5E0] px-4 py-2.5 sm:py-3 text-[#16231E] placeholder-[#7A8A84] focus:outline-[#1F7A5E] focus:border-[#1F7A5E] focus:bg-white transition"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#1F7A5E] hover:bg-[#19634D] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm rounded-xl shadow-[0_1px_2px_rgba(16,60,49,0.06)] transition shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isRtl ? 'إرسال' : 'Envoyer'}
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#7A8A84]">
                <MessageSquare className="w-12 h-12 text-[#DCE5E0] mb-3" />
                <h3 className="text-base font-semibold text-[#16231E] mb-1">
                  {isRtl ? 'حدد محادثة للبدء' : 'Sélectionnez une discussion'}
                </h3>
                <p className="text-xs text-[#55655F] max-w-sm">
                  {isRtl
                    ? 'اختر استشارة سابقة من القائمة على اليمين أو اطرح سؤالاً مباشراً على أحد الخبراء'
                    : 'Choisissez une conversation dans la liste ou adressez une question directe à un mufti certifié.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
