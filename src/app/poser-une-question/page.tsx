import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import AskQuestionForm from './AskQuestionForm';

export default function PoserUneQuestionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--pg)] text-[var(--fg)]">
      <Navbar />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--e600)] border-t-transparent animate-spin" />
            </div>
          }
        >
          <AskQuestionForm />
        </Suspense>
      </main>
    </div>
  );
}
