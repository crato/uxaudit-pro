// File: packages/backend/src/analysis/analyzers/types.ts
import { ProcessorInput, ProcessorResult } from '../types/processor';

export interface AnalyzerResult extends ProcessorResult {
  issues: Array<{
    type: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    location?: string;
    value?: number;
    recommendation?: string;
  }>;
}

export interface ColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}