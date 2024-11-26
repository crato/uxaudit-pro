// Create a test script:
// File: packages/backend/scripts/verify-contrast.ts
import { AnalysisEngine } from '../services/analysis/engine';
import { ColorContrastAnalyzer } from '../services/analysis/analyzers/color-contrast';
import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { ContrastCalculator } from '../services/analysis/analyzers/__tests__/contrast-calculator';
import { ProcessorResult } from '../services/analysis/engine/types';

interface ContrastAnalysisResult extends ProcessorResult {
  result?: {
    issues: Array<{
      type: string;
      severity: 'critical' | 'warning' | 'info';
      message: string;
      location?: string;
      value?: number;
      recommendation?: string;
    }>;
  };
}

async function verifyContrast() {
  console.log('Starting manual contrast verification...\n');

  // 1. First verify direct contrast calculations
  console.log('1. Direct Contrast Calculations:');
  const testCases = [
    { name: 'Black on White', color1: '#000000', color2: '#FFFFFF' },
    { name: 'White on Gray', color1: '#FFFFFF', color2: '#808080' },
    { name: 'Blue on White', color1: '#0000FF', color2: '#FFFFFF' }
  ];

  for (const test of testCases) {
    const rgb1 = ContrastCalculator.hexToRgb(test.color1);
    const rgb2 = ContrastCalculator.hexToRgb(test.color2);
    const ratio = ContrastCalculator.calculateContrastRatio(rgb1, rgb2);
    const level = ContrastCalculator.getWCAGLevel(ratio);

    console.log(`\n${test.name}:`);
    console.log(`- Colors: ${test.color1} on ${test.color2}`);
    console.log(`- Contrast Ratio: ${ratio.toFixed(2)}:1`);
    console.log(`- WCAG Level: ${level}`);
  }

  // 2. Verify engine integration
  console.log('\n2. Engine Integration Test:');
  const engine = new AnalysisEngine();
  const analyzer = new ColorContrastAnalyzer();
  engine.registerProcessor(AuditSource.URL, analyzer);

  const testHtml = `
    <!DOCTYPE html>
    <html>
      <body>
        <div style="color: #000000; background-color: #FFFFFF">
          <p>Black text on white background</p>
        </div>
        <div style="color: #FFFFFF; background-color: #808080">
          <p>White text on gray background (should fail WCAG)</p>
        </div>
        <div style="color: #0000FF; background-color: #FFFFFF">
          <p>Blue text on white background</p>
        </div>
      </body>
    </html>
  `;

  console.log('\nSubmitting HTML for analysis...');
  try {
    const result = await engine.submitAnalysis({
      projectId: 'manual-test',
      source: AuditSource.URL,
      content: testHtml,
      type: AuditType.ACCESSIBILITY
    }) as ContrastAnalysisResult;

    console.log('\nAnalysis Result:');
    console.log(JSON.stringify(result, null, 2));

    if (result.result?.issues && result.result.issues.length > 0) {
      console.log('\nDetected Issues:');
      result.result.issues.forEach((issue, index) => {
        console.log(`\nIssue ${index + 1}:`);
        console.log(`- Type: ${issue.type}`);
        console.log(`- Severity: ${issue.severity}`);
        console.log(`- Message: ${issue.message}`);
        console.log(`- Location: ${issue.location || 'Not specified'}`);
        if (issue.value) console.log(`- Contrast Ratio: ${issue.value}:1`);
        if (issue.recommendation) console.log(`- Recommendation: ${issue.recommendation}`);
      });
    } else {
      console.log('\nNo issues detected. This might indicate that:');
      console.log('1. The analyzer is not properly processing the HTML content');
      console.log('2. The color extraction is not working correctly');
      console.log('3. The contrast calculation logic needs to be checked');
    }
  } catch (error) {
    console.error('Error during analysis:', error);
  }
}

verifyContrast().catch(console.error);