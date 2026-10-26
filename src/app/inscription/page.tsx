'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useApp } from '@/context/AppContext';
import { Lock, Mail, User, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

function InscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/profil';

  const { register, loginWithGoogle } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    await register(name, email, password);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectTarget);
    }, 800);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectTarget);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F8] text-[#16231E]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white border border-[#DCE5E0] rounded-3xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(16,60,49,0.08)] space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] text-[#154F3F] border border-[#AEDAC8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A5E]" />
              Anonymat garanti par conception
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16231E] tracking-tight">
              Rejoindre ilm.me
            </h1>
            <p className="text-xs sm:text-sm text-[#55655F]">
              Posez vos questions à ceux qui savent. Gardez votre nom.
            </p>
          </div>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-[#276B2A] mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-[#16231E]">
                Compte créé avec succès !
              </h3>
              <p className="text-xs text-[#55655F]">
                Votre pseudonyme anonyme a été généré. Redirection...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleRegister}
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
                <span>S&apos;inscrire avec Google</span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-[#DCE5E0]" />
                <span className="px-3 text-xs text-[#7A8A84] uppercase tracking-wider font-semibold">
                  ou avec un e-mail
                </span>
                <div className="flex-1 border-t border-[#DCE5E0]" />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7A8A84] uppercase">
                  Nom ou Prénom
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#7A8A84]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Karim"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DCE5E0] bg-white text-sm text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-[#55655F]">
                  Votre nom réel ne sera <strong>jamais</strong> communiqué aux savants ou affiché publiquement.
                </p>
              </div>

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
                    placeholder="karim@exemple.com"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#DCE5E0] bg-white text-sm text-[#16231E] focus:ring-2 focus:ring-[#1F7A5E] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7A8A84] uppercase">
                  Mot de passe
                </label>
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

              {/* Privacy notice */}
              <div className="p-3 rounded-xl bg-[#EEF7F3] border border-[#AEDAC8] text-xs text-[#154F3F] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A5E]" />
                  Génération d&apos;alias automatique
                </div>
                <p className="text-[11px] text-[#19634D] leading-relaxed">
                  Dès votre inscription, un alias cryptographique aléatoire (ex: <code>alias-8f2c</code>) vous est attribué. Les experts ne connaissent que cet alias.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#1F7A5E] hover:bg-[#19634D] shadow-[0_1px_2px_rgba(16,60,49,0.06)] flex items-center justify-center gap-2 cursor-pointer mt-2 transition-colors"
              >
                <span>{loading ? 'Création en cours...' : 'Créer mon compte'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-[#DCE5E0] text-xs text-[#55655F]">
            Vous avez déjà un compte ?{' '}
            <Link
              href={redirectTarget !== '/profil' ? `/connexion?redirect=${encodeURIComponent(redirectTarget)}` : '/connexion'}
              className="text-[#1F7A5E] font-bold hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#1F7A5E] border-t-transparent animate-spin" />
        </div>
      }
    >
      <InscriptionContent />
    </Suspense>
  );
}
