// File: packages/backend/src/analysis/analyzers/__tests__/color-contrast-integration.test.ts
import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { AnalysisEngine } from '../../engine/index';
import { ColorContrastAnalyzer } from '../color-contrast';
import { Analysis } from '../../../models/analysis';
import { APIError } from '@uxaudit-pro/shared';

import { InputProcessor, ProcessorInput } from '../../types/processor';

describe('Color Contrast Analyzer Integration', () => {
  let engine: AnalysisEngine;

  beforeAll(async () => {
    // Clear test database
    await Analysis.deleteMany({});
    
    // Initialize analysis engine
    engine = new AnalysisEngine();
    engine.registerProcessor(AuditSource.URL, new ColorContrastAnalyzer());
  });

  test('should process URL and store results', async () => {
    // Test with a known website
    const input: ProcessorInput = {
      projectId: 'test-project',
      source: AuditSource.URL,
      content: 'https://example.com',
      type: AuditType.ACCESSIBILITY
    };

    // Submit analysis
    const result = await engine.submitAnalysis(input);
    expect(result.status).toBe('completed');
    
    // Check database for stored results
    const analysis = await Analysis.findOne({ projectId: input.projectId });
    expect(analysis).toBeTruthy();
    expect(analysis.result.issues).toBeInstanceOf(Array);
  });

  test('should handle multiple concurrent analyses', async () => {
    const inputs: ProcessorInput[] = Array(3).fill(null).map((_, i) => ({
      projectId: `test-project-${i}`,
      source: AuditSource.URL,
      content: 'https://example.com',
      type: AuditType.ACCESSIBILITY
    }));

    // Submit multiple analyses
    const results = await Promise.all(
      inputs.map(input => engine.submitAnalysis(input))
    );

    // Verify all completed
    results.forEach((result: ProcessorResult) => {
      expect(result.status).toBe('completed');
    });

    // Check database for all results
    const analyses = await Analysis.find({
      projectId: { $in: inputs.map(i => i.projectId) }
    });
    expect(analyses).toHaveLength(inputs.length);
  });

  test('should handle errors gracefully', async () => {
    const input: ProcessorInput = {
      projectId: 'test-project-error',
      source: AuditSource.URL,
      content: 'invalid-url',
      type: AuditType.ACCESSIBILITY
    };

    try {
      await engine.submitAnalysis(input);
    } catch (error) {
      expect(error).toBeInstanceOf(APIError);
      expect(error.status).toBe(400);
    }
  });
});