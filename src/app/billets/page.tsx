'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import { useApp } from '@/context/AppContext';
import { BookOpen } from 'lucide-react';

export default function BilletsPage() {
  const { t, posts } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFDFB] text-[var(--fg)]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-1.5 border-b border-[#E2E8E4] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[var(--e600)]" />
            <span>{t.posts.title}</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--fg2)]">
            {t.posts.subtitle}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white border border-[#E2E8E4] rounded-2xl p-12 text-center text-sm text-[var(--ink3)]">
            {t.posts.empty}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
