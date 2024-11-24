export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdBy: string;
  status: ProjectStatus;
  settings: {
    allowedDomains?: string[];
    wcagLevel: 'A' | 'AA' | 'AAA';
    customRules?: Record<string, boolean>;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastAuditAt?: Date;
    auditCount: number;
  };
  team: {
    userId: string;
    role: string;
  }[];
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  members: {
    userId: string;
    role: string;
    joinedAt: Date;
  }[];
  settings: {
    allowedDomains?: string[];
    maxProjects: number;
    maxMembers: number;
    features: string[];
  };
  subscription: {
    plan: string;
    seats: number;
    billingInterval: 'monthly' | 'yearly';
  };
}