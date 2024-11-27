
import { AuditType, AuditSource } from '@uxaudit-pro/shared';

export interface ProcessorInput {
  projectId: string;
  source: AuditSource;
  content: string | Buffer;
  type: AuditType;
  maxSize?: number;
  options?: Record<string, unknown>;
  timeoutMs?: number;
}

export interface ProcessorResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface InputProcessor {
  validate(input: ProcessorInput): Promise<boolean>;
  process(input: ProcessorInput): Promise<ProcessorResult>;
  cleanup?(id: string): Promise<void>;
}