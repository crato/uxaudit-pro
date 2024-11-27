import { analysisEngine } from '../services/analysis/engine';
import { AuditSource, AuditType } from '@uxaudit-pro/shared';

async function verifyContrast() {
  try {
    const engine = analysisEngine;
    
    const result = await engine.submitAnalysis({
      source: AuditSource.URL,
      content: 'https://example.com',
      type: AuditType.ACCESSIBILITY,  // Using enum value instead of string
      projectId: 'test'
    });

    console.log('Contrast analysis result:', result);
  } catch (error) {
    console.error('Contrast verification failed:', error);
    process.exit(1);
  }
}

verifyContrast();