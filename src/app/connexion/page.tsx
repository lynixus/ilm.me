'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useApp } from '@/context/AppContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  User,
  GraduationCap,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/profil';

  const { login, loginWithGoogle } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeAccountLabel, setActiveAccountLabel] = useState('');

  const executeLogin = async (targetEmail: string, targetPassword: string, label?: string) => {
    setLoading(true);
    if (label) setActiveAccountLabel(label);
    await login(targetEmail, targetPassword);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectTarget);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await executeLogin(email, password);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setActiveAccountLabel('Compte Google');
    await loginWithGoogle();
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectTarget);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F8] text-[#16231E]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-lg bg-white border border-[#DCE5E0] rounded-3xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(16,60,49,0.08)] space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A5E]" />
              Authentification sécurisée & confidentielle
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16231E] tracking-tight">
              Connexion à ilm.me
            </h1>
            <p className="text-xs sm:text-sm text-[#55655F]">
              Accédez à vos questions posées, vos réponses et vos échanges directs.
            </p>
          </div>

          {/* Quick Demo Test Accounts Box */}
          <div className="p-4 rounded-2xl bg-[#EEF7F3]/70 border border-[#AEDAC8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#154F3F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1F7A5E]" />
                Comptes de test (Connexion en 1 clic)
              </span>
              <span className="text-[11px] text-[#19634D] font-medium">Démo prête</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Account 1: Normal User */}
              <button
                type="button"
                onClick={() => executeLogin('user@ilm.me', 'demo123', 'Utilisateur Anonyme')}
                disabled={loading}
                className="p-3 text-left rounded-xl bg-white border border-[#DCE5E0] hover:border-[#1F7A5E] hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#EEF7F3] text-[#1F7A5E] flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#16231E] group-hover:text-[#1F7A5E] truncate">
                      Compte Utilisateur
                    </div>
                    <div className="text-[10px] text-[#7A8A84] font-mono">user@ilm.me</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#55655F] leading-tight">
                  Karim Brahimi (alias anonyme). Pose des questions et consulte ses réponses.
                </p>
              </button>

              {/* Account 2: Verified Expert */}
              <button
                type="button"
                onClick={() => executeLogin('expert@ilm.me', 'demo123', 'Expert Vérifié')}
                disabled={loading}
                className="p-3 text-left rounded-xl bg-white border border-[#DCE5E0] hover:border-[#1F7A5E] hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#FBF1D8] text-[#7A5810] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E6CF93]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#16231E] group-hover:text-[#1F7A5E] truncate">
                      Compte Expert (Mufti)
                    </div>
                    <div className="text-[10px] text-[#7A8A84] font-mono">expert@ilm.me</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#55655F] leading-tight">
                  Dr. Benmansour. Répond aux questions sur le fil et en messagerie privée.
                </p>
              </button>
            </div>

            {/* Account 3: Admin */}
            <button
              type="button"
              onClick={() => executeLogin('admin@ilm.me', 'demo123', 'Modérateur Admin')}
              disabled={loading}
              className="w-full p-2.5 flex items-center justify-between rounded-xl bg-white border border-[#DCE5E0] hover:border-[#8A5A00] transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#8A5A00]" />
                <span className="font-semibold text-[#16231E]">Compte Modérateur / Admin</span>
                <code className="text-[10px] text-[#7A8A84] font-mono">admin@ilm.me</code>
              </div>
              <span className="text-[11px] font-semibold text-[#8A5A00]">Tester la modération →</span>
            </button>
          </div>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-[#276B2A] mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-[#16231E]">
                Connexion réussie !
              </h3>
              <p className="text-xs text-[#55655F]">
                Bienvenue {activeAccountLabel ? `(${activeAccountLabel})` : ''}, redirection en cours...
              </p>
            </div>
          ) : (
            <>
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#DCE5E0] bg-white hover:bg-[#F7F9F8] text-sm font-semibold text-[#16231E] shadow-xs transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-[#DCE5E0]" />
                <span className="px-3 text-xs text-[#7A8A84] uppercase tracking-wider font-semibold">
                  ou avec identifiants
                </span>
                <div className="flex-1 border-t border-[#DCE5E0]" />
              </div>

              {/* Standard Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7A8A84] uppercase">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#7A8A84]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DCE5E0] bg-white text-sm text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#7A8A84] uppercase">
                      Mot de passe
                    </label>
                    <a href="#" className="text-xs text-[#1F7A5E] hover:underline">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#7A8A84]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DCE5E0] bg-white text-sm text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] flex items-center justify-center gap-2 cursor-pointer mt-2 transition-colors"
                >
                  <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          <div className="text-center pt-2 border-t border-[#DCE5E0] text-xs text-[#55655F]">
            Pas encore de compte ?{' '}
            <Link
              href={redirectTarget !== '/profil' ? `/inscription?redirect=${encodeURIComponent(redirectTarget)}` : '/inscription'}
              className="text-[#1F7A5E] font-bold hover:underline"
            >
              Créer un compte anonyme
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#1F7A5E] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ConnexionContent />
    </Suspense>
  );
}
