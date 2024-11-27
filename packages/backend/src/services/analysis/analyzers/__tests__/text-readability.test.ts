// File: packages/backend/src/services/analysis/analyzers/__tests__/text-readability.test.ts
import { TextReadabilityAnalyzer } from '../text-readability';
import { ProcessorInput } from '../../engine/types';
import { AuditSource, AuditType } from '@uxaudit-pro/shared';

interface ReadabilityIssue {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  location: string;
  value?: number;
  recommendation?: string;
}

describe('TextReadabilityAnalyzer', () => {
  let analyzer: TextReadabilityAnalyzer;

  beforeEach(() => {
    analyzer = new TextReadabilityAnalyzer();
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

  describe('Font Size Analysis', () => {
    test('should detect small font sizes', async () => {
      const html = `
        <div style="font-size: 10px">Too small text</div>
        <p style="font-size: 16px">Normal text</p>
      `;

      const result = await analyzer.process({
        projectId: 'test',
        source: AuditSource.URL,
        content: html,
        type: AuditType.ACCESSIBILITY
      });

      const fontSizeIssues = result.result.issues.filter(
        (issue: ReadabilityIssue) => issue.type === 'font-size'
      );

      expect(fontSizeIssues).toHaveLength(1);
      expect(fontSizeIssues[0].severity).toBe('critical');
      expect(fontSizeIssues[0].value).toBe(10);
    });
  });

  describe('Heading Hierarchy', () => {
    test('should detect heading hierarchy issues', async () => {
      const html = `
        <h1>Main Title</h1>
        <h3>Skipped H2</h3>
        <h4>Correct Level</h4>
      `;

      const result = await analyzer.process({
        projectId: 'test',
        source: AuditSource.URL,
        content: html,
        type: AuditType.ACCESSIBILITY
      });

      const hierarchyIssues = result.result.issues.filter(
        (issue: ReadabilityIssue) => issue.type === 'heading-hierarchy'
      );

      expect(hierarchyIssues).toHaveLength(1);
      expect(hierarchyIssues[0].severity).toBe('warning');
      expect(hierarchyIssues[0].message).toContain('skips level 2');
    });
  });

  describe('Integration with Analysis Engine', () => {
    test('should process HTML content successfully', async () => {
      const html = `
        <div>
          <h1>Page Title</h1>
          <p style="font-size: 16px">Normal paragraph</p>
          <p style="font-size: 10px">Small text</p>
          <h3>Skipped heading level</h3>
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
      expect(result.result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'font-size' }),
          expect.objectContaining({ type: 'heading-hierarchy' })
        ])
      );
    });
  });
});