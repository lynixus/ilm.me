import { NextResponse } from 'next/server';
import { INITIAL_POSTS } from '@/lib/store';

export async function GET() {
  const sanitized = INITIAL_POSTS.map((p) => ({
    id: p.id,
    expert_id: p.expertId,
    expert_name: p.expertName,
    expert_title: p.expertTitle,
    title: p.title,
    body: p.body,
    topic: p.topic,
    lang: p.lang,
    like_count: p.likeCount,
    created_at: p.createdAt,
  }));

  return NextResponse.json({
    data: sanitized,
    total: sanitized.length,
  });
}
