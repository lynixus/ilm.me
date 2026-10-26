import { Suspense } from 'react';
import NotificationsClient from './NotificationsClient';

export const metadata = {
  title: 'Notifications — ilm.me',
  description: 'Centre de notifications de vos questions islamiques, réponses d\'experts et messages privés sur ilm.me',
};

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">Chargement des notifications...</p>
          </div>
        </div>
      }
    >
      <NotificationsClient />
    </Suspense>
  );
}
