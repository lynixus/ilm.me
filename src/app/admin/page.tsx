'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ModerationDashboard } from '@/components/ModerationDashboard';

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFDFB] text-[var(--fg)]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModerationDashboard />
      </main>
    </div>
  );
}
