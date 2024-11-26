// File: packages/backend/src/analysis/analyzers/__tests__/color-contrast.test.ts
import { ColorContrastAnalyzer } from '../color-contrast';
import { ProcessorInput } from '../../types/processor';
import { APIError } from '@uxaudit-pro/shared';

describe('ColorContrastAnalyzer', () => {
  let analyzer: ColorContrastAnalyzer;

  beforeEach(() => {
    analyzer = new ColorContrastAnalyzer();
  });

  test('should validate input correctly', async () => {
    const validInput: ProcessorInput = {
      projectId: 'test',
      source: 'url',
      content: 'https://example.com',
      type: 'basic'
    };
    
    expect(await analyzer.validate(validInput)).toBe(true);
  });

  test('should fail validation for empty content', async () => {
    const invalidInput: ProcessorInput = {
      projectId: 'test',
      source: 'url',
      content: '',
      type: 'basic'
    };
    
    await expect(analyzer.validate(invalidInput))
      .rejects
      .toThrow(APIError);
  });

  test('should calculate contrast ratio correctly', async () => {
    // Access private method for testing
    const calculateContrastRatio = (analyzer as any).calculateContrastRatio.bind(analyzer);
    
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    
    const ratio = calculateContrastRatio(white, black);
    expect(ratio).toBeCloseTo(21, 1); // Maximum contrast ratio
  });
});