import { Suspense } from 'react';
import { INITIAL_EXPERTS } from '@/lib/store';
import ExpertProfileClient from './ExpertProfileClient';

export function generateStaticParams() {
  return INITIAL_EXPERTS.map((expert) => ({
    id: expert.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ExpertContent({ params }: PageProps) {
  const { id } = await params;
  return <ExpertProfileClient expertId={id} />;
}

export default function ExpertProfilePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--pg)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--e600)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ExpertContent params={params} />
    </Suspense>
  );
}
