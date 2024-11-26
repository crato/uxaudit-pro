// File: packages/backend/src/services/analysis/analyzers/__tests__/component-spacing.test.ts
import { ComponentSpacingAnalyzer } from '../component-spacing';
import { ProcessorInput } from '../../engine/types';
import { AuditSource, AuditType } from '@uxaudit-pro/shared';

describe('ComponentSpacingAnalyzer', () => {
  let analyzer: ComponentSpacingAnalyzer;

  beforeEach(() => {
    analyzer = new ComponentSpacingAnalyzer();
  });

  describe('Input Validation', () => {
    test('should reject empty content', async () => {
      const input: ProcessorInput = {
        projectId: 'test',
        source: AuditSource.URL,
        content: '',
        type: AuditType.ACCESSIBILITY
      };

      await expect(analyzer.validate(input)).rejects.toThrow('No content provided');
    });
  });

  describe('Spacing Consistency', () => {
    test('should detect non-standard spacing values', async () => {
      const html = `
        <div style="margin: 15px; padding: 7px;">
          Non-standard spacing
        </div>
        <div style="margin: 16px; padding: 8px;">
          Standard spacing
        </div>
      `;

      const result = await analyzer.process({
        projectId: 'test',
        source: AuditSource.URL,
        content: html,
        type: AuditType.ACCESSIBILITY
      });

      const spacingIssues = result.result.issues.filter(
        (issue: any) => issue.type === 'spacing-consistency'
      );

      expect(spacingIssues.length).toBeGreaterThan(0);
      expect(spacingIssues[0].severity).toBe('warning');
      expect(spacingIssues[0].value).toBe(15);
    });
  });

  describe('Alignment', () => {
    test('should detect asymmetric margins', async () => {
      const html = `
        <div style="margin-left: 16px; margin-right: 24px;">
          Asymmetric margins
        </div>
      `;

      const result = await analyzer.process({
        projectId: 'test',
        source: AuditSource.URL,
        content: html,
        type: AuditType.ACCESSIBILITY
      });

      const alignmentIssues = result.result.issues.filter(
        (issue: any) => issue.type === 'alignment'
      );

      expect(alignmentIssues.length).toBe(1);
      expect(alignmentIssues[0].severity).toBe('warning');
      expect(alignmentIssues[0].message).toContain('Asymmetric horizontal margins');
    });
  });

  describe('Integration', () => {
    test('should analyze complex layouts', async () => {
      const html = `
        <div style="margin: 15px; padding: 7px;">
          <div style="margin-left: 16px; margin-right: 24px;">
            Nested element
          </div>
        </div>
      `;

      const result = await analyzer.process({
        projectId: 'test',
        source: AuditSource.URL,
        content: html,
        type: AuditType.ACCESSIBILITY
      });

      expect(result.status).toBe('completed');
      expect(result.result.issues.length).toBeGreaterThan(0);
    });
  });
});