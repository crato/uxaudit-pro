import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { ColorContrastAnalyzer } from '../services/analysis/analyzers/color-contrast';
import { TextReadabilityAnalyzer } from '../services/analysis/analyzers/text-readability';
import { ComponentSpacingAnalyzer } from '../services/analysis/analyzers/component-spacing';
import { analysisEngine } from '../services/analysis/engine';

async function verifyAnalyzers() {
  try {
    // Use the singleton instance
    const engine = analysisEngine;

    // Use proper AuditType enum value
    const result = await engine.submitAnalysis({
      source: AuditSource.URL,
      content: 'https://example.com',
      type: AuditType.ACCESSIBILITY,  // Using enum value instead of string
      projectId: 'test'
    });

    console.log('Analysis result:', result);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

verifyAnalyzers();