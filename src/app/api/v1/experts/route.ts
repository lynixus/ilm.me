import { NextResponse } from 'next/server';
import { INITIAL_EXPERTS } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  let results = INITIAL_EXPERTS.filter((e) => e.status === 'active');

  if (city) {
    results = results.filter((e) => e.city.toLowerCase() === city.toLowerCase());
  }

  // Sanitize: Never expose private account IDs or credentials storage paths
  const sanitized = results.map((e) => ({
    id: e.id,
    display_name: e.displayName,
    display_name_ar: e.displayNameAr,
    title: e.title,
    title_ar: e.titleAr,
    bio_fr: e.bioFr,
    bio_ar: e.bioAr,
    city: e.city,
    wilaya: e.wilaya,
    specialties: e.specialties,
    accepts_direct: e.acceptsDirect,
    questions_answered_count: e.questionsAnsweredCount,
    followers_count: e.followersCount,
    verified_at: e.verifiedAt,
    credentials: e.credentials.map((c) => ({
      kind: c.kind,
      title: c.title,
      title_ar: c.titleAr,
      institution: c.institution,
      year: c.year,
    })),
  }));

  return NextResponse.json({
    data: sanitized,
    total: sanitized.length,
  });
}
