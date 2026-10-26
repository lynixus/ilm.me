export const DISTRESS_KEYWORDS = [
  // French
  'suicide',
  'suicidaire',
  'en finir',
  'me tuer',
  'envie de mourir',
  'plus envie de vivre',
  'violence conjugale',
  'mari me frappe',
  'femme battue',
  'maltraitance',
  'me faire du mal',
  // Arabic
  'انتحار',
  'أنتحر',
  'أنهي حياتي',
  'أقتل نفسي',
  'الموت أهون',
  'عنف زوجي',
  'ضرب مبرح',
  'اعتداء جسدي',
  'إيذاء النفس',
  'أريد أن أموت',
];

export function checkDistressContent(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return DISTRESS_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}
