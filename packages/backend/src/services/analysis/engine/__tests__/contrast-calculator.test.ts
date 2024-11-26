// File: packages/backend/src/services/analysis/analyzers/__tests__/contrast-calculator.test.ts
import { ContrastCalculator } from './contrast-calculator';

describe('ContrastCalculator', () => {
  const knownContrastPairs = [
    {
      name: 'Black on White',
      color1: '#000000', // Black
      color2: '#FFFFFF', // White
      expectedRatio: 21,
      expectedLevel: 'AAA'
    },
    {
      name: 'White on Gray',
      color1: '#FFFFFF', // White
      color2: '#808080', // Gray
      expectedRatio: 3.95,
      expectedLevel: 'fail'
    },
    {
      name: 'Blue on White',
      color1: '#0000FF', // Blue
      color2: '#FFFFFF', // White
      expectedRatio: 8.59,
      expectedLevel: 'AAA'
    }
  ];

  test.each(knownContrastPairs)(
    '$name should have correct contrast ratio and WCAG level',
    ({ color1, color2, expectedRatio, expectedLevel }) => {
      const rgb1 = ContrastCalculator.hexToRgb(color1);
      const rgb2 = ContrastCalculator.hexToRgb(color2);
      
      const ratio = ContrastCalculator.calculateContrastRatio(rgb1, rgb2);
      expect(ratio).toBeCloseTo(expectedRatio, 1);
      
      const level = ContrastCalculator.getWCAGLevel(ratio);
      expect(level).toBe(expectedLevel);
    }
  );
});

// File: packages/backend/src/services/analysis/analyzers/__tests__/integration.test.ts
import { AnalysisEngine } from '../../engine';
import { ColorContrastAnalyzer } from '../color-contrast';
import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { Analysis } from '../../../../models/analysis';

describe('Color Contrast Analyzer Integration', () => {
  let engine: AnalysisEngine;
  let analyzer: ColorContrastAnalyzer;

  beforeEach(async () => {
    // Clear test database if needed
    if (Analysis) {
      await Analysis.deleteMany({});
    }

    engine = new AnalysisEngine();
    analyzer = new ColorContrastAnalyzer();
    engine.registerProcessor(AuditSource.URL, analyzer);
  });

  test('should analyze sample HTML content', async () => {
    const sampleHtml = `
      <div style="color: #000000; background-color: #FFFFFF">
        <p>Black text on white background</p>
      </div>
      <div style="color: #FFFFFF; background-color: #808080">
        <p>White text on gray background</p>
      </div>
    `;

    const result = await engine.submitAnalysis({
      projectId: 'test-contrast',
      source: AuditSource.URL,
      content: sampleHtml,
      type: AuditType.ACCESSIBILITY
    });

    expect(result.status).toBe('completed');
    expect(result.result.issues).toBeDefined();
    
    // At least one issue should be found (white on gray fails WCAG)
    const failingContrast = result.result.issues.find(
      (issue: any) => issue.type === 'contrast' && issue.severity === 'critical'
    );
    expect(failingContrast).toBeDefined();
  });

  test('should handle multiple analyses concurrently', async () => {
    const inputs = Array(3).fill(null).map((_, i) => ({
      projectId: `test-contrast-${i}`,
      source: AuditSource.URL,
      content: '<div style="color: #000000; background-color: #FFFFFF">Test</div>',
      type: AuditType.ACCESSIBILITY
    }));

    const results = await Promise.all(
      inputs.map(input => engine.submitAnalysis(input))
    );

    results.forEach(result => {
      expect(result.status).toBe('completed');
      expect(result.result.issues).toBeDefined();
    });
  });
});