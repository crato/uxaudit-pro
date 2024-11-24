export enum AuditType {
  BASIC = 'basic',
  COMPREHENSIVE = 'comprehensive',
  CONVERSION = 'conversion',
  ACCESSIBILITY = 'accessibility',
  DESIGN_SYSTEM = 'design_system'
}

export enum AuditSource {
  URL = 'url',
  FIGMA = 'figma',
  IMAGE = 'image',
  PDF = 'pdf'
}

export enum IssueSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  category: string;
  location?: string;
  screenshot?: string;
  recommendations: string[];
  wcagGuideline?: string;
  impact: string;
  effort: string;
  createdAt: Date;
}

export interface AuditResult {
  id: string;
  projectId: string;
  auditType: AuditType;
  source: AuditSource;
  sourceUrl?: string;
  issues: AuditIssue[];
  summary: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
    totalScore: number;
    accessibilityScore?: number;
    usabilityScore?: number;
    performanceScore?: number;
  };
  metadata: {
    startedAt: Date;
    completedAt: Date;
    duration: number;
    analyzedPages?: number;
    totalElements?: number;
  };
}