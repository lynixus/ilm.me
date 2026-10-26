'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { useApp } from '@/context/AppContext';
import { Heart, CheckCircle, Share2, BookOpen } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { t, locale, likePost } = useApp();
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      likePost(post.id);
      setLiked(true);
    }
  };

  const isRtlLang = post.lang === 'ar';

  return (
    <article className="card-ilm p-5 sm:p-6 space-y-4">
      {/* Author Header */}
      <div className="flex items-center justify-between border-b border-[var(--pl)] pb-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/experts/${post.expertId}`}
            className="w-10 h-10 rounded-full bg-[var(--e600)] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:opacity-90 transition-opacity"
          >
            {post.expertName.charAt(0)}
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/experts/${post.expertId}`}
                className="text-sm font-bold text-[var(--ink)] hover:text-[var(--e700)] transition-colors"
              >
                {post.expertName}
              </Link>
              <span className="text-[var(--e600)]" title="Expert certifié">
                <CheckCircle className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xs text-[var(--ink2)]">{post.expertTitle}</p>
          </div>
        </div>

        <time
          dateTime={post.createdAt}
          className="text-xs text-[var(--ink3)]"
        >
          {new Date(post.createdAt).toLocaleDateString(
            locale === 'ar' ? 'ar-DZ' : 'fr-FR',
            { day: 'numeric', month: 'short' }
          )}
        </time>
      </div>

      {/* Post Content */}
      <div dir={isRtlLang ? 'rtl' : 'ltr'} className="space-y-2">
        <div className="inline-block text-[11px] font-semibold text-[var(--e800)] bg-[var(--e50)] px-2 py-0.5 rounded-md">
          {post.topic}
        </div>
        <h3 className="text-lg font-bold text-[var(--ink)] tracking-tight">
          {post.title}
        </h3>
        <div
          className={`text-base text-[var(--fg)] leading-relaxed whitespace-pre-line ${
            isRtlLang ? 'font-serif-ar' : 'font-serif-fr'
          }`}
        >
          {post.body}
        </div>
      </div>

      {/* Interactions Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--pl)] text-xs text-[var(--ink3)]">
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            liked
              ? 'bg-rose-50 text-rose-600 font-semibold'
              : 'hover:bg-[var(--ps)] hover:text-[var(--ink)]'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${liked ? 'fill-rose-600 text-rose-600' : ''}`}
          />
          <span>
            {t.posts.likes} ({post.likeCount + (liked ? 1 : 0)})
          </span>
        </button>

        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Lien copié dans le presse-papiers.');
            }
          }}
          className="inline-flex items-center gap-1 text-[var(--ink3)] hover:text-[var(--ink)]"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Partager</span>
        </button>
      </div>
    </article>
  );
}
