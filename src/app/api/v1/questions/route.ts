import { NextResponse } from 'next/server';
import { INITIAL_QUESTIONS } from '@/lib/store';
import { checkDistressContent } from '@/lib/distressDetection';

// In-memory store for API demonstration (pluggable to PostgreSQL)
let questionsStore = [...INITIAL_QUESTIONS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const kind = searchParams.get('kind');
  const lang = searchParams.get('lang');

  let results = questionsStore.filter(
    (q) => q.status === 'answered' || q.status === 'approved'
  );

  if (topic) {
    results = results.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
  }
  if (kind) {
    results = results.filter((q) => q.kind === kind);
  }
  if (lang) {
    results = results.filter((q) => q.lang === lang);
  }

  // Strict anonymity guarantee: NEVER return author identity, email, or IP
  const sanitized = results.map((q) => ({
    id: q.id,
    author_alias: q.authorAliasId,
    kind: q.kind,
    target_expert_id: q.targetExpertId,
    target_expert_name: q.targetExpertName,
    title: q.title,
    body: q.body,
    lang: q.lang,
    topic: q.topic,
    helpful_count: q.helpfulCount,
    created_at: q.createdAt,
    answers: q.answers.map((a) => ({
      id: a.id,
      expert_id: a.expertId,
      expert_name: a.expertName,
      expert_title: a.expertTitle,
      body: a.body,
      sources: a.sources,
      helpful_count: a.helpfulCount,
      created_at: a.createdAt,
    })),
  }));

  return NextResponse.json({
    data: sanitized,
    total: sanitized.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.body) {
      return NextResponse.json(
        { error: 'Le titre et le corps de la question sont obligatoires.' },
        { status: 400 }
      );
    }

    const isDistress = checkDistressContent(body.title + ' ' + body.body);
    const newId = `q-${Date.now()}`;
    const randomAlias = `alias-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;

    const newQuestion = {
      id: newId,
      authorAliasId: randomAlias,
      kind: body.kind === 'direct' ? ('direct' as const) : ('feed' as const),
      targetExpertId: body.target_expert_id,
      targetExpertName: body.target_expert_name,
      title: body.title,
      body: body.body,
      lang: body.lang === 'ar' ? ('ar' as const) : ('fr' as const),
      topic: body.topic || 'Général',
      status: isDistress ? ('pending_moderation' as const) : ('approved' as const),
      publishAnswerConsent: !!body.publish_consent,
      helpfulCount: 0,
      reportsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answers: [],
    };

    questionsStore.unshift(newQuestion);

    return NextResponse.json(
      {
        message: 'Question enregistrée avec succès.',
        id: newId,
        author_alias: randomAlias,
        distress_detected: isDistress,
        status: newQuestion.status,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête.' },
      { status: 500 }
    );
  }
}
