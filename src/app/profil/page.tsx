import { Suspense } from 'react';
import ProfileClient from './ProfileClient';

export const metadata = {
  title: 'Mon Profil & Espace Membre — ilm.me',
  description: 'Gérez votre profil anonyme, vos questions posées, vos experts suivis et vos paramètres sur ilm.me',
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">Chargement de votre profil sécurisé...</p>
          </div>
        </div>
      }
    >
      <ProfileClient />
    </Suspense>
  );
}
