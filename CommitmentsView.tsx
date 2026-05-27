/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Decision {
  id: string;
  code: string;
  title: string;
  date: string;
  justification: string;
  alternativesRejected?: string;
  type: 'CRÍTICO' | 'RISCO' | 'CONFORMIDADE';
  divergencesCount?: number;
  impactLevel: 'MÉDIO' | 'ALTO' | 'BAIXO';
  impactProgress: number; // 0-100
  commitmentDuration: string;
  decisor: string;
  auditedAt?: string;
  viewsCount?: number;
  isImmutable: boolean;
  avatars?: string[];
  author: string;
  authorRole: string;
  regulatoryRiskWarning?: string;
}

export interface ActiveCommitment {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'em_andamento' | 'proximo' | 'expirado' | 'agendado' | 'concluido';
  statusLabel: string;
  progress: number;
  timeRemaining: string;
  linkedDecisionId: string;
  linkedDecisionCode: string;
  historyLogs?: string[];
  auditedAt?: string;
}

export interface MarketReport {
  id: string;
  title: string;
  date: string;
  badge: string;
  badgeType: 'alto' | 'info' | 'estavel';
  description: string;
}

export interface AuditLog {
  id: string;
  title: string;
  dateDetail: string;
  description: string;
  locked?: boolean;
}

export interface ArchiveProject {
  id: string;
  title: string;
  sector: string;
  badgeType: 'success' | 'warning' | 'in_progress' | 'failure' | 'verified';
  period: string;
  learnings: string;
  author: string;
  isAnonymized: boolean;
  savedCount: number;
  isSaved?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
}
