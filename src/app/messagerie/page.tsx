import { Suspense } from 'react';
import MessagerieClient from './MessagerieClient';

export const metadata = {
  title: 'Messagerie Directe — ilm.me',
  description: 'Échangez en direct et en toute confidentialité avec des experts et muftis certifiés sur ilm.me',
};

export default function MessageriePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">Chargement de votre messagerie sécurisée...</p>
          </div>
        </div>
      }
    >
      <MessagerieClient />
    </Suspense>
  );
}
