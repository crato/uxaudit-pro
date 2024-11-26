// File: packages/backend/src/services/analysis/engine/types.ts
import { AuditSource, AuditType } from '@uxaudit-pro/shared';

export interface ProcessorInput {
  projectId: string;
  source: AuditSource;
  content: string | Buffer;
  type: AuditType;
  options?: Record<string, unknown>;
}

export interface ProcessorResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
}

export interface InputProcessor {
  validate(input: ProcessorInput): Promise<boolean>;
  process(input: ProcessorInput): Promise<ProcessorResult>;
  cleanup?(id: string): Promise<void>;
}

export interface TaskQueue {
  add(task: () => Promise<ProcessorResult>): Promise<string>;
  getStatus(id: string): ProcessorResult | undefined;
}