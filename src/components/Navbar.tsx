'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  MessageSquarePlus,
  Bell,
  MessageCircle,
  BookOpen,
  Users,
  ShieldAlert,
  ChevronDown,
  User,
  Settings,
  LogOut,
  LogIn,
  Menu,
  X,
  Check,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { UserRole } from '@/types';

export function Navbar() {
  const {
    locale,
    setLocale,
    t,
    currentRole,
    setCurrentRole,
    currentUser,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    threads,
    isAuthReady,
  } = useApp();

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userThreads = threads.filter((th) => {
    if (!currentUser) return false;
    if (currentRole === 'expert' || currentUser.role === 'expert') {
      return th.expertId === currentUser.id || th.expertId === 'exp-1';
    }
    return th.authorAlias === currentUser.alias || currentUser.email === 'user@ilm.me';
  });

  const totalUnreadMessages = userThreads.reduce((acc, th) => acc + (th.unreadCount || 0), 0);

  const navLinks = [
    { href: '/', label: locale === 'ar' ? 'الأسئلة' : 'Questions', icon: HelpCircle },
    { href: '/billets', label: locale === 'ar' ? 'مقالات الخبراء' : 'Billets', icon: BookOpen },
    { href: '/experts', label: locale === 'ar' ? 'الخبراء والعلماء' : 'Experts', icon: Users },
  ];

  const roleLabels: Record<UserRole, { short: string; full: string }> = {
    normal_user: { short: 'Utilisateur', full: 'Utilisateur anonyme' },
    expert: { short: 'Expert', full: 'Expert certifié (Mufti)' },
    moderator: { short: 'Modérateur', full: 'Modérateur' },
    admin: { short: 'Admin', full: 'Administrateur' },
  };

  const isStaff = currentRole === 'moderator' || currentRole === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#DCE5E0] shadow-[0_1px_2px_rgba(16,60,49,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Left: Brand Logo from charte */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center hover:opacity-95 transition-opacity">
              <BrandLogo size={36} />
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center justify-center gap-1 flex-1 max-w-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#1F7A5E] bg-[#EEF7F3]'
                      : 'text-[#55655F] hover:text-[#16231E] hover:bg-[#F7F9F8]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Messagerie link only for authenticated members */}
            {isAuthReady && currentUser && (
              <Link
                href="/messagerie"
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname === '/messagerie'
                    ? 'text-[#1F7A5E] bg-[#EEF7F3]'
                    : 'text-[#55655F] hover:text-[#16231E] hover:bg-[#F7F9F8]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{locale === 'ar' ? 'المراسلات' : 'Messagerie'}</span>
                {totalUnreadMessages > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#1F7A5E] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalUnreadMessages}
                  </span>
                )}
              </Link>
            )}

            {/* Moderator link if staff */}
            {isStaff && (
              <Link
                href="/admin"
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold text-[#8A5A00] bg-[#FFF3D6] hover:bg-[#FBF1D8] transition-colors border border-[#EBD08E] flex items-center gap-1.5 ${
                  pathname === '/admin' ? 'ring-2 ring-[#8A5A00]' : ''
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Modération</span>
              </Link>
            )}
          </nav>

          {/* Right: Actions, Language, Auth / Profile CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language toggle pill */}
            <div className="hidden sm:flex items-center border border-[#DCE5E0] rounded-xl p-0.5 bg-[#F7F9F8] text-xs font-semibold select-none">
              <button
                onClick={() => setLocale('fr')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  locale === 'fr'
                    ? 'bg-white text-[#16231E] shadow-xs font-bold'
                    : 'text-[#7A8A84] hover:text-[#16231E]'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLocale('ar')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  locale === 'ar'
                    ? 'bg-white text-[#1F7A5E] shadow-xs font-bold'
                    : 'text-[#7A8A84] hover:text-[#16231E]'
                }`}
                dir="rtl"
              >
                عربية
              </button>
            </div>

            {/* Notifications Bell Dropdown */}
            {isAuthReady && currentUser && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2.5 rounded-xl bg-[#F7F9F8] hover:bg-[#EEF7F3] text-[#16231E] transition-colors border border-[#DCE5E0] cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-[#55655F]" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 end-1 w-2.5 h-2.5 rounded-full bg-[#1F7A5E] ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notifDropdownOpen && (
                  <div className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#DCE5E0] shadow-[0_8px_24px_rgba(16,60,49,0.12)] p-0 z-50 overflow-hidden">
                    <div className="p-4 border-b border-[#DCE5E0] flex items-center justify-between bg-[#F7F9F8]">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#16231E]">
                          Notifications
                        </h3>
                        {unreadNotificationsCount > 0 && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
                            {unreadNotificationsCount} nouvelle(s)
                          </span>
                        )}
                      </div>

                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-[#1F7A5E] hover:underline font-semibold cursor-pointer"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#DCE5E0]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#7A8A84]">
                          Aucune notification
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <Link
                            key={notif.id}
                            href={notif.targetUrl || '/notifications'}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              setNotifDropdownOpen(false);
                            }}
                            className={`block p-3.5 hover:bg-[#F7F9F8] transition-colors ${
                              !notif.read ? 'bg-[#EEF7F3]/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-[#16231E]">
                                {notif.title}
                              </h4>
                              <span className="text-[10px] text-[#7A8A84] shrink-0">
                                {new Date(notif.createdAt).toLocaleDateString(
                                  locale === 'ar' ? 'ar-DZ' : 'fr-FR',
                                  { day: 'numeric', month: 'short' }
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-[#55655F] mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                          </Link>
                        ))
                      )}
                    </div>

                    <Link
                      href="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="block p-3 text-center text-xs font-bold text-[#1F7A5E] hover:bg-[#F7F9F8] border-t border-[#DCE5E0]"
                    >
                      Voir toutes les notifications →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Poser une question button (b1 from charte) */}
            <Link
              href="/poser-une-question"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#1F7A5E] hover:bg-[#19634D] text-white shadow-[0_1px_2px_rgba(16,60,49,0.06)] transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {locale === 'ar' ? 'طرح سؤال' : 'Poser une question'}
              </span>
              <span className="sm:hidden">Poser</span>
            </Link>

            {/* AUTH SECTION: If logged in -> Avatar menu, if not logged in -> Connexion & Inscription */}
            {!isAuthReady ? (
              <div className="w-9 h-9 rounded-full bg-[#F7F9F8] border border-[#DCE5E0] animate-pulse" />
            ) : currentUser ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#AEDAC8] transition-all cursor-pointer"
                  title="Menu de votre compte"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1F7A5E] text-white flex items-center justify-center font-bold text-sm shadow-[0_1px_2px_rgba(16,60,49,0.06)]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7A8A84] hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute end-0 mt-2 w-64 rounded-2xl bg-white border border-[#DCE5E0] shadow-[0_8px_24px_rgba(16,60,49,0.12)] p-2 z-50 space-y-1">
                    {/* User header box */}
                    <div className="p-3 rounded-xl bg-[#F7F9F8] border border-[#DCE5E0]">
                      <div className="text-sm font-bold text-[#16231E]">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-[#55655F] truncate">
                        {currentUser.email}
                      </div>
                      <div className="text-[11px] text-[#1F7A5E] font-semibold mt-1 flex items-center gap-1">
                        <span>Alias :</span>
                        <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#DCE5E0] text-[#16231E]">
                          {currentUser.alias}
                        </code>
                      </div>
                    </div>

                    <Link
                      href="/profil"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#16231E] hover:bg-[#F7F9F8] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#1F7A5E]" />
                      <span>Mon Profil & Questions</span>
                    </Link>

                    <Link
                      href="/messagerie"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#16231E] hover:bg-[#F7F9F8] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#1F7A5E]" />
                      <span>Messagerie directe</span>
                    </Link>

                    <Link
                      href="/profil?tab=settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#16231E] hover:bg-[#F7F9F8] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#7A8A84]" />
                      <span>Paramètres du compte</span>
                    </Link>

                    {/* Role switcher for quick test demo */}
                    <div className="pt-1 border-t border-[#DCE5E0]">
                      <button
                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#55655F] hover:bg-[#F7F9F8] rounded-lg cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Rôle actif : <strong>{roleLabels[currentRole].short}</strong></span>
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {roleDropdownOpen && (
                        <div className="px-3 py-1 space-y-1 bg-[#F7F9F8] rounded-lg mt-1 border border-[#DCE5E0]">
                          {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                            <button
                              key={r}
                              onClick={() => {
                                setCurrentRole(r);
                                setRoleDropdownOpen(false);
                              }}
                              className={`w-full text-start text-[11px] py-1 px-2 rounded flex items-center justify-between ${
                                currentRole === r
                                  ? 'bg-[#1F7A5E] text-white font-bold'
                                  : 'text-[#55655F] hover:bg-white'
                              }`}
                            >
                              <span>{roleLabels[r].full}</span>
                              {currentRole === r && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="pt-1 border-t border-[#DCE5E0]">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#C0392B] hover:bg-[#FCEBE9] transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/connexion"
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#16231E] hover:bg-[#F7F9F8] border border-[#DCE5E0] transition-colors"
                >
                  {locale === 'ar' ? 'دخول' : 'Connexion'}
                </Link>
                <Link
                  href="/inscription"
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#EEF7F3] hover:bg-[#D6EDE3] text-[#154F3F] border border-[#AEDAC8] transition-colors hidden sm:inline-block"
                >
                  {locale === 'ar' ? 'تسجيل' : 'Inscription'}
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-[#DCE5E0] text-[#16231E]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#DCE5E0] py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-xl text-sm font-semibold text-[#16231E] hover:bg-[#F7F9F8]"
              >
                {link.label}
              </Link>
            ))}
            {isAuthReady && currentUser && (
              <Link
                href="/messagerie"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#16231E] hover:bg-[#F7F9F8]"
              >
                <span>{locale === 'ar' ? 'المراسلات المباشرة' : 'Messagerie directe'}</span>
                {totalUnreadMessages > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#1F7A5E] text-white text-xs font-bold flex items-center justify-center">
                    {totalUnreadMessages}
                  </span>
                )}
              </Link>
            )}

            <div className="pt-2 border-t border-[#DCE5E0] flex items-center justify-between px-3">
              <span className="text-xs font-semibold text-[#7A8A84]">Langue</span>
              <div className="flex gap-2 text-xs font-bold">
                <button
                  onClick={() => setLocale('fr')}
                  className={`px-2 py-1 rounded ${locale === 'fr' ? 'bg-[#1F7A5E] text-white' : 'text-[#55655F]'}`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLocale('ar')}
                  className={`px-2 py-1 rounded ${locale === 'ar' ? 'bg-[#1F7A5E] text-white' : 'text-[#55655F]'}`}
                >
                  عربية
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
