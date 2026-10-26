export type UserRole = 'normal_user' | 'expert' | 'moderator' | 'admin';

export type QuestionKind = 'feed' | 'direct';

export type QuestionStatus =
  | 'draft'
  | 'pending_moderation'
  | 'sent_to_expert'
  | 'approved'
  | 'answered'
  | 'closed'
  | 'rejected'
  | 'flagged';

export type DirectQuestionStatus =
  | QuestionStatus
  | 'sent_to_expert'
  | 'declined'
  | 'expired';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  alias: string; // The random anonymous alias shown publicly (e.g. alias-7f4a)
  role: UserRole;
  locale: 'fr' | 'ar';
  avatarUrl?: string;
  createdAt: string;
  notificationsEnabled: boolean;
  emailDigestEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'answer' | 'moderation' | 'post' | 'direct_message';
  targetUrl: string;
  read: boolean;
  createdAt: string;
}

export interface DirectMessageThread {
  id: string;
  questionId: string;
  authorAlias?: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  title: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: 'user' | 'expert';
    text: string;
    createdAt: string;
  }[];
}

export interface ExpertProfile {
  id: string;
  accountId: string;
  displayName: string;
  displayNameAr: string;
  title: string;
  titleAr: string;
  bioFr: string;
  bioAr: string;
  city: string;
  wilaya: string;
  photoUrl?: string;
  specialties: string[];
  languages: ('fr' | 'ar')[];
  status: 'pending' | 'active' | 'suspended' | 'revoked';
  acceptsDirect: boolean;
  dailyQuota: number;
  weeklyQuota: number;
  questionsAnsweredCount: number;
  postsCount: number;
  followersCount: number;
  verifiedAt: string;
  credentials: ExpertCredential[];
}

export interface ExpertCredential {
  id: string;
  expertId: string;
  kind: 'degree' | 'ijaza' | 'recommendation' | 'other';
  title: string;
  titleAr: string;
  institution: string;
  year: number;
  validatedAt: string;
}

export interface Question {
  id: string;
  authorAliasId: string; // Anonymous random UUID, strictly disconnected from account_id in content scope
  kind: QuestionKind;
  targetExpertId?: string; // only for 'direct'
  targetExpertName?: string;
  title: string;
  body: string;
  lang: 'fr' | 'ar';
  topic: string;
  status: QuestionStatus;
  moderationReason?: string;
  publishAnswerConsent: boolean;
  helpfulCount: number;
  reportsCount: number;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  body: string;
  sources?: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Post {
  id: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  title: string;
  body: string;
  topic: string;
  lang: 'fr' | 'ar';
  imageUrl?: string;
  likeCount: number;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterAliasId: string;
  targetType: 'question' | 'answer' | 'post' | 'expert';
  targetId: string;
  reason: 'spam' | 'insult' | 'inappropriate' | 'privacy' | 'distress' | 'false_credentials' | 'theological_error' | 'other';
  note?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  previewText?: string;
}

export interface ModerationAuditItem {
  id: string;
  moderatorId: string;
  moderatorName: string;
  targetType: string;
  targetId: string;
  action: 'approved' | 'rejected' | 'hidden' | 'restored' | 'suspended_account' | 'verified_expert';
  reason?: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  slug: string;
  labelFr: string;
  labelAr: string;
  iconName: string;
}
