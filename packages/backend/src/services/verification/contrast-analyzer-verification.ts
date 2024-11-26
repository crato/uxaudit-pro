// File: packages/backend/src/services/verification/contrast-analyzer-verification.ts
import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { AnalysisEngine } from '../analysis/engine';
import { ColorContrastAnalyzer } from '../analysis/analyzers/color-contrast';
import { Analysis } from '../../models/analysis';
import { db } from '../../utils/database';


describe('Color Contrast Analyzer Verification', () => {
  beforeAll(async () => {
    // Use the Database singleton to connect
    await db.connect();
  });

  afterAll(async () => {
    // Properly disconnect after tests
    await db.disconnect();
  });

  it('should analyze color contrast correctly', async () => {
    const analyzer = new ColorContrastAnalyzer();
    const result = await analyzer.process({
      source: AuditSource.URL,
      content: 'https://example.com',
      type: AuditType.ACCESSIBILITY,
      projectId: 'test-project'
    });

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
  });
});